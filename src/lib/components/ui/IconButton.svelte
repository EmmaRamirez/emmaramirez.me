<script lang="ts">
	import type { Snippet } from "svelte";

	type IconButtonSize = 'sm' | 'md' | 'lg';
	type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
	type IconButtonShape = 'square' | 'circle';

	interface IconButtonProps extends Omit<svelteHTML.HTMLAttributes<HTMLButtonElement>, 'aria-label'> {
		/** Custom class names */
		class?: string;
		/** Size of the button */
		size?: IconButtonSize;
		/** Visual variant */
		variant?: IconButtonVariant;
		/** Shape of the button */
		shape?: IconButtonShape;
		/** Required accessible label for the button (icons have no visible text) */
		'aria-label': string;
		/** Icon content */
		children?: Snippet;
	}

	let {
		class: className = '',
		size = 'md',
		variant = 'ghost',
		shape = 'square',
		'aria-label': ariaLabel,
		children,
		...buttonProps
	}: IconButtonProps = $props();

	const baseClasses = "inline-flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

	const sizeClasses: Record<IconButtonSize, string> = {
		sm: 'w-8 h-8 p-1.5',
		md: 'w-10 h-10 p-2',
		lg: 'w-12 h-12 p-2.5'
	};

	const shapeClasses: Record<IconButtonShape, string> = {
		square: 'rounded-lg',
		circle: 'rounded-full'
	};

	const variantClasses: Record<IconButtonVariant, string> = {
		primary: 'bg-[var(--caroline-blue-700)] text-white hover:bg-[var(--caroline-blue-800)] focus:ring-[var(--caroline-blue-500)] border-2 border-[var(--liver-brown-500)]',
		secondary: 'bg-[var(--sandy-tan-500)] text-[var(--liver-brown-800)] hover:bg-[var(--sandy-tan-600)] focus:ring-[var(--sandy-tan-700)] border-2 border-[var(--liver-brown-500)]',
		outline: 'border-2 border-[var(--caroline-blue-600)] text-[var(--caroline-blue-700)] hover:bg-[var(--caroline-blue-100)] focus:ring-[var(--caroline-blue-500)] bg-transparent',
		ghost: 'text-[var(--liver-brown-700)] hover:bg-[var(--sandy-tan-400)] focus:ring-[var(--sandy-tan-600)] bg-transparent'
	};

	const combinedClasses = $derived(
		`${baseClasses} ${sizeClasses[size]} ${shapeClasses[shape]} ${variantClasses[variant]} ${className}`.trim()
	);
</script>

<button
	class={combinedClasses}
	aria-label={ariaLabel}
	{...buttonProps}
>
	{@render children?.()}
</button>
