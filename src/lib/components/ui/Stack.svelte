<script lang="ts">
	import type { Snippet } from "svelte";

	type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type StackAlign = 'start' | 'center' | 'end' | 'stretch';

	interface StackProps {
		/** Custom class names */
		class?: string;
		/** Gap between items */
		gap?: StackGap;
		/** Horizontal alignment of items */
		align?: StackAlign;
		children?: Snippet;
	}

	let {
		class: className = '',
		gap = 'md',
		align = 'stretch',
		children
	}: StackProps = $props();

	const gapClasses: Record<StackGap, string> = {
		none: 'gap-0',
		xs: 'gap-1',
		sm: 'gap-2',
		md: 'gap-4',
		lg: 'gap-6',
		xl: 'gap-8'
	};

	const alignClasses: Record<StackAlign, string> = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end',
		stretch: 'items-stretch'
	};

	const combinedClasses = `flex flex-col ${gapClasses[gap]} ${alignClasses[align]} ${className}`.trim();
</script>

<div class={combinedClasses}>
	{@render children?.()}
</div>

