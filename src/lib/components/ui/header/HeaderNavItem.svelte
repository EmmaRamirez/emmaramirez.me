<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';
	import { getContext, onMount } from 'svelte';

	interface HeaderNavItemProps {
		class?: ClassValue;
		href: string;
		active?: boolean;
		children?: Snippet;
	}

	let { class: className, href, active = false, children }: HeaderNavItemProps = $props();

	let itemRef: HTMLElement | undefined = $state();

	const navContext = getContext<{ updateIndicator: (el: HTMLElement) => void }>('header-nav');

	$effect(() => {
		if (active && itemRef && navContext) {
			navContext.updateIndicator(itemRef);
		}
	});

	onMount(() => {
		const handleResize = () => {
			if (active && itemRef && navContext) {
				navContext.updateIndicator(itemRef);
			}
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});
</script>

<a
	bind:this={itemRef}
	{href}
	class={cn(
		'style-none inline-flex items-center rounded-full border-2 border-(--border-color) bg-(--page-bg-subtle) px-3 py-1.5 text-sm font-medium whitespace-nowrap md:px-4 md:py-2',
		'transition-[background-color,border-color,color,box-shadow] duration-200',
		'focus:outline-none focus-visible:ring-2 focus-visible:ring-(--caroline-blue-600)',
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
