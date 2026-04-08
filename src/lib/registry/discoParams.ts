export interface DiscoParams {
	sampleHistorySize: number;
	minBeams: number;
	maxBeams: number;
	clickBeamCount: number;
	clickBaseVolatility: number;
	volatilitySmoothing: number;
	volatilityDecay: number;
}

export const defaultDiscoParams: DiscoParams = {
	sampleHistorySize: 12,
	minBeams: 60,
	maxBeams: 800,
	clickBeamCount: 420,
	clickBaseVolatility: 0.7,
	volatilitySmoothing: 0.15,
	volatilityDecay: 0.92
};
