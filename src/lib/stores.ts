import { writable } from "svelte/store";
import { browser, dev } from "$app/environment";

export const title = writable('hi, welcome to my website.');
export const headerColor = writable('var(--caroline-blue-600)');

function createShowSectionsStore() {
	const defaultValue = browser
		? (localStorage.getItem('debug-show-sections') === 'true') || dev
		: dev;
	
	const { subscribe, set } = writable<boolean>(defaultValue);

	return {
		subscribe,
		set: (value: boolean) => {
			if (browser) {
				localStorage.setItem('debug-show-sections', String(value));
			}
			set(value);
		}
	};
}

export const showSections = createShowSectionsStore();

function createThemeStore() {
	const getSystemPreference = () => 
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	
	const defaultTheme = browser
		? (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? getSystemPreference()
		: 'light';
	
	const { subscribe, set, update } = writable<'light' | 'dark'>(defaultTheme);

	const applyTheme = (value: 'light' | 'dark') => {
		document.documentElement.classList.toggle('dark', value === 'dark');
	};

	return {
		subscribe,
		set: (value: 'light' | 'dark') => {
			if (browser) {
				localStorage.setItem('theme', value);
				applyTheme(value);
			}
			set(value);
		},
		toggle: () => {
			update(current => {
				const next = current === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme', next);
					applyTheme(next);
				}
				return next;
			});
		},
		init: () => {
			if (browser) {
				const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
				const initialTheme = stored ?? getSystemPreference();
				applyTheme(initialTheme);
				set(initialTheme);

				window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
					if (!localStorage.getItem('theme')) {
						const newTheme = e.matches ? 'dark' : 'light';
						applyTheme(newTheme);
						set(newTheme);
					}
				});
			}
		}
	};
}

export const theme = createThemeStore();