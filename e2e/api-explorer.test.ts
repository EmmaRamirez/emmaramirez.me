import { expect, test } from '@playwright/test';

// Helper to ensure sections are visible before running tests
async function enableSections(page: typeof import('@playwright/test').Page.prototype) {
	// Set localStorage to enable sections before the page fully loads
	await page.evaluate(() => {
		localStorage.setItem('debug-show-sections', 'true');
	});

	// Reload to apply the localStorage setting
	await page.reload();

	// Wait for the page to be ready
	await page.waitForLoadState('networkidle');
}

test.describe('API Explorer Block', () => {
	test.describe('Collapsed State', () => {
		test('should display API Explorer ad block on homepage', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);

			// Scroll to find the API Explorer block
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await expect(apiExplorerAd).toBeVisible({ timeout: 10000 });
		});

		test('should show "Open Explorer" CTA', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const openExplorerText = page.getByText('Open Explorer');
			await expect(openExplorerText).toBeVisible({ timeout: 10000 });
		});

		test('should show description text', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const description = page.getByText("Discover and test the site's internal API endpoints.");
			await expect(description).toBeVisible({ timeout: 10000 });
		});
	});

	test.describe('Expanding the Explorer', () => {
		test('should expand when clicking the ad', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			// Find and click the API Explorer ad
			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			// Should now show the expanded explorer
			const explorerRegion = page.getByRole('region', { name: /API Explorer/i });
			await expect(explorerRegion).toBeVisible();
		});

		test('should show tabs when expanded', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			await expect(page.getByRole('tab', { name: 'Endpoints' })).toBeVisible();
			await expect(page.getByRole('tab', { name: 'Try It' })).toBeVisible();
			await expect(page.getByRole('tab', { name: 'Schemas' })).toBeVisible();
		});

		test('should show close button when expanded', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			const closeButton = page.getByRole('button', { name: /Close API explorer/i });
			await expect(closeButton).toBeVisible();
		});
	});

	test.describe('Endpoints Tab', () => {
		test('should display endpoints list', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			await expect(page.getByText('Available API endpoints on this site.')).toBeVisible();
		});

		test('should show GET endpoint for debug-settings', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			await expect(page.getByText('GET').first()).toBeVisible();
			await expect(
				page.getByText('Fetch current debug settings including hero and disco parameters')
			).toBeVisible();
		});

		test('should show PUT endpoint for debug-settings', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			await expect(page.getByText('PUT')).toBeVisible();
			await expect(page.getByText('Update debug settings with new values')).toBeVisible();
		});
	});

	test.describe('Try It Tab', () => {
		test('should switch to Try It tab when clicking an endpoint', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			// Click on the GET endpoint
			const endpointButton = page
				.locator('button')
				.filter({ hasText: 'Fetch current debug settings' });
			await endpointButton.click();

			// Try It tab should now be selected
			const tryItTab = page.getByRole('tab', { name: 'Try It' });
			await expect(tryItTab).toHaveAttribute('aria-selected', 'true');
		});

		test('should populate endpoint input with selected endpoint', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			// Click on the GET endpoint
			const endpointButton = page
				.locator('button')
				.filter({ hasText: 'Fetch current debug settings' });
			await endpointButton.click();

			// The input should be populated
			const endpointInput = page.getByRole('textbox', { name: /Endpoint/i });
			await expect(endpointInput).toHaveValue('/api/debug-settings');
		});

		test('should send request and display response', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			// Click on the GET endpoint
			const endpointButton = page
				.locator('button')
				.filter({ hasText: 'Fetch current debug settings' });
			await endpointButton.click();

			// Click Send Request
			const sendButton = page.getByRole('button', { name: 'Send Request' });
			await sendButton.click();

			// Wait for response to appear
			await expect(page.getByText('"settings"')).toBeVisible({ timeout: 10000 });
		});

		test('should disable send button when no endpoint is entered', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			// Switch to Try It tab directly
			const tryItTab = page.getByRole('tab', { name: 'Try It' });
			await tryItTab.click();

			const sendButton = page.getByRole('button', { name: 'Send Request' });
			await expect(sendButton).toBeDisabled();
		});
	});

	test.describe('Schemas Tab', () => {
		test('should display schemas when clicking Schemas tab', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			const schemasTab = page.getByRole('tab', { name: 'Schemas' });
			await schemasTab.click();

			await expect(page.getByText('TypeScript schemas used by the API.')).toBeVisible();
		});

		test('should show DebugSettings schema', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			const schemasTab = page.getByRole('tab', { name: 'Schemas' });
			await schemasTab.click();

			await expect(page.getByRole('heading', { name: 'DebugSettings' })).toBeVisible();
			await expect(page.getByText('headerBlendMode')).toBeVisible();
			await expect(page.getByText('showSectionsEnabled')).toBeVisible();
		});

		test('should show Hero3DParams schema', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			const schemasTab = page.getByRole('tab', { name: 'Schemas' });
			await schemasTab.click();

			await expect(page.getByRole('heading', { name: 'Hero3DParams' })).toBeVisible();
			await expect(page.getByText('revealRadius')).toBeVisible();
			await expect(page.getByText('glowStrength')).toBeVisible();
		});
	});

	test.describe('Closing the Explorer', () => {
		test('should close when clicking close button', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			// Open the explorer
			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			// Verify it's open
			await expect(page.getByRole('region', { name: /API Explorer/i })).toBeVisible();

			// Click close
			const closeButton = page.getByRole('button', { name: /Close API explorer/i });
			await closeButton.click();

			// Should show the ad again
			await expect(page.getByText('Open Explorer')).toBeVisible();
		});

		test('should close when pressing Escape', async ({ page }) => {
			await page.goto('/');
			await enableSections(page);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			// Open the explorer
			const apiExplorerAd = page.getByRole('button', { name: /API Explorer/i }).first();
			await apiExplorerAd.click();

			// Verify it's open
			await expect(page.getByRole('region', { name: /API Explorer/i })).toBeVisible();

			// Press Escape
			await page.keyboard.press('Escape');

			// Should show the ad again
			await expect(page.getByText('Open Explorer')).toBeVisible();
		});
	});
});

test.describe('Article Card Container Queries', () => {
	test('should display article cards with proper structure', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => {
			localStorage.setItem('debug-show-sections', 'true');
		});
		await page.reload();
		await page.waitForLoadState('networkidle');

		// Find an article card
		const articleCard = page
			.locator('button')
			.filter({ hasText: /^Article/ })
			.first();
		await expect(articleCard).toBeVisible({ timeout: 10000 });
	});

	test('article cards should have container-type: size for container queries', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => {
			localStorage.setItem('debug-show-sections', 'true');
		});
		await page.reload();
		await page.waitForLoadState('networkidle');

		const articleCard = page.locator('.article-card').first();
		await articleCard.waitFor({ state: 'visible', timeout: 10000 });

		const containerType = await articleCard.evaluate((el) => {
			return window.getComputedStyle(el).containerType;
		});

		expect(containerType).toBe('size');
	});
});
