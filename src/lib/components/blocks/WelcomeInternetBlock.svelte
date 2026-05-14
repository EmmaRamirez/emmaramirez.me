<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div
	class="welcome-internet flex flex-col gap-4 px-6 py-8 md:px-10 md:py-10 {className}"
>
	<h2 id="welcome-internet-heading" class="welcome-internet__title font-serif text-2xl font-medium tracking-tight md:text-3xl">
		welcome to my internet
	</h2>
	<p class="welcome-internet__intro max-w-3xl text-base leading-relaxed md:text-lg">
		my name's emma and my biggest passion is making stuff with code. i'm into startups,
		fashion, finance, and AI.
	</p>
</div>

<style>
	.welcome-internet {
		min-height: 100%;
		background: #000;
		color: #e8c547;
		border-radius: inherit;
	}

	.welcome-internet__title {
		color: #f5d76e;
	}

	.welcome-internet__intro {
		color: rgb(232 197 71 / 0.92);
	}
</style>
