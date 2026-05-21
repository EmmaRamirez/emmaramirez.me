import { env } from '$env/dynamic/private';
import { parseCommitMessage } from '$lib/changelog/parseCommitMessage';
import type { ChangelogEntry, ChangelogResponse } from '$lib/types/changelog';

const GITHUB_REST_URL = 'https://api.github.com';
const DEFAULT_REPOSITORY = {
	owner: 'EmmaRamirez',
	name: 'emmaramirez.me'
} as const;
const CHANGELOG_COMMIT_LIMIT = 24;

interface GitHubCommitAuthor {
	date: string;
	name: string;
}

interface GitHubCommitPayload {
	author: GitHubCommitAuthor;
	message: string;
}

interface GitHubCommitResponse {
	commit: GitHubCommitPayload;
	html_url: string;
	sha: string;
}

function getGitHubAccessToken() {
	const token = env.GITHUB_ACCESS_TOKEN?.trim();

	if (!token) {
		throw new Error('GITHUB_ACCESS_TOKEN is not set.');
	}

	return token;
}

function getRepository() {
	const configured = env.GITHUB_REPOSITORY?.trim();

	if (!configured) {
		return DEFAULT_REPOSITORY;
	}

	const [owner, name] = configured.split('/');

	if (!owner || !name) {
		throw new Error('GITHUB_REPOSITORY must be in owner/repo format.');
	}

	return { owner, name };
}

function normalizeCommit(commit: GitHubCommitResponse): ChangelogEntry {
	const rawMessage = commit.commit.message;
	const { message, type } = parseCommitMessage(rawMessage);

	return {
		sha: commit.sha,
		shortSha: commit.sha.slice(0, 7),
		message,
		type,
		date: commit.commit.author.date,
		url: commit.html_url
	};
}

export async function getGitHubChangelog(): Promise<ChangelogResponse> {
	const repository = getRepository();
	const url = new URL(
		`${GITHUB_REST_URL}/repos/${repository.owner}/${repository.name}/commits`
	);
	url.searchParams.set('per_page', String(CHANGELOG_COMMIT_LIMIT));

	const response = await fetch(url, {
		headers: {
			accept: 'application/vnd.github+json',
			authorization: `Bearer ${getGitHubAccessToken()}`,
			'x-github-api-version': '2022-11-28'
		},
		cache: 'no-store'
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(`GitHub API request failed (${response.status}): ${details}`);
	}

	const payload = (await response.json()) as GitHubCommitResponse[];

	return {
		repository: {
			owner: repository.owner,
			name: repository.name,
			url: `https://github.com/${repository.owner}/${repository.name}`
		},
		commits: payload.map(normalizeCommit),
		fetchedAt: new Date().toISOString()
	};
}
