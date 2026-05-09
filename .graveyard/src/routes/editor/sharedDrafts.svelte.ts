import type { LayoutData } from './$types';

export const editorDrafts = $state({
	articles: [] as LayoutData['articles'],
	projects: [] as LayoutData['projects']
});

export function hydrateEditorDrafts(data: LayoutData) {
	editorDrafts.articles = data.articles.map((article) => ({ ...article }));
	editorDrafts.projects = data.projects.map((project) => ({ ...project }));
}

export function applyProjectSave(update: {
	id: string;
	description: string;
	excerpt: string;
	content: string;
	updatedAt: string | null;
}) {
	editorDrafts.projects = editorDrafts.projects.map((project) =>
		project.id === update.id
			? {
					...project,
					description: update.description,
					excerpt: update.excerpt,
					content: update.content,
					updatedAt: update.updatedAt
				}
			: project
	);
}

export function applyArticleSave(update: {
	slug: string;
	title: string;
	description: string;
	excerpt: string;
	date: string;
	tags: string[];
	updatedAt: string | null;
}) {
	editorDrafts.articles = editorDrafts.articles.map((article) =>
		article.slug === update.slug
			? {
					...article,
					title: update.title,
					description: update.description,
					excerpt: update.excerpt,
					content: update.excerpt,
					date: update.date,
					tags: update.tags,
					updatedAt: update.updatedAt
				}
			: article
	);
}
