<script lang="ts">
	import { tick } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { achievementsStore } from '$lib/stores/achievementsStore.svelte';
	import { ACHIEVEMENT_GRID_CAPACITY } from '$lib/types/achievements';

	type Props = {
		class?: string;
	};

	const achievementUnlockerId = 'achievement-unlocker' as const;

	let { class: className = '' }: Props = $props();
	let achievementsDialog: HTMLDialogElement | undefined;
	let isAchievementsDialogOpen = $state(false);
	let isClaimInProgress = $state(false);
	let highlightedAchievementId = $state<string | null>(null);

	const hasClaimedAchievement = $derived(achievementsStore.hasUnlocked(achievementUnlockerId));
	const unlockedAchievements = $derived(achievementsStore.getUnlockedInDisplayOrder());
	const emptyAchievementSlotCount = $derived(
		Math.max(0, ACHIEVEMENT_GRID_CAPACITY - unlockedAchievements.length)
	);
	const emptyAchievementSlots = $derived(
		Array.from({ length: emptyAchievementSlotCount }, (_, index) => index + 1)
	);
	const featuredAchievementId = $derived(
		achievementsStore.lastUnlockedId ?? unlockedAchievements.at(-1) ?? null
	);
	const featuredAchievementName = $derived(
		featuredAchievementId ? achievementsStore.getName(featuredAchievementId) : ''
	);
	const claimButtonLabel = $derived(
		isClaimInProgress
			? 'Claiming...'
			: hasClaimedAchievement
				? 'View My Achievements'
				: 'Claim My Achievement'
	);

	const attachAchievementsDialog: Attachment<HTMLDialogElement> = (dialog) => {
		achievementsDialog = dialog;

		return () => {
			if (achievementsDialog === dialog) {
				achievementsDialog = undefined;
			}
		};
	};

	function openAchievementsDialog(highlightId: string | null = null) {
		if (!achievementsDialog) {
			return;
		}

		if (isAchievementsDialogOpen && achievementsDialog.open) {
			return;
		}

		highlightedAchievementId = highlightId;
		isAchievementsDialogOpen = true;
		achievementsDialog.showModal();
	}

	function closeAchievementsDialog() {
		achievementsDialog?.close();
		isAchievementsDialogOpen = false;
		highlightedAchievementId = null;
	}

	function handleAchievementsDialogClose() {
		isAchievementsDialogOpen = false;
		highlightedAchievementId = null;
	}

	function handleClaimButtonClick() {
		if (isClaimInProgress || isAchievementsDialogOpen) {
			return;
		}

		if (hasClaimedAchievement) {
			openAchievementsDialog();
			return;
		}

		isClaimInProgress = true;

		achievementsStore.unlock(achievementUnlockerId, {
			animate: true,
			onComplete: async () => {
				isClaimInProgress = false;
				await tick();
				openAchievementsDialog(achievementUnlockerId);
			}
		});
	}
</script>

<div class={['achievement-block', className]}>
	<div class="achievement-block__shine" aria-hidden="true"></div>

	<div class="achievement-block__badge" aria-hidden="true">
		<span class="achievement-block__x-mark"></span>
	</div>

	<div class="achievement-block__content">
		<h2>Achievement Unlocked</h2>
		<button
			type="button"
			disabled={isClaimInProgress}
			aria-busy={isClaimInProgress}
			onclick={handleClaimButtonClick}
		>
			{claimButtonLabel}
		</button>
	</div>
</div>

<dialog
	{@attach attachAchievementsDialog}
	class="achievements-dialog"
	aria-labelledby="achievements-dialog-title"
	onclose={handleAchievementsDialogClose}
>
	{#if featuredAchievementId}
		<div class="achievements-dialog__featured-badge" aria-label={featuredAchievementName}>
			<span class="achievements-dialog__badge-icon" aria-hidden="true">
				<span class="achievement-block__x-mark"></span>
			</span>
			<span>{featuredAchievementName}</span>
		</div>
	{/if}

	<div class="achievements-dialog__panel">
		<header class="achievements-dialog__header">
			<div>
				<h2 id="achievements-dialog-title">Achievements</h2>
			</div>

			<button
				class="achievements-dialog__close"
				type="button"
				aria-label="Close achievements dialog"
				onclick={closeAchievementsDialog}
			>
				Close
			</button>
		</header>

		<div class="achievements-dialog__grid" role="list" aria-label="Achievements">
			{#each unlockedAchievements as achievementId (achievementId)}
				{@const achievementName = achievementsStore.getName(achievementId)}
				<div
					class={[
						'achievements-dialog__achievement',
						'achievements-dialog__achievement--unlocked',
						highlightedAchievementId === achievementId && 'achievements-dialog__achievement--new'
					]}
					role="listitem"
					aria-label={achievementName}
				>
					<span class="achievements-dialog__achievement-icon" aria-hidden="true">
						<span class="achievement-block__x-mark"></span>
					</span>
					<span>{achievementName}</span>
				</div>
			{/each}

			{#each emptyAchievementSlots as slotNumber (slotNumber)}
				<div
					class="achievements-dialog__slot"
					role="listitem"
					aria-label={`Empty achievement slot ${slotNumber}`}
				>
					<span aria-hidden="true"></span>
				</div>
			{/each}
		</div>
	</div>
</dialog>

<style>
	.achievement-block {
		position: relative;
		isolation: isolate;
		display: grid;
		min-height: min(16rem, calc(100vw - 2rem));
		min-width: 0;
		grid-template-rows: minmax(0, 1fr) auto;
		overflow: hidden;
		border: 1px solid rgb(111 255 137 / 0.36);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 50% 22%, rgb(126 255 142 / 0.22), transparent 5.5rem),
			linear-gradient(145deg, #08170d 0%, #0d2615 46%, #071008 100%);
		color: #f2fff5;
		padding: clamp(0.85rem, 4vw, 1.05rem);
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.08),
			inset 0 -2rem 3rem rgb(0 0 0 / 0.26),
			0 1rem 2.5rem rgb(0 0 0 / 0.16);
	}

	.achievement-block::before {
		position: absolute;
		inset: 0;
		z-index: -2;
		background-image:
			linear-gradient(90deg, rgb(144 255 159 / 0.08) 1px, transparent 1px),
			linear-gradient(180deg, rgb(144 255 159 / 0.08) 1px, transparent 1px);
		background-size: 1.1rem 1.1rem;
		content: '';
		mask-image: linear-gradient(180deg, black, transparent 86%);
		pointer-events: none;
	}

	.achievement-block::after {
		position: absolute;
		inset: auto 8% -38% 8%;
		z-index: -1;
		height: 64%;
		border-radius: 999px;
		background: rgb(50 201 73 / 0.32);
		content: '';
		filter: blur(2.6rem);
		pointer-events: none;
	}

	.achievement-block__shine {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(115deg, transparent 0 34%, rgb(255 255 255 / 0.14) 43%, transparent 52%),
			radial-gradient(circle at 84% 12%, rgb(171 255 181 / 0.2), transparent 5rem);
		pointer-events: none;
	}

	.achievement-block__badge {
		position: relative;
		align-self: center;
		justify-self: center;
		width: clamp(4.7rem, 34vw, 6.3rem);
		aspect-ratio: 1;
		border: 0.12rem solid rgb(198 255 198 / 0.82);
		border-radius: 999px;
		background:
			radial-gradient(circle at 34% 28%, #f4fff0 0 9%, transparent 10%),
			radial-gradient(circle at 50% 46%, #81ff65 0 24%, #1dc341 45%, #0e7e2b 70%, #053811 100%);
		box-shadow:
			0 0 0 0.55rem rgb(32 255 74 / 0.08),
			0 0 2rem rgb(78 255 87 / 0.58),
			inset 0 0.45rem 0.9rem rgb(255 255 255 / 0.34),
			inset 0 -0.65rem 0.95rem rgb(1 35 10 / 0.52);
	}

	.achievement-block__x-mark {
		position: absolute;
		inset: 28% 25%;
		filter: drop-shadow(0 0 0.45rem rgb(244 255 237 / 0.72));
	}

	.achievement-block__x-mark::before,
	.achievement-block__x-mark::after {
		position: absolute;
		inset: 0 auto auto 50%;
		width: 18%;
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(180deg, #f8fff4, #b9ff9b);
		content: '';
		transform-origin: center;
	}

	.achievement-block__x-mark::before {
		transform: translateX(-50%) rotate(42deg);
	}

	.achievement-block__x-mark::after {
		transform: translateX(-50%) rotate(-42deg);
	}

	.achievement-block__content {
		display: grid;
		gap: 0.85rem;
		align-self: end;
		text-align: center;
	}

	.achievement-block h2 {
		margin: 0;
		font-family: var(--font-pixel), var(--font-sans);
		font-size: clamp(1.28rem, 8.5vw, 1.75rem);
		font-weight: 800;
		line-height: 0.92;
		letter-spacing: -0.03em;
	}

	.achievement-block button {
		justify-self: center;
		max-width: 100%;
		border: 1px solid rgb(187 255 185 / 0.54);
		border-radius: 999px;
		background: linear-gradient(180deg, rgb(141 255 128 / 0.96), rgb(44 183 59 / 0.96)), #31c83f;
		color: #031707;
		cursor: pointer;
		font: inherit;
		font-size: clamp(0.78rem, 3.7vw, 0.92rem);
		font-weight: 900;
		line-height: 1;
		padding: 0.65rem 0.86rem;
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.58),
			0 0.35rem 1rem rgb(58 255 81 / 0.22);
		transition:
			transform 160ms ease,
			filter 160ms ease,
			box-shadow 160ms ease;
	}

	.achievement-block button:hover,
	.achievement-block button:focus-visible {
		filter: brightness(1.06) saturate(1.08);
		transform: translateY(-0.08rem);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.68),
			0 0.55rem 1.35rem rgb(58 255 81 / 0.32);
	}

	.achievement-block button:focus-visible {
		outline: 0.18rem solid rgb(239 255 234 / 0.9);
		outline-offset: 0.16rem;
	}

	.achievement-block button:disabled {
		cursor: progress;
		filter: saturate(0.9);
		opacity: 0.86;
		transform: none;
	}

	.achievements-dialog {
		position: fixed;
		inset: 0;
		width: min(34rem, calc(100vw - 2rem));
		max-height: min(42rem, calc(100vh - 2rem));
		margin: auto;
		overflow: visible;
		border: 1px solid rgb(141 255 159 / 0.48);
		border-radius: 1.7rem;
		background:
			radial-gradient(circle at 50% 0%, rgb(109 255 126 / 0.23), transparent 11rem),
			linear-gradient(145deg, #061108 0%, #0c2011 54%, #030704 100%);
		color: #f2fff5;
		padding: 0;
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.08),
			inset 0 -2rem 3.2rem rgb(0 0 0 / 0.36),
			0 1.5rem 4rem rgb(0 0 0 / 0.56),
			0 0 3rem rgb(70 255 87 / 0.24);
	}

	.achievements-dialog::backdrop {
		background:
			radial-gradient(circle at 50% 34%, rgb(64 255 79 / 0.22), transparent 24rem),
			rgb(0 0 0 / 0.72);
		backdrop-filter: blur(0.35rem);
	}

	.achievements-dialog__featured-badge {
		position: absolute;
		inset: -3.5rem auto auto 50%;
		z-index: 2;
		display: grid;
		width: min(13.5rem, calc(100% - 2rem));
		justify-items: center;
		gap: 0.45rem;
		border: 1px solid rgb(202 255 196 / 0.72);
		border-radius: 1.25rem;
		background:
			radial-gradient(circle at 50% 24%, rgb(255 255 255 / 0.2), transparent 4.3rem),
			linear-gradient(180deg, rgb(39 148 50 / 0.96), rgb(6 52 15 / 0.98));
		color: #f4fff0;
		font-family: var(--font-pixel), var(--font-sans);
		font-size: clamp(1rem, 4.5vw, 1.2rem);
		font-weight: 800;
		line-height: 0.95;
		padding: 0.75rem 1rem 0.8rem;
		text-align: center;
		box-shadow:
			0 0 0 0.55rem rgb(53 255 75 / 0.09),
			0 0 2.3rem rgb(82 255 91 / 0.64),
			inset 0 1px 0 rgb(255 255 255 / 0.42);
		transform: translateX(-50%);
	}

	.achievements-dialog__badge-icon,
	.achievements-dialog__achievement-icon {
		position: relative;
		display: block;
		aspect-ratio: 1;
		border: 0.1rem solid rgb(216 255 207 / 0.82);
		border-radius: 999px;
		background:
			radial-gradient(circle at 34% 28%, #f4fff0 0 9%, transparent 10%),
			radial-gradient(circle at 50% 46%, #81ff65 0 24%, #1dc341 45%, #0e7e2b 70%, #053811 100%);
		box-shadow:
			0 0 1.35rem rgb(78 255 87 / 0.62),
			inset 0 0.32rem 0.64rem rgb(255 255 255 / 0.34),
			inset 0 -0.42rem 0.72rem rgb(1 35 10 / 0.52);
	}

	.achievements-dialog__badge-icon {
		width: 3.1rem;
	}

	.achievements-dialog__achievement-icon {
		width: 2.3rem;
	}

	.achievements-dialog__panel {
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 1.25rem;
		max-height: min(42rem, calc(100vh - 2rem));
		overflow: auto;
		border-radius: inherit;
		padding: 4.9rem clamp(1rem, 4.5vw, 1.35rem) clamp(1rem, 4.5vw, 1.35rem);
	}

	.achievements-dialog__panel::before {
		position: absolute;
		inset: 0;
		z-index: -1;
		background-image:
			linear-gradient(90deg, rgb(144 255 159 / 0.07) 1px, transparent 1px),
			linear-gradient(180deg, rgb(144 255 159 / 0.07) 1px, transparent 1px);
		background-size: 1rem 1rem;
		content: '';
		mask-image: linear-gradient(180deg, black, transparent 78%);
		pointer-events: none;
	}

	.achievements-dialog__header {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 1rem;
	}

	.achievements-dialog h2 {
		margin: 0;
		font-family: var(--font-pixel), var(--font-sans);
		font-size: clamp(1.65rem, 7vw, 2.35rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.04em;
	}

	.achievements-dialog__close {
		flex: 0 0 auto;
		border: 1px solid rgb(191 255 190 / 0.5);
		border-radius: 999px;
		background: rgb(8 28 12 / 0.82);
		color: #eaffea;
		cursor: pointer;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 850;
		line-height: 1;
		padding: 0.62rem 0.78rem;
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.16),
			0 0.4rem 1rem rgb(0 0 0 / 0.28);
		transition:
			background 160ms ease,
			transform 160ms ease;
	}

	.achievements-dialog__close:hover,
	.achievements-dialog__close:focus-visible {
		background: rgb(22 74 31 / 0.9);
		transform: translateY(-0.05rem);
	}

	.achievements-dialog__close:focus-visible {
		outline: 0.18rem solid rgb(239 255 234 / 0.9);
		outline-offset: 0.16rem;
	}

	.achievements-dialog__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(5.6rem, 1fr));
		gap: 0.7rem;
	}

	.achievements-dialog__achievement,
	.achievements-dialog__slot {
		min-height: 6.7rem;
		border: 1px solid rgb(133 255 149 / 0.28);
		border-radius: 1rem;
		background:
			radial-gradient(circle at 50% 18%, rgb(96 255 116 / 0.12), transparent 4.4rem),
			rgb(3 17 7 / 0.74);
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.04),
			inset 0 -1.3rem 1.7rem rgb(0 0 0 / 0.2);
	}

	.achievements-dialog__achievement {
		display: grid;
		align-content: center;
		justify-items: center;
		gap: 0.48rem;
		color: #f4fff0;
		font-size: 0.72rem;
		font-weight: 900;
		line-height: 1.08;
		text-align: center;
	}

	.achievements-dialog__achievement--unlocked {
		border-color: rgb(192 255 188 / 0.7);
		background:
			radial-gradient(circle at 50% 20%, rgb(126 255 142 / 0.26), transparent 4.6rem),
			linear-gradient(180deg, rgb(20 74 29 / 0.92), rgb(4 28 10 / 0.94));
		box-shadow:
			0 0 1.5rem rgb(73 255 88 / 0.22),
			inset 0 0 0 1px rgb(255 255 255 / 0.12),
			inset 0 -1.4rem 1.8rem rgb(0 0 0 / 0.24);
	}

	.achievements-dialog[open] .achievements-dialog__achievement--new {
		animation: achievements-dialog-new-achievement 720ms cubic-bezier(0.18, 0.9, 0.22, 1.18) both;
	}

	.achievements-dialog__slot {
		display: grid;
		place-items: center;
		opacity: 0.74;
	}

	.achievements-dialog__slot span {
		width: 2.25rem;
		aspect-ratio: 1;
		border: 1px dashed rgb(171 255 181 / 0.3);
		border-radius: 999px;
		background: rgb(166 255 175 / 0.05);
		box-shadow: inset 0 0 1rem rgb(0 0 0 / 0.36);
	}

	@media (min-width: 48rem) {
		.achievement-block {
			height: 100%;
			min-height: 100%;
			padding: clamp(0.72rem, 1.3vw, 0.95rem);
		}

		.achievement-block__badge {
			width: clamp(4.1rem, 7vw, 5.4rem);
		}

		.achievement-block h2 {
			font-size: clamp(1.12rem, 2.15vw, 1.48rem);
		}

		.achievement-block button {
			font-size: clamp(0.7rem, 1.15vw, 0.84rem);
			padding: 0.58rem 0.7rem;
		}

		.achievements-dialog__grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@keyframes achievements-dialog-new-achievement {
		0% {
			opacity: 0;
			transform: translateY(0.7rem) scale(0.82);
		}

		68% {
			opacity: 1;
			transform: translateY(-0.08rem) scale(1.04);
		}

		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.achievement-block button,
		.achievements-dialog__close,
		.achievements-dialog[open] .achievements-dialog__achievement--new {
			animation: none;
			transition: none;
		}
	}
</style>
