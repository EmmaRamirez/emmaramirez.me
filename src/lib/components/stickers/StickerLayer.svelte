<script lang="ts">
	import StickerButton from '$lib/components/stickers/StickerButton.svelte';
	import { stickerBoard, type StickerId } from '$lib/stores/stickers.svelte';
	import { onMount } from 'svelte';

	let placedStickers = $derived(stickerBoard.getPlacedStickers());

	onMount(() => {
		stickerBoard.init();
	});

	function handleDragStart(id: StickerId, rect: DOMRect, pointerX: number, pointerY: number) {
		stickerBoard.startDrag(id, rect, pointerX, pointerY);
	}

	function handleResizeStart(id: StickerId, rect: DOMRect, pointerX: number, pointerY: number) {
		stickerBoard.startResize(id, rect, pointerX, pointerY);
	}

	function handlePointerMove(event: PointerEvent) {
		if (!stickerBoard.activeDrag && !stickerBoard.activeResize) return;

		event.preventDefault();
		if (stickerBoard.activeDrag) {
			stickerBoard.moveDrag(event.clientX, event.clientY);
		} else {
			stickerBoard.moveResize(event.clientX, event.clientY);
		}
	}

	function handleDragEnd() {
		stickerBoard.endDrag();
		stickerBoard.endResize();
	}

	function handleRemoveStickers() {
		stickerBoard.clearPlacedStickers();
	}
</script>

<svelte:window
	onpointermove={handlePointerMove}
	onpointerup={handleDragEnd}
	onpointercancel={handleDragEnd}
/>

<div class="sticker-layer" aria-label="Placed stickers">
	{#each placedStickers as { sticker, placement } (sticker.id)}
		<StickerButton
			{sticker}
			{placement}
			mode="placed"
			onDragStart={handleDragStart}
			onResizeStart={handleResizeStart}
		/>
	{/each}
</div>

{#if placedStickers.length > 0}
	<button type="button" class="sticker-layer__remove" onclick={handleRemoveStickers}>
		remove stickers
	</button>
{/if}

<style>
	.sticker-layer {
		position: fixed;
		inset: 0;
		z-index: 60;
		pointer-events: none;
	}

	.sticker-layer :global(.sticker-button) {
		--sticker-size: 3rem;
	}

	.sticker-layer__remove {
		position: fixed;
		left: 50%;
		bottom: max(1rem, env(safe-area-inset-bottom));
		z-index: 61;
		border: 1px solid rgb(17 24 39 / 0.18);
		border-radius: 999px;
		background: rgb(255 255 255 / 0.92);
		color: #111827;
		cursor: pointer;
		font-family: 'Pixelify Sans', var(--font-sans);
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		padding: 0.65rem 1rem;
		pointer-events: auto;
		transform: translateX(-50%);
		box-shadow:
			0 0.45rem 0 rgb(17 24 39 / 0.08),
			0 1rem 2rem rgb(17 24 39 / 0.12);
	}

	.sticker-layer__remove:hover {
		background: #ffffff;
	}

	.sticker-layer__remove:focus-visible {
		outline: 3px solid rgb(17 24 39 / 0.72);
		outline-offset: 0.2rem;
	}
</style>
