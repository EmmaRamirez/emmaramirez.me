import { describe, it, expect } from 'vitest';
import { buildTagClustersFromTagged, buildTagGraphFromTagged } from './tagGraphCore';

describe('buildTagGraphFromTagged', () => {
	it('returns empty graph for no articles', () => {
		const g = buildTagGraphFromTagged([]);
		expect(g.nodes).toEqual([]);
		expect(g.links).toEqual([]);
	});

	it('creates nodes and weighted links for co-occurring tags', () => {
		const g = buildTagGraphFromTagged([
			{ tags: ['react', 'svelte'] },
			{ tags: ['svelte', 'typescript'] },
			{ tags: ['react', 'svelte'] }
		]);

		const byId = Object.fromEntries(g.nodes.map((n) => [n.id, n]));
		expect(byId.react?.count).toBe(2);
		expect(byId.svelte?.count).toBe(3);

		const linkKeys = g.links.map((l) => [l.source, l.target].sort().join('::'));
		expect(linkKeys).toContain('react::svelte');
		expect(linkKeys).toContain('svelte::typescript');

		const reactSvelte = g.links.find(
			(l) =>
				(l.source === 'react' && l.target === 'svelte') ||
				(l.source === 'svelte' && l.target === 'react')
		);
		expect(reactSvelte?.weight).toBe(2);
	});

	it('dedupes tags within a single article', () => {
		const g = buildTagGraphFromTagged([{ tags: ['a', 'a', 'b'] }]);
		expect(g.nodes.map((n) => n.id).sort()).toEqual(['a', 'b']);
		expect(g.links).toHaveLength(1);
		expect(g.links[0]?.weight).toBe(1);
	});
});

describe('buildTagClustersFromTagged', () => {
	it('clusters connected tag components', () => {
		const clusters = buildTagClustersFromTagged([
			{ tags: ['x', 'y'] },
			{ tags: ['y', 'z'] },
			{ tags: ['solo'] }
		]);

		const sizes = clusters.map((c) => c.size).sort((a, b) => b - a);
		expect(sizes).toEqual([3, 1]);
	});
});
