<script lang="ts">
	import { headerColor, title } from '$lib/stores';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { getProject, getProjectNeighbors, type ProjectId } from '$lib/registry/homepage';
	import { readingTimeMinutesFromText } from '$lib/reading';
	import { dev } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const projectId = $derived(($page.url.searchParams.get('id') ?? 'nuzlocke') as ProjectId);
	const project = $derived(getProject(projectId) ?? getProject('nuzlocke'));

	const projectNeighbors = $derived(getProjectNeighbors(projectId));
	const prevProject = $derived(projectNeighbors.prevProject);
	const nextProject = $derived(projectNeighbors.nextProject);

	$effect(() => {
		title.set(`projects/${project.title}`);
		headerColor.set('var(--page-bg-subtle)');
	});

	let scrollProgress = $state(0);
	let projectElement: HTMLElement;

	onMount(() => {
		const handleScroll = () => {
			if (!projectElement) return;
			const rect = projectElement.getBoundingClientRect();
			const scrolled = -rect.top;
			const total = rect.height - window.innerHeight;
			scrollProgress = Math.max(0, Math.min(100, (scrolled / total) * 100));
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const readingTime = $derived(readingTimeMinutesFromText(project.content));

	function getStatusLabel(status: string | undefined): string {
		switch (status) {
			case 'active':
				return 'Active';
			case 'archived':
				return 'Archived';
			case 'experiment':
				return 'Experiment';
			default:
				return '';
		}
	}

	function getStatusClass(status: string | undefined): string {
		switch (status) {
			case 'active':
				return 'status-active';
			case 'archived':
				return 'status-archived';
			case 'experiment':
				return 'status-experiment';
			default:
				return '';
		}
	}
</script>

<svelte:head>
	<title>{project.title} — Emma Ramirez</title>
	<meta name="description" content={project.description} />
</svelte:head>

<div
	class="fixed top-0 left-0 z-50 h-0.75 bg-(--text-primary) transition-all duration-75"
	style="width: {scrollProgress}%"
></div>

<section class="relative min-h-screen w-full">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/">Home</HeaderNavItem>
			<HeaderNavItem href="/blog">Essays</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			{#if dev}
				<HeaderNavItem href="/editor">Editor</HeaderNavItem>
			{/if}
			<a
				href="https://github.com/emzinnia"
				target="_blank"
				rel="noopener noreferrer"
				class="ml-2 flex items-center justify-center rounded-lg p-1.5 text-(--text-primary) transition-colors hover:bg-(--surface-hover) md:ml-4 md:p-2"
				aria-label="GitHub profile"
			>
				<svg class="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
						fill="currentColor"
					/></svg
				>
			</a>
			<ThemeToggle class="ml-2" />
		</HeaderNav>
	</Header>

	<article bind:this={projectElement} class="project-container mx-auto max-w-3xl px-6 py-16">
		<a
			href="/"
			class="style-none group mb-12 inline-flex items-center gap-2 text-sm text-(--text-muted) transition-colors hover:text-(--text-primary)"
			in:fade={{ duration: 300 }}
		>
			<svg
				class="h-4 w-4 transition-transform group-hover:-translate-x-1"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			<span class="font-sans">Back to home</span>
		</a>

		<header class="mb-12" in:fly={{ y: 20, duration: 400, delay: 100 }}>
			<div class="mb-4 flex flex-wrap items-center gap-3">
				<span class="pill">{project.pill}</span>
				{#if project.status}
					<span class="status-badge {getStatusClass(project.status)}">
						{getStatusLabel(project.status)}
					</span>
				{/if}
				{#if project.year}
					<span class="year">{project.year}</span>
				{/if}
			</div>

			<h1 class="project-title mb-4 text-3xl md:text-4xl lg:text-5xl">
				{project.title}
			</h1>

			<p class="project-description mb-6 text-lg text-(--text-secondary) md:text-xl">
				{project.description}
			</p>

			{#if project.technologies && project.technologies.length > 0}
				<div class="mb-6 flex flex-wrap gap-2">
					{#each project.technologies as tech (tech)}
						<span class="tech-tag">{tech}</span>
					{/each}
				</div>
			{/if}

			{#if project.links}
				<div class="flex flex-wrap gap-3">
					{#if project.links.github}
						<a
							href={project.links.github}
							target="_blank"
							rel="noopener noreferrer"
							class="project-link"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							<span>View on GitHub</span>
						</a>
					{/if}
					{#if project.links.demo}
						<a
							href={project.links.demo}
							target="_blank"
							rel="noopener noreferrer"
							class="project-link project-link-primary"
						>
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
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
								<polyline points="15 3 21 3 21 9"></polyline>
								<line x1="10" y1="14" x2="21" y2="3"></line>
							</svg>
							<span>Live Demo</span>
						</a>
					{/if}
					{#if project.links.website}
						<a
							href={project.links.website}
							target="_blank"
							rel="noopener noreferrer"
							class="project-link"
						>
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
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="2" y1="12" x2="22" y2="12"></line>
								<path
									d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
								></path>
							</svg>
							<span>Website</span>
						</a>
					{/if}
				</div>
			{/if}

			{#if readingTime > 0}
				<div class="mt-6 font-sans text-sm text-(--text-muted)">
					{readingTime} min read
				</div>
			{/if}
		</header>

		{#if project.content}
			<div class="project-content prose-custom" in:fly={{ y: 20, duration: 400, delay: 200 }}>
				{#each project.content.split('\n\n') as paragraph, i (i)}
					<p class:first-paragraph={i === 0}>{paragraph}</p>
				{/each}
			</div>
		{/if}

		{#if project.technologies && project.technologies.length > 0}
			<footer
				class="mt-16 border-t border-(--border-color) pt-8"
				in:fly={{ y: 20, duration: 400, delay: 300 }}
			>
				<h3 class="mb-4 font-sans text-xs tracking-[0.2em] text-(--text-muted) uppercase">
					Built with
				</h3>
				<div class="flex flex-wrap gap-2">
					{#each project.technologies as tech (tech)}
						<span class="tech-tag-large">{tech}</span>
					{/each}
				</div>
			</footer>
		{/if}

		<nav
			class="mt-12 border-t border-(--border-color) pt-8"
			in:fly={{ y: 20, duration: 400, delay: 350 }}
		>
			<div class="grid grid-cols-2 gap-8">
				<div>
					{#if prevProject}
						<a href={`/projects/project?id=${prevProject.id}`} class="style-none group block">
							<span
								class="mb-1 block font-sans text-xs tracking-wider text-(--text-muted) uppercase"
							>
								← Previous
							</span>
							<span
								class="font-mono text-base text-(--text-primary) transition-colors group-hover:text-(--link-hover)"
							>
								{prevProject.title}
							</span>
						</a>
					{/if}
				</div>
				<div class="text-right">
					{#if nextProject}
						<a href={`/projects/project?id=${nextProject.id}`} class="style-none group block">
							<span
								class="mb-1 block font-sans text-xs tracking-wider text-(--text-muted) uppercase"
							>
								Next →
							</span>
							<span
								class="font-mono text-base text-(--text-primary) transition-colors group-hover:text-(--link-hover)"
							>
								{nextProject.title}
							</span>
						</a>
					{/if}
				</div>
			</div>
		</nav>
	</article>
</section>

<style>
	.project-title {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-weight: 700;
		line-height: 1.2;
		color: var(--text-primary);
	}

	.pill {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-muted);
		padding: 0.3rem 0.875rem;
		background: var(--page-bg-subtle);
		border-radius: 6.25rem;
		border: 0.0625rem solid var(--border-color);
	}

	.status-badge {
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.25rem 0.625rem;
		border-radius: 0.25rem;
		font-weight: 600;
	}

	.status-active {
		background: rgba(34, 197, 94, 0.15);
		color: rgb(34, 197, 94);
	}

	.status-archived {
		background: rgba(156, 163, 175, 0.15);
		color: rgb(156, 163, 175);
	}

	.status-experiment {
		background: rgba(168, 85, 247, 0.15);
		color: rgb(168, 85, 247);
	}

	.year {
		font-size: 0.8rem;
		color: var(--text-muted);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.tech-tag {
		font-size: 0.75rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		padding: 0.3rem 0.75rem;
		background: var(--page-bg-subtle);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.25rem;
		color: var(--text-secondary);
	}

	.tech-tag-large {
		font-size: 0.8rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		padding: 0.4rem 0.875rem;
		background: var(--page-bg-subtle);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.375rem;
		color: var(--text-secondary);
		transition: all 0.15s ease;
	}

	.tech-tag-large:hover {
		border-color: var(--text-muted);
	}

	.project-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: var(--page-bg-subtle);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.project-link:hover {
		background: var(--surface-hover);
		border-color: var(--text-muted);
		color: var(--text-primary);
	}

	.project-link-primary {
		background: var(--text-primary);
		color: var(--page-bg);
		border-color: var(--text-primary);
	}

	.project-link-primary:hover {
		background: var(--text-secondary);
		border-color: var(--text-secondary);
		color: var(--page-bg);
	}

	.prose-custom {
		font-size: 1.125rem;
		line-height: 1.8;
		color: var(--text-secondary);
	}

	.prose-custom p {
		margin-bottom: 1.5rem;
	}

	.first-paragraph::first-letter {
		float: left;
		font-family: 'JetBrains Mono', monospace;
		font-size: 3.5rem;
		line-height: 0.8;
		padding-right: 0.5rem;
		padding-top: 0.25rem;
		color: var(--text-primary);
		font-weight: 700;
	}
</style>
