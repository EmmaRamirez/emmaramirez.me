<script lang="ts">
	import { cn } from '$lib/utils';
	import ArticleBlock from './ArticleBlock.svelte';
	import TagDrawer from './TagDrawer.svelte';

	interface Article {
		id: string;
		title: string;
		content: string;
		date?: string;
		tags?: string[];
	}

	interface ArticlesProps {
		articles?: Article[];
		class?: string;
	}

	let { articles = [], class: className }: ArticlesProps = $props();

	let drawerOpen = $state(false);
	let selectedTag = $state('');

	function handleTagClick(tag: string) {
		selectedTag = tag;
		drawerOpen = true;
	}

	function closeDrawer() {
		drawerOpen = false;
	}

	// Default articles if none provided
	const defaultArticles: Article[] = [
		{
			id: 'hegel-web-design',
			title: 'Hegel & Web Design',
			content: 'As much as web design is a visual medium both restrained and bolstered by technological innovations, I find that it cycles in the same way art movements do. German philosopher Friedrich Hegel split up history into three moments: the thesis, the antithesis, and the synthesis.',
			date: '2024-12-01',
			tags: ['philosophy', 'design']
		},
		{
			id: 'on-personal-sites',
			title: 'On Personal Sites',
			content: 'Personal websites are an act of rebellion against the homogenization of the web. They are messy, idiosyncratic, and deeply human. In an era of social media profiles that all look the same, a personal site is a statement of individuality.',
			date: '2024-11-15',
			tags: ['web', 'personal']
		},
		{
			id: 'rust-adventures',
			title: 'Adventures in Rust',
			content: 'Learning Rust has been a journey of both frustration and enlightenment. The borrow checker, once an adversary, has become a trusted companion that catches my mistakes before they become runtime nightmares.',
			date: '2024-10-28',
			tags: ['rust', 'programming']
		},
		{
			id: 'svelte-runes',
			title: 'Svelte 5 Runes',
			content: 'Runes represent a fundamental shift in how Svelte handles reactivity. Moving from implicit to explicit reactivity might seem like a step backward, but it opens up new possibilities for composition and clarity.',
			date: '2024-10-10',
			tags: ['svelte', 'javascript']
		},
		{
			id: 'design-systems-in-the-wild',
			title: 'Design Systems in the Wild',
			content: 'What happens when a design system escapes the comfy confines of Figma and lands in production? Lots of duct tape, delight, and a few sharp corners.',
			date: '2024-09-22',
			tags: ['design', 'systems']
		},
		{
			id: 'notes-from-a-frontend-retreat',
			title: 'Notes from a Frontend Retreat',
			content: 'Three days without Wi-Fi forced me to diagram every component by hand. It was surprisingly clarifying.',
			date: '2024-09-05',
			tags: ['frontend', 'process']
		},
		{
			id: 'css-grid-love-letter',
			title: 'A Love Letter to CSS Grid',
			content: 'Grid has turned layout from a chore into a small act of poetry. Here are patterns I reach for weekly.',
			date: '2024-08-18',
			tags: ['css', 'layout']
		},
		{
			id: 'dark-mode-dilemmas',
			title: 'Dark Mode Dilemmas',
			content: 'Color tokens, contrast pitfalls, and why your shadows feel wrong at midnight.',
			date: '2024-08-01',
			tags: ['design', 'accessibility']
		},
		{
			id: 'perf-budget-playbook',
			title: 'Performance Budget Playbook',
			content: 'How I set, track, and defend performance budgets when timelines get tight.',
			date: '2024-07-14',
			tags: ['performance', 'web']
		},
		{
			id: 'svg-quirks',
			title: 'SVG Quirks I Keep Forgetting',
			content: 'viewBox math, stroke alignment, and why the <use> tag is both a friend and a trap.',
			date: '2024-06-28',
			tags: ['svg', 'frontend']
		},
		{
			id: 'writing-better-commit-messages',
			title: 'Writing Better Commit Messages',
			content: 'Small, narrative commits save future you. A quick rubric I follow for clarity.',
			date: '2024-06-10',
			tags: ['workflow', 'git']
		},
		{
			id: 'personal-branding-without-cringe',
			title: 'Personal Branding Without Cringe',
			content: 'How to show your work online without feeling like a billboard.',
			date: '2024-05-24',
			tags: ['career', 'writing']
		},
		{
			id: 'a11y-audit-weekend',
			title: 'A Weekend Accessibility Audit',
			content: 'I spent 48 hours with a screen reader and came back with a checklist.',
			date: '2024-05-05',
			tags: ['accessibility', 'audit']
		},
		{
			id: 'microcopy-matters',
			title: 'Microcopy Matters',
			content: 'Tiny strings guide user confidence. Examples of supportive, precise language.',
			date: '2024-04-18',
			tags: ['ux', 'writing']
		},
		{
			id: 'learning-in-public',
			title: 'Learning in Public',
			content: 'Shipping drafts, sharing mistakes, and the upside of leaving footprints.',
			date: '2024-04-02',
			tags: ['learning', 'community']
		},
		{
			id: 'shapes-of-side-projects',
			title: 'The Shapes of Side Projects',
			content: 'Not every project needs to become a product. A typology of satisfying finishes.',
			date: '2024-03-16',
			tags: ['side-projects', 'process']
		},
		{
			id: 'contrast-and-coffee',
			title: 'Contrast and Coffee',
			content: 'An early-morning ritual for testing palettes against real content.',
			date: '2024-02-28',
			tags: ['design', 'color']
		},
		{
			id: 'rest-and-creativity',
			title: 'Rest and Creativity',
			content: 'Why stepping away from the screen often solves the layout faster.',
			date: '2024-02-10',
			tags: ['creativity', 'wellness']
		},
		{
			id: 'component-api-design',
			title: 'Designing Component APIs',
			content: 'Prop naming, sensible defaults, and the power of good slots.',
			date: '2024-01-22',
			tags: ['components', 'api-design']
		},
		{
			id: 'debugging-with-ducks',
			title: 'Rubber Ducks and Real Bugs',
			content: 'My favorite questions to ask the duck before opening DevTools.',
			date: '2024-01-06',
			tags: ['debugging', 'habits']
		},
		{
			id: 'css-architecture-notes',
			title: 'CSS Architecture Notes',
			content: 'Layered styles, tokens, and when to reach for utilities over components.',
			date: '2023-12-19',
			tags: ['css', 'architecture']
		},
		{
			id: 'managing-design-debt',
			title: 'Managing Design Debt',
			content: 'Tracking messy corners, prioritizing fixes, and communicating tradeoffs.',
			date: '2023-12-01',
			tags: ['design', 'process']
		},
		{
			id: 'writing-friendly-release-notes',
			title: 'Writing Friendly Release Notes',
			content: 'Release notes can be delightful. Keep them short, human, and linked.',
			date: '2023-11-12',
			tags: ['product', 'communication']
		},
		{
			id: 'what-makes-a-good-portfolio',
			title: 'What Makes a Good Portfolio',
			content: 'Story, scope, and evidence. A simple checklist for showcasing work.',
			date: '2023-10-28',
			tags: ['portfolio', 'career']
		},
		{
			id: 'refactoring-css-with-intent',
			title: 'Refactoring CSS with Intent',
			content: 'How I chip away at legacy styles without pausing feature work.',
			date: '2023-10-10',
			tags: ['css', 'refactoring']
		}
	];

	const displayArticles = $derived(articles.length > 0 ? articles : defaultArticles);
</script>

<div class={cn("articles-container", className)}>
	<header class="articles-header mb-6">
		<h2 class="text-3xl font-bold text-[var(--liver-brown-700)] font-serif tracking-tight">
			Articles
		</h2>
		<p class="text-[var(--liver-brown-500)] mt-1 text-lg opacity-80">
			Thoughts, explorations, and musings
		</p>
	</header>

	<div class="articles-grid grid gap-6 md:grid-cols-2">
		{#each displayArticles as article (article.id)}
			<ArticleBlock
				title={article.title}
				content={article.content}
				date={article.date}
				tags={article.tags}
				width="lg"
				articleId={article.id}
				class="h-full hover:border-[var(--liver-brown-700)] hover:shadow-md"
				contentClass="line-clamp-4"
				ontagclick={handleTagClick}
			/>
		{/each}
	</div>

	<TagDrawer open={drawerOpen} tag={selectedTag} onclose={closeDrawer} />

	{#if displayArticles.length === 0}
		<div class="empty-state text-center py-12 text-[var(--liver-brown-500)]">
			<p class="text-xl">No articles yet.</p>
			<p class="text-sm opacity-70 mt-2">Check back soon for new content.</p>
		</div>
	{/if}
</div>

<style>
	.articles-container {
		padding: 1rem;
	}

	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>

