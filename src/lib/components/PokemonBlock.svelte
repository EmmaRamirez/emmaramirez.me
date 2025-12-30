<script lang="ts">
	import type { Pokemon } from '$lib/website.config';

	type PokemonDetails = {
		id: number;
		height: number;
		weight: number;
		baseExperience: number;
		types: string[];
		abilities: string[];
		sprite: string | null;
	};

	interface PokemonBlockProps {
		team: Pokemon[];
		class?: string;
	}

	let { team, class: className = '' }: PokemonBlockProps = $props();

	const detailsCache = $state<Record<number, PokemonDetails>>({});
	const popoverRefs = $state<Record<number, HTMLDivElement | null>>({});
	let selectedPokemonId = $state<number | null>(null);
	let loadingId = $state<number | null>(null);
	let error = $state<string | null>(null);
	let hideTimer: ReturnType<typeof setTimeout> | null = null;

	function getSpriteUrl(id: number): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
	}

	function getAnchorId(id: number) {
		return `pokemon-anchor-${id}`;
	}

	function getAnchorName(id: number) {
		return `--pokemon-anchor-${id}`;
	}

	function getPopoverId(id: number) {
		return `pokemon-popover-${id}`;
	}

	function registerPopover(node: HTMLDivElement, id: number) {
		popoverRefs[id] = node;
		return {
			destroy() {
				popoverRefs[id] = null;
			}
		};
	}

	function hideAllPopovers(exceptId?: number) {
		for (const [key, el] of Object.entries(popoverRefs)) {
			if (Number(key) !== exceptId) {
				el?.hidePopover?.();
			}
		}
		if (!exceptId) {
			selectedPokemonId = null;
		}
	}

	function showPopover(id: number) {
		hideAllPopovers(id);
		const popover = popoverRefs[id];
		popover?.showPopover?.();
	}

	function scheduleHide(id: number, delay = 120) {
		if (hideTimer) {
			clearTimeout(hideTimer);
		}
		hideTimer = setTimeout(() => {
			popoverRefs[id]?.hidePopover?.();
			if (selectedPokemonId === id) {
				selectedPokemonId = null;
			}
		}, delay);
	}

	function cancelHide() {
		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = null;
		}
	}

	async function selectPokemon(id: number) {
		selectedPokemonId = id;
		error = null;

		if (detailsCache[id]) {
			return;
		}

		loadingId = id;

		try {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

			if (!response.ok) {
				throw new Error('Unable to load Pokédex info. Please try again.');
			}

			const data: {
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
			} = await response.json();

			const sprite =
				data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default;

			detailsCache[id] = {
				id: data.id,
				height: data.height,
				weight: data.weight,
				baseExperience: data.base_experience,
				types: data.types.map((type) => type.type.name),
				abilities: data.abilities.map((ability) => ability.ability.name),
				sprite
			};
		} catch (fetchError) {
			error =
				fetchError instanceof Error
					? fetchError.message
					: 'Unable to load Pokédex info. Please try again.';
		} finally {
			loadingId = null;
		}
	}
</script>

<div
	class="pokemon-block relative overflow-hidden rounded-lg border border-(--border-color) {className}"
>
	<div class="absolute inset-0 pokemon-bg"></div>


	<div class="relative z-10 flex h-full flex-col justify-between p-5">
		<div class="pokemon-team-grid">
			{#each team as pokemon (pokemon.id)}
				<button
					type="button"
					id={getAnchorId(pokemon.id)}
					style={`anchor-name: ${getAnchorName(pokemon.id)};`}
					class="pokemon-sprite-container"
					class:selected={selectedPokemonId === pokemon.id}
					onmouseenter={async () => {
						cancelHide();
						await selectPokemon(pokemon.id);
						showPopover(pokemon.id);
					}}
					onfocus={() => {
						cancelHide();
						showPopover(pokemon.id);
					}}
					onmouseleave={() => scheduleHide(pokemon.id)}
					onblur={() => scheduleHide(pokemon.id)}
				>
					<img
						src={getSpriteUrl(pokemon.id)}
						alt={pokemon.name}
						class="pokemon-sprite"
						class:selected={selectedPokemonId === pokemon.id}
						style:image-rendering="pixelated"
						loading="lazy"
					/>
				</button>

				<div
					id={getPopoverId(pokemon.id)}
					popover="auto"
					role="tooltip"
					aria-label={`${pokemon.name} Pokédex info`}
					style={`position-anchor: ${getAnchorName(pokemon.id)};`}
					class="pokemon-popover"
					use:registerPopover={pokemon.id}
					onmouseenter={cancelHide}
					onmouseleave={() => scheduleHide(pokemon.id)}
				>
					{#if loadingId === pokemon.id}
						<p class="text-xs text-(--text-muted)">Loading...</p>
					{:else if error && selectedPokemonId === pokemon.id}
						<p class="text-xs text-red-600">Error</p>
					{:else if detailsCache[pokemon.id]}
						<p class="pokemon-popover__name">#{pokemon.id} {pokemon.name}</p>
						<p class="pokemon-popover__types">{detailsCache[pokemon.id]?.types.join(' / ')}</p>
					{:else}
						<p class="pokemon-popover__name">#{pokemon.id} {pokemon.name}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.pokemon-block {
		aspect-ratio: 4 / 3;
		background: var(--card-bg);
	}

	.pokemon-team-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		align-items: center;
		justify-items: center;
	}

	.pokemon-bg {
		background: linear-gradient(135deg, var(--caroline-blue-600), var(--caroline-blue-800));
	}

	.pokemon-sprite {
		height: 4.75rem;
		width: 4.75rem;
		max-width: 100%;
		object-fit: contain;
		image-rendering: pixelated;
	}

	.pokemon-sprite-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		width: 100%;
		max-width: 7rem;
		aspect-ratio: 1 / 1;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.75rem;
		cursor: pointer;
		appearance: none;
		transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
	}

	.pokemon-sprite.selected {
		filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.95));
	}

	.pokemon-sprite-container:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
		background: rgba(255, 255, 255, 0.1);
	}

	.pokemon-sprite__label {
		margin-top: 0.15rem;
		font-size: 0.95rem;
		font-weight: 700;
		color: #fff;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
	}

	.pokemon-popover {
		position: fixed;
		padding: 0.5rem 0.75rem;
		background: var(--page-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		color: var(--text-primary);
		margin: 0;
		inset: unset;
		top: anchor(bottom);
		left: anchor(center);
		translate: -50% 0;
		text-align: center;
	}

	.pokemon-popover:popover-open {
		animation: pop-in 120ms ease-out;
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			scale: 0.95;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}

	.pokemon-popover__name {
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.pokemon-popover__types {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: capitalize;
	}
</style>
