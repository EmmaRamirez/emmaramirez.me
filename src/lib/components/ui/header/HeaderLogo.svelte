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
		"header-logo style-none flex items-center gap-3 font-semibold text-lg",
		"text-(--text-primary)",
		"transition-colors duration-200",
		className
	)}
>
	{#if children}
		{@render children()}
	{/if}
</a>

<style>
	.header-logo:hover {
		background-image: linear-gradient(
			100deg,
			var(--caroline-blue-700),
			var(--caroline-blue-500),
			var(--caroline-blue-800)
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		text-shadow: 0 0 0.75rem rgba(70, 140, 255, 0.35);
	}
</style>
