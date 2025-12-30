import type { SvelteComponent } from 'svelte';

export interface ArticleFrontmatter {
	title: string;
	date: string;
	tags?: string[];
	description: string;
	draft?: boolean;
}

// Full article with component for rendering
export interface ArticleFull {
	slug: string;
	frontmatter: ArticleFrontmatter;
	component: typeof SvelteComponent;
}

// Legacy article type for homepage components (backwards compatibility)
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

// Import all markdown/mdx/mdsvex files from the articles directory
const articleModules = import.meta.glob<ArticleModule>('/src/articles/**/*.{md,mdx,mdsvex}', {
	eager: true
});

function extractSlugFromPath(path: string): string {
	// Path format: /src/articles/2024/article-slug.md
	const filename = path.split('/').pop() ?? '';
	return filename.replace(/\.(md|mdx|mdsvex)$/, '');
}

function validateDuplicateSlugs(articles: ArticleFull[]): void {
	const slugs = new Set<string>();
	for (const article of articles) {
		if (slugs.has(article.slug)) {
			throw new Error(`Duplicate article slug found: "${article.slug}". Slugs must be unique across all years.`);
		}
		slugs.add(article.slug);
	}
}

function parseArticles(): ArticleFull[] {
	const articles: ArticleFull[] = [];

	for (const [path, module] of Object.entries(articleModules)) {
		const slug = extractSlugFromPath(path);
		const frontmatter = module.metadata;

		// Skip if no metadata or frontmatter
		if (!frontmatter) {
			continue;
		}

		// Skip drafts in production
		if (frontmatter.draft && import.meta.env.PROD) {
			continue;
		}

		articles.push({
			slug,
			frontmatter,
			component: module.default
		});
	}

	// Validate no duplicate slugs
	validateDuplicateSlugs(articles);

	// Sort by date, newest first
	articles.sort((a, b) => {
		const dateA = new Date(a.frontmatter.date).getTime();
		const dateB = new Date(b.frontmatter.date).getTime();
		return dateB - dateA;
	});

	return articles;
}

// Parse articles once at module load
const allArticles = parseArticles();

// Export for homepage registry (provides article metadata for homepage grid)
// Uses 'content' instead of 'description' for backwards compatibility with existing components
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
 * Get articles filtered by tag
 */
export function getArticlesByTag(tag: string): ArticleFull[] {
	return allArticles.filter((article) => article.frontmatter.tags?.includes(tag));
}
