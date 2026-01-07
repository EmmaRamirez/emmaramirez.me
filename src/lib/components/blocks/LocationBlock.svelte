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
			coordinates: [-120.7401, 47.7511] as [number, number],
			label: 'Home'
		},
		work: {
			name: 'Colorado',
			coordinates: [-105.7821, 39.5501] as [number, number],
			label: 'Work'
		}
	};

	// Center point between both locations
	const centerLng = (locations.home.coordinates[0] + locations.work.coordinates[0]) / 2;
	const centerLat = (locations.home.coordinates[1] + locations.work.coordinates[1]) / 2;

	const stateSourceId = 'state-boundaries';
	const stateSourceLayer = 'boundaries_adm1';

	const stateLayers = [
		{ id: 'home', code: 'US-WA', color: '#10b981' },
		{ id: 'work', code: 'US-CO', color: '#f59e0b' }
	];

	function createMarkerElement(type: 'home' | 'work'): HTMLDivElement {
		const el = document.createElement('div');
		el.className = `location-marker location-marker-${type}`;
		
		const icon = type === 'home' 
			? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
				<polyline points="9 22 9 12 15 12 15 22"/>
			</svg>`
			: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
				<path d="M9 22v-4h6v4"/>
				<path d="M8 6h.01"/>
				<path d="M16 6h.01"/>
				<path d="M12 6h.01"/>
				<path d="M12 10h.01"/>
				<path d="M12 14h.01"/>
				<path d="M16 10h.01"/>
				<path d="M16 14h.01"/>
				<path d="M8 10h.01"/>
				<path d="M8 14h.01"/>
			</svg>`;

		el.innerHTML = `
			<div class="marker-pin">
				<div class="marker-icon">${icon}</div>
			</div>
			<span class="marker-label">${locations[type].label}</span>
		`;
		
		return el;
	}

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

			if (!map?.getSource(stateSourceId)) {
				map?.addSource(stateSourceId, {
					type: 'vector',
					url: 'mapbox://mapbox.boundaries-adm1-v4'
				});
			}

			stateLayers.forEach(({ id, code, color }) => {
				const fillId = `state-fill-${id}`;
				const outlineId = `state-outline-${id}`;

				if (!map?.getLayer(fillId)) {
					map?.addLayer({
						id: fillId,
						type: 'fill',
						source: stateSourceId,
						'source-layer': stateSourceLayer,
						filter: ['==', ['get', 'iso_3166_2'], code],
						paint: {
							'fill-color': color,
							'fill-opacity': 0.32
						}
					});
				}

				if (!map?.getLayer(outlineId)) {
					map?.addLayer({
						id: outlineId,
						type: 'line',
						source: stateSourceId,
						'source-layer': stateSourceLayer,
						filter: ['==', ['get', 'iso_3166_2'], code],
						paint: {
							'line-color': color,
							'line-width': 1.15,
							'line-opacity': 0.7
						}
					});
				}
			});

			if (!map?.getLayer('state-labels-custom')) {
				map?.addLayer({
					id: 'state-labels-custom',
					type: 'symbol',
					source: stateSourceId,
					'source-layer': stateSourceLayer,
					filter: ['match', ['get', 'iso_3166_2'], ['US-WA', 'US-CO'], true, false],
					layout: {
						'text-field': [
							'match',
							['get', 'iso_3166_2'],
							'US-WA',
							locations.home.label,
							'US-CO',
							locations.work.label,
							''
						],
						'text-font': ['Inter Bold', 'Arial Unicode MS Bold'],
						'text-size': 13,
						'text-letter-spacing': 0.2,
						'text-transform': 'uppercase',
						'text-justify': 'center',
						'text-allow-overlap': true
					},
					paint: {
						'text-color': '#f9fafb',
						'text-halo-color': '#0b1120',
						'text-halo-width': 1.5
					}
				});
			}

			// Add home marker (Washington)
			const homeMarker = createMarkerElement('home');
			new mapboxgl.Marker({ element: homeMarker, anchor: 'bottom' })
				.setLngLat(locations.home.coordinates)
				.addTo(map!);

			// Add work marker (Colorado)
			const workMarker = createMarkerElement('work');
			new mapboxgl.Marker({ element: workMarker, anchor: 'bottom' })
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

	/* Marker styling */
	:global(.location-marker) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		cursor: default;
	}

	:global(.marker-pin) {
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition: transform 0.2s ease;
	}

	:global(.location-marker:hover .marker-pin) {
		transform: scale(1.1);
	}

	:global(.location-marker-home .marker-pin) {
		background: linear-gradient(135deg, #10b981, #059669);
	}

	:global(.location-marker-work .marker-pin) {
		background: linear-gradient(135deg, #f59e0b, #d97706);
	}

	:global(.marker-icon) {
		width: 1.1rem;
		height: 1.1rem;
		color: white;
	}

	:global(.marker-icon svg) {
		width: 100%;
		height: 100%;
	}

	:global(.marker-label) {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: white;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
		background: rgba(0, 0, 0, 0.4);
		padding: 0.15rem 0.4rem;
		border-radius: 0.25rem;
		backdrop-filter: blur(4px);
	}

	/* Hide Mapbox attribution/controls for cleaner look */
	:global(.mapboxgl-ctrl-logo),
	:global(.mapboxgl-ctrl-attrib) {
		display: none !important;
	}
</style>

