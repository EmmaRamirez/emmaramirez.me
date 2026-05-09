import { expect, test, type Page } from '@playwright/test';

async function openEditorGrid(page: Page) {
	await page.goto('/editor/grid');
	await expect(page.getByRole('heading', { name: 'Live Grid Editor', level: 2 })).toBeVisible();
}

test.describe('Editor grid section', () => {
	test('selects a preview tile and shows its detail controls', async ({ page }) => {
		await openEditorGrid(page);

		await page.getByRole('button', { name: 'Select Hero Section tile' }).click();

		await expect(page.getByRole('heading', { name: 'Hero Section', level: 3 })).toBeVisible();
		await expect(page.getByLabel('Blend Mode')).toBeVisible();
		await expect(page.getByText('Click an item in the grid to view its details')).toHaveCount(0);
	});

	test('switches the side panel when another preview tile is selected', async ({ page }) => {
		await openEditorGrid(page);

		await page.getByRole('button', { name: 'Select This Site tile' }).click();
		await expect(page.getByRole('heading', { name: 'This Site', level: 3 })).toBeVisible();
		await expect(page.getByLabel('Card Title')).toBeVisible();

		await page.getByRole('button', { name: 'Select Top Languages tile' }).click();
		await expect(page.getByRole('heading', { name: 'Top Languages', level: 3 })).toBeVisible();
		await expect(page.getByLabel('Display Style')).toBeVisible();
		await expect(page.getByLabel('Card Title')).toHaveCount(0);
	});
});
