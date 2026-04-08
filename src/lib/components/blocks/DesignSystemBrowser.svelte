<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Tabs, Badge, Button, Divider } from '$lib/components/ui';
	import ComponentLibraryPreview from './ComponentLibraryPreview.svelte';
	import {
		componentLibraryCategories,
		getComponentLibraryItemById
	} from '$lib/registry/componentLibrary';

	interface Props {
		open?: boolean;
		inline?: boolean;
		onclose?: () => void;
	}

	let { open = false, inline = false, onclose }: Props = $props();

	let activeTab = $state('overview');
	let selectedComponentId = $state<string | null>(null);

	const selectedComponent = $derived(
		selectedComponentId ? getComponentLibraryItemById(selectedComponentId) : null
	);

	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'tokens', label: 'Design Tokens' },
		{ id: 'components', label: 'Components' }
	];

	const colorPalettes = {
		'Caroline Blue': [
			{ name: '--caroline-blue-100', value: 'hsl(217, 68%, 63%)' },
			{ name: '--caroline-blue-200', value: 'hsl(217, 90%, 76%)' },
			{ name: '--caroline-blue-400', value: 'hsl(217, 85%, 75%)' },
			{ name: '--caroline-blue-500', value: 'hsla(217, 97%, 76%, 1)' },
			{ name: '--caroline-blue-600', value: 'hsl(217, 78%, 65%)' },
			{ name: '--caroline-blue-700', value: 'hsl(217, 78%, 60%)' },
			{ name: '--caroline-blue-800', value: 'hsl(217, 78%, 55%)' },
			{ name: '--caroline-blue-900', value: 'hsl(217, 78%, 50%)' }
		],
		'Sandy Tan': [
			{ name: '--sandy-tan-200', value: 'hsl(36, 38%, 95%)' },
			{ name: '--sandy-tan-300', value: 'hsl(36, 38%, 90%)' },
			{ name: '--sandy-tan-400', value: 'hsl(36, 38%, 90%)' },
			{ name: '--sandy-tan-500', value: 'hsl(36, 38%, 85%)' },
			{ name: '--sandy-tan-600', value: 'hsl(36, 38%, 80%)' },
			{ name: '--sandy-tan-700', value: 'hsl(36, 38%, 75%)' },
			{ name: '--sandy-tan-800', value: 'hsl(36, 38%, 70%)' },
			{ name: '--sandy-tan-900', value: 'hsl(36, 38%, 65%)' }
		],
		'Liver Brown': [
			{ name: '--liver-brown-500', value: 'hsl(0, 9%, 32%)' },
			{ name: '--liver-brown-600', value: 'hsl(0, 9%, 27%)' },
			{ name: '--liver-brown-700', value: 'hsl(0, 9%, 25%)' },
			{ name: '--liver-brown-800', value: 'hsl(0, 9%, 20%)' },
			{ name: '--liver-brown-900', value: 'hsl(0, 9%, 15%)' }
		],
		'Transit Yellow': [
			{ name: '--transit-yellow-100', value: 'hsl(47, 100%, 96%)' },
			{ name: '--transit-yellow-200', value: 'hsl(47, 100%, 85%)' },
			{ name: '--transit-yellow-500', value: 'hsl(47, 100%, 78%)' },
			{ name: '--transit-yellow-700', value: 'hsl(47, 100%, 68%)' },
			{ name: '--transit-yellow-900', value: 'hsl(47, 100%, 58%)' }
		],
		Accents: [
			{ name: '--blush-pink-500', value: '#ED9CEF' },
			{ name: '--light-rose-500', value: '#FFCBCB' },
			{ name: '--magic-mint-500', value: '#B8FFE5' },
			{ name: '--lawn-green-500', value: 'hsl(128, 61%, 47%)' }
		]
	};

	function openComponentDetails(componentId: string) {
		selectedComponentId = componentId;
	}

	function closeComponentDetails() {
		selectedComponentId = null;
	}

	function getStatusVariant(hasDetailedDocs: boolean): 'success' | 'default' {
		return hasDetailedDocs ? 'success' : 'default';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open) {
			return;
		}

		if (event.key === 'Escape') {
			if (activeTab === 'components' && selectedComponentId) {
				closeComponentDetails();
				return;
			}

			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	{#if !inline}
		<div
			class="design-browser-backdrop"
			transition:fade={{ duration: 300, easing: cubicOut }}
			onclick={onclose}
			role="presentation"
		></div>
	{/if}

	<div
		class="design-browser"
		class:design-browser--inline={inline}
		transition:fly={{ y: 40, duration: 400, easing: cubicOut }}
		role={inline ? 'region' : 'dialog'}
		aria-modal={inline ? undefined : 'true'}
		aria-labelledby="design-browser-title"
	>
		<header class="design-browser__header">
			<div class="flex items-center gap-3">
				<div class="design-browser__logo" aria-hidden="true">
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="32" height="32" rx="6" fill="var(--caroline-blue-700)" />
						<path
							d="M8 10h16M8 16h16M8 22h10"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<div>
					<h1 id="design-browser-title" class="text-xl font-bold text-(--text-primary)">
						EMZINNIA Design System
					</h1>
					<p class="text-sm text-(--text-muted)">Components, tokens, and patterns</p>
				</div>
			</div>
			<button
				class="design-browser__close"
				onclick={onclose}
				aria-label="Close design system browser"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</header>

		<div class="design-browser__tabs">
			<Tabs {tabs} bind:activeTab>
				{#snippet children(tab)}
					{#if tab === 'overview'}
						<div class="design-browser__content" in:fade={{ duration: 200, delay: 50 }}>
							<div class="overview-grid">
								<div class="overview-card">
									<h3>Principles</h3>
									<p>- personal - fun - clear</p>
								</div>
								<div class="overview-card">
									<h3>Philosophy</h3>
									<p>
										This design system embraces bold contrasts, warm sandy backgrounds, and vibrant
										caroline blue accents. Every component is built for accessibility first.
									</p>
								</div>
							</div>

							<Divider class="my-8" />

							<h3 class="mb-4 text-lg font-semibold text-(--text-primary)">Featured Components</h3>
							<div class="component-preview-grid">
								<div class="component-preview">
									<span class="component-preview__label">Button</span>
									<div class="component-preview__demo">
										<Button variant="primary" size="sm">Primary</Button>
										<Button variant="secondary" size="sm">Secondary</Button>
										<Button variant="outline" size="sm">Outline</Button>
									</div>
								</div>
								<div class="component-preview">
									<span class="component-preview__label">Badge</span>
									<div class="component-preview__demo">
										<Badge variant="default">Default</Badge>
										<Badge variant="primary">Primary</Badge>
										<Badge variant="success">Success</Badge>
										<Badge variant="warning">Warning</Badge>
									</div>
								</div>
							</div>
						</div>
					{:else if tab === 'tokens'}
						<div class="design-browser__content" in:fade={{ duration: 200, delay: 50 }}>
							<p class="mb-6 text-(--text-muted)">
								Design tokens are the visual design atoms of the design system — specifically, they
								are named entities that store visual design attributes.
							</p>

							{#each Object.entries(colorPalettes) as [paletteName, colors] (paletteName)}
								<div class="token-section">
									<h3 class="token-section__title">{paletteName}</h3>
									<div class="color-grid">
										{#each colors as color (color.name)}
											<div class="color-swatch">
												<div
													class="color-swatch__preview"
													style="background-color: var({color.name})"
												></div>
												<div class="color-swatch__info">
													<code class="color-swatch__name">{color.name}</code>
													<span class="color-swatch__value">{color.value}</span>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/each}

							<Divider class="my-8" />

							<div class="token-section">
								<h3 class="token-section__title">Semantic Tokens</h3>
								<div class="semantic-tokens">
									<div class="semantic-token">
										<div
											class="semantic-token__preview"
											style="background-color: var(--page-bg)"
										></div>
										<code>--page-bg</code>
										<span>Page background</span>
									</div>
									<div class="semantic-token">
										<div
											class="semantic-token__preview"
											style="background-color: var(--text-primary)"
										></div>
										<code>--text-primary</code>
										<span>Primary text</span>
									</div>
									<div class="semantic-token">
										<div
											class="semantic-token__preview"
											style="background-color: var(--text-muted)"
										></div>
										<code>--text-muted</code>
										<span>Muted text</span>
									</div>
									<div class="semantic-token">
										<div
											class="semantic-token__preview"
											style="background-color: var(--border-color)"
										></div>
										<code>--border-color</code>
										<span>Border color</span>
									</div>
								</div>
							</div>
						</div>
					{:else if tab === 'components'}
						<div class="design-browser__content" in:fade={{ duration: 200, delay: 50 }}>
							<div class="component-browser-intro">
								<p class="text-(--text-muted)">
									Browse the component library, open a live preview, and review usage notes without
									leaving the explorer.
								</p>
								<Badge variant="primary" size="sm" pill>
									Foundations + Layout documented first
								</Badge>
							</div>

							{#if selectedComponent}
								<section
									class="component-detail"
									aria-labelledby="component-detail-title"
									aria-live="polite"
								>
									<div class="component-detail__header">
										<div class="component-detail__heading">
											<div class="component-detail__badges">
												<Badge variant="primary" size="sm" pill>
													{selectedComponent.categoryName}
												</Badge>
												<Badge
													variant={getStatusVariant(selectedComponent.hasDetailedDocs)}
													size="sm"
													pill
												>
													{selectedComponent.statusLabel}
												</Badge>
											</div>
											<h3 id="component-detail-title">{selectedComponent.name}</h3>
											<p>{selectedComponent.summary}</p>
										</div>

										<Button variant="outline" size="sm" onclick={closeComponentDetails}>
											Close details
										</Button>
									</div>

									<div class="component-detail__grid">
										<div class="component-detail__panel">
											<span class="component-detail__label">Live preview</span>
											<ComponentLibraryPreview
												componentId={selectedComponent.previewId ?? selectedComponent.id}
											/>
										</div>

										<div class="component-detail__panel component-detail__panel--docs">
											<div class="component-detail__section">
												<h4>What it does</h4>
												<p>{selectedComponent.description}</p>
											</div>

											<div class="component-detail__section">
												<h4>Use it when</h4>
												<ul class="component-detail__list">
													{#each selectedComponent.whenToUse as note (note)}
														<li>{note}</li>
													{/each}
												</ul>
											</div>

											<div class="component-detail__section">
												<h4>Accessibility</h4>
												<ul class="component-detail__list">
													{#each selectedComponent.accessibility as note (note)}
														<li>{note}</li>
													{/each}
												</ul>
											</div>

											{#if selectedComponent.props.length > 0}
												<div class="component-detail__section">
													<h4>Key props</h4>
													<div class="component-props">
														{#each selectedComponent.props as prop (prop.name)}
															<div class="component-prop">
																<div class="component-prop__topline">
																	<code>{prop.name}</code>
																	<span>{prop.type}</span>
																</div>
																<p>{prop.description}</p>
																{#if prop.defaultValue}
																	<small>Default: {prop.defaultValue}</small>
																{/if}
															</div>
														{/each}
													</div>
												</div>
											{:else}
												<div class="component-detail__section">
													<h4>Documentation status</h4>
													<p>
														Richer prop notes and more tailored examples are still being added for
														this category.
													</p>
												</div>
											{/if}

											<div class="component-detail__section">
												<h4>Implementation</h4>
												<code class="component-detail__path">{selectedComponent.sourcePath}</code>
											</div>
										</div>
									</div>
								</section>
							{/if}

							{#each componentLibraryCategories as category (category.id)}
								<div class="component-category">
									<h3 class="component-category__title">{category.name}</h3>
									<div class="component-list">
										{#each category.components as component (component.id)}
											<button
												type="button"
												class="component-item"
												class:component-item--selected={selectedComponentId === component.id}
												aria-label={`View ${component.name} details`}
												aria-pressed={selectedComponentId === component.id}
												onclick={() => openComponentDetails(component.id)}
											>
												<span class="component-item__name">{component.name}</span>
												<Badge variant={getStatusVariant(component.hasDetailedDocs)} size="sm" pill>
													{component.statusLabel}
												</Badge>
											</button>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{/snippet}
			</Tabs>
		</div>
	</div>
{/if}

<style>
	.design-browser-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(0.5rem);
		z-index: 100;
	}

	.design-browser {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(90vw, 62.5rem);
		max-height: 85vh;
		background: var(--page-bg-subtle);
		border: 0.125rem solid var(--border-color);
		border-radius: 1rem;
		box-shadow:
			0 1.5625rem 3.125rem -0.75rem rgba(0, 0, 0, 0.4),
			0 0 0 0.0625rem var(--border-color);
		z-index: 101;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.design-browser--inline {
		position: relative;
		top: auto;
		left: auto;
		transform: none;
		width: 100%;
		max-height: none;
	}

	.design-browser__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-bottom: 0.125rem solid var(--border-color);
		background: var(--header-bg);
	}

	.design-browser__logo {
		flex-shrink: 0;
	}

	.design-browser__close {
		padding: 0.5rem;
		border-radius: 0.5rem;
		color: var(--text-muted);
		transition: all 0.2s ease;
		cursor: pointer;
		background: transparent;
		border: none;
	}

	.design-browser__close:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}

	.design-browser__tabs {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding: 0 1.5rem 1.5rem;
	}

	.design-browser__tabs :global([role='tablist']) {
		margin-top: 1rem;
	}

	.design-browser__content {
		flex: 1;
		overflow-y: auto;
		padding-right: 0.5rem;
		max-height: calc(85vh - 12.5rem);
	}

	.design-browser--inline .design-browser__content {
		max-height: none;
		overflow-y: visible;
	}

	.overview-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.overview-card {
		padding: 1.25rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.75rem;
	}

	.overview-card h3 {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		margin-bottom: 0.5rem;
	}

	.overview-card p {
		color: var(--text-primary);
		line-height: 1.6;
	}

	.component-preview-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.component-preview {
		padding: 1rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.75rem;
	}

	.component-preview__label {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}

	.component-preview__demo {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.token-section {
		margin-bottom: 2rem;
	}

	.token-section__title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 0.0625rem solid var(--border-color);
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11.25rem, 1fr));
		gap: 0.75rem;
	}

	.color-swatch {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
	}

	.color-swatch__preview {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.375rem;
		border: 0.0625rem solid var(--border-color);
		flex-shrink: 0;
	}

	.color-swatch__info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.color-swatch__name {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.color-swatch__value {
		font-size: 0.65rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.semantic-tokens {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr));
		gap: 0.75rem;
	}

	.semantic-token {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
	}

	.semantic-token__preview {
		width: 2rem;
		height: 2rem;
		border-radius: 0.25rem;
		border: 0.0625rem solid var(--border-color);
		flex-shrink: 0;
	}

	.semantic-token code {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.semantic-token span {
		font-size: 0.7rem;
		color: var(--text-muted);
	}

	.component-category {
		margin-bottom: 1.5rem;
	}

	.component-browser-intro {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.component-detail {
		display: grid;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.875rem;
		box-shadow: 0 0.75rem 1.75rem -1.4rem rgba(0, 0, 0, 0.45);
	}

	.component-detail__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	.component-detail__heading {
		display: grid;
		gap: 0.5rem;
	}

	.component-detail__heading h3 {
		font-size: 1.4rem;
		font-weight: 800;
		color: var(--text-primary);
		line-height: 1.1;
	}

	.component-detail__heading p {
		color: var(--text-muted);
		line-height: 1.6;
	}

	.component-detail__badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.component-detail__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: 1rem;
		align-items: start;
	}

	.component-detail__panel {
		display: grid;
		gap: 0.75rem;
	}

	.component-detail__panel--docs {
		padding: 1rem;
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--page-bg-subtle) 70%, white);
	}

	.component-detail__label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.component-detail__section {
		display: grid;
		gap: 0.5rem;
	}

	.component-detail__section h4 {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.component-detail__section p {
		color: var(--text-primary);
		line-height: 1.6;
	}

	.component-detail__list {
		margin: 0;
		padding-left: 1rem;
		display: grid;
		gap: 0.35rem;
		color: var(--text-primary);
	}

	.component-props {
		display: grid;
		gap: 0.75rem;
	}

	.component-prop {
		display: grid;
		gap: 0.25rem;
		padding: 0.75rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.625rem;
	}

	.component-prop__topline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	.component-prop__topline code {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.component-prop__topline span,
	.component-prop small {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.component-detail__path {
		display: inline-flex;
		width: fit-content;
		padding: 0.5rem 0.625rem;
		border-radius: 0.5rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--card-bg);
		font-size: 0.75rem;
		color: var(--text-primary);
	}

	.component-category__title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 0.0625rem solid var(--border-color);
	}

	.component-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr));
		gap: 0.5rem;
	}

	.component-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.625rem 0.875rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
		transition: all 0.15s ease;
		width: 100%;
		text-align: left;
		cursor: pointer;
	}

	.component-item:hover {
		border-color: var(--caroline-blue-600);
		background: var(--surface-hover);
	}

	.component-item:focus-visible {
		outline: 0.125rem solid var(--caroline-blue-700);
		outline-offset: 0.125rem;
	}

	.component-item--selected {
		border-color: var(--caroline-blue-600);
		background: color-mix(in srgb, var(--caroline-blue-100) 45%, var(--card-bg));
		box-shadow: 0 0 0 0.0625rem var(--caroline-blue-600);
	}

	.component-item__name {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	@media (max-width: 40rem) {
		.design-browser {
			width: 95vw;
			max-height: 90vh;
		}

		.overview-grid {
			grid-template-columns: 1fr;
		}

		.component-preview-grid {
			grid-template-columns: 1fr;
		}

		.component-browser-intro,
		.component-detail__header {
			flex-direction: column;
		}

		.component-detail__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
