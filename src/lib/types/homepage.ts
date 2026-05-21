export type HomepageBlockKind =
	| 'achievement'
	| 'disco'
	| 'doodle'
	| 'decorative'
	| 'empty'
	| 'gallery'
	| 'home'
	| 'houston'
	| 'pokemon'
	| 'redesigning-article'
	| 'sticker'
	| 'three-moats-article'
	| 'wide-background'
	| 'welcome-internet';

export type HomepageGridColumnSpan = 1 | 2 | 3 | 4;
export type HomepageGridRowSpan = 1 | 2;
export type HomepageGridLine = 'auto' | number;

export interface HomepageBlockPlacement {
	columnSpan: HomepageGridColumnSpan;
	rowSpan: HomepageGridRowSpan;
	columnStart?: HomepageGridLine;
	rowStart?: HomepageGridLine;
}

export interface HomepageBlockLayout {
	mobileMinHeight?: string;
	desktop: HomepageBlockPlacement;
	minHeight?: string;
	overflow?: 'hidden' | 'visible';
}

export interface HomepageBlockSettings {
	ariaLabel?: string;
	className?: string;
	contentClassName?: string;
	decorative?: boolean;
	labelledBy?: string;
}

interface HomepageBaseBlock {
	id: string;
	kind: HomepageBlockKind;
	layout: HomepageBlockLayout;
	settings?: HomepageBlockSettings;
}

export interface HomepageDiscoBlock extends HomepageBaseBlock {
	kind: 'disco';
	settings: HomepageBlockSettings & {
		alt: string;
		caption: string;
		image: string;
	};
}

export interface HomepageDecorativeBlock extends HomepageBaseBlock {
	kind: 'decorative';
	settings: HomepageBlockSettings & {
		backgroundColor: string;
		decorative: true;
	};
}

export type HomepageBlock =
	| HomepageDiscoBlock
	| HomepageDecorativeBlock
	| (HomepageBaseBlock & {
			kind: Exclude<HomepageBlockKind, 'decorative' | 'disco'>;
	  });
