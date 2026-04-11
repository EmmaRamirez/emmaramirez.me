import { expect, test } from '@playwright/test';
import { MAX_EVENTS_PER_REQUEST } from '../src/lib/server/performanceAnalyticsIngest';

test.describe('Performance analytics API', () => {
	test('POST rejects invalid sessionId', async ({ request }) => {
		const response = await request.post('/api/performance-analytics', {
			data: {
				sessionId: 'bad',
				events: [
					{
						kind: 'page',
						name: 'Load',
						duration: 1,
						timestamp: Date.now(),
						route: '/'
					}
				]
			}
		});

		expect(response.status()).toBe(400);
		const data = (await response.json()) as { error?: string };
		expect(data.error).toMatch(/sessionId/i);
	});

	test('POST rejects too many events in one batch', async ({ request }) => {
		const events = Array.from({ length: MAX_EVENTS_PER_REQUEST + 1 }, (_, index) => ({
			kind: 'page',
			name: `Load ${index}`,
			duration: 1,
			timestamp: Date.now(),
			route: '/'
		}));

		const response = await request.post('/api/performance-analytics', {
			data: {
				sessionId: 'pw-valid-sess',
				events
			}
		});

		expect(response.status()).toBe(400);
	});

	test('POST accepts a minimal valid batch', async ({ request }) => {
		const response = await request.post('/api/performance-analytics', {
			data: {
				sessionId: 'pw-valid-sess',
				events: [
					{
						kind: 'page',
						name: 'Route transition',
						route: '/e2e',
						duration: 12,
						timestamp: Date.now()
					}
				]
			}
		});

		expect(response.ok()).toBe(true);
		const data = (await response.json()) as {
			ingested?: number;
			received?: number;
			accepted?: number;
		};
		expect(data.received).toBe(1);
		expect(data.accepted).toBe(1);
		expect(typeof data.ingested).toBe('number');
	});
});
