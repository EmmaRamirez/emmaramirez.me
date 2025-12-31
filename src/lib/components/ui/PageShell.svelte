<script lang="ts">
	import type { Snippet } from "svelte";

	interface PageShellProps {
		/** Custom class names for the shell wrapper */
		class?: string;
		/** Header content (navigation, branding) */
		header?: Snippet;
		/** Footer content */
		footer?: Snippet;
		/** Main page content */
		children?: Snippet;
	}

	let {
		class: className = '',
		header,
		footer,
		children
	}: PageShellProps = $props();

	const shellClasses = $derived(`min-h-screen flex flex-col ${className}`.trim());
</script>

<div class={shellClasses}>
	{#if header}
		<header class="shrink-0">
			{@render header()}
		</header>
	{/if}

	<main class="flex-1">
		{@render children?.()}
	</main>

	{#if footer}
		<footer class="shrink-0">
			{@render footer()}
		</footer>
	{/if}
</div>
