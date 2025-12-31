<script lang="ts">
	import { dev } from '$app/environment';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import type { GridItem } from '$lib/types/homepage';
	import type { Article } from '$lib/articles';
	import { defaultArticles } from '$lib/articles';
	import {
		projectRegistry,
		getDisco,
		type ProjectRegistryEntry,
		type DiscoRegistryEntry
	} from '$lib/registry/homepage';
	import { gridLayoutStore, getItemKey } from '$lib/stores/gridLayoutStore.svelte';
	import { pokemonTeam } from '$lib/website.config';
	import { onMount } from 'svelte';
	
	import DiscoBlock from '../DiscoBlock.svelte';
	import HomeBlock from '../HomeBlock.svelte';
	import PokemonBlock from '../PokemonBlock.svelte';
	import ProjectBlock from '../ProjectBlock.svelte';
	import TopLanguages from '../TopLanguages.svelte';
	import DesignSystemAd from '../DesignSystemAd.svelte';
	import CityCard from '../CityCard.svelte';
	import Hero from '../Hero.svelte';

	const homepageArticles: Article[] = defaultArticles.slice(0, 5);
	const homepageProjects: ProjectRegistryEntry[] = Object.values(projectRegistry)
		.toSorted((a, b) => Number.parseInt(b.year ?? '0', 10) - Number.parseInt(a.year ?? '0', 10))
		.slice(0, 5);

	const disco: DiscoRegistryEntry = getDisco();

	const gridItems: GridItem[] = [
		{ kind: 'hero' as const },
		{ kind: 'disco' as const },
		{ kind: 'home' as const },
		{ kind: 'pokemon' as const },
		{ kind: 'top-languages' as const },
		{ kind: 'city' as const },
		...homepageArticles.map((article) => ({ kind: 'article' as const, article })),
		...homepageProjects.map((project) => ({ kind: 'project' as const, project })),
		{ kind: 'design-system' as const }
	];

	interface DndItem {
		id: string;
		item: GridItem;
	}

	let dndItems = $state<DndItem[]>([]);
	let selectedItem = $state<GridItem | null>(null);
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

	onMount(() => {
		gridLayoutStore.initialize(gridItems);
		gridLayoutStore.editMode = true; // Always in edit mode in the editor
		updateDndItems();
	});

	function updateDndItems() {
		const orderedItems = gridLayoutStore.reorderItems(gridItems);
		dndItems = orderedItems.map(item => ({
			id: getItemKey(item),
			item
		}));
	}

	function handleDndConsider(e: CustomEvent<DndEvent<DndItem>>) {
		dndItems = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<DndItem>>) {
		dndItems = e.detail.items;
		gridLayoutStore.setOrder(dndItems.map(d => d.id));
	}

	function handleResize(key: string, e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		gridLayoutStore.cycleColSpan(key);
	}

	function handleRowResize(key: string, e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		gridLayoutStore.cycleRowSpan(key);
	}

	function getColSpanClass(key: string): string {
		const layout = gridLayoutStore.getLayout(key);
		if (!layout) return '';
		
		const colClasses = {
			1: '',
			2: 'md:col-span-2',
			3: 'md:col-span-2 lg:col-span-3'
		};
		
		const rowClasses = {
			1: '',
			2: 'row-span-2'
		};
		
		return `${colClasses[layout.colSpan]} ${rowClasses[layout.rowSpan]}`.trim();
	}

	function getItemLabel(item: GridItem): string {
		switch (item.kind) {
			case 'article':
				return item.article.title;
			case 'project':
				return item.project.title;
			case 'hero':
				return 'Hero Section';
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
			case 'hero':
				return '👋';
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
			case 'hero':
				return 'var(--color-sky-500, #0ea5e9)';
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

	function handleItemClick(item: GridItem) {
		selectedItem = selectedItem === item ? null : item;
	}

	function handleSave() {
		saveStatus = 'saving';
		const success = gridLayoutStore.save();
		if (success) {
			saveStatus = 'saved';
			setTimeout(() => {
				saveStatus = 'idle';
			}, 2000);
		} else {
			saveStatus = 'error';
		}
	}

	function handleReset() {
		if (confirm('Reset layout to defaults? This will remove your saved layout.')) {
			gridLayoutStore.reset(gridItems);
			updateDndItems();
			selectedItem = null;
		}
	}

	const flipDurationMs = 200;
</script>

<div class="grid-section">
	<div class="section-header">
		<div class="header-top">
			<div>
				<h2 class="section-title">Live Grid Editor</h2>
				<p class="section-description">
					Drag items to reorder, click resize buttons to change column/row span.
				</p>
			</div>
			<div class="header-actions">
				<button type="button" class="reset-btn" onclick={handleReset}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
					</svg>
					Reset
				</button>
				<button 
					type="button" 
					class="save-btn" 
					class:saved={saveStatus === 'saved'}
					class:error={saveStatus === 'error'}
					onclick={handleSave}
					disabled={saveStatus === 'saving'}
				>
					{#if saveStatus === 'saving'}
						Saving...
					{:else if saveStatus === 'saved'}
						✓ Saved
					{:else if saveStatus === 'error'}
						✗ Error
					{:else}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
							<polyline points="17,21 17,13 7,13 7,21" />
							<polyline points="7,3 7,8 15,8" />
						</svg>
						Save Layout
					{/if}
				</button>
			</div>
		</div>
	</div>

	<div class="grid-editor-layout">
		<!-- Live Grid Preview -->
		<div class="live-grid-container">
			<div class="live-grid-header">
				<h3>Live Preview</h3>
				<span class="item-count">{dndItems.length} items</span>
			</div>
			
			<ul
				class="live-grid"
				use:dndzone={{
					items: dndItems,
					flipDurationMs,
					dropTargetStyle: {},
					dragDisabled: false
				}}
				onconsider={handleDndConsider}
				onfinalize={handleDndFinalize}
			>
				{#each dndItems as dndItem (dndItem.id)}
					{@const item = dndItem.item}
					{@const key = dndItem.id}
					{@const layout = gridLayoutStore.getLayout(key)}
					<li class="grid-item edit-mode h-full {getColSpanClass(key)}">
						<div class="resize-controls">
							<button
								type="button"
								class="resize-handle"
								onclick={(e) => handleResize(key, e)}
								title="Click to change column span (1→2→3)"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M21 12H3"/>
									<path d="M21 6H3"/>
									<path d="M21 18H3"/>
								</svg>
								<span class="resize-label">{layout?.colSpan ?? 1}c</span>
							</button>
							<button
								type="button"
								class="resize-handle"
								onclick={(e) => handleRowResize(key, e)}
								title="Click to change row span (1→2)"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M12 3v18"/>
									<path d="M6 3v18"/>
									<path d="M18 3v18"/>
								</svg>
								<span class="resize-label">{layout?.rowSpan ?? 1}r</span>
							</button>
						</div>
						
						<button
							type="button"
							class="grid-item-content"
							onclick={() => handleItemClick(item)}
						>
							{#if item.kind === 'hero'}
								<Hero />
							{:else if item.kind === 'article'}
								<div class="article-card">
									<span class="text-lg leading-snug font-semibold text-(--text-primary)">
										{item.article.title}
									</span>
									{#if item.article.date}
										<span class="text-sm text-(--text-secondary)">
											{item.article.date}
										</span>
									{/if}
									<p class="line-clamp-3 text-base leading-relaxed text-(--text-muted)">
										{item.article.content}
									</p>
								</div>
							{:else if item.kind === 'project'}
								<ProjectBlock
									title={item.project.title}
									pill={item.project.pill}
									class={item.project.class}
									contentClassName={item.project.contentClassName}
								>
									{#snippet description()}
										{item.project.description}
									{/snippet}
								</ProjectBlock>
							{:else if item.kind === 'disco'}
								<DiscoBlock
									image={disco.image}
									alt={disco.alt}
									caption={disco.caption}
									class={disco.class ?? 'h-full w-full'}
								/>
							{:else if item.kind === 'home'}
								<HomeBlock class="h-full w-full" />
							{:else if item.kind === 'city'}
								<CityCard
									src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1800&q=80"
									alt="Houston skyline at dusk"
									location="Houston"
								/>
							{:else if item.kind === 'design-system'}
								<DesignSystemAd />
							{:else if item.kind === 'pokemon'}
								{#if dev}
									<PokemonBlock team={pokemonTeam} class="h-full w-full" />
								{/if}
							{:else if item.kind === 'top-languages'}
								<TopLanguages class="h-full w-full" />
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>

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
							<dt>Grid Span</dt>
							<dd>
								{gridLayoutStore.getLayout(getItemKey(selectedItem))?.colSpan ?? 1} col × {gridLayoutStore.getLayout(getItemKey(selectedItem))?.rowSpan ?? 1} row
							</dd>
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
							<dt>Grid Span</dt>
							<dd>
								{gridLayoutStore.getLayout(getItemKey(selectedItem))?.colSpan ?? 1} col × {gridLayoutStore.getLayout(getItemKey(selectedItem))?.rowSpan ?? 1} row
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
								{gridLayoutStore.getLayout(getItemKey(selectedItem))?.colSpan ?? 1} col × {gridLayoutStore.getLayout(getItemKey(selectedItem))?.rowSpan ?? 1} row
							</dd>
						</dl>
					{/if}
				</div>
			{:else}
				<div class="details-empty">
					<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z" />
					</svg>
					<p>Click an item in the grid to view its details</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="legend">
		<h4>Legend</h4>
		<div class="legend-items">
			<div class="legend-item">
				<span class="legend-color" style="background: var(--color-sky-500, #0ea5e9)"></span>
				<span>Hero</span>
			</div>
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

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
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

	.save-btn, .reset-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		border: none;
	}

	.save-btn {
		background: var(--text-primary);
		color: var(--page-bg);
	}

	.save-btn:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.save-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.save-btn.saved {
		background: #10b981;
	}

	.save-btn.error {
		background: #ef4444;
	}

	.reset-btn {
		background: var(--surface);
		color: var(--text-secondary);
		border: 1px solid var(--border-color);
	}

	.reset-btn:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
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

		.header-top {
			flex-direction: column;
		}

		.header-actions {
			width: 100%;
		}

		.save-btn, .reset-btn {
			flex: 1;
			justify-content: center;
		}
	}

	.live-grid-container {
		background: var(--surface);
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		padding: 1.25rem;
	}

	.live-grid-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.live-grid-header h3 {
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

	.live-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.grid-item {
		position: relative;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		border-radius: 0.625rem;
		overflow: hidden;
	}

	.grid-item.edit-mode {
		cursor: grab;
	}

	.grid-item.edit-mode:active {
		cursor: grabbing;
	}

	.grid-item.edit-mode::before {
		content: '';
		position: absolute;
		inset: -2px;
		border: 2px dashed var(--text-muted);
		border-radius: 0.625rem;
		opacity: 0.5;
		pointer-events: none;
		z-index: 1;
	}

	.grid-item-content {
		height: 100%;
		width: 100%;
		min-height: 120px;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		text-align: left;
		cursor: pointer;
	}

	.resize-controls {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 10;
		display: flex;
		gap: 0.25rem;
	}

	.resize-handle {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.375rem;
		background: var(--text-primary);
		color: var(--page-bg);
		border: none;
		border-radius: 0.25rem;
		font-size: 0.625rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
		box-shadow: 0 2px 8px rgba(0,0,0,0.15);
	}

	.resize-handle:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0,0,0,0.2);
	}

	.resize-label {
		font-family: monospace;
	}

	.article-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		height: 100%;
		background: var(--background);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
	}

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

	:global([data-dnd-dragged]) {
		opacity: 0.5;
		transform: scale(1.02);
	}

	:global([data-dnd-shadow]) {
		opacity: 0.3;
	}
</style>
