<script lang="ts">
	import type { Snippet } from "svelte";

	interface ListProps {
		/** Custom class names */
		class?: string;
		/** Whether to show dividers between items */
		dividers?: boolean;
		/** List content */
		children?: Snippet;
	}

	let {
		class: className = '',
		dividers = true,
		children
	}: ListProps = $props();
</script>

<ul 
	class="bg-[var(--sandy-tan-200)] rounded-lg border-2 border-[var(--liver-brown-500)] overflow-hidden {dividers ? 'divide-y divide-[var(--liver-brown-500)]' : ''} {className}"
	role="list"
>
	{@render children?.()}
</ul>

