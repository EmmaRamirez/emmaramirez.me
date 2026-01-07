import { expect, test } from '@playwright/test';

test.describe('Debug Settings API', () => {
	test('GET /api/debug-settings returns settings object', async ({ request }) => {
		const response = await request.get('/api/debug-settings');

		expect(response.ok()).toBe(true);

		const data = await response.json();
		expect(data).toHaveProperty('settings');

		// Settings can be null if no settings exist yet
		if (data.settings !== null) {
			expect(data.settings).toHaveProperty('headerBlendMode');
			expect(data.settings).toHaveProperty('showSectionsEnabled');
			expect(data.settings).toHaveProperty('hero3dParams');
		}
	});

	test('PUT /api/debug-settings saves and returns updated settings', async ({ request }) => {
		const testPayload = {
			headerBlendMode: 'multiply',
			showSectionsEnabled: true,
			hero3dParams: {
				depthScale: 0.15,
				revealRadius: 0.4,
				parallaxXY: 0.1,
				parallaxZ: 0.25,
				splatStretch: 2.0,
				splatCompress: 0.5,
				depthBulge: 0.3,
				contourOffset: 0.4,
				blobAmplitude: 0.025,
				noiseAmplitude: 0.035,
				contourInfluence: 0.5,
				edgeSoftness: 0.05,
				saturationBoost: 1.1,
				contrastBoost: 1.0
			}
		};

		const putResponse = await request.put('/api/debug-settings', {
			data: testPayload
		});

		expect(putResponse.ok()).toBe(true);

		const putData = await putResponse.json();
		expect(putData.settings).toHaveProperty('headerBlendMode', 'multiply');
		expect(putData.settings).toHaveProperty('showSectionsEnabled', true);
		expect(putData.settings.hero3dParams).toHaveProperty('depthScale', 0.15);
		expect(putData.settings.hero3dParams).toHaveProperty('revealRadius', 0.4);

		// Verify the settings were actually saved by fetching them again
		const getResponse = await request.get('/api/debug-settings');
		const getData = await getResponse.json();

		expect(getData.settings.headerBlendMode).toBe('multiply');
		expect(getData.settings.hero3dParams.depthScale).toBe(0.15);
	});

	test('PUT /api/debug-settings returns 400 for invalid payload', async ({ request }) => {
		// Missing hero3dParams
		const invalidPayload1 = {
			headerBlendMode: 'normal',
			showSectionsEnabled: false
		};

		const response1 = await request.put('/api/debug-settings', {
			data: invalidPayload1
		});

		expect(response1.status()).toBe(400);

		const data1 = await response1.json();
		expect(data1).toHaveProperty('error');

		// Missing headerBlendMode
		const invalidPayload2 = {
			showSectionsEnabled: false,
			hero3dParams: { depthScale: 0.1 }
		};

		const response2 = await request.put('/api/debug-settings', {
			data: invalidPayload2
		});

		expect(response2.status()).toBe(400);
	});
});

test.describe('Debug Menu UI', () => {
	test('debug menu opens when pressing D key', async ({ page }) => {
		await page.goto('/');

		// Ensure the debug menu is not visible initially
		await expect(page.locator('dialog[aria-label*="Debug"]')).not.toBeVisible();

		// Press D to open debug menu
		await page.keyboard.press('d');

		// The debug menu should now be visible
		await expect(page.locator('dialog')).toBeVisible();
		await expect(page.getByRole('heading', { name: /Debug Menu/i })).toBeVisible();
	});

	test('debug menu loads saved settings from API', async ({ page, request }) => {
		// First, save some specific settings via API
		const testSettings = {
			headerBlendMode: 'screen',
			showSectionsEnabled: false,
			hero3dParams: {
				depthScale: 0.22,
				revealRadius: 0.55,
				parallaxXY: 0.18,
				parallaxZ: 0.35,
				splatStretch: 3.0,
				splatCompress: 0.7,
				depthBulge: 0.4,
				contourOffset: 0.6,
				blobAmplitude: 0.04,
				noiseAmplitude: 0.05,
				contourInfluence: 0.7,
				edgeSoftness: 0.08,
				saturationBoost: 1.2,
				contrastBoost: 1.1
			}
		};

		await request.put('/api/debug-settings', { data: testSettings });

		// Navigate to the page and open the debug menu
		await page.goto('/');
		await page.keyboard.press('d');

		// Wait for the debug menu to be visible
		await expect(page.locator('dialog')).toBeVisible();

		// Check that the header blend mode dropdown has the correct value selected
		const blendModeSelect = page.getByRole('combobox', { name: /Header Image Blend Mode/i });
		await expect(blendModeSelect).toHaveValue('screen');
	});

	test('changes to sliders trigger save requests', async ({ page }) => {
		await page.goto('/');

		// Open debug menu
		await page.keyboard.press('d');
		await expect(page.locator('dialog')).toBeVisible();

		// Find and interact with a slider (e.g., Depth Scale)
		const depthScaleSlider = page.locator('input[type="range"]').first();
		await expect(depthScaleSlider).toBeVisible();

		// Set up request interception to track API calls
		const putRequests: string[] = [];
		page.on('request', (request) => {
			if (request.url().includes('/api/debug-settings') && request.method() === 'PUT') {
				putRequests.push(request.url());
			}
		});

		// Get the current value and change it
		const currentValue = await depthScaleSlider.inputValue();
		const newValue = parseFloat(currentValue) + 0.05;

		// Change the slider value
		await depthScaleSlider.fill(String(newValue));

		// Wait for the debounced save to complete (500ms debounce + buffer)
		await page.waitForTimeout(700);

		// Verify that a PUT request was made
		expect(putRequests.length).toBeGreaterThan(0);
	});

	test('settings persist after page reload', async ({ page, request }) => {
		// Save initial settings
		const initialSettings = {
			headerBlendMode: 'overlay',
			showSectionsEnabled: true,
			hero3dParams: {
				depthScale: 0.33,
				revealRadius: 0.65,
				parallaxXY: 0.2,
				parallaxZ: 0.4,
				splatStretch: 2.5,
				splatCompress: 0.65,
				depthBulge: 0.38,
				contourOffset: 0.55,
				blobAmplitude: 0.035,
				noiseAmplitude: 0.045,
				contourInfluence: 0.65,
				edgeSoftness: 0.07,
				saturationBoost: 1.18,
				contrastBoost: 1.08
			}
		};

		await request.put('/api/debug-settings', { data: initialSettings });

		// Navigate to the page
		await page.goto('/');

		// Open debug menu and verify settings are loaded
		await page.keyboard.press('d');
		await expect(page.locator('dialog')).toBeVisible();

		const blendModeSelect = page.getByRole('combobox', { name: /Header Image Blend Mode/i });
		await expect(blendModeSelect).toHaveValue('overlay');

		// Close the dialog and reload the page
		await page.keyboard.press('Escape');
		await page.reload();

		// Open debug menu again
		await page.keyboard.press('d');
		await expect(page.locator('dialog')).toBeVisible();

		// Verify settings are still the same
		const blendModeSelectAfterReload = page.getByRole('combobox', {
			name: /Header Image Blend Mode/i
		});
		await expect(blendModeSelectAfterReload).toHaveValue('overlay');
	});
});

