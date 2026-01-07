export type PokemonDetails = {
	id: number;
	height: number;
	weight: number;
	baseExperience: number;
	types: string[];
	abilities: string[];
	sprite: string | null;
};

type PokemonApiResponse = {
	id: number;
	height: number;
	weight: number;
	base_experience: number;
	types: { type: { name: string } }[];
	abilities: { ability: { name: string } }[];
	sprites: {
		other?: { ['official-artwork']?: { front_default: string | null } };
		front_default: string | null;
	};
};

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export function getPokemonSpriteUrl(id: number): string {
	return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function fetchPokemonDetails(id: number): Promise<PokemonDetails> {
	const response = await fetch(`${POKEAPI_BASE_URL}/${id}`);

	if (!response.ok) {
		throw new Error('Unable to load Pokédex info. Please try again.');
	}

	const data: PokemonApiResponse = await response.json();

	const sprite =
		data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default;

	return {
		id: data.id,
		height: data.height,
		weight: data.weight,
		baseExperience: data.base_experience,
		types: data.types.map((type) => type.type.name),
		abilities: data.abilities.map((ability) => ability.ability.name),
		sprite
	};
}
