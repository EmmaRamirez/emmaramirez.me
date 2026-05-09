<script lang="ts">
	import EditorGridSection from '$lib/components/editor/EditorGridSection.svelte';
	import { editorDrafts } from '../sharedDrafts.svelte';
</script>

<EditorGridSection articles={editorDrafts.articles} projects={editorDrafts.projects} />
