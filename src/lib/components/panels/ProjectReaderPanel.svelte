<script lang="ts">
	import { getProject, projectIds, type ProjectId, type ProjectRegistryEntry } from '$lib/registry/homepage';
	import { fly, fade } from 'svelte/transition';

	interface ProjectReaderPanelProps {
		open?: boolean;
		projectId?: ProjectId | null;
		onclose?: () => void;
	}

	let { open = false, projectId = null, onclose }: ProjectReaderPanelProps = $props();

	const project = $derived(
		projectId ? getProject(projectId) ?? null : null
	);

	const currentIndex = $derived(projectId ? projectIds.findIndex((id) => id === projectId) : -1);
	const prevProject = $derived(currentIndex > 0 ? getProject(projectIds[currentIndex - 1]) : null);
	const nextProject = $derived(
		currentIndex < projectIds.length - 1 ? getProject(projectIds[currentIndex + 1]) : null
	);

	const readingTime = $derived(
		project?.content ? Math.max(1, Math.ceil(project.content.split(/\s+/).length / 200)) : 0
	);

	function handleKeydown(event: KeyboardEvent) {
  if (!open) return;

  const targetIsTextInput =
    event.target instanceof HTMLElement &&
    (event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.isContentEditable);

  if (event.key === 'Escape') {
    event.preventDefault();
    onclose?.();
  }

  if (event.key === 'r' || event.key === 'R') {
    if (targetIsTextInput) {
      return;
    }
    event.preventDefault();
    if (project) {
      window.location.href = `/projects/project?id=${project.id}`;
    }
  }

    if ((event.key === 'k' || event.key === 'K' || event.key === 'j' || event.key === 'J') && !targetIsTextInput) {
      event.preventDefault();
      if ((event.key === 'k' || event.key === 'K') && prevProject) {
        navigateToProject(prevProject.id);
      }
      if ((event.key === 'j' || event.key === 'J') && nextProject) {
        navigateToProject(nextProject.id);
      }
    }
  }

	function navigateToProject(id: ProjectId) {
		const customEvent = new CustomEvent('navigateproject', { detail: { id } });
		document.dispatchEvent(customEvent);
	}

	function getStatusLabel(status: string | undefined): string {
		switch (status) {
			case 'active': return 'Active';
			case 'archived': return 'Archived';
			case 'experiment': return 'Experiment';
			default: return '';
		}
	}

	function getStatusClass(status: string | undefined): string {
		switch (status) {
			case 'active': return 'status-active';
			case 'archived': return 'status-archived';
			case 'experiment': return 'status-experiment';
			default: return '';
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && project}
	<aside
		class="project-reader-panel"
		in:fly={{ x: -100, duration: 300, opacity: 1 }}
		out:fly={{ x: -100, duration: 250, opacity: 1 }}
		aria-label="Project reader"
	>
		<header class="panel-header">
			<div class="hotkey-indicators">
				<button class="hotkey-indicator" onclick={() => onclose?.()} aria-label="Close panel">
					<kbd class="key-badge">Esc</kbd>
					<span class="key-label">to close</span>
				</button>
				<div class="hotkey-divider"></div>
				<button class="hotkey-indicator" onclick={() => project && (window.location.href = `/projects/project?id=${project.id}`)} aria-label="Open read mode">
					<kbd class="key-badge">R</kbd>
					<span class="key-label">read mode</span>
				</button>
				{#if prevProject || nextProject}
					<div class="hotkey-divider"></div>
					{#if prevProject}
						<button class="hotkey-indicator" onclick={() => navigateToProject(prevProject.id)} aria-label="Previous project">
							<kbd class="key-badge">K</kbd>
							<span class="key-label">previous</span>
						</button>
					{/if}
					{#if nextProject}
						<button class="hotkey-indicator" onclick={() => navigateToProject(nextProject.id)} aria-label="Next project">
							<kbd class="key-badge">J</kbd>
							<span class="key-label">next</span>
						</button>
					{/if}
				{/if}
			</div>
			<button class="close-button" onclick={() => onclose?.()} aria-label="Close project panel">
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
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</header>

		<article class="panel-content">
			<div class="project-header" in:fade={{ duration: 200, delay: 100 }}>
				<div class="project-meta-row">
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

				<h1 class="project-title">{project.title}</h1>

				<p class="project-description">{project.description}</p>

				{#if project.technologies && project.technologies.length > 0}
					<div class="project-technologies">
						{#each project.technologies as tech (tech)}
							<span class="tech-tag">{tech}</span>
						{/each}
					</div>
				{/if}

				{#if project.links}
					<div class="project-links">
						{#if project.links.github}
							<a href={project.links.github} target="_blank" rel="noopener noreferrer" class="project-link">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
								<span>GitHub</span>
							</a>
						{/if}
						{#if project.links.demo}
							<a href={project.links.demo} target="_blank" rel="noopener noreferrer" class="project-link">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
									<polyline points="15 3 21 3 21 9"></polyline>
									<line x1="10" y1="14" x2="21" y2="3"></line>
								</svg>
								<span>Live Demo</span>
							</a>
						{/if}
						{#if project.links.website}
							<a href={project.links.website} target="_blank" rel="noopener noreferrer" class="project-link">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="2" y1="12" x2="22" y2="12"></line>
									<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
								</svg>
								<span>Website</span>
							</a>
						{/if}
					</div>
				{/if}
			</div>

			{#if project.content}
				<div class="project-body" in:fade={{ duration: 200, delay: 150 }}>
		{#each project.content.split('\n\n') as paragraph, i (i)}
						<p class:first-paragraph={i === 0}>{paragraph}</p>
					{/each}
				</div>
			{/if}

			{#if prevProject || nextProject}
				<nav class="project-nav" in:fade={{ duration: 200, delay: 200 }}>
					<div class="nav-grid">
						<div class="nav-prev">
							{#if prevProject}
								<button class="nav-link" onclick={() => navigateToProject(prevProject.id)}>
									<span class="nav-direction">← Previous</span>
									<span class="nav-title">{prevProject.title}</span>
								</button>
							{/if}
						</div>
						<div class="nav-next">
							{#if nextProject}
								<button class="nav-link nav-link-next" onclick={() => navigateToProject(nextProject.id)}>
									<span class="nav-direction">Next →</span>
									<span class="nav-title">{nextProject.title}</span>
								</button>
							{/if}
						</div>
					</div>
				</nav>
			{/if}

		<div class="full-project-link" in:fade={{ duration: 200, delay: 250 }}>
			<a href={`/projects/project?id=${project.id}`} class="style-none read-full-link">
				View full project
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		</article>
	</aside>
{/if}

<style>
	.project-reader-panel {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: min(1100px, 80vw);
		background: var(--page-bg);
		border-right: 1px solid var(--border-color);
		z-index: 60;
		display: flex;
		flex-direction: column;
		box-shadow: 8px 0 32px -8px rgba(0, 0, 0, 0.15);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.25rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--page-bg-subtle);
	}

	.hotkey-indicators {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.hotkey-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		padding: 0.25rem 0.5rem;
		margin: -0.25rem -0.5rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.hotkey-indicator:hover {
		background: var(--surface-hover);
	}

	.hotkey-indicator:hover .key-badge {
		border-color: var(--text-muted);
	}

	.hotkey-divider {
		width: 1px;
		height: 16px;
		background: var(--border-color);
	}

	.key-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.5rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: var(--page-bg);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		color: var(--text-secondary);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	}

	.key-label {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 6px;
		background: transparent;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.close-button:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}

	.panel-content {
		flex: 1;
		overflow-y: auto;
		padding: 2.5rem 3rem;
		scroll-behavior: smooth;
	}

	.project-header {
		margin-bottom: 2.5rem;
		max-width: 65ch;
	}

	.project-meta-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.pill {
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-muted);
		padding: 0.25rem 0.75rem;
		background: var(--page-bg-subtle);
		border-radius: 100px;
		border: 1px solid var(--border-color);
	}

	.status-badge {
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
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
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.project-title {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 2rem;
		font-weight: 600;
		line-height: 1.25;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}

	.project-description {
		font-size: 1.125rem;
		line-height: 1.7;
		color: var(--text-secondary);
		margin-bottom: 1.25rem;
	}

	.project-technologies {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.tech-tag {
		font-size: 0.7rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		padding: 0.25rem 0.6rem;
		background: var(--page-bg-subtle);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		color: var(--text-secondary);
	}

	.project-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.project-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: var(--page-bg-subtle);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.project-link:hover {
		background: var(--text-primary);
		color: var(--page-bg);
		border-color: var(--text-primary);
	}

	.project-body {
		font-size: 1.125rem;
		line-height: 1.8;
		color: var(--text-secondary);
		border-top: 1px solid var(--border-color);
		padding-top: 2rem;
		max-width: 65ch;
	}

	.project-body p {
		margin-bottom: 1.5rem;
	}

	.first-paragraph::first-letter {
		float: left;
		font-family: 'JetBrains Mono', monospace;
		font-size: 3rem;
		line-height: 0.8;
		padding-right: 0.5rem;
		padding-top: 0.2rem;
		color: var(--text-primary);
		font-weight: 700;
	}

	.project-nav {
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	.nav-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.nav-prev {
		text-align: left;
	}

	.nav-next {
		text-align: right;
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		background: none;
		border: none;
		padding: 0.5rem;
		margin: -0.5rem;
		border-radius: 8px;
		cursor: pointer;
		text-align: inherit;
		transition: background 0.15s ease;
	}

	.nav-link:hover {
		background: var(--surface-hover);
	}

	.nav-link-next {
		align-items: flex-end;
		margin-left: auto;
	}

	.nav-direction {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.nav-title {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.full-project-link {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	.read-full-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-primary);
		background: var(--page-bg-subtle);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		transition: all 0.15s ease;
		text-decoration: none;
	}

	.read-full-link:hover {
		background: var(--text-primary);
		color: var(--page-bg);
		border-color: var(--text-primary);
	}

	@media (max-width: 1024px) {
		.project-reader-panel {
			width: min(720px, 85vw);
		}
	}

	@media (max-width: 768px) {
		.project-reader-panel {
			width: 100vw;
		}
	}
</style>
