<script lang="ts">
	interface Props {
		photo: string;
		description: string;
		class?: string;
	}

	let { photo, description, class: className = '' }: Props = $props();
</script>

<figure
	class="photo-card relative flex h-full w-full items-center overflow-hidden rounded-xl border border-(--border-color) bg-(--surface) {className}"
>
	<img
		src={photo}
		alt={description}
		loading="lazy"
		class="photo-image h-full w-full object-cover"
	/>
	<figcaption class="photo-description">
		{description}
	</figcaption>
</figure>

<style>
	.photo-card {
		height: 16rem;
		box-shadow:
			0 1rem 2.375rem rgba(0, 0, 0, 0.16),
			0 0.5rem 0.75rem rgba(0, 0, 0, 0.12);
	}

	.photo-image {
		transition: transform 220ms ease;
	}

	.photo-card:hover .photo-image {
		transform: scale(1.03);
	}

	.photo-description {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
		padding: 0.35rem 0.9rem;
		border-radius: 1rem;
		background: color-mix(in srgb, black 35%, transparent);
		color: #fff;
		font-weight: 600;
		font-size: 0.85rem;
		line-height: 1.4;
		backdrop-filter: blur(0.375rem);
		border: 0.0625rem solid rgba(255, 255, 255, 0.25);
		text-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.4);
	}

	:global(.dark) .photo-description {
		background: color-mix(in srgb, var(--surface) 82%, transparent);
		color: var(--text-primary);
		border-color: var(--border-color);
		text-shadow: none;
	}
</style>
