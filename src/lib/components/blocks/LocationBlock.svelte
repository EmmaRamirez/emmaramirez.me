<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { env } from '$env/dynamic/public';
	import { theme } from '$lib/stores';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let mapContainer = $state<HTMLDivElement | null>(null);
	let map: mapboxgl.Map | null = null;
	let resizeObserver: ResizeObserver | null = null;
	let unsubscribeTheme: (() => void) | null = null;
	let mapError = $state<string | null>(null);
	let markers: mapboxgl.Marker[] = [];
	let currentMapStyle: string | null = null;
	let isDark = $derived($theme === 'dark');

	const locations = {
		home: {
			name: 'Washington',
			coordinates: [-120.5, 47.4] as [number, number],
			label: 'Home'
		},
		work: {
			name: 'Colorado',
			coordinates: [-105.55, 39.0] as [number, number],
			label: 'Work'
		}
	};

	// Center point between both locations
	const centerLng = (locations.home.coordinates[0] + locations.work.coordinates[0]) / 2;
	const centerLat = (locations.home.coordinates[1] + locations.work.coordinates[1]) / 2;

	const stateSourceId = 'us-states';
	const mapStyles = {
		dark: 'mapbox://styles/mapbox/dark-v11',
		light: 'mapbox://styles/mapbox/light-v11'
	} as const;

	const stateLayers = [
		{ id: 'home', stateName: 'Washington', color: '#10b981', label: 'Home' },
		{ id: 'work', stateName: 'Colorado', color: '#f59e0b', label: 'Work' }
	];

	function mapContainerAttachment(node: HTMLDivElement) {
		mapContainer = node;
		return () => {
			if (mapContainer === node) {
				mapContainer = null;
			}
		};
	}

	function clearMarkers() {
		for (const marker of markers) {
			marker.remove();
		}
		markers = [];
	}

	function createLabelElement(label: string, darkMode: boolean): HTMLDivElement {
		const el = document.createElement('div');
		el.className = `state-label ${darkMode ? 'state-label-dark' : 'state-label-light'}`;
		el.textContent = label;
		return el;
	}

	function applyMapDecorations(darkMode: boolean) {
		if (!map) {
			return;
		}

		map
			.getStyle()
			.layers?.filter((layer) => layer.id.toLowerCase().includes('state-label'))
			.forEach((layer) => {
				map?.setLayoutProperty(layer.id, 'visibility', 'none');
			});

		if (!map.getSource(stateSourceId)) {
			map.addSource(stateSourceId, {
				type: 'geojson',
				data: 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
			});
		}

		for (const { id, stateName, color } of stateLayers) {
			const fillId = `state-fill-${id}`;
			const outlineId = `state-outline-${id}`;

			if (!map.getLayer(fillId)) {
				map.addLayer({
					id: fillId,
					type: 'fill',
					source: stateSourceId,
					filter: ['==', ['get', 'name'], stateName],
					paint: {
						'fill-color': color,
						'fill-opacity': darkMode ? 0.55 : 0.45
					}
				});
			}

			if (!map.getLayer(outlineId)) {
				map.addLayer({
					id: outlineId,
					type: 'line',
					source: stateSourceId,
					filter: ['==', ['get', 'name'], stateName],
					paint: {
						'line-color': color,
						'line-width': darkMode ? 2 : 2.5,
						'line-opacity': darkMode ? 0.9 : 0.95
					}
				});
			}
		}

		clearMarkers();

		markers = [
			new mapboxgl.Marker({
				element: createLabelElement(locations.home.label, darkMode),
				anchor: 'center'
			})
				.setLngLat(locations.home.coordinates)
				.addTo(map),
			new mapboxgl.Marker({
				element: createLabelElement(locations.work.label, darkMode),
				anchor: 'center'
			})
				.setLngLat(locations.work.coordinates)
				.addTo(map)
		];
	}

	onMount(() => {
		const token = env.PUBLIC_MAPBOX_TOKEN;

		if (!token) {
			mapError = 'Add PUBLIC_MAPBOX_TOKEN to .env';
			console.error(
				'Mapbox token not found. Please rename MAPBOX_TOKEN to PUBLIC_MAPBOX_TOKEN in your .env file.'
			);
			return;
		}

		mapboxgl.accessToken = token;

		if (!mapContainer) {
			return;
		}

		const handleResize = () => {
			// Mapbox needs explicit resize calls when the container changes size
			map?.resize();
		};

		currentMapStyle = isDark ? mapStyles.dark : mapStyles.light;

		map = new mapboxgl.Map({
			container: mapContainer,
			style: currentMapStyle,
			center: [centerLng, centerLat],
			zoom: 3.5,
			interactive: false,
			attributionControl: false
		});

		map.on('style.load', () => {
			handleResize();
			applyMapDecorations(isDark);
		});

		unsubscribeTheme = theme.subscribe((value) => {
			const nextStyle = value === 'dark' ? mapStyles.dark : mapStyles.light;
			if (!map || currentMapStyle === nextStyle) {
				return;
			}

			currentMapStyle = nextStyle;
			map.setStyle(nextStyle);
		});

		resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(mapContainer);

		window.addEventListener('resize', handleResize);

		return () => {
			clearMarkers();
			unsubscribeTheme?.();
			map?.remove();
			resizeObserver?.disconnect();
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div
	class="location-block relative overflow-hidden rounded-xl border border-(--border-color) {className}"
	class:is-dark={isDark}
>
	{#if mapError}
		<div class="error-state flex h-full w-full items-center justify-center bg-(--surface)">
			<div class="p-6 text-center">
				<svg
					class="mx-auto mb-3 h-10 w-10 text-(--text-muted)"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<p class="font-mono text-sm text-(--text-muted)">{mapError}</p>
			</div>
		</div>
	{:else}
		<div {@attach mapContainerAttachment} class="map-container"></div>
	{/if}

	<div class="map-overlay absolute right-0 bottom-0 left-0 z-10 p-4 pt-12">
		<div class="flex items-end justify-between gap-4">
			<div class="flex items-center gap-3">
				<div class="legend-item">
					<span class="legend-dot legend-home"></span>
					<span class="legend-text text-sm">{locations.home.label}</span>
				</div>
				<div class="legend-item">
					<span class="legend-dot legend-work"></span>
					<span class="legend-text text-sm">{locations.work.label}</span>
				</div>
			</div>
			<span class="map-caption font-serif text-xs tracking-wider uppercase">Where I'm At</span>
		</div>
	</div>
</div>

<style>
	.location-block {
		aspect-ratio: 4 / 3;
		background: var(--card-bg);
		--map-overlay-top: rgba(255, 255, 255, 0);
		--map-overlay-mid: rgba(255, 255, 255, 0.55);
		--map-overlay-bottom: rgba(255, 255, 255, 0.92);
		--map-legend-text: rgba(20, 16, 12, 0.92);
		--map-caption-text: rgba(20, 16, 12, 0.68);
	}

	.location-block.is-dark {
		--map-overlay-top: rgba(0, 0, 0, 0);
		--map-overlay-mid: rgba(0, 0, 0, 0.3);
		--map-overlay-bottom: rgba(0, 0, 0, 0.7);
		--map-legend-text: rgba(255, 255, 255, 0.92);
		--map-caption-text: rgba(255, 255, 255, 0.6);
	}

	.map-container {
		width: 100%;
		height: 100%;
	}

	.map-overlay {
		background: linear-gradient(
			to top,
			var(--map-overlay-bottom),
			var(--map-overlay-mid),
			var(--map-overlay-top)
		);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.legend-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
	}

	.legend-home {
		background: #10b981;
		box-shadow: 0 0 8px #10b98180;
	}

	.legend-work {
		background: #f59e0b;
		box-shadow: 0 0 8px #f59e0b80;
	}

	.legend-text {
		color: var(--map-legend-text);
	}

	.map-caption {
		color: var(--map-caption-text);
	}

	/* State label styling */
	:global(.state-label) {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		pointer-events: none;
	}

	:global(.state-label-dark) {
		color: #ffffff;
		text-shadow:
			0 1px 3px rgba(0, 0, 0, 0.8),
			0 0 8px rgba(0, 0, 0, 0.5);
	}

	:global(.state-label-light) {
		color: rgba(20, 16, 12, 0.95);
		text-shadow:
			0 1px 3px rgba(255, 255, 255, 0.85),
			0 0 8px rgba(255, 255, 255, 0.55);
	}

	/* Hide Mapbox attribution/controls for cleaner look */
	:global(.mapboxgl-ctrl-logo),
	:global(.mapboxgl-ctrl-attrib) {
		display: none !important;
	}
</style>
