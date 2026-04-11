<script lang="ts">
	import { performanceAnalytics, type AnalyticsTimelineEvent } from '$lib/stores/performanceAnalytics.svelte';

	const summary = $derived(performanceAnalytics.summary);
	const sessionStartedAt = $derived(performanceAnalytics.sessionStartedAt);
	const currentRoute = $derived(performanceAnalytics.currentRoute);
	const slowestRoutes = $derived(performanceAnalytics.slowestRoutes);
	const slowestRequests = $derived(performanceAnalytics.slowestRequests);
	const slowestInteractions = $derived(performanceAnalytics.slowestInteractions);
	const slowestRenders = $derived(performanceAnalytics.slowestRenders);
	const vitals = $derived(performanceAnalytics.vitalEvents.slice(0, 6));
	const paints = $derived(performanceAnalytics.paintEvents.slice(0, 4));
	const timeline = $derived(performanceAnalytics.timeline.slice(0, 12));

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
			<button type="button" class="analytics-reset" onclick={() => performanceAnalytics.clear()}>
				Clear session
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
					<p class="analytics-card__title">Latest Vitals</p>
					<p class="analytics-card__subtitle">Most recent score for each tracked metric</p>
				</div>
			</div>
			<div class="mini-stack">
				{#if vitals.length === 0}
					<p class="empty-state">Navigate around the site to populate vitals.</p>
				{:else}
					{#each vitals as vital (vital.id)}
						<div class="mini-row">
							<div class="mini-row__copy">
								<span class="mini-row__title">{vital.name}</span>
								<span class="mini-row__subtitle">{vital.route}</span>
							</div>
							<div class="mini-row__meta">
								<span class={`rating-pill rating-pill--${vital.rating}`}>{vital.rating}</span>
								<span>{formatVitalValue(vital.value, vital.unit)}</span>
							</div>
						</div>
					{/each}
				{/if}
			</div>
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
		display: grid;
		gap: 1rem;
	}

	.stats-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.analytics-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
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

	@media (max-width: 72rem) {
		.stats-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.analytics-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 48rem) {
		.analytics-hero {
			flex-direction: column;
		}

		.analytics-hero__meta {
			align-items: flex-start;
		}

		.stats-grid,
		.analytics-grid {
			grid-template-columns: 1fr;
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
