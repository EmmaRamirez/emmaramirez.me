<script lang="ts">
	import ArticleReaderPanel from '$lib/components/ArticleReaderPanel.svelte';
	import ProjectReaderPanel from '$lib/components/ProjectReaderPanel.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import DebugMenu from '$lib/components/DebugMenu.svelte';
	import MainGrid from '$lib/components/MainGrid.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { showSections } from '$lib/stores';
	import {
		openArticleReader,
		closeArticleReader,
		openProjectReader,
		closeProjectReader,
		getArticleOpen,
		getProjectOpen,
		getSelectedArticleId,
		getSelectedProjectId,
		getAnyPanelOpen,
		setSelectedArticleId,
		setSelectedProjectId
	} from '$lib/stores/readerPanelStore.svelte';
	import { hero3dParams } from '$lib/stores/hero3dParams.svelte';
	import type { Article } from '$lib/articles';
	import { defaultArticles } from '$lib/articles';
	import {
		getDisco,
		projectRegistry,
		seededShuffle,
		type ProjectId,
		type ProjectRegistryEntry
	} from '$lib/registry/homepage';
	import type { GridItem } from '$lib/types/homepage';
	import { onMount } from 'svelte';

	let debugMenuOpen = $state(false);
	let headerBlendMode = $state('difference');
	let showSectionsEnabled = $state(false);

	function handleGlobalKeydown(event: KeyboardEvent) {
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}
		if (event.key === 'd' || event.key === 'D') {
			debugMenuOpen = !debugMenuOpen;
		}
	}

	const homepageArticles: Article[] = defaultArticles.slice(0, 5);

	const homepageProjects: ProjectRegistryEntry[] = Object.values(projectRegistry)
		.toSorted(
			(a, b) => Number.parseInt(b.year ?? '0', 10) - Number.parseInt(a.year ?? '0', 10)
		)
		.slice(0, 5);

	const disco = getDisco();

	const gridItems = $derived<GridItem[]>(
		seededShuffle<GridItem>(
			[
				{ kind: 'disco' as const },
				{ kind: 'home' as const },
				{ kind: 'pokemon' as const },
				{ kind: 'top-languages' as const },
				{ kind: 'city' as const },
				...homepageArticles.map((article) => ({ kind: 'article' as const, article })),
				...homepageProjects.map((project) => ({ kind: 'project' as const, project })),
				{ kind: 'design-system' as const }
			],
			101
		)
	);

	const articleReaderPanelOpen = $derived(getArticleOpen());
	const projectReaderPanelOpen = $derived(getProjectOpen());
	const selectedArticleId = $derived(getSelectedArticleId());
	const selectedProjectId = $derived(getSelectedProjectId());
	const anyPanelOpen = $derived(getAnyPanelOpen());

	onMount(() => {
		const unsubscribeShowSections = showSections.subscribe((value) => {
			showSectionsEnabled = value;
		});

		const handleNavigateArticle = (event: CustomEvent<{ id: string }>) => {
			setSelectedArticleId(event.detail.id);
		};

		const handleNavigateProject = (event: CustomEvent<{ id: ProjectId }>) => {
			setSelectedProjectId(event.detail.id);
		};

		document.addEventListener('navigatearticle', handleNavigateArticle as EventListener);
		document.addEventListener('navigateproject', handleNavigateProject as EventListener);

		return () => {
			unsubscribeShowSections();
			document.removeEventListener('navigatearticle', handleNavigateArticle as EventListener);
			document.removeEventListener('navigateproject', handleNavigateProject as EventListener);
		};
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
			<a
				href="https://github.com/emzinnia"
				target="_blank"
				rel="noopener noreferrer"
				class="style-none ml-2 inline-flex items-center justify-center px-2 py-1.5 text-(--text-secondary) transition-colors hover:text-(--text-primary) md:ml-3 md:px-3 md:py-2"
				aria-label="GitHub profile"
			>
				<svg class="h-[1.1rem] w-[1.1rem]" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="currentColor"/></svg>
			</a>
			<ThemeToggle class="ml-1 md:ml-2" />
		</HeaderNav>
	</Header>

	<div
		class="main-content mx-auto max-w-6xl space-y-12 px-4 py-16"
		class:panel-open={anyPanelOpen}
	>
		<Hero 
			blendMode={headerBlendMode}
			depthScale={hero3dParams.depthScale}
			revealRadius={hero3dParams.revealRadius}
			parallaxXY={hero3dParams.parallaxXY}
			parallaxZ={hero3dParams.parallaxZ}
			splatStretch={hero3dParams.splatStretch}
			splatCompress={hero3dParams.splatCompress}
			depthBulge={hero3dParams.depthBulge}
			contourOffset={hero3dParams.contourOffset}
			blobAmplitude={hero3dParams.blobAmplitude}
			noiseAmplitude={hero3dParams.noiseAmplitude}
			contourInfluence={hero3dParams.contourInfluence}
			edgeSoftness={hero3dParams.edgeSoftness}
			saturationBoost={hero3dParams.saturationBoost}
			contrastBoost={hero3dParams.contrastBoost}
		/>

		{#if showSectionsEnabled}
			<MainGrid
				items={gridItems}
				{disco}
				{selectedArticleId}
				{selectedProjectId}
				articlePanelOpen={articleReaderPanelOpen}
				projectPanelOpen={projectReaderPanelOpen}
				onArticleClick={openArticleReader}
				onProjectClick={openProjectReader}
			/>
		{/if}
	</div>

	<ArticleReaderPanel
		open={articleReaderPanelOpen}
		articleId={selectedArticleId}
		onclose={closeArticleReader}
	/>

	<ProjectReaderPanel
		open={projectReaderPanelOpen}
		projectId={selectedProjectId}
		onclose={closeProjectReader}
	/>

	<DebugMenu
		open={debugMenuOpen}
		onclose={() => (debugMenuOpen = false)}
		bind:headerBlendMode
	/>
</section>

<style>
	/* Page container - prevent horizontal scroll when panel is open */
	.page-container.panel-open {
		overflow-x: hidden;
	}

	/* Main content push animation */
	.main-content {
		transition:
			transform 0.35s cubic-bezier(0.32, 0.72, 0, 1),
			width 0.35s cubic-bezier(0.32, 0.72, 0, 1);
		will-change: transform, width;
	}

	.main-content.panel-open {
		transform: translateX(42%);
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		/* Full screen panel on mobile - no push */
		.main-content.panel-open {
			transform: none;
		}
	}

	@media (min-width: 1400px) {
		.main-content.panel-open {
			transform: translateX(38%);
		}
	}
</style>
