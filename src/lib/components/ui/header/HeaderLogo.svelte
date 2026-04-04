<script lang="ts">
	import type { Snippet } from "svelte";
	import type { ClassValue } from "clsx";
	import { resolve } from "$app/paths";
	import { cn } from "$lib/utils";
	import { onDestroy } from "svelte";

	interface HeaderLogoProps {
		class?: ClassValue;
		children?: Snippet;
	}

	let {
		class: className,
		children,
	}: HeaderLogoProps = $props();

	const HOVER_EXIT_DELAY_MS = 160;

	let isHovered = $state(false);
	let hoverExitTimeout: ReturnType<typeof setTimeout> | undefined;

	function clearHoverExitTimeout() {
		if (hoverExitTimeout !== undefined) {
			clearTimeout(hoverExitTimeout);
			hoverExitTimeout = undefined;
		}
	}

	function handleMouseEnter() {
		clearHoverExitTimeout();
		isHovered = true;
	}

	function handleMouseLeave() {
		clearHoverExitTimeout();
		hoverExitTimeout = setTimeout(() => {
			isHovered = false;
			hoverExitTimeout = undefined;
		}, HOVER_EXIT_DELAY_MS);
	}

	onDestroy(() => {
		clearHoverExitTimeout();
	});
</script>

<a
	href={resolve("/")}
	class={cn(
		"header-logo style-none flex items-center gap-3 font-semibold text-lg",
		{ "is-hovered": isHovered },
		"text-(--text-primary)",
		"transition-colors duration-200",
		className
	)}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	{#if children}
		{@render children()}
	{/if}
</a>

<style>
	.header-logo.is-hovered {
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
