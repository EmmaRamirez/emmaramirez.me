<script lang="ts">
	import type { Snippet } from 'svelte';

	type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

	interface FlexProps {
		/** Custom class names */
		class?: string;
		/** Gap between items */
		gap?: FlexGap;
		/** Vertical alignment of items */
		align?: FlexAlign;
		/** Horizontal distribution of items */
		justify?: FlexJustify;
		/** Wrap behavior */
		wrap?: FlexWrap;
		/** Reverse the direction */
		reverse?: boolean;
		children?: Snippet;
	}

	let {
		class: className = '',
		gap = 'md',
		align = 'center',
		justify = 'start',
		wrap = 'nowrap',
		reverse = false,
		children
	}: FlexProps = $props();

	const gapClasses: Record<FlexGap, string> = {
		none: 'gap-0',
		xs: 'gap-1',
		sm: 'gap-2',
		md: 'gap-4',
		lg: 'gap-6',
		xl: 'gap-8'
	};

	const alignClasses: Record<FlexAlign, string> = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end',
		stretch: 'items-stretch',
		baseline: 'items-baseline'
	};

	const justifyClasses: Record<FlexJustify, string> = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
		between: 'justify-between',
		around: 'justify-around',
		evenly: 'justify-evenly'
	};

	const wrapClasses: Record<FlexWrap, string> = {
		nowrap: 'flex-nowrap',
		wrap: 'flex-wrap',
		'wrap-reverse': 'flex-wrap-reverse'
	};

	const directionClass = $derived(reverse ? 'flex-row-reverse' : 'flex-row');

	const combinedClasses = $derived(
		`flex ${directionClass} ${gapClasses[gap]} ${alignClasses[align]} ${justifyClasses[justify]} ${wrapClasses[wrap]} ${className}`.trim()
	);
</script>

<div class={combinedClasses}>
	{@render children?.()}
</div>
