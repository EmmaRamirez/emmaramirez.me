<script lang="ts">
	import type { Snippet } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface HeaderProps {
		class?: ClassValue;
		sticky?: boolean;
		children?: Snippet;
	}

	let {
		class: className,
		sticky = false,
		children,
	}: HeaderProps = $props();
</script>

<header
	class={cn(
		"w-full border-b-2 border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-sm",
		"flex items-center justify-between px-6 py-4",
		"transition-all duration-300",
		sticky && "sticky top-0 z-50",
		className
	)}
>
	{@render children?.()}
</header>
