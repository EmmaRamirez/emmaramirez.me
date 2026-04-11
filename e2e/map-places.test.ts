import { expect, test } from '@playwright/test';
import { mapRegionById } from '../src/lib/data/mapRegions';

const storageKey = 'emzinnia:user-settings';

function uniqueVisitorName(prefix: string) {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

test.describe('Map Places API', () => {
	test('POST /api/map-places saves a centroid-derived place', async ({ request }) => {
		const visitorName = uniqueVisitorName('api-visitor');
		const region = mapRegionById.get('US-CO');
		expect(region).toBeDefined();

		const response = await request.post('/api/map-places', {
			data: {
				name: visitorName,
				regionId: 'US-CO'
			}
		});

		expect(response.status()).toBe(201);

		const data = (await response.json()) as {
			place: {
				name: string;
				regionId: string;
				regionName: string;
				latitude: number;
				longitude: number;
				status: string;
			};
		};

		expect(data.place.name).toBe(visitorName);
		expect(data.place.regionId).toBe('US-CO');
		expect(data.place.regionName).toBe('Colorado');
		expect(data.place.status).toBe('visible');
		expect(data.place.latitude).toBe(region?.centroid.lat);
		expect(data.place.longitude).toBe(region?.centroid.lng);
	});

	test('POST /api/map-places rejects invalid payloads', async ({ request }) => {
		const response = await request.post('/api/map-places', {
			data: {
				name: '',
				regionId: 'not-a-real-region'
			}
		});

		expect(response.status()).toBe(400);

		const data = await response.json();
		expect(data).toHaveProperty('error');
	});
});

test.describe('Visitor review surfaces', () => {
	test('editor visitors section lists persisted submissions', async ({ page, request }) => {
		const visitorName = uniqueVisitorName('editor-visitor');

		await request.post('/api/map-places', {
			data: {
				name: visitorName,
				regionId: 'CA-BC'
			}
		});

		await page.goto('/editor');
		await page.locator('nav[aria-label="Editor sections"]').getByRole('button', { name: 'Visitors' }).click();

		await expect(page.getByRole('heading', { name: 'Visitors' })).toBeVisible();
		const visitorRow = page.getByRole('row').filter({ hasText: visitorName });
		await expect(visitorRow).toBeVisible();
		await expect(visitorRow).toContainText('British Columbia');
	});

	test('homepage visitor form submits and persists a new place', async ({ page, request }) => {
		const visitorName = uniqueVisitorName('homepage-visitor');

		await page.addInitScript((key) => {
			localStorage.setItem(
				key,
				JSON.stringify({
					showSections: true,
					theme: 'light'
				})
			);
		}, storageKey);

		await page.goto('/');

		await page.getByLabel('State or province').selectOption('US-WA');
		await page.getByLabel('Your name').fill(visitorName);
		await page.getByRole('button', { name: 'Add My Place' }).click();

		await expect(page.getByText(`Added ${visitorName} to Washington.`)).toBeVisible();

		const response = await request.get('/api/map-places');
		expect(response.ok()).toBe(true);

		const data = (await response.json()) as {
			places: Array<{ name: string; regionId: string }>;
		};

		expect(data.places).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: visitorName,
					regionId: 'US-WA'
				})
			])
		);
	});
});
