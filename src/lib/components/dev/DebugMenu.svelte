<script lang="ts">
	import { Modal, Select, Slider } from '$lib/components/ui';
	import { discoParams, type DiscoParams } from '$lib/stores/discoParams.svelte';
	import { showSections } from '$lib/stores';
	import {
		applyHero3dPreset,
		hero3dPresets,
		getHero3dParamsSnapshot,
		hero3dParams,
		isHero3dPresetActive,
		type Hero3DCursorShape,
		type Hero3DParams
	} from '$lib/stores/hero3dParams.svelte';
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
	const cursorShapeOptions: { value: Hero3DCursorShape; label: string }[] = [
		{ value: 'square', label: 'Square' },
		{ value: 'circle', label: 'Circle' }
	];

	let hero = $state({ ...getHero3dParamsSnapshot() });
	let sampleHistorySize = $state(discoParams.sampleHistorySize);
	let minBeams = $state(discoParams.minBeams);
	let maxBeams = $state(discoParams.maxBeams);
	let clickBeamCount = $state(discoParams.clickBeamCount);
	let clickBaseVolatility = $state(discoParams.clickBaseVolatility);
	let volatilitySmoothing = $state(discoParams.volatilitySmoothing);
	let volatilityDecay = $state(discoParams.volatilityDecay);

	let hasLoadedSettings = $state(false);
	const heroPayload = $derived.by(() => ({ ...hero }) satisfies Hero3DParams);
	const activeHeroPresetId = $derived.by(() => {
		for (const preset of hero3dPresets) {
			if (isHero3dPresetActive(heroPayload, preset.id)) return preset.id;
		}

		return null;
	});
	const settingsPayload = $derived.by(() => ({
		headerBlendMode,
		showSectionsEnabled,
		hero3dParams: heroPayload,
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

	function applyHeroPreset(presetId: string, params: Hero3DParams) {
		Object.assign(hero, params);
		applyHero3dPreset(presetId);
	}

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

				const savedHero = settings.hero3dParams;
				if (savedHero) {
					Object.assign(hero, savedHero);
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
		Object.assign(hero3dParams, heroPayload);
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
					<p class="text-sm font-semibold text-(--text-primary)">Hero Image Effects</p>
					<p class="text-xs text-(--text-secondary)">
						Tune the cursor reveal, motion, ripple, bounce, glow, and grain layers
					</p>
				</div>
			</div>

			<div class="space-y-3">
				<div class="rounded-md border border-(--border-color) bg-black/8 p-3">
					<div class="mb-3 flex items-center justify-between gap-3">
						<p class="text-xs font-semibold tracking-[0.18em] text-(--text-secondary) uppercase">
							Presets
						</p>
						{#if activeHeroPresetId}
							<span class="text-[0.65rem] font-semibold text-(--text-secondary)">
								Active: {hero3dPresets.find((preset) => preset.id === activeHeroPresetId)?.name}
							</span>
						{:else}
							<span class="text-[0.65rem] font-semibold text-(--text-secondary)">Custom mix</span>
						{/if}
					</div>
					<div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
						{#each hero3dPresets as preset (preset.id)}
							<button
								type="button"
								class={`cursor-pointer rounded-md border p-3 text-left transition ${
									activeHeroPresetId === preset.id
										? 'border-[color:var(--lawn-green-500)] bg-[color:color-mix(in_srgb,var(--lawn-green-500)_12%,transparent)]'
										: 'border-(--border-color) bg-black/10 hover:border-(--text-secondary) hover:bg-black/16'
								}`}
								onclick={() => applyHeroPreset(preset.id, preset.params)}
							>
								<div class="mb-1 flex items-center justify-between gap-2">
									<span class="text-sm font-semibold text-(--text-primary)">{preset.name}</span>
									{#if activeHeroPresetId === preset.id}
										<span class="text-[0.65rem] font-semibold text-(--lawn-green-500)"
											>Selected</span
										>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</div>

				<div class="rounded-md border border-(--border-color) bg-black/8 p-3">
					<p class="mb-3 text-xs font-semibold tracking-[0.18em] text-(--text-secondary) uppercase">
						Reveal
					</p>
					<div class="grid grid-cols-2 gap-x-4 gap-y-3">
						<div class="col-span-2">
							<Select
								label="Cursor Shape"
								bind:value={hero.cursorShape}
								options={cursorShapeOptions}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Reveal Radius: {hero.revealRadius.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.revealRadius}
								min={0.08}
								max={0.5}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Reveal Softness: {hero.revealSoftness.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.revealSoftness}
								min={0.01}
								max={0.22}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Reveal Opacity: {hero.revealOpacity.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.revealOpacity}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Cursor Width: {hero.cursorWidth.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.cursorWidth}
								min={0.25}
								max={2}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Cursor Height: {hero.cursorHeight.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.cursorHeight}
								min={0.25}
								max={2}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Pixel Size: {hero.pixelSize.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.pixelSize}
								min={0.15}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Pixel Hardness: {hero.pixelHardness.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.pixelHardness}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Pixel Scatter: {hero.pixelScatter.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.pixelScatter}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Idle Reveal: {hero.idleReveal.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.idleReveal}
								min={0}
								max={0.4}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Cursor Damping: {hero.cursorDamping.toFixed(1)}
							</span>
							<Slider
								bind:value={hero.cursorDamping}
								min={1}
								max={10}
								step={0.1}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Reveal Damping: {hero.revealDamping.toFixed(1)}
							</span>
							<Slider
								bind:value={hero.revealDamping}
								min={1}
								max={10}
								step={0.1}
								showValue={false}
							/>
						</div>
					</div>
				</div>

				<div class="rounded-md border border-(--border-color) bg-black/8 p-3">
					<p class="mb-3 text-xs font-semibold tracking-[0.18em] text-(--text-secondary) uppercase">
						Motion
					</p>
					<div class="grid grid-cols-2 gap-x-4 gap-y-3">
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Parallax Strength: {hero.parallaxStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.parallaxStrength}
								min={0}
								max={0.18}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Tilt Strength: {hero.tiltStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.tiltStrength}
								min={0}
								max={0.2}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Lift Strength: {hero.liftStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.liftStrength}
								min={0}
								max={0.35}
								step={0.01}
								showValue={false}
							/>
						</div>
					</div>
				</div>

				<div class="rounded-md border border-(--border-color) bg-black/8 p-3">
					<p class="mb-3 text-xs font-semibold tracking-[0.18em] text-(--text-secondary) uppercase">
						Ripple
					</p>
					<div class="grid grid-cols-2 gap-x-4 gap-y-3">
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Ripple Strength: {hero.rippleStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.rippleStrength}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Ripple Frequency: {hero.rippleFrequency.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.rippleFrequency}
								min={0}
								max={2}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Ripple Speed: {hero.rippleSpeed.toFixed(2)}
							</span>
							<Slider bind:value={hero.rippleSpeed} min={0} max={2} step={0.01} showValue={false} />
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Ripple Decay: {hero.rippleDecay.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.rippleDecay}
								min={0.5}
								max={6}
								step={0.1}
								showValue={false}
							/>
						</div>
					</div>
				</div>

				<div class="rounded-md border border-(--border-color) bg-black/8 p-3">
					<p class="mb-3 text-xs font-semibold tracking-[0.18em] text-(--text-secondary) uppercase">
						Bounce
					</p>
					<div class="grid grid-cols-2 gap-x-4 gap-y-3">
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Bounce Strength: {hero.bounceStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.bounceStrength}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Bounce Frequency: {hero.bounceFrequency.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.bounceFrequency}
								min={0}
								max={2}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Bounce Decay: {hero.bounceDecay.toFixed(1)}
							</span>
							<Slider bind:value={hero.bounceDecay} min={1} max={8} step={0.1} showValue={false} />
						</div>
					</div>
				</div>

				<div class="rounded-md border border-(--border-color) bg-black/8 p-3">
					<p class="mb-3 text-xs font-semibold tracking-[0.18em] text-(--text-secondary) uppercase">
						Atmosphere
					</p>
					<div class="grid grid-cols-2 gap-x-4 gap-y-3">
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Fade Strength: {hero.fadeStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.fadeStrength}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Fade Softness: {hero.fadeSoftness.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.fadeSoftness}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Glow Strength: {hero.glowStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.glowStrength}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Glow Radius: {hero.glowRadius.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.glowRadius}
								min={0}
								max={0.35}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Reveal Brightness: {hero.revealBrightness.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.revealBrightness}
								min={0.5}
								max={1.8}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Reveal Contrast: {hero.revealContrast.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.revealContrast}
								min={0.5}
								max={1.8}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Chroma Drift: {hero.chromaStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.chromaStrength}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Grain Strength: {hero.grainStrength.toFixed(2)}
							</span>
							<Slider
								bind:value={hero.grainStrength}
								min={0}
								max={1}
								step={0.01}
								showValue={false}
							/>
						</div>
						<div>
							<span class="mb-1 block text-xs font-medium text-(--text-secondary)">
								Grain Scale: {hero.grainScale.toFixed(0)}
							</span>
							<Slider bind:value={hero.grainScale} min={24} max={180} step={1} showValue={false} />
						</div>
					</div>
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
