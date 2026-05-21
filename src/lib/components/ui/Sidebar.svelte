<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SidebarProps {
		/** Custom class names */
		class?: string;
		/** Sidebar content */
		children?: Snippet;
		/** Header content */
		header?: Snippet;
		/** Footer content */
		footer?: Snippet;
		/** Width of sidebar */
		width?: string;
		/** Whether sidebar is collapsed */
		collapsed?: boolean;
		/** Position */
		position?: 'left' | 'right';
	}

	let {
		class: className = '',
		children,
		header,
		footer,
		width = '16rem',
		collapsed = false,
		position = 'left'
	}: SidebarProps = $props();
</script>

<aside
	class="flex h-full flex-col border-[var(--liver-brown-500)] bg-[var(--sandy-tan-300)] transition-all duration-300
		{position === 'left' ? 'border-r-2' : 'border-l-2'}
		{className}"
	style="width: {collapsed ? '4rem' : width}"
	aria-label="Sidebar"
>
	{#if header}
		<div class="shrink-0 border-b-2 border-[var(--liver-brown-500)] p-4">
			{@render header()}
		</div>
	{/if}

	<div class="flex-1 overflow-y-auto p-4">
		{@render children?.()}
	</div>

	{#if footer}
		<div class="shrink-0 border-t-2 border-[var(--liver-brown-500)] p-4">
			{@render footer()}
		</div>
	{/if}
</aside>
