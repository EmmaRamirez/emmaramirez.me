import { dev } from '$app/environment';

// we need CSR for URL parameter reading
export const csr = true;

// since the article is determined by URL params, we can't prerender all pages
// unless we enumerate them. For now, disable prerendering.
export const prerender = false;

