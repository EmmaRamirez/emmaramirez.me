export interface Hero3DParams {
	revealRadius: number;
	revealSoftness: number;
	revealOpacity: number;
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
	chromaStrength: number;
	grainStrength: number;
	grainScale: number;
}

export const defaultHero3DParams: Hero3DParams = {
	revealRadius: 0.24,
	revealSoftness: 0.08,
	revealOpacity: 0.92,
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
	chromaStrength: 0.14,
	grainStrength: 0.08,
	grainScale: 88
};

export const hero3dParams: Hero3DParams = $state({ ...defaultHero3DParams });

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
		if (value !== undefined) result[key] = value;
	}
	return result;
}

export function setHero3dParams(next: Partial<Hero3DParams>) {
	for (const key of Object.keys(defaultHero3DParams) as (keyof Hero3DParams)[]) {
		const value = next[key];
		if (value !== undefined) hero3dParams[key] = value;
	}
}
