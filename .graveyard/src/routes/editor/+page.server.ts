import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	if (dev) {
		throw redirect(303, '/editor/grid');
	}
	return {};
};
