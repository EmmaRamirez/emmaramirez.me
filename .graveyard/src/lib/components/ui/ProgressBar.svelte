<script lang="ts">
	type ProgressVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
	type ProgressSize = 'sm' | 'md' | 'lg';

	interface ProgressBarProps {
		/** Custom class names */
		class?: string;
		/** Current value (0-100) */
		value?: number;
		/** Maximum value */
		max?: number;
		/** Visual variant */
		variant?: ProgressVariant;
		/** Size */
		size?: ProgressSize;
		/** Show percentage label */
		showLabel?: boolean;
		/** Accessible label */
		'aria-label'?: string;
	}

	let {
		class: className = '',
		value = 0,
		max = 100,
		variant = 'primary',
		size = 'md',
		showLabel = false,
		'aria-label': ariaLabel
	}: ProgressBarProps = $props();

	const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

	const sizeClasses: Record<ProgressSize, string> = {
		sm: 'h-1.5',
		md: 'h-2.5',
		lg: 'h-4'
	};

	const variantClasses: Record<ProgressVariant, string> = {
		default: 'bg-[var(--liver-brown-600)]',
		primary: 'bg-[var(--caroline-blue-600)]',
		success: 'bg-green-500',
		warning: 'bg-[var(--transit-yellow-600)]',
		error: 'bg-red-500'
	};
</script>

<div class="w-full {className}">
	{#if showLabel}
		<div class="mb-1 flex justify-between">
			<span class="text-sm font-medium text-[var(--liver-brown-700)]">
				{ariaLabel ?? 'Progress'}
			</span>
			<span class="text-sm font-medium text-[var(--liver-brown-600)]">
				{Math.round(percentage)}%
			</span>
		</div>
	{/if}

	<div
		class="w-full overflow-hidden rounded-full bg-[var(--sandy-tan-500)] {sizeClasses[size]}"
		role="progressbar"
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={max}
		aria-label={ariaLabel}
	>
		<div
			class="h-full rounded-full transition-all duration-300 ease-out {variantClasses[variant]}"
			style="width: {percentage}%"
		></div>
	</div>
</div>
