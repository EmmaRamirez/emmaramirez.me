<script lang="ts">
	import { ProjectBlock } from '$lib/components/blocks';
	import type { ProjectRegistryEntry } from '$lib/registry/homepage';

	interface Props {
		project: ProjectRegistryEntry;
		active?: boolean;
		onselect?: () => void;
	}

	let { project, active = false, onselect }: Props = $props();
</script>

<button
	type="button"
	onclick={onselect}
	class="project-card style-none block h-full text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--text-primary) focus-visible:ring-offset-2"
	class:project-card-active={active}
>
	<ProjectBlock
		id={project.id}
		title={project.title}
		pill={project.pill}
		class={project.class}
		contentClassName={project.contentClassName}
		imageClassName={project.imageClassName}
	>
		{#snippet description()}
			{project.description}
		{/snippet}
	</ProjectBlock>
</button>

<style>
	.project-card {
		cursor: pointer;
		border-radius: 0.5rem;
	}

	.project-card:hover :global(.project-block-content) {
		background: var(--surface-hover);
	}

	.project-card-active :global(.project-block-content) {
		background: var(--surface-hover);
		border-color: var(--text-muted);
	}
</style>
