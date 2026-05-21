<script lang="ts">
	import { componentLibraryStore } from '$lib/stores/componentLibraryStore.svelte';

	interface Props {
		ariaLabel: string;
		backgroundColor: string;
		blockId: string;
		class?: string;
	}

	let { ariaLabel, backgroundColor, blockId, class: className = '' }: Props = $props();
	let rootEl = $state<HTMLButtonElement | null>(null);

	const isHidden = $derived(
		componentLibraryStore.isOpen && componentLibraryStore.activeBlockId === blockId
	);

	function handleClick() {
		if (!rootEl || componentLibraryStore.isOpen) {
			return;
		}

		componentLibraryStore.open(blockId, rootEl);
	}
</script>

<button
	bind:this={rootEl}
	type="button"
	class={['component-library-block', className, isHidden && 'component-library-block--hidden']}
	style:--component-library-bg={backgroundColor}
	aria-label={ariaLabel}
	onclick={handleClick}
>
	browse the component library
</button>

<style>
	.component-library-block {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		min-height: inherit;
		padding: 1rem;
		border: none;
		border-radius: inherit;
		background-color: var(--component-library-bg);
		color: var(--text-primary);
		font-family: var(--font-pixel), var(--font-sans);
		font-size: clamp(0.85rem, 1.2vw, 1rem);
		line-height: 1.35;
		text-align: center;
		text-transform: lowercase;
		cursor: pointer;
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.component-library-block:hover {
		transform: scale(1.02);
		box-shadow: 0 0.75rem 1.75rem rgba(0, 0, 0, 0.12);
	}

	.component-library-block:focus-visible {
		outline: 2px solid var(--caroline-blue-600);
		outline-offset: 3px;
	}

	.component-library-block--hidden {
		visibility: hidden;
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
