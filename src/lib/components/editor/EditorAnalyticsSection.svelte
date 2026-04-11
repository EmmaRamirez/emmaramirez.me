<script lang="ts">
	import {
		performanceAnalytics,
		type AnalyticsTimelineEvent,
		type VitalMetricEvent
	} from '$lib/stores/performanceAnalytics.svelte';

	const VITAL_NAME_ORDER = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'];
	const CHART_W = 320;
	const CHART_H = 124;
	const CHART_PAD = 26;

	function sortVitalNames(names: Iterable<string>) {
		const list = [...new Set(names)];
		return list.sort((a, b) => {
			const ia = VITAL_NAME_ORDER.indexOf(a);
			const ib = VITAL_NAME_ORDER.indexOf(b);
			if (ia === -1 && ib === -1) return a.localeCompare(b);
			if (ia === -1) return 1;
			if (ib === -1) return -1;
			return ia - ib;
		});
	}

	function buildVitalChartModel(points: VitalMetricEvent[]) {
		if (points.length === 0) return null;

		const unit = points[0]!.unit;
		let minX: number;
		let maxX: number;
		if (points.length === 1) {
			const t = points[0]!.timestamp;
			minX = t - 1500;
			maxX = t + 1500;
		} else {
			const xs = points.map((p) => p.timestamp);
			minX = Math.min(...xs);
			maxX = Math.max(...xs);
			if (maxX <= minX) {
				minX -= 1;
				maxX += 1;
			}
		}

		const ys = points.map((p) => p.value);
		let minY = Math.min(...ys);
		let maxY = Math.max(...ys);
		const yPad = Math.max(maxY - minY, 0) * 0.12 + (unit === 'score' ? 0.03 : 16);
		minY -= yPad;
		maxY += yPad;
		if (maxY <= minY) {
			minY -= 1;
			maxY += 1;
		}

		const innerW = CHART_W - CHART_PAD * 2;
		const innerH = CHART_H - CHART_PAD * 2;
		const dots = points.map((p) => ({
			cx: CHART_PAD + ((p.timestamp - minX) / (maxX - minX)) * innerW,
			cy: CHART_PAD + innerH - ((p.value - minY) / (maxY - minY)) * innerH
		}));
		const polylinePoints = dots.map((d) => `${d.cx},${d.cy}`).join(' ');
		return { polylinePoints, dots, yMin: minY, yMax: maxY, tMin: minX, tMax: maxX, unit };
	}

	const summary = $derived(performanceAnalytics.summary);
	const sessionStartedAt = $derived(performanceAnalytics.sessionStartedAt);
	const currentRoute = $derived(performanceAnalytics.currentRoute);
	const slowestRoutes = $derived(performanceAnalytics.slowestRoutes);
	const slowestRequests = $derived(performanceAnalytics.slowestRequests);
	const slowestInteractions = $derived(performanceAnalytics.slowestInteractions);
	const slowestRenders = $derived(performanceAnalytics.slowestRenders);
	const allVitals = $derived(performanceAnalytics.vitalEvents);
	const vitalRoutes = $derived.by(() => {
		const set = new Set<string>();
		for (const v of allVitals) {
			set.add(v.route);
		}
		return [...set].sort((a, b) => a.localeCompare(b));
	});
	const vitalNames = $derived(sortVitalNames(allVitals.map((v) => v.name)));

	let selectedRoute = $state('');
	let selectedVital = $state('');

	$effect(() => {
		if (vitalNames.length && !vitalNames.includes(selectedVital)) {
			selectedVital = vitalNames[0]!;
		}
	});

	const vitalSeries = $derived.by(() => {
		if (!selectedVital) return [];
		return allVitals
			.filter(
				(v) => v.name === selectedVital && (selectedRoute === '' || v.route === selectedRoute)
			)
			.sort((a, b) => a.timestamp - b.timestamp);
	});

	const vitalChart = $derived(buildVitalChartModel(vitalSeries));
	const latestVitalInSeries = $derived(
		vitalSeries.length ? vitalSeries[vitalSeries.length - 1]! : null
	);

	const paints = $derived(performanceAnalytics.paintEvents.slice(0, 4));
	const timeline = $derived(performanceAnalytics.timeline.slice(0, 12));
	const persistedSummary = $derived(performanceAnalytics.persistedSummary);
	const persistenceStatus = $derived(performanceAnalytics.persistenceStatus);

	function formatDuration(value: number) {
		return `${value.toFixed(1)} ms`;
	}

	function formatVitalValue(value: number, unit: 'ms' | 'score') {
		return unit === 'score' ? value.toFixed(3) : formatDuration(value);
	}

	function formatTimestamp(timestamp: number) {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	function formatSessionStarted(timestamp: number) {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatSyncTimestamp(timestamp: number | null) {
		if (!timestamp) return 'Not synced yet';
		return formatTimestamp(timestamp);
	}

	function getTimelineValue(event: AnalyticsTimelineEvent) {
		switch (event.kind) {
			case 'page':
			case 'network':
			case 'interaction':
			case 'render':
				return formatDuration(event.duration);
			case 'vital':
				return formatVitalValue(event.value, event.unit);
			case 'paint':
				return formatDuration(event.startTime);
		}
	}

	function getTimelineLabel(event: AnalyticsTimelineEvent) {
		switch (event.kind) {
			case 'page':
				return event.route;
			case 'network':
				return `${event.method} ${event.name}`;
			case 'interaction':
			case 'render':
				return event.name;
			case 'vital':
			case 'paint':
				return event.name;
		}
	}
</script>

<section class="analytics-section">
	<header class="analytics-hero">
		<div>
			<h2 class="analytics-hero__title">Performance Analytics</h2>
			<p class="analytics-hero__body">
				Development-only profiling across routes, network requests, Web Vitals, and a few hot
				interactive surfaces. Data stays local to this browser session.
			</p>
		</div>
		<div class="analytics-hero__meta">
			<span class="analytics-hero__pill">Dev Only</span>
			<span class="analytics-hero__sync">Backend {persistenceStatus.state}</span>
			<button type="button" class="analytics-reset" onclick={() => performanceAnalytics.clear()}>
				Clear session
			</button>
			<button
				type="button"
				class="analytics-reset"
				onclick={() => void performanceAnalytics.refreshPersistedSummary()}
			>
				Refresh backend
			</button>
		</div>
	</header>

	<div class="stats-grid">
		<article class="stat-card">
			<span class="stat-card__label">Captured Events</span>
			<strong class="stat-card__value">{summary.totalEvents}</strong>
			<span class="stat-card__meta">Session started {formatSessionStarted(sessionStartedAt)}</span>
		</article>

		<article class="stat-card">
			<span class="stat-card__label">Page Timing</span>
			<strong class="stat-card__value">{formatDuration(summary.averagePageDuration)}</strong>
			<span class="stat-card__meta">{summary.pageCount} route measurements</span>
		</article>

		<article class="stat-card">
			<span class="stat-card__label">Network P95</span>
			<strong class="stat-card__value">{formatDuration(summary.p95NetworkDuration)}</strong>
			<span class="stat-card__meta">
				{summary.networkCount} requests, {summary.networkErrors} errors
			</span>
		</article>

		<article class="stat-card">
			<span class="stat-card__label">Interaction Avg</span>
			<strong class="stat-card__value">{formatDuration(summary.averageInteractionDuration)}</strong>
			<span class="stat-card__meta">
				Render avg {formatDuration(summary.averageRenderDuration)}
			</span>
		</article>

		<article class="stat-card">
			<span class="stat-card__label">Persisted Events</span>
			<strong class="stat-card__value">{persistedSummary?.totalPersistedEvents ?? 0}</strong>
			<span class="stat-card__meta">
				{persistenceStatus.pendingCount} pending, last sync {formatSyncTimestamp(
					persistenceStatus.lastSyncedAt
				)}
			</span>
		</article>
	</div>

	<div class="analytics-grid">
		<article class="analytics-card">
			<div class="analytics-card__header">
				<div>
					<p class="analytics-card__title">Current Route</p>
					<p class="analytics-card__subtitle">Live route context for incoming metrics</p>
				</div>
			</div>
			<p class="route-pill">{currentRoute}</p>
			{#if paints.length > 0}
				<div class="mini-stack">
					{#each paints as paint (paint.id)}
						<div class="mini-row">
							<span>{paint.name}</span>
							<span>{formatDuration(paint.startTime)}</span>
						</div>
					{/each}
				</div>
			{/if}
		</article>

		<article class="analytics-card">
			<div class="analytics-card__header">
				<div>
					<p class="analytics-card__title">Backend Summary</p>
					<p class="analytics-card__subtitle">Aggregated from persisted analytics events</p>
				</div>
			</div>
			<div class="mini-stack">
				{#if !persistedSummary}
					<p class="empty-state">
						{persistenceStatus.lastError ?? 'Waiting for backend persistence to sync.'}
					</p>
				{:else}
					<div class="mini-row">
						<div class="mini-row__copy">
							<span class="mini-row__title">Sessions</span>
							<span class="mini-row__subtitle">Distinct persisted browser sessions</span>
						</div>
						<span>{persistedSummary.sessionCount}</span>
					</div>
					<div class="mini-row">
						<div class="mini-row__copy">
							<span class="mini-row__title">Network P95</span>
							<span class="mini-row__subtitle">Across persisted request timings</span>
						</div>
						<span>{formatDuration(persistedSummary.summary.p95NetworkDuration)}</span>
					</div>
					<div class="mini-row">
						<div class="mini-row__copy">
							<span class="mini-row__title">Average Page</span>
							<span class="mini-row__subtitle">Persisted route measurements</span>
						</div>
						<span>{formatDuration(persistedSummary.summary.averagePageDuration)}</span>
					</div>
					<div class="mini-row">
						<div class="mini-row__copy">
							<span class="mini-row__title">Last ingest</span>
							<span class="mini-row__subtitle">Most recent batch write</span>
						</div>
						<span
							>{persistedSummary.lastIngestedAt
								? formatTimestamp(Date.parse(persistedSummary.lastIngestedAt))
								: 'N/A'}</span
						>
					</div>
				{/if}
			</div>
		</article>

		<article class="analytics-card analytics-card--vitals">
			<div class="analytics-card__header">
				<div>
					<p class="analytics-card__title">Web Vitals over time</p>
					<p class="analytics-card__subtitle">
						Session samples with wall-clock timestamps; filter by route and metric
					</p>
				</div>
			</div>

			{#if allVitals.length === 0}
				<p class="empty-state">Navigate around the site to populate vitals.</p>
			{:else}
				<div class="vital-filters">
					<label class="vital-filters__field">
						<span class="vital-filters__label">Route</span>
						<select class="vital-filter-select" bind:value={selectedRoute}>
							<option value="">All routes</option>
							{#each vitalRoutes as routePath (routePath)}
								<option value={routePath}>{routePath}</option>
							{/each}
						</select>
					</label>
					<label class="vital-filters__field">
						<span class="vital-filters__label">Metric</span>
						<select class="vital-filter-select" bind:value={selectedVital}>
							{#each vitalNames as name (name)}
								<option value={name}>{name}</option>
							{/each}
						</select>
					</label>
				</div>

				{#if vitalSeries.length === 0}
					<p class="empty-state">No samples for this route and metric yet.</p>
				{:else if vitalChart}
					<figure class="vital-chart-wrap">
						<svg
							class="vital-chart"
							viewBox="0 0 {CHART_W} {CHART_H}"
							role="img"
							aria-labelledby="vital-chart-title"
						>
							<title id="vital-chart-title">
								{selectedVital} samples {selectedRoute
									? `on ${selectedRoute}`
									: 'across all routes'}
							</title>
							<rect
								class="vital-chart__plot"
								x={CHART_PAD}
								y={CHART_PAD}
								width={CHART_W - CHART_PAD * 2}
								height={CHART_H - CHART_PAD * 2}
								rx="4"
							/>
							<polyline
								class="vital-chart__line"
								points={vitalChart.polylinePoints}
								fill="none"
							/>
							{#each vitalChart.dots as dot, i (vitalSeries[i]!.id)}
								<circle
									class="vital-chart__dot"
									cx={dot.cx}
									cy={dot.cy}
									r="3"
								/>
							{/each}
							<text class="vital-chart__axis-text" x={CHART_PAD} y={CHART_H - 6}>
								{formatTimestamp(vitalChart.tMin)}
							</text>
							<text
								class="vital-chart__axis-text vital-chart__axis-text--end"
								x={CHART_W - CHART_PAD}
								y={CHART_H - 6}
								text-anchor="end"
							>
								{formatTimestamp(vitalChart.tMax)}
							</text>
							<text class="vital-chart__axis-text" x={CHART_PAD + 4} y={CHART_PAD + 10}>
								{formatVitalValue(vitalChart.yMax, vitalChart.unit)}
							</text>
							<text
								class="vital-chart__axis-text"
								x={CHART_PAD + 4}
								y={CHART_H - CHART_PAD - 4}
							>
								{formatVitalValue(vitalChart.yMin, vitalChart.unit)}
							</text>
						</svg>
						{#if latestVitalInSeries}
							<figcaption class="vital-chart-caption">
								<span class={`rating-pill rating-pill--${latestVitalInSeries.rating}`}>
									{latestVitalInSeries.rating}
								</span>
								<span class="vital-chart-caption__value">
									{formatVitalValue(latestVitalInSeries.value, latestVitalInSeries.unit)} latest
								</span>
								<span class="vital-chart-caption__meta">
									{formatTimestamp(latestVitalInSeries.timestamp)} · {vitalSeries.length} sample{vitalSeries.length === 1 ? '' : 's'}
								</span>
							</figcaption>
						{/if}
					</figure>
				{/if}
			{/if}
		</article>

		<article class="analytics-card">
			<div class="analytics-card__header">
				<div>
					<p class="analytics-card__title">Slowest Routes</p>
					<p class="analytics-card__subtitle">Initial loads and client navigations</p>
				</div>
			</div>
			<div class="mini-stack">
				{#if slowestRoutes.length === 0}
					<p class="empty-state">Route timings will appear after the first navigation.</p>
				{:else}
					{#each slowestRoutes as event (event.id)}
						<div class="mini-row">
							<div class="mini-row__copy">
								<span class="mini-row__title">{event.route}</span>
								<span class="mini-row__subtitle">{event.navigationType}</span>
							</div>
							<span>{formatDuration(event.duration)}</span>
						</div>
					{/each}
				{/if}
			</div>
		</article>

		<article class="analytics-card">
			<div class="analytics-card__header">
				<div>
					<p class="analytics-card__title">Slowest Requests</p>
					<p class="analytics-card__subtitle">Tracked fetch calls from the app</p>
				</div>
			</div>
			<div class="mini-stack">
				{#if slowestRequests.length === 0}
					<p class="empty-state">Tracked API and external fetch timings show up here.</p>
				{:else}
					{#each slowestRequests as event (event.id)}
						<div class="mini-row">
							<div class="mini-row__copy">
								<span class="mini-row__title">{event.name}</span>
								<span class="mini-row__subtitle">{event.method} {event.status ?? 'ERR'}</span>
							</div>
							<span>{formatDuration(event.duration)}</span>
						</div>
					{/each}
				{/if}
			</div>
		</article>

		<article class="analytics-card">
			<div class="analytics-card__header">
				<div>
					<p class="analytics-card__title">Slowest Interactions</p>
					<p class="analytics-card__subtitle">Editor and hover-driven timings</p>
				</div>
			</div>
			<div class="mini-stack">
				{#if slowestInteractions.length === 0}
					<p class="empty-state">Interact with the editor and animated blocks to capture data.</p>
				{:else}
					{#each slowestInteractions as event (event.id)}
						<div class="mini-row">
							<div class="mini-row__copy">
								<span class="mini-row__title">{event.name}</span>
								<span class="mini-row__subtitle">{event.source ?? 'interaction'}</span>
							</div>
							<span>{formatDuration(event.duration)}</span>
						</div>
					{/each}
				{/if}
			</div>
		</article>

		<article class="analytics-card">
			<div class="analytics-card__header">
				<div>
					<p class="analytics-card__title">Slowest Renders</p>
					<p class="analytics-card__subtitle">Measured mounts and readiness checkpoints</p>
				</div>
			</div>
			<div class="mini-stack">
				{#if slowestRenders.length === 0}
					<p class="empty-state">Render timings appear as the heavy surfaces initialize.</p>
				{:else}
					{#each slowestRenders as event (event.id)}
						<div class="mini-row">
							<div class="mini-row__copy">
								<span class="mini-row__title">{event.name}</span>
								<span class="mini-row__subtitle">{event.detail ?? event.source ?? 'render'}</span>
							</div>
							<span>{formatDuration(event.duration)}</span>
						</div>
					{/each}
				{/if}
			</div>
		</article>

		<article class="analytics-card">
			<div class="analytics-card__header">
				<div>
					<p class="analytics-card__title">Persisted Slowest Requests</p>
					<p class="analytics-card__subtitle">Slowest request timings from the database</p>
				</div>
			</div>
			<div class="mini-stack">
				{#if !persistedSummary || persistedSummary.slowestRequests.length === 0}
					<p class="empty-state">
						Persisted request timing will appear after the first successful sync.
					</p>
				{:else}
					{#each persistedSummary.slowestRequests as event (event.id)}
						<div class="mini-row">
							<div class="mini-row__copy">
								<span class="mini-row__title">{event.name}</span>
								<span class="mini-row__subtitle"
									>{event.method ?? 'GET'} {event.status ?? 'ERR'}</span
								>
							</div>
							<span>{formatDuration(event.duration ?? 0)}</span>
						</div>
					{/each}
				{/if}
			</div>
		</article>
	</div>

	<article class="analytics-card analytics-card--timeline">
		<div class="analytics-card__header">
			<div>
				<p class="analytics-card__title">Recent Timeline</p>
				<p class="analytics-card__subtitle">A mixed stream of the latest captured events</p>
			</div>
		</div>
		<div class="timeline">
			{#if timeline.length === 0}
				<p class="empty-state">The dashboard will fill as soon as you move through the site.</p>
			{:else}
				{#each timeline as event (event.id)}
					<div class="timeline-row">
						<div class="timeline-row__copy">
							<span class={`timeline-kind timeline-kind--${event.kind}`}>{event.kind}</span>
							<div>
								<p class="timeline-row__title">{getTimelineLabel(event)}</p>
								<p class="timeline-row__subtitle">{formatTimestamp(event.timestamp)}</p>
							</div>
						</div>
						<span class="timeline-row__value">{getTimelineValue(event)}</span>
					</div>
				{/each}
			{/if}
		</div>
	</article>
</section>

<style>
	.analytics-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.analytics-hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background:
			radial-gradient(circle at top right, rgba(53, 109, 255, 0.16), transparent 30%),
			var(--surface);
	}

	.analytics-hero__title {
		margin: 0 0 0.35rem;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.analytics-hero__body {
		margin: 0;
		max-width: 44rem;
		line-height: 1.6;
		color: var(--text-muted);
	}

	.analytics-hero__meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.75rem;
	}

	.analytics-hero__sync {
		font-size: 0.78rem;
		color: var(--text-secondary);
	}

	.analytics-hero__pill,
	.rating-pill,
	.timeline-kind {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.analytics-hero__pill {
		background: color-mix(in srgb, var(--caroline-blue-600) 18%, var(--surface));
		color: var(--caroline-blue-700);
	}

	.analytics-reset {
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.7rem;
		background: var(--background);
		color: var(--text-primary);
		padding: 0.65rem 0.85rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

	.stats-grid,
	.analytics-grid {
		display: flex;
		flex-wrap: nowrap;
		gap: 1rem;
		overflow-x: auto;
		overflow-y: hidden;
		padding-bottom: 0.35rem;
		-webkit-overflow-scrolling: touch;
		scroll-snap-type: x proximity;
		scrollbar-gutter: stable;
	}

	.stat-card {
		flex: 0 0 auto;
		width: min(13.5rem, 72vw);
		scroll-snap-align: start;
	}

	.analytics-grid .analytics-card {
		flex: 0 0 auto;
		width: min(19rem, 78vw);
		max-height: 22rem;
		overflow-y: auto;
		scroll-snap-align: start;
	}

	.analytics-grid .analytics-card--vitals {
		width: min(22rem, 92vw);
		max-height: none;
	}

	.stat-card,
	.analytics-card {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		padding: 1.1rem 1.15rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
	}

	.analytics-card--timeline {
		gap: 1rem;
	}

	.vital-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.85rem;
		align-items: flex-end;
	}

	.vital-filters__field {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-width: 0;
	}

	.vital-filters__label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.vital-filter-select {
		min-width: 9rem;
		max-width: 14rem;
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.65rem;
		background: var(--background);
		color: var(--text-primary);
		padding: 0.45rem 0.6rem;
		font-size: 0.82rem;
		font-weight: 500;
	}

	.vital-chart-wrap {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.vital-chart {
		width: 100%;
		height: auto;
		display: block;
	}

	.vital-chart__plot {
		fill: color-mix(in srgb, var(--surface-hover) 35%, transparent);
		stroke: var(--border-color);
		stroke-width: 0.5;
	}

	.vital-chart__line {
		stroke: var(--caroline-blue-600);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.vital-chart__dot {
		fill: var(--caroline-blue-600);
		stroke: var(--surface);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.vital-chart__axis-text {
		fill: var(--text-muted);
		font-size: 0.45rem;
		font-family: system-ui, sans-serif;
	}

	.vital-chart-caption {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.75rem;
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--text-secondary);
	}

	.vital-chart-caption__value {
		font-weight: 600;
		color: var(--text-primary);
	}

	.vital-chart-caption__meta {
		color: var(--text-muted);
		font-size: 0.78rem;
	}

	.stat-card__label,
	.analytics-card__subtitle,
	.mini-row__subtitle,
	.timeline-row__subtitle,
	.stat-card__meta {
		color: var(--text-muted);
	}

	.stat-card__label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.stat-card__value {
		font-size: clamp(1.35rem, 2vw, 1.8rem);
		color: var(--text-primary);
	}

	.stat-card__meta,
	.analytics-card__subtitle,
	.mini-row__subtitle,
	.timeline-row__subtitle,
	.empty-state {
		font-size: 0.82rem;
		line-height: 1.45;
	}

	.analytics-card__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.analytics-card__title {
		margin: 0 0 0.2rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.route-pill {
		width: fit-content;
		margin: 0;
		padding: 0.55rem 0.75rem;
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--surface-hover) 75%, transparent);
		color: var(--text-primary);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.82rem;
	}

	.mini-stack,
	.timeline {
		display: grid;
		gap: 0.7rem;
	}

	.mini-row,
	.timeline-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
		padding-top: 0.1rem;
	}

	.mini-row__copy,
	.mini-row__meta,
	.timeline-row__copy {
		display: flex;
		gap: 0.6rem;
		min-width: 0;
	}

	.mini-row__copy {
		flex-direction: column;
		gap: 0.1rem;
	}

	.mini-row__meta {
		align-items: center;
		flex-shrink: 0;
	}

	.mini-row__title,
	.timeline-row__title {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.rating-pill--good {
		background: color-mix(in srgb, #10b981 18%, var(--surface));
		color: #047857;
	}

	.rating-pill--needs-improvement {
		background: color-mix(in srgb, #f59e0b 18%, var(--surface));
		color: #b45309;
	}

	.rating-pill--poor {
		background: color-mix(in srgb, #ef4444 18%, var(--surface));
		color: #b91c1c;
	}

	.rating-pill--info,
	.timeline-kind--paint,
	.timeline-kind--render {
		background: color-mix(in srgb, var(--caroline-blue-600) 16%, var(--surface));
		color: var(--caroline-blue-700);
	}

	.timeline-kind--page {
		background: color-mix(in srgb, #8b5cf6 16%, var(--surface));
		color: #6d28d9;
	}

	.timeline-kind--network {
		background: color-mix(in srgb, #10b981 16%, var(--surface));
		color: #047857;
	}

	.timeline-kind--interaction {
		background: color-mix(in srgb, #f59e0b 16%, var(--surface));
		color: #b45309;
	}

	.timeline-row__copy {
		align-items: flex-start;
	}

	.timeline-row__value {
		flex-shrink: 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.82rem;
		color: var(--text-secondary);
	}

	.empty-state {
		margin: 0;
	}

	@media (max-width: 48rem) {
		.analytics-hero {
			flex-direction: column;
		}

		.analytics-hero__meta {
			align-items: flex-start;
		}

		.mini-row,
		.timeline-row {
			flex-direction: column;
		}

		.mini-row__meta {
			justify-content: space-between;
			width: 100%;
		}
	}
</style>
