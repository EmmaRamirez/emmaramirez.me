import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import {
	getArticleContentRecords,
	getProjectContentRecords,
	upsertContentEntry
} from '$lib/server/content';
import type { ContentUpdatePayload } from '$lib/types/content';

export const prerender = false;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function normalizeText(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function normalizeTags(value: unknown): string[] {
	if (!Array.isArray(value)) return [];

	return value
		.filter((tag): tag is string => typeof tag === 'string')
		.map((tag) => tag.trim())
		.filter(Boolean);
}

function parseUpdatePayload(value: unknown): ContentUpdatePayload | null {
	if (!isRecord(value)) return null;

	const entityType = value.entityType;
	const entityId = normalizeText(value.entityId);
	if ((entityType !== 'project' && entityType !== 'article') || !entityId) {
		return null;
	}

	if (entityType === 'project') {
		return {
			entityType,
			entityId,
			description: normalizeText(value.description),
			excerpt: normalizeText(value.excerpt),
			bodyMarkdown: typeof value.bodyMarkdown === 'string' ? value.bodyMarkdown : ''
		};
	}

	return {
		entityType,
		entityId,
		title: normalizeText(value.title),
		description: normalizeText(value.description),
		excerpt: normalizeText(value.excerpt),
		tags: normalizeTags(value.tags),
		publishedAt: normalizeText(value.publishedAt)
	};
}

export const GET = async () => {
	try {
		const [projects, articles] = await Promise.all([
			getProjectContentRecords(),
			getArticleContentRecords()
		]);

		return json({ projects, articles });
	} catch (error) {
		console.error('[content] GET error:', error);
		return json({ error: 'Failed to fetch content records', details: String(error) }, { status: 500 });
	}
};

export const PUT = async ({ request }) => {
	if (!dev) {
		return json({ error: 'Content editing is only available in development mode.' }, { status: 403 });
	}

	try {
		const payload = parseUpdatePayload(await request.json());
		if (!payload) {
			return json({ error: 'Invalid content payload.' }, { status: 400 });
		}

		if (payload.entityType === 'project' && !payload.bodyMarkdown.trim()) {
			return json({ error: 'Project markdown content cannot be empty.' }, { status: 400 });
		}

		if (payload.entityType === 'article' && (!payload.title || !payload.publishedAt)) {
			return json({ error: 'Article title and published date are required.' }, { status: 400 });
		}

		const record = await upsertContentEntry(payload);
		return json({ record });
	} catch (error) {
		console.error('[content] PUT error:', error);
		return json({ error: 'Failed to save content record', details: String(error) }, { status: 500 });
	}
};
