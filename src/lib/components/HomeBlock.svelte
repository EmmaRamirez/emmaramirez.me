<script lang="ts">
	import { theme } from '$lib/stores';
	import seattleDay from '$lib/images/photos/seattle-day.jpg';
	import seattleNight from '$lib/images/photos/seattle-night.jpg';

	interface HomeBlockProps {
		class?: string;
	}

	let { class: className }: HomeBlockProps = $props();
	let isDark = $derived($theme === 'dark');
</script>

<div class="home-block relative overflow-hidden rounded-lg border border-(--border-color) {className}">
	<!-- Day image (visible in light mode) -->
	<img
		src={seattleDay}
		alt="Seattle skyline during daytime"
		class="home-image"
		class:visible={!isDark}
		aria-hidden={isDark}
	/>
	
	<!-- Night image (visible in dark mode) -->
	<img
		src={seattleNight}
		alt="Seattle skyline at night"
		class="home-image"
		class:visible={isDark}
		aria-hidden={!isDark}
	/>
	
	<!-- Gradient overlay for text readability -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
	
	<!-- Text content -->
	<div class="absolute inset-0 z-20 flex items-end justify-between p-5">
		<span class="text-xl font-serif text-white drop-shadow-lg">Home</span>
		<span class="text-lg font-serif text-white/90 drop-shadow-lg">Seattle, WA</span>
	</div>
</div>

<style>
	.home-block {
		aspect-ratio: 4 / 3;
		background: var(--card-bg);
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
</style>

