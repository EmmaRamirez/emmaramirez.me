<script lang="ts">
	import type { Snippet } from "svelte";

	interface ListItemProps {
		/** Custom class names */
		class?: string;
		/** Link destination */
		href?: string;
		/** Click handler */
		onclick?: () => void;
		/** Leading content (icon, avatar) */
		leading?: Snippet;
		/** Trailing content (badge, action) */
		trailing?: Snippet;
		/** Main content */
		children?: Snippet;
		/** Secondary/description text */
		description?: string;
	}

	let {
		class: className = '',
		href,
		onclick,
		leading,
		trailing,
		children,
		description
	}: ListItemProps = $props();

	const isInteractive = href || onclick;
	const baseClasses = "flex items-center gap-3 px-4 py-3";
	const interactiveClasses = isInteractive 
		? "hover:bg-[var(--sandy-tan-400)] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:ring-inset" 
		: "";
</script>

{#if href}
	<li>
		<a 
			{href}
			class="{baseClasses} {interactiveClasses} {className} style-none no-underline"
		>
			{#if leading}
				<div class="shrink-0 text-[var(--liver-brown-600)]">
					{@render leading()}
				</div>
			{/if}
			<div class="flex-1 min-w-0">
				<div class="text-[var(--liver-brown-800)] font-medium truncate">
					{@render children?.()}
				</div>
				{#if description}
					<p class="text-sm text-[var(--liver-brown-600)] truncate">{description}</p>
				{/if}
			</div>
			{#if trailing}
				<div class="shrink-0">
					{@render trailing()}
				</div>
			{/if}
		</a>
	</li>
{:else if onclick}
	<li>
		<button
			type="button"
			class="{baseClasses} {interactiveClasses} {className} w-full text-left"
			{onclick}
		>
			{#if leading}
				<div class="shrink-0 text-[var(--liver-brown-600)]">
					{@render leading()}
				</div>
			{/if}
			<div class="flex-1 min-w-0">
				<div class="text-[var(--liver-brown-800)] font-medium truncate">
					{@render children?.()}
				</div>
				{#if description}
					<p class="text-sm text-[var(--liver-brown-600)] truncate">{description}</p>
				{/if}
			</div>
			{#if trailing}
				<div class="shrink-0">
					{@render trailing()}
				</div>
			{/if}
		</button>
	</li>
{:else}
	<li class="{baseClasses} {className}">
		{#if leading}
			<div class="shrink-0 text-[var(--liver-brown-600)]">
				{@render leading()}
			</div>
		{/if}
		<div class="flex-1 min-w-0">
			<div class="text-[var(--liver-brown-800)] font-medium truncate">
				{@render children?.()}
			</div>
			{#if description}
				<p class="text-sm text-[var(--liver-brown-600)] truncate">{description}</p>
			{/if}
		</div>
		{#if trailing}
			<div class="shrink-0">
				{@render trailing()}
			</div>
		{/if}
	</li>
{/if}

