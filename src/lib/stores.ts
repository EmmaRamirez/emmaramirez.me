import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const title = writable('hi, welcome to my website.');
export const headerColor = writable('var(--caroline-blue-600)');

// Theme store with localStorage persistence
function createThemeStore() {
	const defaultTheme = browser
		? (localStorage.getItem('theme') as 'light' | 'dark' | null) ??
		  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
		: 'light';
	
	const { subscribe, set, update } = writable<'light' | 'dark'>(defaultTheme);

	return {
		subscribe,
		set: (value: 'light' | 'dark') => {
			if (browser) {
				localStorage.setItem('theme', value);
				document.documentElement.classList.toggle('dark', value === 'dark');
			}
			set(value);
		},
		toggle: () => {
			update(current => {
				const next = current === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme', next);
					document.documentElement.classList.toggle('dark', next === 'dark');
				}
				return next;
			});
		},
		init: () => {
			if (browser) {
				const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
				const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
				const theme = stored ?? preferred;
				document.documentElement.classList.toggle('dark', theme === 'dark');
				set(theme);
			}
		}
	};
}

export const theme = createThemeStore();