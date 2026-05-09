<script lang="ts">
	import type { Snippet } from 'svelte';

	type TrendDirection = 'up' | 'down' | 'neutral';
	type StatisticSize = 'sm' | 'md' | 'lg';

	interface StatisticProps {
		/** Custom class names */
		class?: string;
		/** The main numeric value */
		value: string | number;
		/** Label describing the statistic */
		label: string;
		/** Optional prefix (e.g., "$") */
		prefix?: string;
		/** Optional suffix (e.g., "%") */
		suffix?: string;
		/** Trend direction */
		trend?: TrendDirection;
		/** Trend value text */
		trendValue?: string;
		/** Size variant */
		size?: StatisticSize;
		/** Optional icon */
		icon?: Snippet;
	}

	let {
		class: className = '',
		value,
		label,
		prefix,
		suffix,
		trend,
		trendValue,
		size = 'md',
		icon
	}: StatisticProps = $props();

	const sizeClasses: Record<StatisticSize, { value: string; label: string }> = {
		sm: { value: 'text-2xl', label: 'text-xs' },
		md: { value: 'text-3xl', label: 'text-sm' },
		lg: { value: 'text-4xl', label: 'text-base' }
	};

	const trendColors: Record<TrendDirection, string> = {
		up: 'text-green-600',
		down: 'text-red-600',
		neutral: 'text-[var(--liver-brown-600)]'
	};

	const trendIcons: Record<TrendDirection, string> = {
		up: 'M5 15l7-7 7 7',
		down: 'M19 9l-7 7-7-7',
		neutral: 'M5 12h14'
	};
</script>

<div class="flex flex-col {className}">
	{#if icon}
		<div class="mb-2 text-[var(--caroline-blue-600)]">
			{@render icon()}
		</div>
	{/if}

	<p class="text-[var(--liver-brown-600)] {sizeClasses[size].label}">
		{label}
	</p>

	<div class="mt-1 flex items-baseline gap-2">
		<p class="font-bold tracking-tight text-[var(--liver-brown-900)] {sizeClasses[size].value}">
			{#if prefix}<span class="text-[var(--liver-brown-600)]">{prefix}</span
				>{/if}{value}{#if suffix}<span class="text-[var(--liver-brown-600)]">{suffix}</span>{/if}
		</p>

		{#if trend && trendValue}
			<div class="flex items-center gap-0.5 {trendColors[trend]} text-sm font-medium">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d={trendIcons[trend]}></path>
				</svg>
				<span>{trendValue}</span>
			</div>
		{/if}
	</div>
</div>
