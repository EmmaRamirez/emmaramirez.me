<script lang="ts">
	import type { Article } from '$lib/articles';
	import { defaultArticles } from '$lib/articles';
	import { fly, fade } from 'svelte/transition';

	interface ArticleReaderPanelProps {
		open?: boolean;
		articleId?: string | null;
		onclose?: () => void;
	}

	let { open = false, articleId = null, onclose }: ArticleReaderPanelProps = $props();

	// Get article data
	const article = $derived(
		articleId ? defaultArticles.find((a) => a.id === articleId) ?? null : null
	);

	// Find adjacent articles for navigation
	const currentIndex = $derived(articleId ? defaultArticles.findIndex((a) => a.id === articleId) : -1);
	const prevArticle = $derived(currentIndex > 0 ? defaultArticles[currentIndex - 1] : null);
	const nextArticle = $derived(
		currentIndex < defaultArticles.length - 1 ? defaultArticles[currentIndex + 1] : null
	);

	// Reading time estimate
	const readingTime = $derived(
		article ? Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200)) : 0
	);

	function formatDate(dateStr: string | undefined) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			event.preventDefault();
			onclose?.();
		}
	}

	function navigateToArticle(id: string) {
		// This will be handled by parent component
		const customEvent = new CustomEvent('navigatearticle', { detail: { id } });
		document.dispatchEvent(customEvent);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && article}
	<aside
		class="article-reader-panel"
		in:fly={{ x: -100, duration: 300, opacity: 1 }}
		out:fly={{ x: -100, duration: 250, opacity: 1 }}
		aria-label="Article reader"
	>
		<!-- Hotkey indicator header -->
		<header class="panel-header">
			<div class="hotkey-indicator">
				<kbd class="key-badge">Esc</kbd>
				<span class="key-label">to close</span>
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

		<!-- Article content -->
		<article class="panel-content">
			<!-- Article header -->
			<div class="article-header" in:fade={{ duration: 200, delay: 100 }}>
				{#if article.tags && article.tags.length > 0}
					<div class="article-tags">
						{#each article.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}

				<h1 class="article-title">{article.title}</h1>

				<div class="article-meta">
					{#if article.date}
						<time datetime={article.date}>{formatDate(article.date)}</time>
					{/if}
					<span class="meta-separator">·</span>
					<span>{readingTime} min read</span>
				</div>
			</div>

			<!-- Article body -->
			<div class="article-body" in:fade={{ duration: 200, delay: 150 }}>
				<p class="first-paragraph">{article.content}</p>

				<!-- Extended content for demo -->
				<p>
					The interplay between form and function has always fascinated me. In the digital realm, we
					face constraints that both limit and liberate our creativity. The browser window,
					responsive breakpoints, loading times—these are the boundaries within which we paint.
				</p>

				<h2>The Nature of Cycles</h2>
				<p>
					Looking back at the history of web design, one can trace distinct movements. The early
					web, constrained by technology, embraced simplicity out of necessity. Then came the era of
					excess—Flash animations, elaborate navigation systems, and designs that prioritized
					spectacle over substance.
				</p>
				<p>
					Today, we find ourselves in a synthesis phase. We have the technology to create nearly
					anything, yet the best designs exercise restraint. They understand that the medium serves
					the message, not the other way around.
				</p>

				<blockquote>
					<p>"The synthesis is not a compromise. It is a transcendence."</p>
				</blockquote>

				<h2>Looking Forward</h2>
				<p>
					As we move forward, new technologies will emerge, new constraints will form, and new
					possibilities will unfold. The key is to remain adaptable, to understand that each moment
					in design history builds upon those that came before.
				</p>
			</div>

			<!-- Article navigation -->
			{#if prevArticle || nextArticle}
				<nav class="article-nav" in:fade={{ duration: 200, delay: 200 }}>
					<div class="nav-grid">
						<div class="nav-prev">
							{#if prevArticle}
								<button class="nav-link" onclick={() => navigateToArticle(prevArticle.id)}>
									<span class="nav-direction">← Previous</span>
									<span class="nav-title">{prevArticle.title}</span>
								</button>
							{/if}
						</div>
						<div class="nav-next">
							{#if nextArticle}
								<button class="nav-link" onclick={() => navigateToArticle(nextArticle.id)}>
									<span class="nav-direction">Next →</span>
									<span class="nav-title">{nextArticle.title}</span>
								</button>
							{/if}
						</div>
					</div>
				</nav>
			{/if}

			<!-- Link to full article -->
			<div class="full-article-link" in:fade={{ duration: 200, delay: 250 }}>
				<a href={`/blog/article?id=${article.id}`} class="style-none read-full-link">
					Read full article
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
	.article-reader-panel {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: min(1100px, 80vw);
		background: var(--page-bg);
		border-right: 1px solid var(--border-color);
		z-index: 60; /* Above sticky header (z-50) */
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

	.hotkey-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
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
		padding: 2rem;
		scroll-behavior: smooth;
	}

	.article-header {
		margin-bottom: 2rem;
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
		border-radius: 100px;
	}

	.article-title {
		font-family: 'Source Serif 4', 'DM Serif Text', serif;
		font-size: 1.75rem;
		font-weight: 600;
		line-height: 1.25;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.meta-separator {
		opacity: 0.5;
	}

	.article-body {
		font-size: 1rem;
		line-height: 1.75;
		color: var(--text-secondary);
	}

	.article-body p {
		margin-bottom: 1.25rem;
	}

	.article-body h2 {
		font-family: 'Source Serif 4', 'DM Serif Text', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	.article-body blockquote {
		margin: 1.5rem 0;
		padding: 1rem 1.25rem;
		border-left: 2px solid var(--text-primary);
		background: var(--page-bg-subtle);
		font-style: italic;
		color: var(--text-primary);
	}

	.article-body blockquote p {
		margin-bottom: 0;
	}

	.first-paragraph::first-letter {
		float: left;
		font-family: 'Source Serif 4', serif;
		font-size: 3rem;
		line-height: 0.85;
		padding-right: 0.4rem;
		padding-top: 0.15rem;
		color: var(--text-primary);
		font-weight: 600;
	}

	.article-nav {
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

	.full-article-link {
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

	/* Responsive */
	@media (max-width: 1024px) {
		.article-reader-panel {
			width: min(720px, 85vw);
		}
	}

	@media (max-width: 768px) {
		.article-reader-panel {
			width: 100vw;
		}
	}
</style>
