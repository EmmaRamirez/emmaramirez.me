<script lang="ts">
	import { dev } from '$app/environment';
	import {
		DiscoBlock,
		HomeBlock,
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
		onArticleClick: (articleId: string) => void;
		onProjectClick: (projectId: ProjectId) => void;
		onDesignSystemClick?: () => void;
		onDesignSystemClose?: () => void;
	}

	let {
		items,
		disco,
		selectedArticleId,
		selectedProjectId,
		articlePanelOpen,
		projectPanelOpen,
		designSystemOpen,
		onArticleClick,
		onProjectClick,
		onDesignSystemClick,
		onDesignSystemClose
	}: Props = $props();

	const orderedItems = $derived(gridLayoutStore.reorderItems(items));

	onMount(() => {
		gridLayoutStore.initialize(items);
	});

	function getColSpanClass(item: GridItem): string {
		const key = getItemKey(item);
		const layout = gridLayoutStore.getLayout(key);
		if (!layout) return '';
		
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

	function formatDate(dateStr: string | undefined) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
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
						<button
							type="button"
							onclick={() => onArticleClick(item.article.id)}
							class="article-card style-none flex h-full w-full flex-col gap-2 rounded-lg p-4 text-left transition-all duration-200 hover:bg-(--surface-hover) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
							class:article-card-active={selectedArticleId === item.article.id && articlePanelOpen}
						>
							<span class="text-xs font-semibold uppercase tracking-[0.18em] text-(--text-secondary)">
								Article
							</span>
							<span class="text-lg leading-snug font-semibold text-(--text-primary)">
								{item.article.title}
							</span>
							{#if item.article.date}
								<time class="text-sm text-(--text-secondary)" datetime={item.article.date}>
									{formatDate(item.article.date)}
								</time>
							{/if}
							<p class="line-clamp-4 text-base leading-relaxed text-(--text-muted)">
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
