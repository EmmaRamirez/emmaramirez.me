/** ~200 wpm for technical reading time estimates. */
const WORDS_PER_MINUTE = 200;

export function readingTimeMinutesFromText(text: string | undefined | null): number {
	if (!text?.trim()) return 1;
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function orderedListNeighbors<T>(
	items: readonly T[],
	currentKey: string | null | undefined,
	getKey: (item: T) => string
): { index: number; prev: T | null; next: T | null } {
	if (!currentKey) return { index: -1, prev: null, next: null };
	const index = items.findIndex((item) => getKey(item) === currentKey);
	if (index < 0) return { index: -1, prev: null, next: null };
	return {
		index,
		prev: index > 0 ? items[index - 1]! : null,
		next: index < items.length - 1 ? items[index + 1]! : null
	};
}

export function sequentialNeighborsInIds<T extends string>(
	orderedIds: readonly T[],
	currentId: T | null | undefined
): { index: number; prevId: T | null; nextId: T | null } {
	if (currentId == null) return { index: -1, prevId: null, nextId: null };
	const index = orderedIds.indexOf(currentId);
	if (index < 0) return { index: -1, prevId: null, nextId: null };
	return {
		index,
		prevId: index > 0 ? orderedIds[index - 1]! : null,
		nextId: index < orderedIds.length - 1 ? orderedIds[index + 1]! : null
	};
}
