<script lang="ts">
	type Props = {
		side?: 'left' | 'right';
		variant?: 'tile' | 'page';
	};

	let { side = 'left', variant = 'tile' }: Props = $props();
</script>

<div class={['doric-column', `doric-column--${side}`, `doric-column--${variant}`]} aria-hidden="true">
	<div class="doric-column__top"></div>
	<div class="doric-column__capital">
		<div class="doric-column__abacus"></div>
		<div class="doric-column__echinus"></div>
		<div class="doric-column__necking"></div>
	</div>
	<div class="doric-column__shaft"></div>
	<div class="doric-column__stylobate">
		<div class="doric-column__step doric-column__step--a"></div>
		<div class="doric-column__step doric-column__step--b"></div>
		<div class="doric-column__step doric-column__step--c"></div>
	</div>
</div>

<style>
	.doric-column {
		--stone: hsl(40, 22%, 73%);
		--stone-light: hsl(43, 60%, 91%);
		--stone-mid: hsl(39, 31%, 79%);
		--stone-dark: hsl(36, 15%, 48%);
		--edge: hsla(32, 22%, 25%, 0.2);
		--turn: -10deg;
		--lean: -1.5deg;

		position: relative;
		display: grid;
		width: 100%;
		height: 100%;
		min-height: 0;
		animation: doric-column-x-tilt 22s ease-in-out infinite;
		filter: drop-shadow(0 0.55rem 0.7rem rgba(67, 45, 18, 0.1));
		place-items: end center;
		transform: perspective(28rem) rotateX(0deg) rotateY(var(--turn)) rotateZ(var(--lean));
		transform-style: preserve-3d;
		transform-origin: center bottom;
	}

	.doric-column--right {
		--turn: 10deg;
		--lean: 1.5deg;
	}

	.doric-column--page .doric-column__top,
	.doric-column--page .doric-column__capital,
	.doric-column--page .doric-column__shaft,
	.doric-column--page .doric-column__stylobate {
		position: absolute;
		left: 50%;
		margin: 0;
		transform: translateX(-50%);
	}

	.doric-column--page .doric-column__top {
		top: 0;
		height: 10%;
	}

	.doric-column--page .doric-column__capital {
		top: 7%;
		height: 25%;
	}

	.doric-column--page .doric-column__shaft {
		top: 25%;
		height: 57%;
	}

	.doric-column--page .doric-column__stylobate {
		top: 80%;
		height: 20%;
	}

	.doric-column > * {
		grid-area: 1 / 1;
	}

	.doric-column__top,
	.doric-column__abacus,
	.doric-column__necking,
	.doric-column__stylobate,
	.doric-column__step {
		background:
			linear-gradient(115deg, rgba(255, 255, 255, 0.48), transparent 34%),
			linear-gradient(90deg, var(--stone-light), var(--stone-mid) 45%, var(--stone-dark));
		border: 1px solid var(--edge);
		box-shadow:
			inset 0 -0.24rem 0.55rem rgba(68, 47, 24, 0.15),
			0 0.42rem 0.7rem rgba(67, 45, 18, 0.11);
	}

	.doric-column__top {
		align-self: start;
		width: min(82%, 6.4rem);
		height: 13%;
		margin-top: 3%;
		border-radius: 0.22rem;
	}

	.doric-column__capital {
		position: relative;
		align-self: start;
		width: min(78%, 5.7rem);
		height: 25%;
		margin-top: 15%;
	}

	.doric-column__abacus {
		position: absolute;
		top: 0;
		left: 50%;
		width: 92%;
		height: 18%;
		border-radius: 0.18rem;
		transform: translateX(-50%);
	}

	.doric-column__echinus {
		position: absolute;
		top: 15%;
		left: 50%;
		width: 72%;
		height: 45%;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent 42%),
			radial-gradient(ellipse at 50% 18%, var(--stone-light), var(--stone-mid) 54%, var(--stone-dark));
		border: 1px solid var(--edge);
		border-radius: 48% 48% 28% 28% / 55% 55% 40% 40%;
		box-shadow: inset 0 -0.42rem 0.7rem rgba(68, 47, 24, 0.18);
		transform: translateX(-50%);
	}

	.doric-column__necking {
		position: absolute;
		top: 61%;
		left: 50%;
		width: 60%;
		height: 9%;
		border-radius: 999px;
		transform: translateX(-50%);
	}

	.doric-column__shaft {
		align-self: end;
		width: min(44%, 3rem);
		height: 62%;
		margin-bottom: 15%;
		background:
			linear-gradient(90deg, rgba(89, 68, 43, 0.3), transparent 18% 82%, rgba(76, 54, 31, 0.34)),
			repeating-linear-gradient(
				90deg,
				rgba(73, 55, 36, 0.38) 0 0.14rem,
				rgba(255, 255, 255, 0.22) 0.14rem 0.31rem,
				rgba(180, 169, 145, 0.46) 0.31rem 0.52rem
			),
			linear-gradient(90deg, var(--stone-dark), var(--stone-light) 47%, var(--stone-mid) 62%, var(--stone-dark));
		border: 1px solid var(--edge);
		border-radius: 45% 45% 18% 18% / 2.4% 2.4% 1.2% 1.2%;
		box-shadow:
			inset 0 0 0.72rem rgba(52, 35, 18, 0.16),
			0 0.5rem 0.9rem rgba(67, 45, 18, 0.1);
	}

	.doric-column__stylobate {
		position: relative;
		align-self: end;
		width: min(76%, 5.7rem);
		height: 14%;
		background: none;
		border: 0;
		box-shadow: none;
	}

	.doric-column__step {
		position: absolute;
		left: 50%;
		height: 30%;
		border-radius: 0.18rem;
		transform: translateX(-50%);
	}

	.doric-column__step--a {
		top: 0;
		width: 62%;
	}

	.doric-column__step--b {
		top: 29%;
		width: 78%;
	}

	.doric-column__step--c {
		top: 58%;
		width: 100%;
	}

	@keyframes doric-column-x-tilt {
		0%,
		100% {
			filter: drop-shadow(0 0.48rem 0.68rem rgba(67, 45, 18, 0.09));
			transform: perspective(28rem) rotateX(-7deg) rotateY(var(--turn)) rotateZ(var(--lean));
		}

		50% {
			filter: drop-shadow(0 0.72rem 0.9rem rgba(67, 45, 18, 0.14));
			transform: perspective(28rem) rotateX(7deg) rotateY(var(--turn)) rotateZ(var(--lean));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.doric-column {
			animation: none;
		}
	}
</style>
