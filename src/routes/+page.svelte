<script lang="ts">
	import SiteCanvas from '$lib/components/SiteCanvas.svelte';
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import Articles from '$lib/components/Articles.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import discoImage from '$lib/images/photos/disco.jpeg';
	import fakemonImage from '$lib/images/fakemon-generator.png';
	import nuzlockeImage from '$lib/images/nuzlocke-generator.jpg';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
</script>

<section class="relative w-screen min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/" active>Home</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			<HeaderNavItem href="/canvas">Canvas</HeaderNavItem>
		</HeaderNav>
	</Header>

	<div class="flex justify-center items-center py-14 px-4">
		<h1 class="uppercase text-5xl font-sans font-bold text-center">
			Hi my name's Emma. This is my website.
		</h1>
	</div>

	<div class="content-grid max-w-6xl mx-auto px-4 py-8 mt-16">
		<div class="flex flex-col lg:flex-row gap-8">
			<div class="flex-1">
				<Articles class="w-full" />
			</div>
			<aside class="lg:w-80 flex-shrink-0">
				<DiscoBlock
					image={discoImage}
					alt="Disco photo"
					caption="Disco vibes"
					class="w-full h-64 sticky top-24"
				/>
			</aside>
		</div>
	</div>

	<section class="projects-section border-t border-[var(--liver-brown-200)] bg-[var(--light-rose-500)]/40">
		<div class="max-w-6xl mx-auto px-4 py-12 space-y-8">
			<header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
				<div>
					<h2 class="text-3xl font-bold text-[var(--liver-brown-700)] font-serif tracking-tight">
						Projects
					</h2>
					<p class="text-[var(--liver-brown-500)] mt-1 text-lg opacity-80">
						Selected experiments, tools, and side quests.
					</p>
				</div>
			</header>

			<div class="grid gap-6 md:grid-cols-2">
				<ProjectBlock
					title="Fakemon Generator"
					pill="Creative coding"
					image={fakemonImage}
					class="md:col-span-1"
					contentClassName="md:flex-row md:items-center"
					imageClassName="md:translate-x-0 md:ml-4"
				>
					{#snippet description()}
						A playful generator for imaginary Pokémon-style creatures, blending design systems,
						randomness, and cozy UI details.
					{/snippet}
				</ProjectBlock>

				<ProjectBlock
					title="Nuzlocke Tracker"
					pill="UX for constraints"
					image={nuzlockeImage}
					class="md:col-span-1"
					contentClassName="md:flex-row md:items-center"
					imageClassName="md:translate-x-0 md:ml-4"
				>
					{#snippet description()}
						A companion app for challenge runs that keeps teams, routes, and tense decisions tidy
						without losing the charm of notebooks and scribbles.
					{/snippet}
				</ProjectBlock>
			</div>
		</div>
	</section>
</section>