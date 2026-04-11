import { describe, expect, it } from 'vitest';
import { firstMarkdownParagraph, markdownToPlainText } from './markdown';

describe('markdown helpers', () => {
	it('extracts readable text from markdown formatting', () => {
		expect(
			markdownToPlainText('## Hello\n\nThis is **bold** and [linked](https://example.com).')
		).toBe('Hello This is bold and linked.');
	});

	it('returns the first non-empty paragraph', () => {
		expect(firstMarkdownParagraph('# Title\n\nFirst paragraph here.\n\nSecond paragraph.')).toBe(
			'First paragraph here.'
		);
		expect(firstMarkdownParagraph('')).toBe('');
	});
});
