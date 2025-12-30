import type { Article } from '$lib/articles';
import type { ProjectRegistryEntry } from '$lib/registry/homepage';

/**
 * Types for the homepage grid items
 */

export type GridItem =
	| { kind: 'article'; article: Article }
	| { kind: 'project'; project: ProjectRegistryEntry }
	| { kind: 'disco' }
	| { kind: 'home' }
	| { kind: 'design-system' }
	| { kind: 'city' }
	| { kind: 'pokemon' }
	| { kind: 'top-languages' };

export type FeaturedItem =
	| { kind: 'article'; article: Article }
	| { kind: 'project'; project: ProjectRegistryEntry };

