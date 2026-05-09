import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { GridItem } from '$lib/types/homepage';

// Mock the browser environment and SvelteKit modules
vi.mock('$app/environment', () => ({
	browser: false
}));

vi.mock('svelte/reactivity', () => ({
	SvelteMap: Map
}));

// Test helper: Create mock grid items
function createMockArticle(id: string): GridItem {
	return {
		kind: 'article',
		article: {
			id,
			slug: id,
			title: `Article ${id}`,
			content: 'Test content',
			date: '2024-01-01'
		}
	};
}

function createMockProject(id: import('$lib/registry/homepage').ProjectId): GridItem {
	return {
		kind: 'project',
		project: {
			kind: 'project',
			id,
			title: `Project ${id}`,
			description: 'Test description',
			pill: 'test',
			image: 'test.png',
			class: ''
		}
	};
}

describe('getItemKey', () => {
	it('should generate correct key for article items', async () => {
		// Import dynamically after mocks are set up
		const { getItemKey } = await import('./gridLayoutStore.svelte');

		const article = createMockArticle('test-article-1');
		expect(getItemKey(article)).toBe('article-test-article-1');
	});

	it('should generate correct key for project items', async () => {
		const { getItemKey } = await import('./gridLayoutStore.svelte');

		const project = createMockProject('nuzlocke');
		expect(getItemKey(project)).toBe('project-nuzlocke');
	});

	it('should return kind as key for simple items', async () => {
		const { getItemKey } = await import('./gridLayoutStore.svelte');

		const hero: GridItem = { kind: 'hero' };
		expect(getItemKey(hero)).toBe('hero');

		const disco: GridItem = { kind: 'disco' };
		expect(getItemKey(disco)).toBe('disco');

		const apiExplorer: GridItem = { kind: 'api-explorer' };
		expect(getItemKey(apiExplorer)).toBe('api-explorer');
	});
});

describe('GridLayoutStore', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	describe('initialize', () => {
		it('should initialize with default layouts for items', async () => {
			const { gridLayoutStore, getItemKey } = await import('./gridLayoutStore.svelte');

			const items: GridItem[] = [
				{ kind: 'hero' },
				createMockArticle('article-1'),
				{ kind: 'api-explorer' }
			];

			gridLayoutStore.initialize(items);

			// Check that layouts were created
			const heroLayout = gridLayoutStore.getLayout('hero');
			expect(heroLayout).toBeDefined();
			expect(heroLayout?.colSpan).toBe(3);
			expect(heroLayout?.rowSpan).toBe(2);

			const articleLayout = gridLayoutStore.getLayout('article-article-1');
			expect(articleLayout).toBeDefined();
			expect(articleLayout?.colSpan).toBe(1);
			expect(articleLayout?.rowSpan).toBe(1);

			const apiExplorerLayout = gridLayoutStore.getLayout('api-explorer');
			expect(apiExplorerLayout).toBeDefined();
			expect(apiExplorerLayout?.colSpan).toBe(1);
			expect(apiExplorerLayout?.rowSpan).toBe(2);
		});

		it('should add missing items when initialized again with a different surface', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			gridLayoutStore.initialize([{ kind: 'hero' }]);
			gridLayoutStore.initialize([{ kind: 'hero' }, { kind: 'api-explorer' }]);

			expect(gridLayoutStore.getLayout('api-explorer')).toEqual({
				key: 'api-explorer',
				colSpan: 1,
				rowSpan: 2
			});
			expect(gridLayoutStore.getOrder()).toContain('api-explorer');
		});
	});

	describe('setColSpan', () => {
		it('should update column span for an item', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			const items: GridItem[] = [createMockArticle('article-1')];
			gridLayoutStore.initialize(items);

			gridLayoutStore.setColSpan('article-article-1', 2);

			const layout = gridLayoutStore.getLayout('article-article-1');
			expect(layout?.colSpan).toBe(2);
		});

		it('should not throw when setting span for non-existent item', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			gridLayoutStore.initialize([]);
			expect(() => gridLayoutStore.setColSpan('non-existent', 2)).not.toThrow();
		});
	});

	describe('setRowSpan', () => {
		it('should update row span for an item', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			const items: GridItem[] = [createMockArticle('article-1')];
			gridLayoutStore.initialize(items);

			gridLayoutStore.setRowSpan('article-article-1', 2);

			const layout = gridLayoutStore.getLayout('article-article-1');
			expect(layout?.rowSpan).toBe(2);
		});
	});

	describe('cycleColSpan', () => {
		it('should cycle column span 1 -> 2 -> 3 -> 1', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			const items: GridItem[] = [createMockArticle('article-1')];
			gridLayoutStore.initialize(items);

			// Initial should be 1
			expect(gridLayoutStore.getLayout('article-article-1')?.colSpan).toBe(1);

			// Cycle to 2
			gridLayoutStore.cycleColSpan('article-article-1');
			expect(gridLayoutStore.getLayout('article-article-1')?.colSpan).toBe(2);

			// Cycle to 3
			gridLayoutStore.cycleColSpan('article-article-1');
			expect(gridLayoutStore.getLayout('article-article-1')?.colSpan).toBe(3);

			// Cycle back to 1
			gridLayoutStore.cycleColSpan('article-article-1');
			expect(gridLayoutStore.getLayout('article-article-1')?.colSpan).toBe(1);
		});
	});

	describe('cycleRowSpan', () => {
		it('should cycle row span 1 -> 2 -> 1', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			const items: GridItem[] = [createMockArticle('article-1')];
			gridLayoutStore.initialize(items);

			// Initial should be 1
			expect(gridLayoutStore.getLayout('article-article-1')?.rowSpan).toBe(1);

			// Cycle to 2
			gridLayoutStore.cycleRowSpan('article-article-1');
			expect(gridLayoutStore.getLayout('article-article-1')?.rowSpan).toBe(2);

			// Cycle back to 1
			gridLayoutStore.cycleRowSpan('article-article-1');
			expect(gridLayoutStore.getLayout('article-article-1')?.rowSpan).toBe(1);
		});
	});

	describe('getOrder and setOrder', () => {
		it('should return and set item order', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			const items: GridItem[] = [
				{ kind: 'hero' },
				createMockArticle('article-1'),
				createMockArticle('article-2')
			];
			gridLayoutStore.initialize(items);

			const order = gridLayoutStore.getOrder();
			expect(order).toEqual(['hero', 'article-article-1', 'article-article-2']);

			// Set new order
			gridLayoutStore.setOrder(['article-article-2', 'hero', 'article-article-1']);
			expect(gridLayoutStore.getOrder()).toEqual([
				'article-article-2',
				'hero',
				'article-article-1'
			]);
		});
	});

	describe('reorderItems', () => {
		it('should reorder items based on stored order', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			const items: GridItem[] = [
				{ kind: 'hero' },
				createMockArticle('article-1'),
				createMockArticle('article-2')
			];
			gridLayoutStore.initialize(items);

			// Set a different order
			gridLayoutStore.setOrder(['article-article-2', 'article-article-1', 'hero']);

			const reordered = gridLayoutStore.reorderItems(items);
			expect(reordered[0]).toEqual(items[2]); // article-2
			expect(reordered[1]).toEqual(items[1]); // article-1
			expect(reordered[2]).toEqual(items[0]); // hero
		});

		it('should include items not in order at the end', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			const initialItems: GridItem[] = [{ kind: 'hero' }];
			gridLayoutStore.initialize(initialItems);

			// Add new items that weren't in the original order
			const newItems: GridItem[] = [
				{ kind: 'hero' },
				createMockArticle('new-article'),
				{ kind: 'api-explorer' }
			];

			const reordered = gridLayoutStore.reorderItems(newItems);

			// Hero should be first (in order), new items at end
			expect(reordered[0]).toEqual({ kind: 'hero' });
			expect(reordered.length).toBe(3);
		});
	});

	describe('toggleEditMode', () => {
		it('should toggle edit mode on and off', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			expect(gridLayoutStore.editMode).toBe(false);

			gridLayoutStore.toggleEditMode();
			expect(gridLayoutStore.editMode).toBe(true);

			gridLayoutStore.toggleEditMode();
			expect(gridLayoutStore.editMode).toBe(false);
		});
	});

	describe('editor/homepage store sharing', () => {
		it('should use the same store instance for editor and homepage', async () => {
			const { gridLayoutStore, editorGridLayoutStore } = await import('./gridLayoutStore.svelte');

			expect(editorGridLayoutStore).toBe(gridLayoutStore);
		});
	});

	describe('reset', () => {
		it('should reset layouts and order to defaults', async () => {
			const { gridLayoutStore } = await import('./gridLayoutStore.svelte');

			const items: GridItem[] = [{ kind: 'hero' }, createMockArticle('article-1')];
			gridLayoutStore.initialize(items);

			// Modify layout
			gridLayoutStore.setColSpan('hero', 1);
			gridLayoutStore.setOrder(['article-article-1', 'hero']);

			// Reset
			gridLayoutStore.reset(items);

			// Check defaults restored
			expect(gridLayoutStore.getLayout('hero')?.colSpan).toBe(3);
			expect(gridLayoutStore.getOrder()).toEqual(['hero', 'article-article-1']);
		});
	});
});

describe('Default Layouts', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('hero should be 3x2', async () => {
		const { gridLayoutStore } = await import('./gridLayoutStore.svelte');
		gridLayoutStore.initialize([{ kind: 'hero' }]);

		const layout = gridLayoutStore.getLayout('hero');
		expect(layout?.colSpan).toBe(3);
		expect(layout?.rowSpan).toBe(2);
	});

	it('home should be 2x2', async () => {
		const { gridLayoutStore } = await import('./gridLayoutStore.svelte');
		gridLayoutStore.initialize([{ kind: 'home' }]);

		const layout = gridLayoutStore.getLayout('home');
		expect(layout?.colSpan).toBe(2);
		expect(layout?.rowSpan).toBe(2);
	});

	it('location should be 2x1', async () => {
		const { gridLayoutStore } = await import('./gridLayoutStore.svelte');
		gridLayoutStore.initialize([{ kind: 'location' }]);

		const layout = gridLayoutStore.getLayout('location');
		expect(layout?.colSpan).toBe(2);
		expect(layout?.rowSpan).toBe(1);
	});

	it('city should be 3x1', async () => {
		const { gridLayoutStore } = await import('./gridLayoutStore.svelte');
		gridLayoutStore.initialize([{ kind: 'city' }]);

		const layout = gridLayoutStore.getLayout('city');
		expect(layout?.colSpan).toBe(3);
		expect(layout?.rowSpan).toBe(1);
	});

	it('design-system should be 2x1', async () => {
		const { gridLayoutStore } = await import('./gridLayoutStore.svelte');
		gridLayoutStore.initialize([{ kind: 'design-system' }]);

		const layout = gridLayoutStore.getLayout('design-system');
		expect(layout?.colSpan).toBe(2);
		expect(layout?.rowSpan).toBe(1);
	});

	it('api-explorer should be 1x2', async () => {
		const { gridLayoutStore } = await import('./gridLayoutStore.svelte');
		gridLayoutStore.initialize([{ kind: 'api-explorer' }]);

		const layout = gridLayoutStore.getLayout('api-explorer');
		expect(layout?.colSpan).toBe(1);
		expect(layout?.rowSpan).toBe(2);
	});

	it('articles and projects should be 1x1', async () => {
		const { gridLayoutStore } = await import('./gridLayoutStore.svelte');
		gridLayoutStore.initialize([createMockArticle('test'), createMockProject('site')]);

		const articleLayout = gridLayoutStore.getLayout('article-test');
		expect(articleLayout?.colSpan).toBe(1);
		expect(articleLayout?.rowSpan).toBe(1);

		const projectLayout = gridLayoutStore.getLayout('project-site');
		expect(projectLayout?.colSpan).toBe(1);
		expect(projectLayout?.rowSpan).toBe(1);
	});
});
