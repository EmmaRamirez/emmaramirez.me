<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
</script>

<div class={['wide-background-block', className]} aria-hidden="true"></div>

<style>
	.wide-background-block {
		position: relative;
		isolation: isolate;
		min-height: min(20rem, calc(80vw - 2rem));
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--border-color) 58%, transparent);
		border-radius: inherit;
		background-color: var(--card-bg);
	}

	@media (min-width: 48rem) {
		.wide-background-block {
			height: 100%;
			min-height: 100%;
		}
	}
</style>
