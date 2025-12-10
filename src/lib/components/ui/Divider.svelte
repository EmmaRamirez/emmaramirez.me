<script lang="ts">
	type DividerOrientation = 'horizontal' | 'vertical';
	type DividerVariant = 'solid' | 'dashed' | 'dotted';
	type DividerColor = 'default' | 'muted' | 'accent';

	interface DividerProps {
		/** Custom class names */
		class?: string;
		/** Direction of the divider */
		orientation?: DividerOrientation;
		/** Line style */
		variant?: DividerVariant;
		/** Color variant */
		color?: DividerColor;
		/** Spacing around the divider */
		spacing?: 'none' | 'sm' | 'md' | 'lg';
	}

	let {
		class: className = '',
		orientation = 'horizontal',
		variant = 'solid',
		color = 'default',
		spacing = 'md'
	}: DividerProps = $props();

	const variantClasses: Record<DividerVariant, string> = {
		solid: 'border-solid',
		dashed: 'border-dashed',
		dotted: 'border-dotted'
	};

	const colorClasses: Record<DividerColor, string> = {
		default: 'border-[var(--liver-brown-500)]',
		muted: 'border-[var(--sandy-tan-600)]',
		accent: 'border-[var(--caroline-blue-500)]'
	};

	const horizontalSpacing: Record<string, string> = {
		none: '',
		sm: 'my-2',
		md: 'my-4',
		lg: 'my-8'
	};

	const verticalSpacing: Record<string, string> = {
		none: '',
		sm: 'mx-2',
		md: 'mx-4',
		lg: 'mx-8'
	};

	const isHorizontal = orientation === 'horizontal';

	const orientationClasses = isHorizontal
		? `w-full border-t ${horizontalSpacing[spacing]}`
		: `h-full border-l self-stretch ${verticalSpacing[spacing]}`;

	const combinedClasses = `${orientationClasses} ${variantClasses[variant]} ${colorClasses[color]} ${className}`.trim();
</script>

<hr
	class={combinedClasses}
	aria-orientation={orientation}
/>

