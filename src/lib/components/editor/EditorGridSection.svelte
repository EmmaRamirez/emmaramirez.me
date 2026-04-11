<script lang="ts">
	import { dev, browser } from '$app/environment';
	import { dragHandle, dragHandleZone, type DndEvent } from 'svelte-dnd-action';
	import { fetchPokemonDetails } from '$lib/api/pokemon';
	import type { GridItem } from '$lib/types/homepage';
	import {
		getDisco,
		type DiscoRegistryEntry,
		type ProjectRegistryEntry
	} from '$lib/registry/homepage';
	import { buildHomepageGridItems } from '$lib/registry/gridItems';
	import type { Pokemon } from '$lib/website.config';
	import { discoParams, type DiscoParams } from '$lib/stores/discoParams.svelte';
	import {
		editorGridLayoutStore,
		getGridItemSpanClasses,
		getItemKey
	} from '$lib/stores/gridLayoutStore.svelte';
	import { showSections } from '$lib/stores';
	import {
		getHero3dParamsSnapshot,
		setHero3dParams,
		type Hero3DParams
	} from '$lib/stores/hero3dParams.svelte';
	import { pokemonTeamSettings, thisSiteSettings } from '$lib/stores';
	import {
		topLanguagesSettings,
		topLanguagesVariantOptions
	} from '$lib/stores/topLanguages.svelte';
	import { onMount } from 'svelte';

	import {
		DiscoBlock,
		HomeBlock,
		LocationBlock,
		PokemonBlock,
		ProjectBlock,
		ThisSiteBlock,
		TopLanguages,
		DesignSystemAd,
		CityCard
	} from '$lib/components/blocks';
	import EditorGridLegend from '$lib/components/editor/EditorGridLegend.svelte';
	import EditorBlockPlaceholder from '$lib/components/editor/EditorBlockPlaceholder.svelte';
	import {
		getEditorGridItemColor,
		getEditorGridItemIcon,
		getEditorGridItemLabel
	} from '$lib/components/editor/editorGridMeta';
	import { setEditorSurfaceContext } from '$lib/components/editor/editorSurfaceContext';
	import { Hero } from '$lib/components/hero';
	import { Input, Select, Switch } from '$lib/components/ui';
	import { performanceAnalytics, trackedFetch } from '$lib/stores/performanceAnalytics.svelte';

	interface Props {
		articles: Array<{
			id: string;
			slug: string;
			title: string;
			content: string;
			date?: string;
			tags?: string[];
		}>;
		projects: Array<
			ProjectRegistryEntry & { excerpt?: string; content: string; updatedAt?: string | null }
		>;
	}

	let { articles, projects }: Props = $props();

	const disco: DiscoRegistryEntry = getDisco();

	const gridItems = $derived(
		buildHomepageGridItems({ includeApiExplorer: false, articles, projects })
	);

	interface DndItem {
		id: string;
		item: GridItem;
	}

	let dndItems = $state<DndItem[]>([]);
	let selectedItemKey = $state<string | null>(null);

	const selectedItem = $derived.by(() =>
		selectedItemKey ? (dndItems.find((entry) => entry.id === selectedItemKey)?.item ?? null) : null
	);
	const selectedItemLayout = $derived.by(() =>
		selectedItemKey ? editorGridLayoutStore.getLayout(selectedItemKey) : undefined
	);
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let headerBlendMode = $state('difference');
	let showSectionsEnabled = $state(false);
	let topLanguagesVariant = $state(topLanguagesSettings.variant);
	let thisSiteTitle = $state(thisSiteSettings.title);
	let pokemonTeamDraft = $state(pokemonTeamSettings.team.map((pokemon: Pokemon) => pokemon.name));
	let pokemonTeamErrors = $state(pokemonTeamSettings.team.map(() => ''));
	let pokemonLookupPending = $state(pokemonTeamSettings.team.map(() => false));
	let hasLoadedSettings = $state(false);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	const pokemonLookupTimers: Partial<Record<number, ReturnType<typeof setTimeout>>> = {};
	let dragMeasureId: string | null = null;
	let isDragging = $state(false);
	let visibleItemKeys = $state<Record<string, boolean>>({});

	setEditorSurfaceContext({
		surface: 'editor',
		effectsMode: 'reduced'
	});

	onMount(() => {
		editorGridLayoutStore.initialize(gridItems);
		editorGridLayoutStore.editMode = true; // Always in edit mode in the editor
		updateDndItems();

		const unsubscribe = showSections.subscribe((value) => {
			showSectionsEnabled = value;
		});

		return () => {
			for (const timer of Object.values(pokemonLookupTimers)) {
				if (timer) clearTimeout(timer);
			}
			performanceAnalytics.endMeasure(dragMeasureId, {
				source: 'EditorGridSection',
				detail: 'cancelled'
			});
			dragMeasureId = null;
			unsubscribe();
		};
	});

	$effect(() => {
		void gridItems;
		updateDndItems();
	});

	$effect(() => {
		if (!selectedItemKey) return;
		if (dndItems.some((entry) => entry.id === selectedItemKey)) return;
		selectedItemKey = null;
	});

	function updateDndItems() {
		const orderedItems = editorGridLayoutStore.reorderItems(gridItems);
		dndItems = orderedItems.map((item) => ({
			id: getItemKey(item),
			item
		}));
	}

	function handleDndConsider(e: CustomEvent<DndEvent<DndItem>>) {
		isDragging = true;
		dragMeasureId ??= performanceAnalytics.beginMeasure('interaction', 'Editor grid reorder', {
			source: 'EditorGridSection'
		});
		dndItems = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<DndItem>>) {
		isDragging = false;
		dndItems = e.detail.items;
		editorGridLayoutStore.setOrder(dndItems.map((d) => d.id));
		performanceAnalytics.endMeasure(dragMeasureId, {
			source: 'EditorGridSection',
			detail: `${dndItems.length} items`
		});
		dragMeasureId = null;
	}

	function handleResize(key: string, e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		editorGridLayoutStore.cycleColSpan(key);
	}

	function handleRowResize(key: string, e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		editorGridLayoutStore.cycleRowSpan(key);
	}

	function getColSpanClass(key: string): string {
		const layout = editorGridLayoutStore.getLayout(key);
		return getGridItemSpanClasses(layout);
	}

	function handleItemClick(key: string) {
		selectedItemKey = selectedItemKey === key ? null : key;
	}

	function handleItemKeydown(event: KeyboardEvent, key: string) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		handleItemClick(key);
	}

	function trackGridItemVisibility(key: string) {
		return (node: HTMLElement) => {
			if (typeof IntersectionObserver === 'undefined') {
				visibleItemKeys[key] = true;
				return () => {
					delete visibleItemKeys[key];
				};
			}

			const observer = new IntersectionObserver(
				(entries) => {
					const [entry] = entries;
					visibleItemKeys[key] = entry?.isIntersecting ?? false;
				},
				{
					rootMargin: '120px'
				}
			);

			observer.observe(node);

			return () => {
				observer.disconnect();
				delete visibleItemKeys[key];
			};
		};
	}

	function isTileVisible(key: string) {
		return Boolean(visibleItemKeys[key]);
	}

	function isTileFocused(key: string) {
		return selectedItemKey === key;
	}

	function isEffectsEnabledFor(key: string) {
		return isTileVisible(key) || isTileFocused(key);
	}

	function getStaticItemSummary(item: GridItem) {
		switch (item.kind) {
			case 'disco':
				return 'Pointer-driven canvas effects with click bursts and tunable beam counts.';
			case 'location':
				return 'Interactive visitor map with region selection and a lightweight editor placeholder.';
			case 'home':
				return 'Compact site-intro card anchored around Emma’s home base.';
			case 'this-site':
				return 'Tech-stack card highlighting the tools and systems behind the site.';
			case 'city':
				return 'Editorial city card used as a visual spacer in the homepage layout.';
			case 'design-system':
				return 'Promotional callout that links deeper into the design system preview.';
			case 'hero':
				return 'Homepage hero with blend-mode tuning and optional 3D rendering on the live site.';
			case 'pokemon':
				return 'Pokemon team showcase with hover details on the live site and editor-friendly gating.';
			case 'top-languages':
				return 'GitHub language mix card with switchable visual treatments and deferred loading.';
			default:
				return '';
		}
	}

	function handleSave() {
		saveStatus = 'saving';
		const success = editorGridLayoutStore.save();
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
			editorGridLayoutStore.reset(gridItems);
			updateDndItems();
			selectedItemKey = null;
		}
	}

	function setShowSectionsEnabled(value: boolean) {
		showSectionsEnabled = value;
		showSections.set(value);
	}

	const blendModeOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'multiply', label: 'Multiply' },
		{ value: 'screen', label: 'Screen' },
		{ value: 'overlay', label: 'Overlay' },
		{ value: 'darken', label: 'Darken' },
		{ value: 'lighten', label: 'Lighten' },
		{ value: 'color-dodge', label: 'Color Dodge' },
		{ value: 'color-burn', label: 'Color Burn' },
		{ value: 'hard-light', label: 'Hard Light' },
		{ value: 'soft-light', label: 'Soft Light' },
		{ value: 'difference', label: 'Difference' },
		{ value: 'exclusion', label: 'Exclusion' },
		{ value: 'hue', label: 'Hue' },
		{ value: 'saturation', label: 'Saturation' },
		{ value: 'color', label: 'Color' },
		{ value: 'luminosity', label: 'Luminosity' }
	];

	const discoParamEntries = $derived.by(() => [
		{ label: 'Sample history size', value: discoParams.sampleHistorySize },
		{ label: 'Min beams', value: discoParams.minBeams },
		{ label: 'Max beams', value: discoParams.maxBeams },
		{ label: 'Click beam count', value: discoParams.clickBeamCount },
		{ label: 'Click base volatility', value: discoParams.clickBaseVolatility },
		{ label: 'Volatility smoothing', value: discoParams.volatilitySmoothing },
		{ label: 'Volatility decay', value: discoParams.volatilityDecay }
	]);
	const activePokemonTeam = $derived(pokemonTeamSettings.team);

	function clearPokemonLookupTimer(index: number) {
		const timer = pokemonLookupTimers[index];
		if (!timer) return;
		clearTimeout(timer);
		delete pokemonLookupTimers[index];
	}

	async function commitPokemonSlot(index: number) {
		clearPokemonLookupTimer(index);
		const candidate = pokemonTeamDraft[index]?.trim() ?? '';

		if (!candidate) {
			pokemonTeamErrors[index] = 'Enter a Pokemon name.';
			return;
		}

		pokemonLookupPending[index] = true;
		pokemonTeamErrors[index] = '';

		try {
			const resolved = await fetchPokemonDetails(candidate);
			pokemonTeamSettings.setSlot(index, {
				id: resolved.id,
				name: resolved.name
			});
			pokemonTeamDraft[index] = resolved.name;
		} catch {
			pokemonTeamErrors[index] = 'Pokemon not found.';
		} finally {
			pokemonLookupPending[index] = false;
		}
	}

	function handlePokemonNameInput(index: number, value: string) {
		pokemonTeamDraft[index] = value;
		pokemonTeamErrors[index] = '';
		clearPokemonLookupTimer(index);

		if (!value.trim()) {
			return;
		}

		pokemonLookupTimers[index] = setTimeout(() => {
			void commitPokemonSlot(index);
		}, 350);
	}

	function handlePokemonNameKeydown(index: number, event: KeyboardEvent) {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		void commitPokemonSlot(index);
	}

	function getSettingsPayload() {
		return {
			headerBlendMode,
			showSectionsEnabled,
			hero3dParams: getHero3dParamsSnapshot(),
			discoParams: {
				sampleHistorySize: discoParams.sampleHistorySize,
				minBeams: discoParams.minBeams,
				maxBeams: discoParams.maxBeams,
				clickBeamCount: discoParams.clickBeamCount,
				clickBaseVolatility: discoParams.clickBaseVolatility,
				volatilitySmoothing: discoParams.volatilitySmoothing,
				volatilityDecay: discoParams.volatilityDecay
			}
		};
	}

	async function saveSettings() {
		if (!browser) return;
		saveTimeout = null;

		await trackedFetch(
			'/api/debug-settings',
			{
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(getSettingsPayload())
			},
			{
				label: 'Editor debug settings save',
				source: 'EditorGridSection'
			}
		);
	}

	onMount(async () => {
		if (!browser) return;
		const response = await trackedFetch('/api/debug-settings', undefined, {
			label: 'Editor debug settings load',
			source: 'EditorGridSection'
		});
		if (!response.ok) {
			hasLoadedSettings = true;
			return;
		}

		const { settings } = (await response.json()) as {
			settings: {
				headerBlendMode: string;
				showSectionsEnabled: boolean;
				hero3dParams: Hero3DParams;
				discoParams?: DiscoParams;
			} | null;
		};

		if (settings) {
			headerBlendMode = settings.headerBlendMode ?? headerBlendMode;
			setShowSectionsEnabled(Boolean(settings.showSectionsEnabled));

			const hero = settings.hero3dParams;
			if (hero) {
				setHero3dParams(hero);
			}

			const disco = settings.discoParams;
			if (disco) {
				discoParams.sampleHistorySize = disco.sampleHistorySize ?? discoParams.sampleHistorySize;
				discoParams.minBeams = disco.minBeams ?? discoParams.minBeams;
				discoParams.maxBeams = disco.maxBeams ?? discoParams.maxBeams;
				discoParams.clickBeamCount = disco.clickBeamCount ?? discoParams.clickBeamCount;
				discoParams.clickBaseVolatility =
					disco.clickBaseVolatility ?? discoParams.clickBaseVolatility;
				discoParams.volatilitySmoothing =
					disco.volatilitySmoothing ?? discoParams.volatilitySmoothing;
				discoParams.volatilityDecay = disco.volatilityDecay ?? discoParams.volatilityDecay;
			}
		}

		hasLoadedSettings = true;
	});

	$effect(() => {
		void headerBlendMode;
		void showSectionsEnabled;
		if (!browser || !hasLoadedSettings) return;
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveSettings, 500);
	});

	$effect(() => {
		topLanguagesSettings.variant = topLanguagesVariant;
	});

	const flipDurationMs = 200;

	function handleThisSiteTitleInput() {
		const nextTitle = thisSiteTitle.trim();
		if (nextTitle.length > 0) {
			thisSiteSettings.title = nextTitle;
		}
	}

	function commitThisSiteTitle() {
		thisSiteSettings.title = thisSiteTitle;
		thisSiteTitle = thisSiteSettings.title;
	}
</script>

<div class="grid-section">
	<div class="section-header">
		<div class="header-top">
			<div>
				<h2 class="section-title">Live Grid Editor</h2>
				<p class="section-description">
					Use the drag handle to reorder items, then click a tile to edit its values.
				</p>
			</div>
			<div class="header-actions">
				<button type="button" class="reset-btn" onclick={handleReset}>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
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
					<span class="save-btn__sizer" aria-hidden="true">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
							<polyline points="17,21 17,13 7,13 7,21" />
							<polyline points="7,3 7,8 15,8" />
						</svg>
						Save Layout
					</span>
					<span class="save-btn__content">
						{#if saveStatus === 'saving'}
							Saving...
						{:else if saveStatus === 'saved'}
							✓ Saved
						{:else if saveStatus === 'error'}
							✗ Error
						{:else}
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
								<polyline points="17,21 17,13 7,13 7,21" />
								<polyline points="7,3 7,8 15,8" />
							</svg>
							Save Layout
						{/if}
					</span>
				</button>
			</div>
		</div>
	</div>

	<div class="grid-editor-layout">
		<!-- Live Grid Preview -->
		<div class="live-grid-container">
			<div class="live-grid-glow" aria-hidden="true"></div>
			<div class="live-grid-header">
				<h3>Live Preview</h3>
				<span class="item-count">{dndItems.length} items</span>
			</div>

			<ul
				class="live-grid"
				use:dragHandleZone={{
					items: dndItems,
					flipDurationMs,
					dropTargetStyle: {},
					dragDisabled: false,
					zoneItemTabIndex: -1
				}}
				onconsider={handleDndConsider}
				onfinalize={handleDndFinalize}
			>
				{#each dndItems as dndItem (dndItem.id)}
					{@const item = dndItem.item}
					{@const key = dndItem.id}
					{@const layout = editorGridLayoutStore.getLayout(key)}
					<li
						class="grid-item edit-mode h-full {getColSpanClass(key)}"
						{@attach trackGridItemVisibility(key)}
					>
						<div class="resize-controls">
							<button
								type="button"
								class="drag-handle"
								use:dragHandle
								aria-label={`Drag ${getEditorGridItemLabel(item)}`}
								title="Drag to reorder this tile"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<circle cx="8" cy="6" r="1.75" />
									<circle cx="16" cy="6" r="1.75" />
									<circle cx="8" cy="12" r="1.75" />
									<circle cx="16" cy="12" r="1.75" />
									<circle cx="8" cy="18" r="1.75" />
									<circle cx="16" cy="18" r="1.75" />
								</svg>
							</button>
							<button
								type="button"
								class="resize-handle"
								onclick={(e) => handleResize(key, e)}
								title="Click to change column span (1→2→3)"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M21 12H3" />
									<path d="M21 6H3" />
									<path d="M21 18H3" />
								</svg>
								<span class="resize-label">{layout?.colSpan ?? 1}c</span>
							</button>
							<button
								type="button"
								class="resize-handle"
								onclick={(e) => handleRowResize(key, e)}
								title="Click to change row span (1→2)"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M12 3v18" />
									<path d="M6 3v18" />
									<path d="M18 3v18" />
								</svg>
								<span class="resize-label">{layout?.rowSpan ?? 1}r</span>
							</button>
						</div>

						<div
							class="grid-item-content"
							class:grid-item-content--selected={selectedItemKey === key}
							role="button"
							tabindex="0"
							aria-pressed={selectedItemKey === key}
							onclick={() => handleItemClick(key)}
							onkeydown={(event) => handleItemKeydown(event, key)}
						>
							{#if item.kind === 'hero'}
								<Hero effectsEnabled={isEffectsEnabledFor(key)} />
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
									id={item.project.id}
									title={item.project.title}
									pill={item.project.pill}
									class={item.project.class}
									contentClassName={item.project.contentClassName}
									imageClassName={item.project.imageClassName}
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
									effectsEnabled={isEffectsEnabledFor(key) && !isDragging}
								/>
							{:else if item.kind === 'home'}
								<HomeBlock class="h-full w-full" />
							{:else if item.kind === 'this-site'}
								<ThisSiteBlock class="h-full w-full" />
							{:else if item.kind === 'location'}
								{#if isEffectsEnabledFor(key)}
									<LocationBlock class="h-full w-full" />
								{:else}
									<EditorBlockPlaceholder
										label="Location Map"
										description="The Mapbox preview wakes up when this tile enters view."
										tone="blue"
										class="h-full w-full"
									/>
								{/if}
							{:else if item.kind === 'city'}
								<CityCard
									photo="https://images.unsplash.com/photo-1666610278692-51058ed05e9a?auto=format&fit=crop&w=1800&q=80"
									description="Houston skyline at night"
								/>
							{:else if item.kind === 'design-system'}
								<DesignSystemAd />
							{:else if item.kind === 'pokemon'}
								{#if dev}
									<PokemonBlock
										team={activePokemonTeam}
										class="h-full w-full"
										effectsEnabled={isEffectsEnabledFor(key)}
									/>
								{/if}
							{:else if item.kind === 'top-languages'}
								<TopLanguages class="h-full w-full" effectsEnabled={isEffectsEnabledFor(key)} />
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>

		<div class="side-panel">
			<div class="details-panel">
				{#if selectedItem}
					<div class="details-header">
						<span class="details-icon" style="background: {getEditorGridItemColor(selectedItem)}">
							{getEditorGridItemIcon(selectedItem)}
						</span>
						<div>
							<h3 class="details-title">{getEditorGridItemLabel(selectedItem)}</h3>
							<span class="details-kind">{selectedItem.kind}</span>
						</div>
					</div>

					<div class="details-content">
						{#if selectedItem.kind === 'article'}
							<dl class="details-list">
								<dt>ID</dt>
								<dd><code>{selectedItem.article.slug}</code></dd>
								<dt>Date</dt>
								<dd>{selectedItem.article.date || 'N/A'}</dd>
								<dt>Grid Span</dt>
								<dd>
									{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
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
									{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
								</dd>
								<dt>Description</dt>
								<dd class="preview-text">{selectedItem.project.description}</dd>
							</dl>
						{:else if selectedItem.kind === 'hero'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
								</dl>

								<Select
									label="Blend Mode"
									bind:value={headerBlendMode}
									options={blendModeOptions}
									hint="Adjust the header image blend mode for the hero card."
								/>
							</div>
						{:else if selectedItem.kind === 'pokemon'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
								</dl>

								<section class="details-subsection" aria-labelledby="pokemon-team-heading">
									<div class="details-subsection__header">
										<div>
											<p class="details-subsection__eyebrow">Team</p>
											<h4 id="pokemon-team-heading" class="details-subsection__title">
												Party slots
											</h4>
										</div>
										<span class="details-subsection__meta">6 slots</span>
									</div>

									<div class="pokemon-team-editor">
										{#each activePokemonTeam as pokemon, index (index)}
											<div class="pokemon-team-field">
												<label class="pokemon-team-field__label" for={`pokemon-slot-${index}`}>
													Slot {index + 1}
												</label>
												<input
													id={`pokemon-slot-${index}`}
													class="pokemon-team-field__input"
													type="text"
													bind:value={pokemonTeamDraft[index]}
													autocomplete="off"
													spellcheck="false"
													oninput={(event: Event) =>
														handlePokemonNameInput(
															index,
															(event.currentTarget as HTMLInputElement).value
														)}
													onblur={() => void commitPokemonSlot(index)}
													onkeydown={(event: KeyboardEvent) =>
														handlePokemonNameKeydown(index, event)}
												/>
												<p
													class="pokemon-team-field__message"
													class:pokemon-team-field__message--error={Boolean(
														pokemonTeamErrors[index]
													)}
												>
													{pokemonTeamErrors[index] ||
														(pokemonLookupPending[index]
															? 'Resolving sprite...'
															: `Sprite uses #${pokemon.id}`)}
												</p>
											</div>
										{/each}
									</div>
								</section>
							</div>
						{:else if selectedItem.kind === 'top-languages'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
								</dl>

								<Select
									label="Display Style"
									bind:value={topLanguagesVariant}
									options={topLanguagesVariantOptions}
									hint="Switch between the researched display treatments for this card."
								/>
							</div>
						{:else if selectedItem.kind === 'this-site'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
								</dl>

								<Input
									label="Card Title"
									bind:value={thisSiteTitle}
									oninput={handleThisSiteTitleInput}
									onblur={commitThisSiteTitle}
									hint="Updates the This Site card title live and persists as a homepage setting."
								/>
							</div>
						{:else if selectedItem.kind === 'disco'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
									<dt>Caption</dt>
									<dd>{disco.caption}</dd>
									<dt>Preview Mode</dt>
									<dd>{selectedItemKey ? 'Effects wake while selected or visible.' : 'Reduced'}</dd>
								</dl>

								<p class="details-note">{getStaticItemSummary(selectedItem)}</p>
							</div>
						{:else if selectedItem.kind === 'location'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
									<dt>Map Provider</dt>
									<dd>Mapbox GL</dd>
									<dt>Editor Strategy</dt>
									<dd>Deferred mount until visible or selected</dd>
								</dl>

								<p class="details-note">{getStaticItemSummary(selectedItem)}</p>
							</div>
						{:else if selectedItem.kind === 'home'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
									<dt>Role</dt>
									<dd>Personal identity anchor</dd>
								</dl>

								<p class="details-note">{getStaticItemSummary(selectedItem)}</p>
							</div>
						{:else if selectedItem.kind === 'city'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
									<dt>Photo</dt>
									<dd>Houston skyline at night</dd>
								</dl>

								<p class="details-note">{getStaticItemSummary(selectedItem)}</p>
							</div>
						{:else if selectedItem.kind === 'design-system'}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
									<dt>CTA</dt>
									<dd>Explore design system</dd>
								</dl>

								<p class="details-note">{getStaticItemSummary(selectedItem)}</p>
							</div>
						{:else}
							<div class="details-stack">
								<dl class="details-list">
									<dt>Type</dt>
									<dd><code>{selectedItem.kind}</code></dd>
									<dt>Grid Span</dt>
									<dd>
										{selectedItemLayout?.colSpan ?? 1} col × {selectedItemLayout?.rowSpan ?? 1} row
									</dd>
								</dl>

								<p class="details-note">{getStaticItemSummary(selectedItem)}</p>
							</div>
						{/if}
					</div>
				{:else}
					<div class="details-empty">
						<svg
							class="empty-icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z" />
						</svg>
						<p>Click an item in the grid to view its details</p>
					</div>
				{/if}
			</div>

			<div class="settings-panel">
				<div class="settings-card">
					<div class="settings-card__header">
						<div>
							<p class="settings-title">Grid Settings</p>
							<p class="settings-subtitle">Visibility and structure for the homepage grid</p>
						</div>
						<span class="settings-pill">Live</span>
					</div>

					<Switch
						label="Show Essays & Projects"
						description="Toggle visibility of Essays and Projects sections"
						checked={showSectionsEnabled}
						on:click={() => setShowSectionsEnabled(!showSectionsEnabled)}
					/>
				</div>

				<div class="settings-card settings-card--disco">
					<div class="settings-card__header">
						<div>
							<p class="settings-title">Disco Vibes</p>
							<p class="settings-subtitle">Live block tuning values</p>
						</div>
						<span class="settings-pill settings-pill--disco">Pulse</span>
					</div>
					<div class="disco-grid">
						{#each discoParamEntries as entry (entry.label)}
							<div class="disco-item">
								<span class="disco-label">{entry.label}</span>
								<span class="disco-value">{entry.value}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<EditorGridLegend />
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

	.save-btn,
	.reset-btn {
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
		display: grid;
		place-items: center;
		background: var(--text-primary);
		color: var(--page-bg);
	}

	.save-btn__sizer,
	.save-btn__content {
		grid-area: 1 / 1;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.save-btn__sizer {
		visibility: hidden;
	}

	.save-btn:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-0.0625rem);
	}

	.save-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.save-btn.saved {
		background: #10b981;
		color: #fff;
	}

	.save-btn.error {
		background: #ef4444;
	}

	.reset-btn {
		background: var(--surface);
		color: var(--text-secondary);
		border: 0.0625rem solid var(--border-color);
	}

	.reset-btn:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}

	.grid-editor-layout {
		display: grid;
		grid-template-columns: 1fr 20rem;
		gap: 1.5rem;
		align-items: start;
	}

	@media (max-width: 56.25rem) {
		.grid-editor-layout {
			grid-template-columns: 1fr;
		}

		.header-top {
			flex-direction: column;
		}

		.header-actions {
			width: 100%;
		}

		.save-btn,
		.reset-btn {
			flex: 1;
			justify-content: center;
		}

		.live-grid-container {
			order: 2;
		}

		.side-panel {
			order: 1;
			padding-right: 0;
		}
	}

	.live-grid-container {
		position: relative;
		overflow: hidden;
		background: var(--surface);
		border: 0.0625rem solid var(--border-color);
		border-radius: 1rem;
		padding: 1.25rem;
	}

	.live-grid-container > * {
		position: relative;
		z-index: 1;
	}

	.live-grid-glow {
		position: absolute;
		inset: -35% -20%;
		background:
			radial-gradient(circle at 15% 20%, rgba(90, 150, 255, 0.35), transparent 45%),
			radial-gradient(circle at 80% 25%, rgba(70, 120, 255, 0.3), transparent 50%),
			radial-gradient(circle at 50% 80%, rgba(120, 200, 255, 0.2), transparent 55%),
			linear-gradient(135deg, rgba(25, 50, 110, 0.25), transparent 60%);
		opacity: 0.6;
		mix-blend-mode: screen;
		pointer-events: none;
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
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		border-radius: 0.625rem;
		overflow: hidden;
	}

	.grid-item.edit-mode::before {
		content: '';
		position: absolute;
		inset: -0.125rem;
		border: 0.125rem dashed var(--text-muted);
		border-radius: 0.625rem;
		opacity: 0.5;
		pointer-events: none;
		z-index: 1;
	}

	.grid-item-content {
		position: relative;
		height: 100%;
		width: 100%;
		min-height: 7.5rem;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		text-align: left;
		cursor: pointer;
	}

	.grid-item-content--selected {
		outline: 0.125rem solid color-mix(in srgb, var(--caroline-blue-600) 48%, transparent);
		outline-offset: -0.125rem;
		border-radius: 0.625rem;
	}

	.resize-controls {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 10;
		display: flex;
		gap: 0.25rem;
	}

	.drag-handle,
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
		box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.15);
	}

	.drag-handle {
		cursor: grab;
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	.drag-handle:hover,
	.resize-handle:hover {
		transform: scale(1.05);
		box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.2);
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
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
	}

	.side-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-self: start;
		padding-right: 0.25rem;
	}

	.details-panel {
		flex-shrink: 0;
		background: var(--surface);
		border: 0.0625rem solid var(--border-color);
		border-radius: 1rem;
		padding: 1.25rem;
		min-height: 18.75rem;
	}

	.details-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
		padding-bottom: 1rem;
		border-bottom: 0.0625rem solid var(--border-color);
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

	.details-stack {
		display: grid;
		gap: 1rem;
	}

	.details-subsection {
		display: grid;
		gap: 0.9rem;
		padding: 1rem;
		border-radius: 0.85rem;
		border: 0.0625rem solid var(--border-color);
		background: color-mix(in srgb, var(--surface-hover) 55%, transparent);
	}

	.details-subsection__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: baseline;
	}

	.details-subsection__eyebrow {
		margin: 0 0 0.2rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.details-subsection__title {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.details-subsection__meta {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.pokemon-team-editor {
		display: grid;
		gap: 0.85rem;
	}

	.pokemon-team-field {
		display: grid;
		gap: 0.35rem;
	}

	.pokemon-team-field__label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.pokemon-team-field__input {
		width: 100%;
		padding: 0.65rem 0.8rem;
		border-radius: 0.7rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
		color: var(--text-primary);
	}

	.pokemon-team-field__input:focus {
		outline: 0.125rem solid color-mix(in srgb, var(--caroline-blue-600) 40%, transparent);
		outline-offset: 0.0625rem;
		border-color: var(--caroline-blue-600);
	}

	.pokemon-team-field__message {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.pokemon-team-field__message--error {
		color: #dc2626;
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

	.details-note {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--text-secondary);
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

	.settings-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex-shrink: 0;
	}

	.settings-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 0.875rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
	}

	.settings-card--disco {
		background:
			radial-gradient(circle at top, rgba(84, 139, 255, 0.12), transparent 55%), var(--surface);
		border-color: color-mix(in srgb, var(--border-color) 60%, rgba(84, 139, 255, 0.2));
	}

	.settings-card__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.settings-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.25rem 0;
	}

	.settings-subtitle {
		font-size: 0.75rem;
		color: var(--text-muted);
		margin: 0;
	}

	.settings-pill {
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--text-secondary);
		background: var(--surface-hover);
		padding: 0.25rem 0.5rem;
		border-radius: 999px;
	}

	.settings-pill--disco {
		background: rgba(90, 150, 255, 0.2);
		color: rgba(90, 150, 255, 0.85);
	}

	.disco-grid {
		display: grid;
		gap: 0.5rem;
	}

	.disco-item {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.45rem 0.6rem;
		border-radius: 0.5rem;
		background: rgba(15, 25, 55, 0.2);
		border: 1px solid rgba(90, 150, 255, 0.15);
	}

	.disco-label {
		font-size: 0.65rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.6);
	}

	.disco-value {
		font-family: 'SFMono-Regular', 'Menlo', monospace;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.85);
	}

	.details-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 12.5rem;
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
		max-width: 12.5rem;
	}

	:global([data-dnd-dragged]) {
		opacity: 0.5;
		transform: scale(1.02);
	}

	:global([data-dnd-shadow]) {
		opacity: 0.3;
	}
</style>
