import { writable } from 'svelte/store';
import {
	showSections,
	theme,
	userSettings,
	pokemonTeamSettings,
	thisSiteSettings
} from '$lib/stores/userSettings.svelte';

export const title = writable('hi, welcome to my website.');
export const headerColor = writable('var(--caroline-blue-600)');
export { showSections, theme, userSettings, pokemonTeamSettings, thisSiteSettings };
