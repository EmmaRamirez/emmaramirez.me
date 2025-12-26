<script lang="ts">
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import HomeBlock from '$lib/components/HomeBlock.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import ArticleReaderPanel from '$lib/components/ArticleReaderPanel.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle, Modal, Select, Switch } from '$lib/components/ui';
	import { showSections } from '$lib/stores';
	import type { Article } from '$lib/articles';
	import { getHomepageItems, getProject, getArticle, getDisco } from '$lib/registry/homepage';
	import me from '$lib/images/photos/me.jpeg';
	import me4 from '$lib/images/photos/me4.png';
	import me5 from '$lib/images/photos/me5.png';
	import githubIcon from '$lib/images/github.svg';
	import { onMount } from 'svelte';

	let debugMenuOpen = $state(false);
	let headerBlendMode = $state('difference');
	let showSectionsEnabled = $state(false);
	let storeInitialized = false;

	// Subscribe to the store and sync with local state
	$effect(() => {
		const unsubscribe = showSections.subscribe((value) => {
			showSectionsEnabled = value;
			storeInitialized = true;
		});
		return unsubscribe;
	});

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

	let maskX = $state(0);
	let maskY = $state(0);
	let isHovering = $state(false);
	const BLOB_SIZE = 180;

	function handleMouseMove(event: MouseEvent) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		maskX = event.clientX - rect.left - BLOB_SIZE / 2;
		maskY = event.clientY - rect.top - BLOB_SIZE / 2;
	}

	function handleMouseEnter() {
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
	}

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

	let readerPanelOpen = $state(false);
	let selectedArticleId = $state<string | null>(null);

	function openArticleReader(articleId: string) {
		selectedArticleId = articleId;
		readerPanelOpen = true;
	}

	function closeArticleReader() {
		readerPanelOpen = false;
		setTimeout(() => {
			if (!readerPanelOpen) {
				selectedArticleId = null;
			}
		}, 300);
	}

	onMount(() => {
		const handleNavigateArticle = (event: CustomEvent<{ id: string }>) => {
			selectedArticleId = event.detail.id;
		};

		document.addEventListener('navigatearticle', handleNavigateArticle as EventListener);

		return () => {
			document.removeEventListener('navigatearticle', handleNavigateArticle as EventListener);
		};
	});
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<section class="page-container relative w-full min-h-screen" class:panel-open={readerPanelOpen}>
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
				class="ml-4 p-2 rounded-lg hover:bg-(--surface-hover) transition-colors"
				aria-label="GitHub profile"
			>
				<img src={githubIcon} alt="GitHub" class="w-5 h-5 brightness-0 dark:invert dark:brightness-100 transition-all" />
			</a>
			<ThemeToggle class="ml-2" />
		</HeaderNav>
	</Header>

	<div
		class="main-content mx-auto max-w-6xl px-4 py-16 space-y-12"
		class:panel-open={readerPanelOpen}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<header
			class="hero-header relative overflow-hidden"
			onmousemove={handleMouseMove}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			style="--mask-x: {maskX}px; --mask-y: {maskY}px;"
		>
			<img src={me} alt="" class="hero-base-image" aria-hidden="true" />
			
			<div 
				class="blob-mask-container"
				class:is-hovering={isHovering}
				style="top: {maskY}px; left: {maskX}px; --img-offset-x: {-maskX}px; --img-offset-y: {-maskY}px;"
				aria-hidden="true"
			>
				<img src={me5} alt="" class="blob-reveal-image blob-reveal-me4" />
				<img src={me} alt="" class="blob-reveal-image blob-reveal-negative" style="mix-blend-mode: {headerBlendMode};" />
			</div>
			
			<div class="hero-blue-overlay" aria-hidden="true"></div>
			
			<div class="hero-content">
				<h1 class="text-4xl md:text-5xl font-serif leading-tight text-white mb-4 drop-shadow-lg">
					currently building things.
				</h1>
				<p class="text-white/90 text-xl md:text-2xl text-balance drop-shadow-md max-w-lg">
					my name's emma and my biggest passion is making stuff with code. i'm into startups, finance, and fashion.
				</p>
			</div>
		</header>

		{#if showSectionsEnabled}
			<section aria-labelledby="essays-heading" class="space-y-6">
				<h2
					id="essays-heading"
					class="text-sm font-semibold uppercase tracking-[0.2em] text-(--text-secondary)"
				>
					Essays
				</h2>
				<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each visibleArticles as article (article.id)}
						<li>
							<button
								type="button"
								onclick={() => openArticleReader(article.id)}
								class="article-card style-none w-full text-left flex flex-col gap-2 p-4 -m-4 rounded-lg transition-all duration-200 hover:bg-(--surface-hover) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
								class:article-card-active={selectedArticleId === article.id && readerPanelOpen}
							>
								<span class="text-lg font-semibold text-(--text-primary) leading-snug">
									{article.title}
								</span>
								{#if article.date}
									<span class="text-sm text-(--text-secondary)">
										{article.date}
									</span>
								{/if}
								<p class="text-base text-(--text-muted) leading-relaxed line-clamp-3">
									{article.content}
								</p>
							</button>
						</li>
					{/each}
				</ul>
				{#if hasMoreArticles}
					<button
						onclick={() => (essaysExpanded = !essaysExpanded)}
						class="text-base text-(--text-secondary) hover:text-(--text-primary) hover:underline cursor-pointer transition-colors"
					>
						{essaysExpanded ? '← Show less' : `Show all ${homepageArticles.length} essays →`}
					</button>
				{/if}
			</section>
		{/if}

		{#if showSectionsEnabled}
			<section aria-labelledby="projects-heading" class="space-y-4">
				<h2
					id="projects-heading"
					class="text-xs font-semibold uppercase tracking-[0.25em] text-(--text-secondary)"
				>
					Selected projects
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each homepageProjects as project (project.id)}
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
					{/each}
				</div>
			</section>
		{/if}

		<section aria-labelledby="fun-heading" class="space-y-4">
			<h2
				id="fun-heading"
				class="text-xs font-semibold uppercase tracking-[0.25em] text-(--text-secondary)"
			>
				miscellaneous
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<DiscoBlock
					image={disco.image}
					alt={disco.alt}
					caption={disco.caption}
					class={disco.class ?? 'w-full h-full'}
				/>
				<HomeBlock class="col-span-2" />
			</div>

		</section>
	</div>

	<ArticleReaderPanel
		open={readerPanelOpen}
		articleId={selectedArticleId}
		onclose={closeArticleReader}
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
			<p class="text-xs text-(--liver-brown-600) italic">
				Press D to toggle this menu
			</p>
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
		transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1),
			width 0.35s cubic-bezier(0.32, 0.72, 0, 1);
		will-change: transform, width;
	}

	.main-content.panel-open {
		transform: translateX(42%);
	}

	/* Article card styles */
	.article-card {
		cursor: pointer;
		border: 1px solid transparent;
		background: transparent;
	}

	.article-card-active {
		background: var(--surface-hover);
		border-color: var(--border-color);
	}

	/* Hero header with squircle borders */
	.hero-header {
		border-radius: 2rem;
		height: 320px;
		background: #5ba4d4; /* Blue from the photo */
		cursor: crosshair;
	}

	.hero-base-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 55%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 35%;
		border-radius: 2rem 0 0 2rem;
	}

	/* Animated blob mask container */
	.blob-mask-container {
		position: absolute;
		width: 180px;
		height: 180px;
		overflow: hidden;
		opacity: 0;
		transition: opacity 0.15s ease;
		/* Animated blob shape using border-radius */
		border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
		animation: blob-morph 8s ease-in-out infinite;
		pointer-events: none;
		z-index: 5;
	}

	.blob-mask-container.is-hovering {
		opacity: 1;
	}

	/* Smooth organic blob morphing animation */
	@keyframes blob-morph {
		0%, 100% {
			border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
		}
		25% {
			border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
		}
		50% {
			border-radius: 50% 60% 30% 60% / 40% 30% 70% 50%;
		}
		75% {
			border-radius: 60% 40% 60% 40% / 70% 50% 40% 60%;
		}
	}

	/* Images inside the blob container */
	.blob-reveal-image {
		position: absolute;
		/* Position the image so the cursor area is visible - offset by container position */
		top: var(--img-offset-y, 0);
		left: var(--img-offset-x, 0);
		/* Calculate the width relative to the header */
		width: calc(0.55 * (100vw - 2rem));
		max-width: calc(0.55 * (72rem - 2rem));
		height: 320px;
		object-fit: cover;
		object-position: 50% 35%;
	}

	/* me5 reveal layer */
	.blob-reveal-me4 {
		z-index: 1;
	}

	/* Negative filter layer - blended on top */
	.blob-reveal-negative {
		z-index: 2;
		filter: invert(1) hue-rotate(180deg);
		mix-blend-mode: difference;
		opacity: 0.5;
	}

	.hero-blue-overlay {
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 100%;
		background: linear-gradient(
			to right,
			transparent 0%,
			#5ba4d4 10%,
			#5ba4d4 100%
		);
		border-radius: 0 2rem 2rem 0;
	}

	.hero-content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		margin-left: auto;
		width: 50%;
		text-align: left;
		padding: 2rem;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.hero-header {
			height: 400px;
		}

		.hero-base-image {
			width: 100%;
			height: 55%;
			object-position: center 25%;
			border-radius: 2rem 2rem 0 0;
		}

		.blob-reveal-image {
			width: 100%;
			height: 400px;
			object-position: center 25%;
		}

		.hero-blue-overlay {
			width: 100%;
			height: 55%;
			top: auto;
			bottom: 0;
			background: linear-gradient(
				to bottom,
				transparent 0%,
				#5ba4d4 15%,
				#5ba4d4 100%
			);
			border-radius: 0 0 2rem 2rem;
		}

		.hero-content {
			width: 100%;
			justify-content: flex-end;
			padding: 1.5rem;
		}

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