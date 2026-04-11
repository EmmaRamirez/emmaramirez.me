import { marked } from 'marked';

marked.setOptions({
	gfm: true,
	breaks: false
});

export function renderMarkdownToHtml(markdown: string | null | undefined): string {
	return marked.parse(markdown?.trim() || '') as string;
}

export function markdownToPlainText(markdown: string | null | undefined): string {
	return renderMarkdownToHtml(markdown)
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\s+([.,!?;:])/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
}

export function firstMarkdownParagraph(markdown: string | null | undefined): string {
	const blocks = (markdown ?? '')
		.split(/\n\s*\n+/)
		.map((block) => markdownToPlainText(block))
		.filter(Boolean);

	for (const block of blocks) {
		if (block.length < 20) continue;
		if (!/\s/.test(block)) continue;
		return block;
	}

	return blocks[0] ?? '';
}
