<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
</script>

<div class={['subgrid-block', className]}>
	<div class="subgrid-block__art" role="img" aria-label="Abstract paper collage">
		<div class="subgrid-block__paper-stack" aria-hidden="true">
			<span class="subgrid-block__paper subgrid-block__paper--cream"></span>
			<span class="subgrid-block__paper subgrid-block__paper--mint"></span>
			<span class="subgrid-block__paper subgrid-block__paper--blush"></span>
		</div>

		<div class="subgrid-block__checker" aria-hidden="true">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>

		<span class="subgrid-block__sun" aria-hidden="true"></span>
		<span class="subgrid-block__blob" aria-hidden="true"></span>
		<span class="subgrid-block__loop" aria-hidden="true"></span>
		<span class="subgrid-block__ribbon subgrid-block__ribbon--mint" aria-hidden="true"></span>
		<span class="subgrid-block__ribbon subgrid-block__ribbon--gold" aria-hidden="true"></span>
		<span class="subgrid-block__spark subgrid-block__spark--one" aria-hidden="true"></span>
		<span class="subgrid-block__spark subgrid-block__spark--two" aria-hidden="true"></span>
	</div>
</div>

<style>
	.subgrid-block {
		position: relative;
		isolation: isolate;
		display: grid;
		min-height: min(28rem, calc(120vw - 2rem));
		min-width: 0;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--border-color) 58%, transparent);
		border-radius: 1.5rem;
		background:
			linear-gradient(145deg, color-mix(in srgb, var(--card-bg) 74%, black), transparent 64%),
			radial-gradient(circle at 16% 16%, color-mix(in srgb, var(--color-accent) 38%, transparent), transparent 8rem),
			radial-gradient(circle at 88% 82%, color-mix(in srgb, var(--magic-mint-500) 34%, transparent), transparent 9rem),
			var(--card-bg);
		color: var(--text-primary);
		padding: 1rem;
	}

	.subgrid-block::before {
		position: absolute;
		inset: 0.75rem;
		z-index: -1;
		border-radius: 50%;
		background:
			radial-gradient(circle, color-mix(in srgb, white 16%, transparent) 0 0.08rem, transparent 0.09rem),
			radial-gradient(circle at 70% 32%, color-mix(in srgb, var(--blush-pink-500) 18%, transparent), transparent 9rem);
		background-size: 1.05rem 1.05rem, auto;
		content: '';
		mask-image: linear-gradient(145deg, transparent, black 30%, black 70%, transparent);
	}

	.subgrid-block__art {
		position: relative;
		min-height: 0;
		overflow: hidden;
		border-radius: 1rem;
		background:
			linear-gradient(180deg, color-mix(in srgb, white 12%, transparent), transparent 34%),
			linear-gradient(155deg, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 44%),
			color-mix(in srgb, var(--card-bg) 78%, black);
		box-shadow:
			inset 0 0 0 1px color-mix(in srgb, white 20%, transparent),
			inset 0 -3rem 4rem color-mix(in srgb, black 28%, transparent),
			0 1.25rem 3rem color-mix(in srgb, black 18%, transparent);
	}

	.subgrid-block__paper-stack {
		position: absolute;
		inset: 14% 13% 18%;
		filter: drop-shadow(0 1.2rem 1.6rem color-mix(in srgb, black 32%, transparent));
	}

	.subgrid-block__paper {
		position: absolute;
		border: 1px solid color-mix(in srgb, black 18%, transparent);
		border-radius: 1.1rem 1.7rem 1rem 1.45rem;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, white 36%, transparent);
	}

	.subgrid-block__paper--cream {
		inset: 5% 3% 4% 8%;
		background:
			linear-gradient(120deg, color-mix(in srgb, white 50%, transparent), transparent 38%),
			color-mix(in srgb, var(--card-bg) 64%, #f7e8ba);
		transform: rotate(-7deg);
	}

	.subgrid-block__paper--mint {
		inset: 14% 31% 22% 2%;
		border-radius: 1.4rem 0.7rem 1.25rem 0.85rem;
		background:
			repeating-linear-gradient(
				-18deg,
				color-mix(in srgb, white 24%, transparent) 0 0.35rem,
				transparent 0.35rem 0.7rem
			),
			color-mix(in srgb, var(--magic-mint-500) 68%, var(--card-bg));
		transform: rotate(9deg);
	}

	.subgrid-block__paper--blush {
		inset: 24% 3% 11% 34%;
		border-radius: 0.8rem 1.6rem 1rem 1.2rem;
		background:
			radial-gradient(circle at 35% 38%, color-mix(in srgb, white 46%, transparent), transparent 2.2rem),
			color-mix(in srgb, var(--blush-pink-500) 74%, var(--card-bg));
		transform: rotate(11deg);
	}

	.subgrid-block__checker {
		position: absolute;
		top: 13%;
		right: -0.45rem;
		display: grid;
		grid-template-columns: repeat(3, 0.95rem);
		gap: 0.14rem;
		padding: 0.25rem;
		border-radius: 0.55rem;
		background: color-mix(in srgb, var(--card-bg) 56%, transparent);
		transform: rotate(12deg);
	}

	.subgrid-block__checker span {
		aspect-ratio: 1;
		border-radius: 0.15rem;
		background: color-mix(in srgb, white 76%, var(--card-bg));
	}

	.subgrid-block__checker span:nth-child(odd) {
		background: color-mix(in srgb, var(--text-primary) 82%, black);
	}

	.subgrid-block__sun {
		position: absolute;
		top: 9%;
		left: 13%;
		width: clamp(3.2rem, 15vw, 4.6rem);
		aspect-ratio: 1;
		border: 0.45rem solid color-mix(in srgb, var(--card-bg) 44%, transparent);
		border-radius: 999rem;
		background:
			repeating-conic-gradient(
				from 10deg,
				var(--color-accent) 0 12deg,
				color-mix(in srgb, var(--blush-pink-500) 75%, var(--color-accent)) 12deg 24deg
			);
		box-shadow: 0 0.6rem 1.2rem color-mix(in srgb, black 20%, transparent);
	}

	.subgrid-block__blob {
		position: absolute;
		right: 11%;
		bottom: 19%;
		width: clamp(5.2rem, 27vw, 7rem);
		aspect-ratio: 0.86;
		border-radius: 56% 44% 49% 51% / 44% 52% 48% 56%;
		background:
			radial-gradient(circle at 36% 28%, color-mix(in srgb, white 48%, transparent), transparent 1.5rem),
			linear-gradient(145deg, color-mix(in srgb, var(--color-accent) 88%, white), color-mix(in srgb, var(--blush-pink-500) 80%, black));
		box-shadow:
			inset -0.8rem -1rem 1.5rem color-mix(in srgb, black 18%, transparent),
			0 1rem 2rem color-mix(in srgb, black 25%, transparent);
		transform: rotate(-12deg);
	}

	.subgrid-block__loop {
		position: absolute;
		left: 9%;
		bottom: 13%;
		width: clamp(5.5rem, 29vw, 7.8rem);
		height: clamp(3.6rem, 17vw, 5rem);
		border: 0.72rem solid color-mix(in srgb, var(--text-primary) 78%, var(--card-bg));
		border-right-color: transparent;
		border-radius: 999rem;
		transform: rotate(-22deg);
	}

	.subgrid-block__ribbon {
		position: absolute;
		border-radius: 999rem;
		box-shadow: 0 0.65rem 1.2rem color-mix(in srgb, black 24%, transparent);
	}

	.subgrid-block__ribbon--mint {
		top: 46%;
		left: 10%;
		width: 56%;
		height: 0.95rem;
		background: var(--magic-mint-500);
		transform: rotate(-18deg);
	}

	.subgrid-block__ribbon--gold {
		top: 58%;
		right: 8%;
		width: 48%;
		height: 0.8rem;
		background: var(--color-accent);
		transform: rotate(16deg);
	}

	.subgrid-block__spark {
		position: absolute;
		width: 1.6rem;
		aspect-ratio: 1;
		background: color-mix(in srgb, white 88%, var(--color-accent));
		clip-path: polygon(50% 0, 61% 36%, 100% 50%, 61% 64%, 50% 100%, 39% 64%, 0 50%, 39% 36%);
		filter: drop-shadow(0 0.35rem 0.6rem color-mix(in srgb, black 24%, transparent));
	}

	.subgrid-block__spark--one {
		top: 32%;
		left: 15%;
		transform: rotate(16deg);
	}

	.subgrid-block__spark--two {
		right: 15%;
		bottom: 36%;
		width: 1.1rem;
		transform: rotate(-11deg);
	}

	@media (min-width: 48rem) {
		.subgrid-block {
			height: 100%;
			min-height: 100%;
			padding: 0.85rem;
		}
	}
</style>
