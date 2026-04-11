export type ContentEntityType = 'project' | 'article';

export interface ProjectContentRecord {
	id: string;
	title: string;
	description: string;
	excerpt: string;
	bodyMarkdown: string;
	updatedAt: string | null;
}

export interface ArticleContentRecord {
	slug: string;
	title: string;
	description: string;
	excerpt: string;
	tags: string[];
	publishedAt: string;
	updatedAt: string | null;
}

export interface ContentIndexResponse {
	projects: ProjectContentRecord[];
	articles: ArticleContentRecord[];
}

export interface ProjectContentUpdatePayload {
	entityType: 'project';
	entityId: string;
	description: string;
	excerpt: string;
	bodyMarkdown: string;
}

export interface ArticleContentUpdatePayload {
	entityType: 'article';
	entityId: string;
	title: string;
	description: string;
	excerpt: string;
	tags: string[];
	publishedAt: string;
}

export type ContentUpdatePayload = ProjectContentUpdatePayload | ArticleContentUpdatePayload;
