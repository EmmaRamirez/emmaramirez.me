<script lang="ts">
	import type { FeaturedItem } from '$lib/types/homepage';
	import type { ProjectId } from '$lib/registry/homepage';
	import GridArticleTile from './GridArticleTile.svelte';
	import GridProjectTile from './GridProjectTile.svelte';

	interface Props {
		items: FeaturedItem[];
		selectedArticleSlug: string | null;
		selectedProjectId: ProjectId | null;
		articlePanelOpen: boolean;
		projectPanelOpen: boolean;
		onArticleClick: (articleSlug: string) => void;
		onProjectClick: (projectId: ProjectId) => void;
	}

	let {
		items,
		selectedArticleSlug,
		selectedProjectId,
		articlePanelOpen,
		projectPanelOpen,
		onArticleClick,
		onProjectClick
	}: Props = $props();
</script>

<section aria-label="Quick picks" class="space-y-3">
	<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each items as item (item.kind === 'article' ? `featured-article-${item.article.slug}` : `featured-project-${item.project.id}`)}
			<li>
				{#if item.kind === 'article'}
					<GridArticleTile
						article={item.article}
						variant="featured"
						active={selectedArticleSlug === item.article.slug && articlePanelOpen}
						onselect={() => onArticleClick(item.article.slug)}
					/>
				{:else}
					<GridProjectTile
						project={item.project}
						active={selectedProjectId === item.project.id && projectPanelOpen}
						onselect={() => onProjectClick(item.project.id)}
					/>
				{/if}
			</li>
		{/each}
	</ul>
</section>
