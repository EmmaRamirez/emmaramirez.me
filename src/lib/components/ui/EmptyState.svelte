<script lang="ts">
	import type { Snippet } from 'svelte';

	interface EmptyStateProps {
		/** Custom class names */
		class?: string;
		/** Title text */
		title: string;
		/** Description text */
		description?: string;
		/** Custom illustration or icon */
		icon?: Snippet;
		/** Action buttons or links */
		actions?: Snippet;
	}

	let { class: className = '', title, description, icon, actions }: EmptyStateProps = $props();
</script>

<div class="flex flex-col items-center justify-center px-4 py-12 text-center {className}">
	{#if icon}
		<div class="mb-4 text-[var(--liver-brown-500)]">
			{@render icon()}
		</div>
	{:else}
		<svg
			class="mb-4 text-[var(--liver-brown-400)]"
			xmlns="http://www.w3.org/2000/svg"
			width="64"
			height="64"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
			<polyline points="13 2 13 9 20 9"></polyline>
			<line x1="9" y1="13" x2="15" y2="13"></line>
			<line x1="9" y1="17" x2="15" y2="17"></line>
		</svg>
	{/if}

	<h3 class="mb-1 text-lg font-semibold text-[var(--liver-brown-800)]">
		{title}
	</h3>

	{#if description}
		<p class="max-w-sm text-sm text-[var(--liver-brown-600)]">
			{description}
		</p>
	{/if}

	{#if actions}
		<div class="mt-6">
			{@render actions()}
		</div>
	{/if}
</div>
