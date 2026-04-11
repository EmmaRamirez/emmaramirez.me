import { browser, dev } from '$app/environment';

export type AnalyticsRating = 'good' | 'needs-improvement' | 'poor' | 'info';
export type AnalyticsMeasureKind = 'page' | 'network' | 'interaction' | 'render';
export type NavigationType = 'load' | 'navigate';

export interface PageMetricEvent {
	id: string;
	kind: 'page';
	route: string;
	name: string;
	navigationType: NavigationType;
	duration: number;
	timestamp: number;
	from?: string;
}

export interface NetworkMetricEvent {
	id: string;
	kind: 'network';
	name: string;
	url: string;
	method: string;
	duration: number;
	status: number | null;
	ok: boolean;
	timestamp: number;
	source?: string;
	error?: string;
}

export interface InteractionMetricEvent {
	id: string;
	kind: 'interaction';
	name: string;
	duration: number;
	timestamp: number;
	source?: string;
	detail?: string;
}

export interface RenderMetricEvent {
	id: string;
	kind: 'render';
	name: string;
	duration: number;
	timestamp: number;
	source?: string;
	detail?: string;
}

export interface VitalMetricEvent {
	id: string;
	kind: 'vital';
	name: string;
	value: number;
	unit: 'ms' | 'score';
	rating: AnalyticsRating;
	route: string;
	timestamp: number;
	source?: string;
}

export interface PaintMetricEvent {
	id: string;
	kind: 'paint';
	name: string;
	startTime: number;
	route: string;
	timestamp: number;
}

export type AnalyticsTimelineEvent =
	| PageMetricEvent
	| NetworkMetricEvent
	| InteractionMetricEvent
	| RenderMetricEvent
	| VitalMetricEvent
	| PaintMetricEvent;

export type PersistedAnalyticsEvent = {
	id: string;
	sessionId: string;
	route: string | null;
	kind: string;
	name: string;
	source: string | null;
	method: string | null;
	url: string | null;
	status: number | null;
	ok: boolean | null;
	duration: number | null;
	value: number | null;
	unit: string | null;
	rating: string | null;
	navigationType: string | null;
	fromRoute: string | null;
	detail: string | null;
	clientTimestamp: string;
	createdAt: string;
};

export type PersistedAnalyticsSummary = {
	totalPersistedEvents: number;
	recentEventCount: number;
	sessionCount: number;
	lastIngestedAt: string | null;
	summary: {
		pageCount: number;
		networkCount: number;
		networkErrors: number;
		averagePageDuration: number;
		averageInteractionDuration: number;
		averageRenderDuration: number;
		p95NetworkDuration: number;
	};
	slowestRoutes: PersistedAnalyticsEvent[];
	slowestRequests: PersistedAnalyticsEvent[];
	slowestInteractions: PersistedAnalyticsEvent[];
	slowestRenders: PersistedAnalyticsEvent[];
	vitals: PersistedAnalyticsEvent[];
	recentEvents: PersistedAnalyticsEvent[];
};

export type PersistenceStatus = {
	state: 'idle' | 'syncing' | 'ready' | 'error';
	lastSyncedAt: number | null;
	lastError: string | null;
	pendingCount: number;
};

type AnalyticsState = {
	sessionStartedAt: number;
	currentRoute: string;
	pageEvents: PageMetricEvent[];
	networkEvents: NetworkMetricEvent[];
	interactionEvents: InteractionMetricEvent[];
	renderEvents: RenderMetricEvent[];
	vitalEvents: VitalMetricEvent[];
	paintEvents: PaintMetricEvent[];
};

type MeasureMetadata = {
	route?: string;
	navigationType?: NavigationType;
	from?: string;
	url?: string;
	method?: string;
	status?: number | null;
	ok?: boolean;
	source?: string;
	error?: string;
	detail?: string;
};

type ActiveMeasure = {
	kind: AnalyticsMeasureKind;
	name: string;
	startTime: number;
	meta?: MeasureMetadata;
};

export type TrackedFetchMeta = {
	label?: string;
	source?: string;
	skipTracking?: boolean;
};

const STORAGE_KEY = 'emzinnia:dev-performance-analytics';
const SESSION_KEY = 'emzinnia:dev-performance-session-id';
const MAX_PAGE_EVENTS = 40;
const MAX_NETWORK_EVENTS = 80;
const MAX_INTERACTION_EVENTS = 80;
const MAX_RENDER_EVENTS = 80;
const MAX_VITAL_EVENTS = 40;
const MAX_PAINT_EVENTS = 20;
const FLUSH_BATCH_SIZE = 20;
const FLUSH_DELAY_MS = 2500;

const activeMeasures = new Map<string, ActiveMeasure>();
let isInitialized = false;
let observerCleanup: Array<() => void> = [];
let clsValue = 0;
let sessionId = '';
let persistenceQueue: AnalyticsTimelineEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;
let persistedSummary = $state<PersistedAnalyticsSummary | null>(null);
let persistenceStatus = $state<PersistenceStatus>({
	state: 'idle',
	lastSyncedAt: null,
	lastError: null,
	pendingCount: 0
});

function now() {
	return browser ? performance.now() : 0;
}

function analyticsEnabled() {
	return browser && dev;
}

function createId() {
	if (browser && 'crypto' in window && typeof window.crypto.randomUUID === 'function') {
		return window.crypto.randomUUID();
	}

	return `perf-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createSessionId() {
	if (!analyticsEnabled()) return 'analytics-disabled';

	const existing = sessionStorage.getItem(SESSION_KEY);
	if (existing) return existing;

	const next = createId();
	sessionStorage.setItem(SESSION_KEY, next);
	return next;
}

function createDefaultState(): AnalyticsState {
	return {
		sessionStartedAt: Date.now(),
		currentRoute: '/',
		pageEvents: [],
		networkEvents: [],
		interactionEvents: [],
		renderEvents: [],
		vitalEvents: [],
		paintEvents: []
	};
}

function readStoredState(): AnalyticsState {
	if (!analyticsEnabled()) {
		return createDefaultState();
	}

	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return createDefaultState();
		}

		const parsed = JSON.parse(raw) as Partial<AnalyticsState>;
		return {
			...createDefaultState(),
			...parsed,
			pageEvents: Array.isArray(parsed.pageEvents) ? parsed.pageEvents : [],
			networkEvents: Array.isArray(parsed.networkEvents) ? parsed.networkEvents : [],
			interactionEvents: Array.isArray(parsed.interactionEvents) ? parsed.interactionEvents : [],
			renderEvents: Array.isArray(parsed.renderEvents) ? parsed.renderEvents : [],
			vitalEvents: Array.isArray(parsed.vitalEvents) ? parsed.vitalEvents : [],
			paintEvents: Array.isArray(parsed.paintEvents) ? parsed.paintEvents : []
		};
	} catch (error) {
		console.error('Failed to restore performance analytics session:', error);
		return createDefaultState();
	}
}

let state = $state<AnalyticsState>(readStoredState());

function persistState() {
	if (!analyticsEnabled()) return;

	try {
		sessionStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				sessionStartedAt: state.sessionStartedAt,
				currentRoute: state.currentRoute,
				pageEvents: state.pageEvents,
				networkEvents: state.networkEvents,
				interactionEvents: state.interactionEvents,
				renderEvents: state.renderEvents,
				vitalEvents: state.vitalEvents,
				paintEvents: state.paintEvents
			} satisfies AnalyticsState)
		);
	} catch (error) {
		console.error('Failed to persist performance analytics session:', error);
	}
}

function scheduleFlush() {
	if (!analyticsEnabled() || flushTimeout) return;

	flushTimeout = setTimeout(() => {
		flushTimeout = null;
		void flushPersistedEvents();
	}, FLUSH_DELAY_MS);
}

function toPersistedPayload(event: AnalyticsTimelineEvent) {
	switch (event.kind) {
		case 'page':
			return {
				id: event.id,
				kind: event.kind,
				name: event.name,
				route: event.route,
				navigationType: event.navigationType,
				from: event.from,
				duration: event.duration,
				timestamp: event.timestamp
			};
		case 'network':
			return {
				id: event.id,
				kind: event.kind,
				name: event.name,
				route: getRoute(),
				source: event.source,
				method: event.method,
				url: event.url,
				status: event.status,
				ok: event.ok,
				duration: event.duration,
				detail: event.error,
				timestamp: event.timestamp
			};
		case 'interaction':
		case 'render':
			return {
				id: event.id,
				kind: event.kind,
				name: event.name,
				route: getRoute(),
				source: event.source,
				duration: event.duration,
				detail: event.detail,
				timestamp: event.timestamp
			};
		case 'vital':
			return {
				id: event.id,
				kind: event.kind,
				name: event.name,
				route: event.route,
				source: event.source,
				value: event.value,
				unit: event.unit,
				rating: event.rating,
				timestamp: event.timestamp
			};
		case 'paint':
			return {
				id: event.id,
				kind: event.kind,
				name: event.name,
				route: event.route,
				startTime: event.startTime,
				timestamp: event.timestamp
			};
	}
}

function enqueueForPersistence(event: AnalyticsTimelineEvent) {
	if (!analyticsEnabled()) return;

	persistenceQueue = [...persistenceQueue, event];
	persistenceStatus = {
		...persistenceStatus,
		pendingCount: persistenceQueue.length
	};

	if (persistenceQueue.length >= FLUSH_BATCH_SIZE) {
		void flushPersistedEvents();
		return;
	}

	scheduleFlush();
}

async function readPersistedSummary() {
	if (!analyticsEnabled()) return null;

	const response = await fetch('/api/performance-analytics');
	if (!response.ok) {
		throw new Error(`Summary request failed with ${response.status}`);
	}

	const payload = (await response.json()) as PersistedAnalyticsSummary;
	persistedSummary = payload;
	return payload;
}

async function flushPersistedEvents() {
	if (!analyticsEnabled() || persistenceQueue.length === 0) return;

	if (flushTimeout) {
		clearTimeout(flushTimeout);
		flushTimeout = null;
	}

	const batch = persistenceQueue.slice(0, FLUSH_BATCH_SIZE);
	persistenceStatus = {
		...persistenceStatus,
		state: 'syncing',
		lastError: null,
		pendingCount: persistenceQueue.length
	};

	try {
		const response = await fetch('/api/performance-analytics', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				sessionId,
				events: batch.map(toPersistedPayload)
			})
		});

		if (!response.ok) {
			throw new Error(`Persist request failed with ${response.status}`);
		}

		persistenceQueue = persistenceQueue.slice(batch.length);
		persistenceStatus = {
			state: 'ready',
			lastSyncedAt: Date.now(),
			lastError: null,
			pendingCount: persistenceQueue.length
		};

		await readPersistedSummary();

		if (persistenceQueue.length > 0) {
			scheduleFlush();
		}
	} catch (error) {
		persistenceStatus = {
			...persistenceStatus,
			state: 'error',
			lastError: error instanceof Error ? error.message : String(error),
			pendingCount: persistenceQueue.length
		};
		scheduleFlush();
	}
}

function appendCapped<T>(items: T[], item: T, limit: number) {
	return [...items, item].slice(-limit);
}

function round(value: number, digits = 1) {
	const factor = 10 ** digits;
	return Math.round(value * factor) / factor;
}

function average(values: number[]) {
	if (values.length === 0) return 0;
	return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function percentile(values: number[], target: number) {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((target / 100) * sorted.length) - 1));
	return round(sorted[index]);
}

function sortByDuration<T extends { duration: number }>(entries: T[]) {
	return [...entries].sort((a, b) => b.duration - a.duration);
}

function getRoute() {
	return state.currentRoute || (browser ? window.location.pathname : '/');
}

function upsertVital(event: VitalMetricEvent) {
	const key = `${event.route}:${event.name}`;
	const existingIndex = state.vitalEvents.findIndex(
		(candidate) => `${candidate.route}:${candidate.name}` === key
	);

	if (existingIndex === -1) {
		state.vitalEvents = appendCapped(state.vitalEvents, event, MAX_VITAL_EVENTS);
		persistState();
		enqueueForPersistence(event);
		return;
	}

	const nextVitals = [...state.vitalEvents];
	nextVitals[existingIndex] = event;
	state.vitalEvents = nextVitals;
	persistState();
	enqueueForPersistence(event);
}

function rateVital(name: string, value: number): AnalyticsRating {
	switch (name) {
		case 'TTFB':
			return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
		case 'FCP':
			return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
		case 'LCP':
			return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
		case 'CLS':
			return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
		case 'INP':
			return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
		default:
			return 'info';
	}
}

function recordPageEvent(route: string, duration: number, meta: MeasureMetadata = {}) {
	if (!analyticsEnabled()) return;

	const event: PageMetricEvent = {
		id: createId(),
		kind: 'page',
		route,
		name: meta.navigationType === 'navigate' ? 'Route transition' : 'Initial page load',
		navigationType: meta.navigationType ?? 'navigate',
		duration: round(duration),
		timestamp: Date.now(),
		from: meta.from
	};
	state.pageEvents = appendCapped(state.pageEvents, event, MAX_PAGE_EVENTS);
	persistState();
	enqueueForPersistence(event);
}

function recordNetworkEvent(name: string, duration: number, meta: MeasureMetadata = {}) {
	if (!analyticsEnabled()) return;

	const event: NetworkMetricEvent = {
		id: createId(),
		kind: 'network',
		name,
		url: meta.url ?? name,
		method: meta.method ?? 'GET',
		duration: round(duration),
		status: meta.status ?? null,
		ok: meta.ok ?? false,
		timestamp: Date.now(),
		source: meta.source,
		error: meta.error
	};
	state.networkEvents = appendCapped(state.networkEvents, event, MAX_NETWORK_EVENTS);
	persistState();
	enqueueForPersistence(event);
}

function recordInteractionEvent(name: string, duration: number, meta: MeasureMetadata = {}) {
	if (!analyticsEnabled()) return;

	const event: InteractionMetricEvent = {
		id: createId(),
		kind: 'interaction',
		name,
		duration: round(duration),
		timestamp: Date.now(),
		source: meta.source,
		detail: meta.detail
	};
	state.interactionEvents = appendCapped(state.interactionEvents, event, MAX_INTERACTION_EVENTS);
	persistState();
	enqueueForPersistence(event);
}

function recordRenderEvent(name: string, duration: number, meta: MeasureMetadata = {}) {
	if (!analyticsEnabled()) return;

	const event: RenderMetricEvent = {
		id: createId(),
		kind: 'render',
		name,
		duration: round(duration),
		timestamp: Date.now(),
		source: meta.source,
		detail: meta.detail
	};
	state.renderEvents = appendCapped(state.renderEvents, event, MAX_RENDER_EVENTS);
	persistState();
	enqueueForPersistence(event);
}

function setupObservers() {
	if (!analyticsEnabled() || !('PerformanceObserver' in window)) {
		return;
	}

	const supported = PerformanceObserver.supportedEntryTypes ?? [];
	const cleanup: Array<() => void> = [];

	if (supported.includes('paint')) {
		const paintObserver = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				const event: PaintMetricEvent = {
					id: createId(),
					kind: 'paint',
					name: entry.name,
					startTime: round(entry.startTime),
					route: getRoute(),
					timestamp: Date.now()
				};
				state.paintEvents = appendCapped(state.paintEvents, event, MAX_PAINT_EVENTS);
				enqueueForPersistence(event);
			}
			persistState();
		});
		paintObserver.observe({ type: 'paint', buffered: true });
		cleanup.push(() => paintObserver.disconnect());
	}

	if (supported.includes('largest-contentful-paint')) {
		const lcpObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			const lastEntry = entries.at(-1);
			if (!lastEntry) return;

			upsertVital({
				id: createId(),
				kind: 'vital',
				name: 'LCP',
				value: round(lastEntry.startTime),
				unit: 'ms',
				rating: rateVital('LCP', lastEntry.startTime),
				route: getRoute(),
				timestamp: Date.now(),
				source: 'PerformanceObserver'
			});
		});
		lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
		cleanup.push(() => lcpObserver.disconnect());
	}

	if (supported.includes('layout-shift')) {
		const clsObserver = new PerformanceObserver((list) => {
			for (const entry of list.getEntries() as Array<PerformanceEntry & { value?: number; hadRecentInput?: boolean }>) {
				if (entry.hadRecentInput) continue;
				clsValue += entry.value ?? 0;
			}

			upsertVital({
				id: createId(),
				kind: 'vital',
				name: 'CLS',
				value: round(clsValue, 3),
				unit: 'score',
				rating: rateVital('CLS', clsValue),
				route: getRoute(),
				timestamp: Date.now(),
				source: 'PerformanceObserver'
			});
		});
		clsObserver.observe({ type: 'layout-shift', buffered: true });
		cleanup.push(() => clsObserver.disconnect());
	}

	if (supported.includes('event')) {
		const eventObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries() as Array<PerformanceEntry & { duration: number }>;
			const maxDuration = Math.max(0, ...entries.map((entry) => entry.duration));
			if (maxDuration <= 0) return;

			upsertVital({
				id: createId(),
				kind: 'vital',
				name: 'INP',
				value: round(maxDuration),
				unit: 'ms',
				rating: rateVital('INP', maxDuration),
				route: getRoute(),
				timestamp: Date.now(),
				source: 'PerformanceObserver'
			});
		});
		eventObserver.observe({
			type: 'event',
			buffered: true,
			durationThreshold: 40
		} as PerformanceObserverInit & { durationThreshold: number });
		cleanup.push(() => eventObserver.disconnect());
	}

	observerCleanup = cleanup;
}

export const performanceAnalytics = {
	init() {
		if (!analyticsEnabled() || isInitialized) return;
		isInitialized = true;
		sessionId = createSessionId();
		setupObservers();
		void readPersistedSummary()
			.then(() => {
				persistenceStatus = {
					...persistenceStatus,
					state: 'ready'
				};
			})
			.catch((error) => {
				persistenceStatus = {
					...persistenceStatus,
					state: 'error',
					lastError: error instanceof Error ? error.message : String(error)
				};
			});
	},
	destroy() {
		void flushPersistedEvents();
		for (const cleanup of observerCleanup) {
			cleanup();
		}
		observerCleanup = [];
		isInitialized = false;
	},
	get enabled() {
		return analyticsEnabled();
	},
	get sessionStartedAt() {
		return state.sessionStartedAt;
	},
	get currentRoute() {
		return state.currentRoute;
	},
	get sessionId() {
		return sessionId;
	},
	get pageEvents() {
		return state.pageEvents;
	},
	get networkEvents() {
		return state.networkEvents;
	},
	get interactionEvents() {
		return state.interactionEvents;
	},
	get renderEvents() {
		return state.renderEvents;
	},
	get vitalEvents() {
		return [...state.vitalEvents].sort((a, b) => b.timestamp - a.timestamp);
	},
	get paintEvents() {
		return [...state.paintEvents].sort((a, b) => b.timestamp - a.timestamp);
	},
	get persistedSummary() {
		return persistedSummary;
	},
	get persistenceStatus() {
		return persistenceStatus;
	},
	get timeline() {
		return [
			...state.pageEvents,
			...state.networkEvents,
			...state.interactionEvents,
			...state.renderEvents,
			...state.vitalEvents,
			...state.paintEvents
		].sort((a, b) => b.timestamp - a.timestamp);
	},
	get summary() {
		return {
			totalEvents:
				state.pageEvents.length +
				state.networkEvents.length +
				state.interactionEvents.length +
				state.renderEvents.length +
				state.vitalEvents.length +
				state.paintEvents.length,
			pageCount: state.pageEvents.length,
			networkCount: state.networkEvents.length,
			networkErrors: state.networkEvents.filter((event) => !event.ok).length,
			averagePageDuration: average(state.pageEvents.map((event) => event.duration)),
			averageInteractionDuration: average(state.interactionEvents.map((event) => event.duration)),
			averageRenderDuration: average(state.renderEvents.map((event) => event.duration)),
			p95NetworkDuration: percentile(
				state.networkEvents.map((event) => event.duration),
				95
			)
		};
	},
	get slowestRoutes() {
		return sortByDuration(state.pageEvents).slice(0, 5);
	},
	get slowestRequests() {
		return sortByDuration(state.networkEvents).slice(0, 5);
	},
	get slowestInteractions() {
		return sortByDuration(state.interactionEvents).slice(0, 5);
	},
	get slowestRenders() {
		return sortByDuration(state.renderEvents).slice(0, 5);
	},
	setCurrentRoute(route: string) {
		if (!analyticsEnabled()) return;
		state.currentRoute = route;
		persistState();
	},
	beginMeasure(kind: AnalyticsMeasureKind, name: string, meta?: MeasureMetadata) {
		if (!analyticsEnabled()) return null;

		const id = createId();
		activeMeasures.set(id, {
			kind,
			name,
			startTime: now(),
			meta
		});
		return id;
	},
	endMeasure(id: string | null, meta: MeasureMetadata = {}) {
		if (!analyticsEnabled() || !id) return;

		const measure = activeMeasures.get(id);
		if (!measure) return;
		activeMeasures.delete(id);

		const duration = now() - measure.startTime;
		const mergedMeta = { ...measure.meta, ...meta };

		switch (measure.kind) {
			case 'page':
				recordPageEvent(mergedMeta.route ?? getRoute(), duration, mergedMeta);
				break;
			case 'network':
				recordNetworkEvent(measure.name, duration, mergedMeta);
				break;
			case 'interaction':
				recordInteractionEvent(measure.name, duration, mergedMeta);
				break;
			case 'render':
				recordRenderEvent(measure.name, duration, mergedMeta);
				break;
		}
	},
	recordPageLoad(route: string, duration: number, navigationType: NavigationType, from?: string) {
		recordPageEvent(route, duration, { navigationType, from });
	},
	recordVital(name: string, value: number, unit: 'ms' | 'score', route = getRoute(), source?: string) {
		if (!analyticsEnabled()) return;

		upsertVital({
			id: createId(),
			kind: 'vital',
			name,
			value: round(value, unit === 'score' ? 3 : 1),
			unit,
			rating: rateVital(name, value),
			route,
			timestamp: Date.now(),
			source
		});
	},
	clear() {
		state = {
			...createDefaultState(),
			currentRoute: getRoute()
		};
		clsValue = 0;
		activeMeasures.clear();
		persistenceQueue = [];
		persistedSummary = null;
		persistenceStatus = {
			state: 'idle',
			lastSyncedAt: null,
			lastError: null,
			pendingCount: 0
		};
		persistState();
		void readPersistedSummary().catch(() => {
			// ignore summary reload failures after local clear
		});
	},
	async refreshPersistedSummary() {
		try {
			persistenceStatus = {
				...persistenceStatus,
				state: 'syncing',
				lastError: null
			};
			await readPersistedSummary();
			persistenceStatus = {
				...persistenceStatus,
				state: 'ready',
				lastSyncedAt: persistenceStatus.lastSyncedAt ?? Date.now()
			};
		} catch (error) {
			persistenceStatus = {
				...persistenceStatus,
				state: 'error',
				lastError: error instanceof Error ? error.message : String(error)
			};
		}
	}
};

function getFetchName(input: RequestInfo | URL, label?: string) {
	if (label) return label;
	if (typeof input === 'string') return input;
	if (input instanceof URL) return input.toString();
	return input.url;
}

export async function trackedFetch(input: RequestInfo | URL, init?: RequestInit, meta: TrackedFetchMeta = {}) {
	if (!analyticsEnabled() || meta.skipTracking) {
		return fetch(input, init);
	}

	const method = init?.method?.toUpperCase() ?? 'GET';
	const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
	const measureId = performanceAnalytics.beginMeasure('network', getFetchName(input, meta.label), {
		method,
		url,
		source: meta.source
	});

	try {
		const response = await fetch(input, init);
		performanceAnalytics.endMeasure(measureId, {
			method,
			url,
			source: meta.source,
			status: response.status,
			ok: response.ok
		});
		return response;
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') {
			if (measureId) {
				activeMeasures.delete(measureId);
			}
			throw error;
		}

		performanceAnalytics.endMeasure(measureId, {
			method,
			url,
			source: meta.source,
			status: null,
			ok: false,
			error: error instanceof Error ? error.message : String(error)
		});
		throw error;
	}
}
