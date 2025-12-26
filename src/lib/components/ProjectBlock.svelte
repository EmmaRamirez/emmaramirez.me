<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ProjectBlockProps {
		title?: string;
		description: Snippet;
		pill?: string;
		class?: string;
		contentClassName?: string;
	}

	let {
		title,
		description,
		pill,
		class: className,
		contentClassName
	}: ProjectBlockProps = $props();
</script>

<div class="project-block flex flex-col gap-2 {className}">
	<div
		class="project-block-content flex flex-col gap-3 rounded-lg border border-(--border-color) bg-(--card-bg) p-4"
	>
		<div
			class="project-block-header flex justify-between transition-colors duration-300 ease-in-out cursor-pointer"
		>
			<span class="font-mono text-sm text-(--text-secondary)">/{title}</span>
			<div class="flex justify-between">
				<div class="pill opacity-50">{pill}</div>
			</div>
		</div>

		<div class="project-block-body flex flex-col gap-2 {contentClassName}">
			<p class="project-block-description">
				{@render description()}
			</p>
		</div>
	</div>
</div>
