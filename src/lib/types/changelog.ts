import type { ChangelogChangeType } from '$lib/changelog/parseCommitMessage';

export interface ChangelogEntry {
	date: string;
	message: string;
	sha: string;
	shortSha: string;
	type: ChangelogChangeType;
	url: string;
}

export interface ChangelogResponse {
	commits: ChangelogEntry[];
	fetchedAt: string;
	repository: {
		name: string;
		owner: string;
		url: string;
	};
}
