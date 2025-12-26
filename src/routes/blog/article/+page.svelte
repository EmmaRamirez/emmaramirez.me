<script lang="ts">
	import { headerColor, title } from '$lib/stores';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { defaultArticles, type Article } from '$lib/articles';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const articleId = $derived($page.url.searchParams.get('id') ?? 'hegel-web-design');
	const article = $derived(defaultArticles.find(a => a.id === articleId) ?? defaultArticles[0]);
	
	const currentIndex = $derived(defaultArticles.findIndex(a => a.id === articleId));
	const prevArticle = $derived(currentIndex > 0 ? defaultArticles[currentIndex - 1] : null);
	const nextArticle = $derived(currentIndex < defaultArticles.length - 1 ? defaultArticles[currentIndex + 1] : null);

	$effect(() => {
		title.set(`blog/${article.title.toLowerCase()}`);
		headerColor.set('var(--page-bg-subtle)');
	});

	let scrollProgress = $state(0);
	let articleElement: HTMLElement;
	
	onMount(() => {
		const handleScroll = () => {
			if (!articleElement) return;
			const rect = articleElement.getBoundingClientRect();
			const scrolled = -rect.top;
			const total = rect.height - window.innerHeight;
			scrollProgress = Math.max(0, Math.min(100, (scrolled / total) * 100));
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function formatDate(dateStr: string | undefined) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const readingTime = $derived(Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200)));
</script>

<svelte:head>
	<title>{article.title} — Emma Ramirez</title>
	<meta name="description" content={article.content.slice(0, 160)} />
</svelte:head>

<div 
	class="fixed top-0 left-0 h-[3px] bg-(--text-primary) z-50 transition-all duration-75"
	style="width: {scrollProgress}%"
></div>

<section class="relative w-full min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/">Home</HeaderNavItem>
			<HeaderNavItem href="/blog" active>Essays</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			<ThemeToggle class="ml-4" />
		</HeaderNav>
	</Header>

	<article 
		bind:this={articleElement}
		class="article-container mx-auto max-w-2xl px-6 py-16"
	>
		<a 
			href="/blog"
			class="style-none inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors mb-12 group"
			in:fade={{ duration: 300 }}
		>
			<svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			<span class="font-sans">Back to essays</span>
		</a>

		<header class="mb-12" in:fly={{ y: 20, duration: 400, delay: 100 }}>
			<div class="mb-6 flex items-center gap-3">
				<span class="block w-12 h-12 rounded-full bg-(--text-primary) opacity-5"></span>
				<div class="flex flex-col gap-1">
					{#if article.tags && article.tags.length > 0}
						<div class="flex gap-2">
							{#each article.tags as tag}
								<a 
									href={`/blog?tag=${tag}`}
									class="style-none text-[11px] uppercase tracking-[0.2em] text-(--text-muted) hover:text-(--text-primary) transition-colors font-sans"
								>
									{tag}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<h1 class="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-(--text-primary) mb-6">
				{article.title}
			</h1>

			<div class="flex items-center gap-4 text-sm text-(--text-muted) font-sans">
				{#if article.date}
					<time datetime={article.date}>
						{formatDate(article.date)}
					</time>
				{/if}
				<span class="w-1 h-1 rounded-full bg-(--text-muted) opacity-50"></span>
				<span>{readingTime} min read</span>
			</div>
		</header>

		<div 
			class="article-content prose-custom"
			in:fly={{ y: 20, duration: 400, delay: 200 }}
		>
			<p class="first-paragraph">
				{article.content}
			</p>

			<p>
				The interplay between form and function has always fascinated me. In the digital realm, 
				we face constraints that both limit and liberate our creativity. The browser window, 
				responsive breakpoints, loading times—these are the boundaries within which we paint.
			</p>

			<h2>The Nature of Cycles</h2>
			<p>
				Looking back at the history of web design, one can trace distinct movements. The early 
				web, constrained by technology, embraced simplicity out of necessity. Then came the era 
				of excess—Flash animations, elaborate navigation systems, and designs that prioritized 
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
				possibilities will unfold. The key is to remain adaptable, to understand that each 
				moment in design history builds upon those that came before.
			</p>
			<p>
				Perhaps the greatest skill a designer can develop is not mastery of tools, but 
				understanding of context. Knowing when to push boundaries and when to honor 
				conventions is what separates craft from mere execution.
			</p>
		</div>

		{#if article.tags && article.tags.length > 0}
			<footer 
				class="mt-16 pt-8 border-t border-(--border-color)"
				in:fly={{ y: 20, duration: 400, delay: 300 }}
			>
				<div class="flex flex-wrap gap-2">
					{#each article.tags as tag}
						<a 
							href={`/blog?tag=${tag}`}
							class="style-none px-3 py-1.5 text-xs font-sans uppercase tracking-wider border border-(--border-color) rounded-full text-(--text-secondary) hover:bg-(--text-primary) hover:text-(--page-bg) hover:border-(--text-primary) transition-all"
						>
							{tag}
						</a>
					{/each}
				</div>
			</footer>
		{/if}

		<nav 
			class="mt-12 pt-8 border-t border-(--border-color)"
			in:fly={{ y: 20, duration: 400, delay: 350 }}
		>
			<div class="grid grid-cols-2 gap-8">
				<div>
					{#if prevArticle}
						<a 
							href={`/blog/article?id=${prevArticle.id}`}
							class="style-none group block"
						>
							<span class="text-xs uppercase tracking-wider text-(--text-muted) font-sans mb-1 block">
								← Previous
							</span>
							<span class="text-base text-(--text-primary) group-hover:text-(--link-hover) transition-colors font-serif">
								{prevArticle.title}
							</span>
						</a>
					{/if}
				</div>
				<div class="text-right">
					{#if nextArticle}
						<a 
							href={`/blog/article?id=${nextArticle.id}`}
							class="style-none group block"
						>
							<span class="text-xs uppercase tracking-wider text-(--text-muted) font-sans mb-1 block">
								Next →
							</span>
							<span class="text-base text-(--text-primary) group-hover:text-(--link-hover) transition-colors font-serif">
								{nextArticle.title}
							</span>
						</a>
					{/if}
				</div>
			</div>
		</nav>
	</article>
</section>

<style>
	/* Custom prose styling */
	.prose-custom {
		font-size: 1.125rem;
		line-height: 1.8;
		color: var(--text-secondary);
	}

	.prose-custom p {
		margin-bottom: 1.5rem;
	}

	.prose-custom h2 {
		font-family: "Source Serif 4", serif;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 3rem;
		margin-bottom: 1rem;
		position: relative;
	}

	/* Decorative marker for h2 */
	.prose-custom h2::before {
		content: '';
		position: absolute;
		left: -1.5rem;
		top: 0.5em;
		width: 4px;
		height: 4px;
		background: var(--text-muted);
		border-radius: 50%;
	}

	.prose-custom blockquote {
		margin: 2.5rem 0;
		padding: 1.5rem 2rem;
		border-left: 3px solid var(--text-primary);
		background: var(--page-bg-subtle);
		font-style: italic;
		font-size: 1.25rem;
		color: var(--text-primary);
	}

	.prose-custom blockquote p {
		margin-bottom: 0;
	}

	/* Drop cap for first paragraph */
	.first-paragraph::first-letter {
		float: left;
		font-family: "Source Serif 4", serif;
		font-size: 4rem;
		line-height: 0.8;
		padding-right: 0.5rem;
		padding-top: 0.25rem;
		color: var(--text-primary);
		font-weight: 600;
	}

	/* Better link styling in content */
	.prose-custom a {
		color: var(--text-primary);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
		transition: text-decoration-color 0.2s ease;
	}

	.prose-custom a:hover {
		text-decoration-color: var(--text-muted);
	}

	/* Code styling */
	.prose-custom code {
		font-family: "JetBrains Mono", "Fira Code", monospace;
		font-size: 0.9em;
		padding: 0.2em 0.4em;
		background: var(--page-bg-subtle);
		border-radius: 0.25rem;
	}

	/* List styling */
	.prose-custom ul, .prose-custom ol {
		margin: 1.5rem 0;
		padding-left: 1.5rem;
	}

	.prose-custom li {
		margin-bottom: 0.5rem;
	}

	.prose-custom li::marker {
		color: var(--text-muted);
	}
</style>
