<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		location: string;
		class?: string;
	}

	let { src, alt, location, class: className = '' }: Props = $props();
</script>

<figure class="city-card relative flex h-full w-full items-center overflow-hidden rounded-xl border border-(--border-color) bg-(--surface) {className}">
	<img
		{src}
		{alt}
		loading="lazy"
		class="city-image h-full w-full object-cover"
	/>
	<figcaption class="city-tag">
		{location}
	</figcaption>
</figure>

<style>
	.city-card {
		height: 16rem;
		box-shadow:
			0 1rem 2.375rem rgba(0, 0, 0, 0.16),
			0 0.5rem 0.75rem rgba(0, 0, 0, 0.12);
	}

	.city-image {
		transition: transform 220ms ease;
	}

	.city-card:hover .city-image {
		transform: scale(1.03);
	}

	.city-tag {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		padding: 0.35rem 0.9rem;
		border-radius: 624.9375rem;
		background: color-mix(in srgb, var(--surface) 82%, transparent);
		color: var(--text-primary);
		text-transform: uppercase;
		font-weight: 700;
		letter-spacing: 0.16em;
		font-size: 0.72rem;
		backdrop-filter: blur(0.375rem);
		border: 0.0625rem solid var(--border-color);
	}
</style>

