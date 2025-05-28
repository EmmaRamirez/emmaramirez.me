<script lang="ts">
	import { headerColor, title } from '$lib/stores';
	import ArticleBlock from '$lib/components/ArticleBlock.svelte';
	import { fade } from 'svelte/transition';

	title.set('blog/article');
	headerColor.set('var(--transit-yellow-500)');
</script>

<article transition:fade={{ duration: 1000 }}>
	<ArticleBlock
		width="lg"
		class="h-full scale-100 hover:scale-100"
		contentClass="border-none bg-[var(--transit-yellow-100)] h-full max-h-full text-lg leading-relaxed [&>p]:mb-4"
		titleClass="text-4xl mb-4 translate-y-[-1rem] "
		title="Hegel & Web Design"
	>
		{#snippet content()}
			<p>
				As much as web design is a visual medium both restrained and bolstered by technological
				innovations, I find that it cycles in the same way art movements do. German philosopher
				Friedrich Hegel split up history into three moments: the thesis, that is the orignal
				thought, the antithesis, that is the thought that opposes the thesis, and the synthesis,
				that is the thought that combines the thesis and the antithesis. I think web design starts
				in the 1990s when the landscape is nothing but text. Innovation appears and takes hold and
				so do certain design choices -- rounded corners and shadows are that era's holy grail. The
				antithesis is the 2000s, when the web is a visual medium and design choices are more
				restrained. The synthesis is the 2010s, when the web is a visual medium and design choices
				are more restrained. The thesis is the 2020s, when the web is a visual medium and design
				choices are more restrained.
			</p>
			<p>
				As much as web design is a visual medium both restrained and bolstered by technological
				innovations, I find that it cycles in the same way art movements do. German philosopher
				Friedrich Hegel split up history into three moments: the thesis, that is the orignal
				thought, the antithesis, that is the thought that opposes the thesis, and the synthesis,
				that is the thought that combines the thesis and the antithesis. I think web design starts
				in the 1990s when the landscape is nothing but text. Innovation appears and takes hold and
				so do certain design choices -- rounded corners and shadows are that era's holy grail. The
				antithesis is the 2000s, when the web is a visual medium and design choices are more
				restrained. The synthesis is the 2010s, when the web is a visual medium and design choices
				are more restrained. The thesis is the 2020s, when the web is a visual medium and design
				choices are more restrained.
			</p>
            <h2>Subheading</h2>
            <p>
				As much as web design is a visual medium both restrained and bolstered by technological
				innovations, I find that it cycles in the same way art movements do. German philosopher
				Friedrich Hegel
			</p>
            <p>
			    rounded corners and shadows are that era's holy grail. The
				antithesis is the 2000s, when the web is a visual medium and design choices are more
				restrained. The synthesis is the 2010s, when the web is a visual medium and design choices
				are more restrained. The thesis is the 2020s, when the web is a visual medium and design
				choices are more restrained.
			</p>
            <p>
                Anywho...
            </p>
            <h2>Subheading 2</h2>
            <p>
                Friedrich Hegel split up history into three moments: the thesis, that is the orignal
				thought, the antithesis, that is the thought that opposes the thesis, and the synthesis,
				that is the thought that combines the thesis and the antithesis. I think web design starts
				in the 1990s when the landscape is nothing but text. Innovation appears and takes hold and
				so do certain design choices -- rounded corners and shadows are that era's holy grail. The
				antithesis is the 2000s, when the web is a visual medium and design choices are more
				restrained. The synthesis is the 2010s, when the web is a visual medium and design choices
				are more restrained. The thesis is the 2020s, when the web is a visual medium and design
				choices are more restrained.
            </p>
		{/snippet}
	</ArticleBlock>
</article>
