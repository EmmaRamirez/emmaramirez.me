import { env } from '$env/dynamic/private';
import {
	buildTopLanguagesResponse,
	type LanguageAggregateInput,
	type TopLanguagesResponse
} from '$lib/github/topLanguages';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const REPOSITORIES_PER_PAGE = 100;
const LANGUAGES_PER_REPOSITORY = 20;

const TOP_LANGUAGES_QUERY = `
	query TopLanguages($after: String) {
		viewer {
			repositories(
				first: ${REPOSITORIES_PER_PAGE}
				after: $after
				ownerAffiliations: [OWNER]
				isFork: false
				orderBy: { field: PUSHED_AT, direction: DESC }
			) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					isPrivate
					languages(first: ${LANGUAGES_PER_REPOSITORY}, orderBy: { field: SIZE, direction: DESC }) {
						edges {
							size
							node {
								name
								color
							}
						}
					}
				}
			}
		}
	}
`;

interface GitHubLanguageEdge {
	size: number;
	node: {
		name: string;
		color: string | null;
	};
}

interface GitHubRepositoryNode {
	isPrivate: boolean;
	languages: {
		edges: GitHubLanguageEdge[];
	};
}

interface GitHubGraphqlResponse {
	data?: {
		viewer: {
			repositories: {
				nodes: GitHubRepositoryNode[];
				pageInfo: {
					hasNextPage: boolean;
					endCursor: string | null;
				};
			};
		};
	};
	errors?: Array<{ message: string }>;
}

function getGitHubAccessToken() {
	const token = env.GITHUB_ACCESS_TOKEN?.trim();

	if (!token) {
		throw new Error('GITHUB_ACCESS_TOKEN is not set.');
	}

	return token;
}

async function fetchGitHubPage(after: string | null) {
	const response = await fetch(GITHUB_GRAPHQL_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${getGitHubAccessToken()}`
		},
		body: JSON.stringify({
			query: TOP_LANGUAGES_QUERY,
			variables: { after }
		}),
		cache: 'no-store'
	});

	const payload = (await response.json()) as GitHubGraphqlResponse;

	if (!response.ok || payload.errors?.length) {
		const details = payload.errors?.map((error) => error.message).join('; ') || response.statusText;
		throw new Error(`GitHub API request failed: ${details}`);
	}

	if (!payload.data) {
		throw new Error('GitHub API response did not include data.');
	}

	return payload.data.viewer.repositories;
}

export async function getGitHubTopLanguages(): Promise<TopLanguagesResponse> {
	const languagesByName = new Map<string, LanguageAggregateInput>();
	let totalRepositories = 0;
	let privateRepositories = 0;
	let after: string | null = null;
	let hasNextPage = true;

	while (hasNextPage) {
		const repositories = await fetchGitHubPage(after);

		for (const repository of repositories.nodes) {
			totalRepositories += 1;

			if (repository.isPrivate) {
				privateRepositories += 1;
			}

			for (const edge of repository.languages.edges) {
				const existing = languagesByName.get(edge.node.name);

				if (existing) {
					existing.bytes += edge.size;
					existing.repositoryCount += 1;
					existing.color ||= edge.node.color;
					continue;
				}

				languagesByName.set(edge.node.name, {
					name: edge.node.name,
					bytes: edge.size,
					color: edge.node.color,
					repositoryCount: 1
				});
			}
		}

		hasNextPage = repositories.pageInfo.hasNextPage;
		after = repositories.pageInfo.endCursor;
	}

	return buildTopLanguagesResponse({
		languages: [...languagesByName.values()],
		totalRepositories,
		privateRepositories
	});
}
