<script lang="ts">
	import DesignComponentPreview from './DesignComponentPreview.svelte';
	import {
		designComponentCategories,
		designComponentCount,
		type DesignComponentCategory,
		type DesignComponentDoc,
		type DesignPreviewMode
	} from '$lib/registry/designComponents';

	let query = $state('');
	let selectedMode = $state<'all' | DesignPreviewMode>('all');
	let selectedCategory = $state('all');

	const modeLabels: Record<'all' | DesignPreviewMode, string> = {
		all: 'All',
		live: 'Live',
		mocked: 'Mocked',
		documented: 'Documented'
	};

	const allModes: Array<'all' | DesignPreviewMode> = ['all', 'live', 'mocked', 'documented'];

	const filteredCategories = $derived.by(() =>
		designComponentCategories
			.map((category) => ({
				...category,
				components: category.components.filter((component) => matchesFilters(category, component))
			}))
			.filter((category) => category.components.length > 0)
	);

	const visibleCount = $derived(
		filteredCategories.reduce((count, category) => count + category.components.length, 0)
	);

	function matchesFilters(category: DesignComponentCategory, component: DesignComponentDoc) {
		const normalizedQuery = query.trim().toLowerCase();
		const matchesQuery =
			normalizedQuery.length === 0 ||
			[
				component.name,
				component.sourcePath,
				component.summary,
				component.description,
				category.name,
				component.previewMode,
				...component.dependencies,
				...component.props
			]
				.join(' ')
				.toLowerCase()
				.includes(normalizedQuery);
		const matchesMode = selectedMode === 'all' || component.previewMode === selectedMode;
		const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;

		return matchesQuery && matchesMode && matchesCategory;
	}

	function clearFilters() {
		query = '';
		selectedMode = 'all';
		selectedCategory = 'all';
	}
</script>

<section class="design-gallery" aria-labelledby="design-gallery-title">
	<div class="design-gallery__toolbar">
		<div>
			<p class="design-gallery__eyebrow">Component index</p>
			<h2 id="design-gallery-title">Every component in `src/lib/components`</h2>
			<p>
				Showing {visibleCount} of {designComponentCount} components with docs, source paths, required
				props, dependencies, and examples.
			</p>
		</div>

		<div class="design-gallery__filters" aria-label="Component filters">
			<label>
				<span>Search</span>
				<input
					bind:value={query}
					type="search"
					placeholder="Search by name, path, prop, or dependency"
				/>
			</label>

			<label>
				<span>Category</span>
				<select bind:value={selectedCategory}>
					<option value="all">All categories</option>
					{#each designComponentCategories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</label>
		</div>

		<div class="design-gallery__mode-filters" aria-label="Preview mode filters">
			{#each allModes as mode (mode)}
				<button
					type="button"
					class:design-gallery__mode-filter--active={selectedMode === mode}
					onclick={() => (selectedMode = mode)}
				>
					{modeLabels[mode]}
				</button>
			{/each}
		</div>
	</div>

	{#if filteredCategories.length === 0}
		<div class="design-gallery__empty">
			<h3>No components match those filters.</h3>
			<button type="button" onclick={clearFilters}>Clear filters</button>
		</div>
	{:else}
		{#each filteredCategories as category (category.id)}
			<section class="design-category" aria-labelledby={`design-category-${category.id}`}>
				<div class="design-category__header">
					<div>
						<h3 id={`design-category-${category.id}`}>{category.name}</h3>
						<p>{category.description}</p>
					</div>
					<span>{category.components.length} components</span>
				</div>

				<div class="design-category__grid">
					{#each category.components as component (component.id)}
						<article class="design-component-card" aria-labelledby={`component-${component.id}`}>
							<header class="design-component-card__header">
								<div>
									<p class="design-gallery__eyebrow">{component.categoryName}</p>
									<h4 id={`component-${component.id}`}>{component.name}</h4>
								</div>
								<span class="design-component-card__mode" data-mode={component.previewMode}>
									{modeLabels[component.previewMode]}
								</span>
							</header>

							<p class="design-component-card__summary">{component.summary}</p>
							<code class="design-component-card__path">{component.sourcePath}</code>

							<DesignComponentPreview {component} />

							<div class="design-component-card__docs">
								<div>
									<h5>What it does</h5>
									<p>{component.description}</p>
								</div>

								<div>
									<h5>Key props</h5>
									<ul>
										{#each component.props as prop (prop)}
											<li><code>{prop}</code></li>
										{/each}
									</ul>
								</div>

								<div>
									<h5>Dependencies</h5>
									<ul>
										{#each component.dependencies as dependency (dependency)}
											<li>{dependency}</li>
										{/each}
									</ul>
								</div>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/each}
	{/if}
</section>

<style>
	.design-gallery {
		display: grid;
		gap: 2rem;
		--g-text: #e9eaff;
		--g-muted: rgba(225, 226, 255, 0.62);
		--g-subtle: rgba(225, 226, 255, 0.42);
		--g-border: rgba(255, 255, 255, 0.08);
		--g-border-strong: rgba(255, 255, 255, 0.18);
		--g-surface: rgba(20, 21, 45, 0.7);
		--g-surface-2: rgba(28, 30, 58, 0.6);
		--g-surface-hover: rgba(36, 39, 72, 0.85);
		--g-orb-from: #2d4ad4;
		--g-orb-via: #9936b6;
		--g-orb-pink: #d73a82;
		--g-orb-to: #f9614c;
		--g-orb-mint: #f2b1c9;
		color: var(--g-text);
	}

	.design-gallery__toolbar,
	.design-category,
	.design-component-card,
	.design-gallery__empty {
		position: relative;
		border: 0.0625rem solid var(--g-border);
		border-radius: 1.25rem;
		background: var(--g-surface);
		backdrop-filter: blur(0.75rem);
		box-shadow:
			0 1px 0 0 rgba(255, 255, 255, 0.05) inset,
			0 1.5rem 3rem -2rem rgba(0, 0, 0, 0.6);
	}

	.design-gallery__toolbar::before,
	.design-category::before,
	.design-component-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		padding: 0.0625rem;
		background: linear-gradient(
			135deg,
			rgba(45, 74, 212, 0.4),
			rgba(153, 54, 182, 0.35) 40%,
			rgba(217, 58, 130, 0.3) 70%,
			rgba(249, 97, 76, 0.25)
		);
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none;
		opacity: 0.55;
	}

	.design-component-card::before {
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.design-component-card:hover::before {
		opacity: 0.7;
	}

	.design-gallery__toolbar {
		display: grid;
		gap: 1.5rem;
		padding: clamp(1.25rem, 2vw, 1.75rem);
	}

	.design-gallery__toolbar h2,
	.design-category__header h3,
	.design-component-card__header h4,
	.design-gallery__empty h3 {
		margin: 0;
		color: var(--g-text);
		font-family: 'DM Serif Text', serif;
		letter-spacing: -0.02em;
	}

	.design-gallery__toolbar h2 {
		font-size: clamp(1.5rem, 2.4vw, 2rem);
		line-height: 1.05;
	}

	.design-category__header h3 {
		font-size: clamp(1.25rem, 2vw, 1.625rem);
		line-height: 1.1;
	}

	.design-component-card__header h4 {
		font-size: 1.125rem;
		line-height: 1.2;
	}

	.design-gallery__toolbar p,
	.design-category__header p,
	.design-component-card__summary,
	.design-component-card__docs p,
	.design-component-card__docs li {
		color: var(--g-muted);
		line-height: 1.55;
	}

	.design-gallery__toolbar p {
		margin: 0.5rem 0 0;
		max-width: 50rem;
	}

	.design-gallery__eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0 0.5rem;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--g-orb-mint);
	}

	.design-gallery__eyebrow::before {
		content: '';
		display: inline-block;
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, var(--g-orb-from), var(--g-orb-pink));
		box-shadow: 0 0 0.5rem rgba(217, 58, 130, 0.7);
	}

	.design-gallery__filters {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	}

	.design-gallery__filters label {
		display: grid;
		gap: 0.375rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--g-subtle);
	}

	.design-gallery__filters input,
	.design-gallery__filters select {
		width: 100%;
		border: 0.0625rem solid var(--g-border-strong);
		border-radius: 0.75rem;
		background: rgba(10, 11, 26, 0.55);
		color: var(--g-text);
		padding: 0.75rem 0.875rem;
		font-size: 0.9375rem;
		font-weight: 500;
		font-family: inherit;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;
	}

	.design-gallery__filters input::placeholder {
		color: var(--g-subtle);
	}

	.design-gallery__filters input:focus-visible,
	.design-gallery__filters select:focus-visible {
		outline: none;
		border-color: rgba(153, 54, 182, 0.7);
		box-shadow: 0 0 0 0.1875rem rgba(153, 54, 182, 0.25);
		background: rgba(10, 11, 26, 0.75);
	}

	.design-gallery__filters select {
		appearance: none;
		background-image:
			linear-gradient(45deg, transparent 50%, var(--g-muted) 50%),
			linear-gradient(135deg, var(--g-muted) 50%, transparent 50%);
		background-position:
			calc(100% - 1.125rem) 50%,
			calc(100% - 0.75rem) 50%;
		background-size:
			0.375rem 0.375rem,
			0.375rem 0.375rem;
		background-repeat: no-repeat;
		padding-right: 2.25rem;
	}

	.design-gallery__filters select option {
		background: #14152d;
		color: var(--g-text);
	}

	.design-gallery__mode-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.design-gallery__mode-filters button,
	.design-gallery__empty button {
		position: relative;
		border: 0.0625rem solid var(--g-border-strong);
		border-radius: 9999px;
		background: rgba(10, 11, 26, 0.55);
		color: var(--g-muted);
		cursor: pointer;
		font-family: inherit;
		font-size: 0.8125rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		padding: 0.5rem 1rem;
		transition:
			color 0.2s ease,
			border-color 0.2s ease,
			background 0.2s ease,
			transform 0.2s ease;
	}

	.design-gallery__mode-filters button:hover,
	.design-gallery__empty button:hover {
		color: var(--g-text);
		border-color: rgba(255, 255, 255, 0.32);
		background: rgba(36, 39, 72, 0.75);
	}

	.design-gallery__mode-filter--active {
		color: #fff !important;
		border-color: transparent !important;
		background: linear-gradient(
			115deg,
			var(--g-orb-from) 0%,
			var(--g-orb-via) 50%,
			var(--g-orb-pink) 80%,
			var(--g-orb-to) 100%
		) !important;
		box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(217, 58, 130, 0.6);
	}

	.design-category {
		display: grid;
		gap: 1.25rem;
		padding: clamp(1.25rem, 2vw, 1.75rem);
	}

	.design-category__header,
	.design-component-card__header {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		justify-content: space-between;
	}

	.design-category__header span {
		flex-shrink: 0;
		border: 0.0625rem solid var(--g-border-strong);
		border-radius: 9999px;
		background: rgba(10, 11, 26, 0.55);
		color: var(--g-muted);
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.4rem 0.75rem;
		white-space: nowrap;
	}

	.design-component-card__mode {
		flex-shrink: 0;
		border: 0.0625rem solid var(--g-border-strong);
		border-radius: 9999px;
		background: rgba(10, 11, 26, 0.55);
		color: var(--g-muted);
		font-size: 0.6875rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.3rem 0.6rem;
		white-space: nowrap;
	}

	.design-component-card__mode[data-mode='live'] {
		color: #b8ffe5;
		background: rgba(184, 255, 229, 0.12);
		border-color: rgba(184, 255, 229, 0.35);
	}

	.design-component-card__mode[data-mode='mocked'] {
		color: #b8ccff;
		background: rgba(45, 74, 212, 0.18);
		border-color: rgba(45, 74, 212, 0.5);
	}

	.design-component-card__mode[data-mode='documented'] {
		color: var(--g-orb-mint);
		background: rgba(215, 58, 130, 0.15);
		border-color: rgba(215, 58, 130, 0.4);
	}

	.design-category__grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 32rem), 1fr));
	}

	.design-component-card {
		display: grid;
		align-content: start;
		gap: 1rem;
		padding: 1.25rem;
		transition:
			transform 0.3s ease,
			background 0.3s ease;
	}

	.design-component-card:hover {
		background: var(--g-surface-2);
		transform: translateY(-0.125rem);
	}

	.design-component-card__path {
		display: block;
		overflow-x: auto;
		border: 0.0625rem solid var(--g-border);
		border-radius: 0.5rem;
		background: rgba(10, 11, 26, 0.55);
		color: var(--g-subtle);
		padding: 0.5rem 0.75rem;
		font-family:
			'JetBrains Mono',
			ui-monospace,
			SFMono-Regular,
			SF Mono,
			Menlo,
			Consolas,
			Liberation Mono,
			monospace;
		font-size: 0.8125rem;
	}

	.design-component-card__docs {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	}

	.design-component-card__docs h5 {
		margin: 0 0 0.5rem;
		color: var(--g-text);
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.design-component-card__docs h5::before {
		content: '';
		display: inline-block;
		width: 0.25rem;
		height: 0.25rem;
		margin-right: 0.4rem;
		border-radius: 9999px;
		background: var(--g-orb-pink);
		box-shadow: 0 0 0.4rem rgba(217, 58, 130, 0.7);
		vertical-align: middle;
	}

	.design-component-card__docs ul {
		display: grid;
		gap: 0.375rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.design-component-card__docs li {
		font-size: 0.875rem;
		color: var(--g-muted);
		padding-left: 0.875rem;
		position: relative;
	}

	.design-component-card__docs li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.625rem;
		width: 0.25rem;
		height: 0.0625rem;
		background: var(--g-subtle);
	}

	.design-component-card__docs code {
		color: var(--g-text);
		background: rgba(10, 11, 26, 0.55);
		border: 0.0625rem solid var(--g-border);
		border-radius: 0.25rem;
		padding: 0.0625rem 0.375rem;
		font-family:
			'JetBrains Mono',
			ui-monospace,
			SFMono-Regular,
			SF Mono,
			Menlo,
			Consolas,
			Liberation Mono,
			monospace;
		font-size: 0.8125rem;
	}

	.design-gallery__empty {
		padding: 3rem 2rem;
		text-align: center;
	}

	.design-gallery__empty h3 {
		margin-bottom: 1.25rem;
	}
</style>
