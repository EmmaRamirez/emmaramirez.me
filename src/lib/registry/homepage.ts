import discoImage from '$lib/images/photos/disco.jpeg';
import type { HomepageBlock, HomepageBlockPlacement } from '$lib/types/homepage';

const artworkImageModules = import.meta.glob<string>('../images/artwork/*.{avif,jpeg,jpg,png,webp}', {
	eager: true,
	import: 'default'
});

const artworkSlots: Array<Pick<HomepageBlockPlacement, 'columnStart' | 'rowStart'>> = [
	{ columnStart: 2, rowStart: 9 },
	{ columnStart: 4, rowStart: 9 },
	{ columnStart: 1, rowStart: 10 },
	{ columnStart: 2, rowStart: 10 },
	{ columnStart: 4, rowStart: 10 }
];

function formatArtworkTitle(path: string) {
	const filename = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'artwork';

	return filename
		.split(/[-_]+/)
		.filter(Boolean)
		.map((word) => word[0]?.toUpperCase() + word.slice(1))
		.join(' ');
}

function getArtworkSlug(path: string, fallbackIndex: number) {
	const filename = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? `artwork-${fallbackIndex}`;
	const slug = filename
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

	return slug || `artwork-${fallbackIndex}`;
}

function getArtworkPlacement(index: number): HomepageBlockPlacement {
	const slot = artworkSlots[index];

	if (slot) {
		return {
			...slot,
			columnSpan: 1,
			rowSpan: 1
		};
	}

	const overflowIndex = index - artworkSlots.length;

	return {
		columnStart: (overflowIndex % 4) + 1,
		columnSpan: 1,
		rowStart: 11 + Math.floor(overflowIndex / 4),
		rowSpan: 1
	};
}

const artworkBlocks: HomepageBlock[] = Object.entries(artworkImageModules)
	.sort(([a], [b]) => a.localeCompare(b))
	.map(([path, image], index) => {
		const title = formatArtworkTitle(path);
		const slug = getArtworkSlug(path, index);

		return {
			id: `artwork-${slug}`,
			kind: 'artwork',
			layout: {
				desktop: getArtworkPlacement(index),
				minHeight: '100%',
				mobileMinHeight: 'min(16rem, calc(100vw - 2rem))'
			},
			settings: {
				alt: `${title} artwork`,
				ariaLabel: title,
				image,
				title
			}
		};
	});

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
				rowSpan: 2
			}
		},
		settings: {
			ariaLabel: 'Pokemon team'
		}
	},
	{
		id: 'pokemon-color-one',
		kind: 'component-library',
		layout: {
			desktop: {
				columnStart: 4,
				columnSpan: 1,
				rowStart: 3,
				rowSpan: 1
			},
			minHeight: '100%',
			mobileMinHeight: 'min(16rem, calc(100vw - 2rem))'
		},
		settings: {
			ariaLabel: 'Browse the component library',
			backgroundColor: 'var(--transit-yellow-900)'
		}
	},
	{
		id: 'pokemon-color-two',
		kind: 'spacer',
		layout: {
			desktop: {
				columnStart: 4,
				columnSpan: 1,
				rowStart: 4,
				rowSpan: 1
			},
			minHeight: '100%',
			mobileMinHeight: 'min(16rem, calc(100vw - 2rem))'
		},
		settings: {
			decorative: true
		}
	},
	{
		id: 'houston',
		kind: 'houston',
		layout: {
			desktop: {
				columnStart: 1,
				columnSpan: 1,
				rowStart: 7,
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
				rowStart: 5,
				rowSpan: 2
			},
			mobileMinHeight: 'min(34rem, calc(140vw - 2rem))'
		},
		settings: {
			ariaLabel: 'Doodle pad'
		}
	},
	{
		id: 'sticker',
		kind: 'sticker',
		layout: {
			desktop: {
				columnStart: 1,
				columnSpan: 1,
				rowStart: 5,
				rowSpan: 2
			},
			mobileMinHeight: 'min(34rem, calc(140vw - 2rem))'
		},
		settings: {
			ariaLabel: 'Sticker tray'
		}
	},
	{
		id: 'achievement',
		kind: 'achievement',
		layout: {
			desktop: {
				columnStart: 2,
				columnSpan: 1,
				rowStart: 5,
				rowSpan: 1
			}
		},
		settings: {
			ariaLabel: 'Achievement unlocked'
		}
	},
	{
		id: 'three-moats-article',
		kind: 'three-moats-article',
		layout: {
			desktop: {
				columnStart: 2,
				columnSpan: 1,
				rowStart: 6,
				rowSpan: 2
			}
		}
	},
	{
		id: 'changelog',
		kind: 'changelog',
		layout: {
			desktop: {
				columnStart: 3,
				columnSpan: 1,
				rowStart: 7,
				rowSpan: 4
			},
			mobileMinHeight: 'min(20rem, calc(80vw - 2rem))'
		},
		settings: {
			ariaLabel: 'Recent project changelog'
		}
	},
	{
		id: 'gallery',
		kind: 'gallery',
		layout: {
			desktop: {
				columnStart: 1,
				columnSpan: 2,
				rowStart: 8,
				rowSpan: 1
			},
			minHeight: '100%',
			mobileMinHeight: 'min(22rem, calc(100vw - 2rem))'
		},
		settings: {
			ariaLabel: 'The Gallery',
			labelledBy: 'gallery-block-heading'
		}
	},
	{
		id: 'empty-one',
		kind: 'empty',
		layout: {
			desktop: {
				columnStart: 4,
				columnSpan: 1,
				rowStart: 7,
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
		id: 'empty-two',
		kind: 'empty',
		layout: {
			desktop: {
				columnStart: 4,
				columnSpan: 1,
				rowStart: 8,
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
	...artworkBlocks,
	{
		id: 'empty-three',
		kind: 'empty',
		layout: {
			desktop: {
				columnStart: 1,
				columnSpan: 1,
				rowStart: 9,
				rowSpan: 1
			},
			minHeight: '100%',
			mobileMinHeight: 'min(16rem, calc(100vw - 2rem))'
		},
		settings: {
			className: 'home-grid__block--empty',
			decorative: true
		}
	}
];
