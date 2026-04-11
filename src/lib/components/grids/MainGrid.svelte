<script lang="ts">
	import { dev } from '$app/environment';
	import {
		ApiExplorerBlock,
		DiscoBlock,
		HomeBlock,
		LocationBlock,
		PokemonBlock,
		TopLanguages,
		DesignSystemAd,
		DesignSystemBrowser,
		CityCard
	} from '$lib/components/blocks';
	import { Hero } from '$lib/components/hero';
	import GridArticleTile from './GridArticleTile.svelte';
	import GridProjectTile from './GridProjectTile.svelte';
	import type { GridItem } from '$lib/types/homepage';
	import type { DiscoRegistryEntry, ProjectId } from '$lib/registry/homepage';
	import {
		gridLayoutStore,
		getGridItemSpanClasses,
		getItemKey
	} from '$lib/stores/gridLayoutStore.svelte';
	import { pokemonTeamSettings } from '$lib/stores';
	import {
		getArticleOpen,
		getProjectOpen,
		getSelectedArticleSlug,
		getSelectedProjectId
	} from '$lib/stores/readerPanelStore.svelte';
	import { onMount } from 'svelte';
	import { performanceAnalytics } from '$lib/stores/performanceAnalytics.svelte';

	interface Props {
		items: GridItem[];
		disco: DiscoRegistryEntry;
		designSystemOpen: boolean;
		apiExplorerOpen: boolean;
		onArticleClick: (articleSlug: string) => void;
		onProjectClick: (projectId: ProjectId) => void;
		onDesignSystemClick?: () => void;
		onDesignSystemClose?: () => void;
		onApiExplorerOpen?: () => void;
		onApiExplorerClose?: () => void;
	}

	let {
		items,
		disco,
		designSystemOpen,
		apiExplorerOpen,
		onArticleClick,
		onProjectClick,
		onDesignSystemClick,
		onDesignSystemClose,
		onApiExplorerOpen,
		onApiExplorerClose
	}: Props = $props();

	const selectedArticleSlug = $derived(getSelectedArticleSlug());
	const selectedProjectId = $derived(getSelectedProjectId());
	const articlePanelOpen = $derived(getArticleOpen());
	const projectPanelOpen = $derived(getProjectOpen());
	const activePokemonTeam = $derived(pokemonTeamSettings.team);
	const mainGridMountMeasureId = performanceAnalytics.beginMeasure('render', 'MainGrid mount', {
		source: 'MainGrid'
	});

	const orderedItems = $derived(gridLayoutStore.reorderItems(items));

	onMount(() => {
		gridLayoutStore.initialize(items);
		performanceAnalytics.endMeasure(mainGridMountMeasureId, {
			source: 'MainGrid',
			detail: `${items.length} items`
		});
	});

	function getColSpanClass(item: GridItem): string {
		const key = getItemKey(item);
		const layout = gridLayoutStore.getLayout(key);

		// API Explorer expands to 2x2 when open
		if (item.kind === 'api-explorer' && apiExplorerOpen) {
			return getGridItemSpanClasses(layout, { colSpan: 2, rowSpan: 2 });
		}

		return getGridItemSpanClasses(layout);
	}
</script>

<section aria-label="Essays, projects, and experiments" class="space-y-4">
	<ul class="grid grid-flow-dense grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each orderedItems as item (getItemKey(item))}
			<li class="grid-item h-full {getColSpanClass(item)}">
				<div class="grid-item-content">
					{#if item.kind === 'hero'}
						<Hero />
					{:else if item.kind === 'article'}
						<GridArticleTile
							article={item.article}
							variant="main"
							active={selectedArticleSlug === item.article.slug && articlePanelOpen}
							onselect={() => onArticleClick(item.article.slug)}
						/>
					{:else if item.kind === 'project'}
						<GridProjectTile
							project={item.project}
							active={selectedProjectId === item.project.id && projectPanelOpen}
							onselect={() => onProjectClick(item.project.id)}
						/>
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
							photo="https://images.unsplash.com/photo-1666610278692-51058ed05e9a?auto=format&fit=crop&w=1800&q=80"
							description="Houston skyline at night"
						/>
					{:else if item.kind === 'design-system'}
						{#if designSystemOpen}
							<DesignSystemBrowser inline open={designSystemOpen} onclose={onDesignSystemClose} />
						{:else}
							<DesignSystemAd onclick={onDesignSystemClick} />
						{/if}
					{:else if item.kind === 'pokemon'}
						{#if dev}
							<PokemonBlock team={activePokemonTeam} class="h-full w-full" />
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
</style>
