<script lang="ts">
	import type { Snippet } from "svelte";

	type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
	type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface GridProps {
		/** Custom class names */
		class?: string;
		/** Number of columns */
		cols?: GridCols;
		/** Responsive columns at sm breakpoint */
		colsSm?: GridCols;
		/** Responsive columns at md breakpoint */
		colsMd?: GridCols;
		/** Responsive columns at lg breakpoint */
		colsLg?: GridCols;
		/** Gap between items */
		gap?: GridGap;
		children?: Snippet;
	}

	let {
		class: className = '',
		cols = 1,
		colsSm,
		colsMd,
		colsLg,
		gap = 'md',
		children
	}: GridProps = $props();

	const colClasses: Record<GridCols, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
		5: 'grid-cols-5',
		6: 'grid-cols-6',
		12: 'grid-cols-12',
		auto: 'grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))]'
	};

	const colSmClasses: Record<GridCols, string> = {
		1: 'sm:grid-cols-1',
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-3',
		4: 'sm:grid-cols-4',
		5: 'sm:grid-cols-5',
		6: 'sm:grid-cols-6',
		12: 'sm:grid-cols-12',
		auto: 'sm:grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))]'
	};

	const colMdClasses: Record<GridCols, string> = {
		1: 'md:grid-cols-1',
		2: 'md:grid-cols-2',
		3: 'md:grid-cols-3',
		4: 'md:grid-cols-4',
		5: 'md:grid-cols-5',
		6: 'md:grid-cols-6',
		12: 'md:grid-cols-12',
		auto: 'md:grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))]'
	};

	const colLgClasses: Record<GridCols, string> = {
		1: 'lg:grid-cols-1',
		2: 'lg:grid-cols-2',
		3: 'lg:grid-cols-3',
		4: 'lg:grid-cols-4',
		5: 'lg:grid-cols-5',
		6: 'lg:grid-cols-6',
		12: 'lg:grid-cols-12',
		auto: 'lg:grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))]'
	};

	const gapClasses: Record<GridGap, string> = {
		none: 'gap-0',
		xs: 'gap-1',
		sm: 'gap-2',
		md: 'gap-4',
		lg: 'gap-6',
		xl: 'gap-8'
	};

	const responsiveCols = $derived(
		[
			colClasses[cols],
			colsSm ? colSmClasses[colsSm] : '',
			colsMd ? colMdClasses[colsMd] : '',
			colsLg ? colLgClasses[colsLg] : ''
		]
			.filter(Boolean)
			.join(' ')
	);

	const combinedClasses = $derived(
		`grid ${responsiveCols} ${gapClasses[gap]} ${className}`.trim()
	);
</script>

<div class={combinedClasses}>
	{@render children?.()}
</div>
