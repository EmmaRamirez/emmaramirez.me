import { getContext, hasContext, setContext } from 'svelte';

export type EditorSurfaceKind = 'editor' | 'site';
export type EditorEffectsMode = 'live' | 'reduced';

export interface EditorSurfaceContextValue {
	surface: EditorSurfaceKind;
	effectsMode: EditorEffectsMode;
}

const editorSurfaceContextKey = Symbol('editor-surface-context');

export function setEditorSurfaceContext(
	value: EditorSurfaceContextValue
): EditorSurfaceContextValue {
	setContext(editorSurfaceContextKey, value);
	return value;
}

export function getEditorSurfaceContext(): EditorSurfaceContextValue | null {
	if (!hasContext(editorSurfaceContextKey)) {
		return null;
	}

	return getContext<EditorSurfaceContextValue>(editorSurfaceContextKey);
}
