<script lang="ts">
	import type { Snippet } from "svelte";
	import type { ClassValue } from "clsx";
	import { cn } from "$lib/utils";
	import { setContext } from "svelte";

	interface HeaderNavProps {
		class?: ClassValue;
		children?: Snippet;
	}

	let {
		class: className,
		children,
	}: HeaderNavProps = $props();

	let navRef: HTMLElement | undefined = $state();
	let indicatorStyle = $state({ left: 0, width: 0, visible: false });

	const navContext = {
		updateIndicator: (element: HTMLElement) => {
			if (navRef && element) {
				const navRect = navRef.getBoundingClientRect();
				const itemRect = element.getBoundingClientRect();
				indicatorStyle = {
					left: itemRect.left - navRect.left,
					width: itemRect.width,
					visible: true
				};
			}
		}
	};

	setContext('header-nav', navContext);
</script>

<nav
	bind:this={navRef}
	class={cn(
		"relative flex items-center gap-1",
		className
	)}
>
	{#if children}
		{@render children()}
	{/if}
	
	<span
		class={cn(
			"absolute bottom-0 h-[0.125rem] bg-(--caroline-blue-600) transition-all duration-300 ease-out",
			!indicatorStyle.visible && "opacity-0"
		)}
		style="left: {indicatorStyle.left / 16}rem; width: {indicatorStyle.width / 16}rem;"
		aria-hidden="true"
	></span>
</nav>
