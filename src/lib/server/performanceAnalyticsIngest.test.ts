import { AnalyticsEventKind } from '$generated/prisma/client';
import { describe, expect, it } from 'vitest';
import {
	coerceIngestPayload,
	dedupeIngestRows,
	isValidSessionId,
	normalizeAnalyticsEvent,
	parseIngestJson,
	rateLimitIngest,
	RATE_LIMIT_MAX_REQUESTS,
	RATE_LIMIT_WINDOW_MS
} from './performanceAnalyticsIngest';

describe('performanceAnalyticsIngest', () => {
	const now = 1_704_000_000_000; // fixed epoch ms

	it('isValidSessionId rejects short or bad characters', () => {
		expect(isValidSessionId('short')).toBe(false);
		expect(isValidSessionId('bad id')).toBe(false);
		expect(isValidSessionId('')).toBe(false);
		expect(isValidSessionId('valid-session-ok')).toBe(true);
		expect(isValidSessionId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
	});

	it('parseIngestJson handles invalid JSON', () => {
		expect(parseIngestJson('{').ok).toBe(false);
		expect(parseIngestJson('{}').ok).toBe(true);
	});

	it('coerceIngestPayload requires object', () => {
		expect(coerceIngestPayload(null)).toBeNull();
		expect(coerceIngestPayload([])).toBeNull();
		expect(coerceIngestPayload({ sessionId: 'x' })).not.toBeNull();
	});

	it('dedupeIngestRows keeps first row per clientEventId', () => {
		const a = normalizeAnalyticsEvent(
			'session-ok-1',
			{
				id: 'evt-1',
				kind: 'page',
				name: 'Load',
				route: '/',
				duration: 10,
				timestamp: now
			},
			now
		);
		const b = normalizeAnalyticsEvent(
			'session-ok-1',
			{
				id: 'evt-1',
				kind: 'page',
				name: 'Duplicate',
				route: '/x',
				duration: 99,
				timestamp: now
			},
			now
		);
		expect(a && b).toBeTruthy();
		const out = dedupeIngestRows([a!, b!]);
		expect(out).toHaveLength(1);
		expect(out[0].name).toBe('Load');
	});

	it('normalizeAnalyticsEvent drops unknown kind', () => {
		expect(
			normalizeAnalyticsEvent(
				'session-ok-1',
				{ kind: 'unknown', name: 'x', timestamp: now },
				now
			)
		).toBeNull();
	});

	it('normalizeAnalyticsEvent drops skewed timestamp', () => {
		expect(
			normalizeAnalyticsEvent(
				'session-ok-1',
				{
					kind: 'page',
					name: 'Load',
					duration: 1,
					timestamp: now + 10 * 60 * 1000
				},
				now
			)
		).toBeNull();
	});

	it('normalizeAnalyticsEvent accepts page event', () => {
		const row = normalizeAnalyticsEvent(
			'session-ok-1',
			{
				id: 'p1',
				kind: 'page',
				name: 'Route transition',
				route: '/blog',
				navigationType: 'navigate',
				duration: 42,
				timestamp: now
			},
			now
		);
		expect(row).not.toBeNull();
		expect(row!.kind).toBe(AnalyticsEventKind.page);
		expect(row!.clientEventId).toBe('p1');
		expect(row!.rating).toBeNull();
		expect(row!.unit).toBeNull();
	});

	it('normalizeAnalyticsEvent validates vital rating', () => {
		const good = normalizeAnalyticsEvent(
			'session-ok-1',
			{
				id: 'v1',
				kind: 'vital',
				name: 'LCP',
				value: 1200,
				unit: 'ms',
				rating: 'good',
				route: '/',
				timestamp: now
			},
			now
		);
		expect(good?.rating).toBe('good');

		const badRating = normalizeAnalyticsEvent(
			'session-ok-1',
			{
				id: 'v2',
				kind: 'vital',
				name: 'LCP',
				value: 1200,
				unit: 'ms',
				rating: 'nope',
				route: '/',
				timestamp: now
			},
			now
		);
		expect(badRating?.rating).toBeNull();
	});

	it('rateLimitIngest blocks after burst', () => {
		const key = 'test-ip:unit';
		let allowed = 0;
		for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS + 5; i++) {
			if (rateLimitIngest(key, now)) allowed++;
		}
		expect(allowed).toBe(RATE_LIMIT_MAX_REQUESTS);
		expect(rateLimitIngest(key, now + RATE_LIMIT_WINDOW_MS + 1)).toBe(true);
	});
});
