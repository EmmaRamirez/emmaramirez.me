import { AnalyticsEventKind, Prisma } from '$generated/prisma/client';

export const MAX_INGEST_BODY_BYTES = 262_144; // 256 KiB
export const MAX_EVENTS_PER_REQUEST = 64;
export const MAX_SESSION_ID_LENGTH = 128;
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 200;

const MAX_CLIENT_EVENT_ID_LENGTH = 80;
const MAX_NAME_LENGTH = 200;
const MAX_ROUTE_LENGTH = 512;
const MAX_SHORT_STRING = 256;
const MAX_URL_LENGTH = 2048;
const MAX_DETAIL_LENGTH = 4000;
const MAX_TIMESTAMP_SKEW_MS = 5 * 60 * 1000;
const MAX_TIMESTAMP_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_DURATION_MS = 24 * 60 * 60 * 1000;
const MAX_ABS_VALUE = 1e12;

const ALLOWED_RATINGS = new Set(['good', 'needs-improvement', 'poor', 'info']);

export type IncomingAnalyticsEvent = {
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

export type IngestPayload = {
	sessionId?: string;
	events?: IncomingAnalyticsEvent[];
};

type IngestBucket = { count: number; resetAt: number };

const ingestBuckets = new Map<string, IngestBucket>();

function pruneIngestBuckets(now: number) {
	if (ingestBuckets.size < 500) return;
	for (const [key, bucket] of ingestBuckets) {
		if (bucket.resetAt < now) ingestBuckets.delete(key);
	}
}

export function rateLimitIngest(key: string, now: number): boolean {
	pruneIngestBuckets(now);
	const bucket = ingestBuckets.get(key);
	if (!bucket || now > bucket.resetAt) {
		ingestBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}
	if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) return false;
	bucket.count += 1;
	return true;
}

export function isValidSessionId(value: string): boolean {
	if (value.length < 8 || value.length > MAX_SESSION_ID_LENGTH) return false;
	return /^[\w.:+-]+$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseIngestJson(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
	try {
		return { ok: true, value: JSON.parse(text) as unknown };
	} catch {
		return { ok: false, error: 'Invalid JSON body.' };
	}
}

export function coerceIngestPayload(value: unknown): IngestPayload | null {
	if (!isRecord(value)) return null;
	return value as IngestPayload;
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function clampStr(value: unknown, max: number): string | null {
	if (typeof value !== 'string') return null;
	const t = value.trim();
	if (!t) return null;
	return t.length > max ? t.slice(0, max) : t;
}

function requireStr(value: unknown, max: number): string | null {
	const s = clampStr(value, max);
	return s;
}

function asNullableBoolean(value: unknown) {
	return typeof value === 'boolean' ? value : null;
}

function asNullableInt(value: unknown) {
	if (!Number.isInteger(value)) return null;
	const n = Number(value);
	if (n < 100 || n > 999) return null;
	return n;
}

function clampDuration(value: number | null): number | null {
	if (value === null) return null;
	if (value < 0 || value > MAX_DURATION_MS) return null;
	return value;
}

function clampMetricValue(value: number | null): number | null {
	if (value === null) return null;
	if (Math.abs(value) > MAX_ABS_VALUE) return null;
	return value;
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

function parseClientTimestamp(ts: number | undefined, now: number): Date | null {
	if (ts === undefined) return new Date(now);
	if (!Number.isFinite(ts)) return null;
	if (ts > now + MAX_TIMESTAMP_SKEW_MS) return null;
	if (ts < now - MAX_TIMESTAMP_AGE_MS) return null;
	return new Date(ts);
}

function normalizeMethod(value: unknown): string | null {
	const s = clampStr(value, 16);
	if (!s) return null;
	return s.toUpperCase();
}

function normalizeRating(value: unknown): string | null {
	const s = clampStr(value, 32);
	if (!s) return null;
	return ALLOWED_RATINGS.has(s) ? s : null;
}

export function normalizeAnalyticsEvent(
	sessionId: string,
	event: IncomingAnalyticsEvent,
	nowMs: number
): Prisma.AnalyticsEventCreateManyInput | null {
	const kind = mapKind(event.kind);
	const name = requireStr(event.name, MAX_NAME_LENGTH);
	if (!kind || !name) return null;

	const clientEventIdRaw = clampStr(event.id, MAX_CLIENT_EVENT_ID_LENGTH);

	let durationRaw: number | null = null;
	if (isFiniteNumber(event.duration)) durationRaw = event.duration;
	else if (isFiniteNumber(event.startTime)) durationRaw = event.startTime;
	const duration = clampDuration(durationRaw);

	const rawValue = isFiniteNumber(event.value) ? clampMetricValue(event.value) : null;
	const value = kind === AnalyticsEventKind.vital ? rawValue : null;

	const clientTimestamp = parseClientTimestamp(event.timestamp, nowMs);
	if (!clientTimestamp) return null;

	const paintStart = isFiniteNumber(event.startTime) ? event.startTime : null;
	const metadata =
		kind === AnalyticsEventKind.paint && paintStart !== null
			? ({
					startTime: Math.min(Math.max(paintStart, 0), MAX_DURATION_MS)
				} satisfies Prisma.InputJsonObject)
			: null;

	const rating = kind === AnalyticsEventKind.vital ? normalizeRating(event.rating) : null;
	const unit = kind === AnalyticsEventKind.vital ? clampStr(event.unit, 32) : null;

	return {
		clientEventId: clientEventIdRaw,
		sessionId,
		kind,
		name,
		route: clampStr(event.route, MAX_ROUTE_LENGTH),
		source: clampStr(event.source, MAX_SHORT_STRING),
		method: normalizeMethod(event.method),
		url: clampStr(event.url, MAX_URL_LENGTH),
		status: asNullableInt(event.status),
		ok: asNullableBoolean(event.ok),
		duration,
		value,
		unit,
		rating,
		navigationType: clampStr(event.navigationType, MAX_SHORT_STRING),
		fromRoute: clampStr(event.from, MAX_ROUTE_LENGTH),
		detail: clampStr(event.detail, MAX_DETAIL_LENGTH),
		clientTimestamp,
		metadata: metadata ?? Prisma.JsonNull
	};
}

export function dedupeIngestRows(
	rows: Prisma.AnalyticsEventCreateManyInput[]
): Prisma.AnalyticsEventCreateManyInput[] {
	const seen = new Set<string>();
	const out: Prisma.AnalyticsEventCreateManyInput[] = [];
	for (const row of rows) {
		const id = row.clientEventId;
		if (id) {
			if (seen.has(id)) continue;
			seen.add(id);
		}
		out.push(row);
	}
	return out;
}
