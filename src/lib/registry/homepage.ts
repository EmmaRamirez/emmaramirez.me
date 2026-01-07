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
	| 'kj-photography'
	| 'designSystemLab'
	| 'commitGarden'
	| 'palettePlayground'
	| 'a11yAuditKit'
	| 'readmeStudio';

export type ItemKind = 'article' | 'project' | 'disco';

export type ProjectStatus = 'active' | 'archived' | 'experiment';

export interface ProjectLinks {
	github?: string;
	demo?: string;
	website?: string;
}

export interface ProjectRegistryEntry {
	kind: 'project';
	id: ProjectId;
	title: string;
	pill: string;
	image: string;
	description: string;
	content?: string;
	technologies?: string[];
	links?: ProjectLinks;
	year?: string;
	status?: ProjectStatus;
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

export const projectRegistry: Record<ProjectId, ProjectRegistryEntry> = {
	nuzlocke: {
		kind: 'project',
		id: 'nuzlocke',
		title: 'nuzlocke-generator',
		pill: 'nuzlocke templating engine',
		image: profileImage,
		description: 'highly collaborative, customizable image generator for Pokémon Nuzlocke challenges. built with React and Elixir. has over 10k users and vibrant community.',
		content: `The Nuzlocke Generator started as a weekend project born from my own frustration with tracking Pokémon runs. Nuzlocke challenges add permadeath and catch limits to the games, and keeping track of everything on paper felt wrong for 2024.

The tool lets you design custom layouts for your team, encounters, and graveyard. Drag-and-drop reordering, automatic type matchup hints, and a clean export for sharing on social media.

What I'm proudest of is the constraint system—you can define your own rules and the UI adapts. Want a soul link run with a friend? The generator knows how to pair your catches. Randomizer with level caps? It'll warn you before you overlevel.

The trickiest part was making it feel fast. React's reconciliation kept causing jank during drag operations, so I ended up with a hybrid approach: optimistic local state for interactions, synced back to the main store on drop.`,
		technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Framer Motion'],
		links: {
			github: 'https://github.com/emzinnia/nuzlocke-generator',
			demo: 'https://nuzlocke-generator.com'
		},
		year: '2024',
		status: 'active',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: ''
	},
	fakemon: {
		kind: 'project',
		id: 'fakemon',
		title: 'fakemon-generator',
		pill: 'Creative coding',
		image: profileImage,
		description: 'A playful generator for imaginary Pokémon-style creatures, blending design systems, randomness, and cozy UI details.',
		content: `Fakemon Generator is what happens when you combine too much free time, a love for creature design, and a fascination with procedural generation.

The generator creates unique monster concepts by mixing type combinations, body shapes, and design motifs. It doesn't draw them—that's still on the human—but it gives you a starting point that's more interesting than "fire lizard #47."

Under the hood, it's a weighted random system with some guardrails. Certain type combos are rarer, some motifs only appear with specific types, and there's a "coherence score" that tries to keep suggestions from getting too chaotic.

The UI leans cozy: soft colors, rounded corners, little animations when a new creature rolls. I wanted it to feel like a toy you'd keep on your desk, not a productivity tool.`,
		technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Canvas API'],
		links: {
			github: 'https://github.com/emzinnia/fakemon-generator',
			demo: 'https://fakemon.emmaramirez.me'
		},
		year: '2024',
		status: 'active',
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
		content: `You're looking at it. This site is my playground for testing ideas before they make it into "real" projects.

The design system started as a port of my previous Tailwind setup, but I've been gradually replacing utility classes with CSS custom properties and semantic tokens. The goal is a system that's easy to theme and hard to break.

Typography uses a fluid scale based on viewport width, with fallbacks that keep things readable on both phone screens and ultrawide monitors. The serif/sans pairing (Source Serif 4 and a clean system stack) came from wanting something that felt editorial without being stuffy.

The homepage layout is intentionally weird. Cards don't align to a strict grid—they're shuffled with a seeded random function so the chaos is consistent across page loads. It's a small rebellion against the LinkedIn-ification of personal sites.

SvelteKit makes the whole thing feel snappy. Most interactions happen client-side with optimistic updates, and the build output is small enough that I don't worry about performance budgets.`,
		technologies: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'CSS Custom Properties'],
		links: {
			github: 'https://github.com/emzinnia/emzinnia.dev',
			website: 'https://emmaramirez.me'
		},
		year: '2024',
		status: 'active',
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
		content: `Disco Canvas is what I reach for when I need to decompress from "serious" work. It's a browser-based canvas where you can paint with gradients, spawn wobbly blobs, and watch them bounce around like they're at a party.

The physics are deliberately soft—collisions don't have harsh bounces, and objects slow down with gentle friction. I wanted the whole thing to feel like playing with soap bubbles.

Technically, it's a mix of Canvas 2D for the background gradients and DOM elements for the blobs (easier to style with CSS filters). The animation loop uses requestAnimationFrame with a fixed timestep so things don't go haywire on high-refresh displays.

There's no save feature, no export, no share button. It's ephemeral by design. You make something pretty, it exists for a moment, and then you refresh and start over.`,
		technologies: ['Svelte', 'Canvas API', 'CSS Animations', 'Web Audio API'],
		links: {
			github: 'https://github.com/emzinnia/disco-canvas',
			demo: 'https://disco.emmaramirez.me'
		},
		year: '2024',
		status: 'experiment',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	},
	'kj-photography': {
		kind: 'project',
		id: 'kj-photography',
		title: 'kj.photography',
		pill: 'interactive photography portfolio',
		image: profileImage,
		description: 'photography portfolio built with SvelteKit, ThreeJS, and Convex DB',
		content: `I built the KJ Photography portfolio to showcase my photography and share my passion for the art.`,
		technologies: ['SvelteKit', 'ThreeJS', 'Convex DB'],
		links: {
			github: 'https://github.com/emzinnia/paraglide-playground',
			demo: 'https://paraglide.emmaramirez.me'
		},
		year: '2024',
		status: 'experiment',
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
		content: `Design System Lab is where I test component APIs before committing to them in real projects. It's a Storybook-like environment built with SvelteKit, but tailored to how I actually work.

Each component lives in isolation with a playground page that shows all its variants. The page is generated from a schema, so adding a new prop automatically updates the demo. No manual story maintenance.

Token management uses CSS custom properties with a build step that generates TypeScript types. If you reference a token that doesn't exist, the compiler yells at you.

The documentation is collocated with components—each .svelte file can have a companion .md that gets rendered in the playground. I got tired of docs drifting out of sync with implementations.

Current experiments: a "recipe" system for composing components (like Chakra's patterns), and a visual regression testing setup using Playwright screenshots.`,
		technologies: ['SvelteKit', 'TypeScript', 'CSS Custom Properties', 'MDsveX', 'Playwright'],
		links: {
			github: 'https://github.com/emzinnia/design-system-lab'
		},
		year: '2024',
		status: 'active',
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
		content: `Commit Garden grew from my frustration with my own git habits. I'd work for hours, then dump everything into a single "WIP" commit. The history was useless for understanding what changed and why.

The tool visualizes your commit history as a garden. Small, focused commits are flowers; large, unfocused ones are weeds. Over time, you can see whether you're cultivating a nice garden or letting it go wild.

It runs as a local dashboard that watches your repos. Each commit gets scored on size (additions + deletions), scope (how many files touched), and message quality (does it explain the why, not just the what?).

The gamification is subtle—no achievements or leaderboards, just a slowly growing garden that reflects your habits. I found that seeing the visual representation changed my behavior more than any linter rule ever did.`,
		technologies: ['Node.js', 'TypeScript', 'Svelte', 'Git CLI', 'SQLite'],
		links: {
			github: 'https://github.com/emzinnia/commit-garden'
		},
		year: '2023',
		status: 'archived',
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
		content: `Palette Playground is the tool I wished existed when I was designing color systems. Most palette generators give you pretty swatches that fall apart the moment you apply them to actual UI.

This one works differently. You build your palette while looking at real components: cards, buttons, forms, text blocks. Change a color and watch how it ripples through the entire preview.

Accessibility is baked in. Every color combination shows its contrast ratio, and the tool warns you when text becomes unreadable. There's also a simulation mode for different types of color vision deficiency.

Dark mode isn't an afterthought—you can toggle between light and dark and see how your palette holds up. The tool suggests adjustments when your dark theme looks washed out or your light theme looks muddy.

Export options include CSS custom properties, Tailwind config, and Figma-compatible JSON.`,
		technologies: ['Svelte', 'TypeScript', 'Color.js', 'CSS Custom Properties'],
		links: {
			github: 'https://github.com/emzinnia/palette-playground',
			demo: 'https://palette.emmaramirez.me'
		},
		year: '2024',
		status: 'active',
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
		content: `A11y Audit Kit started as a personal checklist that got out of hand. I wanted something between "run axe and call it a day" and "hire an expert for a full WCAG audit."

The toolkit walks you through common accessibility issues: keyboard navigation, screen reader compatibility, color contrast, focus management, form labels. Each item has a quick test you can run and an explanation of why it matters.

It's opinionated about what to check first. The "quick wins" section covers issues that affect the most users with the least effort to fix. The "deep dives" section handles more complex patterns like live regions and complex widgets.

Progress is saved locally, so you can audit over multiple sessions. At the end, you get a report summarizing what passed, what failed, and what needs a human judgment call.

I use this as a pre-launch checklist for every project now.`,
		technologies: ['SvelteKit', 'TypeScript', 'axe-core', 'Local Storage'],
		links: {
			github: 'https://github.com/emzinnia/a11y-audit-kit',
			demo: 'https://a11y.emmaramirez.me'
		},
		year: '2024',
		status: 'active',
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
		content: `README Studio exists because I kept writing the same mediocre README over and over. Copy the template, fill in the blanks, publish, forget.

This tool is different. Instead of a template, it asks you questions: What problem does this solve? Who is it for? What's the first thing someone should try? Your answers become sections, and the editor helps you refine the language.

The tone checker flags jargon, passive voice, and unnecessarily long sentences. It's not trying to make every README sound the same—it just nudges you toward clarity.

There's also a preview mode that shows how your README will render on GitHub, npm, and documentation sites. Different platforms have different quirks, and catching formatting issues before publishing is worth the extra step.

Export is a single markdown file. No lock-in, no special syntax. The tool gets out of your way once you're done.`,
		technologies: ['SvelteKit', 'TypeScript', 'Prosemirror', 'Marked'],
		links: {
			github: 'https://github.com/emzinnia/readme-studio',
			demo: 'https://readme.emmaramirez.me'
		},
		year: '2024',
		status: 'experiment',
		class: 'h-full',
		contentClassName: 'md:flex-row md:items-center',
		imageClassName: 'md:translate-x-0 md:ml-4'
	}
};

export function getAllProjects(): ProjectRegistryEntry[] {
	return Object.values(projectRegistry);
}

export const projectIds: ProjectId[] = [
	'nuzlocke',
	'fakemon',
	'site',
	'discoProject',
	'kj-photography',
	'designSystemLab',
	'commitGarden',
	'palettePlayground',
	'a11yAuditKit',
	'readmeStudio'
];

export const articleRegistry: Record<string, ArticleRegistryEntry> = Object.fromEntries(
	defaultArticles.map((article) => [
		article.id,
		{
			kind: 'article',
			articleId: article.id
		}
	])
) as Record<string, ArticleRegistryEntry>;

export const discoRegistry: DiscoRegistryEntry = {
	kind: 'disco',
	image: discoImage,
	alt: 'Disco photo',
	caption: 'Disco vibes',
	class: 'w-full h-full'
};

export const homepageRegistry: HomepageRegistry = {
	projects: projectRegistry,
	articles: articleRegistry,
	disco: discoRegistry
};

export function getProject(id: ProjectId): ProjectRegistryEntry {
	return projectRegistry[id];
}

export function getArticle(id: string): Article | undefined {
	return defaultArticles.find((article) => article.id === id);
}

export function getDisco(): DiscoRegistryEntry {
	return discoRegistry;
}

export type Item =
	| { kind: 'article'; article: Article }
	| { kind: 'project'; id: ProjectId }
	| { kind: 'disco' };

export function seededShuffle<T>(items: T[], seed: number): T[] {
	const result = items.slice();

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

export function getHomepageItems(): Item[] {
	const homepageArticles = defaultArticles.slice(0, 8);

	const items: Item[] = [
		...homepageArticles.map<Item>((article: Article) => ({ kind: 'article', article })),
		{ kind: 'project', id: 'fakemon' },
		{ kind: 'project', id: 'nuzlocke' },
		{ kind: 'project', id: 'site' },
		{ kind: 'project', id: 'discoProject' },
		{ kind: 'project', id: 'kj-photography' },
		{ kind: 'project', id: 'designSystemLab' },
		{ kind: 'project', id: 'commitGarden' },
		{ kind: 'project', id: 'palettePlayground' },
		{ kind: 'project', id: 'a11yAuditKit' },
		{ kind: 'project', id: 'readmeStudio' },
		{ kind: 'disco' }
	];

	return seededShuffle(items, 42);
}
