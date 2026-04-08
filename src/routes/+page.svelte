<script lang="ts">
	import { ArticleReaderPanel, Omnibar, ProjectReaderPanel } from '$lib/components/panels';
	import { DebugMenu } from '$lib/components/dev';
	import { MainGrid } from '$lib/components/grids';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { showSections } from '$lib/stores';
	import { dev } from '$app/environment';
	import {
		openArticleReader,
		closeArticleReader,
		openProjectReader,
		closeProjectReader,
		getArticleOpen,
		getProjectOpen,
		getSelectedArticleSlug,
		getSelectedProjectId,
		getAnyPanelOpen
	} from '$lib/stores/readerPanelStore.svelte';
	import { getDisco } from '$lib/registry/homepage';
	import { buildHomepageGridItems } from '$lib/registry/gridItems';
	import { onMount } from 'svelte';

	let debugMenuOpen = $state(false);
	let headerBlendMode = $state('difference');
	let showSectionsEnabled = $state(false);
	let designSystemBrowserOpen = $state(false);
	let apiExplorerOpen = $state(false);
	let omnibarOpen = $state(false);

	function openDesignSystemBrowser() {
		designSystemBrowserOpen = true;
	}

	function closeDesignSystemBrowser() {
		designSystemBrowserOpen = false;
	}

	function openApiExplorer() {
		apiExplorerOpen = true;
	}

	function closeApiExplorer() {
		apiExplorerOpen = false;
	}

	function handleGlobalKeydown(event: KeyboardEvent) {
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}
		if (event.key === 'd' || event.key === 'D') {
			debugMenuOpen = !debugMenuOpen;
		}
	}

	const disco = getDisco();

	const gridItems = buildHomepageGridItems({ includeApiExplorer: true });

	const articleReaderPanelOpen = $derived(getArticleOpen());
	const projectReaderPanelOpen = $derived(getProjectOpen());
	const selectedArticleSlug = $derived(getSelectedArticleSlug());
	const selectedProjectId = $derived(getSelectedProjectId());
	const anyPanelOpen = $derived(getAnyPanelOpen());

	onMount(() => {
		return showSections.subscribe((value) => {
			showSectionsEnabled = value;
		});
	});
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<section class="page-container relative min-h-screen w-full" class:panel-open={anyPanelOpen}>
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/" active class="text-(--text-primary)">Home</HeaderNavItem>
			{#if showSectionsEnabled}
				<HeaderNavItem href="/blog">Essays</HeaderNavItem>
				<HeaderNavItem href="/about">About</HeaderNavItem>
			{/if}
			{#if dev}
				<HeaderNavItem href="/editor">Editor</HeaderNavItem>
			{/if}
			<button
				type="button"
				onclick={() => (omnibarOpen = true)}
				class="search-trigger ml-2 flex items-center gap-2 rounded-lg border border-(--border-color) bg-(--surface) px-2.5 py-1.5 text-sm text-(--text-muted) transition-all hover:border-(--text-muted) hover:text-(--text-primary) md:ml-3"
				aria-label="Open search"
			>
				<svg
					width="14"
					height="14"
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
				<span class="hidden sm:inline">Search</span>
				<kbd
					class="hidden rounded bg-(--page-bg) px-1.5 py-0.5 font-mono text-[0.65rem] text-(--text-muted) sm:inline"
					>⌘K</kbd
				>
			</button>
			<a
				href="https://github.com/emzinnia"
				target="_blank"
				rel="noopener noreferrer"
				class="style-none ml-2 inline-flex items-center justify-center px-2 py-1.5 text-(--text-secondary) transition-colors hover:text-(--text-primary) md:ml-3 md:px-3 md:py-2"
				aria-label="GitHub profile"
			>
				<svg class="h-[1.1rem] w-[1.1rem]" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
						fill="currentColor"
					/></svg
				>
			</a>
			<ThemeToggle class="ml-1 md:ml-2" />
		</HeaderNav>
	</Header>

	<div class="main-content mx-auto max-w-6xl space-y-12 px-4 py-16">
		{#if showSectionsEnabled}
			<MainGrid
				items={gridItems}
				{disco}
				designSystemOpen={designSystemBrowserOpen}
				{apiExplorerOpen}
				onArticleClick={openArticleReader}
				onProjectClick={openProjectReader}
				onDesignSystemClick={openDesignSystemBrowser}
				onDesignSystemClose={closeDesignSystemBrowser}
				onApiExplorerOpen={openApiExplorer}
				onApiExplorerClose={closeApiExplorer}
			/>
		{/if}
	</div>

	<ArticleReaderPanel
		open={articleReaderPanelOpen}
		articleSlug={selectedArticleSlug}
		onclose={closeArticleReader}
		onnavigate={openArticleReader}
	/>

	<ProjectReaderPanel
		open={projectReaderPanelOpen}
		projectId={selectedProjectId}
		onclose={closeProjectReader}
		onnavigate={openProjectReader}
	/>

	<DebugMenu open={debugMenuOpen} onclose={() => (debugMenuOpen = false)} bind:headerBlendMode />

	<Omnibar
		bind:open={omnibarOpen}
		items={gridItems}
		onArticleSelect={openArticleReader}
		onProjectSelect={openProjectReader}
		onItemSelect={(item) => {
			if (item.kind === 'design-system') {
				openDesignSystemBrowser();
			}
			if (item.kind === 'api-explorer') {
				openApiExplorer();
			}
		}}
	/>
</section>

<style>
	.page-container.panel-open {
		overflow-x: hidden;
	}
</style>
