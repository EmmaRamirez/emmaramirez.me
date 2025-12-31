<script lang="ts">
	import type { Snippet } from "svelte";

	type LinkButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
	type LinkButtonSize = 'sm' | 'md' | 'lg';

	interface LinkButtonProps {
		/** Custom class names */
		class?: string;
		/** URL to navigate to */
		href: string;
		/** Visual variant */
		variant?: LinkButtonVariant;
		/** Button size */
		size?: LinkButtonSize;
		/** Open in new tab */
		external?: boolean;
		/** Disable the link */
		disabled?: boolean;
		children?: Snippet;
	}

	let {
		class: className = '',
		href,
		variant = 'primary',
		size = 'md',
		external = false,
		disabled = false,
		children
	}: LinkButtonProps = $props();

	const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 no-underline";
	
	const sizeClasses: Record<LinkButtonSize, string> = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg"
	};

	const variantClasses: Record<LinkButtonVariant, string> = {
		primary: "bg-[var(--caroline-blue-700)] text-white hover:bg-[var(--caroline-blue-800)] focus:ring-[var(--caroline-blue-500)] border-2 border-[var(--liver-brown-500)]",
		secondary: "bg-[var(--sandy-tan-500)] text-[var(--liver-brown-800)] hover:bg-[var(--sandy-tan-600)] focus:ring-[var(--sandy-tan-700)] border-2 border-[var(--liver-brown-500)]",
		outline: "border-2 border-[var(--caroline-blue-600)] text-[var(--caroline-blue-700)] hover:bg-[var(--caroline-blue-100)] focus:ring-[var(--caroline-blue-500)] bg-transparent",
		ghost: "text-[var(--liver-brown-700)] hover:bg-[var(--sandy-tan-400)] focus:ring-[var(--sandy-tan-600)] bg-transparent"
	};

	const disabledClasses = $derived(
		disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "cursor-pointer"
	);

	const combinedClasses = $derived(
		`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className} style-none`.trim()
	);
</script>

<a
	class={combinedClasses}
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	aria-disabled={disabled ? 'true' : undefined}
	tabindex={disabled ? -1 : undefined}
>
	{@render children?.()}
</a>
