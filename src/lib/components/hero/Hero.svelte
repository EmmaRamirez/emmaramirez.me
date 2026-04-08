<script lang="ts">
	import { browser } from '$app/environment';
	import painting from '$lib/images/photos/emma-painting.jpeg';
	import { mergeHero3dProps, type Hero3DParams } from '$lib/stores/hero3dParams.svelte';
	import Hero3D from './Hero3D.svelte';

	type Hero3DPropOverrides = Partial<Hero3DParams>;

	interface Props extends Hero3DPropOverrides {}

	let {
		depthScale,
		revealRadius,
		parallaxXY,
		parallaxZ,
		splatStretch,
		splatCompress,
		depthBulge,
		contourOffset,
		blobAmplitude,
		noiseAmplitude,
		contourInfluence,
		edgeSoftness,
		saturationBoost,
		contrastBoost,
		rippleSpeed,
		rippleFrequency,
		rippleAmplitude,
		causticScale,
		causticSpeed,
		causticIntensity,
		waterDistortion,
		mouseDamping,
		revealDamping,
		mouseRangeX,
		mouseRangeY,
		depthFocusNear,
		depthFocusFar,
		depthMixLow,
		parallaxXGain,
		parallaxYGain,
		rippleEdgeInfluence,
		edgeRippleStrength
	}: Props = $props();

	const sceneParams = $derived.by(() =>
		mergeHero3dProps({
			depthScale,
			revealRadius,
			parallaxXY,
			parallaxZ,
			splatStretch,
			splatCompress,
			depthBulge,
			contourOffset,
			blobAmplitude,
			noiseAmplitude,
			contourInfluence,
			edgeSoftness,
			saturationBoost,
			contrastBoost,
			rippleSpeed,
			rippleFrequency,
			rippleAmplitude,
			causticScale,
			causticSpeed,
			causticIntensity,
			waterDistortion,
			mouseDamping,
			revealDamping,
			mouseRangeX,
			mouseRangeY,
			depthFocusNear,
			depthFocusFar,
			depthMixLow,
			parallaxXGain,
			parallaxYGain,
			rippleEdgeInfluence,
			edgeRippleStrength
		})
	);

	let windowWidth = $state(browser ? window.innerWidth : 0);
	const isMobile = $derived(browser && windowWidth < 768);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<header class="hero-header">
	<div class="hero-media" aria-hidden="true">
		{#if !isMobile && browser}
			<div class="hero-3d-wrapper">
				<Hero3D sceneParams={sceneParams} />
			</div>
		{:else}
			<img
				src={painting}
				alt=""
				class="hero-base-image"
				aria-hidden="true"
				fetchpriority="high"
			/>
		{/if}

		<div class="hero-media-fade"></div>
		<div class="hero-aurora hero-aurora-left"></div>
		<div class="hero-aurora hero-aurora-right"></div>
		<div class="hero-grid-glow"></div>
		<div class="hero-vignette"></div>
	</div>

	<div class="hero-content">
		<p class="hero-kicker">emzinnia's website</p>
		<h1 class="mb-4 font-serif text-4xl leading-tight text-white drop-shadow-lg md:text-5xl">
			welcome to my internet.
		</h1>
		<p class="max-w-lg text-xl text-balance text-white/88 drop-shadow-md md:text-2xl">
			my name&apos;s emma and my biggest passion is making stuff with code. i&apos;m into startups,
			fashion, finance, and AI.
		</p>
	</div>
</header>

<style>
	.hero-header {
		position: relative;
		height: 22rem;
		overflow: hidden;
		border-radius: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			radial-gradient(circle at 18% 18%, rgba(255, 113, 73, 0.2), transparent 30%),
			radial-gradient(circle at 82% 26%, rgba(72, 88, 255, 0.16), transparent 32%),
			linear-gradient(135deg, #120811 0%, #190b17 45%, #0c0a15 100%);
		box-shadow:
			0 30px 80px rgba(6, 4, 12, 0.34),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
		cursor: crosshair;
		isolation: isolate;
	}

	.hero-media {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.hero-3d-wrapper,
	.hero-base-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 58%;
		height: 100%;
		border-radius: 2rem 0 0 2rem;
		overflow: hidden;
	}

	.hero-3d-wrapper {
		background: linear-gradient(180deg, #3c0e12 0%, #1b101b 100%);
	}

	.hero-base-image {
		object-fit: cover;
		object-position: center 22%;
		filter: saturate(1.05) contrast(1.03) brightness(0.94);
		transform: scale(1.03);
		transform-origin: center;
	}

	.hero-media-fade {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(100deg, rgba(12, 8, 16, 0.06) 0%, rgba(12, 8, 16, 0.18) 26%, rgba(12, 8, 16, 0.7) 58%, rgba(12, 8, 16, 0.94) 100%),
			linear-gradient(180deg, rgba(255, 111, 76, 0.08) 0%, transparent 38%, rgba(10, 8, 18, 0.55) 100%);
		z-index: 2;
	}

	.hero-aurora {
		position: absolute;
		border-radius: 999px;
		filter: blur(44px);
		opacity: 0.72;
		z-index: 1;
	}

	.hero-aurora-left {
		top: 1rem;
		left: 36%;
		width: 10rem;
		height: 10rem;
		background: rgba(255, 108, 76, 0.36);
	}

	.hero-aurora-right {
		right: -1rem;
		bottom: -1.5rem;
		width: 14rem;
		height: 14rem;
		background: rgba(86, 103, 255, 0.24);
	}

	.hero-grid-glow {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
		background-position: right center;
		background-size: 3.75rem 3.75rem;
		mask-image: linear-gradient(115deg, transparent 0%, transparent 42%, rgba(0, 0, 0, 0.9) 62%, transparent 100%);
		opacity: 0.22;
		z-index: 3;
	}

	.hero-vignette {
		position: absolute;
		inset: 0;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.05),
			inset 0 -5rem 5rem rgba(5, 5, 12, 0.32);
		z-index: 4;
	}

	.hero-content {
		position: relative;
		z-index: 5;
		display: flex;
		height: 100%;
		width: min(30rem, 48%);
		margin-left: auto;
		flex-direction: column;
		justify-content: flex-end;
		padding: 2.25rem;
		text-align: left;
	}

	.hero-kicker {
		margin-bottom: 0.85rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(255, 216, 204, 0.82);
	}

	@media (max-width: 48rem) {
		.hero-header {
			height: 30rem;
		}

		.hero-3d-wrapper,
		.hero-base-image {
			width: 100%;
			height: 57%;
			border-radius: 2rem 2rem 0 0;
		}

		.hero-base-image {
			object-position: center 18%;
		}

		.hero-media-fade {
			background:
				linear-gradient(180deg, rgba(12, 8, 16, 0.03) 0%, rgba(12, 8, 16, 0.2) 34%, rgba(12, 8, 16, 0.78) 57%, rgba(12, 8, 16, 0.96) 100%),
				linear-gradient(180deg, rgba(255, 111, 76, 0.08) 0%, transparent 24%, rgba(10, 8, 18, 0.48) 100%);
		}

		.hero-grid-glow {
			background-size: 3rem 3rem;
			mask-image: linear-gradient(180deg, transparent 25%, rgba(0, 0, 0, 0.88) 54%, transparent 100%);
		}

		.hero-aurora-left {
			left: -1rem;
			top: 9.5rem;
			width: 9rem;
			height: 9rem;
		}

		.hero-aurora-right {
			right: -2rem;
			bottom: 2.25rem;
			width: 12rem;
			height: 12rem;
		}

		.hero-content {
			width: 100%;
			padding: 1.5rem;
		}

		.hero-kicker {
			font-size: 0.68rem;
		}
	}
</style>
