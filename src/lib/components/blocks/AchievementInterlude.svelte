<script lang="ts">
	import { achievementsStore } from '$lib/stores/achievementsStore.svelte';

	type Props = {
		achievementName: string;
		interludeKey: number;
	};

	let { achievementName, interludeKey }: Props = $props();

	function handleClaimInterludeAnimationEnd(event: AnimationEvent) {
		if (event.target !== event.currentTarget) {
			return;
		}

		achievementsStore.finishInterlude();
	}
</script>

{#key interludeKey}
	<div
		class="achievement-interlude"
		role="status"
		aria-live="polite"
		aria-label={`${achievementName} claimed`}
		onanimationend={handleClaimInterludeAnimationEnd}
	>
		<div class="achievement-interlude__burst" aria-hidden="true"></div>
		<div class="achievement-interlude__card">
			<span class="achievement-interlude__badge" aria-hidden="true">
				<span class="achievement-interlude__x-mark"></span>
			</span>
			<span class="achievement-interlude__eyebrow">Achievement Claimed</span>
			<span class="achievement-interlude__title">{achievementName}</span>
		</div>
	</div>
{/key}

<style>
	.achievement-interlude {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: grid;
		place-items: center;
		overflow: hidden;
		background:
			radial-gradient(circle at 50% 40%, rgb(82 255 91 / 0.32), transparent 20rem),
			rgb(0 0 0 / 0.76);
		color: #f4fff0;
		padding: 1rem;
		pointer-events: auto;
		animation: achievement-interlude-shell 1600ms cubic-bezier(0.2, 0.82, 0.2, 1) forwards;
	}

	.achievement-interlude__burst {
		position: absolute;
		width: min(28rem, 84vw);
		aspect-ratio: 1;
		border-radius: 999px;
		background:
			conic-gradient(
				from 0deg,
				transparent 0 8%,
				rgb(144 255 159 / 0.48) 8% 10%,
				transparent 10% 18%
			),
			radial-gradient(circle, rgb(140 255 151 / 0.2), transparent 62%);
		filter: blur(0.1rem);
		opacity: 0.78;
		animation: achievement-interlude-burst 1600ms ease-out forwards;
	}

	.achievement-interlude__card {
		position: relative;
		display: grid;
		width: min(19rem, calc(100vw - 2rem));
		justify-items: center;
		gap: 0.55rem;
		border: 1px solid rgb(202 255 196 / 0.78);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 50% 18%, rgb(255 255 255 / 0.18), transparent 6rem),
			linear-gradient(180deg, rgb(35 140 47 / 0.96), rgb(5 44 12 / 0.98));
		padding: 1.15rem;
		text-align: center;
		box-shadow:
			0 0 0 0.7rem rgb(53 255 75 / 0.1),
			0 0 3rem rgb(82 255 91 / 0.7),
			inset 0 1px 0 rgb(255 255 255 / 0.46);
		animation: achievement-interlude-card 1600ms cubic-bezier(0.2, 0.82, 0.2, 1) forwards;
	}

	.achievement-interlude__badge {
		position: relative;
		display: block;
		width: 5.6rem;
		aspect-ratio: 1;
		border: 0.12rem solid rgb(216 255 207 / 0.88);
		border-radius: 999px;
		background:
			radial-gradient(circle at 34% 28%, #f4fff0 0 9%, transparent 10%),
			radial-gradient(circle at 50% 46%, #81ff65 0 24%, #1dc341 45%, #0e7e2b 70%, #053811 100%);
		box-shadow:
			0 0 0 0.48rem rgb(32 255 74 / 0.12),
			0 0 2rem rgb(78 255 87 / 0.68),
			inset 0 0.45rem 0.9rem rgb(255 255 255 / 0.34),
			inset 0 -0.65rem 0.95rem rgb(1 35 10 / 0.52);
	}

	.achievement-interlude__x-mark {
		position: absolute;
		inset: 28% 25%;
		filter: drop-shadow(0 0 0.45rem rgb(244 255 237 / 0.72));
	}

	.achievement-interlude__x-mark::before,
	.achievement-interlude__x-mark::after {
		position: absolute;
		inset: 0 auto auto 50%;
		width: 18%;
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(180deg, #f8fff4, #b9ff9b);
		content: '';
		transform-origin: center;
	}

	.achievement-interlude__x-mark::before {
		transform: translateX(-50%) rotate(42deg);
	}

	.achievement-interlude__x-mark::after {
		transform: translateX(-50%) rotate(-42deg);
	}

	.achievement-interlude__eyebrow,
	.achievement-interlude__title {
		font-family: var(--font-pixel), var(--font-sans);
		font-weight: 800;
		line-height: 0.95;
	}

	.achievement-interlude__eyebrow {
		color: #caffbf;
		font-size: 0.84rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.achievement-interlude__title {
		font-size: clamp(1.3rem, 8vw, 2.05rem);
		letter-spacing: -0.04em;
	}

	@keyframes achievement-interlude-shell {
		0% {
			opacity: 0;
		}

		12%,
		78% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes achievement-interlude-card {
		0% {
			opacity: 0;
			transform: translateY(0.8rem) scale(0.68) rotate(-4deg);
		}

		20% {
			opacity: 1;
			transform: translateY(0) scale(1.1) rotate(2deg);
		}

		34%,
		76% {
			opacity: 1;
			transform: translateY(0) scale(1) rotate(0deg);
		}

		100% {
			opacity: 0;
			transform: translateY(-0.35rem) scale(0.94);
		}
	}

	@keyframes achievement-interlude-burst {
		0% {
			opacity: 0;
			transform: scale(0.6) rotate(0deg);
		}

		18% {
			opacity: 0.86;
		}

		100% {
			opacity: 0;
			transform: scale(1.22) rotate(38deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.achievement-interlude,
		.achievement-interlude__burst,
		.achievement-interlude__card {
			animation: none;
		}
	}
</style>
