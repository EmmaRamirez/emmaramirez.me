<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import nuzlocke from '$lib/images/nuzlocke-generator.jpg';
	import profile from '$lib/images/profile.png';
	import ArticleBlock from '$lib/components/ArticleBlock.svelte';
	import TopLanguages from '$lib/components/TopLanguages.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="grid grid-cols-3 gap-4">
	<div class="profile flex items-center gap-2 col-span-2">
		<div class="profile-image">
			<img src={profile} alt="Emma" />
		</div>

		<div class="profile-text">
			<h1>my name's emma.</h1>
			<p>i'm into startups, finance, and fashion.</p>
		</div>
	</div>

	<ArticleBlock
		title="this is an article"
		content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam..."
	/>

	<TopLanguages />

	<aside class="col-span-2">
		<p>
			Feel free to browse <a href="/archives">the archives</a>, check out my
			<a href="https://github.com/emmaramirez">Github</a>, or add me on
			<a href="https://discord.com/users/1234567890">discord</a>.
		</p>
	</aside>

	<ArticleBlock
		title="exploring the pipeline operator"
		content="a less commonly heard about proposal is that for the pipeline operator, which looks like..."
		width="md"
	/>

	<div class="project-block">
		<div class="project-block-header">this is a project</div>
		<div class="project-block-content rounded-lg bg-[var(--light-rose-500)] p-4">
			<div class="flex justify-between">
				<div class="title">/nuzlocke-generator</div>
				<div class="pill rounded-full opacity-50">v1.16.0</div>
			</div>
			<p class="project-block-description">
				a nuzlocke documentation engine written with <strong>react, typescript</strong> and
				<strong>web-workers.</strong> can parse pokemon save data from emulators and cartridges on the
				browser and display them it as an image.
			</p>
			<div class="project-image">
				<img class="h-48" src={nuzlocke} alt="Nuzlocke Generator" />
			</div>
		</div>
	</div>

	<ArticleBlock
		title="vibe coding is here. is it any good?"
		content="okay so by the time you're reading this, you've probably heard about vibe coding. it's a new way to code, and it's a new way to think about code."
		width="lg"
	/>
</section>

<style>
	
</style>
