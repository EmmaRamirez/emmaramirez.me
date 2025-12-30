<script lang="ts">
	import type { GridItem } from '$lib/types/homepage';
	import type { Article } from '$lib/articles';
	import { defaultArticles } from '$lib/articles';
	import {
		projectRegistry,
		getDisco,
		type ProjectRegistryEntry
	} from '$lib/registry/homepage';

	const homepageArticles: Article[] = defaultArticles.slice(0, 5);
	const homepageProjects: ProjectRegistryEntry[] = Object.values(projectRegistry)
		.toSorted((a, b) => Number.parseInt(b.year ?? '0', 10) - Number.parseInt(a.year ?? '0', 10))
		.slice(0, 5);

	const gridItems: GridItem[] = [
		{ kind: 'disco' as const },
		{ kind: 'home' as const },
		{ kind: 'pokemon' as const },
		{ kind: 'top-languages' as const },
		{ kind: 'city' as const },
		...homepageArticles.map((article) => ({ kind: 'article' as const, article })),
		...homepageProjects.map((project) => ({ kind: 'project' as const, project })),
		{ kind: 'design-system' as const }
	];

	let selectedItem = $state<GridItem | null>(null);

	function getItemLabel(item: GridItem): string {
		switch (item.kind) {
			case 'article':
				return item.article.title;
			case 'project':
				return item.project.title;
			case 'disco':
				return 'Disco Block';
			case 'home':
				return 'Home Block';
			case 'pokemon':
				return 'Pokemon Block';
			case 'top-languages':
				return 'Top Languages';
			case 'city':
				return 'City Card';
			case 'design-system':
				return 'Design System Ad';
			default:
				return 'Unknown';
		}
	}

	function getItemIcon(item: GridItem): string {
		switch (item.kind) {
			case 'article':
				return '📝';
			case 'project':
				return '🚀';
			case 'disco':
				return '🪩';
			case 'home':
				return '🏠';
			case 'pokemon':
				return '⚡';
			case 'top-languages':
				return '📊';
			case 'city':
				return '🏙️';
			case 'design-system':
				return '🎨';
			default:
				return '❓';
		}
	}

	function getItemColor(item: GridItem): string {
		switch (item.kind) {
			case 'article':
				return 'var(--color-blue-500, #3b82f6)';
			case 'project':
				return 'var(--color-purple-500, #a855f7)';
			case 'disco':
				return 'var(--color-pink-500, #ec4899)';
			case 'home':
				return 'var(--color-emerald-500, #10b981)';
			case 'pokemon':
				return 'var(--color-yellow-500, #eab308)';
			case 'top-languages':
				return 'var(--color-orange-500, #f97316)';
			case 'city':
				return 'var(--color-cyan-500, #06b6d4)';
			case 'design-system':
				return 'var(--color-rose-500, #f43f5e)';
			default:
				return 'var(--text-muted)';
		}
	}

	function getColSpan(item: GridItem): number {
		if (item.kind === 'home') return 2;
		if (item.kind === 'city') return 3;
		if (item.kind === 'design-system') return 2;
		return 1;
	}

	function getRowSpan(item: GridItem): number {
		if (item.kind === 'home') return 2;
		return 1;
	}

	function handleItemClick(item: GridItem) {
		selectedItem = selectedItem === item ? null : item;
	}

	function getItemKey(item: GridItem): string {
		if (item.kind === 'article') return `article-${item.article.id}`;
		if (item.kind === 'project') return `project-${item.project.id}`;
		return item.kind;
	}
</script>

<div class="grid-section">
	<div class="section-header">
		<h2 class="section-title">Grid Layout</h2>
		<p class="section-description">
			Visual overview of homepage grid items. Click an item to see details.
		</p>
	</div>

	<div class="grid-editor-layout">
		<!-- Minimap -->
		<div class="minimap-container">
			<div class="minimap-header">
				<h3>Minimap</h3>
				<span class="item-count">{gridItems.length} items</span>
			</div>
			<div class="minimap-grid">
				{#each gridItems as item (getItemKey(item))}
					<button
						type="button"
						class="minimap-item"
						class:selected={selectedItem === item}
						style="
							--item-color: {getItemColor(item)};
							grid-column: span {getColSpan(item)};
							grid-row: span {getRowSpan(item)};
						"
						onclick={() => handleItemClick(item)}
						title={getItemLabel(item)}
					>
						<span class="item-icon">{getItemIcon(item)}</span>
						<span class="item-label">{getItemLabel(item)}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Details panel -->
		<div class="details-panel">
			{#if selectedItem}
				<div class="details-header">
					<span class="details-icon" style="background: {getItemColor(selectedItem)}">
						{getItemIcon(selectedItem)}
					</span>
					<div>
						<h3 class="details-title">{getItemLabel(selectedItem)}</h3>
						<span class="details-kind">{selectedItem.kind}</span>
					</div>
				</div>

				<div class="details-content">
					{#if selectedItem.kind === 'article'}
						<dl class="details-list">
							<dt>ID</dt>
							<dd><code>{selectedItem.article.id}</code></dd>
							<dt>Date</dt>
							<dd>{selectedItem.article.date || 'N/A'}</dd>
							<dt>Preview</dt>
							<dd class="preview-text">{selectedItem.article.content.slice(0, 150)}...</dd>
						</dl>
					{:else if selectedItem.kind === 'project'}
						<dl class="details-list">
							<dt>ID</dt>
							<dd><code>{selectedItem.project.id}</code></dd>
							<dt>Pill</dt>
							<dd><span class="pill">{selectedItem.project.pill}</span></dd>
							<dt>Year</dt>
							<dd>{selectedItem.project.year || 'N/A'}</dd>
							<dt>Status</dt>
							<dd>
								<span class="status-badge" data-status={selectedItem.project.status}>
									{selectedItem.project.status || 'N/A'}
								</span>
							</dd>
							<dt>Description</dt>
							<dd class="preview-text">{selectedItem.project.description}</dd>
						</dl>
					{:else}
						<dl class="details-list">
							<dt>Type</dt>
							<dd><code>{selectedItem.kind}</code></dd>
							<dt>Grid Span</dt>
							<dd>
								{getColSpan(selectedItem)} col × {getRowSpan(selectedItem)} row
							</dd>
						</dl>
					{/if}
				</div>
			{:else}
				<div class="details-empty">
					<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z" />
					</svg>
					<p>Select an item from the minimap to view its details</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Legend -->
	<div class="legend">
		<h4>Legend</h4>
		<div class="legend-items">
			<div class="legend-item">
				<span class="legend-color" style="background: var(--color-blue-500, #3b82f6)"></span>
				<span>Articles</span>
			</div>
			<div class="legend-item">
				<span class="legend-color" style="background: var(--color-purple-500, #a855f7)"></span>
				<span>Projects</span>
			</div>
			<div class="legend-item">
				<span class="legend-color" style="background: var(--color-emerald-500, #10b981)"></span>
				<span>Special Blocks</span>
			</div>
		</div>
	</div>
</div>

<style>
	.grid-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section-header {
		margin-bottom: 0.5rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.5rem 0;
	}

	.section-description {
		color: var(--text-muted);
		margin: 0;
	}

	.grid-editor-layout {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 1.5rem;
	}

	@media (max-width: 900px) {
		.grid-editor-layout {
			grid-template-columns: 1fr;
		}
	}

	/* Minimap */
	.minimap-container {
		background: var(--surface);
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		padding: 1.25rem;
	}

	.minimap-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.minimap-header h3 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.item-count {
		font-size: 0.75rem;
		color: var(--text-muted);
		background: var(--surface-hover);
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
	}

	.minimap-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.minimap-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		padding: 0.75rem 0.5rem;
		background: var(--background);
		border: 2px solid var(--border-color);
		border-radius: 0.625rem;
		cursor: pointer;
		transition: all 0.15s ease;
		min-height: 70px;
	}

	.minimap-item:hover {
		border-color: var(--item-color);
		background: color-mix(in srgb, var(--item-color) 8%, var(--background));
	}

	.minimap-item.selected {
		border-color: var(--item-color);
		background: color-mix(in srgb, var(--item-color) 15%, var(--background));
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--item-color) 20%, transparent);
	}

	.item-icon {
		font-size: 1.25rem;
	}

	.item-label {
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-align: center;
		line-height: 1.2;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Details panel */
	.details-panel {
		background: var(--surface);
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		padding: 1.25rem;
		min-height: 300px;
	}

	.details-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.details-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.625rem;
		font-size: 1.25rem;
	}

	.details-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.125rem 0;
	}

	.details-kind {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: monospace;
	}

	.details-content {
		font-size: 0.875rem;
	}

	.details-list {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
		margin: 0;
	}

	.details-list dt {
		color: var(--text-muted);
		font-weight: 500;
	}

	.details-list dd {
		color: var(--text-primary);
		margin: 0;
	}

	.details-list code {
		font-size: 0.8125rem;
		background: var(--surface-hover);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
	}

	.preview-text {
		color: var(--text-secondary);
		line-height: 1.5;
		grid-column: 1 / -1;
		margin-top: 0.25rem;
	}

	.pill {
		display: inline-block;
		font-size: 0.75rem;
		background: var(--surface-hover);
		padding: 0.125rem 0.5rem;
		border-radius: 1rem;
	}

	.status-badge {
		display: inline-block;
		font-size: 0.75rem;
		padding: 0.125rem 0.5rem;
		border-radius: 1rem;
		background: var(--surface-hover);
	}

	.status-badge[data-status='active'] {
		background: color-mix(in srgb, #10b981 20%, var(--surface));
		color: #10b981;
	}

	.status-badge[data-status='archived'] {
		background: color-mix(in srgb, #6b7280 20%, var(--surface));
		color: #9ca3af;
	}

	.status-badge[data-status='experiment'] {
		background: color-mix(in srgb, #f59e0b 20%, var(--surface));
		color: #f59e0b;
	}

	.details-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 200px;
		color: var(--text-muted);
		text-align: center;
		gap: 1rem;
	}

	.empty-icon {
		width: 3rem;
		height: 3rem;
		opacity: 0.4;
	}

	.details-empty p {
		margin: 0;
		max-width: 200px;
	}

	/* Legend */
	.legend {
		background: var(--surface);
		border: 1px solid var(--border-color);
		border-radius: 0.75rem;
		padding: 1rem 1.25rem;
	}

	.legend h4 {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.75rem 0;
	}

	.legend-items {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.legend-color {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 0.25rem;
	}
</style>

