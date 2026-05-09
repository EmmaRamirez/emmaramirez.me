<script lang="ts">
	import { theme } from '$lib/stores';
	import seattleNightPlate from '$lib/images/photos/seattle-day.png';
	import seattleDayPlate from '$lib/images/photos/seattle-night.jpg';
	import SpaceNeedleHeroModel from '$lib/components/hero/SpaceNeedleHeroModel.svelte';

	interface HomeBlockProps {
		class?: string;
	}

	let { class: className }: HomeBlockProps = $props();
	let isDark = $derived($theme === 'dark');
	let reflectionImage = $derived(isDark ? seattleNightPlate : seattleDayPlate);
</script>

<div
	class="home-block relative overflow-hidden rounded-lg border border-(--border-color) {className}"
>
	<img
		src={seattleDayPlate}
		alt="Seattle skyline during daytime"
		class="home-image"
		class:visible={!isDark}
		aria-hidden={isDark}
	/>

	<img
		src={seattleNightPlate}
		alt="Seattle skyline at night"
		class="home-image"
		class:visible={isDark}
		aria-hidden={!isDark}
	/>

	<div class="home-model" aria-label="Interactive Space Needle model">
		<SpaceNeedleHeroModel variant="overlay" {reflectionImage} reflectionIsDark={isDark} />
	</div>

	<div
		class="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
	></div>

	<div class="pointer-events-none absolute inset-0 z-30 flex items-end justify-between p-5">
		<span class="font-serif text-xl text-white drop-shadow-lg">Home</span>
		<span class="font-serif text-lg text-white/90 drop-shadow-lg">Seattle, WA</span>
	</div>
</div>

<style>
	.home-block {
		aspect-ratio: 4 / 3;
		background: var(--card-bg);
	}

	/* When spanning rows, fill the full height instead of using aspect-ratio */
	:global(.md\:row-span-2).home-block {
		aspect-ratio: unset;
		height: 100%;
	}

	@media (min-width: 48rem) {
		:global(.md\:row-span-2).home-block {
			aspect-ratio: unset;
			height: 100%;
		}
	}

	.home-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 40%;
		opacity: 0;
		transition: opacity 0.6s ease-in-out;
	}

	.home-image.visible {
		opacity: 1;
	}

	.home-model {
		position: absolute;
		inset: 0;
		z-index: 10;
		opacity: 1;
		filter: drop-shadow(0 2rem 2.5rem rgb(0 0 0 / 0.32));
		pointer-events: auto;
	}
</style>
