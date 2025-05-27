<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import nuzlocke from '$lib/images/nuzlocke-generator.jpg';
	import profile from '$lib/images/profile.png';
	import ArticleBlock from '$lib/components/ArticleBlock.svelte';
	import TopLanguages from '$lib/components/TopLanguages.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import Bloblet from '$lib/components/Bloblet.svelte';
	import Bloblet3 from '$lib/components/Bloblet3.svelte';
	import { parseDataPoints, parseSVGPath } from '$lib/utils';
	import disco from '$lib/images/photos/disco.jpeg';
	import redbull from '$lib/images/photos/redbull.jpeg';
	import ImageBlock from '$lib/components/ImageBlock.svelte';
	import fakemonGenerator from '$lib/images/fakemon-generator.png';
	import InterestsBlock from '$lib/components/InterestsBlock.svelte';
	import houston from '$lib/images/photos/houston.jpeg';
	import profile2 from '$lib/images/profile-2.png';
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';

	const newPoints = parseDataPoints(
		'M48.7387 180.368C120.837 131.797 215.458 24.6285 162.512 5.84484C109.565 -12.9388 140.297 28.8492 63.6784 2.88881C-12.94 -23.0716 -23.3593 228.94 48.7387 180.368Z'
	);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="relative grid grid-cols-3 gap-4 gap-y-8">
	<!-- <Bloblet class="absolute top-0 left-[-2rem] z-index-[-1] " /> -->

	<Bloblet3
		id={1}
		class="z-index-[-1] absolute top-0 left-[-2rem] "
		startColor="var(--magic-mint-500)"
		stopColor="var(--magic-mint-500)"
		numPoints={12}
		radius={80}
	/>

	<div class="profile relative z-2 col-span-2 flex items-center gap-4">
		<div class="profile-image">
			<img src={profile} alt="Emma" />
		</div>

		<div class="profile-text text-2xl">
			<h1>my name's emma.</h1>
			<p>i'm into startups, finance, and fashion.</p>
		</div>
	</div>

	<ArticleBlock
		title="this is an article"
		content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam..."
	/>

	<Bloblet3
		id={2}
		class="absolute top-[-2vh] right-0 z-[-1]"
		startColor="var(--transit-yellow-500)"
		stopColor="var(--transit-yellow-500)"
	/>

	<TopLanguages />

	<aside class="self-center text-xl">
		<p>
			Feel free to browse <a href="/archives">the archives</a>, check out my
			<a href="https://github.com/emmaramirez">Github</a>, or add me on
			<a href="https://discord.com/users/1234567890">discord</a>.
		</p>
	</aside>

	<InterestsBlock />

	<DiscoBlock
		class="disco-cursor translate-x-[4vw] translate-y-[-6vh] transition-all duration-300"
		image={disco}
		alt="disco"
		caption="i'm good at disco"
	/>

	<ProjectBlock
		class=" ml-[-2rem]"
		title="nuzlocke-generator"
		pill="v1.16.0"
		image={'https://placehold.co/300x200'}
	>
		{#snippet description()}
			a nuzlocke documentation engine written with <strong>react, typescript</strong> and
			<strong>web-workers.</strong> can parse pokemon save data from emulators and cartridges on the
			browser and display them it as an image.
		{/snippet}
	</ProjectBlock>

	<ArticleBlock
		class="ml-8 self-center justify-self-center"
		title="vibe coding is here. is it any good?"
		content="okay so by the time you're reading this, you've probably heard about vibe coding. it's a new way to code, and it's a new way to think about code."
		width="lg"
	/>

	<Bloblet3
		id={3}
		class="absolute top-[50vh] left-[20vh] z-[-1] scale-200"
		startColor="var(--caroline-blue-500)"
		stopColor="var(--caroline-blue-500)"
		numPoints={24}
		radius={80}
	/>

	<ProjectBlock
		class="translate-x-[8vw] translate-y-[2vh]"
		contentClassName="flex-row flex-grow "
		imageClassName="absolute top-0 right-0 translate-x-[2vw] translate-y-[18vh]"
		title="fakemon-generator"
		pill="v2.0.0"
		image="https://placehold.co/200x100"
	>
		{#snippet description()}
			a pokemon generator written with <strong>svelte, typescript</strong> and
			<strong>gemini AI</strong>. it generates pokemon based on a prompt and adds them to a
			universally shared grid with user-submitted data
		{/snippet}
	</ProjectBlock>

	<ArticleBlock
		class="col-span-2 mt-8 mb-8 self-center justify-self-center"
		title="exploring the pipeline operator"
		content="a less commonly heard about proposal is that for the pipeline operator, which looks like..."
		width="lg"
	/>

	<ImageBlock
		class="translate-x-[4vw] translate-y-[4vh] transition-all duration-300"
		image={houston}
		alt="disco"
	>
		{#snippet children()}
			<div
				class="location-text absolute top-[26vh] w-full p-4 font-sans text-[3rem] font-bold text-[var(--sandy-tan-500)] bg-blend-multiply"
			>
				Houston, TX
			</div>
		{/snippet}
	</ImageBlock>

	<div
		class="circle absolute top-[94vh] left-[-15vh] z-[-1] h-[30vh] w-[30vh] rounded-full bg-[var(--liver-brown-500)]"
	></div>

	<div class="empty h-64 w-64"></div>

	<div
		class="commit-block h-22 rounded-lg border border-[var(--liver-brown-500)] bg-[var(--lawn-green-500)] font-sans"
	>
		<div class="flex justify-between border-b border-[var(--lawn-green-900)] p-2 pb-2 items-center">
			<div class="commit-block-text">fix: fix game selection bug</div>
			<div class="commit-block-hash font-mono text-s bg-[var(--lawn-green-600)] px-2 rounded-lg">bef44aa</div>
		</div>
		<div class="commit-block-date p-2">committed 3 weeks ago</div>
	</div>

	<div class="empty col-span-3 h-64 w-64"></div>
</section>

<style>
	.location-text {
		/* -webkit-text-stroke: 2px black; */
	}
</style>
