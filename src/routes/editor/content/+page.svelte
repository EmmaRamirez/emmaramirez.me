<script lang="ts">
	import EditorContentSection from '$lib/components/editor/EditorContentSection.svelte';
	import { applyArticleSave, applyProjectSave, editorDrafts } from '../sharedDrafts.svelte';
</script>

<EditorContentSection
	articles={editorDrafts.articles}
	projects={editorDrafts.projects}
	onprojectsaved={applyProjectSave}
	onarticlesaved={applyArticleSave}
/>
