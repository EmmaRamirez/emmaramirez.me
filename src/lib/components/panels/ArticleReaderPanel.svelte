<script lang="ts">
	import { getArticleBySlug, getArticleNeighbors, type ArticleFull } from '$lib/articles';
	import { formatLongDate } from '$lib/utils';
	import { fly, fade } from 'svelte/transition';

	interface ArticleReaderPanelProps {
		open?: boolean;
		articleSlug?: string | null;
		onclose?: () => void;
		onnavigate?: (articleSlug: string) => void;
	}

	let { open = false, articleSlug = null, onclose, onnavigate }: ArticleReaderPanelProps = $props();

	const article = $derived<ArticleFull | null>(
		articleSlug ? (getArticleBySlug(articleSlug) ?? null) : null
	);

	const articleNeighbors = $derived(getArticleNeighbors(articleSlug));
	const prevArticle = $derived(articleNeighbors.prev);
	const nextArticle = $derived(articleNeighbors.next);

	const readingTime = $derived(article?.readingTimeMinutes ?? 0);

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
			if (article) {
				window.location.href = `/blog/${article.slug}`;
			}
		}

		if (
			(event.key === 'k' || event.key === 'K' || event.key === 'j' || event.key === 'J') &&
			!targetIsTextInput
		) {
			event.preventDefault();
			if ((event.key === 'k' || event.key === 'K') && prevArticle) {
				onnavigate?.(prevArticle.slug);
			}
			if ((event.key === 'j' || event.key === 'J') && nextArticle) {
				onnavigate?.(nextArticle.slug);
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && article}
	{@const ArticleComponent = article.component}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="panel-backdrop"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 150 }}
		onclick={() => onclose?.()}
		onkeydown={(e) => e.key === 'Escape' && onclose?.()}
	></div>
	<aside
		class="article-reader-panel"
		in:fly={{ x: -100, duration: 300, opacity: 1 }}
		out:fly={{ x: -100, duration: 250, opacity: 1 }}
		aria-label="Article reader"
	>
		<header class="panel-header">
			<div class="hotkey-indicators">
				<button class="hotkey-indicator" onclick={() => onclose?.()} aria-label="Close panel">
					<kbd class="key-badge">Esc</kbd>
					<span class="key-label">to close</span>
				</button>
				<div class="hotkey-divider"></div>
				<button
					class="hotkey-indicator"
					onclick={() => article && (window.location.href = `/blog/${article.slug}`)}
					aria-label="Open read mode"
				>
					<kbd class="key-badge">R</kbd>
					<span class="key-label">read mode</span>
				</button>
				{#if prevArticle || nextArticle}
					<div class="hotkey-divider"></div>
					{#if prevArticle}
						<button
							class="hotkey-indicator"
							onclick={() => onnavigate?.(prevArticle.slug)}
							aria-label="Previous article"
						>
							<kbd class="key-badge">K</kbd>
							<span class="key-label">previous</span>
						</button>
					{/if}
					{#if nextArticle}
						<button
							class="hotkey-indicator"
							onclick={() => onnavigate?.(nextArticle.slug)}
							aria-label="Next article"
						>
							<kbd class="key-badge">J</kbd>
							<span class="key-label">next</span>
						</button>
					{/if}
				{/if}
			</div>
			<button class="close-button" onclick={() => onclose?.()} aria-label="Close article panel">
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
			<div class="article-header" in:fade={{ duration: 200, delay: 100 }}>
				{#if article.frontmatter.tags && article.frontmatter.tags.length > 0}
					<div class="article-tags">
						{#each article.frontmatter.tags as tag (tag)}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}

				<h1 class="article-title">{article.frontmatter.title}</h1>

				<div class="article-meta">
					{#if article.frontmatter.date}
						<time datetime={article.frontmatter.date}>
							{formatLongDate(article.frontmatter.date)}
						</time>
					{/if}
					<span class="meta-separator">·</span>
					<span>{readingTime} min read</span>
				</div>
			</div>

			<div class="article-body" in:fade={{ duration: 200, delay: 150 }}>
				<div class="article-style-probe" aria-hidden="true">
					<p></p>
					<h2>Heading</h2>
					<h3>Heading</h3>
					<h4>Heading</h4>
					<blockquote><p></p></blockquote>
				</div>
				<ArticleComponent />
			</div>

			{#if prevArticle || nextArticle}
				<nav class="article-nav" in:fade={{ duration: 200, delay: 200 }}>
					<div class="nav-grid">
						<div class="nav-prev">
							{#if prevArticle}
								<button class="nav-link" onclick={() => onnavigate?.(prevArticle.slug)}>
									<span class="nav-direction">← Previous</span>
									<span class="nav-title">{prevArticle.frontmatter.title}</span>
								</button>
							{/if}
						</div>
						<div class="nav-next">
							{#if nextArticle}
								<button
									class="nav-link nav-link-next"
									onclick={() => onnavigate?.(nextArticle.slug)}
								>
									<span class="nav-direction">Next →</span>
									<span class="nav-title">{nextArticle.frontmatter.title}</span>
								</button>
							{/if}
						</div>
					</div>
				</nav>
			{/if}
		</article>
	</aside>
{/if}

<style>
	.panel-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 59;
		backdrop-filter: blur(2px);
	}

	.article-reader-panel {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: min(68.75rem, 80vw);
		background: var(--page-bg);
		border-right: 0.0625rem solid var(--border-color);
		z-index: 60; /* Above sticky header (z-50) */
		display: flex;
		flex-direction: column;
		box-shadow: 0.5rem 0 2rem -0.5rem rgba(0, 0, 0, 0.15);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.25rem;
		border-bottom: 0.0625rem solid var(--border-color);
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
		border-radius: 0.375rem;
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
		width: 0.0625rem;
		height: 1rem;
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
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.25rem;
		color: var(--text-secondary);
		box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.08);
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
		border-radius: 0.375rem;
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

	.article-header {
		margin-bottom: 2.5rem;
		max-width: 65ch;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tag {
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-muted);
		padding: 0.2rem 0.6rem;
		background: var(--page-bg-subtle);
		border-radius: 6.25rem;
	}

	.article-title {
		font-family: 'Source Serif 4', 'DM Serif Text', serif;
		font-size: 2.25rem;
		font-weight: 600;
		line-height: 1.2;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.meta-separator {
		opacity: 0.5;
	}

	.article-body {
		font-size: 1.125rem;
		line-height: 1.8;
		color: var(--text-secondary);
		max-width: 65ch;
	}

	.article-style-probe {
		display: none;
	}

	/* svelte-ignore css-unused-selector */
	:global(.article-body) p {
		margin-bottom: 1.5rem;
	}

	/* svelte-ignore css-unused-selector */
	:global(.article-body) h2 {
		font-family: 'Source Serif 4', 'DM Serif Text', serif;
		font-size: 1.625rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 2.5rem;
		margin-bottom: 1rem;
	}

	/* svelte-ignore css-unused-selector */
	:global(.article-body) h3 {
		font-family: 'Source Serif 4', 'DM Serif Text', serif;
		font-size: 1.375rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	/* svelte-ignore css-unused-selector */
	:global(.article-body) h4 {
		font-family: 'Source Serif 4', 'DM Serif Text', serif;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	/* svelte-ignore css-unused-selector */
	:global(.article-body) blockquote {
		margin: 2rem 0;
		padding: 1.25rem 1.5rem;
		border-left: 0.1875rem solid var(--text-primary);
		background: var(--page-bg-subtle);
		font-style: italic;
		font-size: 1.25rem;
		color: var(--text-primary);
	}

	/* svelte-ignore css-unused-selector */
	:global(.article-body) blockquote p {
		margin-bottom: 0;
	}

	:global(.article-body p:first-of-type)::first-letter {
		float: left;
		font-family: 'Source Serif 4', serif;
		font-size: 3.5rem;
		line-height: 0.8;
		padding-right: 0.5rem;
		padding-top: 0.2rem;
		color: var(--text-primary);
		font-weight: 600;
	}

	.article-nav {
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 0.0625rem solid var(--border-color);
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
		border-radius: 0.5rem;
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
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	/* Responsive */
	@media (max-width: 64rem) {
		.article-reader-panel {
			width: min(45rem, 85vw);
		}
	}

	@media (max-width: 48rem) {
		.article-reader-panel {
			width: 100vw;
		}
	}
</style>
