<script lang="ts">
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import HomeBlock from '$lib/components/HomeBlock.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import ArticleReaderPanel from '$lib/components/ArticleReaderPanel.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import type { Article } from '$lib/articles';
	import { getHomepageItems, getProject, getArticle, getDisco } from '$lib/registry/homepage';
	import me from '$lib/images/photos/me.jpeg';
	import me4 from '$lib/images/photos/me4.png';
	import me5 from '$lib/images/photos/me5.png';
	import { onMount } from 'svelte';

	const homepageItems = getHomepageItems();

	// Mouse position tracking for mask effect (in pixels for precise positioning)
	let maskX = $state(0);
	let maskY = $state(0);
	let isHovering = $state(false);
	const BLOB_SIZE = 180; // Size of the blob in pixels

	// Blob path animation
	const blobPaths = [
		'M39.5,-51.1C52.9,-42.7,66.8,-33.4,72.4,-20.3C78,-7.2,75.3,9.7,68.1,23.8C60.9,37.9,49.2,49.2,35.6,56.8C22,64.4,6.5,68.3,-8.8,67.8C-24.1,67.3,-39.2,62.4,-51.2,53C-63.2,43.6,-72.1,29.7,-75.3,14.3C-78.5,-1.1,-76,-18,-68.2,-31.5C-60.4,-45,-47.3,-55.1,-33.5,-63.3C-19.7,-71.5,-5.2,-77.8,5.9,-74.3C17,-70.8,26.1,-59.5,39.5,-51.1Z',
		'M42,-48C55,-40,68,-30,74,-18C80,-5,77,12,70,26C63,40,51,51,38,59C24,67,8,70,-7,69C-22,68,-37,64,-49,55C-61,46,-70,32,-73,17C-76,2,-74,-16,-66,-30C-58,-44,-45,-54,-32,-62C-18,-70,-4,-76,8,-72C20,-68,28,-58,42,-48Z',
		'M37,-54C51,-46,65,-36,71,-23C77,-10,74,7,66,21C58,35,47,47,33,55C19,63,4,67,-11,66C-26,65,-41,60,-53,51C-65,42,-74,28,-77,12C-80,-4,-78,-20,-70,-33C-62,-46,-49,-56,-35,-64C-21,-72,-7,-78,4,-75C15,-72,24,-62,37,-54Z',
		'M41,-49C54,-41,67,-32,73,-19C79,-6,76,10,69,24C62,38,50,50,36,58C22,66,7,69,-8,68C-23,67,-38,63,-50,54C-62,45,-71,30,-74,15C-77,0,-75,-17,-67,-30C-59,-44,-46,-55,-33,-63C-20,-71,-6,-77,6,-74C18,-71,29,-57,41,-49Z'
	];
	let currentBlobIndex = $state(0);
	let blobPath = $derived(blobPaths[currentBlobIndex]);
	let maskSvgUrl = $derived(`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='${blobPath}' transform='translate(100 100)'/%3E%3C/svg%3E")`);

	function handleMouseMove(event: MouseEvent) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		// Get pixel position relative to the header, centered on cursor
		maskX = event.clientX - rect.left - BLOB_SIZE / 2;
		maskY = event.clientY - rect.top - BLOB_SIZE / 2;
	}

	function handleMouseEnter() {
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
	}

	// Animate blob path
	$effect(() => {
		const interval = setInterval(() => {
			currentBlobIndex = (currentBlobIndex + 1) % blobPaths.length;
		}, 1000);
		return () => clearInterval(interval);
	});

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
	let readerPanelOpen = $state(false);
	let selectedArticleId = $state<string | null>(null);

	function openArticleReader(articleId: string) {
		selectedArticleId = articleId;
		readerPanelOpen = true;
	}

	function closeArticleReader() {
		readerPanelOpen = false;
		// Small delay before clearing article to allow exit animation
		setTimeout(() => {
			if (!readerPanelOpen) {
				selectedArticleId = null;
			}
		}, 300);
	}

	// Listen for navigation events from the panel
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

<section class="page-container relative w-full min-h-screen" class:panel-open={readerPanelOpen}>
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/" active class="text-(--text-primary)">Home</HeaderNavItem>
			<HeaderNavItem href="/blog">Essays</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			<ThemeToggle class="ml-4" />
		</HeaderNav>
	</Header>

	<div
		class="main-content mx-auto max-w-6xl px-4 py-16 space-y-12"
		class:panel-open={readerPanelOpen}
	>
		<!-- Hero header with image reveal -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<header
			class="hero-header relative overflow-hidden"
			onmousemove={handleMouseMove}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			style="--mask-x: {maskX}px; --mask-y: {maskY}px;"
		>
			<!-- Base image (photo) -->
			<img src={me} alt="" class="hero-base-image" aria-hidden="true" />
			
			<!-- Reveal layer 1: me4 image with blob mask -->
			<img 
				src={me5} 
				alt="" 
				class="hero-reveal-image hero-reveal-me4"
				class:is-hovering={isHovering}
				aria-hidden="true"
				style="-webkit-mask-image: {maskSvgUrl}; mask-image: {maskSvgUrl};"
			/>
			
			<!-- Reveal layer 2: negative filter with blob mask -->
			<img 
				src={me} 
				alt="" 
				class="hero-reveal-image hero-reveal-negative"
				class:is-hovering={isHovering}
				aria-hidden="true"
				style="-webkit-mask-image: {maskSvgUrl}; mask-image: {maskSvgUrl};"
			/>
			
			<!-- Blue overlay for right side -->
			<div class="hero-blue-overlay" aria-hidden="true"></div>
			
			<!-- Content overlay -->
			<div class="hero-content">
				<h1 class="text-4xl md:text-5xl font-serif leading-tight text-white mb-4 drop-shadow-lg">
					currently building things.
				</h1>
				<p class="text-white/90 text-xl md:text-2xl text-balance drop-shadow-md max-w-lg">
					my name's emma and my biggest passion is making stuff with code. i'm into startups, finance, and fashion.
				</p>
			</div>
		</header>

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

	<!-- Article Reader Panel -->
	<ArticleReaderPanel
		open={readerPanelOpen}
		articleId={selectedArticleId}
		onclose={closeArticleReader}
	/>
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

	.hero-base-image,
	.hero-reveal-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 55%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 35%;
		border-radius: 2rem 0 0 2rem;
	}

	.hero-reveal-image {
		opacity: 0;
		/* Mask size and position - image is set inline for animation */
		mask-size: 180px 180px;
		mask-position: var(--mask-x, 0) var(--mask-y, 0);
		mask-repeat: no-repeat;
		-webkit-mask-size: 180px 180px;
		-webkit-mask-position: var(--mask-x, 0) var(--mask-y, 0);
		-webkit-mask-repeat: no-repeat;
		transition: opacity 0.1s ease, mask-image 0.5s ease;
	}

	.hero-reveal-image.is-hovering {
		opacity: 1;
	}

	/* me4 reveal layer - shown below the negative filter */
	.hero-reveal-me4 {
		z-index: 2;
	}

	/* Negative filter layer - blended on top */
	.hero-reveal-negative {
		z-index: 3;
		/* filter: invert(1) hue-rotate(180deg); */
		mix-blend-mode: multiply;
		opacity: 1;
	}

	.hero-reveal-negative.is-hovering {
		opacity: 1;
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

		.hero-base-image,
		.hero-reveal-image {
			width: 100%;
			height: 55%;
			object-position: center 25%;
			border-radius: 2rem 2rem 0 0;
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