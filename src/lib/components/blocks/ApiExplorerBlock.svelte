<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Tabs, Badge } from '$lib/components/ui';

	interface Props {
		open?: boolean;
		class?: string;
		onopen?: () => void;
		onclose?: () => void;
	}

	let { open = false, class: className = '', onopen, onclose }: Props = $props();

	let activeTab = $state('endpoints');
	let selectedEndpoint = $state<string | null>(null);
	let responseData = $state<string | null>(null);
	let isLoading = $state(false);
	let requestMethod = $state<'GET' | 'PUT'>('GET');

	const tabs = [
		{ id: 'endpoints', label: 'Endpoints' },
		{ id: 'try-it', label: 'Try It' },
		{ id: 'schemas', label: 'Schemas' }
	];

	const endpoints = [
		{
			path: '/api/debug-settings',
			method: 'GET',
			description: 'Fetch current debug settings including hero and disco parameters',
			response: '{ settings: DebugSettings | null }'
		},
		{
			path: '/api/debug-settings',
			method: 'PUT',
			description: 'Update debug settings with new values',
			body: '{ headerBlendMode, showSectionsEnabled, hero3dParams, discoParams }',
			response: '{ settings: DebugSettings }'
		}
	];

	const schemas = {
		DebugSettings: {
			key: 'string',
			headerBlendMode: 'string',
			showSectionsEnabled: 'boolean',
			hero3dParams: 'Hero3DParams',
			discoParams: 'DiscoParams'
		},
		Hero3DParams: {
			revealRadius: 'number',
			revealSoftness: 'number',
			revealOpacity: 'number',
			pixelSize: 'number',
			pixelHardness: 'number',
			pixelScatter: 'number',
			idleReveal: 'number',
			cursorDamping: 'number',
			revealDamping: 'number',
			parallaxStrength: 'number',
			tiltStrength: 'number',
			liftStrength: 'number',
			rippleStrength: 'number',
			rippleFrequency: 'number',
			rippleSpeed: 'number',
			rippleDecay: 'number',
			bounceStrength: 'number',
			bounceFrequency: 'number',
			bounceDecay: 'number',
			fadeStrength: 'number',
			fadeSoftness: 'number',
			glowStrength: 'number',
			glowRadius: 'number',
			chromaStrength: 'number',
			grainStrength: 'number',
			grainScale: 'number'
		},
		DiscoParams: {
			sampleHistorySize: 'number',
			minBeams: 'number',
			maxBeams: 'number',
			clickBeamCount: 'number',
			clickBaseVolatility: 'number',
			volatilitySmoothing: 'number',
			volatilityDecay: 'number'
		}
	};

	async function tryEndpoint() {
		if (!selectedEndpoint) return;

		isLoading = true;
		responseData = null;

		try {
			const res = await fetch(selectedEndpoint, {
				method: requestMethod
			});
			const data = await res.json();
			responseData = JSON.stringify(data, null, 2);
		} catch (err) {
			responseData = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			isLoading = false;
		}
	}

	function selectEndpoint(path: string, method: 'GET' | 'PUT') {
		selectedEndpoint = path;
		requestMethod = method;
		activeTab = 'try-it';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if !open}
	<button
		type="button"
		class="api-explorer-ad style-none relative h-full w-full overflow-hidden rounded-xl border border-(--border-color) text-left {className}"
		onclick={onopen}
	>
		<div class="api-explorer-ad__backdrop" aria-hidden="true"></div>
		<div class="api-explorer-ad__circuit" aria-hidden="true"></div>
		<div class="api-explorer-ad__content w-full">
			<div class="api-explorer-ad__icon" aria-hidden="true">
				<svg
					width="48"
					height="48"
					viewBox="0 0 48 48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						x="4"
						y="12"
						width="40"
						height="24"
						rx="4"
						stroke="currentColor"
						stroke-width="2.5"
					/>
					<path
						d="M12 20h6M12 28h10"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
					<circle cx="36" cy="24" r="4" stroke="currentColor" stroke-width="2" />
					<path
						d="M34 22l4 4M38 22l-4 4"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</div>
			<h3>API Explorer</h3>
			<p class="ad-body w-full">Discover and test the site's internal API endpoints.</p>
			<span class="ad-cta">
				<span class="ad-cta__pulse" aria-hidden="true"></span>
				<span class="ad-cta__text">Open Explorer</span>
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M6 4l4 4-4 4"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
		</div>
	</button>
{:else}
	<div
		class="api-explorer"
		transition:fly={{ y: 20, duration: 350, easing: cubicOut }}
		role="region"
		aria-labelledby="api-explorer-title"
	>
		<header class="api-explorer__header">
			<div class="flex items-center gap-3">
				<div class="api-explorer__logo" aria-hidden="true">
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="32" height="32" rx="6" fill="var(--lawn-green-500)" />
						<path
							d="M8 12h8M8 16h12M8 20h6"
							stroke="var(--liver-brown-800)"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<circle cx="22" cy="16" r="4" stroke="var(--liver-brown-800)" stroke-width="2" />
					</svg>
				</div>
				<div>
					<h2 id="api-explorer-title" class="text-lg font-bold text-(--text-primary)">
						API Explorer
					</h2>
					<p class="text-xs text-(--text-muted)">Test and explore endpoints</p>
				</div>
			</div>
			<button class="api-explorer__close" onclick={onclose} aria-label="Close API explorer">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</header>

		<div class="api-explorer__tabs">
			<Tabs {tabs} bind:activeTab>
				{#snippet children(tab)}
					{#if tab === 'endpoints'}
						<div class="api-explorer__content" in:fade={{ duration: 200, delay: 50 }}>
							<p class="mb-4 text-sm text-(--text-muted)">Available API endpoints on this site.</p>

							<div class="endpoint-list">
								{#each endpoints as endpoint (endpoint.path + endpoint.method)}
									<button
										type="button"
										class="endpoint-item"
										onclick={() => selectEndpoint(endpoint.path, endpoint.method as 'GET' | 'PUT')}
									>
										<div class="endpoint-item__header">
											<Badge variant={endpoint.method === 'GET' ? 'success' : 'warning'} size="sm">
												{endpoint.method}
											</Badge>
											<code class="endpoint-item__path">{endpoint.path}</code>
										</div>
										<p class="endpoint-item__desc">{endpoint.description}</p>
									</button>
								{/each}
							</div>
						</div>
					{:else if tab === 'try-it'}
						<div class="api-explorer__content" in:fade={{ duration: 200, delay: 50 }}>
							<div class="try-it-panel">
								<div class="try-it-input">
									<label for="endpoint-input" class="try-it-label">Endpoint</label>
									<div class="try-it-url">
										<Badge variant={requestMethod === 'GET' ? 'success' : 'warning'} size="sm">
											{requestMethod}
										</Badge>
										<input
											id="endpoint-input"
											type="text"
											bind:value={selectedEndpoint}
											placeholder="/api/..."
											class="try-it-url__input"
										/>
									</div>
								</div>

								<button
									type="button"
									class="try-it-send"
									onclick={tryEndpoint}
									disabled={!selectedEndpoint || isLoading}
								>
									{#if isLoading}
										<span class="try-it-send__spinner"></span>
										Sending...
									{:else}
										Send Request
									{/if}
								</button>

								{#if responseData}
									<div class="try-it-response">
										<span class="try-it-label" aria-hidden="true">Response</span>
										<pre
											class="try-it-response__code"
											aria-label="API Response">{responseData}</pre>
									</div>
								{/if}
							</div>
						</div>
					{:else if tab === 'schemas'}
						<div class="api-explorer__content" in:fade={{ duration: 200, delay: 50 }}>
							<p class="mb-4 text-sm text-(--text-muted)">TypeScript schemas used by the API.</p>

							{#each Object.entries(schemas) as [name, fields] (name)}
								<div class="schema-block">
									<h4 class="schema-block__title">{name}</h4>
									<div class="schema-block__fields">
										{#each Object.entries(fields) as [field, type] (field)}
											<div class="schema-field">
												<code class="schema-field__name">{field}</code>
												<span class="schema-field__type">{type}</span>
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{/snippet}
			</Tabs>
		</div>
	</div>
{/if}

<style>
	/* Collapsed Ad State */
	.api-explorer-ad {
		background: var(--surface);
		box-shadow:
			0 1.25rem 3.125rem rgba(0, 0, 0, 0.18),
			0 0 0 0.0625rem var(--border-color);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.api-explorer-ad:hover {
		transform: translateY(-0.125rem);
		box-shadow:
			0 1.5rem 3.5rem rgba(0, 0, 0, 0.25),
			0 0 0 0.0625rem var(--lawn-green-500);
	}

	.api-explorer-ad__backdrop {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle at 2px 2px, var(--border-color) 1px, transparent 1px);
		background-size: 24px 24px;
		opacity: 0.3;
		pointer-events: none;
	}

	.api-explorer-ad__circuit {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent 0%, var(--lawn-green-500) 50%, transparent 100%);
		opacity: 0.06;
		pointer-events: none;
	}

	.api-explorer-ad__content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.5rem;
		color: var(--text-primary);
		height: 100%;
	}

	.api-explorer-ad__icon {
		color: var(--lawn-green-500);
		margin-bottom: 0.25rem;
	}

	.api-explorer-ad h3 {
		font-size: clamp(1.25rem, 1.4vw + 0.8rem, 1.75rem);
		line-height: 1.1;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--text-primary);
	}

	.ad-body {
		max-width: 45ch;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-muted);
		flex: 1;
	}

	.ad-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.65rem 1.25rem;
		border-radius: 62.4375rem;
		border: 0.0625rem solid var(--lawn-green-500);
		background: transparent;
		color: var(--lawn-green-500);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-size: 0.75rem;
		position: relative;
		overflow: hidden;
		transition: all 0.25s ease;
		width: fit-content;
	}

	.api-explorer-ad:hover .ad-cta {
		background: var(--lawn-green-500);
		color: var(--liver-brown-800);
	}

	.ad-cta__pulse {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0.5rem;
		height: 0.5rem;
		background: var(--lawn-green-500);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
		animation: pulse-ring 2s ease-out infinite;
	}

	@keyframes pulse-ring {
		0% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(1);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(8);
		}
	}

	/* Expanded State */
	.api-explorer {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--page-bg-subtle);
		border: 0.125rem solid var(--border-color);
		border-radius: 1rem;
		box-shadow:
			0 1.25rem 2.5rem -0.5rem rgba(0, 0, 0, 0.3),
			0 0 0 0.0625rem var(--border-color);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.api-explorer__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 0.125rem solid var(--border-color);
		background: var(--header-bg);
	}

	.api-explorer__logo {
		flex-shrink: 0;
	}

	.api-explorer__close {
		padding: 0.4rem;
		border-radius: 0.4rem;
		color: var(--text-muted);
		transition: all 0.2s ease;
		cursor: pointer;
		background: transparent;
		border: none;
	}

	.api-explorer__close:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}

	.api-explorer__tabs {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding: 0 1.25rem 1.25rem;
	}

	.api-explorer__tabs :global([role='tablist']) {
		margin-top: 0.75rem;
	}

	.api-explorer__content {
		flex: 1;
		overflow-y: auto;
		padding-right: 0.25rem;
	}

	/* Endpoint List */
	.endpoint-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.endpoint-item {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.875rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
		cursor: pointer;
		text-align: left;
		transition: all 0.15s ease;
	}

	.endpoint-item:hover {
		border-color: var(--lawn-green-500);
		background: var(--surface-hover);
	}

	.endpoint-item__header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.endpoint-item__path {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.endpoint-item__desc {
		font-size: 0.75rem;
		color: var(--text-muted);
		line-height: 1.4;
	}

	/* Try It Panel */
	.try-it-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.try-it-label {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		margin-bottom: 0.35rem;
	}

	.try-it-url {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.5rem;
	}

	.try-it-url__input {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--text-primary);
		font-size: 0.85rem;
		font-family: monospace;
		outline: none;
	}

	.try-it-url__input::placeholder {
		color: var(--text-muted);
	}

	.try-it-send {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		background: var(--lawn-green-500);
		color: var(--liver-brown-800);
		border: none;
		border-radius: 0.5rem;
		font-weight: 700;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.try-it-send:hover:not(:disabled) {
		transform: translateY(-0.0625rem);
		box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
	}

	.try-it-send:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.try-it-send__spinner {
		width: 0.875rem;
		height: 0.875rem;
		border: 0.125rem solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.try-it-response {
		margin-top: 0.5rem;
	}

	.try-it-response__code {
		padding: 0.75rem;
		background: var(--liver-brown-800);
		color: var(--lawn-green-500);
		border-radius: 0.5rem;
		font-size: 0.75rem;
		line-height: 1.5;
		overflow-x: auto;
		max-height: 10rem;
		overflow-y: auto;
	}

	/* Schemas */
	.schema-block {
		margin-bottom: 1.25rem;
	}

	.schema-block__title {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
		padding-bottom: 0.35rem;
		border-bottom: 0.0625rem solid var(--border-color);
	}

	.schema-block__fields {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 0.35rem;
	}

	.schema-field {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.4rem 0.625rem;
		background: var(--card-bg);
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.35rem;
		font-size: 0.75rem;
	}

	.schema-field__name {
		font-weight: 600;
		color: var(--text-primary);
	}

	.schema-field__type {
		color: var(--lawn-green-500);
		font-family: monospace;
		font-size: 0.7rem;
	}
</style>
