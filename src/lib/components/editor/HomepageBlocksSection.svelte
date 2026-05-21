<script lang="ts">
	import { onMount } from 'svelte';
	import { getHomepageBlockLabel } from '$lib/registry/homepageBlockMeta';
	import { homepageBlocksStore } from '$lib/stores/homepageBlocksStore.svelte';

	onMount(() => {
		homepageBlocksStore.init();
	});

	const orderedBlocks = $derived(homepageBlocksStore.getBlocksInDisplayOrder());
	const hiddenIds = $derived(homepageBlocksStore.hiddenIds);
	const visibleCount = $derived(
		orderedBlocks.filter((block) => !hiddenIds.has(block.id)).length
	);
</script>

<section class="rounded-2xl border border-(--border-color) bg-(--card-bg) p-6">
	<header class="mb-5 flex flex-wrap items-end justify-between gap-3">
		<div>
			<h2 class="text-xl font-semibold text-(--text-primary)">Homepage blocks</h2>
			<p class="mt-1 text-sm text-(--text-secondary)">
				Toggle blocks on or off in the order they appear on the homepage.
			</p>
		</div>
		<p class="text-sm text-(--text-secondary)">
			{visibleCount} of {orderedBlocks.length} visible
		</p>
	</header>

	<ul class="divide-y divide-(--border-color) rounded-xl border border-(--border-color)">
		{#each orderedBlocks as block, index (block.id)}
			{@const isVisible = !hiddenIds.has(block.id)}
			<li class="flex items-center justify-between gap-4 px-4 py-3">
				<div class="min-w-0">
					<p class="truncate font-medium text-(--text-primary)">
						{index + 1}. {getHomepageBlockLabel(block)}
					</p>
					<p class="truncate text-sm text-(--text-secondary)">{block.id}</p>
				</div>

				<label class="flex shrink-0 items-center gap-2 text-sm text-(--text-secondary)">
					<input
						type="checkbox"
						class="h-4 w-4 rounded border-(--border-color) accent-(--text-primary)"
						checked={isVisible}
						onchange={(event) => {
							const target = event.currentTarget;
							homepageBlocksStore.setVisible(block.id, target.checked);
						}}
					/>
					<span>{isVisible ? 'Visible' : 'Hidden'}</span>
				</label>
			</li>
		{/each}
	</ul>
</section>
