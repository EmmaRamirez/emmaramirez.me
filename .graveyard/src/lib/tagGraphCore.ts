export interface TagCluster {
	id: string;
	tags: string[];
	size: number;
}

export interface TagGraphNode {
	id: string;
	label: string;
	count: number;
	degree: number;
	cluster: number;
	radius: number;
}

export interface TagGraphLink {
	source: string;
	target: string;
	weight: number;
}

export interface TagGraph {
	nodes: TagGraphNode[];
	links: TagGraphLink[];
}

type Tagged = { tags: string[] };

function uniqueTagsFromArticles(items: readonly Tagged[]): string[] {
	const tags = new Set<string>();
	for (const article of items) {
		for (const tag of article.tags) tags.add(tag);
	}
	return [...tags].sort();
}

/** Pure tag clusters from co-occurrence (for tests and `getTagClusters`). */
export function buildTagClustersFromTagged(items: readonly Tagged[]): TagCluster[] {
	const tags = uniqueTagsFromArticles(items);
	const adjacency = new Map<string, Set<string>>();
	const frequency = new Map<string, number>();

	for (const tag of tags) {
		adjacency.set(tag, new Set());
		frequency.set(tag, 0);
	}

	for (const article of items) {
		const articleTags = [...new Set(article.tags)];

		for (const tag of articleTags) {
			frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
		}

		for (let i = 0; i < articleTags.length; i += 1) {
			for (let j = i + 1; j < articleTags.length; j += 1) {
				const left = articleTags[i]!;
				const right = articleTags[j]!;
				adjacency.get(left)?.add(right);
				adjacency.get(right)?.add(left);
			}
		}
	}

	const sortedTags = [...tags].sort((left, right) => {
		const leftDegree = adjacency.get(left)?.size ?? 0;
		const rightDegree = adjacency.get(right)?.size ?? 0;
		if (leftDegree !== rightDegree) return rightDegree - leftDegree;

		const leftFrequency = frequency.get(left) ?? 0;
		const rightFrequency = frequency.get(right) ?? 0;
		if (leftFrequency !== rightFrequency) return rightFrequency - leftFrequency;

		return left.localeCompare(right);
	});

	const visited = new Set<string>();
	const clusters: TagCluster[] = [];

	for (const tag of sortedTags) {
		if (visited.has(tag)) continue;

		const stack = [tag];
		const component: string[] = [];
		visited.add(tag);

		while (stack.length > 0) {
			const current = stack.pop();
			if (!current) continue;

			component.push(current);

			const neighbors = [...(adjacency.get(current) ?? [])].sort((left, right) => {
				const leftDegree = adjacency.get(left)?.size ?? 0;
				const rightDegree = adjacency.get(right)?.size ?? 0;
				if (leftDegree !== rightDegree) return rightDegree - leftDegree;

				const leftFrequency = frequency.get(left) ?? 0;
				const rightFrequency = frequency.get(right) ?? 0;
				if (leftFrequency !== rightFrequency) return rightFrequency - leftFrequency;

				return left.localeCompare(right);
			});

			for (const neighbor of neighbors) {
				if (visited.has(neighbor)) continue;
				visited.add(neighbor);
				stack.push(neighbor);
			}
		}

		component.sort((left, right) => {
			const leftDegree = adjacency.get(left)?.size ?? 0;
			const rightDegree = adjacency.get(right)?.size ?? 0;
			if (leftDegree !== rightDegree) return rightDegree - leftDegree;

			const leftFrequency = frequency.get(left) ?? 0;
			const rightFrequency = frequency.get(right) ?? 0;
			if (leftFrequency !== rightFrequency) return rightFrequency - leftFrequency;

			return left.localeCompare(right);
		});

		clusters.push({
			id: component[0]!,
			tags: component,
			size: component.length
		});
	}

	return clusters.sort((left, right) => {
		if (left.size !== right.size) return right.size - left.size;
		return left.id.localeCompare(right.id);
	});
}

/** Pure tag graph from co-occurrence (for tests and `getTagGraph`). */
export function buildTagGraphFromTagged(items: readonly Tagged[]): TagGraph {
	const tags = uniqueTagsFromArticles(items);
	const adjacency = new Map<string, Set<string>>();
	const counts = new Map<string, number>();
	const edgeWeights = new Map<string, number>();

	for (const tag of tags) {
		adjacency.set(tag, new Set());
		counts.set(tag, 0);
	}

	for (const article of items) {
		const articleTags = [...new Set(article.tags)];

		for (const tag of articleTags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}

		for (let i = 0; i < articleTags.length; i += 1) {
			for (let j = i + 1; j < articleTags.length; j += 1) {
				const left = articleTags[i]!;
				const right = articleTags[j]!;
				const edgeKey = [left, right].sort().join('::');

				adjacency.get(left)?.add(right);
				adjacency.get(right)?.add(left);
				edgeWeights.set(edgeKey, (edgeWeights.get(edgeKey) ?? 0) + 1);
			}
		}
	}

	const visited = new Set<string>();
	const clusterByTag = new Map<string, number>();
	let cluster = 0;

	for (const tag of tags) {
		if (visited.has(tag)) continue;

		const stack = [tag];
		visited.add(tag);

		while (stack.length > 0) {
			const current = stack.pop();
			if (!current) continue;

			clusterByTag.set(current, cluster);

			for (const neighbor of adjacency.get(current) ?? []) {
				if (visited.has(neighbor)) continue;
				visited.add(neighbor);
				stack.push(neighbor);
			}
		}

		cluster += 1;
	}

	const nodes = tags
		.map((tag) => {
			const degree = adjacency.get(tag)?.size ?? 0;
			const count = counts.get(tag) ?? 0;

			return {
				id: tag,
				label: tag,
				count,
				degree,
				cluster: clusterByTag.get(tag) ?? 0,
				radius: Math.max(34, Math.min(72, 22 + tag.length * 2.35 + degree * 3 + count * 2.25))
			};
		})
		.sort((left, right) => {
			if (left.degree !== right.degree) return right.degree - left.degree;
			if (left.count !== right.count) return right.count - left.count;
			return left.id.localeCompare(right.id);
		});

	const links = [...edgeWeights.entries()]
		.map(([edgeKey, weight]) => {
			const [source, target] = edgeKey.split('::');
			return {
				source: source!,
				target: target!,
				weight
			};
		})
		.sort((left, right) => right.weight - left.weight || left.source.localeCompare(right.source));

	return {
		nodes,
		links
	};
}
