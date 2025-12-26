import type { Article } from '$lib/articles';
import { defaultArticles } from '$lib/articles';
import houstonImage from '$lib/images/photos/houston.jpeg';
import profileImage from '$lib/images/profile.png';
import githubImage from '$lib/images/github.svg';
import discoImage from '$lib/images/photos/disco.jpeg';

export type ProjectId =
	| 'fakemon'
	| 'nuzlocke'
	| 'site'
	| 'discoProject'
	| 'paraglide'
	| 'designSystemLab'
	| 'commitGarden'
	| 'palettePlayground'
	| 'a11yAuditKit'
	| 'readmeStudio';

export type ItemKind = 'article' | 'project' | 'disco';

export interface ProjectRegistryEntry {
	kind: 'project';
	id: ProjectId;
	title: string;
	pill: string;
	image: string;
	description: string;
	class?: string;
	contentClassName?: string;
	imageClassName?: string;
}

export interface ArticleRegistryEntry {
	kind: 'article';
	articleId: string;
}

export interface DiscoRegistryEntry {
	kind: 'disco';
	image: string;
	alt: string;
	caption: string;
	class?: string;
}

export type RegistryEntry = ProjectRegistryEntry | ArticleRegistryEntry | DiscoRegistryEntry;

export interface HomepageRegistry {
	projects: Record<ProjectId, ProjectRegistryEntry>;
	articles: Record<string, ArticleRegistryEntry>;
	disco: DiscoRegistryEntry;
}

// Project Registry
export const projectRegistry: Record<ProjectId, ProjectRegistryEntry> = {
	fakemon: {
		kind: 'project',
		id: 'fakemon',
		title: 'fakemon-generator',
		pill: 'Creative coding',
		image: profileImage,
		description: 'A playful generator for imaginary Pokémon-style creatures, blending design systems, randomness, and cozy UI details.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	nuzlocke: {
		kind: 'project',
		id: 'nuzlocke',
		title: 'nuzlocke-tracker',
		pill: 'UX for constraints',
		image: profileImage,
		description: 'A companion app for challenge runs that keeps teams, routes, and tense decisions tidy without losing the charm of notebooks and scribbles.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	site: {
		kind: 'project',
		id: 'site',
		title: 'emmaramirez.me',
		pill: 'Design systems',
		image: profileImage,
		description: 'The hand-rolled design system and SvelteKit setup that powers this very site, experimenting with typography, tokens, and a slightly feral layout grid.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	discoProject: {
		kind: 'project',
		id: 'discoProject',
		title: 'disco-canvas',
		pill: 'Playful interfaces',
		image: houstonImage,
		description: 'An interactive playground for gradients, blobs, and motion—built to feel like a disco floor you can doodle on.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	paraglide: {
		kind: 'project',
		id: 'paraglide',
		title: 'paraglide-playground',
		pill: 'i18n & UX',
		image: profileImage,
		description: 'A multilingual SvelteKit demo using Paraglide that stress-tests copy, layout, and tone across languages without turning the UI into a spreadsheet.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	designSystemLab: {
		kind: 'project',
		id: 'designSystemLab',
		title: 'design-system-lab',
		pill: 'Design systems',
		image: githubImage,
		description: 'A sandbox for tokens, components, and documentation that explores how far a Svelte-powered design system can be pushed before it begs for refactors.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	commitGarden: {
		kind: 'project',
		id: 'commitGarden',
		title: 'commit-garden',
		pill: 'Developer tooling',
		image: githubImage,
		description: 'A tiny dashboard that turns git history into a garden view, nudging you toward smaller, story-shaped commits instead of one giant "final-final" push.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	palettePlayground: {
		kind: 'project',
		id: 'palettePlayground',
		title: 'palette-playground',
		pill: 'Color & theming',
		image: profileImage,
		description: 'An interactive color lab for testing palettes against real content, dark mode, and accessibility constraints without leaving the browser.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	a11yAuditKit: {
		kind: 'project',
		id: 'a11yAuditKit',
		title: 'a11y-audit-kit',
		pill: 'Accessibility',
		image: houstonImage,
		description: 'A weekend-sized toolkit for running lightweight accessibility audits—checklists, notes, and quick wins bundled into a friendly interface.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	readmeStudio: {
		kind: 'project',
		id: 'readmeStudio',
		title: 'readme-studio',
		pill: 'Writing & docs',
		image: profileImage,
		description: 'A structured editor for project READMEs that helps you go from blank page to clear, kind documentation without feeling like a corporate template.',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	}
};

// Article Registry - create entries for all articles
export const articleRegistry: Record<string, ArticleRegistryEntry> = Object.fromEntries(
	defaultArticles.map((article) => [
		article.id,
		{
			kind: 'article',
			articleId: article.id
		}
	])
) as Record<string, ArticleRegistryEntry>;

// Disco Registry
export const discoRegistry: DiscoRegistryEntry = {
	kind: 'disco',
	image: discoImage,
	alt: 'Disco photo',
	caption: 'Disco vibes',
	class: 'w-full h-full'
};

// Complete Registry
export const homepageRegistry: HomepageRegistry = {
	projects: projectRegistry,
	articles: articleRegistry,
	disco: discoRegistry
};

// Helper functions
export function getProject(id: ProjectId): ProjectRegistryEntry {
	return projectRegistry[id];
}

export function getArticle(id: string): Article | undefined {
	return defaultArticles.find((article) => article.id === id);
}

export function getDisco(): DiscoRegistryEntry {
	return discoRegistry;
}

// Item type for the homepage
export type Item =
	| { kind: 'article'; article: Article }
	| { kind: 'project'; id: ProjectId }
	| { kind: 'disco' };

// Utility functions
export function seededShuffle<T>(items: T[], seed: number): T[] {
	const result = items.slice();

	// Simple LCG-based pseudo-random generator so layout is
	// random-looking but deterministic across reloads
	const m = 0x80000000;
	const a = 1103515245;
	const c = 12345;

	let state = seed;

	function random() {
		state = (a * state + c) % m;
		return state / (m - 1);
	}

	for (let i = result.length - 1; i > 0; i -= 1) {
		const j = Math.floor(random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
}

export function itemKey(item: Item): string {
	if (item.kind === 'article') return `article-${item.article.id}`;
	if (item.kind === 'project') return `project-${item.id}`;
	return 'disco';
}

// Get homepage items
export function getHomepageItems(): Item[] {
	const homepageArticles = defaultArticles.slice(0, 8);

	const items: Item[] = [
		...homepageArticles.map<Item>((article: Article) => ({ kind: 'article', article })),
		{ kind: 'project', id: 'fakemon' },
		{ kind: 'project', id: 'nuzlocke' },
		{ kind: 'project', id: 'site' },
		{ kind: 'project', id: 'discoProject' },
		{ kind: 'project', id: 'paraglide' },
		{ kind: 'project', id: 'designSystemLab' },
		{ kind: 'project', id: 'commitGarden' },
		{ kind: 'project', id: 'palettePlayground' },
		{ kind: 'project', id: 'a11yAuditKit' },
		{ kind: 'project', id: 'readmeStudio' },
		{ kind: 'disco' }
	];

	return seededShuffle(items, 42);
}

