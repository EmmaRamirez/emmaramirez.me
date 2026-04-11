import { expect, test } from '@playwright/test';

test.describe('/api/content', () => {
	test('GET returns projects and articles arrays', async ({ request }) => {
		const response = await request.get('/api/content');
		expect(response.ok()).toBeTruthy();

		const body = (await response.json()) as {
			projects: Array<{ id: string; title: string; bodyMarkdown: string }>;
			articles: Array<{ slug: string; title: string }>;
		};

		expect(Array.isArray(body.projects)).toBeTruthy();
		expect(Array.isArray(body.articles)).toBeTruthy();
		expect(body.projects.length).toBeGreaterThan(0);
		expect(body.articles.length).toBeGreaterThan(0);

		const firstProject = body.projects[0];
		expect(typeof firstProject.id).toBe('string');
		expect(firstProject.id.length).toBeGreaterThan(0);
		expect(typeof firstProject.bodyMarkdown).toBe('string');
	});

	test('PUT rejects invalid payload', async ({ request }) => {
		const response = await request.put('/api/content', {
			data: { entityType: 'other', entityId: 'x' },
			headers: { 'content-type': 'application/json' }
		});
		expect(response.status()).toBe(400);
		const json = (await response.json()) as { error?: string };
		expect(json.error).toMatch(/invalid/i);
	});

	test('PUT rejects project with empty markdown body', async ({ request }) => {
		const response = await request.put('/api/content', {
			data: {
				entityType: 'project',
				entityId: 'site',
				description: 'd',
				excerpt: 'e',
				bodyMarkdown: '   '
			},
			headers: { 'content-type': 'application/json' }
		});
		expect(response.status()).toBe(400);
		const json = (await response.json()) as { error?: string };
		expect(json.error).toMatch(/empty/i);
	});

	test('PUT rejects article without title or date', async ({ request }) => {
		const list = await request.get('/api/content');
		const { articles } = (await list.json()) as { articles: Array<{ slug: string }> };
		const slug = articles[0]?.slug;
		expect(slug).toBeTruthy();

		const response = await request.put('/api/content', {
			data: {
				entityType: 'article',
				entityId: slug,
				title: '',
				description: 'd',
				excerpt: 'e',
				tags: [],
				publishedAt: ''
			},
			headers: { 'content-type': 'application/json' }
		});
		expect(response.status()).toBe(400);
	});
});

test.describe('/api/content persistence (serial)', () => {
	test.describe.configure({ mode: 'serial' });

	test('PUT round-trips project markdown for a known registry id', async ({ request }) => {
		const initial = await request.get('/api/content');
		expect(initial.ok()).toBeTruthy();
		const { projects } = (await initial.json()) as {
			projects: Array<{
				id: string;
				description: string;
				excerpt: string;
				bodyMarkdown: string;
			}>;
		};

		const site = projects.find((p) => p.id === 'site');
		expect(site).toBeTruthy();

		const marker = `\n\n<!-- e2e-content-${Date.now()} -->\n`;
		const modifiedBody = `${site!.bodyMarkdown}${marker}`;

		const save = await request.put('/api/content', {
			data: {
				entityType: 'project',
				entityId: 'site',
				description: site!.description,
				excerpt: site!.excerpt,
				bodyMarkdown: modifiedBody
			},
			headers: { 'content-type': 'application/json' }
		});
		expect(save.ok()).toBeTruthy();
		const saved = (await save.json()) as { record?: { bodyMarkdown?: string } };
		expect(saved.record?.bodyMarkdown).toContain('e2e-content-');

		const after = await request.get('/api/content');
		expect(after.ok()).toBeTruthy();
		const afterJson = (await after.json()) as {
			projects: Array<{ id: string; bodyMarkdown: string }>;
		};
		const siteAfter = afterJson.projects.find((p) => p.id === 'site');
		expect(siteAfter?.bodyMarkdown).toContain('e2e-content-');

		const restore = await request.put('/api/content', {
			data: {
				entityType: 'project',
				entityId: 'site',
				description: site!.description,
				excerpt: site!.excerpt,
				bodyMarkdown: site!.bodyMarkdown
			},
			headers: { 'content-type': 'application/json' }
		});
		expect(restore.ok()).toBeTruthy();
	});
});

test.describe('Editor content UI', () => {
	test('content section loads with save actions', async ({ page }) => {
		await page.goto('/editor/content');
		await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

		await expect(page.getByRole('navigation', { name: 'Project content records' })).toBeVisible();
		await expect(page.getByRole('navigation', { name: 'Article content records' })).toBeVisible();

		await expect(page.getByRole('button', { name: 'Save project content' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Save article metadata' })).toBeVisible();
	});

	test('editor nav links to Content section', async ({ page }) => {
		await page.goto('/editor/grid');
		await page.getByRole('link', { name: 'Content' }).click();
		await expect(page).toHaveURL(/\/editor\/content$/);
		await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();
	});
});
