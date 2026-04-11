<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { trackedFetch } from '$lib/stores/performanceAnalytics.svelte';

	type ProjectContentItem = {
		id: string;
		title: string;
		description: string;
		excerpt: string;
		content: string;
		updatedAt: string | null;
	};

	type ArticleContentItem = {
		slug: string;
		title: string;
		description: string;
		excerpt: string;
		date?: string;
		tags?: string[];
		updatedAt: string | null;
	};

	interface Props {
		projects: ProjectContentItem[];
		articles: ArticleContentItem[];
		onprojectsaved?: (value: {
			id: string;
			description: string;
			excerpt: string;
			content: string;
			updatedAt: string | null;
		}) => void;
		onarticlesaved?: (value: {
			slug: string;
			title: string;
			description: string;
			excerpt: string;
			date: string;
			tags: string[];
			updatedAt: string | null;
		}) => void;
	}

	let { projects, articles, onprojectsaved, onarticlesaved }: Props = $props();

	let selectedProjectId = $state<string | null>(null);
	let selectedArticleSlug = $state<string | null>(null);

	let projectDescription = $state('');
	let projectExcerpt = $state('');
	let projectBodyMarkdown = $state('');
	let articleTitle = $state('');
	let articleDescription = $state('');
	let articleExcerpt = $state('');
	let articleTags = $state('');
	let articlePublishedAt = $state('');
	let projectSaveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let articleSaveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let projectErrorMessage = $state('');
	let articleErrorMessage = $state('');

	const selectedProject = $derived(projects.find((entry) => entry.id === selectedProjectId) ?? null);
	const selectedArticle = $derived(articles.find((entry) => entry.slug === selectedArticleSlug) ?? null);

	function loadProjectForm(project: ProjectContentItem | null | undefined) {
		if (!project) return;
		selectedProjectId = project.id;
		projectDescription = project.description;
		projectExcerpt = project.excerpt;
		projectBodyMarkdown = project.content;
		projectErrorMessage = '';
		projectSaveStatus = 'idle';
	}

	function loadArticleForm(article: ArticleContentItem | null | undefined) {
		if (!article) return;
		selectedArticleSlug = article.slug;
		articleTitle = article.title;
		articleDescription = article.description;
		articleExcerpt = article.excerpt;
		articleTags = (article.tags ?? []).join(', ');
		articlePublishedAt = article.date ?? '';
		articleErrorMessage = '';
		articleSaveStatus = 'idle';
	}

	onMount(() => {
		loadProjectForm(projects[0]);
		loadArticleForm(articles[0]);
	});

	function formatUpdatedAt(value: string | null) {
		if (!value) return 'Not saved yet';
		return new Date(value).toLocaleString();
	}

	function normalizeTags(value: string) {
		return value
			.split(',')
			.map((tag) => tag.trim())
			.filter(Boolean);
	}

	async function saveProject() {
		if (!browser || !selectedProject) return;

		projectSaveStatus = 'saving';
		projectErrorMessage = '';

		const response = await trackedFetch(
			'/api/content',
			{
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					entityType: 'project',
					entityId: selectedProject.id,
					description: projectDescription,
					excerpt: projectExcerpt,
					bodyMarkdown: projectBodyMarkdown
				})
			},
			{
				label: `Save project content: ${selectedProject.id}`,
				source: 'EditorContentSection'
			}
		);

		if (!response.ok) {
			projectSaveStatus = 'error';
			projectErrorMessage = ((await response.json()) as { error?: string }).error ?? 'Save failed.';
			return;
		}

		const payload = (await response.json()) as { record?: { updatedAt?: string | null } };
		const updatedAt = payload.record?.updatedAt ?? new Date().toISOString();
		projectSaveStatus = 'saved';
		onprojectsaved?.({
			id: selectedProject.id,
			description: projectDescription,
			excerpt: projectExcerpt,
			content: projectBodyMarkdown,
			updatedAt
		});
	}

	async function saveArticle() {
		if (!browser || !selectedArticle) return;

		articleSaveStatus = 'saving';
		articleErrorMessage = '';

		const response = await trackedFetch(
			'/api/content',
			{
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					entityType: 'article',
					entityId: selectedArticle.slug,
					title: articleTitle,
					description: articleDescription,
					excerpt: articleExcerpt,
					tags: normalizeTags(articleTags),
					publishedAt: articlePublishedAt
				})
			},
			{
				label: `Save article metadata: ${selectedArticle.slug}`,
				source: 'EditorContentSection'
			}
		);

		if (!response.ok) {
			articleSaveStatus = 'error';
			articleErrorMessage = ((await response.json()) as { error?: string }).error ?? 'Save failed.';
			return;
		}

		const payload = (await response.json()) as { record?: { updatedAt?: string | null } };
		const updatedAt = payload.record?.updatedAt ?? new Date().toISOString();
		articleSaveStatus = 'saved';
		onarticlesaved?.({
			slug: selectedArticle.slug,
			title: articleTitle,
			description: articleDescription,
			excerpt: articleExcerpt,
			date: articlePublishedAt,
			tags: normalizeTags(articleTags),
			updatedAt
		});
	}
</script>

<section class="content-section">
	<header class="content-hero">
		<div>
			<h2 class="content-hero__title">Content</h2>
			<p class="content-hero__body">
				Projects now store markdown body content here, while articles keep mdsvex bodies and let
				you edit the metadata that drives cards, SEO, and navigation.
			</p>
		</div>
		<span class="content-hero__pill">Server-backed</span>
	</header>

	<div class="content-grid">
		<section class="content-card">
			<div class="content-card__header">
				<div>
					<p class="content-card__title">Projects</p>
					<p class="content-card__subtitle">Canonical markdown body content</p>
				</div>
				<span class="content-card__meta">{projects.length} items</span>
			</div>

			<div class="content-shell">
				<nav class="content-list" aria-label="Project content records">
					{#each projects as project (project.id)}
						<button
							type="button"
							class="content-list__item"
							class:active={selectedProjectId === project.id}
							onclick={() => loadProjectForm(project)}
						>
							<span class="content-list__label">{project.title}</span>
							<span class="content-list__meta">{project.id}</span>
						</button>
					{/each}
				</nav>

				{#if selectedProject}
					<div class="content-form">
						<label class="field">
							<span class="field__label">Description</span>
							<textarea bind:value={projectDescription} rows="3"></textarea>
						</label>

						<label class="field">
							<span class="field__label">Card excerpt</span>
							<textarea bind:value={projectExcerpt} rows="3"></textarea>
						</label>

						<label class="field">
							<span class="field__label">Markdown body</span>
							<textarea bind:value={projectBodyMarkdown} rows="14"></textarea>
						</label>

						<div class="content-form__footer">
							<p class="content-status">{formatUpdatedAt(selectedProject.updatedAt)}</p>
							<button
								type="button"
								class="save-button"
								onclick={() => void saveProject()}
								disabled={projectSaveStatus === 'saving'}
							>
								{projectSaveStatus === 'saving' ? 'Saving...' : 'Save project content'}
							</button>
						</div>

						{#if projectErrorMessage}
							<p class="content-error">{projectErrorMessage}</p>
						{/if}
					</div>
				{/if}
			</div>
		</section>

		<section class="content-card">
			<div class="content-card__header">
				<div>
					<p class="content-card__title">Articles</p>
					<p class="content-card__subtitle">Metadata overrides for mdsvex essays</p>
				</div>
				<span class="content-card__meta">{articles.length} items</span>
			</div>

			<div class="content-shell">
				<nav class="content-list" aria-label="Article content records">
					{#each articles as article (article.slug)}
						<button
							type="button"
							class="content-list__item"
							class:active={selectedArticleSlug === article.slug}
							onclick={() => loadArticleForm(article)}
						>
							<span class="content-list__label">{article.title}</span>
							<span class="content-list__meta">{article.slug}</span>
						</button>
					{/each}
				</nav>

				{#if selectedArticle}
					<div class="content-form">
						<label class="field">
							<span class="field__label">Title</span>
							<input bind:value={articleTitle} type="text" />
						</label>

						<label class="field">
							<span class="field__label">Published date</span>
							<input bind:value={articlePublishedAt} type="date" />
						</label>

						<label class="field">
							<span class="field__label">Tags</span>
							<input bind:value={articleTags} type="text" placeholder="svelte, design, notes" />
						</label>

						<label class="field">
							<span class="field__label">Description</span>
							<textarea bind:value={articleDescription} rows="3"></textarea>
						</label>

						<label class="field">
							<span class="field__label">Card excerpt</span>
							<textarea bind:value={articleExcerpt} rows="3"></textarea>
						</label>

						<div class="content-form__footer">
							<p class="content-status">{formatUpdatedAt(selectedArticle.updatedAt)}</p>
							<button
								type="button"
								class="save-button"
								onclick={() => void saveArticle()}
								disabled={articleSaveStatus === 'saving'}
							>
								{articleSaveStatus === 'saving' ? 'Saving...' : 'Save article metadata'}
							</button>
						</div>

						{#if articleErrorMessage}
							<p class="content-error">{articleErrorMessage}</p>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	</div>
</section>

<style>
	.content-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.content-hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background:
			radial-gradient(circle at top right, rgba(90, 150, 255, 0.12), transparent 32%),
			var(--surface);
	}

	.content-hero__title {
		margin: 0 0 0.35rem;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.content-hero__body {
		margin: 0;
		max-width: 48rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.content-hero__pill {
		flex-shrink: 0;
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--caroline-blue-600) 18%, var(--surface));
		color: var(--caroline-blue-700);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.content-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.content-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
	}

	.content-card__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.content-card__title {
		margin: 0 0 0.2rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.content-card__subtitle,
	.content-card__meta,
	.content-status {
		margin: 0;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.content-shell {
		display: grid;
		grid-template-columns: 14rem 1fr;
		gap: 1rem;
	}

	.content-list {
		display: grid;
		gap: 0.5rem;
		max-height: 42rem;
		overflow-y: auto;
		padding: 0.125rem;
	}

	.content-list__item {
		display: grid;
		gap: 0.2rem;
		padding: 0.75rem 0.9rem;
		border-radius: 0.8rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--background);
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			transform 0.15s ease;
	}

	.content-list__item:hover,
	.content-list__item.active {
		border-color: var(--text-primary);
		transform: translateY(-0.0625rem);
	}

	.content-list__label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.content-list__meta {
		font-size: 0.72rem;
		color: var(--text-muted);
		font-family: 'JetBrains Mono', monospace;
	}

	.content-form {
		display: grid;
		gap: 0.9rem;
	}

	.field {
		display: grid;
		gap: 0.35rem;
	}

	.field__label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.field input,
	.field textarea {
		width: 100%;
		padding: 0.75rem 0.85rem;
		border-radius: 0.8rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--background);
		color: var(--text-primary);
		font: inherit;
		resize: vertical;
	}

	.field textarea {
		min-height: 7rem;
	}

	.content-form__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.save-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.7rem 1rem;
		border: none;
		border-radius: 0.65rem;
		background: var(--text-primary);
		color: var(--page-bg);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.save-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.content-error {
		margin: 0;
		font-size: 0.8rem;
		color: #dc2626;
	}

	@media (max-width: 72rem) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 56rem) {
		.content-shell {
			grid-template-columns: 1fr;
		}
	}
</style>
