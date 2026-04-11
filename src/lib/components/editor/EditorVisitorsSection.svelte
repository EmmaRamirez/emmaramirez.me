<script lang="ts">
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import type { MapPlaceRecord } from '$lib/types/mapPlaces';
	import { trackedFetch } from '$lib/stores/performanceAnalytics.svelte';

	const createdAtFormatter = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
	const DELETE_EXIT_DURATION_MS = 180;

	let visitors = $state<MapPlaceRecord[]>([]);
	let loading = $state(true);
	let refreshing = $state(false);
	let deletingVisitorId = $state<string | null>(null);
	let exitingVisitorIds = $state<string[]>([]);
	let errorTitle = $state('Could not load visitor submissions.');
	let errorMessage = $state<string | null>(null);

	const visibleVisitors = $derived(
		visitors.filter((visitor) => visitor.status === 'visible').length
	);
	const hiddenVisitors = $derived(visitors.filter((visitor) => visitor.status === 'hidden').length);

	function formatCreatedAt(value: string) {
		return createdAtFormatter.format(new Date(value));
	}

	function formatCoordinates(latitude: number, longitude: number) {
		return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
	}

	function isVisitorExiting(visitorId: string) {
		return exitingVisitorIds.includes(visitorId);
	}

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function loadVisitors() {
		refreshing = true;
		errorTitle = 'Could not load visitor submissions.';
		errorMessage = null;

		try {
			const response = await trackedFetch('/api/map-places?includeAll=true', undefined, {
				label: 'Editor visitors load',
				source: 'EditorVisitorsSection'
			});

			if (!response.ok) {
				throw new Error(`Request failed with ${response.status}`);
			}

			const data = (await response.json()) as { places: MapPlaceRecord[] };
			visitors = data.places;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			loading = false;
			refreshing = false;
		}
	}

	async function deleteVisitor(visitor: MapPlaceRecord) {
		if (
			!confirm(`Delete ${visitor.name}'s visitor marker? This cannot be undone from the editor.`)
		) {
			return;
		}

		deletingVisitorId = visitor.id;
		errorTitle = 'Could not delete visitor submission.';
		errorMessage = null;

		try {
			const response = await trackedFetch(
				'/api/map-places',
				{
					method: 'DELETE',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ id: visitor.id })
				},
				{
					label: 'Editor visitor delete',
					source: 'EditorVisitorsSection'
				}
			);

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as { error?: string } | null;
				throw new Error(payload?.error ?? `Request failed with ${response.status}`);
			}

			exitingVisitorIds = [...exitingVisitorIds, visitor.id];
			await wait(DELETE_EXIT_DURATION_MS);
			visitors = visitors.filter((entry) => entry.id !== visitor.id);
			exitingVisitorIds = exitingVisitorIds.filter((entryId) => entryId !== visitor.id);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Unknown error';
			exitingVisitorIds = exitingVisitorIds.filter((entryId) => entryId !== visitor.id);
		} finally {
			deletingVisitorId = null;
		}
	}

	onMount(() => {
		void loadVisitors();
	});
</script>

<section class="visitors-section">
	<header class="visitors-hero">
		<div>
			<h2 class="visitors-hero__title">Visitors</h2>
			<p class="visitors-hero__body">
				Review public map submissions, their derived centroid placement, and current visibility
				state.
			</p>
		</div>
		<button type="button" class="visitors-hero__action" onclick={() => void loadVisitors()}>
			{refreshing ? 'Refreshing...' : 'Refresh'}
		</button>
	</header>

	<div class="visitors-stats" aria-label="Visitor submission summary">
		<div class="visitors-stat-card">
			<span class="visitors-stat-card__label">Total</span>
			<strong class="visitors-stat-card__value">{visitors.length}</strong>
		</div>
		<div class="visitors-stat-card">
			<span class="visitors-stat-card__label">Visible</span>
			<strong class="visitors-stat-card__value">{visibleVisitors}</strong>
		</div>
		<div class="visitors-stat-card">
			<span class="visitors-stat-card__label">Hidden</span>
			<strong class="visitors-stat-card__value">{hiddenVisitors}</strong>
		</div>
	</div>

	<div class="visitors-table-card">
		<div class="visitors-table-card__header">
			<div>
				<p class="visitors-table-card__title">Submission Queue</p>
				<p class="visitors-table-card__subtitle">
					Entries are stored by selected region and placed on the map using the shared region
					centroid.
				</p>
			</div>
			<span class="visitors-table-card__pill">Manage entries</span>
		</div>

		{#if loading}
			<div class="visitors-empty">
				<p>Loading visitor submissions...</p>
			</div>
		{:else if errorMessage}
			<div class="visitors-empty visitors-empty--error">
				<p>{errorTitle}</p>
				<p class="visitors-empty__detail">{errorMessage}</p>
			</div>
		{:else if visitors.length === 0}
			<div class="visitors-empty">
				<p>No visitors have added themselves to the map yet.</p>
			</div>
		{:else}
			<div class="visitors-table-wrapper">
				<table class="visitors-table">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Region</th>
							<th scope="col">Country</th>
							<th scope="col">Centroid</th>
							<th scope="col">Status</th>
							<th scope="col">Submitted</th>
							<th scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each visitors as visitor (visitor.id)}
							<tr
								animate:flip={{ duration: 220 }}
								class={[
									'visitors-row',
									deletingVisitorId === visitor.id && 'visitors-row--deleting',
									isVisitorExiting(visitor.id) && 'visitors-row--exiting'
								]}
							>
								<td>{visitor.name}</td>
								<td>
									<div class="visitors-region">
										<span>{visitor.regionName}</span>
										<code>{visitor.regionId}</code>
									</div>
								</td>
								<td>{visitor.countryName}</td>
								<td class="visitors-coordinates">
									{formatCoordinates(visitor.latitude, visitor.longitude)}
								</td>
								<td>
									<span class="visitors-status" data-status={visitor.status}>
										{visitor.status}
									</span>
								</td>
								<td>{formatCreatedAt(visitor.createdAt)}</td>
								<td class="visitors-actions">
									<button
										type="button"
										class="visitors-delete-button"
										disabled={deletingVisitorId !== null}
										aria-label={`Delete visitor ${visitor.name}`}
										onclick={() => void deleteVisitor(visitor)}
									>
										{deletingVisitorId === visitor.id ? 'Deleting...' : 'Delete'}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</section>

<style>
	.visitors-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.visitors-hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background:
			radial-gradient(circle at top right, rgba(90, 150, 255, 0.14), transparent 32%),
			var(--surface);
	}

	.visitors-hero__title {
		margin: 0 0 0.35rem;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.visitors-hero__body {
		margin: 0;
		max-width: 42rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.visitors-hero__action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.7rem 1rem;
		border: none;
		border-radius: 0.65rem;
		background: var(--text-primary);
		color: var(--page-bg);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 0.15s ease,
			opacity 0.15s ease;
	}

	.visitors-hero__action:hover {
		opacity: 0.92;
		transform: translateY(-0.0625rem);
	}

	.visitors-stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.visitors-stat-card,
	.visitors-table-card {
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
	}

	.visitors-stat-card {
		display: grid;
		gap: 0.35rem;
		padding: 1rem 1.1rem;
	}

	.visitors-stat-card__label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.visitors-stat-card__value {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.visitors-table-card {
		overflow: hidden;
	}

	.visitors-table-card__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 1.25rem;
		border-bottom: 0.0625rem solid var(--border-color);
	}

	.visitors-table-card__title {
		margin: 0 0 0.2rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.visitors-table-card__subtitle {
		margin: 0;
		font-size: 0.82rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.visitors-table-card__pill {
		flex-shrink: 0;
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-hover) 70%, var(--surface));
		color: var(--text-secondary);
		font-size: 0.72rem;
		font-weight: 600;
	}

	.visitors-table-wrapper {
		overflow-x: auto;
	}

	.visitors-table {
		width: 100%;
		border-collapse: collapse;
	}

	.visitors-table th,
	.visitors-table td {
		padding: 0.9rem 1.1rem;
		text-align: left;
		border-bottom: 0.0625rem solid color-mix(in srgb, var(--border-color) 70%, transparent);
		font-size: 0.87rem;
	}

	.visitors-table th {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		background: color-mix(in srgb, var(--surface-hover) 55%, transparent);
	}

	.visitors-table tbody tr:last-child td {
		border-bottom: none;
	}

	.visitors-row > :global(td) {
		transition:
			opacity 0.18s ease,
			transform 0.18s ease,
			filter 0.18s ease,
			background-color 0.18s ease,
			border-color 0.18s ease;
		transform-origin: center;
	}

	.visitors-row--deleting > :global(td) {
		opacity: 0.68;
		background: color-mix(in srgb, #dc2626 4%, var(--surface));
	}

	.visitors-row--exiting > :global(td) {
		opacity: 0;
		filter: blur(1px);
		transform: translateY(-0.2rem);
		border-color: transparent;
	}

	.visitors-region {
		display: grid;
		gap: 0.2rem;
	}

	.visitors-region code {
		width: fit-content;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		background: var(--surface-hover);
		font-size: 0.75rem;
	}

	.visitors-coordinates {
		font-family: 'SFMono-Regular', 'Menlo', monospace;
	}

	.visitors-status {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: capitalize;
		background: color-mix(in srgb, var(--surface-hover) 70%, var(--surface));
		color: var(--text-secondary);
	}

	.visitors-status[data-status='visible'] {
		background: color-mix(in srgb, #10b981 18%, var(--surface));
		color: #10b981;
	}

	.visitors-status[data-status='hidden'] {
		background: color-mix(in srgb, #6b7280 18%, var(--surface));
		color: #6b7280;
	}

	.visitors-actions {
		width: 1%;
		white-space: nowrap;
	}

	.visitors-delete-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.45rem 0.75rem;
		border: 0.0625rem solid color-mix(in srgb, #dc2626 22%, var(--border-color));
		border-radius: 0.6rem;
		background: color-mix(in srgb, #dc2626 10%, var(--surface));
		color: #dc2626;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.15s ease,
			opacity 0.15s ease,
			transform 0.15s ease;
	}

	.visitors-delete-button:hover:enabled {
		background: color-mix(in srgb, #dc2626 16%, var(--surface));
		transform: translateY(-0.0625rem);
	}

	.visitors-delete-button:disabled {
		cursor: wait;
		opacity: 0.7;
	}

	.visitors-empty {
		display: grid;
		place-items: center;
		gap: 0.35rem;
		min-height: 12rem;
		padding: 1.5rem;
		color: var(--text-muted);
		text-align: center;
	}

	.visitors-empty--error {
		color: #dc2626;
	}

	.visitors-empty__detail {
		margin: 0;
		font-size: 0.8rem;
	}

	@media (max-width: 48rem) {
		.visitors-hero {
			flex-direction: column;
		}

		.visitors-stats {
			grid-template-columns: 1fr;
		}
	}
</style>
