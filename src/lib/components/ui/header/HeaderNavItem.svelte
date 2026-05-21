<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';

	interface HeaderNavItemProps {
		class?: ClassValue;
		href: Parameters<typeof resolve>[0];
		active?: boolean;
		children?: Snippet;
	}

	let { class: className, href, active = false, children }: HeaderNavItemProps = $props();
</script>

<a
	href={resolve(href)}
	class={cn(
		'style-none inline-flex items-center rounded-full border-2 border-(--border-color) bg-(--page-bg-subtle) px-3 py-1.5 text-sm font-medium whitespace-nowrap md:px-4 md:py-2',
		'transition-[background-color,border-color,color,box-shadow] duration-200',
		'focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary)',
		active
			? 'bg-(--page-bg-muted) text-(--text-primary)'
			: 'text-(--text-secondary) hover:bg-(--page-bg-muted) hover:text-(--text-primary)',
		className
	)}
	aria-current={active ? 'page' : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</a>
