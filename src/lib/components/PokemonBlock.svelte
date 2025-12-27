<script lang="ts">
	import type { Pokemon } from '$lib/website.config';

	interface PokemonBlockProps {
		team: Pokemon[];
		class?: string;
	}

	let { team, class: className = '' }: PokemonBlockProps = $props();

	function getSpriteUrl(id: number): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
	}
</script>

<div
	class="pokemon-block relative overflow-hidden rounded-lg border border-(--border-color) {className}"
>
	<div class="absolute inset-0 pokemon-bg"></div>


	<div class="relative z-10 flex h-full flex-col justify-between p-5">
		<span class="text-xl font-serif text-white drop-shadow-lg text-center">My Team</span>

		<div class="grid grid-cols-3 gap-3">
			{#each team as pokemon (pokemon.id)}
				<div class="pokemon-sprite-container flex flex-col items-center justify-center">
					<img
						src={getSpriteUrl(pokemon.id)}
						alt={pokemon.name}
						class="pokemon-sprite h-16 w-16 drop-shadow-md md:h-20 md:w-20"
						loading="lazy"
					/>
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

	.pokemon-bg {
		background: linear-gradient(
			135deg,
			#1a1a2e 0%,
			#16213e 25%,
			#0f3460 50%,
			#1a1a2e 75%,
			#16213e 100%
		);
	}

	.pokemon-sprite {
		image-rendering: pixelated;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	.pokemon-sprite-container {
		padding: 0.5rem;
	}
</style>
