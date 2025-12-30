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
}

const defaults: Hero3DParams = {
	depthScale: 0.12,
	revealRadius: 0.3,
	parallaxXY: 0.12,
	parallaxZ: 0.3,
	splatStretch: 2.5,
	splatCompress: 0.6,
	depthBulge: 0.35,
	contourOffset: 0.5,
	blobAmplitude: 0.03,
	noiseAmplitude: 0.04,
	contourInfluence: 0.6,
	edgeSoftness: 0.06,
	saturationBoost: 1.15,
	contrastBoost: 1.05
};

let depthScale = $state(defaults.depthScale);
let revealRadius = $state(defaults.revealRadius);
let parallaxXY = $state(defaults.parallaxXY);
let parallaxZ = $state(defaults.parallaxZ);
let splatStretch = $state(defaults.splatStretch);
let splatCompress = $state(defaults.splatCompress);
let depthBulge = $state(defaults.depthBulge);
let contourOffset = $state(defaults.contourOffset);
let blobAmplitude = $state(defaults.blobAmplitude);
let noiseAmplitude = $state(defaults.noiseAmplitude);
let contourInfluence = $state(defaults.contourInfluence);
let edgeSoftness = $state(defaults.edgeSoftness);
let saturationBoost = $state(defaults.saturationBoost);
let contrastBoost = $state(defaults.contrastBoost);

export const hero3dParams = {
	get depthScale() { return depthScale; },
	set depthScale(v: number) { depthScale = v; },
	
	get revealRadius() { return revealRadius; },
	set revealRadius(v: number) { revealRadius = v; },
	
	get parallaxXY() { return parallaxXY; },
	set parallaxXY(v: number) { parallaxXY = v; },
	
	get parallaxZ() { return parallaxZ; },
	set parallaxZ(v: number) { parallaxZ = v; },
	
	get splatStretch() { return splatStretch; },
	set splatStretch(v: number) { splatStretch = v; },
	
	get splatCompress() { return splatCompress; },
	set splatCompress(v: number) { splatCompress = v; },
	
	get depthBulge() { return depthBulge; },
	set depthBulge(v: number) { depthBulge = v; },
	
	get contourOffset() { return contourOffset; },
	set contourOffset(v: number) { contourOffset = v; },
	
	get blobAmplitude() { return blobAmplitude; },
	set blobAmplitude(v: number) { blobAmplitude = v; },
	
	get noiseAmplitude() { return noiseAmplitude; },
	set noiseAmplitude(v: number) { noiseAmplitude = v; },
	
	get contourInfluence() { return contourInfluence; },
	set contourInfluence(v: number) { contourInfluence = v; },
	
	get edgeSoftness() { return edgeSoftness; },
	set edgeSoftness(v: number) { edgeSoftness = v; },
	
	get saturationBoost() { return saturationBoost; },
	set saturationBoost(v: number) { saturationBoost = v; },
	
	get contrastBoost() { return contrastBoost; },
	set contrastBoost(v: number) { contrastBoost = v; },
	
	reset() {
		depthScale = defaults.depthScale;
		revealRadius = defaults.revealRadius;
		parallaxXY = defaults.parallaxXY;
		parallaxZ = defaults.parallaxZ;
		splatStretch = defaults.splatStretch;
		splatCompress = defaults.splatCompress;
		depthBulge = defaults.depthBulge;
		contourOffset = defaults.contourOffset;
		blobAmplitude = defaults.blobAmplitude;
		noiseAmplitude = defaults.noiseAmplitude;
		contourInfluence = defaults.contourInfluence;
		edgeSoftness = defaults.edgeSoftness;
		saturationBoost = defaults.saturationBoost;
		contrastBoost = defaults.contrastBoost;
	},
	
	getDefaults(): Hero3DParams {
		return { ...defaults };
	}
};

