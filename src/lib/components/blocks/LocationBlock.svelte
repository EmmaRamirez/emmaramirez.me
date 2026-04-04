<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { env } from '$env/dynamic/public';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

let mapContainer = $state<HTMLDivElement | null>(null);
let map: mapboxgl.Map | null = null;
let resizeObserver: ResizeObserver | null = null;
	let mapError = $state<string | null>(null);

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

	onMount(() => {
		const token = env.PUBLIC_MAPBOX_TOKEN;

		if (!token) {
			mapError = 'Add PUBLIC_MAPBOX_TOKEN to .env';
			console.error('Mapbox token not found. Please rename MAPBOX_TOKEN to PUBLIC_MAPBOX_TOKEN in your .env file.');
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

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/dark-v11',
			center: [centerLng, centerLat],
			zoom: 3.5,
			interactive: false,
			attributionControl: false
		});

		map.on('load', () => {
			handleResize();

			map
				.getStyle()
				.layers?.filter((layer) => layer.id.toLowerCase().includes('state-label'))
				.forEach((layer) => {
					map?.setLayoutProperty(layer.id, 'visibility', 'none');
				});

			// Use public US states GeoJSON
			if (!map?.getSource(stateSourceId)) {
				map?.addSource(stateSourceId, {
					type: 'geojson',
					data: 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
				});
			}

			stateLayers.forEach(({ id, stateName, color }) => {
				const fillId = `state-fill-${id}`;
				const outlineId = `state-outline-${id}`;

				if (!map?.getLayer(fillId)) {
					map?.addLayer({
						id: fillId,
						type: 'fill',
						source: stateSourceId,
						filter: ['==', ['get', 'name'], stateName],
						paint: {
							'fill-color': color,
							'fill-opacity': 0.55
						}
					});
				}

				if (!map?.getLayer(outlineId)) {
					map?.addLayer({
						id: outlineId,
						type: 'line',
						source: stateSourceId,
						filter: ['==', ['get', 'name'], stateName],
						paint: {
							'line-color': color,
							'line-width': 2,
							'line-opacity': 0.9
						}
					});
				}
			});

			// Add text labels as HTML markers at state centers
			const createLabelElement = (label: string): HTMLDivElement => {
				const el = document.createElement('div');
				el.className = 'state-label';
				el.textContent = label;
				return el;
			};

			new mapboxgl.Marker({ element: createLabelElement(locations.home.label), anchor: 'center' })
				.setLngLat(locations.home.coordinates)
				.addTo(map!);

			new mapboxgl.Marker({ element: createLabelElement(locations.work.label), anchor: 'center' })
				.setLngLat(locations.work.coordinates)
				.addTo(map!);
		});

		resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(mapContainer);

		window.addEventListener('resize', handleResize);

		return () => {
			map?.remove();
			resizeObserver?.disconnect();
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="location-block relative overflow-hidden rounded-xl border border-(--border-color) {className}">
	{#if mapError}
		<div class="error-state flex h-full w-full items-center justify-center bg-(--surface)">
			<div class="text-center p-6">
				<svg class="mx-auto mb-3 h-10 w-10 text-(--text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<p class="text-sm text-(--text-muted) font-mono">{mapError}</p>
			</div>
		</div>
	{:else}
		<div {@attach mapContainerAttachment} class="map-container"></div>
	{/if}
	
	<div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-12">
		<div class="flex items-end justify-between gap-4">
			<div class="flex items-center gap-3">
				<div class="legend-item">
					<span class="legend-dot legend-home"></span>
					<span class="text-sm text-white/90">{locations.home.label}</span>
				</div>
				<div class="legend-item">
					<span class="legend-dot legend-work"></span>
					<span class="text-sm text-white/90">{locations.work.label}</span>
				</div>
			</div>
			<span class="font-serif text-xs tracking-wider text-white/60 uppercase">Where I'm At</span>
		</div>
	</div>
</div>

<style>
	.location-block {
		aspect-ratio: 4 / 3;
		background: var(--card-bg);
	}

	.map-container {
		width: 100%;
		height: 100%;
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

	/* State label styling */
	:global(.state-label) {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #ffffff;
		text-shadow: 
			0 1px 3px rgba(0, 0, 0, 0.8),
			0 0 8px rgba(0, 0, 0, 0.5);
		pointer-events: none;
	}

	/* Hide Mapbox attribution/controls for cleaner look */
	:global(.mapboxgl-ctrl-logo),
	:global(.mapboxgl-ctrl-attrib) {
		display: none !important;
	}
</style>

