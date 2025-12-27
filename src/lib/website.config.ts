/**
 * Website Configuration
 * Central configuration for customizable website features
 */

export interface Pokemon {
	id: number;
	name: string;
}

/**
 * Pokemon Team Configuration
 * Each Pokemon needs an id (Pokedex number) and name
 * Sprites are fetched from PokeAPI
 */
export const pokemonTeam: Pokemon[] = [
	{ id: 453, name: 'Croagunk' },
	{ id: 261, name: 'Poochyena' },
	{ id: 446, name: 'Munchlax' },
	{ id: 193, name: 'Yanma' },
	{ id: 719, name: 'Diancie' },
	{ id: 123, name: 'Scyther' }
];
