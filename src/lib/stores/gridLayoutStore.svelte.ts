import { browser } from '$app/environment';
import { SvelteMap } from 'svelte/reactivity';
import type { GridItem } from '$lib/types/homepage';

const STORAGE_KEY = 'emzinnia-grid-layout';

export interface GridItemLayout {
	key: string;
	colSpan: 1 | 2 | 3;
	rowSpan: 1 | 2;
}

interface SavedLayout {
	layouts: Record<string, GridItemLayout>;
	order: string[];
}

function getItemKey(item: GridItem): string {
	if (item.kind === 'article') return `article-${item.article.id}`;
	if (item.kind === 'project') return `project-${item.project.id}`;
	return item.kind;
}

function getDefaultLayout(item: GridItem): GridItemLayout {
	const key = getItemKey(item);
	
	if (item.kind === 'hero') return { key, colSpan: 3, rowSpan: 2 };
	if (item.kind === 'home') return { key, colSpan: 2, rowSpan: 2 };
	if (item.kind === 'city') return { key, colSpan: 3, rowSpan: 1 };
	if (item.kind === 'design-system') return { key, colSpan: 2, rowSpan: 1 };
	
	return { key, colSpan: 1, rowSpan: 1 };
}

class GridLayoutStore {
	private layouts = $state<SvelteMap<string, GridItemLayout>>(new SvelteMap());
	private order = $state<string[]>([]);
	editMode = $state(false);
	private initialized = $state(false);

	initialize(items: GridItem[]) {
		if (browser && !this.initialized) {
			const saved = this.loadFromStorage();
			if (saved) {
				this.order = saved.order;
				this.layouts = new SvelteMap(Object.entries(saved.layouts));
				this.initialized = true;
				
				for (const item of items) {
					const key = getItemKey(item);
					if (!this.layouts.has(key)) {
						const layout = getDefaultLayout(item);
						this.layouts.set(key, layout);
						this.order.push(key);
					}
				}
				return;
			}
		}

		if (this.order.length === 0) {
			this.order = items.map(getItemKey);
			for (const item of items) {
				const layout = getDefaultLayout(item);
				this.layouts.set(layout.key, layout);
			}
			this.initialized = true;
		}
	}

	private loadFromStorage(): SavedLayout | null {
		if (!browser) return null;
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				return JSON.parse(saved);
			}
		} catch (e) {
			console.error('Failed to load grid layout from storage:', e);
		}
		return null;
	}

	save(): boolean {
		if (!browser) return false;
		try {
			const data: SavedLayout = {
				layouts: Object.fromEntries(this.layouts),
				order: this.order
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			return true;
		} catch (e) {
			console.error('Failed to save grid layout:', e);
			return false;
		}
	}

	reset(items: GridItem[]) {
		this.order = items.map(getItemKey);
		this.layouts = new SvelteMap();
		for (const item of items) {
			const layout = getDefaultLayout(item);
			this.layouts.set(layout.key, layout);
		}
		if (browser) {
			localStorage.removeItem(STORAGE_KEY);
		}
	}

	getLayout(key: string): GridItemLayout | undefined {
		return this.layouts.get(key);
	}

	setColSpan(key: string, colSpan: 1 | 2 | 3) {
		const layout = this.layouts.get(key);
		if (layout) {
			this.layouts.set(key, { ...layout, colSpan });
		}
	}

	setRowSpan(key: string, rowSpan: 1 | 2) {
		const layout = this.layouts.get(key);
		if (layout) {
			this.layouts.set(key, { ...layout, rowSpan });
		}
	}

	cycleColSpan(key: string) {
		const layout = this.layouts.get(key);
		if (layout) {
			const nextSpan = ((layout.colSpan % 3) + 1) as 1 | 2 | 3;
			this.layouts.set(key, { ...layout, colSpan: nextSpan });
		}
	}

	cycleRowSpan(key: string) {
		const layout = this.layouts.get(key);
		if (layout) {
			const nextSpan = ((layout.rowSpan % 2) + 1) as 1 | 2;
			this.layouts.set(key, { ...layout, rowSpan: nextSpan });
		}
	}

	getOrder(): string[] {
		return this.order;
	}

	setOrder(newOrder: string[]) {
		this.order = newOrder;
	}

	reorderItems<T extends GridItem>(items: T[]): T[] {
		const itemLookup: Record<string, T> = {};
		for (const item of items) {
			itemLookup[getItemKey(item)] = item;
		}
		
		const orderedItems: T[] = [];
		const usedKeys: Record<string, boolean> = {};
		
		for (const key of this.order) {
			const item = itemLookup[key];
			if (item) {
				orderedItems.push(item);
				usedKeys[key] = true;
			}
		}
		
		for (const item of items) {
			const key = getItemKey(item);
			if (!usedKeys[key]) {
				orderedItems.push(item);
			}
		}
		
		return orderedItems;
	}

	toggleEditMode() {
		this.editMode = !this.editMode;
	}

	hasSavedLayout(): boolean {
		if (!browser) return false;
		return localStorage.getItem(STORAGE_KEY) !== null;
	}
}

export const gridLayoutStore = new GridLayoutStore();
export { getItemKey };
