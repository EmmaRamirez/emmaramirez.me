<script lang="ts">
	type LightBeam = {
		angle: number;
		distance: number;
		hue: number;
		phase: number;
		size: number;
		speed: number;
	};

	type DiscoBall = {
		beams: LightBeam[];
		createdAt: number;
		x: number;
		y: number;
	};

	type Props = {
		alt: string;
		caption?: string;
		class?: string;
		image: string;
	};

	let { alt, caption = 'Disco', class: className = '', image }: Props = $props();

	let cursorVisible = $state(false);
	let cursorX = $state(0);
	let cursorY = $state(0);

	const maxBeams = 180;
	const clickBeamCount = 120;

	function generateBeams(count: number, reach: number): LightBeam[] {
		return Array.from({ length: count }, (_, index) => ({
			angle: (Math.PI * 2 * index) / count + Math.random() * 0.16,
			distance: reach * (0.16 + Math.random() * 0.84),
			hue: Math.random() * 360,
			phase: Math.random() * Math.PI * 2,
			size: 4 + Math.random() * 10,
			speed: 0.16 + Math.random() * 0.42
		}));
	}

	function setupDisco(node: HTMLDivElement) {
		const canvas = node.querySelector<HTMLCanvasElement>('.disco-block__canvas');
		const ctx = canvas?.getContext('2d');
		if (!canvas || !ctx) return;
		const canvasElement = canvas;
		const context = ctx;

		let animationId = 0;
		let width = 0;
		let height = 0;
		let hoverBeams: LightBeam[] = [];
		let discoBalls: DiscoBall[] = [];
		let hovering = false;
		let fade = 0;

		function resize() {
			const rect = node.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;
			width = rect.width;
			height = rect.height;
			canvasElement.width = Math.max(1, Math.floor(width * dpr));
			canvasElement.height = Math.max(1, Math.floor(height * dpr));
			context.setTransform(dpr, 0, 0, dpr, 0, 0);
			hoverBeams = generateBeams(maxBeams, getReach());
		}

		function getReach() {
			return Math.max(260, Math.hypot(width, height));
		}

		function getLocalPoint(event: PointerEvent) {
			const rect = node.getBoundingClientRect();
			return {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};
		}

		function drawBeams(
			originX: number,
			originY: number,
			beams: LightBeam[],
			intensity: number,
			time: number
		) {
			const visibleBeams = Math.floor(beams.length * intensity);
			for (let index = 0; index < visibleBeams; index += 1) {
				const beam = beams[index];
				const angle = beam.angle + time * beam.speed;
				const wobble = Math.sin(time * 2.4 + beam.phase) * 10 * intensity;
				const x = originX + Math.cos(angle) * (beam.distance + wobble);
				const y = originY + Math.sin(angle) * (beam.distance + wobble);
				const size = beam.size * (0.5 + intensity * 0.7);

				context.fillStyle = `hsla(${beam.hue}, 85%, 82%, ${0.08 + intensity * 0.24})`;
				context.fillRect(Math.round(x / 6) * 6, Math.round(y / 6) * 6, size, size);
			}
		}

		function render(timestamp: number) {
			const time = timestamp * 0.001;
			context.clearRect(0, 0, width, height);

			if (hovering) {
				fade = Math.min(1, fade + 0.08);
			} else {
				fade *= 0.92;
			}

			if (fade > 0.01) {
				drawBeams(cursorX, cursorY, hoverBeams, fade, time);
			}

			discoBalls = discoBalls.filter((ball) => {
				const age = (timestamp - ball.createdAt) / 1400;
				const intensity = Math.max(0, 1 - age);
				if (intensity <= 0) return false;
				drawBeams(ball.x, ball.y, ball.beams, intensity, time);
				return true;
			});

			if (hovering || fade > 0.01 || discoBalls.length > 0) {
				animationId = requestAnimationFrame(render);
			} else {
				animationId = 0;
				context.clearRect(0, 0, width, height);
			}
		}

		function ensureAnimation() {
			if (!animationId) animationId = requestAnimationFrame(render);
		}

		function handlePointerMove(event: PointerEvent) {
			const point = getLocalPoint(event);
			cursorX = point.x;
			cursorY = point.y;
			hovering = true;
			cursorVisible = true;
			ensureAnimation();
		}

		function handlePointerLeave() {
			hovering = false;
			cursorVisible = false;
			ensureAnimation();
		}

		function handleClick(event: PointerEvent) {
			const point = getLocalPoint(event);
			discoBalls = [
				...discoBalls,
				{
					beams: generateBeams(clickBeamCount, getReach()),
					createdAt: performance.now(),
					x: point.x,
					y: point.y
				}
			];
			ensureAnimation();
		}

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(node);
		resize();

		node.addEventListener('pointermove', handlePointerMove);
		node.addEventListener('pointerleave', handlePointerLeave);
		node.addEventListener('pointerdown', handleClick);

		return () => {
			cancelAnimationFrame(animationId);
			resizeObserver.disconnect();
			node.removeEventListener('pointermove', handlePointerMove);
			node.removeEventListener('pointerleave', handlePointerLeave);
			node.removeEventListener('pointerdown', handleClick);
		};
	}
</script>

<div
	class={['disco-block', className]}
	aria-label="Interactive disco block"
	role="img"
	{@attach setupDisco}
>
	<img class="disco-block__image" src={image} {alt} />
	<div class="disco-block__wash"></div>
	<canvas class="disco-block__canvas"></canvas>
	<div
		class={['disco-block__cursor', cursorVisible && 'disco-block__cursor--visible']}
		style:--cursor-x={`${cursorX}px`}
		style:--cursor-y={`${cursorY}px`}
	></div>
	{#if caption}
		<span class="disco-block__caption">{caption}</span>
	{/if}
</div>

<style>
	.disco-block {
		position: relative;
		isolation: isolate;
		min-width: 0;
		min-height: min(16rem, calc(100vw - 2rem));
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--border-color) 58%, transparent);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 20% 20%, rgba(237, 156, 239, 0.34), transparent 14rem),
			radial-gradient(circle at 78% 72%, rgba(184, 255, 229, 0.28), transparent 12rem),
			var(--card-bg);
		cursor: inherit;
	}

	.disco-block__image,
	.disco-block__wash,
	.disco-block__canvas {
		position: absolute;
		inset: 0;
	}

	.disco-block__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.74;
		filter: saturate(0.92) contrast(1.04);
	}

	.disco-block__wash {
		z-index: 1;
		background:
			linear-gradient(180deg, rgba(10, 11, 29, 0.16), rgba(10, 11, 29, 0.68)),
			radial-gradient(circle at 50% 42%, transparent 0 24%, rgba(10, 11, 29, 0.46) 68%);
	}

	.disco-block__canvas {
		z-index: 2;
		width: 100%;
		height: 100%;
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.disco-block__cursor {
		position: absolute;
		z-index: 3;
		top: var(--cursor-y, 50%);
		left: var(--cursor-x, 50%);
		width: 2.6rem;
		height: 2.6rem;
		border-radius: 999px;
		opacity: 0;
		pointer-events: none;
		transform: translate(-50%, -50%) scale(0.9);
		transition:
			opacity 120ms ease,
			transform 120ms ease;
		background:
			radial-gradient(circle at 30% 20%, #fff 0 16%, transparent 34%),
			linear-gradient(90deg, rgba(255, 255, 255, 0.22) 1px, transparent 1px),
			linear-gradient(180deg, rgba(255, 255, 255, 0.22) 1px, transparent 1px),
			radial-gradient(circle, #d7e0ff 0, #8f96ff 42%, #3c3f7a 72%, #0a0b1d 100%);
		background-size:
			100% 100%,
			0.4rem 0.4rem,
			0.4rem 0.4rem,
			100% 100%;
		box-shadow:
			0 0 1.4rem rgba(255, 255, 255, 0.8),
			0 0 3rem rgba(184, 255, 229, 0.34);
	}

	.disco-block__cursor--visible {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	.disco-block__caption {
		position: absolute;
		z-index: 4;
		right: 1rem;
		bottom: 0.9rem;
		left: 1rem;
		color: white;
		font-family: 'DM Serif Text', serif;
		font-size: clamp(1.35rem, 4vw, 2.6rem);
		line-height: 0.9;
		text-align: center;
		text-shadow: 0 0.16rem 1rem rgba(0, 0, 0, 0.5);
	}

	@media (min-width: 48rem) {
		.disco-block {
			min-height: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.disco-block__cursor {
			transition: none;
		}
	}
</style>
