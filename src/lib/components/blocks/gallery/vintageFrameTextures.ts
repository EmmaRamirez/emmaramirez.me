import goldFrameUrl from '$lib/images/gallery/frames/gold-realistic.png';
import ornateBorderUrl from '$lib/images/gallery/frames/ornate-border.png';
import floralOrnateUrl from '$lib/images/gallery/frames/floral-ornate.png';

export type VintageFrameStyle = 'gilded' | 'rosewood' | 'silver';

type FrameInsets = {
	top: number;
	right: number;
	bottom: number;
	left: number;
};

type FrameAsset = {
	src: string;
	insets: FrameInsets;
	shape: 'rect' | 'oval';
	matColor: string;
};

export const vintageFrameAssets: Record<VintageFrameStyle, FrameAsset> = {
	gilded: {
		src: goldFrameUrl,
		insets: { top: 0.11, right: 0.11, bottom: 0.11, left: 0.11 },
		shape: 'oval',
		matColor: '#f0e6d0'
	},
	rosewood: {
		src: ornateBorderUrl,
		insets: { top: 0.17, right: 0.26, bottom: 0.17, left: 0.17 },
		shape: 'rect',
		matColor: '#ebe2d4'
	},
	silver: {
		src: floralOrnateUrl,
		insets: { top: 0.13, right: 0.13, bottom: 0.13, left: 0.13 },
		shape: 'rect',
		matColor: '#f4f6fa'
	}
};

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error(`Failed to load frame image: ${src}`));
		image.src = src;
	});
}

export async function preloadVintageFrameImages(): Promise<Record<VintageFrameStyle, HTMLImageElement>> {
	const entries = await Promise.all(
		(Object.entries(vintageFrameAssets) as [VintageFrameStyle, FrameAsset][]).map(
			async ([style, asset]) => [style, await loadImage(asset.src)] as const
		)
	);

	return Object.fromEntries(entries) as Record<VintageFrameStyle, HTMLImageElement>;
}

function drawCoverFit(
	context: CanvasRenderingContext2D,
	source: HTMLCanvasElement,
	x: number,
	y: number,
	width: number,
	height: number
) {
	const sourceAspect = source.width / source.height;
	const targetAspect = width / height;

	let sx = 0;
	let sy = 0;
	let sw = source.width;
	let sh = source.height;

	if (sourceAspect > targetAspect) {
		sw = source.height * targetAspect;
		sx = (source.width - sw) / 2;
	} else {
		sh = source.width / targetAspect;
		sy = (source.height - sh) / 2;
	}

	context.drawImage(source, sx, sy, sw, sh, x, y, width, height);
}

export function composeVintageFramedArt(
	frameImage: HTMLImageElement,
	artCanvas: HTMLCanvasElement,
	asset: FrameAsset
): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = frameImage.naturalWidth;
	canvas.height = frameImage.naturalHeight;

	const context = canvas.getContext('2d');
	if (!context) return canvas;

	const width = canvas.width;
	const height = canvas.height;
	const innerX = width * asset.insets.left;
	const innerY = height * asset.insets.top;
	const innerWidth = width * (1 - asset.insets.left - asset.insets.right);
	const innerHeight = height * (1 - asset.insets.top - asset.insets.bottom);
	const matPadding = Math.min(innerWidth, innerHeight) * 0.045;
	const artPadding = matPadding * 1.35;

	context.save();

	if (asset.shape === 'oval') {
		context.beginPath();
		context.ellipse(
			innerX + innerWidth / 2,
			innerY + innerHeight / 2,
			Math.max(innerWidth / 2 - matPadding, 1),
			Math.max(innerHeight / 2 - matPadding, 1),
			0,
			0,
			Math.PI * 2
		);
	} else {
		context.beginPath();
		context.rect(
			innerX + matPadding,
			innerY + matPadding,
			Math.max(innerWidth - matPadding * 2, 1),
			Math.max(innerHeight - matPadding * 2, 1)
		);
	}

	context.clip();
	context.fillStyle = asset.matColor;
	context.fillRect(innerX, innerY, innerWidth, innerHeight);

	drawCoverFit(
		context,
		artCanvas,
		innerX + artPadding,
		innerY + artPadding,
		Math.max(innerWidth - artPadding * 2, 1),
		Math.max(innerHeight - artPadding * 2, 1)
	);
	context.restore();

	context.drawImage(frameImage, 0, 0, width, height);

	return canvas;
}
