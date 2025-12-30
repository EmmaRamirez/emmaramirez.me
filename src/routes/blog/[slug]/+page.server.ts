import { error } from '@sveltejs/kit';
import { getArticleBySlug, getArticles } from '$lib/articles';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const article = getArticleBySlug(params.slug);

	if (!article) {
		throw error(404, `Article not found: ${params.slug}`);
	}

	return {
		slug: article.slug,
		title: article.frontmatter.title,
		date: article.frontmatter.date,
		tags: article.frontmatter.tags ?? [],
		description: article.frontmatter.description
	};
};

// Generate static pages for all articles at build time
export const entries: EntryGenerator = () => {
	return getArticles().map((article) => ({
		slug: article.slug
	}));
};

export const prerender = true;

