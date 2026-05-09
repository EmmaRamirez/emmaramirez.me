import type { GridItem } from '$lib/types/homepage';

export interface EditorGridLegendItem {
	label: string;
	color: string;
}

export const editorGridLegendItems: EditorGridLegendItem[] = [
	{ label: 'Hero', color: 'var(--color-sky-500, #0ea5e9)' },
	{ label: 'Articles', color: 'var(--color-blue-500, #3b82f6)' },
	{ label: 'Projects', color: 'var(--color-purple-500, #a855f7)' },
	{ label: 'Special Blocks', color: 'var(--color-emerald-500, #10b981)' }
];

export function getEditorGridItemLabel(item: GridItem): string {
	switch (item.kind) {
		case 'article':
			return item.article.title;
		case 'project':
			return item.project.title;
		case 'hero':
			return 'Hero Section';
		case 'disco':
			return 'Disco Block';
		case 'home':
			return 'Home Block';
		case 'this-site':
			return 'This Site';
		case 'location':
			return 'Location Block';
		case 'pokemon':
			return 'Pokemon Block';
		case 'top-languages':
			return 'Top Languages';
		case 'city':
			return 'City Card';
		case 'design-system':
			return 'Design System Ad';
		default:
			return 'Unknown';
	}
}

export function getEditorGridItemIcon(item: GridItem): string {
	switch (item.kind) {
		case 'article':
			return '📝';
		case 'project':
			return '🚀';
		case 'hero':
			return '👋';
		case 'disco':
			return '🪩';
		case 'home':
			return '🏠';
		case 'this-site':
			return '🛠️';
		case 'location':
			return '📍';
		case 'pokemon':
			return '⚡';
		case 'top-languages':
			return '📊';
		case 'city':
			return '🏙️';
		case 'design-system':
			return '🎨';
		default:
			return '❓';
	}
}

export function getEditorGridItemColor(item: GridItem): string {
	switch (item.kind) {
		case 'article':
			return 'var(--color-blue-500, #3b82f6)';
		case 'project':
			return 'var(--color-purple-500, #a855f7)';
		case 'hero':
			return 'var(--color-sky-500, #0ea5e9)';
		case 'disco':
			return 'var(--color-pink-500, #ec4899)';
		case 'home':
			return 'var(--color-emerald-500, #10b981)';
		case 'this-site':
			return 'hsl(39, 100%, 77%)';
		case 'location':
			return 'var(--color-teal-500, #14b8a6)';
		case 'pokemon':
			return 'var(--color-yellow-500, #eab308)';
		case 'top-languages':
			return 'var(--color-orange-500, #f97316)';
		case 'city':
			return 'var(--color-cyan-500, #06b6d4)';
		case 'design-system':
			return 'var(--color-rose-500, #f43f5e)';
		default:
			return 'var(--text-muted)';
	}
}
