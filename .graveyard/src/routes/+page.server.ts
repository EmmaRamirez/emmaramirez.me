import { getResolvedArticleSummaries, getResolvedProjects } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [articles, projects] = await Promise.all([
		getResolvedArticleSummaries(),
		getResolvedProjects()
	]);

	return {
		articles,
		projects
	};
};
