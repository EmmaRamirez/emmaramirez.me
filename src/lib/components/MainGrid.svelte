<script lang="ts">
	import { dev } from '$app/environment';
	import DiscoBlock from './DiscoBlock.svelte';
	import HomeBlock from './HomeBlock.svelte';
	import PokemonBlock from './PokemonBlock.svelte';
	import ProjectBlock from './ProjectBlock.svelte';
	import TopLanguages from './TopLanguages.svelte';
	import DesignSystemAd from './DesignSystemAd.svelte';
	import CityCard from './CityCard.svelte';
	import type { GridItem } from '$lib/types/homepage';
	import type { DiscoRegistryEntry, ProjectId } from '$lib/registry/homepage';
	import { pokemonTeam } from '$lib/website.config';

	interface Props {
		items: GridItem[];
		disco: DiscoRegistryEntry;
		selectedArticleId: string | null;
		selectedProjectId: ProjectId | null;
		articlePanelOpen: boolean;
		projectPanelOpen: boolean;
		onArticleClick: (articleId: string) => void;
		onProjectClick: (projectId: ProjectId) => void;
	}

	let {
		items,
		disco,
		selectedArticleId,
		selectedProjectId,
		articlePanelOpen,
		projectPanelOpen,
		onArticleClick,
		onProjectClick
	}: Props = $props();

	function getItemKey(item: GridItem): string {
		if (item.kind === 'article') return `article-${item.article.id}`;
		if (item.kind === 'project') return `project-${item.project.id}`;
		return item.kind;
	}

	function getColSpanClass(item: GridItem): string {
		if (item.kind === 'home') return 'lg:col-span-2 lg:row-span-2';
		if (item.kind === 'city') return 'lg:col-span-3';
		if (item.kind === 'design-system') return 'lg:col-span-2';
		return '';
	}
</script>

<section aria-label="Essays, projects, and experiments" class="space-y-4">
	<ul class="grid grid-flow-dense grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each items as item (getItemKey(item))}
			<li class={`h-full ${getColSpanClass(item)}`}>
				{#if item.kind === 'article'}
					<button
						type="button"
						onclick={() => onArticleClick(item.article.id)}
						class="article-card style-none flex h-full w-full flex-col gap-2 rounded-lg p-4 text-left transition-all duration-200 hover:bg-(--surface-hover) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
						class:article-card-active={selectedArticleId === item.article.id && articlePanelOpen}
					>
						<span class="text-lg leading-snug font-semibold text-(--text-primary)">
							{item.article.title}
						</span>
						{#if item.article.date}
							<span class="text-sm text-(--text-secondary)">
								{item.article.date}
							</span>
						{/if}
						<p class="line-clamp-3 text-base leading-relaxed text-(--text-muted)">
							{item.article.content}
						</p>
					</button>
				{:else if item.kind === 'project'}
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
				{:else if item.kind === 'disco'}
					<DiscoBlock
						image={disco.image}
						alt={disco.alt}
						caption={disco.caption}
						class={disco.class ?? 'h-full w-full'}
					/>
				{:else if item.kind === 'home'}
					<HomeBlock class="h-full w-full" />
				{:else if item.kind === 'city'}
					<CityCard
						src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1800&q=80"
						alt="Houston skyline at dusk"
						location="Houston"
					/>
				{:else if item.kind === 'design-system'}
					<DesignSystemAd />
				{:else if item.kind === 'pokemon'}
					{#if dev}
						<PokemonBlock team={pokemonTeam} class="h-full w-full" />
					{/if}
				{:else if item.kind === 'top-languages'}
					<TopLanguages class="h-full w-full" />
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
	}

	.article-card-active {
		background: var(--surface-hover);
		border-color: var(--border-color);
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

