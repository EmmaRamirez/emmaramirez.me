import type { Article } from '$lib/articles';
import type { ProjectRegistryEntry } from '$lib/registry/homepage';

/**
 * Types for the homepage grid items
 */

export type GridItem =
	| { kind: 'article'; article: Article }
	| { kind: 'project'; project: ProjectRegistryEntry }
	| { kind: 'hero' }
	| { kind: 'disco' }
	| { kind: 'home' }
	| { kind: 'design-system' }
	| { kind: 'city' }
	| { kind: 'pokemon' }
	| { kind: 'this-site' }
	| { kind: 'top-languages' }
	| { kind: 'location' }
	| { kind: 'api-explorer' };

export type FeaturedItem =
	| { kind: 'article'; article: Article }
	| { kind: 'project'; project: ProjectRegistryEntry };
