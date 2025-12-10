<script lang="ts">
	import type { Snippet } from "svelte";
	import type { ClassValue } from "clsx";
	import { cn } from "$lib/utils";

	interface HeaderLogoProps {
		class?: ClassValue;
		href?: string;
		children?: Snippet;
	}

	let {
		class: className,
		href = "/",
		children,
	}: HeaderLogoProps = $props();
</script>

<a
	{href}
	class={cn(
		"style-none flex items-center gap-3 font-semibold text-lg",
		"text-[var(--liver-brown-700)] hover:text-[var(--liver-brown-900)]",
		"transition-colors duration-200",
		className
	)}
>
	{#if children}
		{@render children()}
	{/if}
</a>
