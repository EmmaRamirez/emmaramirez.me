<script lang="ts">
	import { browser } from '$app/environment';
	import { hero3dParams } from '$lib/stores/hero3dParams.svelte';
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
		rippleSpeed?: number;
		rippleFrequency?: number;
		rippleAmplitude?: number;
		causticScale?: number;
		causticSpeed?: number;
		causticIntensity?: number;
		waterDistortion?: number;
		mouseDamping?: number;
		revealDamping?: number;
		mouseRangeX?: number;
		mouseRangeY?: number;
		depthFocusNear?: number;
		depthFocusFar?: number;
		depthMixLow?: number;
		parallaxXGain?: number;
		parallaxYGain?: number;
		rippleEdgeInfluence?: number;
		edgeRippleStrength?: number;
	}

	let { 
		blendMode = 'difference',
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

	const resolvedDepthScale = $derived(depthScale ?? hero3dParams.depthScale);
	const resolvedRevealRadius = $derived(revealRadius ?? hero3dParams.revealRadius);
	const resolvedParallaxXY = $derived(parallaxXY ?? hero3dParams.parallaxXY);
	const resolvedParallaxZ = $derived(parallaxZ ?? hero3dParams.parallaxZ);
	const resolvedSplatStretch = $derived(splatStretch ?? hero3dParams.splatStretch);
	const resolvedSplatCompress = $derived(splatCompress ?? hero3dParams.splatCompress);
	const resolvedDepthBulge = $derived(depthBulge ?? hero3dParams.depthBulge);
	const resolvedContourOffset = $derived(contourOffset ?? hero3dParams.contourOffset);
	const resolvedBlobAmplitude = $derived(blobAmplitude ?? hero3dParams.blobAmplitude);
	const resolvedNoiseAmplitude = $derived(noiseAmplitude ?? hero3dParams.noiseAmplitude);
	const resolvedContourInfluence = $derived(contourInfluence ?? hero3dParams.contourInfluence);
	const resolvedEdgeSoftness = $derived(edgeSoftness ?? hero3dParams.edgeSoftness);
	const resolvedSaturationBoost = $derived(saturationBoost ?? hero3dParams.saturationBoost);
	const resolvedContrastBoost = $derived(contrastBoost ?? hero3dParams.contrastBoost);
	const resolvedRippleSpeed = $derived(rippleSpeed ?? hero3dParams.rippleSpeed);
	const resolvedRippleFrequency = $derived(rippleFrequency ?? hero3dParams.rippleFrequency);
	const resolvedRippleAmplitude = $derived(rippleAmplitude ?? hero3dParams.rippleAmplitude);
	const resolvedCausticScale = $derived(causticScale ?? hero3dParams.causticScale);
	const resolvedCausticSpeed = $derived(causticSpeed ?? hero3dParams.causticSpeed);
	const resolvedCausticIntensity = $derived(
		causticIntensity ?? hero3dParams.causticIntensity
	);
	const resolvedWaterDistortion = $derived(
		waterDistortion ?? hero3dParams.waterDistortion
	);
	const resolvedMouseDamping = $derived(mouseDamping ?? hero3dParams.mouseDamping);
	const resolvedRevealDamping = $derived(revealDamping ?? hero3dParams.revealDamping);
	const resolvedMouseRangeX = $derived(mouseRangeX ?? hero3dParams.mouseRangeX);
	const resolvedMouseRangeY = $derived(mouseRangeY ?? hero3dParams.mouseRangeY);
	const resolvedDepthFocusNear = $derived(depthFocusNear ?? hero3dParams.depthFocusNear);
	const resolvedDepthFocusFar = $derived(depthFocusFar ?? hero3dParams.depthFocusFar);
	const resolvedDepthMixLow = $derived(depthMixLow ?? hero3dParams.depthMixLow);
	const resolvedParallaxXGain = $derived(parallaxXGain ?? hero3dParams.parallaxXGain);
	const resolvedParallaxYGain = $derived(parallaxYGain ?? hero3dParams.parallaxYGain);
	const resolvedRippleEdgeInfluence = $derived(
		rippleEdgeInfluence ?? hero3dParams.rippleEdgeInfluence
	);
	const resolvedEdgeRippleStrength = $derived(
		edgeRippleStrength ?? hero3dParams.edgeRippleStrength
	);

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
				depthScale={resolvedDepthScale}
				revealRadius={resolvedRevealRadius}
				parallaxXY={resolvedParallaxXY}
				parallaxZ={resolvedParallaxZ}
				splatStretch={resolvedSplatStretch}
				splatCompress={resolvedSplatCompress}
				depthBulge={resolvedDepthBulge}
				contourOffset={resolvedContourOffset}
				blobAmplitude={resolvedBlobAmplitude}
				noiseAmplitude={resolvedNoiseAmplitude}
				contourInfluence={resolvedContourInfluence}
				edgeSoftness={resolvedEdgeSoftness}
				saturationBoost={resolvedSaturationBoost}
				contrastBoost={resolvedContrastBoost}
				rippleSpeed={resolvedRippleSpeed}
				rippleFrequency={resolvedRippleFrequency}
				rippleAmplitude={resolvedRippleAmplitude}
				causticScale={resolvedCausticScale}
				causticSpeed={resolvedCausticSpeed}
				causticIntensity={resolvedCausticIntensity}
				waterDistortion={resolvedWaterDistortion}
				mouseDamping={resolvedMouseDamping}
				revealDamping={resolvedRevealDamping}
				mouseRangeX={resolvedMouseRangeX}
				mouseRangeY={resolvedMouseRangeY}
				depthFocusNear={resolvedDepthFocusNear}
				depthFocusFar={resolvedDepthFocusFar}
				depthMixLow={resolvedDepthMixLow}
				parallaxXGain={resolvedParallaxXGain}
				parallaxYGain={resolvedParallaxYGain}
				rippleEdgeInfluence={resolvedRippleEdgeInfluence}
				edgeRippleStrength={resolvedEdgeRippleStrength}
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
