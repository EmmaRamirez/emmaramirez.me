<script lang="ts">
	interface PaginationProps {
		/** Custom class names */
		class?: string;
		/** Current page (1-indexed) */
		currentPage?: number;
		/** Total number of pages */
		totalPages: number;
		/** Number of page buttons to show */
		siblingCount?: number;
		/** Callback when page changes */
		onchange?: (page: number) => void;
	}

	let {
		class: className = '',
		currentPage = $bindable(1),
		totalPages,
		siblingCount = 1,
		onchange
	}: PaginationProps = $props();

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			currentPage = page;
			onchange?.(page);
		}
	}

	const pages = $derived.by(() => {
		const range: (number | 'ellipsis')[] = [];
		const start = Math.max(2, currentPage - siblingCount);
		const end = Math.min(totalPages - 1, currentPage + siblingCount);

		range.push(1);

		if (start > 2) {
			range.push('ellipsis');
		}

		for (let i = start; i <= end; i++) {
			range.push(i);
		}

		// Add ellipsis before last if needed
		if (end < totalPages - 1) {
			range.push('ellipsis');
		}

		// Always show last page (if more than 1 page)
		if (totalPages > 1) {
			range.push(totalPages);
		}

		return range;
	});

	const buttonBaseClass = "inline-flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:ring-offset-1";
	const activeClass = "bg-[var(--caroline-blue-700)] text-white border-2 border-[var(--liver-brown-500)]";
	const inactiveClass = "text-[var(--liver-brown-700)] hover:bg-[var(--sandy-tan-400)] border-2 border-transparent";
	const disabledClass = "opacity-50 cursor-not-allowed";
</script>

<nav aria-label="Pagination" class="flex items-center gap-1 {className}">
	<!-- Previous Button -->
	<button
		type="button"
		class="{buttonBaseClass} {currentPage <= 1 ? disabledClass : inactiveClass}"
		disabled={currentPage <= 1}
		onclick={() => goToPage(currentPage - 1)}
		aria-label="Previous page"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="m15 18-6-6 6-6"/>
		</svg>
	</button>

	<!-- Page Numbers -->
	{#each pages as page, i (i)}
		{#if page === 'ellipsis'}
			<span class="w-9 h-9 flex items-center justify-center text-[var(--liver-brown-500)]">
				...
			</span>
		{:else}
			<button
				type="button"
				class="{buttonBaseClass} {page === currentPage ? activeClass : inactiveClass}"
				aria-current={page === currentPage ? 'page' : undefined}
				onclick={() => goToPage(page)}
			>
				{page}
			</button>
		{/if}
	{/each}

	<!-- Next Button -->
	<button
		type="button"
		class="{buttonBaseClass} {currentPage >= totalPages ? disabledClass : inactiveClass}"
		disabled={currentPage >= totalPages}
		onclick={() => goToPage(currentPage + 1)}
		aria-label="Next page"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="m9 18 6-6-6-6"/>
		</svg>
	</button>
</nav>

