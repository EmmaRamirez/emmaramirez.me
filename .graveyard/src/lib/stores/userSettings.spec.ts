import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({
	browser: false,
	dev: false
}));

describe('pokemonTeamSettings', () => {
	beforeEach(async () => {
		vi.resetModules();
		const { pokemonTeamSettings } = await import('./userSettings.svelte');
		pokemonTeamSettings.reset();
	});

	it('normalizes incomplete teams back to six slots', async () => {
		const { defaultPokemonTeam, normalizePokemonTeam } = await import('./userSettings.svelte');

		const normalized = normalizePokemonTeam([{ id: 25, name: 'Pikachu' }]);

		expect(normalized).toHaveLength(6);
		expect(normalized[0]).toEqual({ id: 25, name: 'Pikachu' });
		expect(normalized.slice(1)).toEqual(defaultPokemonTeam.slice(1));
	});

	it('updates one slot without changing the others', async () => {
		const { defaultPokemonTeam, pokemonTeamSettings } = await import('./userSettings.svelte');

		pokemonTeamSettings.setSlot(2, { id: 25, name: 'Pikachu' });

		expect(pokemonTeamSettings.team[2]).toEqual({ id: 25, name: 'Pikachu' });
		expect(pokemonTeamSettings.team[0]).toEqual(defaultPokemonTeam[0]);
		expect(pokemonTeamSettings.team[5]).toEqual(defaultPokemonTeam[5]);
	});
});
