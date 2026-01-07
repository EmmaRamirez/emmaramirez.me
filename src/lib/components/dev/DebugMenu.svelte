<script lang="ts">
	import { Modal, Select, Switch, Slider } from '$lib/components/ui';
	import { discoParams } from '$lib/registry/discoParams';
	import { showSections } from '$lib/stores';
	import { hero3dParams } from '$lib/stores/hero3dParams.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		headerBlendMode: string;
	}

	let { open, onclose, headerBlendMode = $bindable() }: Props = $props();

	let showSectionsEnabled = $state(false);

	$effect(() => {
		const unsubscribe = showSections.subscribe((value) => {
			showSectionsEnabled = value;
		});
		return unsubscribe;
	});

	function setShowSectionsEnabled(value: boolean) {
		showSectionsEnabled = value;
		showSections.set(value);
	}

	const blendModeOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'multiply', label: 'Multiply' },
		{ value: 'screen', label: 'Screen' },
		{ value: 'overlay', label: 'Overlay' },
		{ value: 'darken', label: 'Darken' },
		{ value: 'lighten', label: 'Lighten' },
		{ value: 'color-dodge', label: 'Color Dodge' },
		{ value: 'color-burn', label: 'Color Burn' },
		{ value: 'hard-light', label: 'Hard Light' },
		{ value: 'soft-light', label: 'Soft Light' },
		{ value: 'difference', label: 'Difference' },
		{ value: 'exclusion', label: 'Exclusion' },
		{ value: 'hue', label: 'Hue' },
		{ value: 'saturation', label: 'Saturation' },
		{ value: 'color', label: 'Color' },
		{ value: 'luminosity', label: 'Luminosity' }
	];

	let depthScale = $state(hero3dParams.depthScale);
	let revealRadius = $state(hero3dParams.revealRadius);
	let parallaxXY = $state(hero3dParams.parallaxXY);
	let parallaxZ = $state(hero3dParams.parallaxZ);
	let splatStretch = $state(hero3dParams.splatStretch);
	let splatCompress = $state(hero3dParams.splatCompress);
	let depthBulge = $state(hero3dParams.depthBulge);
	let contourOffset = $state(hero3dParams.contourOffset);
	let blobAmplitude = $state(hero3dParams.blobAmplitude);
	let noiseAmplitude = $state(hero3dParams.noiseAmplitude);
	let contourInfluence = $state(hero3dParams.contourInfluence);
	let edgeSoftness = $state(hero3dParams.edgeSoftness);
	let saturationBoost = $state(hero3dParams.saturationBoost);
	let contrastBoost = $state(hero3dParams.contrastBoost);

	const discoParamEntries: Array<{ label: string; value: number }> = [
		{ label: 'Sample history size', value: discoParams.sampleHistorySize },
		{ label: 'Min beams', value: discoParams.minBeams },
		{ label: 'Max beams', value: discoParams.maxBeams },
		{ label: 'Click beam count', value: discoParams.clickBeamCount },
		{ label: 'Click base volatility', value: discoParams.clickBaseVolatility },
		{ label: 'Volatility smoothing', value: discoParams.volatilitySmoothing },
		{ label: 'Volatility decay', value: discoParams.volatilityDecay }
	];

	let hasLoadedSettings = $state(false);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	function getSettingsPayload() {
		return {
			headerBlendMode,
			showSectionsEnabled,
			hero3dParams: {
				depthScale,
				revealRadius,
				parallaxXY,
				parallaxZ,
				splatStretch,
				splatCompress,
				depthBulge,
				contourOffset,
				blobAmplitude,
				noiseAmplitude,
				contourInfluence,
				edgeSoftness,
				saturationBoost,
				contrastBoost
			}
		};
	}

	async function saveSettings() {
		if (!browser) return;
		saveTimeout = null;

		await fetch('/api/debug-settings', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(getSettingsPayload())
		});
	}

	function scheduleSave() {
		if (!browser || !hasLoadedSettings) return;
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveSettings, 500);
	}

	onMount(async () => {
		if (!browser) return;
		const response = await fetch('/api/debug-settings');
		if (!response.ok) {
			hasLoadedSettings = true;
			return;
		}

		const { settings } = (await response.json()) as {
			settings: {
				headerBlendMode: string;
				showSectionsEnabled: boolean;
				hero3dParams: {
					depthScale: number;
					revealRadius: number;
					parallaxXY: number;
					parallaxZ: number;
					splatStretch: number;
					splatCompress: number;
					depthBulge: number;
					contourOffset: number;
					blobAmplitude: number;
					noiseAmplitude: number;
					contourInfluence: number;
					edgeSoftness: number;
					saturationBoost: number;
					contrastBoost: number;
				};
			} | null;
		};

		if (settings) {
			headerBlendMode = settings.headerBlendMode ?? headerBlendMode;
			setShowSectionsEnabled(Boolean(settings.showSectionsEnabled));

			const hero = settings.hero3dParams;
			if (hero) {
				depthScale = hero.depthScale ?? depthScale;
				revealRadius = hero.revealRadius ?? revealRadius;
				parallaxXY = hero.parallaxXY ?? parallaxXY;
				parallaxZ = hero.parallaxZ ?? parallaxZ;
				splatStretch = hero.splatStretch ?? splatStretch;
				splatCompress = hero.splatCompress ?? splatCompress;
				depthBulge = hero.depthBulge ?? depthBulge;
				contourOffset = hero.contourOffset ?? contourOffset;
				blobAmplitude = hero.blobAmplitude ?? blobAmplitude;
				noiseAmplitude = hero.noiseAmplitude ?? noiseAmplitude;
				contourInfluence = hero.contourInfluence ?? contourInfluence;
				edgeSoftness = hero.edgeSoftness ?? edgeSoftness;
				saturationBoost = hero.saturationBoost ?? saturationBoost;
				contrastBoost = hero.contrastBoost ?? contrastBoost;
			}
		}

		hasLoadedSettings = true;
	});

	$effect(() => { hero3dParams.depthScale = depthScale; });
	$effect(() => { hero3dParams.revealRadius = revealRadius; });
	$effect(() => { hero3dParams.parallaxXY = parallaxXY; });
	$effect(() => { hero3dParams.parallaxZ = parallaxZ; });
	$effect(() => { hero3dParams.splatStretch = splatStretch; });
	$effect(() => { hero3dParams.splatCompress = splatCompress; });
	$effect(() => { hero3dParams.depthBulge = depthBulge; });
	$effect(() => { hero3dParams.contourOffset = contourOffset; });
	$effect(() => { hero3dParams.blobAmplitude = blobAmplitude; });
	$effect(() => { hero3dParams.noiseAmplitude = noiseAmplitude; });
	$effect(() => { hero3dParams.contourInfluence = contourInfluence; });
	$effect(() => { hero3dParams.edgeSoftness = edgeSoftness; });
	$effect(() => { hero3dParams.saturationBoost = saturationBoost; });
	$effect(() => { hero3dParams.contrastBoost = contrastBoost; });

	$effect(() => {
		headerBlendMode;
		showSectionsEnabled;
		depthScale;
		revealRadius;
		parallaxXY;
		parallaxZ;
		splatStretch;
		splatCompress;
		depthBulge;
		contourOffset;
		blobAmplitude;
		noiseAmplitude;
		contourInfluence;
		edgeSoftness;
		saturationBoost;
		contrastBoost;

		scheduleSave();
	});
</script>

<Modal
	{open}
	{onclose}
	title="🔧 Super Secret Debug Menu"
	size="lg"
>
	<div class="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
		<Select
			label="Header Image Blend Mode"
			bind:value={headerBlendMode}
			options={blendModeOptions}
		/>

		<div class="space-y-3 rounded-lg border border-(--border-color) bg-(--surface) p-3 sm:p-4">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-sm font-semibold text-(--text-primary)">Feature Flags</p>
					<p class="text-xs text-(--text-secondary)">Experimental toggles for the homepage</p>
				</div>
				<span class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-(--text-secondary)">
					Dev
				</span>
			</div>
			<Switch
				label="Show Essays & Projects"
				description="Toggle visibility of Essays and Projects sections"
				checked={showSectionsEnabled}
				on:click={() => setShowSectionsEnabled(!showSectionsEnabled)}
			/>
		</div>

		<div class="space-y-3 rounded-lg border border-(--border-color) bg-(--surface) p-3 sm:p-4">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-sm font-semibold text-(--text-primary)">🎨 Hero 3D Parameters</p>
					<p class="text-xs text-(--text-secondary)">Fine-tune the 3D effect shader</p>
				</div>
			</div>
			
			<div class="grid grid-cols-2 gap-x-4 gap-y-3">
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Depth Scale: {depthScale.toFixed(2)}</span>
					<Slider bind:value={depthScale} min={0} max={0.5} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Reveal Radius: {revealRadius.toFixed(2)}</span>
					<Slider bind:value={revealRadius} min={0.1} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Parallax XY: {parallaxXY.toFixed(2)}</span>
					<Slider bind:value={parallaxXY} min={0} max={0.5} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Parallax Z: {parallaxZ.toFixed(2)}</span>
					<Slider bind:value={parallaxZ} min={0} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Splat Stretch: {splatStretch.toFixed(1)}</span>
					<Slider bind:value={splatStretch} min={0} max={5} step={0.1} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Splat Compress: {splatCompress.toFixed(2)}</span>
					<Slider bind:value={splatCompress} min={0} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Depth Bulge: {depthBulge.toFixed(2)}</span>
					<Slider bind:value={depthBulge} min={0} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Contour Offset: {contourOffset.toFixed(2)}</span>
					<Slider bind:value={contourOffset} min={0} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Blob Amplitude: {blobAmplitude.toFixed(3)}</span>
					<Slider bind:value={blobAmplitude} min={0} max={0.15} step={0.005} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Noise Amplitude: {noiseAmplitude.toFixed(3)}</span>
					<Slider bind:value={noiseAmplitude} min={0} max={0.2} step={0.005} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Contour Influence: {contourInfluence.toFixed(2)}</span>
					<Slider bind:value={contourInfluence} min={0} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Edge Softness: {edgeSoftness.toFixed(3)}</span>
					<Slider bind:value={edgeSoftness} min={0.01} max={0.2} step={0.005} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Saturation: {saturationBoost.toFixed(2)}</span>
					<Slider bind:value={saturationBoost} min={0.5} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="text-xs font-medium text-(--text-secondary) block mb-1">Contrast: {contrastBoost.toFixed(2)}</span>
					<Slider bind:value={contrastBoost} min={0.5} max={2} step={0.05} showValue={false} />
				</div>
			</div>
		</div>

		<div class="space-y-3 rounded-lg border border-(--border-color) bg-(--surface) p-3 sm:p-4">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-sm font-semibold text-(--text-primary)">🪩 Disco Block Numbers</p>
					<p class="text-xs text-(--text-secondary)">Core constants from the disco effect</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-(--text-secondary)">
				{#each discoParamEntries as entry}
					<div class="flex items-center justify-between gap-2 rounded bg-(--page-bg) px-2 py-1">
						<span class="text-[0.7rem] uppercase tracking-[0.18em] text-(--text-muted)">{entry.label}</span>
						<span class="font-mono text-(--text-primary)">{entry.value}</span>
					</div>
				{/each}
			</div>
		</div>

		<p class="text-xs text-(--liver-brown-600) italic">Press D to toggle this menu</p>
	</div>
</Modal>
