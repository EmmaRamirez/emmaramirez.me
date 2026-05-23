import { homepageBlocks } from '$lib/registry/homepage';
import type { HomepageBlock, HomepageBlockKind, HomepageGridLine } from '$lib/types/homepage';

const homepageBlockLabels: Record<HomepageBlockKind, string> = {
	'welcome-internet': 'Welcome to the Internet',
	artwork: 'Artwork',
	home: 'Home',
	'redesigning-article': 'Redesigning Article',
	disco: 'Disco',
	empty: 'Empty Slot',
	pokemon: 'Pokemon Team',
	'component-library': 'Component Library',
	spacer: 'Spacer',
	houston: 'Houston',
	doodle: 'Doodle Pad',
	sticker: 'Sticker Tray',
	achievement: 'Achievement',
	'three-moats-article': 'Three Moats Article',
	changelog: 'Changelog',
	gallery: 'Gallery'
};

function getGridLineValue(line: HomepageGridLine | undefined): number {
	if (line === undefined || line === 'auto') return Number.MAX_SAFE_INTEGER;
	return line;
}

export function compareHomepageBlocksByDisplayOrder(a: HomepageBlock, b: HomepageBlock): number {
	const aDesktop = a.layout.desktop;
	const bDesktop = b.layout.desktop;

	const rowDiff = getGridLineValue(aDesktop.rowStart) - getGridLineValue(bDesktop.rowStart);
	if (rowDiff !== 0) return rowDiff;

	const columnDiff =
		getGridLineValue(aDesktop.columnStart) - getGridLineValue(bDesktop.columnStart);
	if (columnDiff !== 0) return columnDiff;

	return homepageBlocks.findIndex((block) => block.id === a.id) -
		homepageBlocks.findIndex((block) => block.id === b.id);
}

export function sortHomepageBlocksInDisplayOrder(blocks: HomepageBlock[]): HomepageBlock[] {
	return [...blocks].sort(compareHomepageBlocksByDisplayOrder);
}

export function getHomepageBlockLabel(block: HomepageBlock): string {
	return homepageBlockLabels[block.kind];
}
