import { browser } from '$app/environment';
import { achievementsStore } from '$lib/stores/achievementsStore.svelte';
import type { AchievementId } from '$lib/types/achievements';

export type StickerId = string;

export type StickerDefinition = {
	id: StickerId;
	label: string;
	image: string;
	rotation: number;
	scale: number;
	trayX: number;
	trayY: number;
	trayZIndex: number;
};

export type StickerPlacement = {
	id: StickerId;
	x: number;
	y: number;
	zIndex: number;
	scale: number;
};

type StoredStickerPlacement = {
	x: number;
	y: number;
	scale?: number;
	zIndex?: number;
};

type StoredStickerState = {
	version: typeof STORED_STATE_VERSION;
	placements: Partial<Record<StickerId, StoredStickerPlacement>>;
};

type DragState = {
	id: StickerId;
	offsetX: number;
	offsetY: number;
	width: number;
	height: number;
	isNewPlacement: boolean;
};

type ResizeState = {
	id: StickerId;
	startPointerX: number;
	startPointerY: number;
	startWidth: number;
	baseWidth: number;
};

const STORAGE_KEY = 'emzinnia:stickers';
const DEFAULT_Z_INDEX = 20;
const STORED_STATE_VERSION = 4;

const LOCKED_STICKER_SOURCES: Partial<Record<string, AchievementId>> = {
	'pokemon-professor': 'pokemon-professor'
};
const STICKER_SCALES = [1, 1.33, 1.66, 2] as const;
const MIN_PLACED_SCALE = 0.5;
const MAX_PLACED_SCALE = 4;

const stickerImageModules = import.meta.glob<string>(
	'../images/stickers/*.{png,jpg,jpeg,webp,gif,svg}',
	{
		eager: true,
		import: 'default',
		query: '?url'
	}
);

function getStickerId(path: string) {
	const filename = path.split('/').at(-1) ?? path;
	return filename.replace(/\.[^.]+$/, '');
}

function getStickerLabel(id: string, scale: number) {
	const label = id
		.replace(/[-_]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/\b\w/g, (letter) => letter.toUpperCase());

	return `${label || 'Sticker'} sticker ${scale}x`;
}

function getStickerHash(id: string, salt: string) {
	let hash = 0;
	for (const character of `${id}:${salt}`) {
		hash = (hash * 31 + character.charCodeAt(0)) % 100_000;
	}

	return hash / 99_999;
}

function getStickerNumber(id: string, salt: string, min: number, max: number) {
	return min + (max - min) * getStickerHash(id, salt);
}

function getStickerRotation(id: string) {
	return Math.round(getStickerNumber(id, 'rotation', -24, 24));
}

function getStickerSourceId(id: string) {
	return id.replace(/-\d+$/, '');
}

function isStickerSourceUnlocked(sourceId: string) {
	const requiredAchievement = LOCKED_STICKER_SOURCES[sourceId];
	if (!requiredAchievement) return true;

	return achievementsStore.hasUnlocked(requiredAchievement);
}

function createSeededRandom(seed: string) {
	let state = 0;
	for (const character of seed) {
		state = (state * 31 + character.charCodeAt(0)) >>> 0;
	}

	return () => {
		state = (state * 1_664_525 + 1_013_904_223) >>> 0;
		return state / 0x1_0000_0000;
	};
}

function shuffleWithSeed<T>(items: T[], seed: string) {
	const shuffled = [...items];
	const random = createSeededRandom(seed);

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}

	return shuffled;
}

function spreadStickersBySource<T extends { id: string }>(stickers: T[]) {
	const groups = new Map<string, T[]>();

	for (const sticker of stickers) {
		const sourceId = getStickerSourceId(sticker.id);
		const group = groups.get(sourceId) ?? [];
		group.push(sticker);
		groups.set(sourceId, group);
	}

	for (const group of groups.values()) {
		group.sort((a, b) => a.id.localeCompare(b.id));
	}

	const sources = [...groups.keys()].sort((a, b) => a.localeCompare(b));
	const spread: T[] = [];

	while (spread.length < stickers.length) {
		for (const sourceId of sources) {
			const group = groups.get(sourceId);
			const next = group?.shift();
			if (next) spread.push(next);
		}
	}

	return spread;
}

function buildTraySlots(count: number) {
	const columns = Math.ceil(Math.sqrt(count));
	const rows = Math.ceil(count / columns);
	const slots: Array<{ x: number; y: number }> = [];

	for (let row = 0; row < rows; row += 1) {
		for (let column = 0; column < columns; column += 1) {
			if (slots.length >= count) break;

			const slotIndex = slots.length;
			const random = createSeededRandom(`tray-slot-${slotIndex}`);
			const cellWidth = 100 / columns;
			const cellHeight = 100 / rows;
			const jitterX = (random() - 0.5) * cellWidth * 0.42;
			const jitterY = (random() - 0.5) * cellHeight * 0.42;

			slots.push({
				x: (column + 0.5) * cellWidth + jitterX,
				y: (row + 0.5) * cellHeight + jitterY
			});
		}
	}

	return slots;
}

function assignTrayLayout<T extends { id: string; rotation: number }>(stickers: T[]) {
	const spread = spreadStickersBySource(stickers);
	const shuffledSlots = shuffleWithSeed(buildTraySlots(spread.length), 'emzinnia-tray-shuffle');

	return spread.map((sticker, index) => ({
		...sticker,
		trayX: shuffledSlots[index].x,
		trayY: shuffledSlots[index].y,
		trayZIndex: index + 1
	}));
}

const baseStickerDefinitions = Object.entries(stickerImageModules)
	.flatMap(([path, image]) => {
		const sourceId = getStickerId(path);
		return STICKER_SCALES.map((scale, index) => {
			const id = `${sourceId}-${index + 1}`;
			return {
				id,
				label: getStickerLabel(sourceId, scale),
				image,
				rotation: getStickerRotation(id),
				scale
			};
		});
	})
	.sort((a, b) => a.id.localeCompare(b.id));

const stickerDefinitions: StickerDefinition[] = assignTrayLayout(baseStickerDefinitions);

function isStickerId(value: string): value is StickerId {
	return stickerDefinitions.some((sticker) => sticker.id === value);
}

function isStoredPlacement(value: unknown): value is StoredStickerPlacement {
	if (!value || typeof value !== 'object') return false;

	const candidate = value as Record<string, unknown>;
	return (
		typeof candidate.x === 'number' &&
		Number.isFinite(candidate.x) &&
		typeof candidate.y === 'number' &&
		Number.isFinite(candidate.y) &&
		(candidate.scale === undefined ||
			(typeof candidate.scale === 'number' && Number.isFinite(candidate.scale))) &&
		(candidate.zIndex === undefined ||
			(typeof candidate.zIndex === 'number' && Number.isFinite(candidate.zIndex)))
	);
}

function clampToViewport(value: number, max: number) {
	return Math.max(0, Math.min(value, Math.max(0, max)));
}

function clampScale(value: number) {
	return Math.max(MIN_PLACED_SCALE, Math.min(value, MAX_PLACED_SCALE));
}

class StickerBoard {
	stickers = stickerDefinitions;
	placements = $state<Partial<Record<StickerId, StickerPlacement>>>({});
	activeDrag = $state<DragState | null>(null);
	activeResize = $state<ResizeState | null>(null);
	nextZIndex = $state(DEFAULT_Z_INDEX);
	initialized = false;

	getSticker(id: StickerId) {
		return this.stickers.find((sticker) => sticker.id === id) ?? null;
	}

	init() {
		if (!browser || this.initialized) return;

		this.initialized = true;

		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;

			const parsed = JSON.parse(raw) as Partial<StoredStickerState>;
			if (parsed.version !== STORED_STATE_VERSION || !parsed.placements) return;

			for (const [id, placement] of Object.entries(parsed.placements)) {
				if (!isStickerId(id) || !isStoredPlacement(placement)) continue;

				const zIndex = placement.zIndex ?? DEFAULT_Z_INDEX;
				this.placements[id] = {
					id,
					x: placement.x,
					y: placement.y,
					zIndex,
					scale: clampScale(placement.scale ?? this.getSticker(id)?.scale ?? 1)
				};
				this.nextZIndex = Math.max(this.nextZIndex, zIndex + 1);
			}
		} catch {
			// Ignore stale sticker data from earlier experiments.
		}
	}

	getPlacement(id: StickerId) {
		return this.placements[id] ?? null;
	}

	getPlacedStickers() {
		return this.stickers
			.map((sticker) => {
				const placement = this.placements[sticker.id];
				return placement ? { sticker, placement } : null;
			})
			.filter((item) => item !== null);
	}

	getTrayStickers() {
		return this.stickers.filter(
			(sticker) =>
				!this.placements[sticker.id] &&
				isStickerSourceUnlocked(getStickerSourceId(sticker.id))
		);
	}

	clearPlacedStickers() {
		this.placements = {};
		this.activeDrag = null;
		this.activeResize = null;
		this.persist();
	}

	startDrag(id: StickerId, rect: DOMRect, pointerX: number, pointerY: number) {
		const isNewPlacement = !this.placements[id];
		const sticker = this.getSticker(id);
		const placement = this.placements[id] ?? {
			id,
			x: rect.left,
			y: rect.top,
			zIndex: this.nextZIndex,
			scale: sticker?.scale ?? 1
		};

		placement.zIndex = this.nextZIndex++;
		this.placements[id] = placement;
		this.activeResize = null;
		this.activeDrag = {
			id,
			offsetX: pointerX - placement.x,
			offsetY: pointerY - placement.y,
			width: rect.width,
			height: rect.height,
			isNewPlacement
		};
		this.moveDrag(pointerX, pointerY);
	}

	startResize(id: StickerId, rect: DOMRect, pointerX: number, pointerY: number) {
		const placement = this.placements[id];
		if (!placement) return;

		placement.zIndex = this.nextZIndex++;
		this.activeDrag = null;
		this.activeResize = {
			id,
			startPointerX: pointerX,
			startPointerY: pointerY,
			startWidth: rect.width,
			baseWidth: rect.width / placement.scale
		};
	}

	moveDrag(pointerX: number, pointerY: number) {
		if (!this.activeDrag || !browser) return;

		const placement = this.placements[this.activeDrag.id];
		if (!placement) return;

		placement.x = clampToViewport(
			pointerX - this.activeDrag.offsetX,
			window.innerWidth - this.activeDrag.width
		);
		placement.y = clampToViewport(
			pointerY - this.activeDrag.offsetY,
			window.innerHeight - this.activeDrag.height
		);
		this.persist();
	}

	moveResize(pointerX: number, pointerY: number) {
		if (!this.activeResize) return;

		const placement = this.placements[this.activeResize.id];
		if (!placement) return;

		const widthDelta = pointerX - this.activeResize.startPointerX;
		const heightDelta = pointerY - this.activeResize.startPointerY;
		const nextWidth = Math.max(
			this.activeResize.startWidth + Math.max(widthDelta, heightDelta),
			this.activeResize.baseWidth * MIN_PLACED_SCALE
		);

		placement.scale = clampScale(nextWidth / this.activeResize.baseWidth);
		this.persist();
	}

	endDrag() {
		if (!this.activeDrag) return;

		if (this.activeDrag.isNewPlacement) {
			achievementsStore.unlock('sticky-icky', {
				animateIfPriorUnlocks: true
			});
		}

		this.activeDrag = null;
		this.persist();
	}

	endResize() {
		if (!this.activeResize) return;

		this.activeResize = null;
		this.persist();
	}

	persist() {
		if (!browser) return;

		const placements: StoredStickerState['placements'] = {};
		for (const [id, placement] of Object.entries(this.placements)) {
			if (!isStickerId(id) || !placement) continue;

			placements[id] = {
				x: Math.round(placement.x),
				y: Math.round(placement.y),
				scale: Number(placement.scale.toFixed(3)),
				zIndex: placement.zIndex
			};
		}

		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				version: STORED_STATE_VERSION,
				placements
			} satisfies StoredStickerState)
		);
	}
}

export const stickerBoard = new StickerBoard();
