import { describe, expect, it } from 'vitest';
import { buildTopLanguagesResponse, roundPercentages } from './topLanguages';

describe('roundPercentages', () => {
	it('sums to 100 while preserving weight order', () => {
		const percentages = roundPercentages([33, 33, 34]);

		expect(percentages).toEqual([33, 33, 34]);
		expect(percentages.reduce((sum, value) => sum + value, 0)).toBe(100);
	});

	it('distributes remainders to the largest fractions', () => {
		const percentages = roundPercentages([1, 1, 1]);

		expect(percentages).toEqual([34, 33, 33]);
	});
});

describe('buildTopLanguagesResponse', () => {
	it('filters excluded languages and omits an Other bucket', () => {
		const response = buildTopLanguagesResponse({
			languages: [
				{ name: 'TypeScript', bytes: 500, color: '#3178c6', repositoryCount: 5 },
				{ name: 'CSS', bytes: 450, color: '#663399', repositoryCount: 5 },
				{ name: 'JavaScript', bytes: 425, color: '#f1e05a', repositoryCount: 6 },
				{ name: 'Svelte', bytes: 400, color: '#ff3e00', repositoryCount: 4 },
				{ name: 'Rust', bytes: 300, color: '#dea584', repositoryCount: 3 },
				{ name: 'Elixir', bytes: 200, color: '#6e4a7e', repositoryCount: 2 },
				{ name: 'Haskell', bytes: 100, color: '#5e5086', repositoryCount: 1 },
				{ name: 'Go', bytes: 50, color: '#00add8', repositoryCount: 1 },
				{ name: 'HTML', bytes: 40, color: '#e34c26', repositoryCount: 2 },
				{ name: 'JSON', bytes: 30, color: '#292929', repositoryCount: 3 },
				{ name: 'Other', bytes: 20, color: '#999999', repositoryCount: 1 }
			],
			totalRepositories: 8,
			privateRepositories: 3
		});

		expect(response.languages.map((language) => language.name)).toEqual([
			'TypeScript',
			'Svelte',
			'Rust',
			'Elixir',
			'Haskell'
		]);
		expect(response.languages.some((language) => language.name === 'Other')).toBe(false);
		expect(response.languages.some((language) => language.name === 'JavaScript')).toBe(false);
		expect(response.languages.reduce((sum, language) => sum + language.percentage, 0)).toBe(100);
		expect(response.summary).toEqual({
			totalRepositories: 8,
			privateRepositories: 3,
			totalLanguages: 6
		});
	});
});
