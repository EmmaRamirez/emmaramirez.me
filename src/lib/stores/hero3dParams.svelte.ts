/**
 * Hero 3D Parameters Store
 *
 * Reactive state for the debug slider values controlling the 3D hero effect.
 * Uses Svelte 5 runes for reactivity.
 */

export interface Hero3DParams {
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
	rippleSpeed: number;
	rippleFrequency: number;
	rippleAmplitude: number;
	causticScale: number;
	causticSpeed: number;
	causticIntensity: number;
	waterDistortion: number;
	mouseDamping: number;
	revealDamping: number;
	mouseRangeX: number;
	mouseRangeY: number;
	depthFocusNear: number;
	depthFocusFar: number;
	depthMixLow: number;
	parallaxXGain: number;
	parallaxYGain: number;
	rippleEdgeInfluence: number;
	edgeRippleStrength: number;
}

export const defaultHero3DParams: Hero3DParams = {
	depthScale: 0.14,
	revealRadius: 0.26,
	parallaxXY: 0.17,
	parallaxZ: 0.34,
	splatStretch: 1.45,
	splatCompress: 0.36,
	depthBulge: 0.16,
	contourOffset: 0.18,
	blobAmplitude: 0.015,
	noiseAmplitude: 0.018,
	contourInfluence: 0.32,
	edgeSoftness: 0.08,
	saturationBoost: 1.2,
	contrastBoost: 1.12,
	rippleSpeed: 0.55,
	rippleFrequency: 8.2,
	rippleAmplitude: 0.0065,
	causticScale: 6.4,
	causticSpeed: 0.28,
	causticIntensity: 0.06,
	waterDistortion: 0.00032,
	mouseDamping: 3.6,
	revealDamping: 2.8,
	mouseRangeX: 1.85,
	mouseRangeY: 1.35,
	depthFocusNear: 0.2,
	depthFocusFar: 0.9,
	depthMixLow: 0.52,
	parallaxXGain: 1.05,
	parallaxYGain: 0.78,
	rippleEdgeInfluence: 0.28,
	edgeRippleStrength: 0.95
};

let depthScale = $state(defaultHero3DParams.depthScale);
let revealRadius = $state(defaultHero3DParams.revealRadius);
let parallaxXY = $state(defaultHero3DParams.parallaxXY);
let parallaxZ = $state(defaultHero3DParams.parallaxZ);
let splatStretch = $state(defaultHero3DParams.splatStretch);
let splatCompress = $state(defaultHero3DParams.splatCompress);
let depthBulge = $state(defaultHero3DParams.depthBulge);
let contourOffset = $state(defaultHero3DParams.contourOffset);
let blobAmplitude = $state(defaultHero3DParams.blobAmplitude);
let noiseAmplitude = $state(defaultHero3DParams.noiseAmplitude);
let contourInfluence = $state(defaultHero3DParams.contourInfluence);
let edgeSoftness = $state(defaultHero3DParams.edgeSoftness);
let saturationBoost = $state(defaultHero3DParams.saturationBoost);
let contrastBoost = $state(defaultHero3DParams.contrastBoost);
let rippleSpeed = $state(defaultHero3DParams.rippleSpeed);
let rippleFrequency = $state(defaultHero3DParams.rippleFrequency);
let rippleAmplitude = $state(defaultHero3DParams.rippleAmplitude);
let causticScale = $state(defaultHero3DParams.causticScale);
let causticSpeed = $state(defaultHero3DParams.causticSpeed);
let causticIntensity = $state(defaultHero3DParams.causticIntensity);
let waterDistortion = $state(defaultHero3DParams.waterDistortion);
let mouseDamping = $state(defaultHero3DParams.mouseDamping);
let revealDamping = $state(defaultHero3DParams.revealDamping);
let mouseRangeX = $state(defaultHero3DParams.mouseRangeX);
let mouseRangeY = $state(defaultHero3DParams.mouseRangeY);
let depthFocusNear = $state(defaultHero3DParams.depthFocusNear);
let depthFocusFar = $state(defaultHero3DParams.depthFocusFar);
let depthMixLow = $state(defaultHero3DParams.depthMixLow);
let parallaxXGain = $state(defaultHero3DParams.parallaxXGain);
let parallaxYGain = $state(defaultHero3DParams.parallaxYGain);
let rippleEdgeInfluence = $state(defaultHero3DParams.rippleEdgeInfluence);
let edgeRippleStrength = $state(defaultHero3DParams.edgeRippleStrength);

export const hero3dParams = {
	get depthScale() {
		return depthScale;
	},
	set depthScale(v: number) {
		depthScale = v;
	},

	get revealRadius() {
		return revealRadius;
	},
	set revealRadius(v: number) {
		revealRadius = v;
	},

	get parallaxXY() {
		return parallaxXY;
	},
	set parallaxXY(v: number) {
		parallaxXY = v;
	},

	get parallaxZ() {
		return parallaxZ;
	},
	set parallaxZ(v: number) {
		parallaxZ = v;
	},

	get splatStretch() {
		return splatStretch;
	},
	set splatStretch(v: number) {
		splatStretch = v;
	},

	get splatCompress() {
		return splatCompress;
	},
	set splatCompress(v: number) {
		splatCompress = v;
	},

	get depthBulge() {
		return depthBulge;
	},
	set depthBulge(v: number) {
		depthBulge = v;
	},

	get contourOffset() {
		return contourOffset;
	},
	set contourOffset(v: number) {
		contourOffset = v;
	},

	get blobAmplitude() {
		return blobAmplitude;
	},
	set blobAmplitude(v: number) {
		blobAmplitude = v;
	},

	get noiseAmplitude() {
		return noiseAmplitude;
	},
	set noiseAmplitude(v: number) {
		noiseAmplitude = v;
	},

	get contourInfluence() {
		return contourInfluence;
	},
	set contourInfluence(v: number) {
		contourInfluence = v;
	},

	get edgeSoftness() {
		return edgeSoftness;
	},
	set edgeSoftness(v: number) {
		edgeSoftness = v;
	},

	get saturationBoost() {
		return saturationBoost;
	},
	set saturationBoost(v: number) {
		saturationBoost = v;
	},

	get contrastBoost() {
		return contrastBoost;
	},
	set contrastBoost(v: number) {
		contrastBoost = v;
	},

	get rippleSpeed() {
		return rippleSpeed;
	},
	set rippleSpeed(v: number) {
		rippleSpeed = v;
	},

	get rippleFrequency() {
		return rippleFrequency;
	},
	set rippleFrequency(v: number) {
		rippleFrequency = v;
	},

	get rippleAmplitude() {
		return rippleAmplitude;
	},
	set rippleAmplitude(v: number) {
		rippleAmplitude = v;
	},

	get causticScale() {
		return causticScale;
	},
	set causticScale(v: number) {
		causticScale = v;
	},

	get causticSpeed() {
		return causticSpeed;
	},
	set causticSpeed(v: number) {
		causticSpeed = v;
	},

	get causticIntensity() {
		return causticIntensity;
	},
	set causticIntensity(v: number) {
		causticIntensity = v;
	},

	get waterDistortion() {
		return waterDistortion;
	},
	set waterDistortion(v: number) {
		waterDistortion = v;
	},

	get mouseDamping() {
		return mouseDamping;
	},
	set mouseDamping(v: number) {
		mouseDamping = v;
	},

	get revealDamping() {
		return revealDamping;
	},
	set revealDamping(v: number) {
		revealDamping = v;
	},

	get mouseRangeX() {
		return mouseRangeX;
	},
	set mouseRangeX(v: number) {
		mouseRangeX = v;
	},

	get mouseRangeY() {
		return mouseRangeY;
	},
	set mouseRangeY(v: number) {
		mouseRangeY = v;
	},

	get depthFocusNear() {
		return depthFocusNear;
	},
	set depthFocusNear(v: number) {
		depthFocusNear = v;
	},

	get depthFocusFar() {
		return depthFocusFar;
	},
	set depthFocusFar(v: number) {
		depthFocusFar = v;
	},

	get depthMixLow() {
		return depthMixLow;
	},
	set depthMixLow(v: number) {
		depthMixLow = v;
	},

	get parallaxXGain() {
		return parallaxXGain;
	},
	set parallaxXGain(v: number) {
		parallaxXGain = v;
	},

	get parallaxYGain() {
		return parallaxYGain;
	},
	set parallaxYGain(v: number) {
		parallaxYGain = v;
	},

	get rippleEdgeInfluence() {
		return rippleEdgeInfluence;
	},
	set rippleEdgeInfluence(v: number) {
		rippleEdgeInfluence = v;
	},

	get edgeRippleStrength() {
		return edgeRippleStrength;
	},
	set edgeRippleStrength(v: number) {
		edgeRippleStrength = v;
	},

	reset() {
		depthScale = defaultHero3DParams.depthScale;
		revealRadius = defaultHero3DParams.revealRadius;
		parallaxXY = defaultHero3DParams.parallaxXY;
		parallaxZ = defaultHero3DParams.parallaxZ;
		splatStretch = defaultHero3DParams.splatStretch;
		splatCompress = defaultHero3DParams.splatCompress;
		depthBulge = defaultHero3DParams.depthBulge;
		contourOffset = defaultHero3DParams.contourOffset;
		blobAmplitude = defaultHero3DParams.blobAmplitude;
		noiseAmplitude = defaultHero3DParams.noiseAmplitude;
		contourInfluence = defaultHero3DParams.contourInfluence;
		edgeSoftness = defaultHero3DParams.edgeSoftness;
		saturationBoost = defaultHero3DParams.saturationBoost;
		contrastBoost = defaultHero3DParams.contrastBoost;
		rippleSpeed = defaultHero3DParams.rippleSpeed;
		rippleFrequency = defaultHero3DParams.rippleFrequency;
		rippleAmplitude = defaultHero3DParams.rippleAmplitude;
		causticScale = defaultHero3DParams.causticScale;
		causticSpeed = defaultHero3DParams.causticSpeed;
		causticIntensity = defaultHero3DParams.causticIntensity;
		waterDistortion = defaultHero3DParams.waterDistortion;
		mouseDamping = defaultHero3DParams.mouseDamping;
		revealDamping = defaultHero3DParams.revealDamping;
		mouseRangeX = defaultHero3DParams.mouseRangeX;
		mouseRangeY = defaultHero3DParams.mouseRangeY;
		depthFocusNear = defaultHero3DParams.depthFocusNear;
		depthFocusFar = defaultHero3DParams.depthFocusFar;
		depthMixLow = defaultHero3DParams.depthMixLow;
		parallaxXGain = defaultHero3DParams.parallaxXGain;
		parallaxYGain = defaultHero3DParams.parallaxYGain;
		rippleEdgeInfluence = defaultHero3DParams.rippleEdgeInfluence;
		edgeRippleStrength = defaultHero3DParams.edgeRippleStrength;
	},

	getDefaults(): Hero3DParams {
		return { ...defaultHero3DParams };
	}
};

/** Plain snapshot for merging prop overrides with live store values (reactive reads). */
export function getHero3dParamsSnapshot(): Hero3DParams {
	return {
		depthScale: hero3dParams.depthScale,
		revealRadius: hero3dParams.revealRadius,
		parallaxXY: hero3dParams.parallaxXY,
		parallaxZ: hero3dParams.parallaxZ,
		splatStretch: hero3dParams.splatStretch,
		splatCompress: hero3dParams.splatCompress,
		depthBulge: hero3dParams.depthBulge,
		contourOffset: hero3dParams.contourOffset,
		blobAmplitude: hero3dParams.blobAmplitude,
		noiseAmplitude: hero3dParams.noiseAmplitude,
		contourInfluence: hero3dParams.contourInfluence,
		edgeSoftness: hero3dParams.edgeSoftness,
		saturationBoost: hero3dParams.saturationBoost,
		contrastBoost: hero3dParams.contrastBoost,
		rippleSpeed: hero3dParams.rippleSpeed,
		rippleFrequency: hero3dParams.rippleFrequency,
		rippleAmplitude: hero3dParams.rippleAmplitude,
		causticScale: hero3dParams.causticScale,
		causticSpeed: hero3dParams.causticSpeed,
		causticIntensity: hero3dParams.causticIntensity,
		waterDistortion: hero3dParams.waterDistortion,
		mouseDamping: hero3dParams.mouseDamping,
		revealDamping: hero3dParams.revealDamping,
		mouseRangeX: hero3dParams.mouseRangeX,
		mouseRangeY: hero3dParams.mouseRangeY,
		depthFocusNear: hero3dParams.depthFocusNear,
		depthFocusFar: hero3dParams.depthFocusFar,
		depthMixLow: hero3dParams.depthMixLow,
		parallaxXGain: hero3dParams.parallaxXGain,
		parallaxYGain: hero3dParams.parallaxYGain,
		rippleEdgeInfluence: hero3dParams.rippleEdgeInfluence,
		edgeRippleStrength: hero3dParams.edgeRippleStrength
	};
}

/** Apply optional Hero prop overrides on top of the current debug-store snapshot. */
export function mergeHero3dProps(overrides: Partial<Hero3DParams>): Hero3DParams {
	const result = { ...getHero3dParamsSnapshot() };
	for (const k of Object.keys(result) as (keyof Hero3DParams)[]) {
		const v = overrides[k];
		if (v !== undefined) result[k] = v;
	}
	return result;
}
