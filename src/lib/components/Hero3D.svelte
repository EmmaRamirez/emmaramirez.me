<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Hero3DScene from './Hero3DScene.svelte';

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
	}

	let { 
		class: className = '',
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

