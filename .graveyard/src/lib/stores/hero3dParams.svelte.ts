export type Hero3DCursorShape = 'square' | 'circle';

export interface Hero3DParams {
	revealRadius: number;
	revealSoftness: number;
	revealOpacity: number;
	cursorShape: Hero3DCursorShape;
	cursorWidth: number;
	cursorHeight: number;
	pixelSize: number;
	pixelHardness: number;
	pixelScatter: number;
	idleReveal: number;
	cursorDamping: number;
	revealDamping: number;
	parallaxStrength: number;
	tiltStrength: number;
	liftStrength: number;
	rippleStrength: number;
	rippleFrequency: number;
	rippleSpeed: number;
	rippleDecay: number;
	bounceStrength: number;
	bounceFrequency: number;
	bounceDecay: number;
	fadeStrength: number;
	fadeSoftness: number;
	glowStrength: number;
	glowRadius: number;
	revealBrightness: number;
	revealContrast: number;
	chromaStrength: number;
	grainStrength: number;
	grainScale: number;
}

export interface Hero3DPreset {
	id: string;
	name: string;
	description: string;
	params: Hero3DParams;
}

export const defaultHero3DParams: Hero3DParams = {
	revealRadius: 0.24,
	revealSoftness: 0.08,
	revealOpacity: 0.92,
	cursorShape: 'square',
	cursorWidth: 1,
	cursorHeight: 1,
	pixelSize: 0.36,
	pixelHardness: 0.94,
	pixelScatter: 0.24,
	idleReveal: 0,
	cursorDamping: 4.2,
	revealDamping: 3.4,
	parallaxStrength: 0.05,
	tiltStrength: 0.08,
	liftStrength: 0.12,
	rippleStrength: 0.34,
	rippleFrequency: 0.72,
	rippleSpeed: 0.7,
	rippleDecay: 2.8,
	bounceStrength: 0.32,
	bounceFrequency: 0.9,
	bounceDecay: 4.5,
	fadeStrength: 0.28,
	fadeSoftness: 0.55,
	glowStrength: 0.04,
	glowRadius: 0.03,
	revealBrightness: 1.18,
	revealContrast: 1.12,
	chromaStrength: 0.14,
	grainStrength: 0.08,
	grainScale: 88
};

export const hero3dParams: Hero3DParams = $state({ ...defaultHero3DParams });
export const hero3dRuntime = $state({
	renderKey: 'hero3d-initial'
});

function createHero3dPreset(
	id: string,
	name: string,
	description: string,
	overrides: Partial<Hero3DParams>
): Hero3DPreset {
	return {
		id,
		name,
		description,
		params: {
			...defaultHero3DParams,
			...overrides
		}
	};
}

export const hero3dPresets: Hero3DPreset[] = [
	createHero3dPreset(
		'pixel-scratch',
		'Pixel Scratch',
		'Crisp square cursor with restrained glow and punchy reveal.',
		{}
	),
	createHero3dPreset(
		'neon-arcade',
		'Neon Arcade',
		'Fast, vivid, glitchy squares with brighter chroma and bounce.',
		{
			revealRadius: 0.28,
			revealSoftness: 0.05,
			revealOpacity: 1,
			cursorWidth: 1.08,
			cursorHeight: 1.08,
			pixelSize: 0.42,
			pixelHardness: 0.82,
			pixelScatter: 0.52,
			cursorDamping: 5.6,
			revealDamping: 4.6,
			parallaxStrength: 0.08,
			tiltStrength: 0.11,
			liftStrength: 0.18,
			rippleStrength: 0.48,
			rippleFrequency: 1.12,
			rippleSpeed: 1.04,
			rippleDecay: 2.2,
			bounceStrength: 0.42,
			bounceFrequency: 1.24,
			bounceDecay: 4.1,
			fadeStrength: 0.18,
			fadeSoftness: 0.36,
			glowStrength: 0.14,
			glowRadius: 0.05,
			revealBrightness: 1.32,
			revealContrast: 1.28,
			chromaStrength: 0.32,
			grainStrength: 0.12,
			grainScale: 110
		}
	),
	createHero3dPreset(
		'soft-frost',
		'Soft Frost',
		'A calmer reveal with larger blocks, slower drift, and airy motion.',
		{
			revealRadius: 0.32,
			revealSoftness: 0.12,
			revealOpacity: 0.88,
			cursorShape: 'circle',
			cursorWidth: 1.16,
			cursorHeight: 1.16,
			pixelSize: 0.58,
			pixelHardness: 0.58,
			pixelScatter: 0.18,
			cursorDamping: 3.1,
			revealDamping: 2.6,
			parallaxStrength: 0.03,
			tiltStrength: 0.05,
			liftStrength: 0.08,
			rippleStrength: 0.16,
			rippleFrequency: 0.42,
			rippleSpeed: 0.36,
			rippleDecay: 3.8,
			bounceStrength: 0.12,
			bounceFrequency: 0.54,
			bounceDecay: 5.8,
			fadeStrength: 0.42,
			fadeSoftness: 0.74,
			glowStrength: 0.02,
			glowRadius: 0.01,
			revealBrightness: 1.12,
			revealContrast: 0.96,
			chromaStrength: 0.04,
			grainStrength: 0.04,
			grainScale: 72
		}
	),
	createHero3dPreset(
		'glitch-stampede',
		'Glitch Stampede',
		'Chaotic scatter and rapid pixel trails that multiply aggressively.',
		{
			revealRadius: 0.22,
			revealSoftness: 0.04,
			revealOpacity: 0.96,
			cursorWidth: 0.82,
			cursorHeight: 0.82,
			pixelSize: 0.24,
			pixelHardness: 0.97,
			pixelScatter: 0.96,
			cursorDamping: 6.4,
			revealDamping: 5.4,
			parallaxStrength: 0.06,
			tiltStrength: 0.12,
			liftStrength: 0.2,
			rippleStrength: 0.56,
			rippleFrequency: 1.38,
			rippleSpeed: 1.22,
			rippleDecay: 1.6,
			bounceStrength: 0.52,
			bounceFrequency: 1.42,
			bounceDecay: 3.6,
			fadeStrength: 0.08,
			fadeSoftness: 0.22,
			glowStrength: 0.08,
			glowRadius: 0.02,
			revealBrightness: 1.24,
			revealContrast: 1.34,
			chromaStrength: 0.22,
			grainStrength: 0.16,
			grainScale: 132
		}
	),
	createHero3dPreset(
		'cinematic-drift',
		'Cinematic Drift',
		'Slower, moodier motion with subtle shimmer and a polished trail.',
		{
			revealRadius: 0.3,
			revealSoftness: 0.09,
			revealOpacity: 0.9,
			cursorShape: 'circle',
			cursorWidth: 1.04,
			cursorHeight: 0.88,
			pixelSize: 0.46,
			pixelHardness: 0.76,
			pixelScatter: 0.3,
			cursorDamping: 3.8,
			revealDamping: 3,
			parallaxStrength: 0.07,
			tiltStrength: 0.09,
			liftStrength: 0.16,
			rippleStrength: 0.22,
			rippleFrequency: 0.64,
			rippleSpeed: 0.52,
			rippleDecay: 3.4,
			bounceStrength: 0.18,
			bounceFrequency: 0.72,
			bounceDecay: 5.1,
			fadeStrength: 0.26,
			fadeSoftness: 0.62,
			glowStrength: 0.03,
			glowRadius: 0.02,
			revealBrightness: 1.16,
			revealContrast: 1.08,
			chromaStrength: 0.08,
			grainStrength: 0.06,
			grainScale: 96
		}
	),
	createHero3dPreset(
		'spotlight-bloom',
		'Spotlight Bloom',
		'Round reveal with a brighter day image and softer motion falloff.',
		{
			revealRadius: 0.27,
			revealSoftness: 0.1,
			revealOpacity: 0.98,
			cursorShape: 'circle',
			cursorWidth: 1.18,
			cursorHeight: 1.18,
			pixelSize: 0.34,
			pixelHardness: 0.7,
			pixelScatter: 0.14,
			rippleStrength: 0.2,
			bounceStrength: 0.14,
			glowStrength: 0.03,
			glowRadius: 0.04,
			revealBrightness: 1.42,
			revealContrast: 1.08,
			chromaStrength: 0.05
		}
	),
	createHero3dPreset(
		'viewport-scan',
		'Viewport Scan',
		'Wide rectangular cursor that sweeps bright contrast across the painting.',
		{
			revealRadius: 0.23,
			revealSoftness: 0.05,
			revealOpacity: 1,
			cursorWidth: 1.46,
			cursorHeight: 0.52,
			pixelSize: 0.22,
			pixelHardness: 0.96,
			pixelScatter: 0.42,
			rippleStrength: 0.3,
			bounceStrength: 0.24,
			fadeStrength: 0.16,
			glowStrength: 0.01,
			glowRadius: 0,
			revealBrightness: 1.34,
			revealContrast: 1.42,
			chromaStrength: 0.1,
			grainStrength: 0.05
		}
	),
	createHero3dPreset(
		'poster-pop',
		'Poster Pop',
		'Chunky square cursor with taller proportions and high-contrast posterized energy.',
		{
			revealRadius: 0.26,
			revealSoftness: 0.04,
			revealOpacity: 1,
			cursorWidth: 0.72,
			cursorHeight: 1.18,
			pixelSize: 0.3,
			pixelHardness: 0.98,
			pixelScatter: 0.58,
			rippleStrength: 0.4,
			bounceStrength: 0.32,
			fadeStrength: 0.12,
			fadeSoftness: 0.28,
			glowStrength: 0.02,
			glowRadius: 0.01,
			revealBrightness: 1.26,
			revealContrast: 1.5,
			chromaStrength: 0.18,
			grainStrength: 0.1
		}
	)
];

export function getHero3dPreset(id: string): Hero3DPreset | undefined {
	return hero3dPresets.find((preset) => preset.id === id);
}

export function applyHero3dPreset(id: string) {
	const preset = getHero3dPreset(id);
	if (!preset) return;
	Object.assign(hero3dParams, preset.params);
	refreshHero3dEffect();
}

export function isHero3dPresetActive(params: Hero3DParams, presetId: string): boolean {
	const preset = getHero3dPreset(presetId);
	if (!preset) return false;

	for (const key of Object.keys(preset.params) as (keyof Hero3DParams)[]) {
		if (params[key] !== preset.params[key]) return false;
	}

	return true;
}

export function resetHero3dParams() {
	Object.assign(hero3dParams, defaultHero3DParams);
}

export function getHero3dParamsDefaults(): Hero3DParams {
	return { ...defaultHero3DParams };
}

/** Plain snapshot for merging prop overrides with live store values (reactive reads). */
export function getHero3dParamsSnapshot(): Hero3DParams {
	return { ...hero3dParams };
}

/** Apply optional Hero prop overrides on top of the current debug-store snapshot. */
export function mergeHero3dProps(overrides: Partial<Hero3DParams>): Hero3DParams {
	const result = { ...getHero3dParamsSnapshot() };
	for (const key of Object.keys(result) as (keyof Hero3DParams)[]) {
		const value = overrides[key];
		if (value !== undefined) result[key] = value as never;
	}
	return result;
}

export function setHero3dParams(next: Partial<Hero3DParams>) {
	for (const key of Object.keys(defaultHero3DParams) as (keyof Hero3DParams)[]) {
		const value = next[key];
		if (value !== undefined) hero3dParams[key] = value as never;
	}
}

export function refreshHero3dEffect() {
	hero3dRuntime.renderKey = crypto.randomUUID();
}
