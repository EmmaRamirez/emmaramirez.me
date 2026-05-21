import { json } from '@sveltejs/kit';
import { getGitHubChangelog } from '$lib/server/github';

export const prerender = false;

export const GET = async () => {
	try {
		const changelog = await getGitHubChangelog();

		return json(changelog, {
			headers: {
				'cache-control': 'public, max-age=300, stale-while-revalidate=600'
			}
		});
	} catch (error) {
		console.error('[github-changelog] GET error:', error);

		return json(
			{
				error: 'Failed to fetch GitHub changelog'
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
