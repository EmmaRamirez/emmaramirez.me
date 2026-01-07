<script lang="ts">
	import { browser } from '$app/environment';
	import Hero3D from './Hero3D.svelte';
	import me from '$lib/images/photos/hero/me.jpeg';

	interface Props {
		blendMode?: string;
		depthScale?: number;
		revealRadius?: number;
		parallaxXY?: number;
		parallaxZ?: number;
		splatStretch?: number;
		splatCompress?: number;
		depthBulge?: number;
		contourOffset?: number;
		blobAmplitude?: number;
		noiseAmplitude?: number;
		contourInfluence?: number;
		edgeSoftness?: number;
		saturationBoost?: number;
		contrastBoost?: number;
	}

	let { 
		blendMode = 'difference',
		depthScale = 0.12,
		revealRadius = 0.3,
		parallaxXY = 0.12,
		parallaxZ = 0.3,
		splatStretch = 2.5,
		splatCompress = 0.6,
		depthBulge = 0.35,
		contourOffset = 0.5,
		blobAmplitude = 0.03,
		noiseAmplitude = 0.04,
		contourInfluence = 0.6,
		edgeSoftness = 0.06,
		saturationBoost = 1.15,
		contrastBoost = 1.05
	}: Props = $props();

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
	{#if !isMobile && browser}
		<div class="hero-3d-wrapper">
			<Hero3D 
				{depthScale}
				{revealRadius}
				{parallaxXY}
				{parallaxZ}
				{splatStretch}
				{splatCompress}
				{depthBulge}
				{contourOffset}
				{blobAmplitude}
				{noiseAmplitude}
				{contourInfluence}
				{edgeSoftness}
				{saturationBoost}
				{contrastBoost}
			/>
		</div>
	{:else}
		<img src={me} alt="" class="hero-base-image" aria-hidden="true" />
	{/if}

	<div class="hero-blue-overlay" aria-hidden="true"></div>

	<div class="hero-content">
		<h1 class="mb-4 font-serif text-4xl leading-tight text-white drop-shadow-lg md:text-5xl">
			welcome to my internet.
		</h1>
		<p class="max-w-lg text-xl text-balance text-white/90 drop-shadow-md md:text-2xl">
			my name's emma and my biggest passion is making stuff with code. i'm into startups, fashion, finance, and AI.
		</p>
	</div>
</header>

<style>
	.hero-header {
		border-radius: 2rem;
		height: 20rem;
		background: #5ba4d4;
		cursor: crosshair;
	}

	.hero-3d-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 55%;
		height: 100%;
		border-radius: 2rem 0 0 2rem;
		overflow: hidden;
		background: #5ba4d4;
	}

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

	@media (max-width: 48rem) {
		.hero-header {
			height: 25rem;
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
