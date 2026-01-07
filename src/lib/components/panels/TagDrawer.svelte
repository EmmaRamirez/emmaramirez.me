<script lang="ts">
	import { Drawer } from '$lib/components/ui';
	import { formatShortDateAbsolute } from '$lib/utils';

	interface Article {
		id: string;
		title: string;
		content: string;
		date?: string;
		tags?: string[];
	}

	interface TagDrawerProps {
		open?: boolean;
		tag?: string;
		onclose?: () => void;
	}

	let { open = false, tag = '', onclose }: TagDrawerProps = $props();

	const mockArticlesByTag: Record<string, Article[]> = {
		'philosophy': [
			{ id: 'hegel-web-design', title: 'Hegel & Web Design', content: 'As much as web design is a visual medium both restrained and bolstered by technological innovations...', date: '2024-12-01', tags: ['philosophy', 'design'] },
			{ id: 'dialectics-of-ux', title: 'The Dialectics of UX', content: 'Thesis: Users want simplicity. Antithesis: Users want power. Synthesis: Progressive disclosure.', date: '2024-06-15', tags: ['philosophy', 'ux'] },
		],
		'design': [
			{ id: 'hegel-web-design', title: 'Hegel & Web Design', content: 'As much as web design is a visual medium both restrained and bolstered by technological innovations...', date: '2024-12-01', tags: ['philosophy', 'design'] },
			{ id: 'design-systems-in-the-wild', title: 'Design Systems in the Wild', content: 'What happens when a design system escapes the comfy confines of Figma and lands in production?', date: '2024-09-22', tags: ['design', 'systems'] },
			{ id: 'dark-mode-dilemmas', title: 'Dark Mode Dilemmas', content: 'Color tokens, contrast pitfalls, and why your shadows feel wrong at midnight.', date: '2024-08-01', tags: ['design', 'accessibility'] },
			{ id: 'contrast-and-coffee', title: 'Contrast and Coffee', content: 'An early-morning ritual for testing palettes against real content.', date: '2024-02-28', tags: ['design', 'color'] },
		],
		'web': [
			{ id: 'on-personal-sites', title: 'On Personal Sites', content: 'Personal websites are an act of rebellion against the homogenization of the web...', date: '2024-11-15', tags: ['web', 'personal'] },
			{ id: 'perf-budget-playbook', title: 'Performance Budget Playbook', content: 'How I set, track, and defend performance budgets when timelines get tight.', date: '2024-07-14', tags: ['performance', 'web'] },
		],
		'personal': [
			{ id: 'on-personal-sites', title: 'On Personal Sites', content: 'Personal websites are an act of rebellion against the homogenization of the web...', date: '2024-11-15', tags: ['web', 'personal'] },
		],
		'rust': [
			{ id: 'rust-adventures', title: 'Adventures in Rust', content: 'Learning Rust has been a journey of both frustration and enlightenment...', date: '2024-10-28', tags: ['rust', 'programming'] },
		],
		'programming': [
			{ id: 'rust-adventures', title: 'Adventures in Rust', content: 'Learning Rust has been a journey of both frustration and enlightenment...', date: '2024-10-28', tags: ['rust', 'programming'] },
		],
		'svelte': [
			{ id: 'svelte-runes', title: 'Svelte 5 Runes', content: 'Runes represent a fundamental shift in how Svelte handles reactivity...', date: '2024-10-10', tags: ['svelte', 'javascript'] },
		],
		'javascript': [
			{ id: 'svelte-runes', title: 'Svelte 5 Runes', content: 'Runes represent a fundamental shift in how Svelte handles reactivity...', date: '2024-10-10', tags: ['svelte', 'javascript'] },
		],
		'systems': [
			{ id: 'design-systems-in-the-wild', title: 'Design Systems in the Wild', content: 'What happens when a design system escapes the comfy confines of Figma and lands in production?', date: '2024-09-22', tags: ['design', 'systems'] },
		],
		'frontend': [
			{ id: 'notes-from-a-frontend-retreat', title: 'Notes from a Frontend Retreat', content: 'Three days without Wi-Fi forced me to diagram every component by hand.', date: '2024-09-05', tags: ['frontend', 'process'] },
			{ id: 'svg-quirks', title: 'SVG Quirks I Keep Forgetting', content: 'viewBox math, stroke alignment, and why the <use> tag is both a friend and a trap.', date: '2024-06-28', tags: ['svg', 'frontend'] },
		],
		'process': [
			{ id: 'notes-from-a-frontend-retreat', title: 'Notes from a Frontend Retreat', content: 'Three days without Wi-Fi forced me to diagram every component by hand.', date: '2024-09-05', tags: ['frontend', 'process'] },
			{ id: 'shapes-of-side-projects', title: 'The Shapes of Side Projects', content: 'Not every project needs to become a product. A typology of satisfying finishes.', date: '2024-03-16', tags: ['side-projects', 'process'] },
			{ id: 'managing-design-debt', title: 'Managing Design Debt', content: 'Tracking messy corners, prioritizing fixes, and communicating tradeoffs.', date: '2023-12-01', tags: ['design', 'process'] },
		],
		'css': [
			{ id: 'css-grid-love-letter', title: 'A Love Letter to CSS Grid', content: 'Grid has turned layout from a chore into a small act of poetry.', date: '2024-08-18', tags: ['css', 'layout'] },
			{ id: 'css-architecture-notes', title: 'CSS Architecture Notes', content: 'Layered styles, tokens, and when to reach for utilities over components.', date: '2023-12-19', tags: ['css', 'architecture'] },
			{ id: 'refactoring-css-with-intent', title: 'Refactoring CSS with Intent', content: 'How I chip away at legacy styles without pausing feature work.', date: '2023-10-10', tags: ['css', 'refactoring'] },
		],
		'layout': [
			{ id: 'css-grid-love-letter', title: 'A Love Letter to CSS Grid', content: 'Grid has turned layout from a chore into a small act of poetry.', date: '2024-08-18', tags: ['css', 'layout'] },
		],
		'accessibility': [
			{ id: 'dark-mode-dilemmas', title: 'Dark Mode Dilemmas', content: 'Color tokens, contrast pitfalls, and why your shadows feel wrong at midnight.', date: '2024-08-01', tags: ['design', 'accessibility'] },
			{ id: 'a11y-audit-weekend', title: 'A Weekend Accessibility Audit', content: 'I spent 48 hours with a screen reader and came back with a checklist.', date: '2024-05-05', tags: ['accessibility', 'audit'] },
		],
		'performance': [
			{ id: 'perf-budget-playbook', title: 'Performance Budget Playbook', content: 'How I set, track, and defend performance budgets when timelines get tight.', date: '2024-07-14', tags: ['performance', 'web'] },
		],
		'svg': [
			{ id: 'svg-quirks', title: 'SVG Quirks I Keep Forgetting', content: 'viewBox math, stroke alignment, and why the <use> tag is both a friend and a trap.', date: '2024-06-28', tags: ['svg', 'frontend'] },
		],
		'workflow': [
			{ id: 'writing-better-commit-messages', title: 'Writing Better Commit Messages', content: 'Small, narrative commits save future you. A quick rubric I follow for clarity.', date: '2024-06-10', tags: ['workflow', 'git'] },
		],
		'git': [
			{ id: 'writing-better-commit-messages', title: 'Writing Better Commit Messages', content: 'Small, narrative commits save future you. A quick rubric I follow for clarity.', date: '2024-06-10', tags: ['workflow', 'git'] },
		],
		'career': [
			{ id: 'personal-branding-without-cringe', title: 'Personal Branding Without Cringe', content: 'How to show your work online without feeling like a billboard.', date: '2024-05-24', tags: ['career', 'writing'] },
			{ id: 'what-makes-a-good-portfolio', title: 'What Makes a Good Portfolio', content: 'Story, scope, and evidence. A simple checklist for showcasing work.', date: '2023-10-28', tags: ['portfolio', 'career'] },
		],
		'writing': [
			{ id: 'personal-branding-without-cringe', title: 'Personal Branding Without Cringe', content: 'How to show your work online without feeling like a billboard.', date: '2024-05-24', tags: ['career', 'writing'] },
			{ id: 'microcopy-matters', title: 'Microcopy Matters', content: 'Tiny strings guide user confidence. Examples of supportive, precise language.', date: '2024-04-18', tags: ['ux', 'writing'] },
		],
		'audit': [
			{ id: 'a11y-audit-weekend', title: 'A Weekend Accessibility Audit', content: 'I spent 48 hours with a screen reader and came back with a checklist.', date: '2024-05-05', tags: ['accessibility', 'audit'] },
		],
		'ux': [
			{ id: 'microcopy-matters', title: 'Microcopy Matters', content: 'Tiny strings guide user confidence. Examples of supportive, precise language.', date: '2024-04-18', tags: ['ux', 'writing'] },
			{ id: 'dialectics-of-ux', title: 'The Dialectics of UX', content: 'Thesis: Users want simplicity. Antithesis: Users want power. Synthesis: Progressive disclosure.', date: '2024-06-15', tags: ['philosophy', 'ux'] },
		],
		'learning': [
			{ id: 'learning-in-public', title: 'Learning in Public', content: 'Shipping drafts, sharing mistakes, and the upside of leaving footprints.', date: '2024-04-02', tags: ['learning', 'community'] },
		],
		'community': [
			{ id: 'learning-in-public', title: 'Learning in Public', content: 'Shipping drafts, sharing mistakes, and the upside of leaving footprints.', date: '2024-04-02', tags: ['learning', 'community'] },
		],
		'side-projects': [
			{ id: 'shapes-of-side-projects', title: 'The Shapes of Side Projects', content: 'Not every project needs to become a product. A typology of satisfying finishes.', date: '2024-03-16', tags: ['side-projects', 'process'] },
		],
		'color': [
			{ id: 'contrast-and-coffee', title: 'Contrast and Coffee', content: 'An early-morning ritual for testing palettes against real content.', date: '2024-02-28', tags: ['design', 'color'] },
		],
		'creativity': [
			{ id: 'rest-and-creativity', title: 'Rest and Creativity', content: 'Why stepping away from the screen often solves the layout faster.', date: '2024-02-10', tags: ['creativity', 'wellness'] },
		],
		'wellness': [
			{ id: 'rest-and-creativity', title: 'Rest and Creativity', content: 'Why stepping away from the screen often solves the layout faster.', date: '2024-02-10', tags: ['creativity', 'wellness'] },
		],
		'components': [
			{ id: 'component-api-design', title: 'Designing Component APIs', content: 'Prop naming, sensible defaults, and the power of good slots.', date: '2024-01-22', tags: ['components', 'api-design'] },
		],
		'api-design': [
			{ id: 'component-api-design', title: 'Designing Component APIs', content: 'Prop naming, sensible defaults, and the power of good slots.', date: '2024-01-22', tags: ['components', 'api-design'] },
		],
		'debugging': [
			{ id: 'debugging-with-ducks', title: 'Rubber Ducks and Real Bugs', content: 'My favorite questions to ask the duck before opening DevTools.', date: '2024-01-06', tags: ['debugging', 'habits'] },
		],
		'habits': [
			{ id: 'debugging-with-ducks', title: 'Rubber Ducks and Real Bugs', content: 'My favorite questions to ask the duck before opening DevTools.', date: '2024-01-06', tags: ['debugging', 'habits'] },
		],
		'architecture': [
			{ id: 'css-architecture-notes', title: 'CSS Architecture Notes', content: 'Layered styles, tokens, and when to reach for utilities over components.', date: '2023-12-19', tags: ['css', 'architecture'] },
		],
		'product': [
			{ id: 'writing-friendly-release-notes', title: 'Writing Friendly Release Notes', content: 'Release notes can be delightful. Keep them short, human, and linked.', date: '2023-11-12', tags: ['product', 'communication'] },
		],
		'communication': [
			{ id: 'writing-friendly-release-notes', title: 'Writing Friendly Release Notes', content: 'Release notes can be delightful. Keep them short, human, and linked.', date: '2023-11-12', tags: ['product', 'communication'] },
		],
		'portfolio': [
			{ id: 'what-makes-a-good-portfolio', title: 'What Makes a Good Portfolio', content: 'Story, scope, and evidence. A simple checklist for showcasing work.', date: '2023-10-28', tags: ['portfolio', 'career'] },
		],
		'refactoring': [
			{ id: 'refactoring-css-with-intent', title: 'Refactoring CSS with Intent', content: 'How I chip away at legacy styles without pausing feature work.', date: '2023-10-10', tags: ['css', 'refactoring'] },
		],
	};

	const articles = $derived(mockArticlesByTag[tag.toLowerCase()] || []);

</script>

<Drawer {open} {onclose} width="26.25rem">
	{#snippet header()}
		<div>
			<span class="text-xs uppercase tracking-wider text-[var(--liver-brown-500)] font-mono">Articles tagged</span>
			<h2 class="text-2xl font-bold text-[var(--liver-brown-700)] font-serif flex items-center gap-2">
				<span class="text-sm px-3 py-1 rounded-full bg-[var(--sandy-tan-500)] text-[var(--liver-brown-700)] font-mono uppercase tracking-wider">
					{tag}
				</span>
			</h2>
		</div>
	{/snippet}

	{#if articles.length === 0}
		<div class="text-center py-12 text-[var(--liver-brown-500)]">
			<p class="text-lg">No articles found for this tag.</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each articles as article (article.id)}
				<a 
					href="/blog/article" 
					class="block p-4 rounded-lg bg-[var(--transit-yellow-500)] border border-[var(--liver-brown-400)] hover:border-[var(--liver-brown-700)] hover:shadow-md transition-all"
				>
					<h3 class="font-bold text-lg text-[var(--liver-brown-800)] mb-2">{article.title}</h3>
					<p class="text-sm text-[var(--liver-brown-600)] line-clamp-2 mb-3">{article.content}</p>
					<div class="flex items-center justify-between gap-2">
						<div class="flex gap-1 flex-wrap">
							{#each article.tags || [] as articleTag (articleTag)}
								<span 
									class="text-[0.625rem] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider {articleTag.toLowerCase() === tag.toLowerCase() ? 'bg-[var(--liver-brown-500)] text-[var(--sandy-tan-100)]' : 'bg-[var(--sandy-tan-400)] text-[var(--liver-brown-600)]'}"
								>
									{articleTag}
								</span>
							{/each}
						</div>
						{#if article.date}
							<time class="text-xs text-[var(--liver-brown-500)] font-mono whitespace-nowrap">
								{formatShortDateAbsolute(article.date)}
							</time>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</Drawer>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
