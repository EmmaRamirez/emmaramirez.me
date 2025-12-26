<script lang="ts">
	import type { Snippet } from "svelte";
	import type { ClassValue } from "clsx";
	import { cn } from "$lib/utils";
	import { getContext, onMount } from "svelte";

	interface HeaderNavItemProps {
		class?: ClassValue;
		href: string;
		active?: boolean;
		children?: Snippet;
	}

	let {
		class: className,
		href,
		active = false,
		children,
	}: HeaderNavItemProps = $props();

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
		"style-none px-4 py-2 text-sm font-medium",
		"transition-all duration-200",
		active
			? "text-(--text-primary)"
			: "text-(--text-secondary) hover:text-(--text-primary)",
		className
	)}
	aria-current={active ? "page" : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</a>
