import { describe, it, expect } from 'vitest';
import {
	orderedListNeighbors,
	readingTimeMinutesFromText,
	sequentialNeighborsInIds
} from './reading';

describe('readingTimeMinutesFromText', () => {
	it('returns 1 for empty or whitespace', () => {
		expect(readingTimeMinutesFromText('')).toBe(1);
		expect(readingTimeMinutesFromText('   ')).toBe(1);
		expect(readingTimeMinutesFromText(null)).toBe(1);
	});

	it('ceilings words at 200 wpm', () => {
		const words = Array.from({ length: 201 }, () => 'word').join(' ');
		expect(readingTimeMinutesFromText(words)).toBe(2);
	});
});

describe('orderedListNeighbors', () => {
	it('returns prev and next by slug', () => {
		const items = [{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }];
		const n = orderedListNeighbors(items, 'b', (x) => x.slug);
		expect(n.prev?.slug).toBe('a');
		expect(n.next?.slug).toBe('c');
	});
});

describe('sequentialNeighborsInIds', () => {
	it('returns adjacent ids', () => {
		const ids = ['x', 'y', 'z'] as const;
		const n = sequentialNeighborsInIds(ids, 'y');
		expect(n.prevId).toBe('x');
		expect(n.nextId).toBe('z');
	});
});
