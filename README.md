# emzinnia.dev

Personal site built with [SvelteKit](https://kit.svelte.dev/) and Svelte 5 (runes). This branch is a redesign in progress.

## Prerequisites

- Node.js (see `.nvmrc` if present, or use a current LTS)
- PostgreSQL if you use Prisma-backed features (optional for static/blog-only work)

## Setup

```bash
npm install
cp .env.example .env   # then edit DATABASE_URL if you need the database
```

For local development, `DATABASE_URL` can point at your local Postgres instance. For production, the simplest setup is a hosted Postgres provider like Neon.

## Scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Start the Vite dev server                        |
| `npm run build`    | Production build                                 |
| `npm run preview`  | Preview the production build                     |
| `npm run check`    | `svelte-check` + sync                            |
| `npm run test`     | Unit tests (Vitest) and E2E (Playwright)         |
| `npm run test:unit`| Vitest only                                      |
| `npm run test:e2e` | Playwright only                                  |
| `npm run lint`     | Prettier + ESLint                                |
| `npm run db:deploy`| Apply committed Prisma migrations                |

## Deploying With Vercel

Recommended setup:

1. Create a hosted Postgres database, for example on [Neon](https://neon.tech/).
2. Add `DATABASE_URL` to Vercel project environment variables.
3. Set the Vercel build command to `npm run db:deploy && npm run build`.

This repo now runs `prisma generate` automatically during install so the generated Prisma client exists before the Vite build runs on Vercel.

## AI / contributors

See [AGENTS.md](AGENTS.md) for tooling notes (e.g. Svelte MCP, conventions).
