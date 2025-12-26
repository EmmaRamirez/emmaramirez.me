<script lang="ts">
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import type { Article } from '$lib/articles';
	import { getHomepageItems, getProject, getArticle, getDisco } from '$lib/registry/homepage';
	import me from '$lib/images/photos/me.jpeg';

	const homepageItems = getHomepageItems();

	// Mouse position tracking for mask effect
	let maskX = $state(50);
	let maskY = $state(50);
	let isHovering = $state(false);

	function handleMouseMove(event: MouseEvent) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		maskX = ((event.clientX - rect.left) / rect.width) * 100;
		maskY = ((event.clientY - rect.top) / rect.height) * 100;
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
</script>

<section class="relative w-full min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/" active class="text-(--text-primary)">Home</HeaderNavItem>
			<HeaderNavItem href="/blog">Essays</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			<ThemeToggle class="ml-4" />
		</HeaderNav>
	</Header>

	<div class="mx-auto max-w-6xl px-4 py-16 space-y-12">
		<!-- Hero header with image reveal -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<header
			class="hero-header relative overflow-hidden"
			onmousemove={handleMouseMove}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			style="--mask-x: {maskX}%; --mask-y: {maskY}%;"
		>
			<!-- Base image (photo) -->
			<img src={me} alt="" class="hero-base-image" aria-hidden="true" />
			
			<!-- Reveal layer with negative filter -->
			<img 
				src={me} 
				alt="" 
				class="hero-reveal-image"
				class:is-hovering={isHovering}
				aria-hidden="true" 
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
						<a
							href={`/blog/article?id=${article.id}`}
							class="style-none flex flex-col gap-2 p-4 -m-4 rounded-lg transition-colors duration-200 hover:bg-(--surface-hover)"
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
						</a>
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
				Just for fun
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<DiscoBlock
					image={disco.image}
					alt={disco.alt}
					caption={disco.caption}
					class={disco.class ?? 'w-full h-full'}
				/>
			</div>
		</section>
	</div>
</section>

<style>
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
		filter: invert(1) hue-rotate(180deg);
		/* Blob-like mask using SVG path */
		--blob-size: 120px;
		mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='M45.2,-58.3C57.9,-48.5,67,-33.1,71.3,-16.1C75.6,0.9,75.1,19.5,67.6,34.5C60.1,49.5,45.6,60.9,29.4,67.5C13.2,74.1,-4.7,75.8,-22.1,71.6C-39.5,67.4,-56.4,57.3,-66.4,42.6C-76.4,27.9,-79.5,8.5,-76.2,-9.3C-72.9,-27.1,-63.2,-43.4,-49.5,-53.1C-35.8,-62.8,-17.9,-65.9,-0.4,-65.4C17.1,-64.9,34.2,-60.8,45.2,-58.3Z' transform='translate(100 100)'/%3E%3C/svg%3E");
		mask-size: var(--blob-size) var(--blob-size);
		mask-position: calc(var(--mask-x, 50%) - var(--blob-size) / 2) calc(var(--mask-y, 50%) - var(--blob-size) / 2);
		mask-repeat: no-repeat;
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='M45.2,-58.3C57.9,-48.5,67,-33.1,71.3,-16.1C75.6,0.9,75.1,19.5,67.6,34.5C60.1,49.5,45.6,60.9,29.4,67.5C13.2,74.1,-4.7,75.8,-22.1,71.6C-39.5,67.4,-56.4,57.3,-66.4,42.6C-76.4,27.9,-79.5,8.5,-76.2,-9.3C-72.9,-27.1,-63.2,-43.4,-49.5,-53.1C-35.8,-62.8,-17.9,-65.9,-0.4,-65.4C17.1,-64.9,34.2,-60.8,45.2,-58.3Z' transform='translate(100 100)'/%3E%3C/svg%3E");
		-webkit-mask-size: var(--blob-size) var(--blob-size);
		-webkit-mask-position: calc(var(--mask-x, 50%) - var(--blob-size) / 2) calc(var(--mask-y, 50%) - var(--blob-size) / 2);
		-webkit-mask-repeat: no-repeat;
		transition: opacity 0.15s ease;
	}

	.hero-reveal-image.is-hovering {
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
	}
</style>