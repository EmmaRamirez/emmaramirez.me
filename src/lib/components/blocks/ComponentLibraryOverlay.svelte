<script lang="ts">
	import { tick } from 'svelte';
	import DesignSystemBrowser from '$lib/components/blocks/devtools/DesignSystemBrowser.svelte';
	import {
		getHeaderAwareGridRect,
		scrollGridBelowHeader
	} from '$lib/layout/siteHeader';
	import {
		componentLibraryStore,
		type LayoutRect
	} from '$lib/stores/componentLibraryStore.svelte';

	const MORPH_MS = 400;

	let overlayEl = $state<HTMLDivElement | null>(null);
	let isExpanded = $state(false);

	function prefersReducedMotion() {
		return (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	function applyRect(element: HTMLElement, rect: LayoutRect) {
		element.style.top = `${rect.top}px`;
		element.style.left = `${rect.left}px`;
		element.style.width = `${rect.width}px`;
		element.style.height = `${rect.height}px`;
	}

	function getExpandedTargetRect(): LayoutRect | null {
		return getHeaderAwareGridRect(document.querySelector('.home-grid')) ?? componentLibraryStore.gridRect;
	}

	async function morphToGrid() {
		if (!overlayEl || !componentLibraryStore.originRect) {
			return;
		}

		applyRect(overlayEl, componentLibraryStore.originRect);
		isExpanded = false;

		await tick();

		scrollGridBelowHeader('.home-grid', prefersReducedMotion() ? 'auto' : 'smooth');

		const scrollDelay = prefersReducedMotion() ? 0 : 320;
		if (scrollDelay > 0) {
			await new Promise((resolve) => setTimeout(resolve, scrollDelay));
		}

		const targetRect = getExpandedTargetRect();
		if (!targetRect) {
			return;
		}

		if (prefersReducedMotion()) {
			applyRect(overlayEl, targetRect);
			isExpanded = true;
			return;
		}

		requestAnimationFrame(() => {
			if (!overlayEl) {
				return;
			}

			applyRect(overlayEl, targetRect);
			isExpanded = true;
		});
	}

	async function morphToOrigin() {
		if (!overlayEl) {
			componentLibraryStore.finishClose();
			return;
		}

		const originRect = componentLibraryStore.getOriginRect();
		if (!originRect) {
			componentLibraryStore.finishClose();
			return;
		}

		isExpanded = false;

		if (prefersReducedMotion()) {
			applyRect(overlayEl, originRect);
			componentLibraryStore.finishClose();
			return;
		}

		applyRect(overlayEl, originRect);
	}

	function handleClose() {
		componentLibraryStore.requestClose();
	}

	function handleTransitionEnd(event: TransitionEvent) {
		if (event.target !== overlayEl || event.propertyName !== 'width') {
			return;
		}

		if (componentLibraryStore.isClosing) {
			componentLibraryStore.finishClose();
		}
	}

	$effect(() => {
		if (!componentLibraryStore.isOpen || componentLibraryStore.isClosing || !overlayEl) {
			return;
		}

		void morphToGrid();
	});

	$effect(() => {
		if (!componentLibraryStore.isClosing || !componentLibraryStore.isOpen || !overlayEl) {
			return;
		}

		void morphToOrigin();
	});
</script>

{#if componentLibraryStore.isOpen}
	<div
		bind:this={overlayEl}
		class="component-library-overlay"
		class:component-library-overlay--expanded={isExpanded}
		style:--component-library-morph-ms="{MORPH_MS}ms"
		ontransitionend={handleTransitionEnd}
	>
		<DesignSystemBrowser open inline onclose={handleClose} />
	</div>
{/if}

<style>
	.component-library-overlay {
		position: fixed;
		z-index: 40;
		overflow: hidden;
		border-radius: 1.5rem;
		box-shadow:
			0 1.25rem 3rem rgba(0, 0, 0, 0.18),
			0 0 0 1px color-mix(in srgb, var(--border-color) 70%, transparent);
		background: var(--page-bg-subtle);
		transition:
			top var(--component-library-morph-ms) cubic-bezier(0.2, 0.8, 0.2, 1),
			left var(--component-library-morph-ms) cubic-bezier(0.2, 0.8, 0.2, 1),
			width var(--component-library-morph-ms) cubic-bezier(0.2, 0.8, 0.2, 1),
			height var(--component-library-morph-ms) cubic-bezier(0.2, 0.8, 0.2, 1),
			border-radius var(--component-library-morph-ms) cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.component-library-overlay--expanded {
		border-radius: 1.5rem;
	}

	.component-library-overlay :global(.design-browser) {
		height: 100%;
		max-height: none;
		overflow: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.component-library-overlay {
			transition: none;
		}
	}
</style>
