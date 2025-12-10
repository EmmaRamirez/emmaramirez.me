<script lang="ts">
	import type { Snippet } from "svelte";

	interface NavbarProps {
		/** Custom class names */
		class?: string;
		/** Logo/brand content */
		brand?: Snippet;
		/** Navigation links */
		nav?: Snippet;
		/** Right side actions */
		actions?: Snippet;
		/** Whether to use sticky positioning */
		sticky?: boolean;
		/** Background variant */
		variant?: 'default' | 'transparent' | 'blur';
	}

	let {
		class: className = '',
		brand,
		nav,
		actions,
		sticky = false,
		variant = 'default'
	}: NavbarProps = $props();

	const variantClasses = {
		default: 'bg-[var(--sandy-tan-200)] border-b-2 border-[var(--liver-brown-500)]',
		transparent: 'bg-transparent',
		blur: 'bg-[var(--sandy-tan-200)]/80 backdrop-blur-md border-b border-[var(--liver-brown-400)]'
	};
</script>

<header 
	class="w-full z-40 {sticky ? 'sticky top-0' : ''} {variantClasses[variant]} {className}"
	role="banner"
>
	<nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
		<div class="flex h-16 items-center justify-between">
			<!-- Brand -->
			{#if brand}
				<div class="flex-shrink-0">
					{@render brand()}
				</div>
			{/if}

			<!-- Navigation Links -->
			{#if nav}
				<div class="hidden md:flex md:items-center md:gap-1">
					{@render nav()}
				</div>
			{/if}

			<!-- Actions -->
			{#if actions}
				<div class="flex items-center gap-2">
					{@render actions()}
				</div>
			{/if}
		</div>
	</nav>
</header>

