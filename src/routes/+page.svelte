<script lang="ts">
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import type { Article } from '$lib/articles';
	import { getHomepageItems, getProject, getArticle, getDisco } from '$lib/registry/homepage';

	const homepageItems = getHomepageItems();

	const homepageArticles: Article[] = homepageItems
		.filter((item) => item.kind === 'article')
		.map((item) => getArticle(item.article.id)!)
		.slice(0, 10);

	const homepageProjects = homepageItems
		.filter((item) => item.kind === 'project')
		.map((item) => getProject(item.id));

	const disco = getDisco();

	const ESSAYS_LIMIT = 5;
	let essaysExpanded = $state(false);
	const visibleArticles = $derived(
		essaysExpanded ? homepageArticles : homepageArticles.slice(0, ESSAYS_LIMIT)
	);
	const hasMoreArticles = homepageArticles.length > ESSAYS_LIMIT;
</script>

<section class="relative w-full min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/" active class="text-[var(--text-primary)]">Home</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			<HeaderNavItem href="/canvas">Canvas</HeaderNavItem>
			<ThemeToggle class="ml-4" />
		</HeaderNav>
	</Header>

	<div class="mx-auto max-w-3xl px-4 py-16 space-y-12">
		<header class="space-y-4">
			<h1 class="text-4xl md:text-5xl font-serif leading-tight text-[var(--text-primary)]">
				currently building things.
			</h1>
			<p class="text-[var(--text-secondary)]">
				my name's emma and my biggest passion is making stuff with code. i'm into startups, finance, and fashion.
			</p>
		</header>

		<section aria-labelledby="essays-heading" class="space-y-4">
			<h2
				id="essays-heading"
				class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-secondary)]"
			>
				Essays
			</h2>
			<ul class="space-y-3">
				{#each visibleArticles as article (article.id)}
					<li class="flex flex-col gap-1">
						<div class="flex items-baseline justify-between gap-4">
							<a
								href={`/blog/article?id=${article.id}`}
								class="style-none text-base md:text-lg font-semibold text-[var(--text-primary)] hover:underline"
							>
								{article.title}
							</a>
							{#if article.date}
								<span class="text-xs text-[var(--text-secondary)] whitespace-nowrap">
									{article.date}
								</span>
							{/if}
						</div>
						<p class="text-sm text-[var(--text-muted)] line-clamp-2">
							{article.content}
						</p>
					</li>
				{/each}
			</ul>
			{#if hasMoreArticles}
				<button
					onclick={() => (essaysExpanded = !essaysExpanded)}
					class="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline cursor-pointer transition-colors"
				>
					{essaysExpanded ? '← Show less' : `Show all ${homepageArticles.length} essays →`}
				</button>
			{/if}
		</section>

		<section aria-labelledby="projects-heading" class="space-y-4">
			<h2
				id="projects-heading"
				class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-secondary)]"
			>
				Selected projects
			</h2>
			<div class="space-y-4">
				{#each homepageProjects as project (project.id)}
					<ProjectBlock
						title={project.title}
						pill={project.pill}
						image={project.image}
						class={project.class}
						contentClassName={project.contentClassName}
						imageClassName={project.imageClassName}
					>
						{#snippet description()}
							{project.description}
						{/snippet}
					</ProjectBlock>
				{/each}
			</div>
		</section>

		<section aria-labelledby="fun-heading" class="space-y-4">
			<h2
				id="fun-heading"
				class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-secondary)]"
			>
				Just for fun
			</h2>
			<div class="max-w-md">
				<DiscoBlock
					image={disco.image}
					alt={disco.alt}
					caption={disco.caption}
					class={disco.class ?? 'w-full h-full'}
				/>
			</div>
		</section>
	</div>
</section>