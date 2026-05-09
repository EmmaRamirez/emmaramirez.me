import {
	getResolvedAllTags,
	getResolvedArticleMetas,
	getResolvedTagGraph
} from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [articles, allTags, tagGraph] = await Promise.all([
		getResolvedArticleMetas(),
		getResolvedAllTags(),
		getResolvedTagGraph()
	]);

	return {
		articles,
		allTags,
		tagGraph
	};
};
