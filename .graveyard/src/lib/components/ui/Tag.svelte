<script lang="ts">
	import type { Snippet } from 'svelte';

	type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
	type TagSize = 'sm' | 'md' | 'lg';

	interface TagProps {
		/** Custom class names */
		class?: string;
		/** Visual variant */
		variant?: TagVariant;
		/** Size */
		size?: TagSize;
		/** Show remove button */
		removable?: boolean;
		/** Callback when remove is clicked */
		onremove?: () => void;
		children?: Snippet;
	}

	let {
		class: className = '',
		variant = 'default',
		size = 'md',
		removable = false,
		onremove,
		children
	}: TagProps = $props();

	const baseClasses = 'inline-flex items-center gap-1 font-medium rounded-full';

	const sizeClasses: Record<TagSize, string> = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm',
		lg: 'px-3 py-1.5 text-sm'
	};

	const variantClasses: Record<TagVariant, string> = {
		default:
			'bg-[var(--sandy-tan-500)] text-[var(--liver-brown-800)] border border-[var(--liver-brown-500)]',
		primary:
			'bg-[var(--caroline-blue-200)] text-[var(--caroline-blue-900)] border border-[var(--caroline-blue-600)]',
		success: 'bg-green-100 text-green-800 border border-green-400',
		warning:
			'bg-[var(--transit-yellow-200)] text-[var(--liver-brown-800)] border border-[var(--transit-yellow-600)]',
		error: 'bg-red-100 text-red-800 border border-red-400'
	};

	const removeButtonClasses: Record<TagVariant, string> = {
		default: 'hover:bg-[var(--liver-brown-500)]/20',
		primary: 'hover:bg-[var(--caroline-blue-600)]/20',
		success: 'hover:bg-green-600/20',
		warning: 'hover:bg-[var(--transit-yellow-600)]/20',
		error: 'hover:bg-red-600/20'
	};

	const combinedClasses = $derived(
		`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()
	);
</script>

<span class={combinedClasses}>
	{@render children?.()}
	{#if removable}
		<button
			type="button"
			class="-mr-1 ml-0.5 rounded-full p-0.5 transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none {removeButtonClasses[
				variant
			]}"
			onclick={onremove}
			aria-label="Remove"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	{/if}
</span>
