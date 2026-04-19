import { Prisma, type ContentEntry } from '$generated/prisma/client';
import type { Article, ArticleMeta } from '$lib/articles';
import { getArticles } from '$lib/articles';
import { firstMarkdownParagraph, markdownToPlainText } from '$lib/markdown';
import { readingTimeMinutesFromText } from '$lib/reading';
import { projectRegistry, type ProjectId, type ProjectRegistryEntry } from '$lib/registry/homepage';
import { prisma } from '$lib/server/prisma';
import { buildTagGraphFromTagged } from '$lib/tagGraphCore';
import type {
	ArticleContentRecord,
	ContentUpdatePayload,
	ProjectContentRecord
} from '$lib/types/content';

type StoredContentEntry = Pick<
	ContentEntry,
	| 'entityType'
	| 'entityId'
	| 'title'
	| 'description'
	| 'excerpt'
	| 'bodyMarkdown'
	| 'tags'
	| 'publishedAt'
	| 'updatedAt'
>;

type ContentEntryDelegate = typeof prisma extends { contentEntry: infer Delegate }
	? Delegate
	: never;

export type ResolvedProject = ProjectRegistryEntry & {
	content: string;
	excerpt: string;
	updatedAt: string | null;
};

export type ResolvedArticleSummary = Article & {
	description: string;
	excerpt: string;
	updatedAt: string | null;
};

export type ResolvedArticleMeta = ArticleMeta & {
	excerpt: string;
	readingTimeMinutes: number;
	updatedAt: string | null;
};

function isNonEmptyString(value: string | null | undefined): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

function pickText(overrideValue: string | null | undefined, fallback: string | undefined): string {
	return isNonEmptyString(overrideValue) ? overrideValue.trim() : (fallback ?? '').trim();
}

function parseTags(value: Prisma.JsonValue | null | undefined): string[] {
	if (!Array.isArray(value)) return [];

	return value
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim())
		.filter(Boolean);
}

function toIsoDate(value: Date | null | undefined): string | null {
	return value ? value.toISOString() : null;
}

function sortByDateDesc<T extends { publishedAt?: string; date?: string }>(items: T[]): T[] {
	return items.toSorted((left, right) => {
		const leftTime = new Date(left.publishedAt ?? left.date ?? '').getTime();
		const rightTime = new Date(right.publishedAt ?? right.date ?? '').getTime();
		return rightTime - leftTime;
	});
}

function buildEntryMap(entries: StoredContentEntry[]) {
	return new Map(entries.map((entry) => [entry.entityId, entry]));
}

function isProjectId(value: string): value is ProjectId {
	return value in projectRegistry;
}

function getContentEntryDelegate() {
	return (prisma as typeof prisma & { contentEntry?: ContentEntryDelegate }).contentEntry;
}

function isMissingContentEntryTableError(error: unknown): boolean {
	return (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === 'P2021' &&
		error.meta?.table === 'public.ContentEntry'
	);
}

export function resolveProjectEntry(
	project: ProjectRegistryEntry,
	entry?: StoredContentEntry | null
): ResolvedProject {
	const content = pickText(entry?.bodyMarkdown, project.content ?? '');
	const description = pickText(entry?.description, project.description);
	const excerpt = pickText(entry?.excerpt, firstMarkdownParagraph(content) || description);
	const title = pickText(entry?.title, project.title);

	return {
		...project,
		title,
		description,
		content,
		excerpt,
		updatedAt: toIsoDate(entry?.updatedAt)
	};
}

export function resolveArticleEntry(
	article: ReturnType<typeof getArticles>[number],
	entry?: StoredContentEntry | null
): ResolvedArticleSummary {
	const title = pickText(entry?.title, article.frontmatter.title);
	const description = pickText(entry?.description, article.frontmatter.description);
	const excerpt = pickText(entry?.excerpt, article.excerpt || description);
	const date = pickText(entry?.publishedAt, article.frontmatter.date);
	const tags = parseTags(entry?.tags) || article.frontmatter.tags || [];

	return {
		id: article.slug,
		slug: article.slug,
		title,
		content: excerpt,
		description,
		excerpt,
		date,
		tags: tags.length > 0 ? tags : (article.frontmatter.tags ?? []),
		readingTimeMinutes: article.readingTimeMinutes,
		updatedAt: toIsoDate(entry?.updatedAt)
	};
}

async function getEntries(entityType: 'project' | 'article'): Promise<StoredContentEntry[]> {
	const delegate = getContentEntryDelegate();
	if (!delegate) return [];

	try {
		return await delegate.findMany({
			where: { entityType },
			orderBy: [{ updatedAt: 'desc' }, { entityId: 'asc' }]
		});
	} catch (error) {
		// Allow the site to fall back to checked-in content while a new database is still being migrated.
		if (isMissingContentEntryTableError(error)) return [];
		throw error;
	}
}

export async function getResolvedProjects(): Promise<ResolvedProject[]> {
	const entryMap = buildEntryMap(await getEntries('project'));
	return Object.values(projectRegistry).map((project) =>
		resolveProjectEntry(project, entryMap.get(project.id))
	);
}

export async function getResolvedProject(projectId: string): Promise<ResolvedProject | null> {
	if (!isProjectId(projectId)) return null;

	const delegate = getContentEntryDelegate();
	if (!delegate) {
		return resolveProjectEntry(projectRegistry[projectId], null);
	}

	let entry: StoredContentEntry | null = null;
	try {
		entry = await delegate.findUnique({
			where: {
				entityType_entityId: {
					entityType: 'project',
					entityId: projectId
				}
			}
		});
	} catch (error) {
		// Project pages can still render from the local registry until the ContentEntry migration is applied.
		if (!isMissingContentEntryTableError(error)) throw error;
	}

	return resolveProjectEntry(projectRegistry[projectId], entry);
}

export async function getProjectContentRecords(): Promise<ProjectContentRecord[]> {
	const projects = await getResolvedProjects();

	return projects.map((project) => ({
		id: project.id,
		title: project.title,
		description: project.description,
		excerpt: project.excerpt,
		bodyMarkdown: project.content,
		updatedAt: project.updatedAt
	}));
}

export async function getResolvedArticleSummaries(): Promise<ResolvedArticleSummary[]> {
	const articles = getArticles();
	const entryMap = buildEntryMap(await getEntries('article'));
	return sortByDateDesc(
		articles.map((article) => resolveArticleEntry(article, entryMap.get(article.slug)))
	);
}

export async function getResolvedArticleMetas(): Promise<ResolvedArticleMeta[]> {
	const articles = await getResolvedArticleSummaries();
	return articles.map((article) => ({
		slug: article.slug,
		title: article.title,
		date: article.date ?? '',
		tags: article.tags ?? [],
		description: article.description,
		excerpt: article.excerpt,
		readingTimeMinutes: article.readingTimeMinutes ?? readingTimeMinutesFromText(article.excerpt),
		updatedAt: article.updatedAt
	}));
}

export async function getResolvedArticleSummary(
	slug: string
): Promise<ResolvedArticleSummary | null> {
	const articles = await getResolvedArticleSummaries();
	return articles.find((article) => article.slug === slug) ?? null;
}

export async function getArticleContentRecords(): Promise<ArticleContentRecord[]> {
	const articles = await getResolvedArticleSummaries();

	return articles.map((article) => ({
		slug: article.slug,
		title: article.title,
		description: article.description,
		excerpt: article.excerpt,
		tags: article.tags ?? [],
		publishedAt: article.date ?? '',
		updatedAt: article.updatedAt
	}));
}

export async function getResolvedAllTags(): Promise<string[]> {
	const articles = await getResolvedArticleSummaries();
	const tags = new Set<string>();
	for (const article of articles) {
		for (const tag of article.tags ?? []) {
			tags.add(tag);
		}
	}
	return [...tags].sort();
}

export async function getResolvedTagGraph() {
	const articles = await getResolvedArticleSummaries();
	return buildTagGraphFromTagged(articles.map((article) => ({ tags: [...(article.tags ?? [])] })));
}

export async function upsertContentEntry(payload: ContentUpdatePayload) {
	const delegate = getContentEntryDelegate();
	if (!delegate) {
		if (payload.entityType === 'project') {
			return getProjectContentRecords().then((records) =>
				records.find((record) => record.id === payload.entityId)
			);
		}

		return getArticleContentRecords().then((records) =>
			records.find((record) => record.slug === payload.entityId)
		);
	}

	if (payload.entityType === 'project') {
		await delegate.upsert({
			where: {
				entityType_entityId: {
					entityType: 'project',
					entityId: payload.entityId
				}
			},
			update: {
				description: payload.description,
				excerpt: payload.excerpt,
				bodyMarkdown: payload.bodyMarkdown
			},
			create: {
				entityType: 'project',
				entityId: payload.entityId,
				description: payload.description,
				excerpt: payload.excerpt,
				bodyMarkdown: payload.bodyMarkdown
			}
		});

		return getProjectContentRecords().then((records) =>
			records.find((record) => record.id === payload.entityId)
		);
	}

	await delegate.upsert({
		where: {
			entityType_entityId: {
				entityType: 'article',
				entityId: payload.entityId
			}
		},
		update: {
			title: payload.title,
			description: payload.description,
			excerpt: payload.excerpt,
			tags: payload.tags,
			publishedAt: payload.publishedAt
		},
		create: {
			entityType: 'article',
			entityId: payload.entityId,
			title: payload.title,
			description: payload.description,
			excerpt: payload.excerpt,
			tags: payload.tags,
			publishedAt: payload.publishedAt
		}
	});

	return getArticleContentRecords().then((records) =>
		records.find((record) => record.slug === payload.entityId)
	);
}

export function projectMarkdownToReadingText(project: Pick<ResolvedProject, 'content'>) {
	return markdownToPlainText(project.content);
}
