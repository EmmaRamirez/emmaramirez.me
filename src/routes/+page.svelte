<script lang="ts">
	import discoImage from '$lib/images/photos/emzinnia.png';
	import DiscoBlock from '$lib/components/blocks/DiscoBlock.svelte';
	import HomeBlock from '$lib/components/blocks/site/HomeBlock.svelte';
	import RedesigningArticle from './article/redesigning-article/RedesigningArticle.svelte';
</script>

<svelte:head>
	<title>EMZINNIA</title>
	<meta name="description" content="emzinnia's personal site, projects, essays, and experiments." />
</svelte:head>

<section class="home-page" aria-label="Homepage highlights">
	<div class="home-grid">
		<article class="home-grid__tile home-grid__tile--location" aria-label="Home location">
			<HomeBlock class="h-full w-full" />
		</article>

		<RedesigningArticle />

		<DiscoBlock image={discoImage} alt="emzinnia portrait" caption="Disco" />
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
	}

	.home-grid__tile {
		min-width: 0;
		overflow: hidden;
		border-radius: 1.5rem;
	}

	.home-grid__tile--location {
		min-height: min(500px, calc(100vw - 2rem));
	}

	@media (min-width: 48rem) {
		.home-page {
			padding: 3rem 2rem 5rem;
		}

		.home-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			grid-auto-rows: clamp(12rem, 18vw, 15rem);
		}

		.home-grid__tile--location {
			min-height: 100%;
		}
	}
</style>
