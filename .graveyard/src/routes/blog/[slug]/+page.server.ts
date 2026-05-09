import { error } from '@sveltejs/kit';
import { getArticleBySlug } from '$lib/articles';
import { getResolvedArticleSummary } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const articleBody = getArticleBySlug(params.slug);
	const article = await getResolvedArticleSummary(params.slug);

	if (!article || !articleBody) {
		throw error(404, `Article not found: ${params.slug}`);
	}

	return {
		slug: article.slug,
		title: article.title,
		date: article.date,
		tags: article.tags ?? [],
		description: article.description,
		excerpt: article.excerpt,
		readingTimeMinutes: article.readingTimeMinutes
	};
};
