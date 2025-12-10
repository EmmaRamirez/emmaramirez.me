<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ProjectBlockProps {
		title?: string;
		description: Snippet;
		pill?: string;
		class?: string;
		contentClassName?: string;
		imageClassName?: string;
		image: string;
	}

	let {
		title,
		description,
		pill,
		class: className,
		image,
		contentClassName,
		imageClassName
	}: ProjectBlockProps = $props();
</script>

<div class="project-block flex flex-col gap-2 {className}">
	<div
		class="project-block-content flex flex-col gap-3 rounded-lg border border-[var(--liver-brown-500)] bg-[var(--light-rose-500)] p-4"
	>
		<div
			class="project-block-header flex justify-between rounded-full rounded-lg hover:bg-[var(--liver-brown-800)] bg-[var(--liver-brown-500)] p-2 text-[var(--eggshell-white-500)] transition-colors duration-300 ease-in-out cursor-pointer"
		>
			<span>/{title}</span>
			<div class="flex justify-between">
				<div class="pill opacity-50">{pill}</div>
			</div>
		</div>

		<div class="project-block-body flex flex-col gap-2 {contentClassName}">
			<p class="project-block-description">
				{@render description()}
			</p>
			<div class="project-image translate-x-[-10%] {imageClassName}">
				<img class="h-48 w-auto min-w-48 object-cover" src={image} alt={title} />
			</div>
		</div>
	</div>
</div>
