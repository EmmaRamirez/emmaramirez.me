<script lang="ts">
	type Props = {
		alt: string;
		class?: string;
		image: string;
		title: string;
	};

	let { alt, class: className = '', image, title }: Props = $props();
</script>

<figure class={['artwork-block', className]}>
	<img class="artwork-block__image" src={image} {alt} draggable="false" />
	<figcaption class="artwork-block__caption">{title}</figcaption>
</figure>

<style>
	.artwork-block {
		position: relative;
		display: grid;
		min-height: min(16rem, calc(100vw - 2rem));
		height: 100%;
		overflow: hidden;
		border: 1px solid rgb(15 23 42 / 0.14);
		border-radius: 1.5rem;
		background: #101015;
		box-shadow: 0 1rem 2rem rgb(15 23 42 / 0.14);
		isolation: isolate;
	}

	.artwork-block__image {
		grid-area: 1 / 1;
		width: 100%;
		height: 100%;
		min-height: inherit;
		object-fit: cover;
		image-rendering: auto;
		user-select: none;
	}

	.artwork-block__caption {
		grid-area: 1 / 1;
		align-self: end;
		margin: 0;
		padding: 2.75rem 0.95rem 0.9rem;
		background: linear-gradient(to top, rgb(0 0 0 / 0.68), transparent);
		color: #fffaf0;
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.1;
		text-shadow: 0 1px 0 rgb(0 0 0 / 0.28);
	}

	@media (min-width: 48rem) {
		.artwork-block {
			min-height: 100%;
		}
	}
</style>
