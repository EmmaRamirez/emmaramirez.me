---
name: repo-content-markdown-workflow
description: Maintains article, project, and markdown-backed content flows in this SvelteKit portfolio. Use when editing `src/articles/**`, blog/project routes, `src/lib/articles.ts`, `src/lib/markdown.ts`, content reader panels, or the dev content editor.
---

# Repo Content Markdown Workflow

## Use this skill when

- Adding or editing articles under `src/articles/**/*.{md,mdx,mdsvex}`
- Changing blog or project reader behavior
- Updating markdown parsing, excerpts, reading time, tags, or neighbor navigation
- Editing the dev content editor or `/api/content`

## Source-of-truth split

- Article source files live in `src/articles/**` with frontmatter.
- Article parsing, excerpts, reading time, tags, and slug uniqueness live in `src/lib/articles.ts`.
- Markdown-to-HTML helpers live in `src/lib/markdown.ts`.
- Homepage project content lives in `src/lib/registry/homepage.ts`.
- Dev-editable persisted content is handled by `src/lib/server/content.ts` and `src/routes/api/content/+server.ts`.
- Reader UI lives in `src/lib/components/panels/ArticleReaderPanel.svelte` and `src/lib/components/panels/ProjectReaderPanel.svelte`.

## Rules

1. Keep article slugs unique across year folders; slugs are filename-derived, not folder-derived.
2. Preserve article frontmatter fields: `title`, `date`, `description`, optional `tags`, and optional `draft`.
3. Treat `draft: true` as production-hidden behavior from `src/lib/articles.ts`.
4. Keep markdown rendering client-safe: do not pass untrusted HTML through new paths without deliberate sanitization.
5. Update content types in `src/lib/types/content.ts` when API payload or persisted content shapes change.
6. Keep dev-only content writes guarded; public reads and dev writes have different risk profiles.

## Verification

- Run `npm run check` after parser, route, or Svelte reader changes.
- Run `npm run test:unit -- --run` when changing markdown helpers, reading helpers, or content normalization.
- Manually verify `/blog`, `/blog/[slug]`, and reader panels when changing user-facing content navigation.
