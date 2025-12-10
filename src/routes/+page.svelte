<script lang="ts">
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import ArticleBlock from '$lib/components/ArticleBlock.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import {
		type Item,
		getHomepageItems,
		itemKey,
		getProject,
		getArticle,
		getDisco
	} from './+page';

	const shuffledItems = getHomepageItems();
</script>

<section class="relative w-screen min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/" active class="text-black">Home</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			<HeaderNavItem href="/canvas">Canvas</HeaderNavItem>
		</HeaderNav>
	</Header>

	<div class="flex justify-center items-center py-14 px-4">
		<h1
			class="text-5xl font-sans font-bold text-center uppercase flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
		>
			<span>Hi my name's</span>
			<span
				class="inline-flex flex-col items-center justify-center leading-none mx-2 align-middle"
			>
				<span class="tracking-[0.35em] w-full text-balance font-bold">EM</span>
				<span class="block h-[1rem] w-full bg-current my-[0.15em]"></span>
				<span class="tracking-[0.35em] w-full text-balance font-bold">MA</span>
			</span>
			<span>. This is my website.</span>
		</h1>
	</div>

	<div class="content-grid max-w-6xl mx-auto px-4 py-8 mt-16">
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-min">
			{#each shuffledItems as item (itemKey(item))}
				{#if item.kind === 'article'}
					<ArticleBlock
						title={item.article.title}
						content={item.article.content}
						date={item.article.date}
						tags={item.article.tags}
						width="lg"
						articleId={item.article.id}
						class="h-full hover:border-[var(--liver-brown-700)] hover:shadow-md"
						contentClass="line-clamp-4"
					/>
				{:else if item.kind === 'project'}
					{#if item.id === 'fakemon'}
						<ProjectBlock
							title="Fakemon Generator"
							pill="Creative coding"
							image={fakemonImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								A playful generator for imaginary Pokémon-style creatures, blending
								design systems, randomness, and cozy UI details.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'nuzlocke'}
						<ProjectBlock
							title="Nuzlocke Tracker"
							pill="UX for constraints"
							image={nuzlockeImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								A companion app for challenge runs that keeps teams, routes, and tense
								decisions tidy without losing the charm of notebooks and scribbles.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'site'}
						<ProjectBlock
							title="This Personal Site"
							pill="Design systems"
							image={profileImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								The hand-rolled design system and SvelteKit setup that powers this very
								site, experimenting with typography, tokens, and a slightly feral layout
								grid.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'discoProject'}
						<ProjectBlock
							title="Disco Canvas"
							pill="Playful interfaces"
							image={houstonImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								An interactive playground for gradients, blobs, and motion—built to feel
								like a disco floor you can doodle on.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'paraglide'}
						<ProjectBlock
							title="Paraglide Playground"
							pill="i18n & UX"
							image={svelteWelcomeImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								A multilingual SvelteKit demo using Paraglide that stress-tests copy,
								layout, and tone across languages without turning the UI into a
								spreadsheet.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'designSystemLab'}
						<ProjectBlock
							title="Design System Lab"
							pill="Design systems"
							image={svelteLogoImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								A sandbox for tokens, components, and documentation that explores how far a
								Svelte-powered design system can be pushed before it begs for refactors.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'commitGarden'}
						<ProjectBlock
							title="Commit Garden"
							pill="Developer tooling"
							image={githubImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								A tiny dashboard that turns git history into a garden view, nudging you
								toward smaller, story-shaped commits instead of one giant \"final-final\"
								push.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'palettePlayground'}
						<ProjectBlock
							title="Palette Playground"
							pill="Color & theming"
							image={profileAltImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								An interactive color lab for testing palettes against real content, dark
								mode, and accessibility constraints without leaving the browser.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'a11yAuditKit'}
						<ProjectBlock
							title="A11y Audit Kit"
							pill="Accessibility"
							image={redbullImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								A weekend-sized toolkit for running lightweight accessibility audits—checklists,
								notes, and quick wins bundled into a friendly interface.
							{/snippet}
						</ProjectBlock>
					{:else if item.id === 'readmeStudio'}
						<ProjectBlock
							title="README Studio"
							pill="Writing & docs"
							image={profileImage}
							class="h-full"
							contentClassName="md:flex-row md:items-center"
							imageClassName="md:translate-x-0 md:ml-4"
						>
							{#snippet description()}
								A structured editor for project READMEs that helps you go from blank page to
								clear, kind documentation without feeling like a corporate template.
							{/snippet}
						</ProjectBlock>
					{/if}
				{:else if item.kind === 'disco'}
					<DiscoBlock
						image={discoImage}
						alt="Disco photo"
						caption="Disco vibes"
						class="w-full h-full"
					/>
				{/if}
			{/each}
		</div>
	</div>
</section>