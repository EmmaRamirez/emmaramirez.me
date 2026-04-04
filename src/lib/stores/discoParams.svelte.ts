import { defaultDiscoParams, type DiscoParams } from '$lib/registry/discoParams';

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function toFiniteNumber(value: number, fallback: number) {
	return Number.isFinite(value) ? value : fallback;
}

function toRoundedInt(value: number, fallback: number) {
	return Math.round(toFiniteNumber(value, fallback));
}

let sampleHistorySize = $state(defaultDiscoParams.sampleHistorySize);
let minBeams = $state(defaultDiscoParams.minBeams);
let maxBeams = $state(defaultDiscoParams.maxBeams);
let clickBeamCount = $state(defaultDiscoParams.clickBeamCount);
let clickBaseVolatility = $state(defaultDiscoParams.clickBaseVolatility);
let volatilitySmoothing = $state(defaultDiscoParams.volatilitySmoothing);
let volatilityDecay = $state(defaultDiscoParams.volatilityDecay);

export const discoParams = {
	get sampleHistorySize() {
		return sampleHistorySize;
	},
	set sampleHistorySize(value: number) {
		sampleHistorySize = clamp(toRoundedInt(value, defaultDiscoParams.sampleHistorySize), 2, 48);
	},

	get minBeams() {
		return minBeams;
	},
	set minBeams(value: number) {
		minBeams = clamp(toRoundedInt(value, defaultDiscoParams.minBeams), 0, maxBeams);
	},

	get maxBeams() {
		return maxBeams;
	},
	set maxBeams(value: number) {
		maxBeams = Math.max(toRoundedInt(value, defaultDiscoParams.maxBeams), minBeams);
	},

	get clickBeamCount() {
		return clickBeamCount;
	},
	set clickBeamCount(value: number) {
		clickBeamCount = clamp(toRoundedInt(value, defaultDiscoParams.clickBeamCount), 0, 2000);
	},

	get clickBaseVolatility() {
		return clickBaseVolatility;
	},
	set clickBaseVolatility(value: number) {
		clickBaseVolatility = clamp(
			toFiniteNumber(value, defaultDiscoParams.clickBaseVolatility),
			0,
			1
		);
	},

	get volatilitySmoothing() {
		return volatilitySmoothing;
	},
	set volatilitySmoothing(value: number) {
		volatilitySmoothing = clamp(
			toFiniteNumber(value, defaultDiscoParams.volatilitySmoothing),
			0.01,
			1
		);
	},

	get volatilityDecay() {
		return volatilityDecay;
	},
	set volatilityDecay(value: number) {
		volatilityDecay = clamp(toFiniteNumber(value, defaultDiscoParams.volatilityDecay), 0, 1);
	},

	reset() {
		sampleHistorySize = defaultDiscoParams.sampleHistorySize;
		minBeams = defaultDiscoParams.minBeams;
		maxBeams = defaultDiscoParams.maxBeams;
		clickBeamCount = defaultDiscoParams.clickBeamCount;
		clickBaseVolatility = defaultDiscoParams.clickBaseVolatility;
		volatilitySmoothing = defaultDiscoParams.volatilitySmoothing;
		volatilityDecay = defaultDiscoParams.volatilityDecay;
	},

	getDefaults(): DiscoParams {
		return { ...defaultDiscoParams };
	}
};

export type { DiscoParams };
