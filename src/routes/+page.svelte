<script lang="ts">
	import SiteCanvas from '$lib/components/SiteCanvas.svelte';
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import Articles from '$lib/components/Articles.svelte';
	import discoImage from '$lib/images/photos/disco.jpeg';
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
</section>