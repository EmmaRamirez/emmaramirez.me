import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		repoRoot: dev ? process.cwd() : null
	};
};
