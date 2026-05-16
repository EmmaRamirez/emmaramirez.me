<script lang="ts">
	import type { StickerDefinition, StickerId, StickerPlacement } from '$lib/stores/stickers.svelte';

	type StickerMode = 'tray' | 'placed';

	interface Props {
		sticker: StickerDefinition;
		placement?: StickerPlacement | null;
		mode?: StickerMode;
		class?: string;
		onDragStart?: (
			id: StickerId,
			rect: DOMRect,
			pointerX: number,
			pointerY: number
		) => void;
		onResizeStart?: (
			id: StickerId,
			rect: DOMRect,
			pointerX: number,
			pointerY: number
		) => void;
	}

	let {
		sticker,
		placement = null,
		mode = 'tray',
		class: className = '',
		onDragStart,
		onResizeStart
	}: Props = $props();

	let buttonLabel = $derived(`${mode === 'tray' ? 'Place' : 'Move'} ${sticker.label}`);
	let dragLabel = $derived(`Drag ${sticker.label}`);
	let resizeLabel = $derived(`Resize ${sticker.label}`);
	let activeScale = $derived(placement?.scale ?? sticker.scale);

	function getStickerRoot(target: EventTarget | null) {
		if (!(target instanceof HTMLElement)) return null;

		return target.closest('.sticker-button');
	}

	function handlePointerDown(event: PointerEvent) {
		if (!onDragStart) return;

		event.preventDefault();
		const handle = event.currentTarget;
		if (!(handle instanceof HTMLElement)) return;

		const root = getStickerRoot(handle);
		if (!(root instanceof HTMLElement)) return;

		handle.setPointerCapture(event.pointerId);
		onDragStart(sticker.id, root.getBoundingClientRect(), event.clientX, event.clientY);
	}

	function handleDragHandlePointerDown(event: PointerEvent) {
		event.stopPropagation();
		handlePointerDown(event);
	}

	function handleResizePointerDown(event: PointerEvent) {
		if (!onResizeStart) return;

		event.preventDefault();
		event.stopPropagation();
		const handle = event.currentTarget;
		if (!(handle instanceof HTMLElement)) return;

		const root = getStickerRoot(handle);
		if (!(root instanceof HTMLElement)) return;

		handle.setPointerCapture(event.pointerId);
		onResizeStart(sticker.id, root.getBoundingClientRect(), event.clientX, event.clientY);
	}
</script>

{#if mode === 'placed'}
	<div
		class={['sticker-button', 'sticker-button--placed', className]}
		style:--sticker-rotation={`${sticker.rotation}deg`}
		style:--sticker-scale={activeScale}
		style:left={placement ? `${placement.x}px` : undefined}
		style:top={placement ? `${placement.y}px` : undefined}
		style:z-index={placement ? placement.zIndex : undefined}
		role="group"
		aria-label={`${sticker.label} sticker controls`}
	>
		<button
			type="button"
			class="sticker-button__surface"
			aria-label={buttonLabel}
			onpointerdown={handlePointerDown}
		>
			<span class="sticker-button__art" aria-hidden="true">
				<img src={sticker.image} alt="" draggable="false" />
			</span>
		</button>
		<button
			type="button"
			class="sticker-button__control sticker-button__control--drag"
			aria-label={dragLabel}
			onpointerdown={handleDragHandlePointerDown}
		></button>
		<button
			type="button"
			class="sticker-button__control sticker-button__control--resize"
			aria-label={resizeLabel}
			onpointerdown={handleResizePointerDown}
		></button>
	</div>
{:else}
	<button
		type="button"
		class={['sticker-button', 'sticker-button--tray', className]}
		style:--sticker-rotation={`${sticker.rotation}deg`}
		style:--sticker-scale={activeScale}
		style:--sticker-tray-x={`${sticker.trayX}%`}
		style:--sticker-tray-y={`${sticker.trayY}%`}
		style:--sticker-tray-z-index={sticker.trayZIndex}
		aria-label={buttonLabel}
		onpointerdown={handlePointerDown}
	>
		<span class="sticker-button__art" aria-hidden="true">
			<img src={sticker.image} alt="" draggable="false" />
		</span>
	</button>
{/if}

<style>
	.sticker-button {
		display: inline-grid;
		place-items: center;
		width: calc(var(--sticker-size, 4rem) * var(--sticker-scale, 1));
		height: calc(var(--sticker-size, 4rem) * var(--sticker-scale, 1));
		border: 0;
		background: transparent;
		color: inherit;
		cursor: grab;
		padding: 0;
		touch-action: none;
		transform: var(--sticker-translate, translate(0, 0)) rotate(var(--sticker-rotation));
		transition:
			filter 140ms ease,
			transform 140ms ease;
	}

	.sticker-button:active,
	.sticker-button__surface:active {
		cursor: grabbing;
	}

	.sticker-button:focus-visible,
	.sticker-button__surface:focus-visible,
	.sticker-button__control:focus-visible {
		outline: 3px solid rgb(17 24 39 / 0.72);
		outline-offset: 0.2rem;
		border-radius: 1rem;
	}

	.sticker-button:hover {
		filter: drop-shadow(0 0.45rem 0 rgb(17 24 39 / 0.12));
		transform: var(--sticker-translate, translate(0, 0)) rotate(var(--sticker-rotation))
			translateY(-0.08rem);
	}

	.sticker-button--tray {
		position: absolute;
		top: var(--sticker-tray-y);
		left: var(--sticker-tray-x);
		z-index: var(--sticker-tray-z-index);
		--sticker-translate: translate(-50%, -50%);
	}

	.sticker-button--placed {
		position: fixed;
		pointer-events: auto;
	}

	.sticker-button__surface {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: grab;
		padding: 0;
		touch-action: none;
	}

	.sticker-button__control {
		position: absolute;
		width: 0.9rem;
		height: 0.9rem;
		border: 2px solid rgb(17 24 39 / 0.7);
		border-radius: 999px;
		background: rgb(255 255 255 / 0.88);
		box-shadow: 0 0.15rem 0.35rem rgb(17 24 39 / 0.18);
		opacity: 0;
		padding: 0;
		pointer-events: none;
		touch-action: none;
		transform: scale(0.86);
		transition:
			opacity 120ms ease,
			transform 120ms ease;
	}

	.sticker-button--placed:hover .sticker-button__control {
		opacity: 1;
		pointer-events: auto;
		transform: scale(1);
	}

	.sticker-button__control--drag {
		top: -0.35rem;
		left: -0.35rem;
		cursor: grab;
		background-image: radial-gradient(rgb(17 24 39 / 0.72) 1px, transparent 1.5px);
		background-position: center;
		background-size: 0.28rem 0.28rem;
	}

	.sticker-button__control--drag:active {
		cursor: grabbing;
	}

	.sticker-button__control--resize {
		right: -0.35rem;
		bottom: -0.35rem;
		cursor: nwse-resize;
		background-image: linear-gradient(
			135deg,
			transparent 0 48%,
			rgb(17 24 39 / 0.72) 49% 54%,
			transparent 55% 100%
		);
	}

	.sticker-button__art {
		display: block;
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0.25rem 0 rgb(17 24 39 / 0.16));
	}

	.sticker-button__art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
	}
</style>
