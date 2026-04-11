import { trackedFetch } from '$lib/stores/performanceAnalytics.svelte';

export type PokemonDetails = {
	id: number;
	name: string;
	heightMeters: number;
	weightKilograms: number;
	baseExperience: number;
	types: string[];
	abilities: string[];
	sprite: string | null;
};

type PokemonApiResponse = {
	id: number;
	name: string;
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

export function formatPokemonName(name: string): string {
	return name
		.split(/[-\s]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function formatPokemonHeight(heightMeters: number): string {
	return `${heightMeters.toFixed(1)} m`;
}

export function formatPokemonWeight(weightKilograms: number): string {
	return `${weightKilograms.toFixed(1)} kg`;
}

function normalizePokemonIdentifier(identifier: number | string): string {
	if (typeof identifier === 'number') {
		return String(identifier);
	}

	return identifier
		.trim()
		.toLowerCase()
		.replace(/[\s_]+/g, '-');
}

export async function fetchPokemonDetails(identifier: number | string): Promise<PokemonDetails> {
	const normalizedIdentifier = normalizePokemonIdentifier(identifier);
	const response = await trackedFetch(
		`${POKEAPI_BASE_URL}/${encodeURIComponent(normalizedIdentifier)}`,
		undefined,
		{
			label: `PokeAPI: ${normalizedIdentifier}`,
			source: 'Pokemon API'
		}
	);

	if (!response.ok) {
		throw new Error('Unable to load Pokédex info. Please try again.');
	}

	const data: PokemonApiResponse = await response.json();

	const sprite =
		data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default;

	return {
		id: data.id,
		name: formatPokemonName(data.name),
		heightMeters: data.height / 10,
		weightKilograms: data.weight / 10,
		baseExperience: data.base_experience,
		types: data.types.map((type) => type.type.name),
		abilities: data.abilities.map((ability) => formatPokemonName(ability.ability.name)),
		sprite
	};
}
