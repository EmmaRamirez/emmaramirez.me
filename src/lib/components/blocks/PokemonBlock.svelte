<script lang="ts">
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';

	type Pokemon = {
		id: number;
		name: string;
	};

	type PokemonDetails = {
		abilities: string[];
		baseExperience: number;
		flavorText: string;
		genus: string;
		heightMeters: number;
		id: number;
		name: string;
		sprite: string | null;
		types: string[];
		weightKilograms: number;
	};

	type PokemonApiResponse = {
		abilities: { ability: { name: string } }[];
		base_experience: number;
		height: number;
		id: number;
		name: string;
		sprites: {
			front_default: string | null;
		};
		types: { type: { name: string } }[];
		weight: number;
	};

	type PokemonSpeciesApiResponse = {
		flavor_text_entries: {
			flavor_text: string;
			language: { name: string };
			version: { name: string };
		}[];
		genera: {
			genus: string;
			language: { name: string };
		}[];
	};

	type Props = {
		class?: string;
		team?: Pokemon[];
	};

	const defaultPokemonTeam: Pokemon[] = [
		{ id: 453, name: 'Croagunk' },
		{ id: 261, name: 'Poochyena' },
		{ id: 446, name: 'Munchlax' },
		{ id: 193, name: 'Yanma' },
		{ id: 719, name: 'Diancie' },
		{ id: 123, name: 'Scyther' }
	];

	const pokeApiBaseUrl = 'https://pokeapi.co/api/v2/pokemon';
	const pokeApiSpeciesBaseUrl = 'https://pokeapi.co/api/v2/pokemon-species';
	const preferredFlavorTextVersions = ['black', 'white', 'black-2', 'white-2'];
	const pokemonCryUrls: Partial<Record<number, string>> = {
		123: asset('/audio/pokemon-cries/123.ogg'),
		193: asset('/audio/pokemon-cries/193.ogg'),
		261: asset('/audio/pokemon-cries/261.ogg'),
		446: asset('/audio/pokemon-cries/446.ogg'),
		453: asset('/audio/pokemon-cries/453.ogg'),
		719: asset('/audio/pokemon-cries/719.ogg')
	};
	const pokemonCryCursor = `url("${asset('/cursors/audio-speaker.svg')}") 16 16, pointer`;

	let { class: className = '', team = defaultPokemonTeam }: Props = $props();

	const detailsCache = $state<Record<number, PokemonDetails>>({});
	let activeCry: HTMLAudioElement | null = null;
	let selectedPokemonId = $state<number | null>(null);
	let loadingId = $state<number | null>(null);
	let error = $state<string | null>(null);
	const activePokemonId = $derived(selectedPokemonId ?? team[0]?.id ?? null);

	const selectedPokemon = $derived(
		activePokemonId ? (team.find((pokemon) => pokemon.id === activePokemonId) ?? null) : null
	);

	const selectedDetails = $derived(activePokemonId ? (detailsCache[activePokemonId] ?? null) : null);

	function getPokemonSpriteUrl(id: number): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
	}

	function formatPokemonName(name: string): string {
		return name
			.split(/[-\s]+/)
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}

	function formatPokemonHeight(heightMeters: number): string {
		return `${heightMeters.toFixed(1)} m`;
	}

	function formatPokemonWeight(weightKilograms: number): string {
		return `${weightKilograms.toFixed(1)} kg`;
	}

	function normalizeFlavorText(text: string): string {
		return text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
	}

	function getFlavorText(data: PokemonSpeciesApiResponse): string {
		const englishEntries = data.flavor_text_entries.filter((entry) => entry.language.name === 'en');
		const preferredEntry = englishEntries.find((entry) =>
			preferredFlavorTextVersions.includes(entry.version.name)
		);

		return normalizeFlavorText(preferredEntry?.flavor_text ?? englishEntries[0]?.flavor_text ?? '');
	}

	function getGenus(data: PokemonSpeciesApiResponse): string {
		return data.genera.find((entry) => entry.language.name === 'en')?.genus ?? 'Pokemon';
	}

	function playPokemonCry(button: HTMLButtonElement) {
		const cry = button.querySelector<HTMLAudioElement>('[data-pokemon-cry]');

		if (!cry) {
			return;
		}

		activeCry?.pause();
		activeCry = cry;
		cry.currentTime = 0;
		void cry.play().catch(() => {});
	}

	async function fetchPokemonDetails(id: number): Promise<PokemonDetails> {
		const [response, speciesResponse] = await Promise.all([
			fetch(`${pokeApiBaseUrl}/${id}`),
			fetch(`${pokeApiSpeciesBaseUrl}/${id}`)
		]);

		if (!response.ok || !speciesResponse.ok) {
			throw new Error('Unable to load Pokedex info.');
		}

		const data: PokemonApiResponse = await response.json();
		const speciesData: PokemonSpeciesApiResponse = await speciesResponse.json();
		const sprite = data.sprites.front_default;

		return {
			abilities: data.abilities.map((ability) => formatPokemonName(ability.ability.name)),
			baseExperience: data.base_experience,
			flavorText: getFlavorText(speciesData),
			genus: getGenus(speciesData),
			heightMeters: data.height / 10,
			id: data.id,
			name: formatPokemonName(data.name),
			sprite,
			types: data.types.map((type) => type.type.name),
			weightKilograms: data.weight / 10
		};
	}

	async function selectPokemon(id: number) {
		selectedPokemonId = id;
		error = null;

		if (detailsCache[id]) {
			return;
		}

		loadingId = id;

		try {
			detailsCache[id] = await fetchPokemonDetails(id);
		} catch (fetchError) {
			error =
				fetchError instanceof Error ? fetchError.message : 'Unable to load Pokedex info.';
		} finally {
			loadingId = null;
		}
	}

	function activatePokemon(id: number, button: HTMLButtonElement) {
		void selectPokemon(id);
		playPokemonCry(button);
	}

	onMount(() => {
		for (const pokemon of team) {
			if (detailsCache[pokemon.id]) continue;
			void fetchPokemonDetails(pokemon.id)
				.then((details) => {
					detailsCache[pokemon.id] = details;
				})
				.catch(() => {});
		}
	});
</script>

<div
	class={['pokemon-block', className]}
	style:--pokemon-cry-cursor={pokemonCryCursor}
	aria-label="Pokemon team block"
>
	<div class="pokemon-block__topbar" aria-hidden="true">
		<span></span>
		<span></span>
	</div>

	<div class="pokemon-block__title">
		<p>The Emma Dex</p>
		<div class="pokemon-block__ball" aria-hidden="true"></div>
	</div>

	{#if selectedPokemon}
		<div class="pokemon-block__screen" aria-live="polite">
			<section class="pokemon-block__portrait-panel" aria-label="Selected Pokemon portrait">
				<div class="pokemon-block__scanline" aria-hidden="true"></div>
				<div class="pokemon-block__portrait-slot">
					{#if selectedDetails?.sprite}
						<img
							class="pokemon-block__portrait pokemon-block__portrait--sprite"
							src={selectedDetails.sprite}
							alt=""
							loading="lazy"
							aria-hidden="true"
						/>
					{:else}
						<img
							class="pokemon-block__portrait pokemon-block__portrait--sprite"
							src={getPokemonSpriteUrl(selectedPokemon.id)}
							alt=""
							loading="lazy"
							aria-hidden="true"
						/>
					{/if}
				</div>
			</section>

			<section class="pokemon-block__info-panel" aria-label="Selected Pokemon details">
				<div class="pokemon-block__identity">
					<span>#{String(selectedPokemon.id).padStart(3, '0')}</span>
					<h2>{selectedDetails?.name ?? selectedPokemon.name}</h2>
				</div>

				{#if loadingId === selectedPokemon.id}
					<p class="pokemon-block__status">Loading Pokedex info...</p>
				{:else if error}
					<p class="pokemon-block__status">{error}</p>
				{:else if selectedDetails}
					<p class="pokemon-block__classification">{selectedDetails.genus}</p>

					<div class="pokemon-block__types" aria-label="Pokemon types">
						{#each selectedDetails.types as type (type)}
							<span>{type}</span>
						{/each}
					</div>

					<dl class="pokemon-block__stats">
						<div>
							<dt>Height</dt>
							<dd>{formatPokemonHeight(selectedDetails.heightMeters)}</dd>
						</div>
						<div>
							<dt>Weight</dt>
							<dd>{formatPokemonWeight(selectedDetails.weightKilograms)}</dd>
						</div>
						<div>
							<dt>Base XP</dt>
							<dd>{selectedDetails.baseExperience}</dd>
						</div>
						<div>
							<dt>Ability</dt>
							<dd>{selectedDetails.abilities[0]}</dd>
						</div>
					</dl>
				{:else}
					<p class="pokemon-block__status">Hover, focus, or tap a teammate for details.</p>
				{/if}
			</section>

			<section class="pokemon-block__flavor-panel" aria-label="Pokedex description">
				<p>
					{selectedDetails?.flavorText ||
						'Choose a teammate to open the regional Pokedex registration file.'}
				</p>
			</section>
		</div>
	{/if}

	<div class="pokemon-block__team" aria-label="Pokemon team">
		{#each team as pokemon (pokemon.id)}
			<button
				type="button"
				class={[
					'pokemon-block__sprite-button',
					activePokemonId === pokemon.id && 'pokemon-block__sprite-button--selected'
				]}
				aria-pressed={activePokemonId === pokemon.id}
				aria-label={`Show ${pokemon.name} details`}
				onclick={(event) => activatePokemon(pokemon.id, event.currentTarget)}
				onfocus={() => selectPokemon(pokemon.id)}
				onpointerenter={() => selectPokemon(pokemon.id)}
			>
				<img
					class="pokemon-block__sprite"
					src={getPokemonSpriteUrl(pokemon.id)}
					alt=""
					loading="lazy"
					aria-hidden="true"
				/>
				<span>{pokemon.name}</span>
				{#if pokemonCryUrls[pokemon.id]}
					<audio
						data-pokemon-cry
						src={pokemonCryUrls[pokemon.id]}
						preload="auto"
						aria-hidden="true"
					></audio>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.pokemon-block {
		--pokemon-grid-size: 1.85rem;
		position: relative;
		isolation: isolate;
		display: grid;
		min-height: min(32rem, calc(142vw - 2rem));
		min-width: 0;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		gap: 0.45rem;
		overflow: hidden;
		border: 0.32rem solid #1d3432;
		border-radius: 0.35rem;
		background: #52b878;
		color: #0d221b;
		font-family: var(--font-pixel), var(--font-sans);
		padding: 0.45rem;
		box-shadow: inset 0 0 0 0.24rem rgb(222 255 221 / 0.5);
	}

	.pokemon-block::before {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-image:
			linear-gradient(90deg, rgb(16 79 58 / 0.28) 2px, transparent 2px),
			linear-gradient(180deg, rgb(16 79 58 / 0.26) 2px, transparent 2px);
		background-size:
			var(--pokemon-grid-size) var(--pokemon-grid-size),
			var(--pokemon-grid-size) var(--pokemon-grid-size);
		animation: pokemon-block-grid-drift 36s linear infinite;
		content: '';
		opacity: 0.85;
		pointer-events: none;
	}

	@keyframes pokemon-block-grid-drift {
		from {
			background-position: 0 0;
		}

		to {
			background-position: var(--pokemon-grid-size) var(--pokemon-grid-size);
		}
	}

	.pokemon-block > * {
		position: relative;
		z-index: 1;
	}

	.pokemon-block__topbar,
	.pokemon-block__title {
		position: relative;
		border: 0.24rem solid #183432;
		background: rgb(9 44 38 / 0.36);
		box-shadow: none;
	}

	.pokemon-block__topbar {
		display: flex;
		min-height: 0.75rem;
		justify-content: space-between;
		overflow: hidden;
	}

	.pokemon-block__topbar span {
		width: 22%;
		background: linear-gradient(180deg, transparent 48%, rgb(11 35 36 / 0.72) 48% 100%);
		clip-path: polygon(0 0, 88% 0, 100% 100%, 0 100%);
	}

	.pokemon-block__topbar span:last-child {
		transform: scaleX(-1);
	}

	.pokemon-block__title {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.4rem;
		min-height: 1.55rem;
		padding: 0.18rem 0.45rem;
	}

	.pokemon-block__title p {
		margin: 0;
		color: #efffee;
		font-size: clamp(0.68rem, 2.6vw, 0.86rem);
		font-weight: 900;
		letter-spacing: -0.02em;
		text-shadow:
			0.08rem 0.08rem 0 #1b4f42,
			-0.04rem -0.04rem 0 #1b4f42;
	}

	.pokemon-block__ball {
		width: 1.05rem;
		aspect-ratio: 1;
		border: 0.24rem solid #192c31;
		border-radius: 999px;
		background:
			linear-gradient(180deg, #ef3939 0 45%, #182b31 45% 55%, #f4fbf3 55% 100%);
		box-shadow: none;
	}

	.pokemon-block__screen {
		display: grid;
		min-height: 0;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.45rem;
	}

	.pokemon-block__portrait-panel,
	.pokemon-block__info-panel,
	.pokemon-block__flavor-panel {
		position: relative;
		border: 0.26rem solid #183a2f;
		background: rgb(224 255 209 / 0.22);
		box-shadow: none;
	}

	.pokemon-block__portrait-panel {
		display: grid;
		min-height: 10rem;
		place-items: center;
		overflow: hidden;
		background: rgb(224 255 209 / 0.14);
	}

	.pokemon-block__scanline {
		position: absolute;
		inset: 15% 8% auto;
		height: 0.16rem;
		background: #1b6044;
		box-shadow:
			0 1.7rem 0 rgb(27 96 68 / 0.5),
			0 3.4rem 0 rgb(27 96 68 / 0.3);
	}

	.pokemon-block__team {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.35rem;
	}

	.pokemon-block__sprite-button {
		display: grid;
		min-width: 0;
		min-height: 3.4rem;
		place-items: center;
		gap: 0;
		border: 0.24rem solid #253338;
		border-radius: 0;
		background: rgb(229 255 209 / 0.22);
		color: #0d221b;
		cursor: pointer;
		font: inherit;
		font-size: clamp(0.52rem, 2vw, 0.66rem);
		font-weight: 900;
		line-height: 1;
		padding: 0.12rem;
		text-shadow: none;
		text-transform: capitalize;
		box-shadow: none;
		transition:
			filter 140ms ease,
			background-color 140ms ease;
	}

	.pokemon-block__sprite-button:hover,
	.pokemon-block__sprite-button:focus-visible,
	.pokemon-block__sprite-button--selected {
		filter: brightness(1.06) saturate(1.05);
		transform: none;
	}

	.pokemon-block__sprite-button:hover {
		cursor: var(--pokemon-cry-cursor, pointer);
	}

	.pokemon-block__sprite-button:focus-visible {
		outline: 0.16rem solid #111f25;
		outline-offset: 0.12rem;
	}

	.pokemon-block__sprite-button--selected {
		border-color: #102d28;
		background: rgb(201 255 155 / 0.34);
		box-shadow: none;
	}

	.pokemon-block__sprite {
		width: clamp(2.2rem, 13vw, 3.2rem);
		height: clamp(2.2rem, 13vw, 3.2rem);
		object-fit: contain;
		image-rendering: pixelated;
		filter: none;
	}

	.pokemon-block__info-panel {
		display: grid;
		align-content: start;
		gap: 0.35rem;
		padding: 0.5rem;
	}

	.pokemon-block__identity {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 0.35rem;
	}

	.pokemon-block__identity span,
	.pokemon-block__classification,
	.pokemon-block__status,
	.pokemon-block__stats dt {
		margin: 0;
		color: #3f4a4b;
		font-size: clamp(0.62rem, 2.1vw, 0.76rem);
		font-weight: 900;
		letter-spacing: -0.04em;
		text-transform: uppercase;
	}

	.pokemon-block h2 {
		margin: 0;
		color: #1d2527;
		font-size: clamp(0.88rem, 3.5vw, 1.18rem);
		font-weight: 900;
		line-height: 1;
		text-transform: capitalize;
		text-shadow: 0.05rem 0.05rem 0 rgb(255 255 255 / 0.6);
	}

	.pokemon-block__classification {
		color: #263133;
		text-transform: none;
	}

	.pokemon-block__portrait-slot {
		position: relative;
		width: min(68%, 10rem);
		aspect-ratio: 1;
		z-index: 1;
	}

	.pokemon-block__portrait {
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0.28rem 0.42rem 0 rgb(45 56 56 / 0.28));
	}

	.pokemon-block__portrait--sprite {
		image-rendering: pixelated;
	}

	.pokemon-block__types {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.pokemon-block__types span {
		min-width: 3.1rem;
		border: 0.2rem solid #24383a;
		background: rgb(124 233 156 / 0.24);
		color: #112020;
		font-size: clamp(0.54rem, 1.8vw, 0.68rem);
		font-weight: 900;
		line-height: 1;
		padding: 0.18rem 0.3rem;
		text-align: center;
		text-transform: uppercase;
		text-shadow: 0.04rem 0.04rem 0 rgb(255 255 255 / 0.42);
	}

	.pokemon-block__stats {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.18rem;
		margin: 0;
	}

	.pokemon-block__stats div {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.28rem;
		align-items: baseline;
		border-bottom: 0.08rem solid rgb(43 54 56 / 0.3);
	}

	.pokemon-block__stats dd {
		margin: 0;
		min-width: 0;
		font-size: clamp(0.62rem, 2.2vw, 0.78rem);
		font-weight: 900;
		overflow: hidden;
		text-align: right;
		text-overflow: ellipsis;
		text-transform: capitalize;
		white-space: nowrap;
	}

	.pokemon-block__flavor-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		gap: 0.35rem;
		min-height: 4rem;
		padding: 0.42rem 0.5rem;
	}

	.pokemon-block__flavor-panel p {
		margin: 0;
		min-width: 0;
		max-width: 100%;
		font-size: clamp(0.84rem, 3.2vw, 1.08rem);
		font-weight: 900;
		line-height: 1.12;
		overflow-wrap: break-word;
		text-shadow: 0.04rem 0.04rem 0 rgb(255 255 255 / 0.58);
	}

	@media (min-width: 48rem) {
		.pokemon-block {
			height: 100%;
			min-height: 100%;
			gap: 0.35rem;
			padding: 0.38rem;
		}

		.pokemon-block__screen {
			grid-template-columns: minmax(0, 0.94fr) minmax(10rem, 1.06fr);
			grid-template-rows: minmax(0, 1fr) auto;
			gap: 0.35rem;
		}

		.pokemon-block__flavor-panel {
			grid-column: 1 / -1;
			min-height: 4.65rem;
		}

		.pokemon-block__portrait-panel {
			min-height: 0;
		}

		.pokemon-block__team {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}

		.pokemon-block__sprite-button {
			min-height: 2.65rem;
			font-size: 0.52rem;
		}

		.pokemon-block__sprite {
			width: clamp(1.75rem, 3.8vw, 2.45rem);
			height: clamp(1.75rem, 3.8vw, 2.45rem);
		}

		.pokemon-block__portrait-slot {
			width: min(72%, 9.5rem);
		}

		.pokemon-block__info-panel {
			padding: 0.45rem;
		}

		.pokemon-block__flavor-panel p {
			font-size: clamp(0.84rem, 1.72vw, 1rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pokemon-block::before {
			animation: none;
		}

		.pokemon-block__sprite-button {
			transition: none;
		}
	}
</style>
