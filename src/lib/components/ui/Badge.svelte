<script lang="ts">
	import type { Snippet } from "svelte";

	type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
	type BadgeSize = 'sm' | 'md' | 'lg';

	interface BadgeProps {
		/** Custom class names */
		class?: string;
		/** Visual variant */
		variant?: BadgeVariant;
		/** Size */
		size?: BadgeSize;
		/** Make it a pill (fully rounded) */
		pill?: boolean;
		/** Show a dot indicator */
		dot?: boolean;
		children?: Snippet;
	}

	let {
		class: className = '',
		variant = 'default',
		size = 'md',
		pill = false,
		dot = false,
		children
	}: BadgeProps = $props();

	const baseClasses = "inline-flex items-center font-medium";

	const sizeClasses: Record<BadgeSize, string> = {
		sm: 'px-1.5 py-0.5 text-xs',
		md: 'px-2 py-0.5 text-sm',
		lg: 'px-2.5 py-1 text-sm'
	};

	const variantClasses: Record<BadgeVariant, string> = {
		default: 'bg-[var(--sandy-tan-500)] text-[var(--liver-brown-800)] border border-[var(--liver-brown-500)]',
		primary: 'bg-[var(--caroline-blue-200)] text-[var(--caroline-blue-900)] border border-[var(--caroline-blue-600)]',
		success: 'bg-[var(--lawn-green-500)]/20 text-[var(--lawn-green-800)] border border-[var(--lawn-green-600)]',
		warning: 'bg-[var(--transit-yellow-200)] text-[var(--liver-brown-800)] border border-[var(--transit-yellow-600)]',
		error: 'bg-red-100 text-red-800 border border-red-400',
		info: 'bg-blue-100 text-blue-800 border border-blue-400'
	};

	const dotColors: Record<BadgeVariant, string> = {
		default: 'bg-[var(--liver-brown-500)]',
		primary: 'bg-[var(--caroline-blue-700)]',
		success: 'bg-[var(--lawn-green-700)]',
		warning: 'bg-[var(--transit-yellow-700)]',
		error: 'bg-red-500',
		info: 'bg-blue-500'
	};

	const shapeClass = pill ? 'rounded-full' : 'rounded';

	const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${shapeClass} ${className}`.trim();
</script>

<span class={combinedClasses}>
	{#if dot}
		<span class="mr-1.5 h-1.5 w-1.5 rounded-full {dotColors[variant]}"></span>
	{/if}
	{@render children?.()}
</span>

