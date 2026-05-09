<script lang="ts">
	import { asset } from '$app/paths';
	import type { Snippet } from 'svelte';

	interface ProjectBlockProps {
		id?: string;
		title?: string;
		description: Snippet;
		pill?: string;
		class?: string;
		contentClassName?: string;
		imageClassName?: string;
		imageAlt?: string;
	}

	const IMAGE_EXTENSIONS = ['avif', 'webp', 'png', 'jpg', 'jpeg'] as const;

	function toFileSlug(value: string): string {
		return value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9._-]+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}

	let {
		id,
		title,
		description,
		pill,
		class: className,
		contentClassName,
		imageClassName,
		imageAlt
	}: ProjectBlockProps = $props();

	const baseNames = $derived.by(() => {
		const names: string[] = [];

		function add(value?: string) {
			if (!value) return;
			const trimmed = value.trim();
			if (!trimmed) return;
			if (!names.includes(trimmed)) names.push(trimmed);

			const slug = toFileSlug(trimmed);
			if (slug && !names.includes(slug)) names.push(slug);
		}

		add(title);
		add(id);

		return names;
	});

	const imageSources = $derived.by(() =>
		baseNames.length
			? baseNames.flatMap((name) =>
					IMAGE_EXTENSIONS.map((ext) => asset(`/projects/${name}.${ext}`))
				)
			: []
	);

	let activeSourceIndex = $state(0);
	let loadedSrc = $state<string | null>(null);
	let allSourcesFailed = $state(false);
	let lastSourceKey = $state('');

	// Reset state when image sources change
	$effect(() => {
		const key = imageSources.join('|');
		if (key !== lastSourceKey) {
			lastSourceKey = key;
			activeSourceIndex = 0;
			allSourcesFailed = false;
			loadedSrc = null;
		}
	});

	const currentSourceIndex = $derived.by(() => {
		if (!imageSources.length) return -1;
		return Math.min(activeSourceIndex, imageSources.length - 1);
	});

	const imageSrc = $derived(
		currentSourceIndex === -1 || allSourcesFailed
			? null
			: (imageSources[currentSourceIndex] ?? null)
	);

	const hasImage = $derived(Boolean(imageSrc && loadedSrc === imageSrc));

	const resolvedAlt = $derived(imageAlt ?? (title ? `${title} preview` : 'Project preview'));

	function handleImageError() {
		const nextIndex = (currentSourceIndex < 0 ? 0 : currentSourceIndex) + 1;
		loadedSrc = null;

		if (nextIndex < imageSources.length) {
			activeSourceIndex = nextIndex;
			return;
		}

		allSourcesFailed = true;
		activeSourceIndex = imageSources.length;
	}

	function handleImageLoad() {
		loadedSrc = imageSrc;
	}
</script>

<div class="project-block flex h-full flex-col gap-2 overflow-hidden {className}">
	<div
		class="project-block-content relative flex h-full flex-col gap-3 overflow-hidden rounded-lg border border-(--border-color) bg-(--card-bg) p-4"
	>
		<span class="text-xs font-semibold tracking-[0.18em] text-(--text-secondary) uppercase">
			Project
		</span>
		<div
			class="project-block-header flex cursor-pointer justify-between transition-colors duration-300 ease-in-out"
		>
			<span class="font-mono text-sm text-(--text-secondary)">/{title}</span>
		</div>
		<div class="flex justify-between">
			<div class="pill opacity-50">{pill}</div>
		</div>

		<div class="project-block-body flex flex-1 flex-col gap-3 text-balance {contentClassName}">
			<p class="project-block-description">
				{@render description()}
			</p>
			{#if imageSrc}
				<div class="project-image-wrapper" class:project-image-loaded={hasImage}>
					<img
						src={imageSrc}
						alt={resolvedAlt}
						loading="lazy"
						decoding="async"
						class={`project-image ${imageClassName ?? ''}`}
						onerror={handleImageError}
						onload={handleImageLoad}
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.project-image-wrapper {
		position: absolute;
		top: -2rem;
		right: -2rem;
		width: 7rem;
		height: 7rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		overflow: hidden;
		background: var(--color-green-500);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		/* Inner border - solid green ring */
		border: 0.375rem solid var(--color-green-500);
		/* Concentric outer ring using box-shadow */
		box-shadow:
			0 0 0 0.5rem color-mix(in srgb, var(--color-green-500) 40%, transparent),
			0 0 0 1rem color-mix(in srgb, var(--color-green-500) 20%, transparent);
	}

	.project-image-wrapper.project-image-loaded {
		opacity: 1;
	}

	.project-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(0);
	}
</style>
