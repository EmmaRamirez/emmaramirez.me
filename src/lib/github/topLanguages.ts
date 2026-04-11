export interface TopLanguage {
	name: string;
	percentage: number;
	color: string;
	note: string;
}

export interface TopLanguagesSummary {
	totalRepositories: number;
	privateRepositories: number;
	totalLanguages: number;
}

export interface TopLanguagesResponse {
	languages: TopLanguage[];
	summary: TopLanguagesSummary;
}

export interface LanguageAggregateInput {
	name: string;
	bytes: number;
	color?: string | null;
	repositoryCount: number;
}

const MAX_VISIBLE_LANGUAGES = 5;
const EXCLUDED_LANGUAGE_NAMES = new Set([
	'coldfusion',
	'css',
	'scss',
	'html',
	'json',
	'javascript',
	'other'
]);

export const fallbackTopLanguages: TopLanguage[] = [
	{
		name: 'Svelte',
		percentage: 30,
		color: 'var(--lang-svelte)',
		note: 'interfaces, motion, and design systems'
	},
	{
		name: 'TypeScript',
		percentage: 25,
		color: 'var(--lang-typescript)',
		note: 'component APIs, tooling, and app glue'
	},
	{
		name: 'Rust',
		percentage: 20,
		color: 'var(--lang-rust)',
		note: 'CLIs, experiments, and performance rabbit holes'
	},
	{
		name: 'Elixir',
		percentage: 20,
		color: 'var(--lang-elixir)',
		note: 'realtime backends and durable app logic'
	},
	{
		name: 'Haskell',
		percentage: 5,
		color: 'var(--lang-haskell)',
		note: 'type-driven side quests'
	}
];

function formatRepositoryNote(repositoryCount: number) {
	return `${repositoryCount} ${repositoryCount === 1 ? 'repo' : 'repos'}`;
}

function isIncludedLanguage(name: string) {
	return !EXCLUDED_LANGUAGE_NAMES.has(name.trim().toLowerCase());
}

export function roundPercentages(weights: number[]) {
	const total = weights.reduce((sum, weight) => sum + weight, 0);

	if (!total) {
		return weights.map(() => 0);
	}

	const scaled = weights.map((weight) => (weight / total) * 100);
	const floors = scaled.map((value) => Math.floor(value));
	const remainder = 100 - floors.reduce((sum, value) => sum + value, 0);

	return floors
		.map((value, index) => ({
			index,
			value,
			fraction: scaled[index] - value
		}))
		.sort((left, right) => right.fraction - left.fraction)
		.map((entry, rank) => ({
			...entry,
			value: entry.value + (rank < remainder ? 1 : 0)
		}))
		.sort((left, right) => left.index - right.index)
		.map((entry) => entry.value);
}

export function buildTopLanguagesResponse(args: {
	languages: LanguageAggregateInput[];
	totalRepositories: number;
	privateRepositories: number;
}): TopLanguagesResponse {
	const sortedLanguages = [...args.languages]
		.filter((language) => language.bytes > 0 && isIncludedLanguage(language.name))
		.sort((left, right) => right.bytes - left.bytes);
	const visibleLanguages = sortedLanguages.slice(0, MAX_VISIBLE_LANGUAGES);
	const percentages = roundPercentages(visibleLanguages.map((language) => language.bytes));

	return {
		languages: visibleLanguages.map((language, index) => ({
			name: language.name,
			percentage: percentages[index] ?? 0,
			color: language.color || fallbackTopLanguages[index]?.color || 'var(--text-muted)',
			note: formatRepositoryNote(language.repositoryCount)
		})),
		summary: {
			totalRepositories: args.totalRepositories,
			privateRepositories: args.privateRepositories,
			totalLanguages: sortedLanguages.length
		}
	};
}
