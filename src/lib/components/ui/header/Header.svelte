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
		"w-full max-w-full overflow-x-auto border-b-2 border-(--border-color) bg-(--header-bg) backdrop-blur-sm",
		"flex items-center justify-between px-4 py-3 md:px-6 md:py-4",
		"transition-all duration-300",
		sticky && "sticky top-0 z-50",
		className
	)}
>
	{@render children?.()}
</header>
