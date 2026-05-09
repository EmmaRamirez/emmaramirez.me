import { error } from '@sveltejs/kit';
import { getResolvedProject, getResolvedProjects } from '$lib/server/content';
import { sequentialNeighborsInIds } from '$lib/reading';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const projectId = url.searchParams.get('id') ?? 'nuzlocke';
	const [project, projects] = await Promise.all([
		getResolvedProject(projectId),
		getResolvedProjects()
	]);

	if (!project) {
		throw error(404, `Project not found: ${projectId}`);
	}

	const orderedIds = projects.map((entry) => entry.id);
	const neighbors = sequentialNeighborsInIds(orderedIds, project.id);
	const prevProject = neighbors.prevId
		? (projects.find((entry) => entry.id === neighbors.prevId) ?? null)
		: null;
	const nextProject = neighbors.nextId
		? (projects.find((entry) => entry.id === neighbors.nextId) ?? null)
		: null;

	return {
		project,
		prevProject,
		nextProject
	};
};
