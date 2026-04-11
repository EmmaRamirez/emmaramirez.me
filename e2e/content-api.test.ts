import { expect, test } from '@playwright/test';

type ContentGetResponse = {
	projects: Array<{
		id: string;
		title: string;
		description: string;
		excerpt: string;
		bodyMarkdown: string;
		updatedAt: string | null;
	}>;
	articles: Array<{
		slug: string;
		title: string;
		description: string;
		excerpt: string;
		tags: string[];
		publishedAt: string;
		updatedAt: string | null;
	}>;
};

test.describe.serial('Content API and editor', () => {
	test('GET /api/content returns project and article records', async ({ request }) => {
		const response = await request.get('/api/content');
		expect(response.ok()).toBe(true);

		const data = (await response.json()) as ContentGetResponse;
		expect(Array.isArray(data.projects)).toBe(true);
		expect(Array.isArray(data.articles)).toBe(true);
		expect(data.projects.length).toBeGreaterThan(0);
		expect(data.articles.length).toBeGreaterThan(0);

		const firstProject = data.projects[0];
		expect(firstProject).toHaveProperty('id');
		expect(firstProject).toHaveProperty('bodyMarkdown');
		expect(typeof firstProject.bodyMarkdown).toBe('string');

		const firstArticle = data.articles[0];
		expect(firstArticle).toHaveProperty('slug');
		expect(firstArticle).toHaveProperty('title');
		expect(firstArticle.publishedAt.length).toBeGreaterThan(0);
	});

	test('PUT /api/content rejects invalid payload', async ({ request }) => {
		const response = await request.put('/api/content', {
			data: {}
		});

		expect(response.status()).toBe(400);
		const body = (await response.json()) as { error?: string };
		expect(body.error).toContain('Invalid');
	});

	test('PUT /api/content rejects empty project markdown', async ({ request }) => {
		const response = await request.put('/api/content', {
			data: {
				entityType: 'project',
				entityId: 'nuzlocke',
				description: 'x',
				excerpt: 'x',
				bodyMarkdown: '   '
			}
		});

		expect(response.status()).toBe(400);
		const body = (await response.json()) as { error?: string };
		expect(body.error).toContain('empty');
	});

	test('PUT /api/content rejects article without title', async ({ request }) => {
		const getRes = await request.get('/api/content');
		const { articles } = (await getRes.json()) as ContentGetResponse;
		const slug = articles[0].slug;

		const response = await request.put('/api/content', {
			data: {
				entityType: 'article',
				entityId: slug,
				title: '',
				description: 'd',
				excerpt: 'e',
				tags: [],
				publishedAt: articles[0].publishedAt
			}
		});

		expect(response.status()).toBe(400);
		const body = (await response.json()) as { error?: string };
		expect(body.error).toMatch(/title|required/i);
	});

	test('PUT /api/content upserts project markdown', async ({ request }) => {
		const getRes = await request.get('/api/content');
		const { projects } = (await getRes.json()) as ContentGetResponse;
		const project = projects.find((p) => p.id === 'nuzlocke');
		expect(project).toBeDefined();

		const marker = `<!-- e2e-content ${Date.now()} -->`;
		const response = await request.put('/api/content', {
			data: {
				entityType: 'project',
				entityId: 'nuzlocke',
				description: project!.description,
				excerpt: project!.excerpt,
				bodyMarkdown: `${project!.bodyMarkdown}\n\n${marker}\n`
			}
		});

		expect(response.ok()).toBe(true);
		const body = (await response.json()) as { record?: { id?: string } };
		expect(body.record?.id).toBe('nuzlocke');
	});

	test('PUT /api/content upserts article metadata', async ({ request }) => {
		const getRes = await request.get('/api/content');
		const { articles } = (await getRes.json()) as ContentGetResponse;
		const article = articles[0];

		const response = await request.put('/api/content', {
			data: {
				entityType: 'article',
				entityId: article.slug,
				title: article.title,
				description: `${article.description} (e2e ${Date.now()})`,
				excerpt: article.excerpt,
				tags: article.tags,
				publishedAt: article.publishedAt
			}
		});

		expect(response.ok()).toBe(true);
		const body = (await response.json()) as { record?: { slug?: string } };
		expect(body.record?.slug).toBe(article.slug);
	});

	test('editor content page saves project via UI', async ({ page }) => {
		await page.goto('/editor/content');
		await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

		const marker = `e2e-ui-${Date.now()}`;
		const bodyField = page.getByLabel('Markdown body');
		const existing = await bodyField.inputValue();
		await bodyField.fill(`${existing}\n\n# ${marker}\n`);

		const responsePromise = page.waitForResponse(
			(res) =>
				res.request().method() === 'PUT' &&
				res.url().includes('/api/content') &&
				res.status() === 200
		);

		await page.getByRole('button', { name: 'Save project content' }).click();
		await responsePromise;

		await expect(page.locator('.content-error')).toHaveCount(0);
	});

	test('editor content page shows validation error for empty project body', async ({ page }) => {
		await page.goto('/editor/content');
		await page.getByLabel('Markdown body').fill('');

		const responsePromise = page.waitForResponse(
			(res) =>
				res.request().method() === 'PUT' &&
				res.url().includes('/api/content') &&
				res.status() === 400
		);

		await page.getByRole('button', { name: 'Save project content' }).click();
		await responsePromise;

		await expect(page.getByText('Project markdown content cannot be empty.')).toBeVisible();
	});
});
