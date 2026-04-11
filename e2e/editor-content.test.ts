import { expect, test, type Page } from '@playwright/test';

import type { ContentIndexResponse } from '../src/lib/types/content';

async function openEditorContentSection(page: Page) {
	await page.goto('/editor/content');
	await expect(page.getByRole('heading', { name: 'Content', level: 2 })).toBeVisible();
}

test.describe('Editor content section', () => {
	test('loads Content tab with project and article editors', async ({ page }) => {
		await openEditorContentSection(page);
		await expect(page.getByText('Projects now store markdown body content here')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Save project content' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Save article metadata' })).toBeVisible();
	});

	test('saves project markdown from the UI and restores prior content', async ({ page, request }) => {
		const index = await request.get('/api/content');
		expect(index.ok()).toBe(true);
		const data = (await index.json()) as ContentIndexResponse;
		const project = data.projects[0];
		expect(project).toBeDefined();

		const marker = `\n\n<!-- e2e-editor-ui ${Date.now()} -->\n`;

		await openEditorContentSection(page);

		await page
			.getByRole('navigation', { name: 'Project content records' })
			.getByRole('button')
			.filter({ hasText: project.title })
			.first()
			.click();

		const bodyField = page.locator('label.field').filter({ hasText: 'Markdown body' }).locator('textarea');
		const prior = await bodyField.inputValue();
		await bodyField.fill(`${prior}${marker}`);

		await page.getByRole('button', { name: 'Save project content' }).click();

		await expect(page.getByRole('button', { name: 'Save project content' })).toBeEnabled({ timeout: 15_000 });

		const after = await request.get('/api/content');
		expect(after.ok()).toBe(true);
		const updated = (await after.json()) as ContentIndexResponse;
		const match = updated.projects.find((entry) => entry.id === project.id);
		expect(match?.bodyMarkdown).toContain(marker.trim());

		const restore = await request.put('/api/content', {
			headers: { 'content-type': 'application/json' },
			data: {
				entityType: 'project',
				entityId: project.id,
				description: project.description,
				excerpt: project.excerpt,
				bodyMarkdown: project.bodyMarkdown
			}
		});

		expect(restore.ok()).toBe(true);
	});
});
