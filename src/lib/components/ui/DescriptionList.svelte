<script lang="ts">
	type DescriptionItem = {
		term: string;
		description: string | number;
	};

	type LayoutDirection = 'vertical' | 'horizontal';

	interface DescriptionListProps {
		/** Custom class names */
		class?: string;
		/** Array of term/description pairs */
		items: DescriptionItem[];
		/** Layout direction */
		layout?: LayoutDirection;
		/** Show dividers between items */
		dividers?: boolean;
		/** Striped rows (for horizontal layout) */
		striped?: boolean;
	}

	let {
		class: className = '',
		items,
		layout = 'vertical',
		dividers = false,
		striped = false
	}: DescriptionListProps = $props();

	const isHorizontal = layout === 'horizontal';
</script>

<dl class={className}>
	{#each items as item, i (item.term)}
		<div 
			class="
				{isHorizontal ? 'flex flex-col sm:flex-row sm:gap-4' : 'flex flex-col'}
				{dividers && i > 0 ? 'border-t border-[var(--liver-brown-500)] pt-4' : ''}
				{striped && i % 2 === 1 ? 'bg-[var(--sandy-tan-300)]' : ''}
				{isHorizontal ? 'py-3 px-4' : 'py-2'}
			"
		>
			<dt class="
				font-medium text-[var(--liver-brown-700)]
				{isHorizontal ? 'sm:w-1/3 sm:shrink-0' : 'text-sm'}
			">
				{item.term}
			</dt>
			<dd class="
				text-[var(--liver-brown-800)]
				{isHorizontal ? 'sm:flex-1' : 'mt-1'}
			">
				{item.description}
			</dd>
		</div>
	{/each}
</dl>

