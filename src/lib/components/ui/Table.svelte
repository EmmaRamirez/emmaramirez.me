<script lang="ts">
	import type { Snippet } from "svelte";

	type Column<T> = {
		key: keyof T | string;
		header: string;
		sortable?: boolean;
		width?: string;
		align?: 'left' | 'center' | 'right';
	};

	type SortDirection = 'asc' | 'desc' | null;

	interface TableProps<T> {
		/** Custom class names */
		class?: string;
		/** Column definitions */
		columns: Column<T>[];
		/** Data rows */
		data: T[];
		/** Currently sorted column */
		sortColumn?: keyof T | string | null;
		/** Sort direction */
		sortDirection?: SortDirection;
		/** Callback when sort changes */
		onsort?: (column: keyof T | string, direction: SortDirection) => void;
		/** Row click handler */
		onrowclick?: (row: T, index: number) => void;
		/** Custom cell renderer */
		cell?: Snippet<[{ row: T; column: Column<T>; value: unknown }]>;
		/** Empty state content */
		empty?: Snippet;
	}

	let {
		class: className = '',
		columns,
		data,
		sortColumn = $bindable(null),
		sortDirection = $bindable(null),
		onsort,
		onrowclick,
		cell,
		empty
	}: TableProps<Record<string, unknown>> = $props();

	function handleSort(column: Column<Record<string, unknown>>) {
		if (!column.sortable) return;
		
		let newDirection: SortDirection = 'asc';
		if (sortColumn === column.key) {
			if (sortDirection === 'asc') newDirection = 'desc';
			else if (sortDirection === 'desc') newDirection = null;
		}
		
		sortColumn = newDirection ? column.key : null;
		sortDirection = newDirection;
		onsort?.(column.key, newDirection);
	}

	function getCellValue(row: Record<string, unknown>, key: string): unknown {
		return key.split('.').reduce((obj: unknown, k) => {
			if (obj && typeof obj === 'object' && k in obj) {
				return (obj as Record<string, unknown>)[k];
			}
			return undefined;
		}, row);
	}

	const alignClasses = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	};
</script>

<div class="overflow-x-auto {className}">
	<table class="w-full border-collapse">
		<thead>
			<tr class="border-b-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-300)]">
				{#each columns as column (column.key)}
					<th
						class="px-4 py-3 font-semibold text-[var(--liver-brown-800)] {alignClasses[column.align ?? 'left']} {column.sortable ? 'cursor-pointer select-none hover:bg-[var(--sandy-tan-400)]' : ''}"
						style={column.width ? `width: ${column.width}` : ''}
						onclick={() => handleSort(column)}
						aria-sort={sortColumn === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
					>
						<span class="inline-flex items-center gap-1">
							{column.header}
							{#if column.sortable}
								<span class="text-[var(--liver-brown-500)]">
									{#if sortColumn === column.key && sortDirection === 'asc'}
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="m18 15-6-6-6 6"/>
										</svg>
									{:else if sortColumn === column.key && sortDirection === 'desc'}
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="m6 9 6 6 6-6"/>
										</svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30">
											<path d="m7 15 5 5 5-5"/>
											<path d="m7 9 5-5 5 5"/>
										</svg>
									{/if}
								</span>
							{/if}
						</span>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-[var(--liver-brown-400)]">
			{#if data.length === 0}
				<tr>
					<td colspan={columns.length} class="px-4 py-8 text-center text-[var(--liver-brown-600)]">
						{#if empty}
							{@render empty()}
						{:else}
							No data available
						{/if}
					</td>
				</tr>
			{:else}
				{#each data as row, i (i)}
					<tr
						class="bg-[var(--sandy-tan-200)] hover:bg-[var(--sandy-tan-300)] transition-colors {onrowclick ? 'cursor-pointer' : ''}"
						onclick={() => onrowclick?.(row, i)}
					>
						{#each columns as column (column.key)}
							<td class="px-4 py-3 text-[var(--liver-brown-800)] {alignClasses[column.align ?? 'left']}">
								{#if cell}
									{@render cell({ row, column, value: getCellValue(row, String(column.key)) })}
								{:else}
									{getCellValue(row, String(column.key)) ?? '—'}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

