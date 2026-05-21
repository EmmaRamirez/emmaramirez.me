import type { LayoutRect } from '$lib/stores/componentLibraryStore.svelte';

export function getSiteHeaderElement(): HTMLElement | null {
	return document.querySelector('header');
}

export function getSiteHeaderHeight(): number {
	return getSiteHeaderElement()?.getBoundingClientRect().height ?? 0;
}

export function getSiteHeaderBottom(): number {
	return getSiteHeaderElement()?.getBoundingClientRect().bottom ?? 0;
}

export function getHeaderAwareGridRect(grid: Element | null): LayoutRect | null {
	if (!grid) {
		return null;
	}

	const gridRect = grid.getBoundingClientRect();
	const headerBottom = getSiteHeaderBottom();
	const top = Math.max(gridRect.top, headerBottom);
	const height = Math.max(0, gridRect.bottom - top);

	return {
		top,
		left: gridRect.left,
		width: gridRect.width,
		height
	};
}

export function scrollGridBelowHeader(
	gridSelector = '.home-grid',
	behavior: ScrollBehavior = 'smooth'
): void {
	const grid = document.querySelector(gridSelector);
	if (!grid) {
		return;
	}

	const headerHeight = getSiteHeaderHeight();
	const gridTop = grid.getBoundingClientRect().top + window.scrollY;

	window.scrollTo({
		top: Math.max(0, gridTop - headerHeight),
		behavior
	});
}
