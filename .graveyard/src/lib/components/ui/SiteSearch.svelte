<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { defaultArticles } from '$lib/articles';
	import { Omnibar } from '$lib/components/panels';
	import { projectRegistry, type ProjectId } from '$lib/registry/homepage';
	import type { GridItem } from '$lib/types/homepage';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let open = $state(false);

	const items = $derived.by(
		(): GridItem[] => [
			...defaultArticles.map((article) => ({ kind: 'article' as const, article })),
			...Object.values(projectRegistry).map((project) => ({ kind: 'project' as const, project }))
		]
	);

	async function navigateToArticle(articleSlug: string) {
		open = false;
		await goto(resolve('/blog/[slug]', { slug: articleSlug }));
	}

	async function navigateToProject(projectId: ProjectId) {
		open = false;
		const projectPath = resolve('/projects/project');
		window.location.assign(`${projectPath}?id=${encodeURIComponent(projectId)}`);
	}
</script>

<button
	type="button"
	onclick={() => (open = true)}
	class={`search-trigger ml-2 flex items-center gap-2 rounded-lg border border-(--border-color) bg-(--surface) px-2.5 py-1.5 text-sm text-(--text-muted) transition-all hover:border-(--text-muted) hover:text-(--text-primary) md:ml-3 ${className}`}
	aria-label="Open search"
>
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
	<span class="hidden sm:inline">Search</span>
	<kbd
		class="hidden rounded bg-(--page-bg) px-1.5 py-0.5 font-mono text-[0.65rem] text-(--text-muted) sm:inline"
		>⌘K</kbd
	>
</button>

<Omnibar
	bind:open
	{items}
	onArticleSelect={(articleSlug) => void navigateToArticle(articleSlug)}
	onProjectSelect={(projectId) => void navigateToProject(projectId)}
/>
