export type ChangelogChangeType =
	| 'build'
	| 'chore'
	| 'ci'
	| 'docs'
	| 'feature'
	| 'fix'
	| 'perf'
	| 'refactor'
	| 'revert'
	| 'style'
	| 'test';

const CONVENTIONAL_COMMIT_PREFIX =
	/^([a-z]+)(?:\([^)]+\))?!?:\s*(.*)$/i;

const PREFIX_TO_TYPE: Record<string, ChangelogChangeType> = {
	feat: 'feature',
	feature: 'feature',
	fix: 'fix',
	docs: 'docs',
	style: 'style',
	refactor: 'refactor',
	perf: 'perf',
	test: 'test',
	build: 'build',
	ci: 'ci',
	chore: 'chore',
	revert: 'revert'
};

export function parseCommitMessage(rawMessage: string): {
	message: string;
	type: ChangelogChangeType;
} {
	const subject = rawMessage.split('\n')[0]?.trim() || 'Untitled commit';
	const match = subject.match(CONVENTIONAL_COMMIT_PREFIX);

	if (!match) {
		return {
			type: 'feature',
			message: subject
		};
	}

	const prefix = match[1].toLowerCase();
	const message = match[2].trim() || subject;

	return {
		type: PREFIX_TO_TYPE[prefix] ?? 'feature',
		message
	};
}
