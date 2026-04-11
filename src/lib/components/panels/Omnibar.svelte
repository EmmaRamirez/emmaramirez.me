<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { tick } from 'svelte';
	import type { GridItem } from '$lib/types/homepage';
	import type { ProjectId } from '$lib/registry/homepage';

	type SearchableItem = {
		id: string;
		kind: GridItem['kind'];
		label: string;
		description?: string;
		tags?: string[];
		icon: 'article' | 'project' | 'feature' | 'page';
		date?: string;
	};

	interface Props {
		open?: boolean;
		items: GridItem[];
		onclose?: () => void;
		onArticleSelect?: (articleSlug: string) => void;
		onProjectSelect?: (projectId: ProjectId) => void;
		onItemSelect?: (item: GridItem) => void;
	}

	let {
		open = $bindable(false),
		items,
		onclose,
		onArticleSelect,
		onProjectSelect,
		onItemSelect
	}: Props = $props();

	let query = $state('');
	let highlightedIndex = $state(0);
	let inputRef: HTMLInputElement | undefined = $state();
	let dialogRef: HTMLDivElement | undefined = $state();
	let resultsRef: HTMLDivElement | undefined = $state();

	// Generate unique IDs for ARIA
	const listboxId = 'omnibar-listbox';
	const getOptionId = (index: number) => `omnibar-option-${index}`;

	// Convert grid items to searchable format
	const searchableItems = $derived.by(() => {
		const result: SearchableItem[] = [];

		for (const item of items) {
			if (item.kind === 'article') {
				result.push({
					id: `article-${item.article.slug}`,
					kind: 'article',
					label: item.article.title,
					description: item.article.content,
					tags: item.article.tags,
					icon: 'article',
					date: item.article.date
				});
			} else if (item.kind === 'project') {
				result.push({
					id: `project-${item.project.id}`,
					kind: 'project',
					label: item.project.title,
					description: item.project.description,
					tags: item.project.technologies,
					icon: 'project'
				});
			} else if (item.kind === 'hero') {
				result.push({
					id: 'hero',
					kind: 'hero',
					label: 'Hero Section',
					description: 'Welcome introduction',
					icon: 'feature'
				});
			} else if (item.kind === 'disco') {
				result.push({
					id: 'disco',
					kind: 'disco',
					label: 'Disco Block',
					description: 'Interactive light effect',
					icon: 'feature'
				});
			} else if (item.kind === 'home') {
				result.push({
					id: 'home',
					kind: 'home',
					label: 'Home Block',
					description: 'Seattle skyline',
					icon: 'feature'
				});
			} else if (item.kind === 'design-system') {
				result.push({
					id: 'design-system',
					kind: 'design-system',
					label: 'Design System',
					description: 'Explore the EMZINNIA design system',
					icon: 'feature'
				});
			} else if (item.kind === 'city') {
				result.push({
					id: 'city',
					kind: 'city',
					label: 'City Card',
					description: 'Location showcase',
					icon: 'feature'
				});
			} else if (item.kind === 'pokemon') {
				result.push({
					id: 'pokemon',
					kind: 'pokemon',
					label: 'Pokémon Team',
					description: 'My favorite Pokémon',
					icon: 'feature'
				});
			} else if (item.kind === 'this-site') {
				result.push({
					id: 'this-site',
					kind: 'this-site',
					label: 'This Site',
					description: 'How this homepage is built',
					icon: 'feature'
				});
			} else if (item.kind === 'top-languages') {
				result.push({
					id: 'top-languages',
					kind: 'top-languages',
					label: 'Top Languages',
					description: 'Programming languages I use',
					icon: 'feature'
				});
			}
		}

		// Add page navigation items
		result.push(
			{
				id: 'page-home',
				kind: 'hero',
				label: 'Go to Home',
				description: 'Navigate to homepage',
				icon: 'page'
			},
			{
				id: 'page-blog',
				kind: 'hero',
				label: 'Go to Blog',
				description: 'Browse all essays',
				icon: 'page'
			},
			{
				id: 'page-about',
				kind: 'hero',
				label: 'Go to About',
				description: 'Learn more about me',
				icon: 'page'
			}
		);

		return result;
	});

	const filteredItems = $derived(
		searchableItems.filter((item: SearchableItem) => {
			const q = query.toLowerCase();
			if (!q) return true;

			return (
				item.label.toLowerCase().includes(q) ||
				item.description?.toLowerCase().includes(q) ||
				item.tags?.some((tag: string) => tag.toLowerCase().includes(q)) ||
				item.kind.toLowerCase().includes(q)
			);
		})
	);

	// Derived: currently highlighted item ID for aria-activedescendant
	const activeDescendantId = $derived(
		filteredItems.length > 0 ? getOptionId(highlightedIndex) : undefined
	);

	// Live region announcement text for screen readers
	const announcement = $derived.by(() => {
		if (!query) return '';
		const count = filteredItems.length;
		return count === 0 ? 'No results found' : `${count} result${count === 1 ? '' : 's'} found`;
	});

	const groupedItems = $derived.by(() => {
		const groups: Record<string, SearchableItem[]> = {};

		for (const item of filteredItems) {
			let group: string;
			if (item.icon === 'page') {
				group = 'Navigation';
			} else if (item.icon === 'article') {
				group = 'Articles';
			} else if (item.icon === 'project') {
				group = 'Projects';
			} else {
				group = 'Features';
			}

			if (!groups[group]) groups[group] = [];
			groups[group].push(item);
		}

		// Order groups
		const orderedGroups: Record<string, SearchableItem[]> = {};
		const order = ['Navigation', 'Articles', 'Projects', 'Features'];
		for (const key of order) {
			if (groups[key]) orderedGroups[key] = groups[key];
		}

		return orderedGroups;
	});

	function close() {
		open = false;
		query = '';
		highlightedIndex = 0;
		onclose?.();
	}

	function selectItem(item: SearchableItem) {
		// Handle navigation pages
		if (item.id === 'page-home') {
			window.location.href = '/';
			close();
			return;
		}
		if (item.id === 'page-blog') {
			window.location.href = '/blog';
			close();
			return;
		}
		if (item.id === 'page-about') {
			window.location.href = '/about';
			close();
			return;
		}

		// Handle grid items
		if (item.kind === 'article') {
			const articleSlug = item.id.replace('article-', '');
			onArticleSelect?.(articleSlug);
		} else if (item.kind === 'project') {
			const projectId = item.id.replace('project-', '') as ProjectId;
			onProjectSelect?.(projectId);
		} else {
			// For other items, scroll to them or trigger their action
			const gridItem = items.find((i) => {
				if (i.kind === item.kind) return true;
				return false;
			});
			if (gridItem) {
				onItemSelect?.(gridItem);
			}
		}

		close();
	}

	async function handleKeydown(e: KeyboardEvent) {
		// Navigation: Ctrl+j/k or Ctrl+n/p (vim/emacs style) - works while typing
		// Also supports arrow keys as fallback
		const isNavDown = e.key === 'ArrowDown' || (e.ctrlKey && (e.key === 'j' || e.key === 'n'));
		const isNavUp = e.key === 'ArrowUp' || (e.ctrlKey && (e.key === 'k' || e.key === 'p'));
		const isNavFirst = e.ctrlKey && e.key === 'g';
		const isNavLast = e.ctrlKey && e.shiftKey && e.key === 'G';

		if (isNavDown) {
			e.preventDefault();
			highlightedIndex = Math.min(highlightedIndex + 1, filteredItems.length - 1);
			await scrollHighlightedIntoView();
		} else if (isNavUp) {
			e.preventDefault();
			highlightedIndex = Math.max(highlightedIndex - 1, 0);
			await scrollHighlightedIntoView();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filteredItems[highlightedIndex]) {
				selectItem(filteredItems[highlightedIndex]);
			}
		} else if (e.key === 'Escape') {
			close();
		} else if (isNavFirst || e.key === 'Home') {
			e.preventDefault();
			highlightedIndex = 0;
			await scrollHighlightedIntoView();
		} else if (isNavLast || e.key === 'End') {
			e.preventDefault();
			highlightedIndex = filteredItems.length - 1;
			await scrollHighlightedIntoView();
		}
	}

	async function scrollHighlightedIntoView() {
		await tick();
		const optionEl = document.getElementById(getOptionId(highlightedIndex));
		optionEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}

	function handleDialogKeydown(e: KeyboardEvent) {
		// Focus trap: prevent focus from leaving the dialog
		if (e.key === 'Tab') {
			const focusableElements = dialogRef?.querySelectorAll<HTMLElement>(
				'input, button, [tabindex]:not([tabindex="-1"])'
			);
			if (!focusableElements || focusableElements.length === 0) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				// Shift+Tab: if on first element, go to last
				if (document.activeElement === firstElement) {
					e.preventDefault();
					lastElement.focus();
				}
			} else {
				// Tab: if on last element, go to first
				if (document.activeElement === lastElement) {
					e.preventDefault();
					firstElement.focus();
				}
			}
		}
	}

	function handleGlobalKeydown(e: KeyboardEvent) {
		// Cmd+K on Mac, Alt+K on Windows/Linux
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
		const modifier = isMac ? e.metaKey : e.altKey;

		if (modifier && e.key === 'k') {
			e.preventDefault();
			open = !open;
		}
	}

	$effect(() => {
		if (open) {
			highlightedIndex = 0;
			setTimeout(() => inputRef?.focus(), 10);
		}
	});

	// Reset highlight when query changes
	$effect(() => {
		void query;
		highlightedIndex = 0;
	});
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

{#if open}
	<div
		class="omnibar-backdrop"
		transition:fade={{ duration: 200 }}
		onclick={close}
		role="presentation"
	></div>

	<div
		bind:this={dialogRef}
		class="omnibar"
		transition:fly={{ y: -20, duration: 250, easing: cubicOut }}
		role="dialog"
		aria-modal="true"
		aria-label="Quick search"
		tabindex="-1"
		onkeydown={handleDialogKeydown}
	>
		<header class="omnibar__header">
			<div class="omnibar__search-icon" aria-hidden="true">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
			</div>
			<input
				bind:this={inputRef}
				type="text"
				class="omnibar__input"
				placeholder="Search articles, projects, pages..."
				bind:value={query}
				onkeydown={handleKeydown}
				role="combobox"
				aria-label="Search"
				aria-expanded={filteredItems.length > 0}
				aria-controls={listboxId}
				aria-activedescendant={activeDescendantId}
				aria-autocomplete="list"
				autocomplete="off"
				autocorrect="off"
				autocapitalize="off"
				spellcheck="false"
			/>
			<button type="button" class="omnibar__close-btn" onclick={close} aria-label="Close search">
				<kbd>Esc</kbd>
			</button>
		</header>

		<!-- Live region for screen reader announcements -->
		<div class="sr-only" aria-live="polite" aria-atomic="true">
			{announcement}
		</div>

		<div
			bind:this={resultsRef}
			class="omnibar__results"
			id={listboxId}
			role="listbox"
			aria-label="Search results"
		>
			{#if filteredItems.length === 0}
				<div class="omnibar__empty" role="status">
					<p>No results found for "{query}"</p>
				</div>
			{:else}
				{#each Object.entries(groupedItems) as [group, groupItems] (group)}
					<div class="omnibar__group" role="group" aria-labelledby="group-{group}">
						<h3 class="omnibar__group-title" id="group-{group}">{group}</h3>
						{#each groupItems as item (item.id)}
							{@const globalIndex = filteredItems.findIndex(
								(i: SearchableItem) => i.id === item.id
							)}
							<div
								id={getOptionId(globalIndex)}
								class="omnibar__item"
								class:omnibar__item--active={globalIndex === highlightedIndex}
								role="option"
								aria-selected={globalIndex === highlightedIndex}
								tabindex="-1"
								onclick={() => selectItem(item)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										selectItem(item);
									}
								}}
								onmouseenter={() => (highlightedIndex = globalIndex)}
							>
								<span class="omnibar__item-icon" aria-hidden="true">
									{#if item.icon === 'article'}
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
											<polyline points="14 2 14 8 20 8" />
											<line x1="16" y1="13" x2="8" y2="13" />
											<line x1="16" y1="17" x2="8" y2="17" />
											<line x1="10" y1="9" x2="8" y2="9" />
										</svg>
									{:else if item.icon === 'project'}
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
										</svg>
									{:else if item.icon === 'feature'}
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
											<line x1="3" y1="9" x2="21" y2="9" />
											<line x1="9" y1="21" x2="9" y2="9" />
										</svg>
									{:else}
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<circle cx="12" cy="12" r="10" />
											<polygon points="10 8 16 12 10 16 10 8" />
										</svg>
									{/if}
								</span>
								<div class="omnibar__item-content">
									<span class="omnibar__item-label">{item.label}</span>
									{#if item.description}
										<span class="omnibar__item-description">{item.description}</span>
									{/if}
								</div>
								{#if item.tags && item.tags.length > 0}
									<div class="omnibar__item-tags" aria-hidden="true">
										{#each item.tags.slice(0, 2) as tag (tag)}
											<span class="omnibar__tag">{tag}</span>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			{/if}
		</div>

		<footer class="omnibar__footer">
			<div class="omnibar__hint">
				<kbd>^j</kbd><kbd>^k</kbd>
				<span>navigate</span>
			</div>
			<div class="omnibar__hint">
				<kbd>↵</kbd>
				<span>select</span>
			</div>
			<div class="omnibar__hint">
				<kbd>esc</kbd>
				<span>close</span>
			</div>
			<div class="omnibar__hint omnibar__hint--right">
				<kbd>⌘K</kbd>
				<span>toggle</span>
			</div>
		</footer>
	</div>
{/if}

<style>
	.omnibar-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(0.25rem);
		z-index: 200;
	}

	.omnibar {
		position: fixed;
		top: 12%;
		left: 50%;
		transform: translateX(-50%);
		width: min(37.5rem, 90vw);
		max-height: 70vh;
		background: var(--page-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 1rem;
		box-shadow:
			0 1.5625rem 3.75rem -0.75rem rgba(0, 0, 0, 0.35),
			0 0 0 0.0625rem var(--border-color);
		z-index: 201;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.omnibar__header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-bottom: 0.0625rem solid var(--border-color);
		background: var(--page-bg-subtle);
	}

	.omnibar__search-icon {
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.omnibar__input {
		flex: 1;
		background: transparent;
		border: none;
		font-size: 1rem;
		color: var(--text-primary);
		outline: none;
	}

	.omnibar__input::placeholder {
		color: var(--text-muted);
	}

	.omnibar__close-btn {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.omnibar__close-btn kbd {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.5rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--text-muted);
		background: var(--surface);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.375rem;
		transition:
			background 0.1s ease,
			border-color 0.1s ease;
	}

	.omnibar__close-btn:hover kbd,
	.omnibar__close-btn:focus-visible kbd {
		background: var(--surface-hover);
		border-color: var(--text-muted);
	}

	.omnibar__close-btn:focus-visible {
		outline: none;
	}

	.omnibar__close-btn:focus-visible kbd {
		outline: 0.125rem solid var(--accent-primary);
		outline-offset: 0.125rem;
	}

	.omnibar__results {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.omnibar__empty {
		padding: 3rem 1.25rem;
		text-align: center;
		color: var(--text-muted);
	}

	.omnibar__group {
		margin-bottom: 1rem;
	}

	.omnibar__group:last-child {
		margin-bottom: 0;
	}

	.omnibar__group-title {
		padding: 0.5rem 0.75rem 0.25rem;
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.omnibar__item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: none;
		background: transparent;
		border-radius: 0.625rem;
		cursor: pointer;
		text-align: left;
		transition: background 0.1s ease;
	}

	.omnibar__item:hover,
	.omnibar__item--active {
		background: var(--surface-hover);
	}

	.omnibar__item--active {
		background: var(--accent-primary);
	}

	.omnibar__item-icon {
		flex-shrink: 0;
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--surface);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
		color: var(--text-secondary);
	}

	.omnibar__item--active .omnibar__item-icon {
		background: var(--page-bg);
		border-color: var(--border-color);
	}

	.omnibar__item-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.omnibar__item-label {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.omnibar__item-description {
		font-size: 0.75rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.omnibar__item-tags {
		display: none;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	@media (min-width: 30rem) {
		.omnibar__item-tags {
			display: flex;
		}
	}

	.omnibar__tag {
		font-size: 0.6rem;
		font-family: 'JetBrains Mono', monospace;
		padding: 0.125rem 0.375rem;
		background: var(--surface);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.25rem;
		color: var(--text-muted);
		text-transform: lowercase;
	}

	.omnibar__footer {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.625rem 1rem;
		border-top: 0.0625rem solid var(--border-color);
		background: var(--page-bg-subtle);
	}

	.omnibar__hint {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.7rem;
		color: var(--text-muted);
	}

	.omnibar__hint--right {
		margin-left: auto;
	}

	.omnibar__hint kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.375rem;
		padding: 0.125rem 0.375rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		background: var(--surface);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.25rem;
	}

	/* Screen reader only class */
	.sr-only {
		position: absolute;
		width: 0.0625rem;
		height: 0.0625rem;
		padding: 0;
		margin: -0.0625rem;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Focus styles for keyboard navigation */
	.omnibar__item:focus-visible {
		outline: 0.125rem solid var(--accent-primary);
		outline-offset: -0.125rem;
	}
</style>
