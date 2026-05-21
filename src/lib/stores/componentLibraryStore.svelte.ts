export type LayoutRect = {
	top: number;
	left: number;
	width: number;
	height: number;
};

function toLayoutRect(rect: DOMRect): LayoutRect {
	return {
		top: rect.top,
		left: rect.left,
		width: rect.width,
		height: rect.height
	};
}

function getInitialGridRect(grid: Element): LayoutRect {
	const gridRect = grid.getBoundingClientRect();
	const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
	const top = Math.max(gridRect.top, headerBottom);

	return {
		top,
		left: gridRect.left,
		width: gridRect.width,
		height: Math.max(0, gridRect.bottom - top)
	};
}

class ComponentLibraryStore {
	isOpen = $state(false);
	isClosing = $state(false);
	activeBlockId = $state<string | null>(null);
	originRect = $state<LayoutRect | null>(null);
	gridRect = $state<LayoutRect | null>(null);
	originElement = $state<HTMLElement | null>(null);

	open(blockId: string, originEl: HTMLElement) {
		if (this.isOpen) {
			return;
		}

		const grid = document.querySelector('.home-grid');
		if (!grid) {
			return;
		}

		this.activeBlockId = blockId;
		this.originElement = originEl;
		this.originRect = toLayoutRect(originEl.getBoundingClientRect());
		this.gridRect = getInitialGridRect(grid);
		this.isClosing = false;
		this.isOpen = true;
	}

	requestClose() {
		if (!this.isOpen || this.isClosing) {
			return;
		}

		this.isClosing = true;
	}

	finishClose() {
		this.isOpen = false;
		this.isClosing = false;
		this.activeBlockId = null;
		this.originElement = null;
		this.originRect = null;
		this.gridRect = null;
	}

	getOriginRect() {
		if (this.originElement) {
			return toLayoutRect(this.originElement.getBoundingClientRect());
		}

		return this.originRect;
	}
}

export const componentLibraryStore = new ComponentLibraryStore();
