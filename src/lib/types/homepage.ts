export type HomepageBlockKind =
	| 'achievement'
	| 'disco'
	| 'doodle'
	| 'component-library'
	| 'empty'
	| 'gallery'
	| 'home'
	| 'houston'
	| 'pokemon'
	| 'redesigning-article'
	| 'spacer'
	| 'sticker'
	| 'three-moats-article'
	| 'changelog'
	| 'welcome-internet';

export type HomepageGridColumnSpan = 1 | 2 | 3 | 4;
export type HomepageGridRowSpan = 1 | 2 | 4;
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

export interface HomepageComponentLibraryBlock extends HomepageBaseBlock {
	kind: 'component-library';
	settings: HomepageBlockSettings & {
		ariaLabel: string;
		backgroundColor: string;
	};
}

export type HomepageBlock =
	| HomepageDiscoBlock
	| HomepageComponentLibraryBlock
	| (HomepageBaseBlock & {
			kind: Exclude<HomepageBlockKind, 'component-library' | 'disco'>;
	  });
