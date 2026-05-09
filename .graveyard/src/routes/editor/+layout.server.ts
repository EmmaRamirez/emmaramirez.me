import { getResolvedArticleSummaries, getResolvedProjects } from '$lib/server/content';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const [articles, projects] = await Promise.all([
		getResolvedArticleSummaries(),
		getResolvedProjects()
	]);

	return {
		articles,
		projects
	};
};
