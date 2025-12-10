<script lang="ts">
	type BreadcrumbItem = {
		label: string;
		href?: string;
	};

	interface BreadcrumbsProps {
		/** Custom class names */
		class?: string;
		/** Array of breadcrumb items */
		items: BreadcrumbItem[];
		/** Separator character or symbol */
		separator?: string;
	}

	let {
		class: className = '',
		items,
		separator = '/'
	}: BreadcrumbsProps = $props();
</script>

<nav aria-label="Breadcrumb" class={className}>
	<ol class="flex items-center gap-2 text-sm">
		{#each items as item, i (i)}
			<li class="flex items-center gap-2">
				{#if i > 0}
					<span class="text-[var(--liver-brown-500)]" aria-hidden="true">
						{separator}
					</span>
				{/if}

				{#if i === items.length - 1}
					<!-- Current page (last item) -->
					<span 
						class="font-medium text-[var(--liver-brown-800)]"
						aria-current="page"
					>
						{item.label}
					</span>
				{:else if item.href}
					<!-- Link to previous page -->
					<a 
						href={item.href}
						class="text-[var(--caroline-blue-700)] hover:text-[var(--caroline-blue-900)] hover:underline transition-colors"
					>
						{item.label}
					</a>
				{:else}
					<!-- Non-link item -->
					<span class="text-[var(--liver-brown-600)]">
						{item.label}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

