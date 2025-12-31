<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface ButtonProps extends HTMLButtonAttributes {
		class?: string;
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		children?: Snippet;
	}

	let {
		class: className = '',
		variant = 'primary',
		size = 'md',
		children,
		...buttonProps
	}: ButtonProps = $props();

	const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";
	
	const sizeClasses = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg"
	};

	const variantClasses = {
		primary: "bg-[var(--caroline-blue-700)] text-white hover:bg-[var(--caroline-blue-800)] focus:ring-[var(--caroline-blue-500)] border-2 border-[var(--liver-brown-500)]",
		secondary: "bg-[var(--sandy-tan-500)] text-[var(--liver-brown-800)] hover:bg-[var(--sandy-tan-600)] focus:ring-[var(--sandy-tan-700)] border-2 border-[var(--liver-brown-500)]",
		outline: "border-2 border-[var(--caroline-blue-600)] text-[var(--caroline-blue-700)] hover:bg-[var(--caroline-blue-100)] focus:ring-[var(--caroline-blue-500)] bg-transparent",
		ghost: "text-[var(--liver-brown-700)] hover:bg-[var(--sandy-tan-400)] focus:ring-[var(--sandy-tan-600)] bg-transparent"
	};

	const combinedClasses = $derived(
		`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
	);
</script>

<button 
	class={combinedClasses}
	{...buttonProps}
>
	{@render children?.()}
</button>
