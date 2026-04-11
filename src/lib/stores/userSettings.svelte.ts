import { browser, dev } from '$app/environment';
import { writable } from 'svelte/store';

export type ThemeMode = 'light' | 'dark';
export type BlogTagView = 'flat' | 'web';
export type TopLanguagesVariant =
	| 'horizontal-bars'
	| 'treemap'
	| 'voronoi'
	| 'segmented-bar'
	| 'waffle'
	| 'ranked-cards';

interface StoredUserSettings {
	theme?: ThemeMode;
	showSections?: boolean;
	topLanguagesVariant?: TopLanguagesVariant;
	blogTagView?: BlogTagView;
}

const STORAGE_KEY = 'emzinnia:user-settings';
const LEGACY_THEME_KEY = 'theme';
const LEGACY_SHOW_SECTIONS_KEY = 'debug-show-sections';
const LEGACY_TOP_LANGUAGES_KEY = 'top-languages-variant';

export const defaultBlogTagView: BlogTagView = 'flat';
export const defaultTopLanguagesVariant: TopLanguagesVariant = 'ranked-cards';

export const topLanguagesVariantOptions: Array<{ value: TopLanguagesVariant; label: string }> = [
	{ value: 'horizontal-bars', label: 'Horizontal Bars' },
	{ value: 'treemap', label: 'Treemap' },
	{ value: 'voronoi', label: 'Weighted Voronoi' },
	{ value: 'segmented-bar', label: 'Segmented Bar' },
	{ value: 'waffle', label: 'Waffle Chart' },
	{ value: 'ranked-cards', label: 'Ranked Cards' }
];

function isThemeMode(value: string | null | undefined): value is ThemeMode {
	return value === 'light' || value === 'dark';
}

export function isBlogTagView(value: string | null | undefined): value is BlogTagView {
	return value === 'flat' || value === 'web';
}

export function isTopLanguagesVariant(value: string | null | undefined): value is TopLanguagesVariant {
	return topLanguagesVariantOptions.some((option) => option.value === value);
}

function readStoredUserSettings(): StoredUserSettings {
	if (!browser) return {};

	let parsed: StoredUserSettings = {};

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const candidate = JSON.parse(raw) as StoredUserSettings;
			if (typeof candidate === 'object' && candidate !== null) {
				parsed = candidate;
			}
		}
	} catch (error) {
		console.error('Failed to read user settings:', error);
	}

	const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);
	const legacyShowSections = localStorage.getItem(LEGACY_SHOW_SECTIONS_KEY);
	const legacyTopLanguages = localStorage.getItem(LEGACY_TOP_LANGUAGES_KEY);

	return {
		theme: isThemeMode(parsed.theme)
			? parsed.theme
			: isThemeMode(legacyTheme)
				? legacyTheme
				: undefined,
		showSections:
			typeof parsed.showSections === 'boolean'
				? parsed.showSections
				: legacyShowSections === 'true'
					? true
					: legacyShowSections === 'false'
						? false
						: undefined,
		topLanguagesVariant: isTopLanguagesVariant(parsed.topLanguagesVariant)
			? parsed.topLanguagesVariant
			: isTopLanguagesVariant(legacyTopLanguages)
				? legacyTopLanguages
				: undefined,
		blogTagView: isBlogTagView(parsed.blogTagView) ? parsed.blogTagView : undefined
	};
}

const initialStoredUserSettings = readStoredUserSettings();
let storedUserSettings = $state<StoredUserSettings>(initialStoredUserSettings);

function persistUserSettings() {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(storedUserSettings));

		if (storedUserSettings.theme) {
			localStorage.setItem(LEGACY_THEME_KEY, storedUserSettings.theme);
		}

		localStorage.setItem(
			LEGACY_SHOW_SECTIONS_KEY,
			String(storedUserSettings.showSections ?? dev)
		);
		localStorage.setItem(
			LEGACY_TOP_LANGUAGES_KEY,
			storedUserSettings.topLanguagesVariant ?? defaultTopLanguagesVariant
		);
	} catch (error) {
		console.error('Failed to persist user settings:', error);
	}
}

function patchUserSettings(next: Partial<StoredUserSettings>) {
	storedUserSettings = { ...storedUserSettings, ...next };
	persistUserSettings();
}

function getSystemTheme(): ThemeMode {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getResolvedTheme(): ThemeMode {
	if (!browser) return 'light';
	return storedUserSettings.theme ?? getSystemTheme();
}

function applyTheme(value: ThemeMode) {
	if (!browser) return;
	document.documentElement.classList.toggle('dark', value === 'dark');
}

const {
	subscribe: subscribeTheme,
	set: setThemeStore,
	update: updateThemeStore
} = writable<ThemeMode>(browser ? getResolvedTheme() : 'light');

let hasThemeListener = false;

function handleSystemThemeChange(event: MediaQueryListEvent) {
	if (storedUserSettings.theme) return;
	const nextTheme: ThemeMode = event.matches ? 'dark' : 'light';
	applyTheme(nextTheme);
	setThemeStore(nextTheme);
}

export const theme = {
	subscribe: subscribeTheme,
	set: (value: ThemeMode) => {
		patchUserSettings({ theme: value });
		applyTheme(value);
		setThemeStore(value);
	},
	toggle: () => {
		updateThemeStore((current) => {
			const next = current === 'light' ? 'dark' : 'light';
			patchUserSettings({ theme: next });
			applyTheme(next);
			return next;
		});
	},
	init: () => {
		if (!browser) return;

		const initialTheme = getResolvedTheme();
		applyTheme(initialTheme);
		setThemeStore(initialTheme);

		if (hasThemeListener) return;

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);
		hasThemeListener = true;
	}
};

const initialShowSections = initialStoredUserSettings.showSections ?? dev;
const { subscribe: subscribeShowSections, set: setShowSectionsStore } =
	writable<boolean>(initialShowSections);

export const showSections = {
	subscribe: subscribeShowSections,
	set: (value: boolean) => {
		patchUserSettings({ showSections: value });
		setShowSectionsStore(value);
	}
};

let topLanguagesVariant = $state<TopLanguagesVariant>(
	initialStoredUserSettings.topLanguagesVariant ?? defaultTopLanguagesVariant
);

export const topLanguagesSettings = {
	get variant() {
		return topLanguagesVariant;
	},
	set variant(value: TopLanguagesVariant) {
		topLanguagesVariant = value;
		patchUserSettings({ topLanguagesVariant: value });
	}
};

let blogTagView = $state<BlogTagView>(initialStoredUserSettings.blogTagView ?? defaultBlogTagView);

export const blogSettings = {
	get tagView() {
		return blogTagView;
	},
	set tagView(value: BlogTagView) {
		blogTagView = value;
		patchUserSettings({ blogTagView: value });
	}
};

export const userSettings = {
	theme,
	showSections,
	topLanguages: topLanguagesSettings,
	blog: blogSettings
};
