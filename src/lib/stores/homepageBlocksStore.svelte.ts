import { browser } from '$app/environment';
import { homepageBlocks } from '$lib/registry/homepage';
import { sortHomepageBlocksInDisplayOrder } from '$lib/registry/homepageBlockMeta';
import type { HomepageBlock } from '$lib/types/homepage';

const STORAGE_KEY = 'emzinnia:homepage-block-visibility';
const STORED_STATE_VERSION = 1;

type StoredState = {
	version: typeof STORED_STATE_VERSION;
	hidden: string[];
};

function isStoredState(value: unknown): value is StoredState {
	if (!value || typeof value !== 'object') return false;

	const candidate = value as Record<string, unknown>;
	return (
		candidate.version === STORED_STATE_VERSION &&
		Array.isArray(candidate.hidden) &&
		candidate.hidden.every((id) => typeof id === 'string')
	);
}

class HomepageBlocksStore {
	hiddenIds = $state<Set<string>>(new Set());
	initialized = false;

	init() {
		if (!browser || this.initialized) return;

		this.initialized = true;

		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;

			const parsed = JSON.parse(raw) as unknown;
			if (!isStoredState(parsed)) return;

			const knownIds = new Set(homepageBlocks.map((block) => block.id));
			this.hiddenIds = new Set(parsed.hidden.filter((id) => knownIds.has(id)));
		} catch {
			// Ignore stale visibility data.
		}
	}

	isVisible(blockId: string): boolean {
		return !this.hiddenIds.has(blockId);
	}

	setVisible(blockId: string, visible: boolean) {
		const nextHidden = new Set(this.hiddenIds);

		if (visible) {
			nextHidden.delete(blockId);
		} else {
			nextHidden.add(blockId);
		}

		this.hiddenIds = nextHidden;
		this.persist();
	}

	toggle(blockId: string) {
		this.setVisible(blockId, !this.isVisible(blockId));
	}

	getBlocksInDisplayOrder(): HomepageBlock[] {
		return sortHomepageBlocksInDisplayOrder(homepageBlocks);
	}

	getVisibleBlocks(): HomepageBlock[] {
		return this.getBlocksInDisplayOrder().filter((block) => this.isVisible(block.id));
	}

	persist() {
		if (!browser) return;

		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				version: STORED_STATE_VERSION,
				hidden: [...this.hiddenIds]
			} satisfies StoredState)
		);
	}
}

export const homepageBlocksStore = new HomepageBlocksStore();
