import discoImage from '$lib/images/photos/disco.jpeg';
import type { HomepageBlock } from '$lib/types/homepage';

export const homepageBlocks: HomepageBlock[] = [
	{
		id: 'welcome-internet',
		kind: 'welcome-internet',
		layout: {
			desktop: {
				columnStart: 1,
				columnSpan: 4,
				rowStart: 1,
				rowSpan: 1
			}
		},
		settings: {
			labelledBy: 'welcome-internet-heading'
		}
	},
	{
		id: 'home',
		kind: 'home',
		layout: {
			desktop: {
				columnStart: 1,
				columnSpan: 1,
				rowStart: 2,
				rowSpan: 1
			},
			minHeight: '100%',
			mobileMinHeight: 'min(500px, calc(100vw - 2rem))'
		},
		settings: {
			ariaLabel: 'Home location'
		}
	},
	{
		id: 'redesigning-article',
		kind: 'redesigning-article',
		layout: {
			desktop: {
				columnStart: 2,
				columnSpan: 3,
				rowStart: 2,
				rowSpan: 1
			}
		}
	},
	{
		id: 'disco',
		kind: 'disco',
		layout: {
			desktop: {
				columnStart: 1,
				columnSpan: 1,
				rowStart: 3,
				rowSpan: 1
			},
			overflow: 'visible'
		},
		settings: {
			alt: 'Disco ball',
			ariaLabel: 'Disco area',
			caption: 'DISCO',
			image: discoImage
		}
	},
	{
		id: 'disco-empty',
		kind: 'empty',
		layout: {
			desktop: {
				columnStart: 1,
				columnSpan: 1,
				rowStart: 4,
				rowSpan: 1
			},
			minHeight: '100%',
			mobileMinHeight: 'min(16rem, calc(100vw - 2rem))'
		},
		settings: {
			className: 'home-grid__block--empty',
			decorative: true
		}
	},
	{
		id: 'pokemon',
		kind: 'pokemon',
		layout: {
			desktop: {
				columnStart: 2,
				columnSpan: 2,
				rowStart: 3,
				rowSpan: 1
			}
		},
		settings: {
			ariaLabel: 'Pokemon team'
		}
	},
	{
		id: 'subgrid',
		kind: 'subgrid',
		layout: {
			desktop: {
				columnStart: 4,
				columnSpan: 1,
				rowStart: 3,
				rowSpan: 1
			}
		},
		settings: {
			ariaLabel: 'Two little rooms'
		}
	},
	{
		id: 'houston',
		kind: 'houston',
		layout: {
			desktop: {
				columnStart: 2,
				columnSpan: 1,
				rowStart: 4,
				rowSpan: 1
			}
		},
		settings: {
			ariaLabel: 'Home location in Houston'
		}
	},
	{
		id: 'doodle',
		kind: 'doodle',
		layout: {
			desktop: {
				columnStart: 3,
				columnSpan: 2,
				rowStart: 4,
				rowSpan: 2
			},
			mobileMinHeight: 'min(34rem, calc(140vw - 2rem))'
		},
		settings: {
			ariaLabel: 'Doodle pad'
		}
	}
];
