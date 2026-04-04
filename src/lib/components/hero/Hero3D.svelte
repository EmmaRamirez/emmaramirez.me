<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Hero3DScene from './Hero3DScene.svelte';
	import { defaultHero3DParams } from '$lib/stores/hero3dParams.svelte';

	interface Props {
		class?: string;
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
		class: className = '',
		depthScale = defaultHero3DParams.depthScale,
		revealRadius = defaultHero3DParams.revealRadius,
		parallaxXY = defaultHero3DParams.parallaxXY,
		parallaxZ = defaultHero3DParams.parallaxZ,
		splatStretch = defaultHero3DParams.splatStretch,
		splatCompress = defaultHero3DParams.splatCompress,
		depthBulge = defaultHero3DParams.depthBulge,
		contourOffset = defaultHero3DParams.contourOffset,
		blobAmplitude = defaultHero3DParams.blobAmplitude,
		noiseAmplitude = defaultHero3DParams.noiseAmplitude,
		contourInfluence = defaultHero3DParams.contourInfluence,
		edgeSoftness = defaultHero3DParams.edgeSoftness,
		saturationBoost = defaultHero3DParams.saturationBoost,
		contrastBoost = defaultHero3DParams.contrastBoost,
		rippleSpeed = defaultHero3DParams.rippleSpeed,
		rippleFrequency = defaultHero3DParams.rippleFrequency,
		rippleAmplitude = defaultHero3DParams.rippleAmplitude,
		causticScale = defaultHero3DParams.causticScale,
		causticSpeed = defaultHero3DParams.causticSpeed,
		causticIntensity = defaultHero3DParams.causticIntensity,
		waterDistortion = defaultHero3DParams.waterDistortion,
		mouseDamping = defaultHero3DParams.mouseDamping,
		revealDamping = defaultHero3DParams.revealDamping,
		mouseRangeX = defaultHero3DParams.mouseRangeX,
		mouseRangeY = defaultHero3DParams.mouseRangeY,
		depthFocusNear = defaultHero3DParams.depthFocusNear,
		depthFocusFar = defaultHero3DParams.depthFocusFar,
		depthMixLow = defaultHero3DParams.depthMixLow,
		parallaxXGain = defaultHero3DParams.parallaxXGain,
		parallaxYGain = defaultHero3DParams.parallaxYGain,
		rippleEdgeInfluence = defaultHero3DParams.rippleEdgeInfluence,
		edgeRippleStrength = defaultHero3DParams.edgeRippleStrength
	}: Props = $props();

	let containerElement: HTMLDivElement;
	let mouseX = $state(0.5);
	let mouseY = $state(0.5);
	let isHovering = $state(false);

	function handleMouseMove(event: MouseEvent) {
		if (!containerElement) return;
		const rect = containerElement.getBoundingClientRect();
		mouseX = (event.clientX - rect.left) / rect.width;
		mouseY = 1 - (event.clientY - rect.top) / rect.height; // Flip Y for WebGL
	}

	function handleMouseEnter() {
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={containerElement}
	class="hero-3d-container {className}"
	onmousemove={handleMouseMove}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	<Canvas toneMapping={0} colorManagementEnabled={false} renderMode="always">
		<Hero3DScene 
			{mouseX} 
			{mouseY} 
			{isHovering}
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
			{rippleSpeed}
			{rippleFrequency}
			{rippleAmplitude}
			{causticScale}
			{causticSpeed}
			{causticIntensity}
			{waterDistortion}
			{mouseDamping}
			{revealDamping}
			{mouseRangeX}
			{mouseRangeY}
			{depthFocusNear}
			{depthFocusFar}
			{depthMixLow}
			{parallaxXGain}
			{parallaxYGain}
			{rippleEdgeInfluence}
			{edgeRippleStrength}
		/>
	</Canvas>
</div>

<style>
	.hero-3d-container {
		width: 100%;
		height: 100%;
		border-radius: 2rem 0 0 2rem;
		overflow: hidden;
		cursor: crosshair;
	}

	.hero-3d-container :global(canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}
</style>

