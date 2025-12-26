<script lang="ts">
	import type { Point } from '$lib/types';
	import { spline } from '@georgedoescode/spline';
	import { createNoise2D } from 'simplex-noise';
	import { onMount } from 'svelte';

	interface Bloblet3Props {
		class?: string;
		startColor?: string;
		stopColor?: string;
        basePoints?: Point[];
        id: number;
        svgProps?: {
            width?: string;
            height?: string;
            viewBox?: string;
        };
        numPoints?: number;
        radius?: number;
		baseNoiseStep?: number;
		smileyFace?: boolean;
		stroke?: string;
		strokeWidth?: number;
	}

	let {
		class: className,
        id,
        basePoints,
		startColor = 'var(--startColor)',
		stopColor = 'var(--stopColor)',
        svgProps,
        numPoints = 6,
        radius = 75,
		baseNoiseStep = 0.0005,
		smileyFace = false,
		stroke,
		strokeWidth = 2
	}: Bloblet3Props = $props();

    let points =
		$state<
			Point[]
		>(basePoints ?? createPoints());
	
	let simplex = createNoise2D();
	let noiseStep = 0.0001;
    let animationId: number = $state(0);
    let path = $derived(spline(points, 1, true));
	let blob = $state();
	let pathEl = $state<SVGPathElement>();

	function map(n: number, start1: number, end1: number, start2: number, end2: number) {
		return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
	}

	function noise(x: number, y: number) {
		return simplex(x, y);
	}

    function modifyPoints() {
        let newPoints = [];
        for (let i = 0; i < points.length; i++) {
			const point = points[i];

			// return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
			const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
			const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
			// map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
			const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
			const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

			// update the point's current coordinates
			point.x = x;
			point.y = y;

			// progress the point's x, y values through "time"
			point.noiseOffsetX += noiseStep;
			point.noiseOffsetY += noiseStep;

            newPoints.push(point);
		}

        return newPoints;
    }

    function createPoints() {
		const points = [];
		const angleStep = (Math.PI * 2) / numPoints;

		for (let i = 1; i <= numPoints; i++) {
			const theta = i * angleStep;

			const x = 100 + Math.cos(theta) * radius;
			const y = 100 + Math.sin(theta) * radius;

			points.push({
				x: x,
				y: y,
				originX: x,
				originY: y,
				noiseOffsetX: Math.random() * 1000,
				noiseOffsetY: Math.random() * 1000
			});
		}

		return points;
	}

	let previousSignature = $derived([radius, numPoints, baseNoiseStep]);

	$effect(() => {
		previousSignature = [radius, numPoints, baseNoiseStep];

		if (JSON.stringify(previousSignature) !== JSON.stringify([radius, numPoints, baseNoiseStep])) {
			console.log('recreating points with', radius, numPoints, baseNoiseStep);
			points = createPoints();
			path = spline(points, 
						1,
						true
					);

			animate();
		}

	});

	function animate() {
		path = spline(modifyPoints(), 
				1,
                true
			);

        if (points.includes('NaN')) {
        } else {
            pathEl?.setAttribute(
			'd',
               path
            );
        }

	
		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
        window.addEventListener('click', () => {
            animate();
        });
	});

    function stop() {
        cancelAnimationFrame(animationId);
    }
</script>

<svg viewBox="0 0 200 200" class={className} bind:this={blob} {...svgProps}>
	<defs>
		<linearGradient id="gradient-{id}" gradientTransform="rotate(90)">
			<stop id="gradientStop1" offset="0%" stop-color={startColor} />
			<stop id="gradientStop2 " offset="100%" stop-color={stopColor} />
		</linearGradient>
	</defs>

	<path {stroke} stroke-width={strokeWidth} bind:this={pathEl} d={path} fill="url(#gradient-{id})" />

	{#if smileyFace}
		<path id="smily-face" d="M 80 100 Q 100 120 120 100" stroke="black" stroke-width="2" fill="none" />
		<circle id="left-eye" cx="85" cy="85" r="5" fill="black" />
		<circle id="right-eye" cx="115" cy="85" r="5" fill="black" />
	 {/if}
</svg>


<style>
	svg {
		width: 30vh;
		height: 30vh;
	}
</style>
