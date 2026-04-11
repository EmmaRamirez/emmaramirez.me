<script lang="ts">
	import { headerColor, title } from '$lib/stores';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { getArticleBySlug, getArticleNeighbors } from '$lib/articles';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { dev } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { formatRelativeDate } from '$lib/utils';

	let { data }: import('./$types').PageProps = $props();

	const article = $derived(getArticleBySlug(data.slug)!);
	const essayNeighbors = $derived(getArticleNeighbors(data.slug));
	const prevArticle = $derived(essayNeighbors.prev);
	const nextArticle = $derived(essayNeighbors.next);

	$effect(() => {
		title.set(`blog/${data.title.toLowerCase()}`);
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
		return formatRelativeDate(dateStr);
	}

	function getBlogHref(tag: string | null = page.url.searchParams.get('tag')) {
		const searchParams = new URLSearchParams();
		if (tag) searchParams.set('tag', tag);

		const view = page.url.searchParams.get('view');
		if (view === 'web') {
			searchParams.set('view', view);
		}

		const query = searchParams.toString();
		return query ? `${resolve('/blog')}?${query}` : resolve('/blog');
	}

	function getTagHref(tag: string) {
		return getBlogHref(tag);
	}

	function isEditableTarget(target: EventTarget | null) {
		return (
			target instanceof HTMLElement &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
		);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.metaKey || event.ctrlKey || event.altKey || isEditableTarget(event.target)) return;
		if (event.key.toLowerCase() !== 'b') return;

		event.preventDefault();
		void goto(getBlogHref());
	}

	const readingTime = $derived(data.readingTimeMinutes);
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>{data.title} — Emma Ramirez</title>
	<meta name="description" content={data.description} />
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
			<HeaderNavItem href="/blog" active>Essays</HeaderNavItem>
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

	<article bind:this={articleElement} class="article-container mx-auto max-w-2xl px-6 py-16">
		<a
			href={getBlogHref()}
			aria-keyshortcuts="B"
			class="style-none group mb-12 inline-flex items-center gap-3 text-sm text-(--text-muted) transition-colors hover:text-(--text-primary)"
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
			<span class="font-sans">Back to essays</span>
			<span class="back-link-shortcut" aria-hidden="true">
				<kbd>B</kbd>
			</span>
		</a>

		<header class="mb-12" in:fly={{ y: 20, duration: 400, delay: 100 }}>
			<div class="mb-6 flex items-center gap-3">
				<span class="block h-12 w-12 rounded-full bg-(--text-primary) opacity-5"></span>
				<div class="flex flex-col gap-1">
					{#if data.tags && data.tags.length > 0}
						<div class="flex gap-2">
							{#each data.tags as tag (tag)}
								<a
									href={getTagHref(tag)}
									class="style-none font-sans text-[0.6875rem] tracking-[0.2em] text-(--text-muted) uppercase transition-colors hover:text-(--text-primary)"
								>
									{tag}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<h1
				class="mb-6 font-serif text-3xl leading-tight text-(--text-primary) md:text-4xl lg:text-5xl"
			>
				{data.title}
			</h1>

			<div class="flex items-center gap-4 font-sans text-sm text-(--text-muted)">
				{#if data.date}
					<time datetime={data.date}>
						{formatDate(data.date)}
					</time>
				{/if}
				<span class="h-1 w-1 rounded-full bg-(--text-muted) opacity-50"></span>
				<span>{readingTime} min read</span>
			</div>
		</header>

		<div class="article-content prose-custom" in:fly={{ y: 20, duration: 400, delay: 200 }}>
			<article.component />
		</div>

		{#if data.tags && data.tags.length > 0}
			<footer
				class="mt-16 border-t border-(--border-color) pt-8"
				in:fly={{ y: 20, duration: 400, delay: 300 }}
			>
				<div class="flex flex-wrap gap-2">
					{#each data.tags as tag (tag)}
						<a
							href={getTagHref(tag)}
							class="style-none rounded-full border border-(--border-color) px-3 py-1.5 font-sans text-xs tracking-wider text-(--text-secondary) uppercase transition-all hover:border-(--text-primary) hover:bg-(--text-primary) hover:text-(--page-bg)"
						>
							{tag}
						</a>
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
					{#if prevArticle}
						<a
							href={resolve('/blog/[slug]', { slug: prevArticle.slug })}
							class="style-none group block"
						>
							<span
								class="mb-1 block font-sans text-xs tracking-wider text-(--text-muted) uppercase"
							>
								← Previous
							</span>
							<span
								class="font-serif text-base text-(--text-primary) transition-colors group-hover:text-(--link-hover)"
							>
								{prevArticle.frontmatter.title}
							</span>
						</a>
					{/if}
				</div>
				<div class="text-right">
					{#if nextArticle}
						<a
							href={resolve('/blog/[slug]', { slug: nextArticle.slug })}
							class="style-none group block"
						>
							<span
								class="mb-1 block font-sans text-xs tracking-wider text-(--text-muted) uppercase"
							>
								Next →
							</span>
							<span
								class="font-serif text-base text-(--text-primary) transition-colors group-hover:text-(--link-hover)"
							>
								{nextArticle.frontmatter.title}
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

	.prose-custom :global(p) {
		margin-bottom: 1.5rem;
	}

	.prose-custom :global(h2) {
		font-family: 'Source Serif 4', serif;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 3rem;
		margin-bottom: 1rem;
		position: relative;
	}

	.prose-custom :global(h3) {
		font-family: 'Source Serif 4', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	.prose-custom :global(blockquote) {
		margin: 2.5rem 0;
		padding: 1.5rem 2rem;
		border-left: 0.1875rem solid var(--text-primary);
		background: var(--page-bg-subtle);
		font-style: italic;
		font-size: 1.25rem;
		color: var(--text-primary);
	}

	.prose-custom :global(blockquote p) {
		margin-bottom: 0;
	}

	.prose-custom :global(p:first-of-type::first-letter) {
		float: left;
		font-family: 'Source Serif 4', serif;
		font-size: 4rem;
		line-height: 0.8;
		padding-right: 0.5rem;
		padding-top: 0.25rem;
		color: var(--text-primary);
		font-weight: 600;
	}

	.prose-custom :global(a) {
		color: var(--text-primary);
		text-decoration: underline;
		text-decoration-thickness: 0.0625rem;
		text-underline-offset: 0.1875rem;
		transition: text-decoration-color 0.2s ease;
	}

	.prose-custom :global(a:hover) {
		text-decoration-color: var(--text-muted);
	}

	/* Code styling */
	.prose-custom :global(code) {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.9em;
		padding: 0.2em 0.4em;
		background: var(--page-bg-subtle);
		border-radius: 0.25rem;
	}

	.prose-custom :global(pre) {
		margin: 1.5rem 0;
		padding: 1rem 1.25rem;
		background: var(--page-bg-subtle);
		border-radius: 0.5rem;
		overflow-x: auto;
	}

	.prose-custom :global(pre code) {
		padding: 0;
		background: none;
	}

	/* List styling */
	.prose-custom :global(ul),
	.prose-custom :global(ol) {
		margin: 1.5rem 0;
		padding-left: 1.5rem;
	}

	.prose-custom :global(li) {
		margin-bottom: 0.5rem;
	}

	.prose-custom :global(li::marker) {
		color: var(--text-muted);
	}

	/* Strong/emphasis */
	.prose-custom :global(strong) {
		color: var(--text-primary);
		font-weight: 600;
	}

	.prose-custom :global(em) {
		font-style: italic;
	}

	/* Horizontal rule */
	.prose-custom :global(hr) {
		margin: 3rem 0;
		border: none;
		border-top: 0.0625rem solid var(--border-color);
	}

	.back-link-shortcut {
		display: inline-flex;
		align-items: center;
	}

	.back-link-shortcut kbd {
		padding: 0.18rem 0.42rem;
		border: 0.0625rem solid color-mix(in srgb, var(--text-muted) 65%, transparent);
		border-radius: 0.45rem;
		background: color-mix(in srgb, var(--page-bg-subtle) 82%, white 18%);
		color: var(--text-primary);
		font-family: var(--font-mono, 'IBM Plex Mono', monospace);
		font-size: 0.72rem;
		line-height: 1;
	}
</style>
