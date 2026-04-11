<script lang="ts">
	import {
		fetchPokemonDetails,
		formatPokemonHeight,
		formatPokemonWeight,
		getPokemonSpriteUrl,
		type PokemonDetails
	} from '$lib/api/pokemon';
	import type { Pokemon } from '$lib/website.config';

	interface PokemonBlockProps {
		team: Pokemon[];
		class?: string;
	}

	let { team, class: className = '' }: PokemonBlockProps = $props();

	const detailsCache = $state<Record<number, PokemonDetails>>({});
	const popoverRefs = $state<Record<number, HTMLDivElement | null>>({});
	let selectedPokemonId = $state<number | null>(null);
	let lastSelectedPokemonId = $state<number | null>(null);
	let loadingId = $state<number | null>(null);
	let error = $state<string | null>(null);
	let hideTimer: ReturnType<typeof setTimeout> | null = null;

	function getAnchorId(id: number) {
		return `pokemon-anchor-${id}`;
	}

	function getAnchorName(id: number) {
		return `--pokemon-anchor-${id}`;
	}

	function getPopoverId(id: number) {
		return `pokemon-popover-${id}`;
	}

	function registerPopover(id: number) {
		return (node: HTMLDivElement) => {
			popoverRefs[id] = node;
			return () => {
				popoverRefs[id] = null;
			};
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
		lastSelectedPokemonId = id;
		error = null;

		if (detailsCache[id]) {
			return;
		}

		loadingId = id;

		try {
			detailsCache[id] = await fetchPokemonDetails(id);
		} catch (fetchError) {
			error =
				fetchError instanceof Error
					? fetchError.message
					: 'Unable to load Pokédex info. Please try again.';
		} finally {
			loadingId = null;
		}
	}

	const selectedPokemon = $derived(
		lastSelectedPokemonId
			? (team.find((pokemon) => pokemon.id === lastSelectedPokemonId) ?? null)
			: null
	);

	const selectedDetails = $derived(
		lastSelectedPokemonId ? (detailsCache[lastSelectedPokemonId] ?? null) : null
	);
</script>

<div
	class="pokemon-block relative overflow-hidden rounded-lg border border-(--border-color) {className}"
>
	<div class="pokemon-bg absolute inset-0"></div>

	<div class="pokemon-content relative z-10 flex h-full flex-col justify-between p-5">
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
					onfocus={async () => {
						cancelHide();
						await selectPokemon(pokemon.id);
						showPopover(pokemon.id);
					}}
					onmouseleave={() => scheduleHide(pokemon.id)}
					onblur={() => scheduleHide(pokemon.id)}
				>
					<img
						src={getPokemonSpriteUrl(pokemon.id)}
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
					{@attach registerPopover(pokemon.id)}
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

		<div class="pokemon-inline">
			{#if selectedPokemon}
				<div class="pokemon-inline__header">
					<span class="pokemon-inline__title">#{selectedPokemon.id} {selectedPokemon.name}</span>
					{#if selectedDetails?.types?.length}
						<span class="pokemon-inline__types">{selectedDetails.types.join(' / ')}</span>
					{/if}
				</div>
				{#if loadingId === selectedPokemon.id}
					<p class="pokemon-inline__status">Loading extra data...</p>
				{:else if error}
					<p class="pokemon-inline__status text-red-600">Unable to load details.</p>
				{:else if selectedDetails}
					<div class="pokemon-inline__details">
						<div class="pokemon-inline__stat">
							<span class="pokemon-inline__label">Height</span>
							<span class="pokemon-inline__value">
								{formatPokemonHeight(selectedDetails.heightMeters)}
							</span>
						</div>
						<div class="pokemon-inline__stat">
							<span class="pokemon-inline__label">Weight</span>
							<span class="pokemon-inline__value">
								{formatPokemonWeight(selectedDetails.weightKilograms)}
							</span>
						</div>
						<div class="pokemon-inline__stat">
							<span class="pokemon-inline__label">Base XP</span>
							<span class="pokemon-inline__value">{selectedDetails.baseExperience}</span>
						</div>
						<div class="pokemon-inline__stat pokemon-inline__stat--wide">
							<span class="pokemon-inline__label">Abilities</span>
							<span class="pokemon-inline__value">
								{selectedDetails.abilities.join(', ')}
							</span>
						</div>
					</div>
				{:else}
					<p class="pokemon-inline__status">Hover a Pokemon to load details.</p>
				{/if}
			{:else}
				<p class="pokemon-inline__status">Hover a Pokemon to load details.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.pokemon-block {
		aspect-ratio: 4 / 3;
		background: var(--card-bg);
		container-type: size;
		container-name: pokemon-block;
		--pokemon-grid-columns: 3;
		--pokemon-grid-gap: 1rem;
		--pokemon-card-padding: 0.75rem;
		--pokemon-card-radius: 0.75rem;
		--pokemon-card-max-width: 7.5rem;
		--pokemon-sprite-size: 6rem;
	}

	.pokemon-content {
		gap: 1rem;
	}

	.pokemon-team-grid {
		display: grid;
		grid-template-columns: repeat(var(--pokemon-grid-columns), minmax(0, 1fr));
		gap: var(--pokemon-grid-gap);
		align-items: center;
		justify-items: center;
		align-content: center;
		flex: 1 1 auto;
		min-height: 0;
	}

	.pokemon-bg {
		background: linear-gradient(135deg, var(--caroline-blue-600), var(--caroline-blue-800));
	}

	.pokemon-sprite {
		height: var(--pokemon-sprite-size);
		width: var(--pokemon-sprite-size);
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
		max-width: var(--pokemon-card-max-width);
		aspect-ratio: 1 / 1;
		padding: var(--pokemon-card-padding);
		background: rgba(255, 255, 255, 0.06);
		border: 0.0625rem solid rgba(255, 255, 255, 0.08);
		border-radius: var(--pokemon-card-radius);
		cursor: pointer;
		appearance: none;
		transition:
			transform 120ms ease,
			box-shadow 120ms ease,
			background-color 120ms ease;
		min-width: 0;
	}

	.pokemon-sprite.selected {
		filter: drop-shadow(0 0 0.0625rem rgba(255, 255, 255, 0.95));
	}

	.pokemon-sprite-container:hover {
		transform: translateY(-0.125rem);
		box-shadow: 0 0.625rem 1.5625rem rgba(0, 0, 0, 0.12);
		background: rgba(255, 255, 255, 0.1);
	}

	.pokemon-sprite__label {
		margin-top: 0.15rem;
		font-size: 0.95rem;
		font-weight: 700;
		color: #fff;
		text-shadow: 0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.35);
	}

	.pokemon-popover {
		position: fixed;
		padding: 0.5rem 0.75rem;
		background: var(--page-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
		box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
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

	.pokemon-inline {
		display: none;
		margin-top: 1.5rem;
		padding: 1rem;
		border-radius: 0.75rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.12);
		background: rgba(7, 12, 30, 0.35);
		color: #fff;
		backdrop-filter: blur(0.375rem);
	}

	.pokemon-inline__header {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.pokemon-inline__title {
		font-size: 1rem;
		font-weight: 700;
		text-transform: capitalize;
	}

	.pokemon-inline__types {
		font-size: 0.8rem;
		text-transform: capitalize;
		color: rgba(255, 255, 255, 0.75);
	}

	.pokemon-inline__status {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.pokemon-inline__details {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem 1rem;
	}

	.pokemon-inline__stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.pokemon-inline__stat--wide {
		grid-column: span 2;
	}

	.pokemon-inline__label {
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.6);
	}

	.pokemon-inline__value {
		font-size: 0.9rem;
		text-transform: capitalize;
	}

	@container pokemon-block (min-height: 31.25rem) {
		.pokemon-inline {
			display: block;
		}
	}

	@container pokemon-block (max-height: 18rem) {
		.pokemon-block {
			--pokemon-grid-gap: 0.75rem;
			--pokemon-card-padding: 0.5rem;
			--pokemon-card-max-width: 6rem;
			--pokemon-sprite-size: 4.25rem;
		}

		.pokemon-content {
			padding: 1rem;
		}
	}

	@container pokemon-block (max-height: 11rem) {
		.pokemon-block {
			--pokemon-grid-columns: 6;
			--pokemon-grid-gap: 0.4rem;
			--pokemon-card-padding: 0.35rem;
			--pokemon-card-radius: 0.5rem;
			--pokemon-card-max-width: none;
			--pokemon-sprite-size: 2.75rem;
		}

		.pokemon-content {
			padding: 0.75rem;
		}
	}
</style>
