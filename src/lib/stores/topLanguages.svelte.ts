import { browser } from '$app/environment';

export type TopLanguagesVariant =
	| 'horizontal-bars'
	| 'treemap'
	| 'voronoi'
	| 'segmented-bar'
	| 'waffle'
	| 'ranked-cards';

const STORAGE_KEY = 'top-languages-variant';

export const defaultTopLanguagesVariant: TopLanguagesVariant = 'ranked-cards';

export const topLanguagesVariantOptions: Array<{ value: TopLanguagesVariant; label: string }> = [
	{ value: 'horizontal-bars', label: 'Horizontal Bars' },
	{ value: 'treemap', label: 'Treemap' },
	{ value: 'voronoi', label: 'Weighted Voronoi' },
	{ value: 'segmented-bar', label: 'Segmented Bar' },
	{ value: 'waffle', label: 'Waffle Chart' },
	{ value: 'ranked-cards', label: 'Ranked Cards' }
];

function isTopLanguagesVariant(value: string | null): value is TopLanguagesVariant {
	return topLanguagesVariantOptions.some((option) => option.value === value);
}

const storedVariant = browser ? localStorage.getItem(STORAGE_KEY) : null;

const initialVariant = isTopLanguagesVariant(storedVariant)
	? storedVariant
	: defaultTopLanguagesVariant;

let variant = $state<TopLanguagesVariant>(initialVariant);

export const topLanguagesSettings = {
	get variant() {
		return variant;
	},
	set variant(value: TopLanguagesVariant) {
		variant = value;
		if (browser) {
			localStorage.setItem(STORAGE_KEY, value);
		}
	}
};

export { isTopLanguagesVariant };
