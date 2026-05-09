<script lang="ts">
	const facets = Array.from({ length: 32 });
	const flutes = Array.from({ length: 24 });
	const rings = Array.from({ length: 4 });
</script>

<section class="demo" aria-label="3D floating Doric column demo">
	<div class="glow"></div>

	<div class="scene">
		<div class="column">
			<div class="shadow"></div>

			<!-- Entablature / top slab -->
			<div class="block block-top">
				<div class="face front"></div>
				<div class="face back"></div>
				<div class="face left"></div>
				<div class="face right"></div>
				<div class="face top"></div>
				<div class="face bottom"></div>
			</div>

			<!-- Doric capital -->
			<div class="capital">
				<div class="abacus"></div>

				<div class="echinus">
					{#each facets, i (i)}
						<div class="echinus-facet" style={`--i:${i}`}></div>
					{/each}
				</div>

				<div class="necking">
					{#each rings, i (i)}
						<div class="ring" style={`--r:${i}`}></div>
					{/each}
				</div>
			</div>

			<!-- Fluted shaft -->
			<div class="shaft">
				{#each facets, i (i)}
					<div class="shaft-facet" style={`--i:${i}`}></div>
				{/each}

				{#each flutes, i (i)}
					<div class="flute" style={`--i:${i}`}></div>
				{/each}
			</div>

			<!-- Doric column sits directly on stylobate, not a decorative base -->
			<div class="stylobate">
				<div class="step step-a"></div>
				<div class="step step-b"></div>
				<div class="step step-c"></div>
			</div>
		</div>
	</div>
</section>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	.demo {
		--stone: #d8d0bf;
		--stone-light: #fff7e8;
		--stone-dark: #8d8474;
		--ambient: #6e7dff;
		--accent: #e1b86f;

		position: relative;
		display: grid;
		min-height: 100vh;
		place-items: center;
		overflow: hidden;
		color: white;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
			sans-serif;
		perspective: 1100px;
	}

	.glow {
		position: absolute;
		width: 34rem;
		height: 34rem;
		border-radius: 999px;
		filter: blur(42px);
		transform: translateY(2rem);
	}

	.scene {
		position: relative;
		width: min(92vw, 48rem);
		height: min(86vh, 44rem);
		display: grid;
		place-items: center;
		transform-style: preserve-3d;
	}

	.column {
		position: relative;
		width: 18rem;
		height: 34rem;
		transform-style: preserve-3d;
		animation: float 5.5s ease-in-out infinite;
	}

	.column,
	.column * {
		transform-style: preserve-3d;
	}

	.shadow {
		position: absolute;
		left: 50%;
		bottom: -3.8rem;
		width: 18rem;
		height: 4rem;
		border-radius: 50%;
		background: radial-gradient(ellipse, rgba(0, 0, 0, 0.45), transparent 68%);
		filter: blur(8px);
		transform: translateX(-50%) rotateX(72deg) translateZ(-9rem);
		animation: shadow 5.5s ease-in-out infinite;
	}

	.block {
		position: absolute;
		left: 50%;
		width: 18rem;
		height: 3.2rem;
		transform: translateX(-50%);
	}

	.block-top {
		top: 1rem;
	}

	.face {
		position: absolute;
		background:
			linear-gradient(115deg, rgba(255, 255, 255, 0.42), transparent 32%),
			linear-gradient(90deg, var(--stone-light), var(--stone), var(--stone-dark));
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: inset 0 0 1.2rem rgba(0, 0, 0, 0.14);
	}

	.front,
	.back {
		width: 18rem;
		height: 3.2rem;
	}

	.left,
	.right {
		width: 3.2rem;
		height: 3.2rem;
	}

	.top,
	.bottom {
		width: 18rem;
		height: 3.2rem;
	}

	.front {
		transform: translateZ(1.6rem);
	}

	.back {
		transform: rotateY(180deg) translateZ(1.6rem);
	}

	.left {
		transform: rotateY(-90deg) translateZ(1.6rem);
	}

	.right {
		right: 0;
		transform: rotateY(90deg) translateZ(1.6rem);
	}

	.top {
		transform: rotateX(90deg) translateZ(1.6rem);
	}

	.bottom {
		transform: rotateX(-90deg) translateZ(1.6rem);
	}

	.capital {
		position: absolute;
		top: 4rem;
		left: 50%;
		width: 13rem;
		height: 6.5rem;
		transform: translateX(-50%);
	}

	.abacus {
		position: absolute;
		top: 0;
		left: 50%;
		width: 14.5rem;
		height: 1.3rem;
		background:
			linear-gradient(110deg, rgba(255, 255, 255, 0.5), transparent 36%),
			linear-gradient(90deg, var(--stone-light), var(--stone), var(--stone-dark));
		border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow:
			inset 0 -0.4rem 0.8rem rgba(0, 0, 0, 0.18),
			0 0.6rem 1.6rem rgba(0, 0, 0, 0.18);
		transform: translateX(-50%) translateZ(0);
	}

	.echinus {
		position: absolute;
		top: 1.1rem;
		left: 50%;
		width: 9.6rem;
		height: 3rem;
		transform: translateX(-50%);
	}

	.echinus-facet {
		position: absolute;
		left: 50%;
		width: 1.15rem;
		height: 3.1rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent 28%, rgba(0, 0, 0, 0.18)),
			linear-gradient(90deg, var(--stone-light), var(--stone), var(--stone-dark));
		transform:
			translateX(-50%)
			rotateY(calc(var(--i) * 11.25deg))
			translateZ(4.7rem)
			rotateX(-8deg);
		transform-origin: center;
		clip-path: polygon(8% 0, 92% 0, 72% 100%, 28% 100%);
	}

	.necking {
		position: absolute;
		top: 4.1rem;
		left: 50%;
		width: 8.4rem;
		height: 1.9rem;
		transform: translateX(-50%);
	}

	.ring {
		position: absolute;
		top: calc(var(--r) * 0.34rem);
		left: 50%;
		width: 8.8rem;
		height: 0.18rem;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--stone-light), var(--stone), var(--stone-dark));
		box-shadow:
			0 0.14rem 0 rgba(0, 0, 0, 0.22),
			0 -0.05rem 0 rgba(255, 255, 255, 0.35);
		transform: translateX(-50%) translateZ(0.12rem);
	}

	.shaft {
		position: absolute;
		top: 9.5rem;
		left: 50%;
		width: 9.1rem;
		height: 20.5rem;
		transform: translateX(-50%);
	}

	.shaft-facet {
		position: absolute;
		left: 50%;
		width: 0.95rem;
		height: 20.5rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent 14%, transparent 82%, rgba(0, 0, 0, 0.22)),
			linear-gradient(90deg, #a69c89, var(--stone-light) 42%, var(--stone) 55%, #766e61);
		box-shadow: inset 0 0 0.8rem rgba(0, 0, 0, 0.15);
		transform:
			translateX(-50%)
			rotateY(calc(var(--i) * 11.25deg))
			translateZ(4.25rem);
	}

	.flute {
		position: absolute;
		left: 50%;
		width: 0.36rem;
		height: 20.1rem;
		border-radius: 999px;
		background:
			linear-gradient(90deg, rgba(64, 57, 49, 0.48), rgba(255, 255, 255, 0.22), rgba(64, 57, 49, 0.42));
		opacity: 0.78;
		transform:
			translateX(-50%)
			rotateY(calc(var(--i) * 15deg))
			translateZ(4.38rem);
	}

	.stylobate {
		position: absolute;
		top: 29.9rem;
		left: 50%;
		width: 16rem;
		height: 4.2rem;
		transform: translateX(-50%);
	}

	.step {
		position: absolute;
		left: 50%;
		height: 0.85rem;
		background:
			linear-gradient(115deg, rgba(255, 255, 255, 0.42), transparent 34%),
			linear-gradient(90deg, var(--stone-light), var(--stone), var(--stone-dark));
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow:
			inset 0 -0.35rem 0.9rem rgba(0, 0, 0, 0.18),
			0 0.7rem 1.2rem rgba(0, 0, 0, 0.14);
		transform: translateX(-50%);
	}

	.step-a {
		top: 0;
		width: 10.5rem;
	}

	.step-b {
		top: 0.85rem;
		width: 13rem;
	}

	.step-c {
		top: 1.7rem;
		width: 16rem;
	}

	.caption {
		position: absolute;
		left: 2rem;
		bottom: 2rem;
		display: grid;
		gap: 0.35rem;
		color: rgba(255, 255, 255, 0.88);
		letter-spacing: -0.03em;
	}

	.caption span {
		font-size: clamp(1.5rem, 4vw, 3.2rem);
		font-weight: 750;
		line-height: 0.95;
	}

	.caption small {
		color: rgba(255, 255, 255, 0.52);
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	@keyframes float {
		0%,
		100% {
			transform: rotateX(-10deg) rotateY(-24deg) translateY(0) translateZ(0);
		}

		50% {
			transform: rotateX(-7deg) rotateY(26deg) translateY(-1.8rem) translateZ(1.2rem);
		}
	}

	@keyframes shadow {
		0%,
		100% {
			opacity: 0.42;
			transform: translateX(-50%) rotateX(72deg) translateZ(-9rem) scale(1);
		}

		50% {
			opacity: 0.24;
			transform: translateX(-50%) rotateX(72deg) translateZ(-9rem) scale(0.76);
		}
	}

	@media (max-width: 640px) {
		.column {
			scale: 0.78;
		}

		.caption {
			left: 1rem;
			right: 1rem;
			bottom: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.column,
		.shadow {
			animation: none;
		}

		.column {
			transform: rotateX(-9deg) rotateY(-20deg);
		}
	}
</style>
