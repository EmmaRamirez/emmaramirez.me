import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type ThemeMode = 'light' | 'dark';

const SETTINGS_KEY = 'emzinnia:user-settings';
const LEGACY_THEME_KEY = 'theme';

function isThemeMode(value: string | null | undefined): value is ThemeMode {
	return value === 'light' || value === 'dark';
}

function readStoredTheme(): ThemeMode | null {
	if (!browser) return null;

	try {
		const rawSettings = localStorage.getItem(SETTINGS_KEY);
		if (rawSettings) {
			const parsed = JSON.parse(rawSettings) as { theme?: unknown };
			if (typeof parsed.theme === 'string' && isThemeMode(parsed.theme)) {
				return parsed.theme;
			}
		}
	} catch {
		// Ignore stale or malformed settings from earlier site versions.
	}

	const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);
	return isThemeMode(legacyTheme) ? legacyTheme : null;
}

function getSystemTheme(): ThemeMode {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getResolvedTheme(): ThemeMode {
	if (!browser) return 'light';
	return readStoredTheme() ?? getSystemTheme();
}

function applyTheme(value: ThemeMode) {
	if (!browser) return;
	document.documentElement.classList.toggle('dark', value === 'dark');
}

function persistTheme(value: ThemeMode) {
	if (!browser) return;

	try {
		const rawSettings = localStorage.getItem(SETTINGS_KEY);
		const parsed = rawSettings ? (JSON.parse(rawSettings) as Record<string, unknown>) : {};
		localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...parsed, theme: value }));
		localStorage.setItem(LEGACY_THEME_KEY, value);
	} catch {
		localStorage.setItem(LEGACY_THEME_KEY, value);
	}
}

const {
	subscribe,
	set: setThemeStore,
	update: updateThemeStore
} = writable<ThemeMode>(browser ? getResolvedTheme() : 'light');

let hasThemeListener = false;

function handleSystemThemeChange(event: MediaQueryListEvent) {
	if (readStoredTheme()) return;

	const nextTheme: ThemeMode = event.matches ? 'dark' : 'light';
	applyTheme(nextTheme);
	setThemeStore(nextTheme);
}

export const theme = {
	subscribe,
	set: (value: ThemeMode) => {
		persistTheme(value);
		applyTheme(value);
		setThemeStore(value);
	},
	toggle: () => {
		updateThemeStore((current) => {
			const nextTheme: ThemeMode = current === 'light' ? 'dark' : 'light';
			persistTheme(nextTheme);
			applyTheme(nextTheme);
			return nextTheme;
		});
	},
	init: () => {
		if (!browser) return;

		const initialTheme = getResolvedTheme();
		applyTheme(initialTheme);
		setThemeStore(initialTheme);

		if (hasThemeListener) return;

		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', handleSystemThemeChange);
		hasThemeListener = true;
	}
};
