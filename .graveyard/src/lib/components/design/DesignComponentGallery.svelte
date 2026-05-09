<script lang="ts">
	import DesignComponentPreview from './DesignComponentPreview.svelte';
	import {
		designComponentCategories,
		designComponentCount,
		type DesignComponentDoc,
		type DesignPreviewMode
	} from '$lib/registry/designComponents';

	const REPO_BLOB_URL =
		'https://github.com/EmmaRamirez/emmaramirez.me/blob/main/src/lib/components/';

	let { repoRoot = null }: { repoRoot?: string | null } = $props();

	let query = $state('');
	let selectedMode = $state<'all' | DesignPreviewMode>('all');
	let selectedCategory = $state('all');
	let copiedId = $state<string | null>(null);
	let menuOpen = $state(false);
	let infoOpen = $state(false);
	let activeComponent = $state<DesignComponentDoc | null>(null);
	let activeCategoryName = $state<string>('');
	let mounted = $state<Record<string, boolean>>({});

	const modeLabels: Record<'all' | DesignPreviewMode, string> = {
		all: 'All',
		live: 'Live',
		mocked: 'Mocked',
		documented: 'Documented'
	};

	const allModes: Array<'all' | DesignPreviewMode> = ['all', 'live', 'mocked', 'documented'];

	const filteredItems = $derived.by(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return designComponentCategories.flatMap((category) =>
			category.components
				.filter((component) => {
					const matchesQuery =
						normalizedQuery.length === 0 ||
						[
							component.name,
							component.sourcePath,
							component.summary,
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
				})
				.map((component) => ({ component, categoryName: category.name }))
		);
	});

	const visibleCount = $derived(filteredItems.length);

	const filteredCategories = $derived.by(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return designComponentCategories
			.map((category) => ({
				...category,
				components: category.components.filter((component) => {
					const matchesQuery =
						normalizedQuery.length === 0 ||
						[
							component.name,
							component.sourcePath,
							component.summary,
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
				})
			}))
			.filter((category) => category.components.length > 0);
	});

	function clearFilters() {
		query = '';
		selectedMode = 'all';
		selectedCategory = 'all';
	}

	function sourceUrl(component: DesignComponentDoc) {
		const trimmed = component.sourcePath.replace(/^src\/lib\/components\//, '');
		return REPO_BLOB_URL + trimmed;
	}

	function editorUrl(component: DesignComponentDoc) {
		if (!repoRoot) return null;
		const root = repoRoot.endsWith('/') ? repoRoot.slice(0, -1) : repoRoot;
		return `vscode://file${root}/${component.sourcePath}`;
	}

	async function copyPath(component: DesignComponentDoc) {
		try {
			await navigator.clipboard.writeText(component.sourcePath);
			copiedId = component.id;
			setTimeout(() => {
				if (copiedId === component.id) copiedId = null;
			}, 1400);
		} catch {
			// clipboard not available; ignore
		}
	}

	function openInfo(component: DesignComponentDoc, categoryName: string) {
		activeComponent = component;
		activeCategoryName = categoryName;
		menuOpen = false;
		infoOpen = true;
	}

	function closeInfo() {
		infoOpen = false;
	}

	function handleEsc(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		if (infoOpen) {
			infoOpen = false;
		} else if (menuOpen) {
			menuOpen = false;
		}
	}

	function scrollToComponent(component: DesignComponentDoc) {
		mounted = { ...mounted, [component.id]: true };
		const target = document.getElementById(`tile-anchor-${component.id}`);
		if (target) {
			const top = target.getBoundingClientRect().top + window.scrollY - 16;
			window.scrollTo({ top, behavior: 'smooth' });
		}
		menuOpen = false;
	}

	function lazyMount(node: HTMLElement, id: string) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					mounted = { ...mounted, [id]: true };
					observer.disconnect();
				}
			},
			{ rootMargin: '400px 0px' }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<svelte:window onkeydown={handleEsc} />

<div class="design-wall" aria-label="Component wall">
	{#each filteredItems as { component, categoryName } (component.id)}
		<article
			id={`tile-anchor-${component.id}`}
			class="design-tile"
			data-mode={component.previewMode}
			aria-labelledby={`tile-${component.id}`}
		>
			<div class="design-tile__stage" use:lazyMount={component.id}>
				{#if mounted[component.id]}
					<div class="design-tile__scale">
						<svelte:boundary>
							<DesignComponentPreview {component} minimal />
							{#snippet failed(error)}
								<div class="design-tile__error" title={String(error)}>
									<span>{component.name}</span>
									<span class="design-tile__error-note">render failed</span>
								</div>
							{/snippet}
						</svelte:boundary>
					</div>
				{/if}
			</div>
			<button
				type="button"
				class="design-tile__info"
				aria-label={`Show details for ${component.name}`}
				onclick={() => openInfo(component, categoryName)}
			>
				<svg viewBox="0 0 16 16" aria-hidden="true">
					<circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.25" />
					<circle cx="8" cy="4.5" r="0.85" fill="currentColor" />
					<path
						d="M8 7v5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.25"
						stroke-linecap="round"
					/>
				</svg>
			</button>
			<span id={`tile-${component.id}`} class="visually-hidden">{component.name}</span>
		</article>
	{/each}

	{#if filteredItems.length === 0}
		<div class="design-empty">
			<p>No components match those filters.</p>
			<button type="button" onclick={clearFilters}>Clear filters</button>
		</div>
	{/if}
</div>

<button
	type="button"
	class="design-menu-trigger"
	class:design-menu-trigger--open={menuOpen}
	aria-label={menuOpen ? 'Close menu' : 'Open menu'}
	aria-expanded={menuOpen}
	onclick={() => (menuOpen = !menuOpen)}
>
	{#if menuOpen}
		<svg viewBox="0 0 16 16" aria-hidden="true">
			<path
				d="M3 3l10 10M13 3L3 13"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
			/>
		</svg>
	{:else}
		<svg viewBox="0 0 16 16" aria-hidden="true">
			<path
				d="M2.5 4h11M2.5 8h11M2.5 12h11"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
			/>
		</svg>
	{/if}
</button>

{#if menuOpen}
	<button
		type="button"
		class="design-menu-scrim"
		aria-label="Close menu"
		onclick={() => (menuOpen = false)}
	></button>
{/if}

<aside
	class="design-menu"
	class:design-menu--open={menuOpen}
	aria-label="Component index menu"
	aria-hidden={!menuOpen}
>
	<header class="design-menu__header">
		<p class="design-menu__eyebrow">Design system</p>
		<h2>Component index</h2>
		<p class="design-menu__lede">
			{designComponentCount} components across {designComponentCategories.length} categories.
		</p>
	</header>

	<div class="design-menu__field">
		<label for="design-menu-search">Search</label>
		<div class="design-menu__search">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm9 16-4.5-4.5"
				/>
			</svg>
			<input
				id="design-menu-search"
				bind:value={query}
				type="search"
				placeholder="Name, path, prop, dependency"
			/>
			{#if query}
				<button
					type="button"
					class="design-menu__clear"
					aria-label="Clear search"
					onclick={() => (query = '')}
				>
					×
				</button>
			{/if}
		</div>
	</div>

	<div class="design-menu__field">
		<label for="design-menu-category">Category</label>
		<select id="design-menu-category" bind:value={selectedCategory}>
			<option value="all">All categories</option>
			{#each designComponentCategories as category (category.id)}
				<option value={category.id}>{category.name} ({category.components.length})</option>
			{/each}
		</select>
	</div>

	<div class="design-menu__field">
		<span>Status</span>
		<div class="design-menu__pills" role="radiogroup" aria-label="Filter by status">
			{#each allModes as mode (mode)}
				<button
					type="button"
					class="design-menu__pill"
					class:design-menu__pill--active={selectedMode === mode}
					role="radio"
					aria-checked={selectedMode === mode}
					onclick={() => (selectedMode = mode)}
				>
					<span class="design-status-dot" data-mode={mode}></span>
					{modeLabels[mode]}
				</button>
			{/each}
		</div>
	</div>

	<dl class="design-menu__stats">
		<div>
			<dt>Showing</dt>
			<dd>{visibleCount}</dd>
		</div>
		<div>
			<dt>Total</dt>
			<dd>{designComponentCount}</dd>
		</div>
	</dl>

	<nav class="design-menu__index" aria-label="Component index">
		{#if filteredCategories.length === 0}
			<p class="design-menu__empty">No components match those filters.</p>
		{:else}
			{#each filteredCategories as category (category.id)}
				<section class="design-menu__group">
					<h3 class="design-menu__group-title">
						<span>{category.name}</span>
						<span class="design-menu__group-count">{category.components.length}</span>
					</h3>
					<ul class="design-menu__links">
						{#each category.components as component (component.id)}
							<li>
								<button
									type="button"
									class="design-menu__link"
									onclick={() => scrollToComponent(component)}
								>
									<span class="design-status-dot" data-mode={component.previewMode}></span>
									<span class="design-menu__link-name">{component.name}</span>
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		{/if}
	</nav>

	<footer class="design-menu__footer">
		<p>Source: <code>src/lib/components</code></p>
		<button type="button" class="design-menu__reset" onclick={clearFilters}>Reset filters</button>
	</footer>
</aside>

{#if infoOpen}
	<button
		type="button"
		class="design-info-scrim"
		aria-label="Close component details"
		onclick={closeInfo}
	></button>
{/if}

<aside
	class="design-info"
	class:design-info--open={infoOpen}
	aria-label="Component details"
	aria-hidden={!infoOpen}
>
	{#if activeComponent}
		<div class="design-info__head">
			<div>
				<p class="design-info__eyebrow">{activeCategoryName}</p>
				<h3 id="design-info-title">{activeComponent.name}</h3>
				<span class="design-status" data-mode={activeComponent.previewMode}>
					<span class="design-status__dot"></span>
					{modeLabels[activeComponent.previewMode]}
				</span>
			</div>
			<button
				type="button"
				class="design-info__close"
				aria-label="Close component details"
				onclick={closeInfo}
			>
				<svg viewBox="0 0 16 16" aria-hidden="true">
					<path
						d="M3 3l10 10M13 3L3 13"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>

		<p class="design-info__summary">{activeComponent.summary}</p>

		<div class="design-info__path">
			<code>{activeComponent.sourcePath}</code>
		</div>

		<div class="design-info__actions">
			<button type="button" class="design-action" onclick={() => copyPath(activeComponent!)}>
				{copiedId === activeComponent.id ? 'Copied' : 'Copy path'}
			</button>
			<a class="design-action" href={sourceUrl(activeComponent)} target="_blank" rel="noopener">
				View source
			</a>
			{#if editorUrl(activeComponent)}
				<a
					class="design-action"
					href={editorUrl(activeComponent)}
					title="Open in your local editor"
				>
					Open in editor
				</a>
			{/if}
		</div>

		<div class="design-info__body">
			<section>
				<h4>What it does</h4>
				<p>{activeComponent.description}</p>
			</section>

			<section>
				<h4>Props</h4>
				{#if activeComponent.props.length === 0}
					<p class="design-info__empty">None documented.</p>
				{:else}
					<ul>
						{#each activeComponent.props as prop (prop)}
							<li><code>{prop}</code></li>
						{/each}
					</ul>
				{/if}
			</section>

			<section>
				<h4>Dependencies</h4>
				{#if activeComponent.dependencies.length === 0}
					<p class="design-info__empty">None.</p>
				{:else}
					<ul>
						{#each activeComponent.dependencies as dependency (dependency)}
							<li>{dependency}</li>
						{/each}
					</ul>
				{/if}
			</section>
		</div>
	{/if}
</aside>

<style>
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* ============ Wall ============ */

	.design-wall {
		display: grid;
		gap: 0.0625rem;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 26rem), 1fr));
		grid-auto-rows: 22rem;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 0.625rem;
		overflow: hidden;
		font-family: var(--font-sans);
	}

	.design-tile {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.75rem;
		background: #0d0e22;
		overflow: hidden;
		isolation: isolate;
		transition: background 0.15s ease;
	}

	.design-tile:hover {
		background: #11122c;
	}

	.design-tile__stage {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 100%;
		height: 100%;
		max-height: 100%;
		overflow: hidden;
	}

	.design-tile__scale {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 100%;
		font-size: 0.75rem;
	}

	.design-tile__scale :global(.design-preview) {
		width: 100%;
		max-width: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.design-tile__info {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		border: 0;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.04);
		color: rgba(225, 226, 255, 0.4);
		cursor: pointer;
		transition:
			background 0.15s ease,
			color 0.15s ease;
		z-index: 2;
	}

	.design-tile__info svg {
		width: 0.875rem;
		height: 0.875rem;
	}

	.design-tile:hover .design-tile__info {
		color: rgba(225, 226, 255, 0.75);
	}

	.design-tile__info:hover,
	.design-tile__info:focus-visible {
		background: rgba(255, 255, 255, 0.12);
		color: #f4f5ff;
		outline: none;
	}

	.design-tile__error {
		display: grid;
		gap: 0.25rem;
		text-align: center;
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		color: rgba(255, 180, 180, 0.78);
	}

	.design-tile__error-note {
		font-size: 0.6875rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(255, 180, 180, 0.5);
	}

	.design-empty {
		grid-column: 1 / -1;
		display: grid;
		place-items: center;
		gap: 0.75rem;
		padding: 4rem 2rem;
		color: rgba(225, 226, 255, 0.7);
		text-align: center;
	}

	.design-empty button {
		padding: 0.5rem 1rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.16);
		border-radius: 0.375rem;
		background: rgba(0, 0, 0, 0.25);
		color: #f4f5ff;
		cursor: pointer;
		font: inherit;
		font-size: 0.8125rem;
	}

	/* ============ Menu trigger (FAB) ============ */

	.design-menu-trigger {
		position: fixed;
		top: 1.25rem;
		right: 1.25rem;
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		padding: 0;
		border: 0.0625rem solid rgba(255, 255, 255, 0.14);
		border-radius: 9999px;
		background: rgba(20, 21, 45, 0.85);
		backdrop-filter: blur(0.75rem);
		color: #f4f5ff;
		cursor: pointer;
		z-index: 20;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;
	}

	.design-menu-trigger:hover {
		background: rgba(28, 30, 58, 0.95);
		border-color: rgba(255, 255, 255, 0.28);
	}

	.design-menu-trigger:focus-visible {
		outline: none;
		box-shadow: 0 0 0 0.1875rem rgba(106, 143, 255, 0.35);
	}

	.design-menu-trigger svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.design-menu-trigger--open {
		background: rgba(40, 42, 80, 0.95);
		border-color: rgba(255, 255, 255, 0.32);
	}

	/* ============ Menu drawer ============ */

	.design-menu-scrim {
		position: fixed;
		inset: 0;
		border: 0;
		background: rgba(8, 9, 22, 0.55);
		backdrop-filter: blur(0.125rem);
		cursor: pointer;
		z-index: 18;
		animation: scrim-in 0.2s ease;
	}

	@keyframes scrim-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.design-menu {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: min(100%, 24rem);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem 1.25rem;
		background: linear-gradient(180deg, #14152d 0%, #0d0e1f 100%);
		border-left: 0.0625rem solid rgba(255, 255, 255, 0.08);
		color: #f4f5ff;
		font-family: var(--font-sans);
		overflow-y: auto;
		transform: translateX(100%);
		transition: transform 0.25s ease;
		z-index: 19;
		visibility: hidden;
	}

	.design-menu--open {
		transform: translateX(0);
		visibility: visible;
	}

	.design-menu__header {
		padding-right: 3rem;
		display: grid;
		gap: 0.25rem;
	}

	.design-menu__eyebrow {
		margin: 0;
		color: #f2b1c9;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.design-menu__header h2 {
		margin: 0;
		font-family: 'DM Serif Text', serif;
		font-weight: 400;
		font-size: 1.625rem;
		letter-spacing: -0.01em;
	}

	.design-menu__lede {
		margin: 0.25rem 0 0;
		color: rgba(225, 226, 255, 0.62);
		font-size: 0.8125rem;
	}

	.design-menu__field {
		display: grid;
		gap: 0.4rem;
	}

	.design-menu__field > label,
	.design-menu__field > span {
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(225, 226, 255, 0.55);
	}

	.design-menu__search {
		position: relative;
		display: flex;
		align-items: center;
	}

	.design-menu__search svg {
		position: absolute;
		left: 0.75rem;
		width: 0.875rem;
		height: 0.875rem;
		color: rgba(225, 226, 255, 0.45);
		pointer-events: none;
	}

	.design-menu__search input {
		width: 100%;
		padding: 0.625rem 2rem 0.625rem 2.125rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.14);
		border-radius: 0.5rem;
		background: rgba(0, 0, 0, 0.3);
		color: #f4f5ff;
		font: inherit;
		font-size: 0.875rem;
	}

	.design-menu__search input:focus-visible {
		outline: none;
		border-color: rgba(106, 143, 255, 0.6);
		box-shadow: 0 0 0 0.1875rem rgba(106, 143, 255, 0.18);
	}

	.design-menu__search input::placeholder {
		color: rgba(225, 226, 255, 0.4);
	}

	.design-menu__search input::-webkit-search-cancel-button {
		display: none;
	}

	.design-menu__clear {
		position: absolute;
		right: 0.5rem;
		display: grid;
		place-items: center;
		width: 1.25rem;
		height: 1.25rem;
		padding: 0;
		border: 0;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.1);
		color: #f4f5ff;
		cursor: pointer;
		font-size: 0.875rem;
		line-height: 1;
	}

	.design-menu__field select {
		width: 100%;
		appearance: none;
		padding: 0.625rem 2.25rem 0.625rem 0.75rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.14);
		border-radius: 0.5rem;
		background-color: rgba(0, 0, 0, 0.3);
		background-image:
			linear-gradient(45deg, transparent 50%, currentColor 50%),
			linear-gradient(135deg, currentColor 50%, transparent 50%);
		background-position:
			calc(100% - 1rem) 50%,
			calc(100% - 0.75rem) 50%;
		background-size:
			0.3125rem 0.3125rem,
			0.3125rem 0.3125rem;
		background-repeat: no-repeat;
		color: #f4f5ff;
		cursor: pointer;
		font: inherit;
		font-size: 0.875rem;
	}

	.design-menu__field select:focus-visible {
		outline: none;
		border-color: rgba(106, 143, 255, 0.6);
	}

	.design-menu__pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.design-menu__pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.75rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.14);
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.25);
		color: rgba(225, 226, 255, 0.7);
		cursor: pointer;
		font: inherit;
		font-size: 0.75rem;
		font-weight: 500;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.design-menu__pill:hover {
		color: #f4f5ff;
		border-color: rgba(255, 255, 255, 0.24);
	}

	.design-menu__pill--active {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.32);
		color: #f4f5ff !important;
	}

	.design-status-dot {
		display: inline-block;
		width: 0.4375rem;
		height: 0.4375rem;
		border-radius: 9999px;
		background: rgba(225, 226, 255, 0.32);
	}

	.design-status-dot[data-mode='live'] {
		background: #69e8b8;
	}

	.design-status-dot[data-mode='mocked'] {
		background: #6a8fff;
	}

	.design-menu__stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin: 0;
		padding: 0.75rem 0.875rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.08);
		border-radius: 0.5rem;
		background: rgba(0, 0, 0, 0.22);
	}

	.design-menu__stats div {
		display: grid;
	}

	.design-menu__stats dt {
		margin: 0;
		color: rgba(225, 226, 255, 0.55);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.design-menu__stats dd {
		margin: 0.125rem 0 0;
		color: #f4f5ff;
		font-size: 1.25rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.design-menu__index {
		display: grid;
		gap: 1rem;
		padding-bottom: 0.5rem;
	}

	.design-menu__empty {
		margin: 0;
		color: rgba(225, 226, 255, 0.5);
		font-size: 0.8125rem;
	}

	.design-menu__group {
		display: grid;
		gap: 0.375rem;
	}

	.design-menu__group-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin: 0;
		padding: 0 0.125rem;
		color: rgba(225, 226, 255, 0.55);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.design-menu__group-count {
		color: rgba(225, 226, 255, 0.4);
		font-variant-numeric: tabular-nums;
	}

	.design-menu__links {
		display: grid;
		gap: 0.0625rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.design-menu__link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.375rem 0.5rem;
		border: 0;
		border-radius: 0.3125rem;
		background: transparent;
		color: rgba(225, 226, 255, 0.78);
		cursor: pointer;
		font: inherit;
		font-size: 0.8125rem;
		text-align: left;
		transition:
			background 0.12s ease,
			color 0.12s ease;
	}

	.design-menu__link:hover,
	.design-menu__link:focus-visible {
		background: rgba(255, 255, 255, 0.06);
		color: #f4f5ff;
		outline: none;
	}

	.design-menu__link-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.design-menu__footer {
		margin-top: auto;
		display: grid;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 0.0625rem solid rgba(255, 255, 255, 0.08);
	}

	.design-menu__footer p {
		margin: 0;
		color: rgba(225, 226, 255, 0.55);
		font-size: 0.75rem;
	}

	.design-menu__footer code {
		font-family:
			'JetBrains Mono',
			ui-monospace,
			SFMono-Regular,
			SF Mono,
			Menlo,
			Consolas,
			Liberation Mono,
			monospace;
		font-size: 0.75rem;
		color: rgba(225, 226, 255, 0.85);
	}

	.design-menu__reset {
		padding: 0.5rem 0.75rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.16);
		border-radius: 0.375rem;
		background: transparent;
		color: rgba(225, 226, 255, 0.85);
		cursor: pointer;
		font: inherit;
		font-size: 0.75rem;
	}

	.design-menu__reset:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #f4f5ff;
	}

	/* ============ Info drawer ============ */

	.design-info-scrim {
		position: fixed;
		inset: 0;
		border: 0;
		background: rgba(8, 9, 22, 0.55);
		backdrop-filter: blur(0.125rem);
		cursor: pointer;
		z-index: 22;
		animation: scrim-in 0.2s ease;
	}

	.design-info {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: min(100%, 26rem);
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		padding: 1.5rem 1.25rem;
		background: linear-gradient(180deg, #14152d 0%, #0d0e1f 100%);
		border-right: 0.0625rem solid rgba(255, 255, 255, 0.08);
		color: #f4f5ff;
		font-family: var(--font-sans);
		overflow-y: auto;
		transform: translateX(-100%);
		transition: transform 0.25s ease;
		z-index: 23;
		visibility: hidden;
	}

	.design-info--open {
		transform: translateX(0);
		visibility: visible;
	}

	.design-info__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.875rem;
	}

	.design-info__eyebrow {
		margin: 0;
		color: #f2b1c9;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.design-info__head h3 {
		margin: 0.125rem 0 0.4rem;
		font-family: 'DM Serif Text', serif;
		font-weight: 400;
		font-size: 1.625rem;
		letter-spacing: -0.01em;
	}

	.design-info__close {
		display: grid;
		place-items: center;
		width: 1.875rem;
		height: 1.875rem;
		padding: 0;
		border: 0.0625rem solid rgba(255, 255, 255, 0.14);
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.25);
		color: rgba(225, 226, 255, 0.7);
		cursor: pointer;
	}

	.design-info__close svg {
		width: 0.75rem;
		height: 0.75rem;
	}

	.design-info__close:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #f4f5ff;
	}

	.design-info__summary {
		margin: 0 0 0.875rem;
		color: rgba(225, 226, 255, 0.85);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.design-info__path {
		margin-bottom: 0.875rem;
		padding: 0.5rem 0.75rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.08);
		border-radius: 0.375rem;
		background: rgba(0, 0, 0, 0.3);
	}

	.design-info__path code {
		font-family:
			'JetBrains Mono',
			ui-monospace,
			SFMono-Regular,
			SF Mono,
			Menlo,
			Consolas,
			Liberation Mono,
			monospace;
		font-size: 0.75rem;
		color: rgba(225, 226, 255, 0.85);
		white-space: nowrap;
		overflow-x: auto;
		display: block;
	}

	.design-info__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.design-action {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.4rem 0.75rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.16);
		border-radius: 0.375rem;
		background: rgba(0, 0, 0, 0.25);
		color: #f4f5ff;
		cursor: pointer;
		font: inherit;
		font-size: 0.75rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.design-action:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.28);
	}

	.design-info__body {
		display: grid;
		gap: 1rem;
	}

	.design-info__body section {
		display: grid;
		gap: 0.4rem;
	}

	.design-info__body h4 {
		margin: 0;
		color: rgba(225, 226, 255, 0.55);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.design-info__body p {
		margin: 0;
		color: rgba(225, 226, 255, 0.85);
		font-size: 0.875rem;
		line-height: 1.55;
	}

	.design-info__body ul {
		display: grid;
		gap: 0.3rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.design-info__body li {
		font-size: 0.8125rem;
		color: rgba(225, 226, 255, 0.85);
	}

	.design-info__body code {
		font-family:
			'JetBrains Mono',
			ui-monospace,
			SFMono-Regular,
			SF Mono,
			Menlo,
			Consolas,
			Liberation Mono,
			monospace;
		font-size: 0.75rem;
		color: #f4f5ff;
		background: rgba(0, 0, 0, 0.3);
		padding: 0.0625rem 0.375rem;
		border-radius: 0.25rem;
	}

	.design-info__empty {
		color: rgba(225, 226, 255, 0.4) !important;
		font-style: italic;
	}

	/* Status indicator (reused inside dialog) */
	.design-status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: rgba(225, 226, 255, 0.8);
	}

	.design-status__dot {
		display: inline-block;
		width: 0.4375rem;
		height: 0.4375rem;
		border-radius: 9999px;
		background: rgba(225, 226, 255, 0.32);
	}

	.design-status[data-mode='live'] .design-status__dot {
		background: #69e8b8;
	}

	.design-status[data-mode='mocked'] .design-status__dot {
		background: #6a8fff;
	}
</style>
