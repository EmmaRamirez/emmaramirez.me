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
	import CommitBlock from '$lib/components/CommitBlock.svelte';
	import Bloblet4 from '$lib/components/Bloblet4.svelte';
	import BlobletCreatorBlock from '$lib/components/BlobletCreatorBlock.svelte';
	import { afterNavigate } from '$app/navigation';

	const newPoints = parseDataPoints(
		'M48.7387 180.368C120.837 131.797 215.458 24.6285 162.512 5.84484C109.565 -12.9388 140.297 28.8492 63.6784 2.88881C-12.94 -23.0716 -23.3593 228.94 48.7387 180.368Z'
	);

	afterNavigate(() => {
		document.body.style.backgroundColor = 'var(--sandy-tan-600)';
	})
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
		title="Hegel & Web Design"
		content="As much as web design is a visual medium both restrained and bolstered by technological innovations, I find that it cycles in the same way art movements do. German philosopher Friedrich Hegel split up history into three moments: the thesis, that is the orignal thought, the antithesis, that is the thought that opposes the thesis, and the synthesis, that is the thought that combines the thesis and the antithesis. I think web design starts in the 1990s when the landscape is nothing but text. Innovation appears and takes hold and so do certain design choices -- rounded corners and shadows are that era's holy grail. The antithesis is the 2000s, when the web is a visual medium and design choices are more restrained. The synthesis is the 2010s, when the web is a visual medium and design choices are more restrained. The thesis is the 2020s, when the web is a visual medium and design choices are more restrained."
	/>

	<Bloblet3
		id={2}
		class="absolute top-[-2vh] right-0 z-[-1]"
		startColor="var(--transit-yellow-500)"
		stopColor="var(--transit-yellow-500)"
	/>

	<TopLanguages />

	<aside class="self-center ml-4 text-xl">
		<p>
			Feel free to browse <a href="/archives">the archives</a>, check out my
			<a href="https://github.com/emmaramirez">Github</a>, or add me on
			<a href="https://discord.com/users/1234567890">discord</a>.
		</p>
	</aside>

	<InterestsBlock />

	<DiscoBlock
		class="cursor-disco translate-x-[4vw] translate-y-[-6vh] transition-all duration-300"
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

	

	<div
		class="circle absolute top-[120vh] left-[-15vh] z-[-1] h-[30vh] w-[30vh] rounded-full bg-[var(--liver-brown-500)]"
	></div>


	<CommitBlock
		title="fix: fix game selection bug"
		hash="bef44aa"
		date="committed 3 weeks ago"
		class="self-center translate-x-[4vw] translate-y-[4vh]"
	/>

	<Bloblet3
		id={4}
		class="absolute top-[94vh] left-[20vh] z-[-1] h-[30vh] w-[30vh]"
		startColor="var(--lawn-green-500)"
		stopColor="var(--lawn-green-700)"
		numPoints={12}
		radius={80}
	/>

	<ImageBlock
		class="transition-all duration-300  border-6 border-[var(--liver-brown-500)] bg-[var(--liver-brown-500)]"
		image={houston}
		alt="disco"
	>
		{#snippet children()}
			<div
				class="location-text location-text absolute bottom-0 w-full p-4 font-sans text-[3rem] font-bold text-[var(--sandy-tan-600)] bg-blend-multiply"
			>
				Houston, TX
			</div>
		{/snippet}
	</ImageBlock>

	<div class="col-span-2 flex flex-col gap-4">
		<CommitBlock
			title="fix: fix game selection bug"
			hash="bef44aa"
			date="committed 3 weeks ago"
			class=""
		/>
		<CommitBlock
			title="fix: fix game selection bug"
			hash="bef44aa"
			date="committed 3 weeks ago"
			class=""
		/>
	</div>

	<ProjectBlock
		class="col-span-2 p-4 max-w-[20rem] self-center justify-self-center ml-auto"
		contentClassName="flex-col "
		imageClassName="hidden"
		title="tsar"
		pill="v1.0.0"
		image="https://placehold.co/200x100"
	>
		{#snippet description()}
			<strong>typescript</strong> suite of awesome resources. a small library of utilities. inspired by haskell
		{/snippet}
	</ProjectBlock>

	<ArticleBlock
		class="self-center justify-self-center translate-x-[10vw]"
		title="coffeescript: a lesson"
		content="the greeks considered hubris to be the worst sin. it's a lesson that's been lost on many of us. coffeescript attempted to be better than javascript, and it was. it was elegant, expressive, and had a much better toolchain. so why did it fail?"
		width="sm"
	/>

	<BlobletCreatorBlock />

	<div class="col-span-2 flex flex-col gap-4 h-48"></div>

	<Bloblet3
		id={6}
		class="absolute bottom-0 left-0 z-[-1] !w-full scale-x-350"
		startColor="var(--magic-mint-500)"
		stopColor="var(--magic-mint-500)"
		numPoints={12}
		radius={80}
	/>
</section>

<style>
	.location-text {
		-webkit-text-stroke: 2px white;
		-webkit-text-fill-color: transparent;

	}

	/* use for testing layout stuff */
	/* 
	:global(.grid > *) {
		outline: 1px solid var(--caroline-blue-500);
	} */
</style>
