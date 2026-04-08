<script lang="ts">
	import { Modal, Select, Switch, Slider } from '$lib/components/ui';
	import { discoParams, type DiscoParams } from '$lib/stores/discoParams.svelte';
	import { showSections } from '$lib/stores';
	import { hero3dParams, type Hero3DParams } from '$lib/stores/hero3dParams.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		headerBlendMode: string;
	}

	let { open, onclose, headerBlendMode = $bindable() }: Props = $props();

	let showSectionsEnabled = $state(false);

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
	let rippleSpeed = $state(hero3dParams.rippleSpeed);
	let rippleFrequency = $state(hero3dParams.rippleFrequency);
	let rippleAmplitude = $state(hero3dParams.rippleAmplitude);
	let causticScale = $state(hero3dParams.causticScale);
	let causticSpeed = $state(hero3dParams.causticSpeed);
	let causticIntensity = $state(hero3dParams.causticIntensity);
	let waterDistortion = $state(hero3dParams.waterDistortion);
	let mouseDamping = $state(hero3dParams.mouseDamping);
	let revealDamping = $state(hero3dParams.revealDamping);
	let mouseRangeX = $state(hero3dParams.mouseRangeX);
	let mouseRangeY = $state(hero3dParams.mouseRangeY);
	let depthFocusNear = $state(hero3dParams.depthFocusNear);
	let depthFocusFar = $state(hero3dParams.depthFocusFar);
	let depthMixLow = $state(hero3dParams.depthMixLow);
	let parallaxXGain = $state(hero3dParams.parallaxXGain);
	let parallaxYGain = $state(hero3dParams.parallaxYGain);
	let rippleEdgeInfluence = $state(hero3dParams.rippleEdgeInfluence);
	let edgeRippleStrength = $state(hero3dParams.edgeRippleStrength);
	let sampleHistorySize = $state(discoParams.sampleHistorySize);
	let minBeams = $state(discoParams.minBeams);
	let maxBeams = $state(discoParams.maxBeams);
	let clickBeamCount = $state(discoParams.clickBeamCount);
	let clickBaseVolatility = $state(discoParams.clickBaseVolatility);
	let volatilitySmoothing = $state(discoParams.volatilitySmoothing);
	let volatilityDecay = $state(discoParams.volatilityDecay);

	let hasLoadedSettings = $state(false);
	const settingsPayload = $derived.by(() => ({
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
			contrastBoost,
			rippleSpeed,
			rippleFrequency,
			rippleAmplitude,
			causticScale,
			causticSpeed,
			causticIntensity,
			waterDistortion,
			mouseDamping,
			revealDamping,
			mouseRangeX,
			mouseRangeY,
			depthFocusNear,
			depthFocusFar,
			depthMixLow,
			parallaxXGain,
			parallaxYGain,
			rippleEdgeInfluence,
			edgeRippleStrength
		},
		discoParams: {
			sampleHistorySize,
			minBeams,
			maxBeams,
			clickBeamCount,
			clickBaseVolatility,
			volatilitySmoothing,
			volatilityDecay
		}
	}));

	onMount(() => {
		const unsubscribe = showSections.subscribe((value) => {
			showSectionsEnabled = value;
		});

		void (async () => {
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
					hero3dParams: Hero3DParams;
					discoParams?: DiscoParams;
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
					rippleSpeed = hero.rippleSpeed ?? rippleSpeed;
					rippleFrequency = hero.rippleFrequency ?? rippleFrequency;
					rippleAmplitude = hero.rippleAmplitude ?? rippleAmplitude;
					causticScale = hero.causticScale ?? causticScale;
					causticSpeed = hero.causticSpeed ?? causticSpeed;
					causticIntensity = hero.causticIntensity ?? causticIntensity;
					waterDistortion = hero.waterDistortion ?? waterDistortion;
					mouseDamping = hero.mouseDamping ?? mouseDamping;
					revealDamping = hero.revealDamping ?? revealDamping;
					mouseRangeX = hero.mouseRangeX ?? mouseRangeX;
					mouseRangeY = hero.mouseRangeY ?? mouseRangeY;
					depthFocusNear = hero.depthFocusNear ?? depthFocusNear;
					depthFocusFar = hero.depthFocusFar ?? depthFocusFar;
					depthMixLow = hero.depthMixLow ?? depthMixLow;
					parallaxXGain = hero.parallaxXGain ?? parallaxXGain;
					parallaxYGain = hero.parallaxYGain ?? parallaxYGain;
					rippleEdgeInfluence = hero.rippleEdgeInfluence ?? rippleEdgeInfluence;
					edgeRippleStrength = hero.edgeRippleStrength ?? edgeRippleStrength;
				}

				const disco = settings.discoParams;
				if (disco) {
					sampleHistorySize = disco.sampleHistorySize ?? sampleHistorySize;
					minBeams = disco.minBeams ?? minBeams;
					maxBeams = disco.maxBeams ?? maxBeams;
					clickBeamCount = disco.clickBeamCount ?? clickBeamCount;
					clickBaseVolatility = disco.clickBaseVolatility ?? clickBaseVolatility;
					volatilitySmoothing = disco.volatilitySmoothing ?? volatilitySmoothing;
					volatilityDecay = disco.volatilityDecay ?? volatilityDecay;
				}
			}

			hasLoadedSettings = true;
		})();

		return unsubscribe;
	});

	/** Batch writes so dependents (hero, disco blocks) invalidate once per tick. */
	$effect(() => {
		Object.assign(hero3dParams, {
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
			contrastBoost,
			rippleSpeed,
			rippleFrequency,
			rippleAmplitude,
			causticScale,
			causticSpeed,
			causticIntensity,
			waterDistortion,
			mouseDamping,
			revealDamping,
			mouseRangeX,
			mouseRangeY,
			depthFocusNear,
			depthFocusFar,
			depthMixLow,
			parallaxXGain,
			parallaxYGain,
			rippleEdgeInfluence,
			edgeRippleStrength
		});
	});

	$effect(() => {
		Object.assign(discoParams, {
			sampleHistorySize,
			minBeams,
			maxBeams,
			clickBeamCount,
			clickBaseVolatility,
			volatilitySmoothing,
			volatilityDecay
		});
	});

	$effect(() => {
		if (!browser || !hasLoadedSettings) return;

		const payload = settingsPayload;
		const timeoutId = setTimeout(() => {
			void fetch('/api/debug-settings', {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload)
			});
		}, 500);

		return () => {
			clearTimeout(timeoutId);
		};
	});
</script>

<Modal {open} {onclose} title="🔧 Super Secret Debug Menu" size="lg">
	<div class="max-h-[70vh] space-y-5 overflow-y-auto pr-2">
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
				<span
					class="text-[0.65rem] font-semibold tracking-[0.2em] text-(--text-secondary) uppercase"
				>
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
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Depth Scale: {depthScale.toFixed(2)}</span
					>
					<Slider bind:value={depthScale} min={0} max={0.5} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Reveal Radius: {revealRadius.toFixed(2)}</span
					>
					<Slider bind:value={revealRadius} min={0.1} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Parallax XY: {parallaxXY.toFixed(2)}</span
					>
					<Slider bind:value={parallaxXY} min={0} max={0.5} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Parallax Z: {parallaxZ.toFixed(2)}</span
					>
					<Slider bind:value={parallaxZ} min={0} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Splat Stretch: {splatStretch.toFixed(1)}</span
					>
					<Slider bind:value={splatStretch} min={0} max={5} step={0.1} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Splat Compress: {splatCompress.toFixed(2)}</span
					>
					<Slider bind:value={splatCompress} min={0} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Depth Bulge: {depthBulge.toFixed(2)}</span
					>
					<Slider bind:value={depthBulge} min={0} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Contour Offset: {contourOffset.toFixed(2)}</span
					>
					<Slider bind:value={contourOffset} min={0} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Blob Amplitude: {blobAmplitude.toFixed(3)}</span
					>
					<Slider bind:value={blobAmplitude} min={0} max={0.15} step={0.005} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Noise Amplitude: {noiseAmplitude.toFixed(3)}</span
					>
					<Slider bind:value={noiseAmplitude} min={0} max={0.2} step={0.005} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Contour Influence: {contourInfluence.toFixed(2)}</span
					>
					<Slider bind:value={contourInfluence} min={0} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Edge Softness: {edgeSoftness.toFixed(3)}</span
					>
					<Slider bind:value={edgeSoftness} min={0.01} max={0.2} step={0.005} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Saturation: {saturationBoost.toFixed(2)}</span
					>
					<Slider bind:value={saturationBoost} min={0.5} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Contrast: {contrastBoost.toFixed(2)}</span
					>
					<Slider bind:value={contrastBoost} min={0.5} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Mouse Damping: {mouseDamping.toFixed(2)}</span
					>
					<Slider bind:value={mouseDamping} min={0.5} max={8} step={0.1} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Reveal Damping: {revealDamping.toFixed(2)}</span
					>
					<Slider bind:value={revealDamping} min={0.5} max={8} step={0.1} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Mouse Range X: {mouseRangeX.toFixed(2)}</span
					>
					<Slider bind:value={mouseRangeX} min={0.5} max={4} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Mouse Range Y: {mouseRangeY.toFixed(2)}</span
					>
					<Slider bind:value={mouseRangeY} min={0.5} max={4} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Depth Focus Near: {depthFocusNear.toFixed(2)}</span
					>
					<Slider bind:value={depthFocusNear} min={0} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Depth Focus Far: {depthFocusFar.toFixed(2)}</span
					>
					<Slider bind:value={depthFocusFar} min={0} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Depth Mix Low: {depthMixLow.toFixed(2)}</span
					>
					<Slider bind:value={depthMixLow} min={0} max={1} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Parallax X Gain: {parallaxXGain.toFixed(2)}</span
					>
					<Slider bind:value={parallaxXGain} min={0} max={2.5} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Parallax Y Gain: {parallaxYGain.toFixed(2)}</span
					>
					<Slider bind:value={parallaxYGain} min={0} max={2.5} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Ripple Edge Influence: {rippleEdgeInfluence.toFixed(2)}</span
					>
					<Slider
						bind:value={rippleEdgeInfluence}
						min={0}
						max={1.5}
						step={0.01}
						showValue={false}
					/>
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Edge Ripple Strength: {edgeRippleStrength.toFixed(2)}</span
					>
					<Slider bind:value={edgeRippleStrength} min={0} max={3} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Ripple Speed: {rippleSpeed.toFixed(2)}</span
					>
					<Slider bind:value={rippleSpeed} min={0} max={3} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Ripple Frequency: {rippleFrequency.toFixed(1)}</span
					>
					<Slider bind:value={rippleFrequency} min={0} max={24} step={0.5} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Ripple Amplitude: {rippleAmplitude.toFixed(3)}</span
					>
					<Slider bind:value={rippleAmplitude} min={0} max={0.05} step={0.001} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Caustic Scale: {causticScale.toFixed(1)}</span
					>
					<Slider bind:value={causticScale} min={0} max={20} step={0.5} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Caustic Speed: {causticSpeed.toFixed(2)}</span
					>
					<Slider bind:value={causticSpeed} min={0} max={2} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Caustic Intensity: {causticIntensity.toFixed(2)}</span
					>
					<Slider bind:value={causticIntensity} min={0} max={0.5} step={0.01} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)"
						>Water Distortion: {waterDistortion.toFixed(5)}</span
					>
					<Slider
						bind:value={waterDistortion}
						min={0}
						max={0.005}
						step={0.00005}
						showValue={false}
					/>
				</div>
			</div>
		</div>

		<div class="space-y-3 rounded-lg border border-(--border-color) bg-(--surface) p-3 sm:p-4">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-sm font-semibold text-(--text-primary)">🪩 Disco Block Traits</p>
					<p class="text-xs text-(--text-secondary)">
						Tune cursor history, beam density, and click bursts
					</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-x-4 gap-y-3">
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
						Sample History Size: {sampleHistorySize}
					</span>
					<Slider bind:value={sampleHistorySize} min={2} max={48} step={1} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
						Min Beams: {minBeams}
					</span>
					<Slider bind:value={minBeams} min={0} max={maxBeams} step={10} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
						Max Beams: {maxBeams}
					</span>
					<Slider bind:value={maxBeams} min={minBeams} max={1600} step={20} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
						Click Beam Count: {clickBeamCount}
					</span>
					<Slider bind:value={clickBeamCount} min={0} max={1200} step={20} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
						Click Base Volatility: {clickBaseVolatility.toFixed(2)}
					</span>
					<Slider bind:value={clickBaseVolatility} min={0} max={1} step={0.05} showValue={false} />
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
						Volatility Smoothing: {volatilitySmoothing.toFixed(2)}
					</span>
					<Slider
						bind:value={volatilitySmoothing}
						min={0.01}
						max={0.5}
						step={0.01}
						showValue={false}
					/>
				</div>
				<div>
					<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
						Volatility Decay: {volatilityDecay.toFixed(2)}
					</span>
					<Slider bind:value={volatilityDecay} min={0.7} max={1} step={0.01} showValue={false} />
				</div>
			</div>
		</div>

		<p class="text-xs text-(--liver-brown-600) italic">Press D to toggle this menu</p>
	</div>
</Modal>
