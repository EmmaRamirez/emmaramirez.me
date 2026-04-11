import { defineConfig, devices } from '@playwright/test';

const devPort = 4173;
const devHost = '127.0.0.1';
const baseURL = `http://${devHost}:${devPort}`;

/** Dev server: `/api/content` PUT and `/editor/*` are only available when `import.meta.env.DEV` is true. */
export default defineConfig({
	testDir: 'e2e',
	workers: process.env.CI ? 2 : undefined,
	use: {
		baseURL,
		...devices['Desktop Chrome']
	},
	webServer: {
		command: `npm run dev -- --host ${devHost} --port ${devPort}`,
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
