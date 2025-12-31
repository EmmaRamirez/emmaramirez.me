<script lang="ts">
	import { ProjectBlock } from '$lib/components/blocks';
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

	function formatDate(dateStr: string | undefined) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<section aria-label="Quick picks" class="space-y-3">
	<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each items as item (item.kind === 'article'
			? `featured-article-${item.article.id}`
			: `featured-project-${item.project.id}`)}
			<li>
				{#if item.kind === 'article'}
					<button
						type="button"
						onclick={() => onArticleClick(item.article.id)}
						class="article-card style-none flex h-full w-full flex-col gap-1.5 rounded-lg p-4 text-left transition-all duration-200 hover:bg-(--surface-hover) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
						class:article-card-active={selectedArticleId === item.article.id && articlePanelOpen}
					>
						<span class="text-xs font-semibold uppercase tracking-[0.18em] text-(--text-secondary)">
							Article
						</span>
						<span class="text-base leading-snug font-semibold text-(--text-primary)">
							{item.article.title}
						</span>
						{#if item.article.date}
							<time class="text-xs text-(--text-secondary)" datetime={item.article.date}>
								{formatDate(item.article.date)}
							</time>
						{/if}
						<p class="line-clamp-3 text-sm leading-relaxed text-(--text-muted)">
							{item.article.content}
						</p>
					</button>
				{:else}
					<button
						type="button"
						onclick={() => onProjectClick(item.project.id)}
						class="project-card style-none block h-full text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
						class:project-card-active={selectedProjectId === item.project.id && projectPanelOpen}
					>
						<ProjectBlock
							title={item.project.title}
							pill={item.project.pill}
							class={item.project.class}
							contentClassName={item.project.contentClassName}
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
	.article-card {
		cursor: pointer;
		border: 1px solid var(--border-color);
		background: var(--surface);
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.article-card:hover {
		border-color: var(--text-muted);
		box-shadow: 0 0 0 1px var(--text-muted);
	}

	.article-card-active {
		background: var(--surface-hover);
		border-color: var(--text-muted);
		box-shadow: 0 0 0 1px var(--text-muted);
	}

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
