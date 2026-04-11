<script lang="ts">
	import { cn, formatLongDate } from '$lib/utils';

	type ArticleCardVariant = 'featured' | 'main';

	interface ArticleCardProps {
		title: string;
		content: string;
		date?: string;
		active?: boolean;
		onselect?: () => void;
		variant?: ArticleCardVariant;
		class?: string;
		readTime?: string;
		tags?: string[];
	}

	let {
		title,
		content,
		date,
		active = false,
		onselect,
		variant = 'main',
		class: className = '',
		readTime,
		tags = []
	}: ArticleCardProps = $props();

	const variants: Record<
		ArticleCardVariant,
		{
			container: string;
			title: string;
			time: string;
			content: string;
		}
	> = {
		main: {
			container: 'gap-2 p-4',
			title: 'text-lg leading-snug font-semibold text-(--text-primary)',
			time: 'text-sm text-(--text-secondary)',
			content: 'article-content text-base leading-relaxed text-(--text-muted)'
		},
		featured: {
			container: 'gap-1.5 p-4',
			title: 'text-base leading-snug font-semibold text-(--text-primary)',
			time: 'text-xs text-(--text-secondary)',
			content: 'article-content text-sm leading-relaxed text-(--text-muted)'
		}
	};

	const styles = $derived(variants[variant]);

	// Estimate read time if not provided
	const estimatedReadTime = $derived(
		readTime ?? `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min read`
	);
</script>

<button
	type="button"
	onclick={onselect}
	class={cn(
		'article-card style-none flex h-full w-full flex-col text-left transition-all duration-200 hover:bg-(--surface-hover) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2',
		styles.container,
		className
	)}
	class:article-card-active={active}
>
	<div class="article-card__header">
		<span
			class="article-label text-xs font-semibold tracking-[0.18em] text-(--text-secondary) uppercase"
		>
			Article
		</span>
		<span class="article-read-time text-xs text-(--text-muted)">{estimatedReadTime}</span>
	</div>
	<span class="article-title {styles.title}">{title}</span>
	{#if date}
		<time class={styles.time} datetime={date}>
			{formatLongDate(date)}
		</time>
	{/if}
	<p class={styles.content}>{content}</p>

	<!-- Extra info shown in roomier card layouts -->
	<div class="article-card__footer">
		<div class="article-card__divider"></div>
		<div class="article-card__meta">
			{#if tags.length > 0}
				<div class="article-card__tags">
					{#each tags.slice(0, 3) as tag (tag)}
						<span class="article-card__tag">{tag}</span>
					{/each}
				</div>
			{/if}
			<span class="article-card__cta">
				Read more
				<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="M6 4l4 4-4 4"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
		</div>
	</div>
</button>

<style>
	.article-card {
		cursor: pointer;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
		border-radius: 0.75rem;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
		/* Avoid size containment here: these cards live in an auto-sized grid. */
		container-type: inline-size;
		container-name: article;
	}

	.article-card:hover {
		border-color: var(--text-muted);
		box-shadow: 0 0 0 0.0625rem var(--text-muted);
	}

	.article-card-active {
		background: var(--surface-hover);
		border-color: var(--text-muted);
		box-shadow: 0 0 0 0.0625rem var(--text-muted);
	}

	/* Header layout */
	.article-card__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	/* Read time - hidden by default, shown in roomier containers */
	.article-read-time {
		display: none;
		opacity: 0.7;
	}

	/* Footer - hidden by default */
	.article-card__footer {
		display: none;
		margin-top: auto;
		padding-top: 0.75rem;
	}

	.article-card__divider {
		height: 1px;
		background: linear-gradient(
			90deg,
			var(--border-color),
			var(--lawn-green-500),
			var(--border-color)
		);
		margin-bottom: 0.75rem;
		opacity: 0.6;
	}

	.article-card__meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
	}

	.article-card__tags {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.article-card__tag {
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.125rem 0.5rem;
		background: var(--surface-hover);
		border: 1px solid var(--border-color);
		border-radius: 9999px;
		color: var(--text-muted);
	}

	.article-card__cta {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--lawn-green-600);
		white-space: nowrap;
	}

	/* Default: clamp content to 4 lines */
	:global(.article-content) {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Wider cards can reveal a little more metadata safely. */
	@container article (min-width: 18rem) {
		.article-read-time {
			display: inline;
		}

		:global(.article-content) {
			-webkit-line-clamp: 5;
			line-clamp: 5;
		}
	}

	@container article (min-width: 26rem) {
		.article-card__footer {
			display: block;
		}

		:global(.article-content) {
			-webkit-line-clamp: 6;
			line-clamp: 6;
		}

		:global(.article-title) {
			font-size: 1.375rem;
		}
	}

	@container article (min-width: 36rem) {
		:global(.article-content) {
			-webkit-line-clamp: 8;
			line-clamp: 8;
		}

		:global(.article-title) {
			font-size: 1.5rem;
			line-height: 1.3;
		}

		.article-card__divider {
			opacity: 1;
			height: 2px;
		}
	}
</style>
