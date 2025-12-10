<script lang="ts">
	type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
	type SpinnerVariant = 'default' | 'primary' | 'white';

	interface SpinnerProps {
		/** Custom class names */
		class?: string;
		/** Size of the spinner */
		size?: SpinnerSize;
		/** Color variant */
		variant?: SpinnerVariant;
		/** Accessible label */
		'aria-label'?: string;
	}

	let {
		class: className = '',
		size = 'md',
		variant = 'primary',
		'aria-label': ariaLabel = 'Loading'
	}: SpinnerProps = $props();

	const sizeClasses: Record<SpinnerSize, string> = {
		sm: 'h-4 w-4 border-2',
		md: 'h-6 w-6 border-2',
		lg: 'h-8 w-8 border-3',
		xl: 'h-12 w-12 border-4'
	};

	const variantClasses: Record<SpinnerVariant, string> = {
		default: 'border-[var(--liver-brown-500)] border-t-transparent',
		primary: 'border-[var(--caroline-blue-600)] border-t-transparent',
		white: 'border-white border-t-transparent'
	};

	const combinedClasses = `inline-block rounded-full animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();
</script>

<div
	class={combinedClasses}
	role="status"
	aria-label={ariaLabel}
>
	<span class="sr-only">{ariaLabel}</span>
</div>

