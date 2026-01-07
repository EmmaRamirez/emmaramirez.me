<script lang="ts">
	import { dev } from '$app/environment';
	import {
		ApiExplorerBlock,
		ArticleCard,
		DiscoBlock,
		HomeBlock,
		LocationBlock,
		PokemonBlock,
		ProjectBlock,
		TopLanguages,
		DesignSystemAd,
		DesignSystemBrowser,
		CityCard
	} from '$lib/components/blocks';
	import { Hero } from '$lib/components/hero';
	import type { GridItem } from '$lib/types/homepage';
	import type { DiscoRegistryEntry, ProjectId } from '$lib/registry/homepage';
	import { pokemonTeam } from '$lib/website.config';
	import { gridLayoutStore, getItemKey } from '$lib/stores/gridLayoutStore.svelte';
	import { onMount } from 'svelte';

	interface Props {
		items: GridItem[];
		disco: DiscoRegistryEntry;
		selectedArticleId: string | null;
		selectedProjectId: ProjectId | null;
		articlePanelOpen: boolean;
		projectPanelOpen: boolean;
		designSystemOpen: boolean;
		apiExplorerOpen: boolean;
		onArticleClick: (articleId: string) => void;
		onProjectClick: (projectId: ProjectId) => void;
		onDesignSystemClick?: () => void;
		onDesignSystemClose?: () => void;
		onApiExplorerOpen?: () => void;
		onApiExplorerClose?: () => void;
	}

	let {
		items,
		disco,
		selectedArticleId,
		selectedProjectId,
		articlePanelOpen,
		projectPanelOpen,
		designSystemOpen,
		apiExplorerOpen,
		onArticleClick,
		onProjectClick,
		onDesignSystemClick,
		onDesignSystemClose,
		onApiExplorerOpen,
		onApiExplorerClose
	}: Props = $props();

	const orderedItems = $derived(gridLayoutStore.reorderItems(items));

	onMount(() => {
		gridLayoutStore.initialize(items);
	});

	function getColSpanClass(item: GridItem): string {
		const key = getItemKey(item);
		const layout = gridLayoutStore.getLayout(key);
		if (!layout) return '';
		
		// API Explorer expands to 2x2 when open
		if (item.kind === 'api-explorer' && apiExplorerOpen) {
			return 'md:col-span-2 row-span-2';
		}
		
		const colClasses = {
			1: '',
			2: 'md:col-span-2',
			3: 'md:col-span-2 lg:col-span-3'
		};
		
		const rowClasses = {
			1: '',
			2: 'row-span-2'
		};
		
		return `${colClasses[layout.colSpan]} ${rowClasses[layout.rowSpan]}`.trim();
	}

</script>

<section aria-label="Essays, projects, and experiments" class="space-y-4">
	<ul
		class="grid grid-flow-dense grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
	>
		{#each orderedItems as item (getItemKey(item))}
			<li class="grid-item h-full {getColSpanClass(item)}">
				<div class="grid-item-content">
					{#if item.kind === 'hero'}
						<Hero />
					{:else if item.kind === 'article'}
						<ArticleCard
							variant="main"
							title={item.article.title}
							content={item.article.content}
							date={item.article.date}
							tags={item.article.tags}
							active={selectedArticleId === item.article.id && articlePanelOpen}
							onselect={() => onArticleClick(item.article.id)}
						/>
					{:else if item.kind === 'project'}
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
						{#if designSystemOpen}
							<DesignSystemBrowser inline open={designSystemOpen} onclose={onDesignSystemClose} />
						{:else}
							<DesignSystemAd onclick={onDesignSystemClick} />
						{/if}
					{:else if item.kind === 'pokemon'}
						{#if dev}
							<PokemonBlock team={pokemonTeam} class="h-full w-full" />
						{/if}
					{:else if item.kind === 'top-languages'}
						<TopLanguages class="h-full w-full" />
					{:else if item.kind === 'location'}
						<LocationBlock class="h-full w-full" />
					{:else if item.kind === 'api-explorer'}
						<ApiExplorerBlock 
							open={apiExplorerOpen} 
							onopen={onApiExplorerOpen}
							onclose={onApiExplorerClose}
							class="h-full w-full" 
						/>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	.grid-item {
		position: relative;
	}

	.grid-item-content {
		height: 100%;
		width: 100%;
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
