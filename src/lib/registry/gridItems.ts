import type { Article } from '$lib/articles';
import { defaultArticles } from '$lib/articles';
import { projectRegistry, type ProjectRegistryEntry } from '$lib/registry/homepage';
import type { GridItem } from '$lib/types/homepage';

/** Shared slices for homepage and editor preview grids (same article/project picks). */
export function getHomepageGridSlices(): {
	homepageArticles: Article[];
	homepageProjects: ProjectRegistryEntry[];
} {
	const homepageArticles = defaultArticles.slice(0, 5);
	const homepageProjects = Object.values(projectRegistry)
		.toSorted((a, b) => Number.parseInt(b.year ?? '0', 10) - Number.parseInt(a.year ?? '0', 10))
		.slice(0, 5);
	return { homepageArticles, homepageProjects };
}

/**
 * Build the main grid item list. The homepage includes the API explorer tile; the editor
 * preview omits it so persisted layout order/layouts stay aligned with the item set.
 */
export function buildHomepageGridItems(options: { includeApiExplorer: boolean }): GridItem[] {
	const { homepageArticles, homepageProjects } = getHomepageGridSlices();

	const items: GridItem[] = [
		{ kind: 'hero' },
		{ kind: 'disco' },
		{ kind: 'home' },
		{ kind: 'location' },
		{ kind: 'pokemon' },
		{ kind: 'top-languages' },
		{ kind: 'city' },
		...homepageArticles.map((article) => ({ kind: 'article' as const, article })),
		...homepageProjects.map((project) => ({ kind: 'project' as const, project })),
		{ kind: 'design-system' }
	];

	if (options.includeApiExplorer) {
		items.push({ kind: 'api-explorer' });
	}

	return items;
}
