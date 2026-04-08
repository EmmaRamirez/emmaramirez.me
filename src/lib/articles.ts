import type { SvelteComponent } from 'svelte';
import { orderedListNeighbors, readingTimeMinutesFromText } from '$lib/reading';
import { buildTagClustersFromTagged, buildTagGraphFromTagged } from '$lib/tagGraphCore';
import type { TagCluster, TagGraph } from '$lib/tagGraphCore';

export type { TagCluster, TagGraph, TagGraphLink, TagGraphNode } from '$lib/tagGraphCore';

export interface ArticleFrontmatter {
	title: string;
	date: string;
	tags?: string[];
	description: string;
	draft?: boolean;
}

export interface ArticleFull {
	slug: string;
	frontmatter: ArticleFrontmatter;
	component: typeof SvelteComponent;
	source: string;
	textContent: string;
	excerpt: string;
	readingTimeMinutes: number;
}

export interface Article {
	id: string;
	slug: string;
	title: string;
	content: string;
	date?: string;
	tags?: string[];
	readingTimeMinutes?: number;
}

export type ArticleCardData = Article;

export interface ArticleMeta {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	description: string;
}

type ArticleModule = {
	default: typeof SvelteComponent;
	metadata: ArticleFrontmatter;
};

const articleModules = import.meta.glob<ArticleModule>('/src/articles/**/*.{md,mdx,mdsvex}', {
	eager: true
});
const articleSources = import.meta.glob<string>('/src/articles/**/*.{md,mdx,mdsvex}', {
	eager: true,
	query: '?raw',
	import: 'default'
});

function extractSlugFromPath(path: string): string {
	const filename = path.split('/').pop() ?? '';
	return filename.replace(/\.(md|mdx|mdsvex)$/, '');
}

function validateDuplicateSlugs(articles: ArticleFull[]): void {
	const slugs = new Set<string>();
	for (const article of articles) {
		if (slugs.has(article.slug)) {
			throw new Error(
				`Duplicate article slug found: "${article.slug}". Slugs must be unique across all years.`
			);
		}
		slugs.add(article.slug);
	}
}

function parseArticles(): ArticleFull[] {
	const articles: ArticleFull[] = [];

	for (const [path, module] of Object.entries(articleModules)) {
		const slug = extractSlugFromPath(path);
		const frontmatter = module.metadata;
		const source = articleSources[path];

		if (!frontmatter || !source) {
			continue;
		}

		if (frontmatter.draft && import.meta.env.PROD) {
			continue;
		}

		const textContent = extractReadableText(source);
		const excerpt = extractExcerpt(source, frontmatter.description) ?? frontmatter.description;

		articles.push({
			slug,
			frontmatter,
			component: module.default,
			source,
			textContent,
			excerpt,
			readingTimeMinutes: readingTimeMinutesFromText(textContent)
		});
	}

	validateDuplicateSlugs(articles);

	articles.sort((a, b) => {
		const dateA = new Date(a.frontmatter.date).getTime();
		const dateB = new Date(b.frontmatter.date).getTime();
		return dateB - dateA;
	});

	return articles;
}

const allArticles = parseArticles();

function toArticleCardData(article: ArticleFull): ArticleCardData {
	return {
		id: article.slug,
		slug: article.slug,
		title: article.frontmatter.title,
		date: article.frontmatter.date,
		content: article.excerpt,
		tags: article.frontmatter.tags ?? [],
		readingTimeMinutes: article.readingTimeMinutes
	};
}

export const defaultArticles = allArticles.map(toArticleCardData);

export function getArticleCards(): ArticleCardData[] {
	return defaultArticles;
}

export function getArticleCardBySlug(slug: string): ArticleCardData | undefined {
	return defaultArticles.find((article) => article.slug === slug);
}

/**
 * Get all published articles sorted by date (newest first)
 */
export function getArticles(): ArticleFull[] {
	return allArticles;
}

/**
 * Get article metadata without the component (for listing pages)
 */
export function getArticleMetas(): ArticleMeta[] {
	return allArticles.map((article) => ({
		slug: article.slug,
		title: article.frontmatter.title,
		date: article.frontmatter.date,
		tags: article.frontmatter.tags ?? [],
		description: article.frontmatter.description
	}));
}

function stripFrontmatter(source: string): string {
	const normalized = source.replace(/\r\n/g, '\n');
	if (!normalized.startsWith('---\n')) return normalized;

	const frontmatterEnd = normalized.indexOf('\n---\n', 4);
	return frontmatterEnd === -1 ? normalized : normalized.slice(frontmatterEnd + 5);
}

function stripNonEssayBlocks(source: string): string {
	return stripFrontmatter(source)
		.replace(/<script[\s\S]*?<\/script>/gi, '\n')
		.replace(/<style[\s\S]*?<\/style>/gi, '\n')
		.replace(/```[\s\S]*?```/g, '\n');
}

function normalizeMarkdownText(value: string): string {
	return value
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^>\s?/gm, '')
		.replace(/^[-*+]\s+/gm, '')
		.replace(/^\d+\.\s+/gm, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\{[^{}]*\}/g, ' ')
		.replace(/[*_~]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function extractExcerpt(source: string, fallback: string): string | null {
	const blocks = stripNonEssayBlocks(source)
		.split(/\n\s*\n+/)
		.map((block) => normalizeMarkdownText(block))
		.filter(Boolean);

	for (const block of blocks) {
		if (block.length < 40) continue;
		if (!/\s/.test(block)) continue;
		if (block === fallback) continue;
		return block;
	}

	return null;
}

function extractReadableText(source: string): string {
	return normalizeMarkdownText(stripNonEssayBlocks(source));
}

/**
 * Get a single article by its slug
 */
export function getArticleBySlug(slug: string): ArticleFull | undefined {
	return allArticles.find((article) => article.slug === slug);
}

export function getArticleNeighbors(slug: string | null | undefined) {
	return orderedListNeighbors(allArticles, slug, (article) => article.slug);
}

/**
 * Get all unique tags across all articles
 */
export function getAllTags(): string[] {
	const tags = new Set<string>();
	for (const article of allArticles) {
		article.frontmatter.tags?.forEach((tag) => tags.add(tag));
	}
	return [...tags].sort();
}

/**
 * Group tags by article co-occurrence so related topics can be displayed together.
 */
export function getTagClusters(): TagCluster[] {
	return buildTagClustersFromTagged(
		allArticles.map((a) => ({ tags: [...(a.frontmatter.tags ?? [])] }))
	);
}

/**
 * Build a weighted graph from tag co-occurrence for node-based visualizations.
 */
export function getTagGraph(): TagGraph {
	return buildTagGraphFromTagged(
		allArticles.map((a) => ({ tags: [...(a.frontmatter.tags ?? [])] }))
	);
}

/**
 * Get articles filtered by tag
 */
export function getArticlesByTag(tag: string): ArticleFull[] {
	return allArticles.filter((article) => article.frontmatter.tags?.includes(tag));
}
