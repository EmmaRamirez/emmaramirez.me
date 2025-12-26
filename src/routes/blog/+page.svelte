<script lang="ts">
	import { headerColor, title } from '$lib/stores';
	import { defaultArticles, type Article } from '$lib/articles';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { fade, fly } from 'svelte/transition';

	title.set('blog');
	headerColor.set('var(--page-bg-subtle)');

	// Group articles by year
	const articlesByYear = $derived.by(() => {
		const grouped = new Map<string, Article[]>();
		for (const article of defaultArticles) {
			const year = article.date ? new Date(article.date).getFullYear().toString() : 'Undated';
			if (!grouped.has(year)) {
				grouped.set(year, []);
			}
			grouped.get(year)!.push(article);
		}
		// Sort years descending
		return [...grouped.entries()].sort((a, b) => b[0].localeCompare(a[0]));
	});

	let selectedTag = $state<string | null>(null);
	
	const allTags = $derived.by(() => {
		const tags = new Set<string>();
		for (const article of defaultArticles) {
			article.tags?.forEach(tag => tags.add(tag));
		}
		return [...tags].sort();
	});

	const filteredArticlesByYear = $derived.by(() => {
		if (!selectedTag) return articlesByYear;
		
		const filtered = new Map<string, Article[]>();
		for (const article of defaultArticles) {
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
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Blog — Emma Ramirez</title>
	<meta name="description" content="Essays on design, development, and the craft of building things." />
</svelte:head>

<section class="relative w-full min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/">Home</HeaderNavItem>
			<HeaderNavItem href="/blog" active class="text-(--text-primary)">Essays</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			<ThemeToggle class="ml-4" />
		</HeaderNav>
	</Header>

	<div class="blog-container mx-auto max-w-2xl px-6 py-16">
		<!-- Header -->
		<header class="mb-16" in:fade={{ duration: 400 }}>
			<div class="flex items-center gap-3 mb-4">
				<span class="inline-block w-8 h-px bg-(--text-muted)"></span>
				<span class="text-xs uppercase tracking-[0.3em] text-(--text-muted) font-sans">Writing</span>
			</div>
			<h1 class="text-4xl md:text-5xl font-serif leading-tight text-(--text-primary) mb-4">
				Essays & Notes
			</h1>
			<p class="text-lg text-(--text-secondary) leading-relaxed max-w-xl">
				Thoughts on design, development, and the quiet craft of building things that work.
			</p>
		</header>

		<!-- Tag filter -->
		<nav class="mb-12 pb-6 border-b border-(--border-color)" in:fade={{ duration: 400, delay: 100 }}>
			<div class="flex flex-wrap gap-2">
				<button
					class="tag-pill {selectedTag === null ? 'active' : ''}"
					onclick={() => selectedTag = null}
				>
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

		<!-- Articles by year -->
		<div class="space-y-12">
			{#each filteredArticlesByYear as [year, articles], yearIndex (year)}
				<section 
					class="year-section"
					in:fly={{ y: 20, duration: 400, delay: 150 + yearIndex * 50 }}
				>
					<div class="flex items-center gap-4 mb-6">
						<h2 class="text-sm font-mono text-(--text-muted) tabular-nums">{year}</h2>
						<span class="flex-1 h-px bg-(--border-color) opacity-50"></span>
					</div>
					
					<ul class="space-y-1">
						{#each articles as article, i (article.id)}
							<li>
								<a 
									href={`/blog/article?id=${article.id}`}
									class="article-row style-none group flex items-baseline justify-between gap-4 py-3 border-b border-(--border-color) border-opacity-30 hover:border-opacity-100 transition-all"
								>
									<div class="flex-1 min-w-0">
										<span class="article-title text-base text-(--text-primary) group-hover:text-(--link-hover) transition-colors">
											{article.title}
										</span>
										{#if article.tags && article.tags.length > 0}
											<span class="hidden sm:inline-flex gap-1.5 ml-3">
												{#each article.tags.slice(0, 2) as tag}
													<span class="text-[10px] uppercase tracking-wider text-(--text-muted) font-sans">
														{tag}
													</span>
												{/each}
											</span>
										{/if}
									</div>
									<time class="text-sm font-mono text-(--text-muted) tabular-nums whitespace-nowrap">
										{formatDate(article.date)}
									</time>
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>

		<!-- Footer flourish -->
		<footer class="mt-20 pt-8 border-t border-(--border-color) text-center">
			<p class="text-sm text-(--text-muted) italic">
				{defaultArticles.length} essays and counting
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
		font-family: "Source Serif 4", serif;
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

