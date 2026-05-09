<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import type { FeatureCollection, Point } from 'geojson';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import '$lib/styles/mapbox.css';
	import { env } from '$env/dynamic/public';
	import { mapRegionById, mapRegions } from '$lib/data/mapRegions';
	import { theme } from '$lib/stores';
	import { performanceAnalytics, trackedFetch } from '$lib/stores/performanceAnalytics.svelte';
	import type { MapPlaceRecord } from '$lib/types/mapPlaces';

	interface Props {
		class?: string;
	}

	interface VisitorRegionGroup {
		regionId: string;
		regionName: string;
		countryName: string;
		latitude: number;
		longitude: number;
		count: number;
		names: string[];
	}

	let { class: className = '' }: Props = $props();

	let mapContainer = $state<HTMLDivElement | null>(null);
	let resizeObserver: ResizeObserver | null = null;
	let unsubscribeTheme: (() => void) | null = null;
	let mapError = $state<string | null>(null);
	let map: mapboxgl.Map | null = null;
	let markers: mapboxgl.Marker[] = [];
	let hoverPopup: mapboxgl.Popup | null = null;
	let visitorPopup: mapboxgl.Popup | null = null;
	let currentMapStyle: string | null = null;
	let selectedRegionId = $state('');
	let visitorName = $state('');
	let visitorPlaces = $state<MapPlaceRecord[]>([]);
	let submissionState = $state<'idle' | 'submitting' | 'error'>('idle');
	let submissionMessage = $state<string | null>(null);
	let placesError = $state<string | null>(null);
	let loadingPlaces = $state(true);
	let isDark = $derived($theme === 'dark');
	let selectedRegion = $derived(
		selectedRegionId ? (mapRegionById.get(selectedRegionId) ?? null) : null
	);
	let selectedRegionVisitorCount = $derived(
		selectedRegionId
			? visitorPlaces.filter((place) => place.regionId === selectedRegionId).length
			: 0
	);

	const geographyDataUrl = `${base}/data/north-america-regions.geojson`;
	const geographySourceId = 'north-america-regions';
	const geographyFillLayerId = 'north-america-regions-fill';
	const geographyOutlineLayerId = 'north-america-regions-outline';
	const geographyHoverLayerId = 'north-america-regions-hover';
	const geographySelectedLayerId = 'north-america-regions-selected';
	const visitorSourceId = 'visitor-places';
	const visitorCircleLayerId = 'visitor-places-circle';
	const noRegionFilter = ['==', ['get', 'id'], '__none__'] as mapboxgl.FilterSpecification;
	const defaultBounds = new mapboxgl.LngLatBounds([-141, 24], [-52, 73]);

	const curatedLocations = {
		home: {
			coordinates: [-120.5, 47.4] as [number, number],
			label: 'Home'
		},
		work: {
			coordinates: [-105.55, 39.0] as [number, number],
			label: 'Work'
		}
	};

	const mapStyles = {
		dark: 'mapbox://styles/mapbox/dark-v11',
		light: 'mapbox://styles/mapbox/light-v11'
	} as const;

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
		const element = document.createElement('div');
		element.className = `state-label ${darkMode ? 'state-label-dark' : 'state-label-light'}`;
		element.textContent = label;
		return element;
	}

	function getRegionFilter(regionId: string) {
		return (
			regionId ? ['==', ['get', 'id'], regionId] : noRegionFilter
		) as mapboxgl.FilterSpecification;
	}

	function buildVisitorRegionGroups(places: MapPlaceRecord[]): VisitorRegionGroup[] {
		const groups: Record<string, VisitorRegionGroup> = {};

		for (const place of places) {
			const existing = groups[place.regionId];
			if (existing) {
				existing.count += 1;
				existing.names.push(place.name);
				continue;
			}

			groups[place.regionId] = {
				regionId: place.regionId,
				regionName: place.regionName,
				countryName: place.countryName,
				latitude: place.latitude,
				longitude: place.longitude,
				count: 1,
				names: [place.name]
			};
		}

		return Object.values(groups);
	}

	function buildVisitorFeatureCollection(groups: VisitorRegionGroup[]) {
		return {
			type: 'FeatureCollection',
			features: groups.map((group) => ({
				type: 'Feature',
				properties: {
					regionId: group.regionId,
					regionName: group.regionName,
					countryName: group.countryName,
					count: group.count,
					names: group.names.join(', ')
				},
				geometry: {
					type: 'Point',
					coordinates: [group.longitude, group.latitude]
				}
			}))
		} as FeatureCollection<Point>;
	}

	function syncSelectedRegion() {
		if (!map || !map.getLayer(geographySelectedLayerId)) return;
		map.setFilter(geographySelectedLayerId, getRegionFilter(selectedRegionId));
	}

	function syncVisitorPlacesSource() {
		if (!map) return;

		const source = map.getSource(visitorSourceId) as mapboxgl.GeoJSONSource | undefined;
		if (!source) return;

		source.setData(buildVisitorFeatureCollection(buildVisitorRegionGroups(visitorPlaces)));
	}

	function hideTransientPopups() {
		hoverPopup?.remove();
		visitorPopup?.remove();
		map?.getCanvas().style.setProperty('cursor', '');
	}

	function escapeHtml(value: string) {
		return value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#39;');
	}

	function formatVisitorPopup(
		names: string,
		count: number,
		regionName: string,
		countryName: string
	) {
		const preview = names.split(', ').slice(0, 4).map(escapeHtml);
		const suffix = count > preview.length ? ` and ${count - preview.length} more` : '';
		return `<strong>${count} visitor${count === 1 ? '' : 's'}</strong><br>${preview.join(', ')}${suffix}<br><span>${escapeHtml(regionName)}, ${escapeHtml(countryName)}</span>`;
	}

	function getStringProperty(
		feature: mapboxgl.MapboxGeoJSONFeature | undefined,
		key: string
	): string | null {
		const value = feature?.properties?.[key];
		return typeof value === 'string' ? value : null;
	}

	function getNumberProperty(
		feature: mapboxgl.MapboxGeoJSONFeature | undefined,
		key: string
	): number | null {
		const value = feature?.properties?.[key];
		return typeof value === 'number' ? value : null;
	}

	function selectRegion(regionId: string) {
		selectedRegionId = regionId;
		submissionState = 'idle';
		submissionMessage = null;
		syncSelectedRegion();
		const region = mapRegionById.get(regionId);
		if (region && map) {
			map.easeTo({
				center: [region.centroid.lng, region.centroid.lat],
				zoom: Math.max(map.getZoom(), 3.5),
				duration: 600
			});
		}
	}

	function handleRegionSelectionChange() {
		if (!selectedRegionId) {
			submissionState = 'idle';
			submissionMessage = null;
			syncSelectedRegion();
			return;
		}

		selectRegion(selectedRegionId);
	}

	async function loadVisitorPlaces() {
		loadingPlaces = true;
		placesError = null;

		try {
			const response = await trackedFetch('/api/map-places', undefined, {
				label: 'LocationBlock places load',
				source: 'LocationBlock'
			});

			if (!response.ok) {
				throw new Error(`Request failed with ${response.status}`);
			}

			const data = (await response.json()) as { places: MapPlaceRecord[] };
			visitorPlaces = data.places;
			syncVisitorPlacesSource();
		} catch (error) {
			placesError = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			loadingPlaces = false;
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!selectedRegion || !visitorName.trim()) {
			submissionState = 'error';
			submissionMessage = 'Choose a region and enter your name before submitting.';
			return;
		}

		submissionState = 'submitting';
		submissionMessage = null;

		try {
			const response = await trackedFetch(
				'/api/map-places',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({
						name: visitorName,
						regionId: selectedRegion.id
					})
				},
				{
					label: 'LocationBlock place submit',
					source: 'LocationBlock'
				}
			);

			if (!response.ok) {
				const data = (await response.json().catch(() => null)) as { error?: string } | null;
				throw new Error(data?.error ?? `Request failed with ${response.status}`);
			}

			const data = (await response.json()) as { place: MapPlaceRecord };
			visitorPlaces = [data.place, ...visitorPlaces];
			syncVisitorPlacesSource();
			submissionState = 'idle';
			submissionMessage = null;
			visitorName = '';
			selectedRegionId = '';
			syncSelectedRegion();
		} catch (error) {
			submissionState = 'error';
			submissionMessage = error instanceof Error ? error.message : 'Could not add your place.';
		}
	}

	function applyMapDecorations(darkMode: boolean) {
		if (!map) return;

		if (!map.getSource(geographySourceId)) {
			map.addSource(geographySourceId, {
				type: 'geojson',
				data: geographyDataUrl
			});
		}

		if (!map.getLayer(geographyFillLayerId)) {
			map.addLayer({
				id: geographyFillLayerId,
				type: 'fill',
				source: geographySourceId,
				paint: {
					'fill-color': darkMode ? '#60a5fa' : '#1d4ed8',
					'fill-opacity': darkMode ? 0.08 : 0.06
				}
			});
		}

		if (!map.getLayer(geographyOutlineLayerId)) {
			map.addLayer({
				id: geographyOutlineLayerId,
				type: 'line',
				source: geographySourceId,
				paint: {
					'line-color': darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.18)',
					'line-width': 1
				}
			});
		}

		if (!map.getLayer(geographyHoverLayerId)) {
			map.addLayer({
				id: geographyHoverLayerId,
				type: 'fill',
				source: geographySourceId,
				filter: noRegionFilter,
				paint: {
					'fill-color': '#38bdf8',
					'fill-opacity': darkMode ? 0.26 : 0.2
				}
			});
		}

		if (!map.getLayer(geographySelectedLayerId)) {
			map.addLayer({
				id: geographySelectedLayerId,
				type: 'fill',
				source: geographySourceId,
				filter: getRegionFilter(selectedRegionId),
				paint: {
					'fill-color': '#f59e0b',
					'fill-opacity': darkMode ? 0.38 : 0.28
				}
			});
		}

		if (!map.getSource(visitorSourceId)) {
			map.addSource(visitorSourceId, {
				type: 'geojson',
				data: buildVisitorFeatureCollection(buildVisitorRegionGroups(visitorPlaces))
			});
		}

		if (!map.getLayer(visitorCircleLayerId)) {
			map.addLayer({
				id: visitorCircleLayerId,
				type: 'circle',
				source: visitorSourceId,
				paint: {
					'circle-color': '#ec4899',
					'circle-stroke-color': darkMode ? '#111827' : '#ffffff',
					'circle-stroke-width': 1.5,
					'circle-opacity': 0.88,
					'circle-radius': [
						'interpolate',
						['linear'],
						['coalesce', ['get', 'count'], 1],
						1,
						5,
						3,
						7,
						8,
						11
					]
				}
			});
		}

		clearMarkers();
		markers = [
			new mapboxgl.Marker({
				element: createLabelElement(curatedLocations.home.label, darkMode),
				anchor: 'center'
			})
				.setLngLat(curatedLocations.home.coordinates)
				.addTo(map),
			new mapboxgl.Marker({
				element: createLabelElement(curatedLocations.work.label, darkMode),
				anchor: 'center'
			})
				.setLngLat(curatedLocations.work.coordinates)
				.addTo(map)
		];

		syncSelectedRegion();
		syncVisitorPlacesSource();
	}

	onMount(() => {
		const token = env.PUBLIC_MAPBOX_TOKEN;

		if (!token) {
			mapError = 'Add PUBLIC_MAPBOX_TOKEN to .env';
			return;
		}

		mapboxgl.accessToken = token;
		if (!mapContainer) return;

		const handleResize = () => {
			map?.resize();
		};

		const handleMouseMove = (event: mapboxgl.MapMouseEvent) => {
			if (!map) return;

			const visitorFeature = map.getLayer(visitorCircleLayerId)
				? map.queryRenderedFeatures(event.point, { layers: [visitorCircleLayerId] })[0]
				: undefined;

			if (visitorFeature) {
				const count = getNumberProperty(visitorFeature, 'count') ?? 1;
				const regionName = getStringProperty(visitorFeature, 'regionName') ?? 'Unknown region';
				const countryName = getStringProperty(visitorFeature, 'countryName') ?? 'Unknown country';
				const names = getStringProperty(visitorFeature, 'names') ?? '';
				map.getCanvas().style.setProperty('cursor', 'pointer');
				hoverPopup?.remove();
				visitorPopup
					?.setLngLat(event.lngLat)
					.setHTML(formatVisitorPopup(names, count, regionName, countryName))
					.addTo(map);
				return;
			}

			visitorPopup?.remove();

			const regionFeature = map.getLayer(geographyFillLayerId)
				? map.queryRenderedFeatures(event.point, { layers: [geographyFillLayerId] })[0]
				: undefined;

			const regionId = getStringProperty(regionFeature, 'id');
			map.setFilter(geographyHoverLayerId, getRegionFilter(regionId ?? ''));

			if (regionId) {
				map.getCanvas().style.setProperty('cursor', 'pointer');
				hoverPopup?.setLngLat(event.lngLat).setText('Click To Add Your Place!').addTo(map);
			} else {
				hideTransientPopups();
				if (map.getLayer(geographyHoverLayerId)) {
					map.setFilter(geographyHoverLayerId, noRegionFilter);
				}
			}
		};

		const handleCanvasLeave = () => {
			hideTransientPopups();
			if (map?.getLayer(geographyHoverLayerId)) {
				map.setFilter(geographyHoverLayerId, noRegionFilter);
			}
		};

		const handleClick = (event: mapboxgl.MapMouseEvent) => {
			if (!map) return;

			const visitorFeature = map.getLayer(visitorCircleLayerId)
				? map.queryRenderedFeatures(event.point, { layers: [visitorCircleLayerId] })[0]
				: undefined;
			const visitorRegionId = getStringProperty(visitorFeature, 'regionId');

			if (visitorRegionId) {
				selectRegion(visitorRegionId);
				return;
			}

			const regionFeature = map.getLayer(geographyFillLayerId)
				? map.queryRenderedFeatures(event.point, { layers: [geographyFillLayerId] })[0]
				: undefined;
			const regionId = getStringProperty(regionFeature, 'id');

			if (regionId) {
				selectRegion(regionId);
			}
		};

		currentMapStyle = isDark ? mapStyles.dark : mapStyles.light;
		const mapReadyMeasureId = performanceAnalytics.beginMeasure(
			'render',
			'LocationBlock map ready',
			{
				source: 'LocationBlock'
			}
		);
		let hasRecordedMapReady = false;

		map = new mapboxgl.Map({
			container: mapContainer,
			style: currentMapStyle,
			bounds: defaultBounds,
			fitBoundsOptions: { padding: 28, duration: 0 },
			minZoom: 1.5,
			maxZoom: 8.5,
			attributionControl: true,
			dragRotate: false,
			touchPitch: false
		});

		hoverPopup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false,
			className: 'map-hover-popup',
			offset: 12
		});
		visitorPopup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false,
			className: 'map-visitor-popup',
			offset: 12
		});

		map.on('style.load', () => {
			handleResize();
			applyMapDecorations(isDark);
			if (!hasRecordedMapReady) {
				hasRecordedMapReady = true;
				performanceAnalytics.endMeasure(mapReadyMeasureId, {
					source: 'LocationBlock',
					detail: currentMapStyle ?? 'unknown style'
				});
			}
		});

		map.on('mousemove', handleMouseMove);
		map.on('click', handleClick);
		map.getCanvas().addEventListener('mouseleave', handleCanvasLeave);

		void loadVisitorPlaces();

		unsubscribeTheme = theme.subscribe((value) => {
			const nextStyle = value === 'dark' ? mapStyles.dark : mapStyles.light;
			if (!map || currentMapStyle === nextStyle) return;

			currentMapStyle = nextStyle;
			map.setStyle(nextStyle);
		});

		resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(mapContainer);
		window.addEventListener('resize', handleResize);

		return () => {
			map?.off('mousemove', handleMouseMove);
			map?.off('click', handleClick);
			map?.getCanvas().removeEventListener('mouseleave', handleCanvasLeave);
			clearMarkers();
			unsubscribeTheme?.();
			hoverPopup?.remove();
			visitorPopup?.remove();
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

	<div class="map-overlay absolute inset-x-0 bottom-0 z-10 p-4 pt-16">
		<div class="map-chrome">
			<div class="map-summary">
				<div class="map-summary__legend">
					<div class="legend-item">
						<span class="legend-dot legend-home"></span>
						<span class="legend-text">Home</span>
					</div>
					<div class="legend-item">
						<span class="legend-dot legend-work"></span>
						<span class="legend-text">Work</span>
					</div>
					<div class="legend-item">
						<span class="legend-dot legend-visitor"></span>
						<span class="legend-text">Visitors ({visitorPlaces.length})</span>
					</div>
				</div>
				<div class="map-caption-group">
					<span class="map-caption">Where people are visiting from</span>
					{#if loadingPlaces}
						<span class="map-helper">Loading visitor pins...</span>
					{:else if placesError}
						<span class="map-helper map-helper--error">Could not load visitor pins.</span>
					{:else}
						<span class="map-helper">Pan, zoom, and click a state or province to add yours.</span>
					{/if}
				</div>
			</div>

			<form class="visitor-form" onsubmit={handleSubmit}>
				<div class="visitor-form__header">
					<div>
						<p class="visitor-form__eyebrow">Visitors</p>
						<h3 class="visitor-form__title">Add Your Place</h3>
					</div>
					{#if selectedRegion}
						<span class="visitor-form__selected">
							{selectedRegion.regionName}
							{#if selectedRegionVisitorCount > 0}
								({selectedRegionVisitorCount})
							{/if}
						</span>
					{/if}
				</div>

				<div class="visitor-form__grid">
					<label class="visitor-field">
						<span class="visitor-field__label">State or province</span>
						<select
							class="visitor-field__control"
							bind:value={selectedRegionId}
							onchange={handleRegionSelectionChange}
						>
							<option value="">Choose one or click the map</option>
							<optgroup label="Canada">
								{#each mapRegions.filter((region) => region.countryCode === 'CA') as region (region.id)}
									<option value={region.id}>{region.regionName}</option>
								{/each}
							</optgroup>
							<optgroup label="United States">
								{#each mapRegions.filter((region) => region.countryCode === 'US') as region (region.id)}
									<option value={region.id}>{region.regionName}</option>
								{/each}
							</optgroup>
						</select>
					</label>

					<label class="visitor-field">
						<span class="visitor-field__label">Your name</span>
						<input
							class="visitor-field__control"
							type="text"
							name="visitorName"
							bind:value={visitorName}
							maxlength="48"
							placeholder="Emma"
							autocomplete="name"
						/>
					</label>

					<div class="visitor-form__actions">
						<button
							type="submit"
							class="visitor-form__submit"
							disabled={submissionState === 'submitting'}
						>
							{submissionState === 'submitting' ? 'Adding...' : 'Add My Place'}
						</button>
					</div>
				</div>

				{#if submissionState === 'error' && submissionMessage}
					<p class="visitor-form__message visitor-form__message--error">
						{submissionMessage}
					</p>
				{/if}
			</form>
		</div>
	</div>
</div>

<style>
	.location-block {
		aspect-ratio: 4 / 3;
		background: var(--card-bg);
		--map-overlay-top: rgba(255, 255, 255, 0);
		--map-overlay-mid: rgba(255, 255, 255, 0.42);
		--map-overlay-bottom: rgba(255, 255, 255, 0.94);
		--map-legend-text: rgba(20, 16, 12, 0.92);
		--map-caption-text: rgba(20, 16, 12, 0.78);
	}

	.location-block.is-dark {
		--map-overlay-top: rgba(0, 0, 0, 0);
		--map-overlay-mid: rgba(0, 0, 0, 0.22);
		--map-overlay-bottom: rgba(0, 0, 0, 0.84);
		--map-legend-text: rgba(255, 255, 255, 0.92);
		--map-caption-text: rgba(255, 255, 255, 0.72);
	}

	.map-container {
		width: 100%;
		height: 100%;
	}

	.map-overlay {
		pointer-events: none;
		background: linear-gradient(
			to top,
			var(--map-overlay-bottom),
			var(--map-overlay-mid),
			var(--map-overlay-top)
		);
	}

	.map-chrome {
		display: grid;
		gap: 0.85rem;
	}

	.map-summary,
	.visitor-form {
		pointer-events: auto;
		border-radius: 0.95rem;
		border: 0.0625rem solid color-mix(in srgb, var(--border-color) 72%, transparent);
		background: color-mix(in srgb, var(--surface) 84%, transparent);
		backdrop-filter: blur(0.75rem);
	}

	.map-summary {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1rem;
	}

	.map-summary__legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1rem;
	}

	.map-caption-group {
		display: grid;
		justify-items: end;
		gap: 0.2rem;
		text-align: right;
	}

	.map-helper {
		font-size: 0.75rem;
		color: var(--map-caption-text);
	}

	.map-helper--error {
		color: #dc2626;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.legend-dot {
		width: 0.55rem;
		height: 0.55rem;
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

	.legend-visitor {
		background: #ec4899;
		box-shadow: 0 0 8px rgba(236, 72, 153, 0.45);
	}

	.legend-text,
	.map-caption {
		color: var(--map-legend-text);
	}

	.map-caption {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.visitor-form {
		display: grid;
		gap: 0.9rem;
		padding: 1rem;
	}

	.visitor-form__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.visitor-form__eyebrow {
		margin: 0 0 0.2rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.visitor-form__title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.visitor-form__selected {
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		background: color-mix(in srgb, #f59e0b 18%, var(--surface));
		color: #b45309;
		font-size: 0.74rem;
		font-weight: 700;
	}

	.location-block.is-dark .visitor-form__selected {
		color: #fbbf24;
	}

	.visitor-form__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) auto;
		gap: 0.75rem;
		align-items: end;
	}

	.visitor-form__actions {
		display: flex;
		align-items: flex-end;
	}

	.visitor-field {
		display: grid;
		gap: 0.35rem;
	}

	.visitor-field__label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.visitor-field__control {
		width: 100%;
		padding: 0.7rem 0.8rem;
		border-radius: 0.75rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
		color: var(--text-primary);
	}

	.visitor-field__control:focus {
		outline: 0.125rem solid color-mix(in srgb, var(--caroline-blue-600) 38%, transparent);
		outline-offset: 0.0625rem;
		border-color: var(--caroline-blue-600);
	}

	.visitor-form__submit {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.72rem 1rem;
		border: none;
		border-radius: 0.75rem;
		background: var(--text-primary);
		color: var(--page-bg);
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		transition:
			transform 0.15s ease,
			opacity 0.15s ease;
	}

	.visitor-form__submit:hover:not(:disabled) {
		opacity: 0.94;
		transform: translateY(-0.0625rem);
	}

	.visitor-form__submit:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.visitor-form__message {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 500;
	}

	.visitor-form__message--error {
		color: #dc2626;
	}

	@media (max-width: 48rem) {
		.location-block {
			aspect-ratio: auto;
			min-height: 40rem;
		}

		.map-summary,
		.visitor-form__header {
			flex-direction: column;
			align-items: stretch;
			text-align: left;
		}

		.map-caption-group {
			justify-items: start;
			text-align: left;
		}

		.visitor-form__grid {
			grid-template-columns: 1fr;
		}

		.visitor-form__actions {
			display: block;
		}

		.visitor-form__submit {
			width: 100%;
		}
	}
</style>
