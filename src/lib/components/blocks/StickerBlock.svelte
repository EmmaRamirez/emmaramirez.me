<script lang="ts">
	import StickerButton from '$lib/components/stickers/StickerButton.svelte';
	import { stickerBoard, type StickerId } from '$lib/stores/stickers.svelte';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
	let trayStickers = $derived(stickerBoard.getTrayStickers());

	onMount(() => {
		stickerBoard.init();
	});

	function handleDragStart(id: StickerId, rect: DOMRect, pointerX: number, pointerY: number) {
		stickerBoard.startDrag(id, rect, pointerX, pointerY);
	}
</script>

<div class={['sticker-block', className]}>
	<div class="sticker-block__tray" aria-label="Sticker tray">
		{#each trayStickers as sticker (sticker.id)}
			<StickerButton {sticker} onDragStart={handleDragStart} />
		{/each}
	</div>
</div>

<style>
	.sticker-block {
		display: grid;
		min-height: min(34rem, calc(140vw - 2rem));
		min-width: 0;
		overflow: hidden;
		border: 1px solid rgb(17 24 39 / 0.14);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 28% 18%, rgb(255 255 255 / 0.9), transparent 8rem),
			linear-gradient(135deg, #fff7ed, #fdf2f8 48%, #eef2ff);
		padding: 0.9rem;
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.8),
			0 1rem 2rem rgb(17 24 39 / 0.08);
	}

	.sticker-block__tray {
		position: relative;
		min-height: 100%;
		overflow: hidden;
		border: 1px dashed rgb(17 24 39 / 0.16);
		border-radius: 1.05rem;
		background:
			linear-gradient(rgb(255 255 255 / 0.58), rgb(255 255 255 / 0.58)),
			radial-gradient(circle at 0.75rem 0.75rem, rgb(17 24 39 / 0.1) 1px, transparent 1.5px);
		background-size:
			auto,
			1rem 1rem;
		padding: clamp(0.85rem, 5vw, 1.25rem);
	}

	.sticker-block__tray :global(.sticker-button) {
		--sticker-size: clamp(3.45rem, 20vw, 4.75rem);
	}

	@media (min-width: 48rem) {
		.sticker-block {
			height: 100%;
			min-height: 100%;
		}

		.sticker-block__tray :global(.sticker-button) {
			--sticker-size: clamp(3.25rem, 5vw, 4.35rem);
		}
	}
</style>
