export const ACHIEVEMENT_DEFINITIONS = {
	'achievement-unlocker': { name: 'Achievement Unlocker' },
	'boogie-all-night-long': { name: 'Boogie All Night Long' },
	'doodle-artist': { name: 'Doodle Artist' },
	'sticky-icky': { name: 'Sticky Icky' },
	'pokemon-professor': { name: 'Pokemon Professor' }
} as const;

export type AchievementId = keyof typeof ACHIEVEMENT_DEFINITIONS;

export const ACHIEVEMENT_IDS = Object.keys(ACHIEVEMENT_DEFINITIONS) as AchievementId[];

export function getAchievementName(id: AchievementId): string {
	return ACHIEVEMENT_DEFINITIONS[id].name;
}

export const ACHIEVEMENT_GRID_CAPACITY = 12;
