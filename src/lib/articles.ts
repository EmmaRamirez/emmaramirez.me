import type { SvelteComponent } from 'svelte';
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
}

export interface Article {
	id: string;
	title: string;
	content: string;
	date?: string;
	tags?: string[];
}

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

		if (!frontmatter) {
			continue;
		}

		if (frontmatter.draft && import.meta.env.PROD) {
			continue;
		}

		articles.push({
			slug,
			frontmatter,
			component: module.default
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

export const defaultArticles = allArticles.map((article) => ({
	id: article.slug,
	title: article.frontmatter.title,
	date: article.frontmatter.date,
	content: article.frontmatter.description,
	tags: article.frontmatter.tags ?? []
}));

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

/**
 * Get a single article by its slug
 */
export function getArticleBySlug(slug: string): ArticleFull | undefined {
	return allArticles.find((article) => article.slug === slug);
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
