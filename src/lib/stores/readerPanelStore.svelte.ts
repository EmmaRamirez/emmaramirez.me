import type { ProjectId } from '$lib/registry/homepage';

/**
 * Reader Panel Store
 * 
 * Manages the state for article and project reader panels.
 * Handles mutual exclusivity (only one panel open at a time).
 */

let articleOpen = $state(false);
let projectOpen = $state(false);
let selectedArticleId = $state<string | null>(null);
let selectedProjectId = $state<ProjectId | null>(null);

let articleCleanupTimeout: ReturnType<typeof setTimeout> | null = null;
let projectCleanupTimeout: ReturnType<typeof setTimeout> | null = null;

function clearArticleCleanup() {
	if (articleCleanupTimeout) {
		clearTimeout(articleCleanupTimeout);
		articleCleanupTimeout = null;
	}
}

function clearProjectCleanup() {
	if (projectCleanupTimeout) {
		clearTimeout(projectCleanupTimeout);
		projectCleanupTimeout = null;
	}
}

export function openArticleReader(articleId: string) {
	clearArticleCleanup();
	
	if (projectOpen) {
		closeProjectReader();
	}
	
	selectedArticleId = articleId;
	articleOpen = true;
}

export function closeArticleReader() {
	articleOpen = false;
	
	articleCleanupTimeout = setTimeout(() => {
		if (!articleOpen) {
			selectedArticleId = null;
		}
	}, 300);
}

export function openProjectReader(projectId: ProjectId) {
	clearProjectCleanup();
	
	if (articleOpen) {
		closeArticleReader();
	}
	
	selectedProjectId = projectId;
	projectOpen = true;
}

export function closeProjectReader() {
	projectOpen = false;
	
	projectCleanupTimeout = setTimeout(() => {
		if (!projectOpen) {
			selectedProjectId = null;
		}
	}, 300);
}

export function setSelectedArticleId(id: string | null) {
	selectedArticleId = id;
}

export function setSelectedProjectId(id: ProjectId | null) {
	selectedProjectId = id;
}

export function getArticleOpen() {
	return articleOpen;
}

export function getProjectOpen() {
	return projectOpen;
}

export function getSelectedArticleId() {
	return selectedArticleId;
}

export function getSelectedProjectId() {
	return selectedProjectId;
}

export function getAnyPanelOpen() {
	return articleOpen || projectOpen;
}

