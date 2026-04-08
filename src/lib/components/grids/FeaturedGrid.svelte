<script lang="ts">
	import { ArticleCard, ProjectBlock } from '$lib/components/blocks';
	import type { FeaturedItem } from '$lib/types/homepage';
	import type { ProjectId } from '$lib/registry/homepage';

	interface Props {
		items: FeaturedItem[];
		selectedArticleId: string | null;
		selectedProjectId: ProjectId | null;
		articlePanelOpen: boolean;
		projectPanelOpen: boolean;
		onArticleClick: (articleId: string) => void;
		onProjectClick: (projectId: ProjectId) => void;
	}

	let {
		items,
		selectedArticleId,
		selectedProjectId,
		articlePanelOpen,
		projectPanelOpen,
		onArticleClick,
		onProjectClick
	}: Props = $props();
</script>

<section aria-label="Quick picks" class="space-y-3">
	<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each items as item (item.kind === 'article' ? `featured-article-${item.article.id}` : `featured-project-${item.project.id}`)}
			<li>
				{#if item.kind === 'article'}
					<ArticleCard
						variant="featured"
						title={item.article.title}
						content={item.article.content}
						date={item.article.date}
						tags={item.article.tags}
						active={selectedArticleId === item.article.id && articlePanelOpen}
						onselect={() => onArticleClick(item.article.id)}
					/>
				{:else}
					<button
						type="button"
						onclick={() => onProjectClick(item.project.id)}
						class="project-card style-none block h-full text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
						class:project-card-active={selectedProjectId === item.project.id && projectPanelOpen}
					>
						<ProjectBlock
							id={item.project.id}
							title={item.project.title}
							pill={item.project.pill}
							class={item.project.class}
							contentClassName={item.project.contentClassName}
							imageClassName={item.project.imageClassName}
						>
							{#snippet description()}
								{item.project.description}
							{/snippet}
						</ProjectBlock>
					</button>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.project-card {
		cursor: pointer;
		border-radius: 0.5rem;
	}

	.project-card:hover :global(.project-block-content) {
		background: var(--surface-hover);
	}

	.project-card-active :global(.project-block-content) {
		background: var(--surface-hover);
		border-color: var(--text-muted);
	}
</style>
