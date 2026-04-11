<script lang="ts">
	import { onMount } from 'svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { SiteSearch, ThemeToggle } from '$lib/components/ui';
	import { theme } from '$lib/stores';
	import { dev } from '$app/environment';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;

	interface InkDrop {
		x: number;
		y: number;
		radius: number;
		baseRadius: number;
		vx: number;
		vy: number;
		hue: number;
		saturation: number;
		lightness: number;
		alpha: number;
		phase: number;
		phaseSpeed: number;
		wobbleAmplitude: number;
		wobblePhase: number;
		wobbleSpeed: number;
	}

	let drops: InkDrop[] = [];
	let time = 0;

	const getColors = (isDark: boolean) => {
		if (isDark) {
			return [
				{ h: 235, s: 20, l: 25 },
				{ h: 217, s: 60, l: 45 },
				{ h: 235, s: 15, l: 30 },
				{ h: 200, s: 25, l: 35 }
			];
		} else {
			return [
				{ h: 36, s: 38, l: 75 },
				{ h: 36, s: 30, l: 70 },
				{ h: 47, s: 60, l: 80 },
				{ h: 30, s: 35, l: 72 }
			];
		}
	};

	const createDrop = (colors: { h: number; s: number; l: number }[]): InkDrop => {
		const color = colors[Math.floor(Math.random() * colors.length)];
		const baseRadius = 80 + Math.random() * 200;

		return {
			x: Math.random() * (canvas?.width || 1200),
			y: Math.random() * (canvas?.height || 800),
			radius: baseRadius,
			baseRadius,
			vx: (Math.random() - 0.5) * 0.15,
			vy: (Math.random() - 0.5) * 0.15,
			hue: color.h + (Math.random() - 0.5) * 10,
			saturation: color.s + (Math.random() - 0.5) * 10,
			lightness: color.l + (Math.random() - 0.5) * 8,
			alpha: 0.03 + Math.random() * 0.04,
			phase: Math.random() * Math.PI * 2,
			phaseSpeed: 0.002 + Math.random() * 0.003,
			wobbleAmplitude: 0.15 + Math.random() * 0.1,
			wobblePhase: Math.random() * Math.PI * 2,
			wobbleSpeed: 0.008 + Math.random() * 0.006
		};
	};

	const drawOrganicBlob = (drop: InkDrop) => {
		const points = 8;
		const angleStep = (Math.PI * 2) / points;

		ctx.beginPath();

		for (let i = 0; i <= points; i++) {
			const angle = i * angleStep;
			const wobble1 = Math.sin(angle * 2 + drop.wobblePhase) * drop.wobbleAmplitude;
			const wobble2 = Math.sin(angle * 3 + drop.wobblePhase * 1.3) * drop.wobbleAmplitude * 0.5;
			const wobble3 = Math.sin(angle * 5 + drop.phase) * drop.wobbleAmplitude * 0.3;

			const radiusVariation = 1 + wobble1 + wobble2 + wobble3;
			const r = drop.radius * radiusVariation;

			const x = drop.x + Math.cos(angle) * r;
			const y = drop.y + Math.sin(angle) * r;

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				const prevAngle = (i - 1) * angleStep;
				const prevWobble1 = Math.sin(prevAngle * 2 + drop.wobblePhase) * drop.wobbleAmplitude;
				const prevWobble2 =
					Math.sin(prevAngle * 3 + drop.wobblePhase * 1.3) * drop.wobbleAmplitude * 0.5;
				const prevWobble3 = Math.sin(prevAngle * 5 + drop.phase) * drop.wobbleAmplitude * 0.3;
				const prevR = drop.radius * (1 + prevWobble1 + prevWobble2 + prevWobble3);

				const cpAngle = (prevAngle + angle) / 2;
				const cpWobble =
					Math.sin(cpAngle * 2.5 + drop.wobblePhase * 0.8) * drop.wobbleAmplitude * 0.7;
				const cpR = drop.radius * (1 + cpWobble) * 1.1;
				const cpX = drop.x + Math.cos(cpAngle) * cpR;
				const cpY = drop.y + Math.sin(cpAngle) * cpR;

				ctx.quadraticCurveTo(cpX, cpY, x, y);
			}
		}

		ctx.closePath();

		const gradient = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.radius * 1.5);

		const baseColor = `hsla(${drop.hue}, ${drop.saturation}%, ${drop.lightness}%, ${drop.alpha})`;
		const edgeColor = `hsla(${drop.hue}, ${drop.saturation}%, ${drop.lightness}%, 0)`;

		gradient.addColorStop(0, baseColor);
		gradient.addColorStop(0.4, baseColor);
		gradient.addColorStop(1, edgeColor);

		ctx.fillStyle = gradient;
		ctx.fill();
	};

	const updateDrop = (drop: InkDrop) => {
		drop.x += drop.vx;
		drop.y += drop.vy;

		drop.radius = drop.baseRadius * (1 + Math.sin(drop.phase) * 0.1);
		drop.phase += drop.phaseSpeed;
		drop.wobblePhase += drop.wobbleSpeed;

		const padding = drop.radius * 2;
		if (drop.x < -padding) drop.x = canvas.width + padding;
		if (drop.x > canvas.width + padding) drop.x = -padding;
		if (drop.y < -padding) drop.y = canvas.height + padding;
		if (drop.y > canvas.height + padding) drop.y = -padding;
	};

	const animate = () => {
		if (!ctx || !canvas) return;

		const isDark = document.documentElement.classList.contains('dark');
		if (isDark) {
			ctx.fillStyle = 'rgba(26, 27, 39, 0.05)';
		} else {
			ctx.fillStyle = 'rgba(214, 198, 172, 0.05)';
		}
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		drops.forEach((drop) => {
			updateDrop(drop);
			drawOrganicBlob(drop);
		});

		time++;
		animationId = requestAnimationFrame(animate);
	};

	const initCanvas = () => {
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;

		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		ctx = canvas.getContext('2d')!;
		ctx.scale(dpr, dpr);

		const isDark = document.documentElement.classList.contains('dark');
		const colors = getColors(isDark);

		drops = [];
		const dropCount = 6;
		for (let i = 0; i < dropCount; i++) {
			drops.push(createDrop(colors));
		}

		if (isDark) {
			ctx.fillStyle = 'rgba(26, 27, 39, 1)';
		} else {
			ctx.fillStyle = 'rgba(214, 198, 172, 1)';
		}
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	const handleResize = () => {
		initCanvas();
	};

	$effect(() => {
		const isDark = $theme === 'dark';
		if (drops.length > 0 && canvas) {
			const colors = getColors(isDark);
			drops.forEach((drop, i) => {
				const color = colors[i % colors.length];
				drop.hue = color.h + (Math.random() - 0.5) * 10;
				drop.saturation = color.s + (Math.random() - 0.5) * 10;
				drop.lightness = color.l + (Math.random() - 0.5) * 8;
			});
		}
	});

	onMount(() => {
		initCanvas();
		animate();

		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:head>
	<title>About | Emma Ramirez</title>
	<meta name="description" content="About Emma Ramirez - developer, creator, and builder" />
</svelte:head>

<section class="relative min-h-screen w-full overflow-hidden">
	<canvas bind:this={canvas} class="absolute inset-0 -z-10 h-full w-full" aria-hidden="true"
	></canvas>

	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/">Home</HeaderNavItem>
			<HeaderNavItem href="/blog">Essays</HeaderNavItem>
			<HeaderNavItem href="/about" active class="text-(--text-primary)">About</HeaderNavItem>
			{#if dev}
				<HeaderNavItem href="/editor">Editor</HeaderNavItem>
			{/if}
			<SiteSearch />
			<a
				href="https://github.com/emzinnia"
				target="_blank"
				rel="noopener noreferrer"
				class="ml-2 flex items-center justify-center rounded-lg p-1.5 text-(--text-primary) transition-colors hover:bg-(--surface-hover) md:ml-4 md:p-2"
				aria-label="GitHub profile"
			>
				<svg class="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
						fill="currentColor"
					/></svg
				>
			</a>
			<ThemeToggle class="ml-2" />
		</HeaderNav>
	</Header>

	<div class="mx-auto max-w-3xl space-y-16 px-4 py-16">
		<header class="space-y-6">
			<h1 class="font-serif text-5xl leading-tight text-(--text-primary) md:text-6xl">
				hi, i'm emma.
			</h1>
			<p class="text-xl leading-relaxed text-balance text-(--text-secondary) md:text-2xl">
				i'm a software engineer and creator based in the u.s. i build products, write code, and
				occasionally write about both.
			</p>
		</header>

		<section class="space-y-8">
			<div class="space-y-4">
				<h2
					class="border-b border-(--border-color) pb-2 text-sm font-semibold tracking-[0.2em] text-(--text-secondary) uppercase"
				>
					Background
				</h2>
				<div class="prose space-y-4 text-lg leading-relaxed text-(--text-primary)">
					<p>
						i've been writing code for over a decade, starting with web development and gradually
						expanding into systems programming, developer tools, and product engineering. my journey
						has taken me through startups, scale-ups, and everything in between.
					</p>
					<p>
						i believe in building things that matter—software that's thoughtful, well-crafted, and
						actually useful. i'm particularly drawn to the intersection of technology and human
						experience.
					</p>
				</div>
			</div>
		</section>

		<section class="space-y-8">
			<div class="space-y-4">
				<h2
					class="border-b border-(--border-color) pb-2 text-sm font-semibold tracking-[0.2em] text-(--text-secondary) uppercase"
				>
					What I'm Into
				</h2>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="space-y-3">
						<h3 class="text-lg font-semibold text-(--text-primary)">Code & Craft</h3>
						<p class="leading-relaxed text-(--text-secondary)">
							typescript, svelte, rust, elixir. i care deeply about developer experience and
							building tools that feel good to use.
						</p>
					</div>
					<div class="space-y-3">
						<h3 class="text-lg font-semibold text-(--text-primary)">Startups & Finance</h3>
						<p class="leading-relaxed text-(--text-secondary)">
							fascinated by the mechanics of building companies and the systems that power them.
							always reading about markets and strategy.
						</p>
					</div>
					<div class="space-y-3">
						<h3 class="text-lg font-semibold text-(--text-primary)">Fashion & Design</h3>
						<p class="leading-relaxed text-(--text-secondary)">
							aesthetics matter. i'm drawn to thoughtful design in all its forms—from interfaces to
							garments to architecture.
						</p>
					</div>
					<div class="space-y-3">
						<h3 class="text-lg font-semibold text-(--text-primary)">Writing</h3>
						<p class="leading-relaxed text-(--text-secondary)">
							writing helps me think. i write about technology, craft, and the occasional meandering
							thought.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="space-y-8">
			<div class="space-y-4">
				<h2
					class="border-b border-(--border-color) pb-2 text-sm font-semibold tracking-[0.2em] text-(--text-secondary) uppercase"
				>
					Get in Touch
				</h2>
				<p class="text-lg leading-relaxed text-(--text-secondary)">
					i'm always happy to connect with people building interesting things. whether you want to
					collaborate, chat about technology, or just say hello—reach out.
				</p>
				<div class="flex flex-wrap gap-4 pt-2">
					<a
						href="https://github.com/emmaramirez"
						target="_blank"
						rel="noopener noreferrer"
						class="style-none inline-flex items-center gap-2 rounded-full border border-(--border-color) px-4 py-2 text-(--text-secondary) transition-colors hover:border-(--text-primary) hover:text-(--text-primary)"
					>
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
								clip-rule="evenodd"
							/>
						</svg>
						GitHub
					</a>
					<a
						href="https://twitter.com/emmaramirez"
						target="_blank"
						rel="noopener noreferrer"
						class="style-none inline-flex items-center gap-2 rounded-full border border-(--border-color) px-4 py-2 text-(--text-secondary) transition-colors hover:border-(--text-primary) hover:text-(--text-primary)"
					>
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
							/>
						</svg>
						Twitter
					</a>
					<a
						href="mailto:hello@emmaramirez.me"
						class="style-none inline-flex items-center gap-2 rounded-full border border-(--border-color) px-4 py-2 text-(--text-secondary) transition-colors hover:border-(--text-primary) hover:text-(--text-primary)"
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						Email
					</a>
				</div>
			</div>
		</section>

		<div class="h-16"></div>
	</div>
</section>
