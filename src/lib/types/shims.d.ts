declare module '@georgedoescode/spline' {
	import type { Point } from '$lib/types';
	export function spline(points: Point[], tension?: number, closed?: boolean): string;
}

declare module 'simplex-noise' {
	export function createNoise2D(): (x: number, y: number) => number;
}

