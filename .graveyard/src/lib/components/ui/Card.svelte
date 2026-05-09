<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CardProps extends svelteHTML.HTMLAttributes<HTMLDivElement> {
		class?: string;
		variant?: 'elevated' | 'flat' | 'outlined';
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		class: className = '',
		variant = 'elevated',
		header,
		footer,
		children,
		...divProps
	}: CardProps = $props();

	const baseClasses = 'rounded-lg overflow-hidden';

	const variantClasses = {
		elevated: 'bg-[var(--sandy-tan-200)] border-2 border-[var(--liver-brown-500)] shadow-md',
		flat: 'bg-[var(--sandy-tan-300)]',
		outlined: 'bg-transparent border-2 border-[var(--liver-brown-500)]'
	};

	const combinedClasses = $derived(`${baseClasses} ${variantClasses[variant]} ${className}`);
</script>

<div class={combinedClasses} {...divProps}>
	{#if header}
		<div class="border-b border-[var(--liver-brown-500)] bg-[var(--sandy-tan-400)] px-4 py-3">
			{@render header()}
		</div>
	{/if}

	<div class="p-4">
		{@render children?.()}
	</div>

	{#if footer}
		<div class="border-t border-[var(--liver-brown-500)] bg-[var(--sandy-tan-400)] px-4 py-3">
			{@render footer()}
		</div>
	{/if}
</div>
