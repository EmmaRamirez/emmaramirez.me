import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { AnalyticsEventKind, Prisma } from '$generated/prisma/client';

type IncomingEvent = {
	id?: string;
	kind?: string;
	name?: string;
	route?: string;
	source?: string;
	method?: string;
	url?: string;
	status?: number | null;
	ok?: boolean;
	duration?: number;
	value?: number;
	unit?: string;
	rating?: string;
	navigationType?: string;
	from?: string;
	detail?: string;
	timestamp?: number;
	startTime?: number;
};

type IngestPayload = {
	sessionId?: string;
	events?: IncomingEvent[];
};

type AnalyticsEventDelegate = typeof prisma extends { analyticsEvent: infer Delegate }
	? Delegate
	: never;

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function asNullableString(value: unknown) {
	return typeof value === 'string' && value.length > 0 ? value : null;
}

function asNullableBoolean(value: unknown) {
	return typeof value === 'boolean' ? value : null;
}

function asNullableInt(value: unknown) {
	return Number.isInteger(value) ? Number(value) : null;
}

function mapKind(kind: string | undefined) {
	switch (kind) {
		case 'page':
			return AnalyticsEventKind.page;
		case 'network':
			return AnalyticsEventKind.network;
		case 'interaction':
			return AnalyticsEventKind.interaction;
		case 'render':
			return AnalyticsEventKind.render;
		case 'vital':
			return AnalyticsEventKind.vital;
		case 'paint':
			return AnalyticsEventKind.paint;
		default:
			return null;
	}
}

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

function normalizeEvent(
	sessionId: string,
	event: IncomingEvent
): Prisma.AnalyticsEventCreateManyInput | null {
	const kind = mapKind(event.kind);
	const name = typeof event.name === 'string' ? event.name.trim() : '';
	if (!kind || !name) return null;

	const duration = isFiniteNumber(event.duration)
		? event.duration
		: isFiniteNumber(event.startTime)
			? event.startTime
			: null;
	const value = isFiniteNumber(event.value) ? event.value : null;
	const timestamp = isFiniteNumber(event.timestamp) ? event.timestamp : Date.now();
	const metadata =
		kind === AnalyticsEventKind.paint && isFiniteNumber(event.startTime)
			? ({ startTime: event.startTime } satisfies Prisma.InputJsonObject)
			: null;

	return {
		clientEventId: asNullableString(event.id),
		sessionId,
		kind,
		name,
		route: asNullableString(event.route),
		source: asNullableString(event.source),
		method: asNullableString(event.method),
		url: asNullableString(event.url),
		status: asNullableInt(event.status),
		ok: asNullableBoolean(event.ok),
		duration,
		value,
		unit: asNullableString(event.unit),
		rating: asNullableString(event.rating),
		navigationType: asNullableString(event.navigationType),
		fromRoute: asNullableString(event.from),
		detail: asNullableString(event.detail),
		clientTimestamp: new Date(timestamp),
		metadata: metadata ?? Prisma.JsonNull
	};
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

export const GET = async () => {
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

export const POST = async ({ request }) => {
	if (!dev) {
		return json(
			{ error: 'Performance analytics persistence is disabled outside development.' },
			{ status: 403 }
		);
	}

	try {
		const body = (await request.json()) as IngestPayload;
		const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
		const events = Array.isArray(body.events) ? body.events : [];
		const delegate = getAnalyticsEventDelegate();

		if (!sessionId || events.length === 0) {
			return json(
				{ error: 'Invalid payload: expected sessionId and at least one event.' },
				{ status: 400 }
			);
		}

		const rows = events
			.map((event) => normalizeEvent(sessionId, event))
			.filter((event): event is Prisma.AnalyticsEventCreateManyInput => event !== null);

		if (rows.length === 0) {
			return json({ ingested: 0 });
		}

		if (!delegate) {
			return json({
				ingested: 0,
				received: rows.length
			});
		}

		const result = await delegate.createMany({
			data: rows,
			skipDuplicates: true
		});

		return json({
			ingested: result.count,
			received: rows.length
		});
	} catch (error) {
		console.error('[performance-analytics] POST error:', error);
		return json(
			{ error: 'Failed to persist performance analytics', details: String(error) },
			{ status: 500 }
		);
	}
};
