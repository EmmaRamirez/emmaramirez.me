<script lang="ts">
	import type { Snippet } from "svelte";
	import type { ClassValue } from "clsx";
	import { cn } from "$lib/utils";

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
</script>

<a
	{href}
	class={cn(
		"style-none px-4 py-2 rounded-lg text-sm font-medium",
		"transition-all duration-200",
		active
			? "bg-[var(--caroline-blue-600)] text-white shadow-sm"
			: "text-[var(--liver-brown-600)] hover:bg-[var(--sandy-tan-500)] hover:text-[var(--liver-brown-800)]",
		className
	)}
	aria-current={active ? "page" : undefined}
>
	{@render children?.()}
</a>
