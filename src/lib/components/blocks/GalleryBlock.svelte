<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import stageFrameUrl from '$lib/images/gallery/frames/floral-ornate.png';
	import { setupGalleryScene, type GallerySceneController } from './gallery/galleryScene';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
	let hasScene = $state(false);
	let isDragging = $state(false);
	let sceneController: GallerySceneController | undefined;
	let lastPointerX = 0;
	let lastPointerY = 0;

	const setupGalleryStage: Attachment<HTMLCanvasElement> = (canvas) => {
		let disposed = false;

		setupGalleryScene(canvas).then((controller) => {
			if (disposed) {
				controller.dispose();
				return;
			}

			sceneController = controller;
			hasScene = true;
		});

		return () => {
			disposed = true;
			sceneController?.dispose();
			sceneController = undefined;
			hasScene = false;
		};
	};

	function handlePointerDown(event: PointerEvent) {
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement) || !sceneController || event.button !== 0) return;

		isDragging = true;
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
		target.setPointerCapture(event.pointerId);
	}

	function handlePointerMove(event: PointerEvent) {
		if (!isDragging || !sceneController) return;

		const deltaX = event.clientX - lastPointerX;
		const deltaY = event.clientY - lastPointerY;
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
		sceneController.pan(deltaX, deltaY);
	}

	function handlePointerUp(event: PointerEvent) {
		const target = event.currentTarget;
		if (!isDragging || !(target instanceof HTMLElement)) return;

		isDragging = false;
		if (target.hasPointerCapture(event.pointerId)) {
			target.releasePointerCapture(event.pointerId);
		}
	}
</script>

<div class={['gallery-block', className]}>
	<div class="gallery-block__header">
		<h2 id="gallery-block-heading" class="gallery-block__title">The Gallery</h2>
	</div>

	<div
		class="gallery-block__stage"
		class:gallery-block__stage--ready={hasScene}
		class:gallery-block__stage--dragging={isDragging}
		style:--gallery-stage-frame={`url("${stageFrameUrl}")`}
		aria-label="Interactive gallery. Drag to pan, scroll to zoom."
		role="img"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
	>
		<canvas {@attach setupGalleryStage} class="gallery-block__canvas" aria-hidden="true"></canvas>
	</div>
</div>

<style>
	.gallery-block {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 0.75rem;
		min-height: min(22rem, calc(100vw - 2rem));
		overflow: hidden;
		border: 1px solid rgb(15 23 42 / 0.14);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 18% 0%, rgb(255 232 196 / 0.16), transparent 42%),
			radial-gradient(circle at 88% 12%, rgb(199 210 254 / 0.14), transparent 36%),
			linear-gradient(145deg, #17121d, #241c2d 58%, #120d16);
		color: #f7efe3;
		padding: 0.95rem 1rem 1rem;
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.04),
			0 1rem 2rem rgb(15 23 42 / 0.18);
	}

	.gallery-block__header {
		display: grid;
	}

	.gallery-block__title {
		margin: 0;
		font-family: var(--font-serif);
		font-size: clamp(1.35rem, 2vw, 1.75rem);
		font-weight: 500;
		letter-spacing: 0.01em;
		color: #fff4df;
	}

	.gallery-block__stage {
		position: relative;
		min-height: 12rem;
		overflow: hidden;
		border: 14px solid transparent;
		border-image: var(--gallery-stage-frame) 72 round;
		border-radius: 0.35rem;
		background:
			radial-gradient(circle at 50% 0%, rgb(255 255 255 / 0.06), transparent 48%),
			#120d16;
		box-shadow: inset 0 0 3rem rgb(0 0 0 / 0.35);
		touch-action: none;
	}

	.gallery-block__canvas {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 12rem;
		opacity: 0;
		transition: opacity 420ms ease;
		cursor: grab;
	}

	.gallery-block__stage--ready .gallery-block__canvas {
		opacity: 1;
	}

	.gallery-block__stage--dragging .gallery-block__canvas {
		cursor: grabbing;
	}

	@media (min-width: 48rem) {
		.gallery-block {
			height: 100%;
			min-height: 100%;
		}

		.gallery-block__stage {
			min-height: 0;
		}

		.gallery-block__canvas {
			min-height: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.gallery-block__canvas {
			transition: none;
		}
	}
</style>
