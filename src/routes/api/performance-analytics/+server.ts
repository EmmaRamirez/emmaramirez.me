import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import {
	coerceIngestPayload,
	dedupeIngestRows,
	isValidSessionId,
	MAX_EVENTS_PER_REQUEST,
	MAX_INGEST_BODY_BYTES,
	normalizeAnalyticsEvent,
	parseIngestJson,
	rateLimitIngest
} from '$lib/server/performanceAnalyticsIngest';
import { AnalyticsEventKind, Prisma } from '$generated/prisma/client';

type AnalyticsEventDelegate = typeof prisma extends { analyticsEvent: infer Delegate }
	? Delegate
	: never;

function sortByDuration<T extends { duration: number | null }>(items: T[]) {
	return [...items].sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));
}

function average(values: number[]) {
	if (values.length === 0) return 0;
	return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function percentile(values: number[], target: number) {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const index = Math.min(
		sorted.length - 1,
		Math.max(0, Math.ceil((target / 100) * sorted.length) - 1)
	);
	return Math.round(sorted[index] * 10) / 10;
}

function getAnalyticsEventDelegate() {
	return (prisma as typeof prisma & { analyticsEvent?: AnalyticsEventDelegate }).analyticsEvent;
}

function rateLimitClientKey(request: Request, getClientAddress: () => string) {
	const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
	if (forwarded) return `ip:${forwarded}`;
	const realIp = request.headers.get('x-real-ip')?.trim();
	if (realIp) return `ip:${realIp}`;
	try {
		return `ip:${getClientAddress()}`;
	} catch {
		return 'ip:local';
	}
}

async function buildSummary() {
	const delegate = getAnalyticsEventDelegate();
	if (!delegate) {
		return {
			totalPersistedEvents: 0,
			recentEventCount: 0,
			sessionCount: 0,
			lastIngestedAt: null,
			summary: {
				pageCount: 0,
				networkCount: 0,
				networkErrors: 0,
				averagePageDuration: 0,
				averageInteractionDuration: 0,
				averageRenderDuration: 0,
				p95NetworkDuration: 0
			},
			slowestRoutes: [],
			slowestRequests: [],
			slowestInteractions: [],
			slowestRenders: [],
			vitals: [],
			recentEvents: []
		};
	}

	const recentEvents = await delegate.findMany({
		orderBy: { createdAt: 'desc' },
		take: 250
	});

	const pageEvents = recentEvents.filter((event) => event.kind === AnalyticsEventKind.page);
	const networkEvents = recentEvents.filter((event) => event.kind === AnalyticsEventKind.network);
	const interactionEvents = recentEvents.filter(
		(event) => event.kind === AnalyticsEventKind.interaction
	);
	const renderEvents = recentEvents.filter((event) => event.kind === AnalyticsEventKind.render);
	const vitalEvents = recentEvents.filter((event) => event.kind === AnalyticsEventKind.vital);

	return {
		totalPersistedEvents: await delegate.count(),
		recentEventCount: recentEvents.length,
		sessionCount: (
			await delegate.findMany({
				select: { sessionId: true },
				distinct: ['sessionId']
			})
		).length,
		lastIngestedAt: recentEvents[0]?.createdAt.toISOString() ?? null,
		summary: {
			pageCount: pageEvents.length,
			networkCount: networkEvents.length,
			networkErrors: networkEvents.filter((event) => event.ok === false).length,
			averagePageDuration: average(pageEvents.map((event) => event.duration ?? 0).filter(Boolean)),
			averageInteractionDuration: average(
				interactionEvents.map((event) => event.duration ?? 0).filter(Boolean)
			),
			averageRenderDuration: average(
				renderEvents.map((event) => event.duration ?? 0).filter(Boolean)
			),
			p95NetworkDuration: percentile(
				networkEvents.map((event) => event.duration ?? 0).filter(Boolean),
				95
			)
		},
		slowestRoutes: sortByDuration(pageEvents).slice(0, 5),
		slowestRequests: sortByDuration(networkEvents).slice(0, 5),
		slowestInteractions: sortByDuration(interactionEvents).slice(0, 5),
		slowestRenders: sortByDuration(renderEvents).slice(0, 5),
		vitals: vitalEvents.slice(0, 8),
		recentEvents
	};
}

export const GET: RequestHandler = async () => {
	if (!dev) {
		return json(
			{ error: 'Performance analytics persistence is disabled outside development.' },
			{ status: 403 }
		);
	}

	try {
		return json(await buildSummary());
	} catch (error) {
		console.error('[performance-analytics] GET error:', error);
		return json(
			{ error: 'Failed to fetch persisted performance analytics', details: String(error) },
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	if (!dev) {
		return json(
			{ error: 'Performance analytics persistence is disabled outside development.' },
			{ status: 403 }
		);
	}

	try {
		const text = await request.text();
		if (text.length > MAX_INGEST_BODY_BYTES) {
			return json({ error: 'Payload too large.' }, { status: 413 });
		}

		const now = Date.now();
		if (!rateLimitIngest(rateLimitClientKey(request, getClientAddress), now)) {
			return json({ error: 'Too many ingest requests. Try again shortly.' }, { status: 429 });
		}

		const parsed = parseIngestJson(text);
		if (!parsed.ok) {
			return json({ error: parsed.error }, { status: 400 });
		}

		const body = coerceIngestPayload(parsed.value);
		if (!body) {
			return json({ error: 'Invalid payload: expected a JSON object.' }, { status: 400 });
		}

		const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
		if (!isValidSessionId(sessionId)) {
			return json({ error: 'Invalid sessionId.' }, { status: 400 });
		}

		const events = Array.isArray(body.events) ? body.events : [];
		if (events.length === 0) {
			return json(
				{ error: 'Invalid payload: expected sessionId and at least one event.' },
				{ status: 400 }
			);
		}

		if (events.length > MAX_EVENTS_PER_REQUEST) {
			return json(
				{ error: `Too many events (max ${MAX_EVENTS_PER_REQUEST} per request).` },
				{ status: 400 }
			);
		}

		const delegate = getAnalyticsEventDelegate();
		const rawReceived = events.length;

		let rows = events
			.map((event) => normalizeAnalyticsEvent(sessionId, event, now))
			.filter((row): row is Prisma.AnalyticsEventCreateManyInput => row !== null);

		rows = dedupeIngestRows(rows);

		if (rows.length === 0) {
			return json({ ingested: 0, received: rawReceived, accepted: 0 });
		}

		if (!delegate) {
			return json({
				ingested: 0,
				received: rawReceived,
				accepted: rows.length
			});
		}

		const result = await delegate.createMany({
			data: rows,
			skipDuplicates: true
		});

		return json({
			ingested: result.count,
			received: rawReceived,
			accepted: rows.length
		});
	} catch (error) {
		console.error('[performance-analytics] POST error:', error);
		return json(
			{ error: 'Failed to persist performance analytics', details: String(error) },
			{ status: 500 }
		);
	}
};
