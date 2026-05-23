<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { componentLibraryStore } from '$lib/stores/componentLibraryStore.svelte';

	interface Props {
		ariaLabel: string;
		backgroundColor: string;
		blockId: string;
		class?: string;
	}

	let { ariaLabel, backgroundColor, blockId, class: className = '' }: Props = $props();
	let rootEl = $state<HTMLButtonElement | null>(null);

	const isOverlayActive = $derived(
		componentLibraryStore.isOpen && componentLibraryStore.activeBlockId === blockId
	);

	const captureRoot: Attachment<HTMLButtonElement> = (element) => {
		rootEl = element;

		return () => {
			if (rootEl === element) {
				rootEl = null;
			}
		};
	};

	function handleClick() {
		if (!rootEl) {
			return;
		}

		componentLibraryStore.open(blockId, rootEl);
	}
</script>

<button
	{@attach captureRoot}
	type="button"
	class={[
		'component-library-block',
		className,
		isOverlayActive && 'component-library-block--inactive'
	]}
	aria-hidden={isOverlayActive ? 'true' : undefined}
	tabindex={isOverlayActive ? -1 : undefined}
	style:--component-library-bg={backgroundColor}
	aria-label={ariaLabel}
	onclick={handleClick}
>
	<span class="component-library-block__ticket" aria-hidden="true">
		<span class="component-library-block__entry">1 <span>(One)</span> Entry</span>
		<span class="component-library-block__divider"></span>
		<span class="component-library-block__to">to the</span>
		<span class="component-library-block__destination">Emzinnia Design System</span>
	</span>
</button>

<style>
	.component-library-block {
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		min-height: inherit;
		padding: clamp(0.7rem, 3vw, 1rem);
		border: 0.1875rem solid var(--liver-brown-900);
		border-radius: inherit;
		background: color-mix(
			in srgb,
			var(--component-library-bg, var(--transit-yellow-900)) 34%,
			var(--card-bg)
		);
		color: #000;
		font-family: var(--font-pixel), var(--font-sans);
		line-height: 1;
		text-align: center;
		cursor: pointer;
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.component-library-block__ticket {
		position: relative;
		display: grid;
		grid-template-rows: auto auto auto auto;
		align-items: center;
		justify-items: center;
		width: min(100%, 10.75rem);
		min-height: min(100%, 10rem);
		padding: clamp(1rem, 4vw, 1.25rem) clamp(0.9rem, 4vw, 1.15rem);
		border: 0.25rem solid #000;
		border-radius: 0.7rem;
		background: color-mix(
			in srgb,
			var(--component-library-bg, var(--transit-yellow-900)) 82%,
			#ffd400
		);
		box-shadow: 0.35rem 0.35rem 0 #000;
		text-transform: none;
	}

	.component-library-block__ticket::before,
	.component-library-block__ticket::after {
		position: absolute;
		top: 50%;
		width: 1.1rem;
		height: 1.1rem;
		border: 0.25rem solid #000;
		border-radius: 999rem;
		background: color-mix(
			in srgb,
			var(--component-library-bg, var(--transit-yellow-900)) 34%,
			var(--card-bg)
		);
		content: '';
		transform: translateY(-50%);
	}

	.component-library-block__ticket::before {
		left: -0.8rem;
	}

	.component-library-block__ticket::after {
		right: -0.8rem;
	}

	.component-library-block__entry {
		font-size: clamp(1rem, 3.9vw, 1.35rem);
		font-weight: 700;
		line-height: 0.95;
		white-space: nowrap;
	}

	.component-library-block__entry span {
		font-size: 0.72em;
	}

	.component-library-block__divider {
		width: 100%;
		margin: 0.65rem 0 0.55rem;
		border-top: 0.1875rem dashed #000;
	}

	.component-library-block__to {
		font-size: clamp(0.75rem, 2.7vw, 0.95rem);
		line-height: 1;
		text-transform: lowercase;
	}

	.component-library-block__destination {
		max-width: 8.25rem;
		margin-top: 0.35rem;
		font-size: clamp(0.9rem, 3.3vw, 1.15rem);
		font-weight: 700;
		line-height: 1.05;
	}

	.component-library-block:hover {
		transform: scale(1.02);
		box-shadow: 0 0.75rem 1.75rem rgb(0 0 0 / 0.12);
	}

	.component-library-block:focus-visible {
		outline: 2px solid var(--caroline-blue-600);
		outline-offset: 3px;
	}

	.component-library-block--inactive {
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.component-library-block {
			transition: none;
		}

		.component-library-block:hover {
			transform: none;
		}
	}
</style>
