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
			expect(data.settings).toHaveProperty('discoParams');
		}
	});

	test('PUT /api/debug-settings saves and returns updated settings', async ({ request }) => {
		const testPayload = {
			headerBlendMode: 'multiply',
			showSectionsEnabled: true,
			hero3dParams: {
				revealRadius: 0.4,
				revealSoftness: 0.09,
				revealOpacity: 0.88,
				idleReveal: 0.05,
				cursorDamping: 4.5,
				revealDamping: 3.8,
				parallaxStrength: 0.07,
				tiltStrength: 0.1,
				liftStrength: 0.14,
				rippleStrength: 0.42,
				rippleFrequency: 0.82,
				rippleSpeed: 0.74,
				rippleDecay: 2.4,
				bounceStrength: 0.38,
				bounceFrequency: 1.1,
				bounceDecay: 5.2,
				fadeStrength: 0.32,
				fadeSoftness: 0.58,
				glowStrength: 0.36,
				glowRadius: 0.16,
				chromaStrength: 0.18,
				grainStrength: 0.11,
				grainScale: 92
			},
			discoParams: {
				sampleHistorySize: 16,
				minBeams: 80,
				maxBeams: 900,
				clickBeamCount: 500,
				clickBaseVolatility: 0.75,
				volatilitySmoothing: 0.18,
				volatilityDecay: 0.9
			}
		};

		const putResponse = await request.put('/api/debug-settings', {
			data: testPayload
		});

		expect(putResponse.ok()).toBe(true);

		const putData = await putResponse.json();
		expect(putData.settings).toHaveProperty('headerBlendMode', 'multiply');
		expect(putData.settings).toHaveProperty('showSectionsEnabled', true);
		expect(putData.settings.hero3dParams).toHaveProperty('revealRadius', 0.4);
		expect(putData.settings.hero3dParams).toHaveProperty('glowStrength', 0.36);
		expect(putData.settings.discoParams).toHaveProperty('sampleHistorySize', 16);
		expect(putData.settings.discoParams).toHaveProperty('maxBeams', 900);

		// Verify the settings were actually saved by fetching them again
		const getResponse = await request.get('/api/debug-settings');
		const getData = await getResponse.json();

		expect(getData.settings.headerBlendMode).toBe('multiply');
		expect(getData.settings.hero3dParams.revealRadius).toBe(0.4);
		expect(getData.settings.discoParams.sampleHistorySize).toBe(16);
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
			hero3dParams: { revealRadius: 0.1 }
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
				revealRadius: 0.55,
				revealSoftness: 0.1,
				revealOpacity: 0.9,
				idleReveal: 0.02,
				cursorDamping: 5,
				revealDamping: 3.5,
				parallaxStrength: 0.08,
				tiltStrength: 0.11,
				liftStrength: 0.16,
				rippleStrength: 0.45,
				rippleFrequency: 0.88,
				rippleSpeed: 0.78,
				rippleDecay: 2.6,
				bounceStrength: 0.4,
				bounceFrequency: 1.0,
				bounceDecay: 5,
				fadeStrength: 0.35,
				fadeSoftness: 0.62,
				glowStrength: 0.4,
				glowRadius: 0.15,
				chromaStrength: 0.2,
				grainStrength: 0.14,
				grainScale: 104
			},
			discoParams: {
				sampleHistorySize: 14,
				minBeams: 70,
				maxBeams: 860,
				clickBeamCount: 480,
				clickBaseVolatility: 0.72,
				volatilitySmoothing: 0.16,
				volatilityDecay: 0.91
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

		// Find and interact with the first hero effect slider
		const firstHeroSlider = page.locator('input[type="range"]').first();
		await expect(firstHeroSlider).toBeVisible();

		// Set up request interception to track API calls
		const putRequests: string[] = [];
		page.on('request', (request) => {
			if (request.url().includes('/api/debug-settings') && request.method() === 'PUT') {
				putRequests.push(request.url());
			}
		});

		// Get the current value and change it
		const currentValue = await firstHeroSlider.inputValue();
		const newValue = parseFloat(currentValue) + 0.05;

		// Change the slider value
		await firstHeroSlider.fill(String(newValue));

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
				revealRadius: 0.65,
				revealSoftness: 0.12,
				revealOpacity: 0.94,
				idleReveal: 0.04,
				cursorDamping: 4.8,
				revealDamping: 3.9,
				parallaxStrength: 0.09,
				tiltStrength: 0.12,
				liftStrength: 0.18,
				rippleStrength: 0.48,
				rippleFrequency: 0.92,
				rippleSpeed: 0.82,
				rippleDecay: 2.2,
				bounceStrength: 0.44,
				bounceFrequency: 1.05,
				bounceDecay: 4.7,
				fadeStrength: 0.38,
				fadeSoftness: 0.66,
				glowStrength: 0.42,
				glowRadius: 0.18,
				chromaStrength: 0.22,
				grainStrength: 0.16,
				grainScale: 96
			},
			discoParams: {
				sampleHistorySize: 18,
				minBeams: 90,
				maxBeams: 980,
				clickBeamCount: 560,
				clickBaseVolatility: 0.78,
				volatilitySmoothing: 0.19,
				volatilityDecay: 0.89
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
