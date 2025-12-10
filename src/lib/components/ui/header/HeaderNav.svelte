<script lang="ts">
	import type { Snippet } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface HeaderNavProps {
		class?: ClassValue;
		children?: Snippet;
	}

	let {
		class: className,
		children,
	}: HeaderNavProps = $props();
</script>

<nav
	class={cn(
		"flex items-center gap-1",
		className
	)}
>
	{@render children?.()}
</nav>
