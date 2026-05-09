<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Hero3DScene from './Hero3DScene.svelte';
	import type { Hero3DParams } from '$lib/stores/hero3dParams.svelte';

	interface Props {
		class?: string;
		sceneParams: Hero3DParams;
		resetKey?: string;
	}

	let { class: className = '', sceneParams, resetKey = '' }: Props = $props();

	let mouseX = $state(0.5);
	let mouseY = $state(0.5);
	let isHovering = $state(false);

	function handleMouseMove(event: MouseEvent) {
		const containerElement = event.currentTarget;
		if (!(containerElement instanceof HTMLDivElement)) return;
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

<div
	class="hero-3d-container {className}"
	role="presentation"
	onmousemove={handleMouseMove}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	<Canvas toneMapping={0} colorManagementEnabled={false} renderMode="always">
		<Hero3DScene {mouseX} {mouseY} {isHovering} {sceneParams} {resetKey} />
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
