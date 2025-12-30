<script lang="ts">
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import HomeBlock from '$lib/components/HomeBlock.svelte';
	import PokemonBlock from '$lib/components/PokemonBlock.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import ArticleReaderPanel from '$lib/components/ArticleReaderPanel.svelte';
	import ProjectReaderPanel from '$lib/components/ProjectReaderPanel.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle, Modal, Select, Switch } from '$lib/components/ui';
	import { showSections } from '$lib/stores';
	import type { Article } from '$lib/articles';
	import { getHomepageItems, getProject, getArticle, getDisco, type ProjectId } from '$lib/registry/homepage';
	import { pokemonTeam } from '$lib/website.config';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let debugMenuOpen = $state(false);
	let headerBlendMode = $state('difference');
	let showSectionsEnabled = $state(false);
	let storeInitialized = false;

	// Sync local state changes back to store
	$effect(() => {
		if (storeInitialized) {
			showSections.set(showSectionsEnabled);
		}
	});

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

	function handleGlobalKeydown(event: KeyboardEvent) {
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}
		if (event.key === 'd' || event.key === 'D') {
			debugMenuOpen = !debugMenuOpen;
		}
	}

	const homepageItems = getHomepageItems();

	const homepageArticles: Article[] = homepageItems
		.filter((item) => item.kind === 'article')
		.map((item) => getArticle(item.article.id)!)
		.slice(0, 10);

	const homepageProjects = homepageItems
		.filter((item) => item.kind === 'project')
		.map((item) => getProject(item.id));

	const disco = getDisco();

	const ESSAYS_LIMIT = 5;
	let essaysExpanded = $state(false);
	const visibleArticles = $derived(
		essaysExpanded ? homepageArticles : homepageArticles.slice(0, ESSAYS_LIMIT)
	);
	const hasMoreArticles = homepageArticles.length > ESSAYS_LIMIT;

	// Article reader panel state
	let articleReaderPanelOpen = $state(false);
	let selectedArticleId = $state<string | null>(null);

	function openArticleReader(articleId: string) {
		// Close project panel if open
		if (projectReaderPanelOpen) {
			closeProjectReader();
		}
		selectedArticleId = articleId;
		articleReaderPanelOpen = true;
	}

	function closeArticleReader() {
		articleReaderPanelOpen = false;
		setTimeout(() => {
			if (!articleReaderPanelOpen) {
				selectedArticleId = null;
			}
		}, 300);
	}

	// Project reader panel state
	let projectReaderPanelOpen = $state(false);
	let selectedProjectId = $state<ProjectId | null>(null);

	function openProjectReader(projectId: ProjectId) {
		// Close article panel if open
		if (articleReaderPanelOpen) {
			closeArticleReader();
		}
		selectedProjectId = projectId;
		projectReaderPanelOpen = true;
	}

	function closeProjectReader() {
		projectReaderPanelOpen = false;
		setTimeout(() => {
			if (!projectReaderPanelOpen) {
				selectedProjectId = null;
			}
		}, 300);
	}

	// Derived state for any panel being open
	const anyPanelOpen = $derived(articleReaderPanelOpen || projectReaderPanelOpen);

	onMount(() => {
		const unsubscribeShowSections = showSections.subscribe((value) => {
			showSectionsEnabled = value;
			storeInitialized = true;
		});

		const handleNavigateArticle = (event: CustomEvent<{ id: string }>) => {
			selectedArticleId = event.detail.id;
		};

		const handleNavigateProject = (event: CustomEvent<{ id: ProjectId }>) => {
			selectedProjectId = event.detail.id;
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
		<Hero blendMode={headerBlendMode} />

		{#if showSectionsEnabled}
			<section aria-label="Essays" class="space-y-6">
				<ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each visibleArticles as article (article.id)}
						<li>
							<button
								type="button"
								onclick={() => openArticleReader(article.id)}
								class="article-card style-none -m-4 flex w-full flex-col gap-2 rounded-lg p-4 text-left transition-all duration-200 hover:bg-(--surface-hover) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
								class:article-card-active={selectedArticleId === article.id && articleReaderPanelOpen}
							>
								<span class="text-lg leading-snug font-semibold text-(--text-primary)">
									{article.title}
								</span>
								{#if article.date}
									<span class="text-sm text-(--text-secondary)">
										{article.date}
									</span>
								{/if}
								<p class="line-clamp-3 text-base leading-relaxed text-(--text-muted)">
									{article.content}
								</p>
							</button>
						</li>
					{/each}
				</ul>
				{#if hasMoreArticles}
					<button
						onclick={() => (essaysExpanded = !essaysExpanded)}
						class="cursor-pointer text-base text-(--text-secondary) transition-colors hover:text-(--text-primary) hover:underline"
					>
						{essaysExpanded ? '← Show less' : `Show all ${homepageArticles.length} essays →`}
					</button>
				{/if}
			</section>
		{/if}

		{#if showSectionsEnabled}
			<section aria-label="Selected projects" class="space-y-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each homepageProjects as project (project.id)}
						<button
							type="button"
							onclick={() => openProjectReader(project.id)}
							class="project-card style-none text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
							class:project-card-active={selectedProjectId === project.id && projectReaderPanelOpen}
						>
							<ProjectBlock
								title={project.title}
								pill={project.pill}
								class={project.class}
								contentClassName={project.contentClassName}
							>
								{#snippet description()}
									{project.description}
								{/snippet}
							</ProjectBlock>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		<section aria-label="Miscellaneous" class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
				<DiscoBlock
					image={disco.image}
					alt={disco.alt}
					caption={disco.caption}
					class={disco.class ?? 'h-full w-full'}
				/>
				<HomeBlock class="md:row-span-2" />
				{#if dev}
					<PokemonBlock team={pokemonTeam} />
				{/if}
			</div>
		</section>
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

	<Modal
		open={debugMenuOpen}
		onclose={() => (debugMenuOpen = false)}
		title="🔧 Super Secret Debug Menu"
		size="sm"
	>
		<div class="space-y-4">
			<Select
				label="Header Image Blend Mode"
				bind:value={headerBlendMode}
				options={blendModeOptions}
			/>
			<Switch
				label="Show Essays & Projects"
				description="Toggle visibility of Essays and Projects sections"
				bind:checked={showSectionsEnabled}
			/>
			<p class="text-xs text-(--liver-brown-600) italic">Press D to toggle this menu</p>
		</div>
	</Modal>
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

	/* Article card styles */
	.article-card {
		cursor: pointer;
		border: 1px solid var(--border-color);
		background: var(--surface);
	}

	.article-card-active {
		background: var(--surface-hover);
		border-color: var(--border-color);
	}

	/* Project card styles */
	.project-card {
		cursor: pointer;
		border-radius: 0.5rem;
	}

	.project-card:hover :global(.project-block-content) {
		background: var(--surface-hover);
	}

	.project-card-active :global(.project-block-content) {
		background: var(--surface-hover);
		border-color: var(--text-muted);
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
