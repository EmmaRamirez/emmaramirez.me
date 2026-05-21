<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';

	interface HeaderNavProps {
		class?: ClassValue;
		children?: Snippet;
	}

	let { class: className, children }: HeaderNavProps = $props();
</script>

<nav class={cn('flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto', className)}>
	{#if children}
		{@render children()}
	{/if}
</nav>
