import { json } from '@sveltejs/kit';
import { getGitHubTopLanguages } from '$lib/server/github';

export const GET = async () => {
	try {
		const topLanguages = await getGitHubTopLanguages();

		return json(topLanguages, {
			headers: {
				'cache-control': 'no-store'
			}
		});
	} catch (error) {
		console.error('[github-top-languages] GET error:', error);

		return json(
			{
				error: 'Failed to fetch GitHub language data'
			},
			{
				status: 500,
				headers: {
					'cache-control': 'no-store'
				}
			}
		);
	}
};
