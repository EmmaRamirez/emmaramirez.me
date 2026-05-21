import { browser } from '$app/environment';
import {
	ACHIEVEMENT_IDS,
	type AchievementId,
	getAchievementName
} from '$lib/types/achievements';

const STORAGE_KEY = 'emzinnia:achievements';
const STORED_STATE_VERSION = 1;

type StoredState = {
	version: typeof STORED_STATE_VERSION;
	unlocked: AchievementId[];
};

type ActiveInterlude = {
	id: AchievementId;
	key: number;
	onComplete?: () => void;
};

type UnlockOptions = {
	animate?: boolean;
	animateIfPriorUnlocks?: boolean;
	onComplete?: () => void;
};

function isAchievementId(value: string): value is AchievementId {
	return ACHIEVEMENT_IDS.includes(value as AchievementId);
}

function isStoredState(value: unknown): value is StoredState {
	if (!value || typeof value !== 'object') return false;

	const candidate = value as Record<string, unknown>;
	return (
		candidate.version === STORED_STATE_VERSION &&
		Array.isArray(candidate.unlocked) &&
		candidate.unlocked.every((id) => typeof id === 'string' && isAchievementId(id))
	);
}

class AchievementsStore {
	unlockedIds = $state<Set<AchievementId>>(new Set());
	lastUnlockedId = $state<AchievementId | null>(null);
	activeInterlude = $state<ActiveInterlude | null>(null);
	initialized = false;

	private interludeKey = 0;

	init() {
		if (!browser || this.initialized) return;

		this.initialized = true;

		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;

			const parsed = JSON.parse(raw) as unknown;
			if (!isStoredState(parsed)) return;

			this.unlockedIds = new Set(parsed.unlocked);
		} catch {
			// Ignore stale achievement data.
		}
	}

	hasUnlocked(id: AchievementId): boolean {
		return this.unlockedIds.has(id);
	}

	hasAnyUnlocked(): boolean {
		return this.unlockedIds.size > 0;
	}

	getUnlockedInDisplayOrder(): AchievementId[] {
		return ACHIEVEMENT_IDS.filter((id) => this.unlockedIds.has(id));
	}

	getName(id: AchievementId): string {
		return getAchievementName(id);
	}

	private prefersReducedMotion() {
		return (
			browser &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	unlock(id: AchievementId, options: UnlockOptions = {}) {
		if (this.hasUnlocked(id)) return;

		const hadPriorUnlocks = this.hasAnyUnlocked();
		const nextUnlocked = new Set(this.unlockedIds);
		nextUnlocked.add(id);
		this.unlockedIds = nextUnlocked;
		this.lastUnlockedId = id;
		this.persist();

		const shouldAnimate =
			!this.prefersReducedMotion() &&
			(options.animate === true || (options.animateIfPriorUnlocks === true && hadPriorUnlocks));

		if (shouldAnimate) {
			this.interludeKey += 1;
			this.activeInterlude = {
				id,
				key: this.interludeKey,
				onComplete: options.onComplete
			};
			return;
		}

		options.onComplete?.();
	}

	finishInterlude() {
		const onComplete = this.activeInterlude?.onComplete;
		this.activeInterlude = null;
		onComplete?.();
	}

	persist() {
		if (!browser) return;

		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				version: STORED_STATE_VERSION,
				unlocked: this.getUnlockedInDisplayOrder()
			} satisfies StoredState)
		);
	}
}

export const achievementsStore = new AchievementsStore();
