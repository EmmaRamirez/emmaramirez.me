<script lang="ts">
	import type { Snippet } from "svelte";

	interface CollapseProps {
		/** Custom class names */
		class?: string;
		/** Whether the panel is open */
		open?: boolean;
		/** Header/trigger text */
		title: string;
		/** Callback when toggle is clicked */
		ontoggle?: (open: boolean) => void;
		/** Content to show when expanded */
		children?: Snippet;
	}

	let {
		class: className = '',
		open = $bindable(false),
		title,
		ontoggle,
		children
	}: CollapseProps = $props();

	function toggle() {
		open = !open;
		ontoggle?.(open);
	}
</script>

<div class="border-2 border-[var(--liver-brown-500)] rounded-lg overflow-hidden {className}">
	<button
		type="button"
		class="flex w-full items-center justify-between gap-4 py-3 px-4 text-left bg-[var(--sandy-tan-300)] text-[var(--liver-brown-800)] font-medium transition-colors hover:bg-[var(--sandy-tan-400)] focus:outline-none focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:ring-inset"
		aria-expanded={open}
		onclick={toggle}
	>
		<span>{title}</span>
		<svg 
			class="shrink-0 transition-transform duration-200 {open ? 'rotate-180' : ''}"
			xmlns="http://www.w3.org/2000/svg" 
			width="20" 
			height="20" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="currentColor" 
			stroke-width="2" 
			stroke-linecap="round" 
			stroke-linejoin="round"
		>
			<path d="m6 9 6 6 6-6"/>
		</svg>
	</button>

	{#if open}
		<div class="p-4 bg-[var(--sandy-tan-200)] border-t-2 border-[var(--liver-brown-500)]">
			{@render children?.()}
		</div>
	{/if}
</div>

