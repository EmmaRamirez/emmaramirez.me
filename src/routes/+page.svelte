<script lang="ts">
	import DiscoBlock from '$lib/components/blocks/DiscoBlock.svelte';
	import DoodleBlock from '$lib/components/blocks/DoodleBlock.svelte';
	import HoustonBlock from '$lib/components/blocks/HoustonBlock.svelte';
	import PokemonBlock from '$lib/components/blocks/PokemonBlock.svelte';
	import SubgridBlock from '$lib/components/blocks/SubgridBlock.svelte';
	import WelcomeInternetBlock from '$lib/components/blocks/WelcomeInternetBlock.svelte';
	import HomeBlock from '$lib/components/blocks/site/HomeBlock.svelte';
	import { homepageBlocks } from '$lib/registry/homepage';
	import type { HomepageBlock, HomepageBlockPlacement } from '$lib/types/homepage';
	import RedesigningArticle from './article/redesigning-article/RedesigningArticle.svelte';

	function getGridLine({ columnSpan, columnStart }: HomepageBlockPlacement) {
		return columnStart && columnStart !== 'auto'
			? `${columnStart} / span ${columnSpan}`
			: `span ${columnSpan}`;
	}

	function getGridRow({ rowSpan, rowStart }: HomepageBlockPlacement) {
		return rowStart && rowStart !== 'auto' ? `${rowStart} / span ${rowSpan}` : `span ${rowSpan}`;
	}

	function getBlockElement(block: HomepageBlock): 'article' | 'div' {
		return block.kind === 'redesigning-article' ? 'div' : 'article';
	}

	function getContentClass(block: HomepageBlock, baseClass = 'h-full w-full') {
		return [baseClass, block.settings?.contentClassName].filter(Boolean).join(' ');
	}
</script>

<svelte:head>
	<title>EMZINNIA</title>
	<meta name="description" content="emzinnia's personal site, projects, essays, and experiments." />
</svelte:head>

<section class="home-page" aria-label="Homepage highlights">
	<div class="home-grid">
		{#each homepageBlocks as block (block.id)}
			<svelte:element
				this={getBlockElement(block)}
				class={['home-grid__block', block.settings?.className]}
				aria-hidden={block.settings?.decorative ? 'true' : undefined}
				aria-label={
					block.kind === 'redesigning-article' || block.settings?.decorative
						? undefined
						: block.settings?.ariaLabel
				}
				aria-labelledby={block.settings?.labelledBy}
				style:--home-block-column={getGridLine(block.layout.desktop)}
				style:--home-block-row={getGridRow(block.layout.desktop)}
				style:--home-block-min-height={block.layout.minHeight ?? 'auto'}
				style:--home-block-mobile-min-height={block.layout.mobileMinHeight ?? 'auto'}
				style:--home-block-overflow={block.layout.overflow ?? 'hidden'}
			>
				{#if block.kind === 'welcome-internet'}
					<WelcomeInternetBlock class={getContentClass(block)} />
				{:else if block.kind === 'home'}
					<HomeBlock class={getContentClass(block)} />
				{:else if block.kind === 'redesigning-article'}
					<RedesigningArticle />
				{:else if block.kind === 'disco'}
					<DiscoBlock
						class={getContentClass(block, '')}
						image={block.settings.image}
						alt={block.settings.alt}
						caption={block.settings.caption}
					/>
				{:else if block.kind === 'empty'}
					<div class="home-grid__empty-card" aria-hidden="true"></div>
				{:else if block.kind === 'pokemon'}
					<PokemonBlock class={getContentClass(block)} />
				{:else if block.kind === 'subgrid'}
					<SubgridBlock class={getContentClass(block)} />
				{:else if block.kind === 'houston'}
					<HoustonBlock class={getContentClass(block)} />
				{:else if block.kind === 'doodle'}
					<DoodleBlock class={getContentClass(block)} />
				{/if}
			</svelte:element>
		{/each}
	</div>
</section>

<style>
	.home-page {
		width: min(100%, 72rem);
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.home-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
		grid-auto-rows: minmax(12rem, auto);
		gap: 1.5rem;
		align-items: stretch;
		font-family: 'Pixelify Sans', var(--font-sans);
	}

	.home-grid__block {
		min-width: 0;
		min-height: var(--home-block-mobile-min-height, auto);
		overflow: var(--home-block-overflow, hidden);
		border-radius: 1.5rem;
		image-rendering: pixelated;
	}

	.home-grid__block :global(img),
	.home-grid__block :global(canvas),
	.home-grid__block :global(svg),
	.home-grid__block :global(svg image) {
		image-rendering: pixelated;
	}

	.home-grid__empty-card {
		height: 100%;
		min-height: inherit;
		border: 1px solid color-mix(in srgb, var(--border-color) 58%, transparent);
		border-radius: 1.5rem;
		background: var(--card-bg);
	}

	@media (min-width: 48rem) {
		.home-page {
			padding: 3rem 2rem 5rem;
		}

		.home-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			grid-auto-rows: minmax(clamp(12rem, 18vw, 15rem), auto);
		}

		.home-grid__block {
			grid-column: var(--home-block-column, auto);
			grid-row: var(--home-block-row, auto);
			min-height: var(--home-block-min-height, 100%);
		}
	}
</style>
