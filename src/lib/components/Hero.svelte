<script lang="ts">
	import { browser } from '$app/environment';
	import Hero3D from './Hero3D.svelte';
	import me from '$lib/images/photos/hero/me.jpeg';

	interface Props {
		blendMode?: string;
	}

	let { blendMode = 'difference' }: Props = $props();

	// Check if we should use 3D mode (desktop only for performance)
	let isMobile = $state(false);

	$effect(() => {
		if (browser) {
			const checkMobile = () => {
				isMobile = window.innerWidth < 768;
			};
			checkMobile();
			window.addEventListener('resize', checkMobile);
			return () => window.removeEventListener('resize', checkMobile);
		}
	});
</script>

<header class="hero-header relative overflow-hidden">
	<!-- 3D Canvas for desktop -->
	{#if !isMobile && browser}
		<div class="hero-3d-wrapper">
			<Hero3D />
		</div>
	{:else}
		<!-- Static fallback for mobile / SSR -->
		<img src={me} alt="" class="hero-base-image" aria-hidden="true" />
	{/if}

	<!-- Blue overlay on the right side -->
	<div class="hero-blue-overlay" aria-hidden="true"></div>

	<!-- Text content overlay -->
	<div class="hero-content">
		<h1 class="mb-4 font-serif text-4xl leading-tight text-white drop-shadow-lg md:text-5xl">
			welcome to my internet.
		</h1>
		<p class="max-w-lg text-xl text-balance text-white/90 drop-shadow-md md:text-2xl">
			my name's emma and my biggest passion is making stuff with code. i'm into startups, finance,
			and fashion.
		</p>
	</div>
</header>

<style>
	/* Hero header with squircle borders */
	.hero-header {
		border-radius: 2rem;
		height: 320px;
		background: #5ba4d4; /* Blue from the photo */
		cursor: crosshair;
	}

	/* 3D canvas wrapper - takes up the left 55% */
	.hero-3d-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 55%;
		height: 100%;
		border-radius: 2rem 0 0 2rem;
		overflow: hidden;
		background: #5ba4d4; /* Match header background for seamless blend */
	}

	/* Static fallback image for mobile */
	.hero-base-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 55%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 35%;
		border-radius: 2rem 0 0 2rem;
	}

	.hero-blue-overlay {
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 100%;
		background: linear-gradient(to right, transparent 0%, #5ba4d4 10%, #5ba4d4 100%);
		border-radius: 0 2rem 2rem 0;
		z-index: 5;
	}

	.hero-content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		margin-left: auto;
		width: 50%;
		text-align: left;
		padding: 2rem;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.hero-header {
			height: 400px;
		}

		.hero-3d-wrapper,
		.hero-base-image {
			width: 100%;
			height: 55%;
			border-radius: 2rem 2rem 0 0;
		}

		.hero-base-image {
			object-position: center 25%;
		}

		.hero-blue-overlay {
			width: 100%;
			height: 55%;
			top: auto;
			bottom: 0;
			background: linear-gradient(to bottom, transparent 0%, #5ba4d4 15%, #5ba4d4 100%);
			border-radius: 0 0 2rem 2rem;
		}

		.hero-content {
			width: 100%;
			justify-content: flex-end;
			padding: 1.5rem;
		}
	}
</style>
