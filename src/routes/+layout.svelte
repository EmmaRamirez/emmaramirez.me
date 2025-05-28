<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { headerColor, title } from '$lib/stores';
	import { onMount } from 'svelte';
	import '../app.css';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();


	afterNavigate(() => {
		title.set('hi, welcome to my website.');
		headerColor.set('var(--caroline-blue-600)');
	});

</script>

<div class="app">

	<main class="border-6 border-[var(--liver-brown-500)] rounded-lg p-4">
		<Header title={$title} headerColor={$headerColor} />

		{@render children()}
	</main>

	<footer>
		<div>footer.</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
		margin-top: 3rem;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
