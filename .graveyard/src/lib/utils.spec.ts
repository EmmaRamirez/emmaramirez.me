import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	cn,
	formatLongDate,
	formatRelativeDate,
	formatShortDate,
	formatShortDateAbsolute
} from './utils';

describe('cn', () => {
	it('joins conditional class names', () => {
		expect(cn('a', false && 'b', 'c')).toBe('a c');
	});

	it('merges conflicting Tailwind utilities', () => {
		expect(cn('p-2', 'p-4')).toBe('p-4');
		expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
	});
});

describe('date formatters with fixed clock', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-06-15T15:00:00.000Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('formatRelativeDate handles empty input', () => {
		expect(formatRelativeDate(undefined)).toBe('');
		expect(formatRelativeDate('')).toBe('');
	});

	it('formatRelativeDate returns today and yesterday', () => {
		expect(formatRelativeDate('2026-06-15')).toBe('today');
		expect(formatRelativeDate('2026-06-14')).toBe('yesterday');
	});

	it('formatRelativeDate returns days ago within a week', () => {
		expect(formatRelativeDate('2026-06-10')).toBe('5 days ago');
	});

	it('formatRelativeDate returns last week for 7–13 days', () => {
		expect(formatRelativeDate('2026-06-08')).toBe('last week');
	});

	it('formatRelativeDate uses absolute formatting for future dates', () => {
		const out = formatRelativeDate('2027-01-10');
		expect(out).toMatch(/January/);
		expect(out).toMatch(/2027/);
	});

	it('formatShortDate handles empty and recent ranges', () => {
		expect(formatShortDate(undefined)).toBe('');
		expect(formatShortDate('2026-06-15')).toBe('today');
		expect(formatShortDate('2026-06-14')).toBe('yesterday');
		expect(formatShortDate('2026-06-10')).toBe('5d ago');
	});

	it('formatLongDate and formatShortDateAbsolute are stable absolute formats', () => {
		expect(formatLongDate('2024-03-02T12:00:00.000Z')).toMatch(/March 2, 2024/);
		expect(formatShortDateAbsolute('2024-03-02T12:00:00.000Z')).toMatch(/Mar 2, 2024/);
	});
});
