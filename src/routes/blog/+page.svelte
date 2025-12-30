<script lang="ts">
	import { headerColor, title } from '$lib/stores';
	import { getArticleMetas, getAllTags, type ArticleMeta } from '$lib/articles';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { fade, fly } from 'svelte/transition';
	import { formatShortDate } from '$lib/utils';

	title.set('blog');
	headerColor.set('var(--page-bg-subtle)');

	const articles = getArticleMetas();
	const allTags = getAllTags();

	const articlesByYear = $derived.by(() => {
		const grouped = new Map<string, ArticleMeta[]>();
		for (const article of articles) {
			const year = article.date ? new Date(article.date).getFullYear().toString() : 'Undated';
			if (!grouped.has(year)) {
				grouped.set(year, []);
			}
			grouped.get(year)!.push(article);
		}
		return [...grouped.entries()].sort((a, b) => b[0].localeCompare(a[0]));
	});

	let selectedTag = $state<string | null>(null);

	const filteredArticlesByYear = $derived.by(() => {
		if (!selectedTag) return articlesByYear;

		const filtered = new Map<string, ArticleMeta[]>();
		for (const article of articles) {
			if (article.tags?.includes(selectedTag)) {
				const year = article.date ? new Date(article.date).getFullYear().toString() : 'Undated';
				if (!filtered.has(year)) {
					filtered.set(year, []);
				}
				filtered.get(year)!.push(article);
			}
		}
		return [...filtered.entries()].sort((a, b) => b[0].localeCompare(a[0]));
	});

	function formatDate(dateStr: string | undefined) {
		return formatShortDate(dateStr);
	}
</script>

<svelte:head>
	<title>Blog — Emma Ramirez</title>
	<meta
		name="description"
		content="Essays on design, development, and the craft of building things."
	/>
</svelte:head>

<section class="relative w-full min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/">Home</HeaderNavItem>
			<HeaderNavItem href="/blog" active class="text-(--text-primary)">Essays</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
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

	<div class="blog-container mx-auto max-w-2xl px-6 py-16">
		<header class="mb-16" in:fade={{ duration: 400 }}>
			<div class="flex items-center gap-3 mb-4">
				<span class="inline-block w-8 h-px bg-(--text-muted)"></span>
				<span class="text-xs uppercase tracking-[0.3em] text-(--text-muted) font-sans"
					>Writing</span
				>
			</div>
			<h1 class="text-4xl md:text-5xl font-serif leading-tight text-(--text-primary) mb-4">
				Essays & Notes
			</h1>
			<p class="text-lg text-(--text-secondary) leading-relaxed max-w-xl">
				Thoughts on design, development, and the quiet craft of building things that work.
			</p>
		</header>

		<nav class="mb-12 pb-6 border-b border-(--border-color)" in:fade={{ duration: 400, delay: 100 }}>
			<div class="flex flex-wrap gap-2">
				<button class="tag-pill {selectedTag === null ? 'active' : ''}" onclick={() => selectedTag = null}>
					All
				</button>
				{#each allTags as tag}
					<button
						class="tag-pill {selectedTag === tag ? 'active' : ''}"
						onclick={() => selectedTag = selectedTag === tag ? null : tag}
					>
						{tag}
					</button>
				{/each}
			</div>
		</nav>

		<div class="space-y-12">
			{#each filteredArticlesByYear as [year, yearArticles], yearIndex (year)}
				<section class="year-section" in:fly={{ y: 20, duration: 400, delay: 150 + yearIndex * 50 }}>
					<div class="flex items-center gap-4 mb-6">
						<h2 class="text-sm font-mono text-(--text-muted) tabular-nums">{year}</h2>
						<span class="flex-1 h-px bg-(--border-color) opacity-50"></span>
					</div>

					<ul class="space-y-1">
						{#each yearArticles as article (article.slug)}
							<li>
								<a
									href={`/blog/${article.slug}`}
									class="article-row style-none group flex items-baseline justify-between gap-4 py-3 border-b border-(--border-color) border-opacity-30 hover:border-opacity-100 transition-all"
								>
									<div class="flex-1 min-w-0">
										<span
											class="article-title text-base text-(--text-primary) group-hover:text-(--link-hover) transition-colors"
										>
											{article.title}
										</span>
										{#if article.tags && article.tags.length > 0}
											<span class="hidden sm:inline-flex gap-1.5 ml-3">
												{#each article.tags.slice(0, 2) as tag}
													<span
														class="text-[10px] uppercase tracking-wider text-(--text-muted) font-sans"
													>
														{tag}
													</span>
												{/each}
											</span>
										{/if}
									</div>
									<time
										class="text-sm font-mono text-(--text-muted) tabular-nums whitespace-nowrap"
									>
										{formatDate(article.date)}
									</time>
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>

		<footer class="mt-20 pt-8 border-t border-(--border-color) text-center">
			<p class="text-sm text-(--text-muted) italic">
				{articles.length} essays and counting
			</p>
		</footer>
	</div>
</section>

<style>
	.tag-pill {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		text-transform: lowercase;
		letter-spacing: 0.05em;
		border-radius: 9999px;
		border: 1px solid var(--border-color);
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tag-pill:hover {
		background: var(--page-bg-subtle);
		border-color: var(--text-muted);
	}

	.tag-pill.active {
		background: var(--text-primary);
		color: var(--page-bg);
		border-color: var(--text-primary);
	}

	.article-row:last-child {
		border-bottom: none;
	}

	.article-title {
		font-family: 'Source Serif 4', serif;
		font-weight: 500;
	}

	/* Subtle hover effect */
	.article-row::before {
		content: '';
		position: absolute;
		left: -1rem;
		width: 3px;
		height: 0;
		background: var(--text-primary);
		opacity: 0;
		transition: all 0.2s ease;
	}

	.article-row {
		position: relative;
	}

	.article-row:hover::before {
		height: 100%;
		opacity: 1;
	}
</style>
