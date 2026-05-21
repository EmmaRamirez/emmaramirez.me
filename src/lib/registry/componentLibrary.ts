export type ComponentLibraryCategoryId =
	| 'foundations'
	| 'layout'
	| 'inputs-controls'
	| 'data-display'
	| 'feedback'
	| 'navigation'
	| 'overlays'
	| 'interactive';

export interface ComponentPropDoc {
	name: string;
	type: string;
	defaultValue?: string;
	description: string;
}

export interface ComponentLibraryItem {
	id: string;
	name: string;
	categoryId: ComponentLibraryCategoryId;
	categoryName: string;
	sourcePath: string;
	summary: string;
	description: string;
	whenToUse: string[];
	accessibility: string[];
	props: ComponentPropDoc[];
	hasDetailedDocs: boolean;
	statusLabel: string;
	previewId?: string;
}

export interface ComponentLibraryCategory {
	id: ComponentLibraryCategoryId;
	name: string;
	components: ComponentLibraryItem[];
}

type CategoryDefinition = {
	id: ComponentLibraryCategoryId;
	name: string;
	components: string[];
};

type ComponentDocOverride = Omit<
	Partial<ComponentLibraryItem>,
	'id' | 'name' | 'categoryId' | 'categoryName' | 'sourcePath'
>;

const categoryDefinitions: CategoryDefinition[] = [
	{
		id: 'foundations',
		name: 'Foundations',
		components: ['Typography', 'Icon']
	},
	{
		id: 'layout',
		name: 'Layout',
		components: ['Container', 'Section', 'PageShell', 'Grid', 'Stack', 'Flex', 'Divider', 'Card']
	},
	{
		id: 'inputs-controls',
		name: 'Inputs & Controls',
		components: [
			'Button',
			'ButtonGroup',
			'IconButton',
			'LinkButton',
			'Input',
			'Textarea',
			'Select',
			'Combobox',
			'Checkbox',
			'Radio',
			'Switch',
			'Slider',
			'DatePicker',
			'FileInput',
			'SearchField'
		]
	},
	{
		id: 'data-display',
		name: 'Data Display',
		components: [
			'Avatar',
			'Badge',
			'Tag',
			'Tooltip',
			'Table',
			'DescriptionList',
			'List',
			'Statistic',
			'ProgressBar',
			'Spinner'
		]
	},
	{
		id: 'feedback',
		name: 'Feedback',
		components: ['Alert', 'Toast', 'InlineValidation', 'EmptyState']
	},
	{
		id: 'navigation',
		name: 'Navigation',
		components: ['Navbar', 'Sidebar', 'Tabs', 'Breadcrumbs', 'Pagination', 'Stepper']
	},
	{
		id: 'overlays',
		name: 'Overlays',
		components: ['Modal', 'Drawer', 'Popover', 'DropdownMenu']
	},
	{
		id: 'interactive',
		name: 'Interactive',
		components: ['Accordion', 'Collapse', 'Carousel', 'CommandPalette']
	}
];

const detailedDocs: Record<string, ComponentDocOverride> = {
	typography: {
		summary: 'Semantic text primitives for headings, body copy, code, and links.',
		description:
			'Use Typography to keep text hierarchy and tone consistent without manually rebuilding font, weight, and color classes in each feature.',
		whenToUse: [
			'Reach for it when a screen needs reliable heading, paragraph, code, or link styling.',
			'Use variants to express hierarchy while keeping the rendered element semantic with the optional `as` prop.'
		],
		accessibility: [
			'Match heading levels to document structure instead of choosing variants purely by size.',
			'Link variants should still receive meaningful `href` targets and link text.'
		],
		props: [
			{
				name: 'variant',
				type: "'h1' | 'h2' | 'p' | 'lead' | 'code' | 'link'",
				defaultValue: "'p'",
				description: 'Selects the visual text treatment.'
			},
			{
				name: 'as',
				type: 'HTML tag name',
				description: 'Overrides the rendered element when you need different semantics.'
			},
			{
				name: 'color',
				type: "'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error'",
				defaultValue: "'default'",
				description: 'Applies semantic text color styles.'
			}
		],
		previewId: 'typography',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	icon: {
		summary: 'A lightweight SVG wrapper with consistent sizing and accessibility behavior.',
		description:
			'Icon standardizes icon sizing and the decorative-versus-semantic decision so icons render consistently across buttons, badges, and navigation.',
		whenToUse: [
			'Use it whenever inline SVGs need a shared size scale.',
			'Wrap custom SVG snippets so the same icon can be reused in multiple UI contexts.'
		],
		accessibility: [
			'Provide `aria-label` when the icon communicates meaning on its own.',
			'Leave `aria-label` off for decorative icons so they stay hidden from assistive technology.'
		],
		props: [
			{
				name: 'size',
				type: "'sm' | 'md' | 'lg' | 'xl'",
				defaultValue: "'md'",
				description: 'Chooses the icon box size.'
			},
			{
				name: 'aria-label',
				type: 'string',
				description: 'Turns the icon into semantic content instead of a decorative glyph.'
			}
		],
		previewId: 'icon',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	container: {
		summary: 'Constrains page width and horizontal padding for readable layouts.',
		description:
			'Container keeps long-form content and app surfaces aligned by handling max width, centering, and responsive side padding in one place.',
		whenToUse: [
			'Wrap page content when you need a consistent max width.',
			'Use `full` size for full-bleed sections that still need shared horizontal padding.'
		],
		accessibility: [
			'Containers do not add landmark semantics by themselves, so pair them with semantic parents like `main` or `section`.',
			'Keep line lengths readable when presenting dense text content.'
		],
		props: [
			{
				name: 'size',
				type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
				defaultValue: "'lg'",
				description: 'Sets the maximum width constraint.'
			},
			{
				name: 'padding',
				type: "'none' | 'sm' | 'md' | 'lg'",
				defaultValue: "'md'",
				description: 'Controls horizontal gutter spacing.'
			},
			{
				name: 'centered',
				type: 'boolean',
				defaultValue: 'true',
				description: 'Centers the container horizontally.'
			}
		],
		previewId: 'container',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	section: {
		summary: 'Adds vertical rhythm and optional background treatment to page sections.',
		description:
			'Section is the spacing wrapper for content bands. It keeps pages visually paced while letting you attach labels for assistive technology.',
		whenToUse: [
			'Use it to separate major content regions on long pages.',
			'Choose a background variant when a section should read as a distinct surface.'
		],
		accessibility: [
			'Provide `aria-label` or `aria-labelledby` when the section needs a named landmark.',
			'Do not rely on background color alone to communicate importance.'
		],
		props: [
			{
				name: 'spacing',
				type: "'none' | 'sm' | 'md' | 'lg' | 'xl'",
				defaultValue: "'md'",
				description: 'Controls vertical padding.'
			},
			{
				name: 'background',
				type: "'transparent' | 'muted' | 'accent' | 'primary'",
				defaultValue: "'transparent'",
				description: 'Applies section background styling.'
			},
			{
				name: 'aria-label / aria-labelledby',
				type: 'string',
				description: 'Names the section when it acts as a landmark.'
			}
		],
		previewId: 'section',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	'page-shell': {
		summary: 'A page-level scaffold with optional header and footer slots around main content.',
		description:
			'PageShell gives top-level screens a predictable structure so navigation, main content, and footer areas stay visually and semantically consistent.',
		whenToUse: [
			'Use it for full-page layouts with a persistent header or footer.',
			'Compose it with Container and Section instead of rebuilding the page skeleton per route.'
		],
		accessibility: [
			'Header and footer snippets render semantic `<header>` and `<footer>` elements for you.',
			'Keep the main content meaningful, because it always renders inside a semantic `<main>`.'
		],
		props: [
			{
				name: 'header',
				type: 'Snippet',
				description: 'Optional header content such as branding or navigation.'
			},
			{ name: 'footer', type: 'Snippet', description: 'Optional footer content.' },
			{ name: 'class', type: 'string', description: 'Adds classes to the outer shell wrapper.' }
		],
		previewId: 'page-shell',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	grid: {
		summary: 'A responsive grid primitive for multi-column layouts and repeated cards.',
		description:
			'Grid centralizes common column and gap patterns so dashboards, galleries, and card lists can scale across breakpoints without custom CSS each time.',
		whenToUse: [
			'Use it for card collections, settings pages, or content that should shift columns responsively.',
			'Prefer `auto` when items can flow into equal-width cards.'
		],
		accessibility: [
			'Grid is presentational only, so use semantic children when the content is a true list or table.',
			'Make sure reading order still makes sense when columns collapse on small screens.'
		],
		props: [
			{
				name: 'cols',
				type: "1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto'",
				defaultValue: '1',
				description: 'Sets the base column count.'
			},
			{
				name: 'colsSm / colsMd / colsLg',
				type: 'GridCols',
				description: 'Overrides column count at responsive breakpoints.'
			},
			{
				name: 'gap',
				type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
				defaultValue: "'md'",
				description: 'Controls spacing between grid items.'
			}
		],
		previewId: 'grid',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	stack: {
		summary: 'A vertical layout primitive for predictable spacing between related items.',
		description:
			'Stack replaces repeated margin utilities with a single abstraction for vertical rhythm, making forms, cards, and settings groups easier to maintain.',
		whenToUse: [
			'Use it when content should flow vertically with consistent spacing.',
			'Pair it with alignment options to keep controls or callouts visually organized.'
		],
		accessibility: [
			'Stack changes layout only; semantic grouping still comes from the children you place inside it.',
			'Use spacing to support scanability, especially in dense forms or settings panels.'
		],
		props: [
			{
				name: 'gap',
				type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
				defaultValue: "'md'",
				description: 'Controls vertical spacing between children.'
			},
			{
				name: 'align',
				type: "'start' | 'center' | 'end' | 'stretch'",
				defaultValue: "'stretch'",
				description: 'Controls horizontal alignment of children.'
			}
		],
		previewId: 'stack',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	flex: {
		summary: 'A horizontal layout primitive for aligning and distributing items in a row.',
		description:
			'Flex gives common row alignment behavior a stable API so actions, toolbars, and compact content groups stay consistent across the app.',
		whenToUse: [
			'Use it for toolbars, inline metadata, or action rows.',
			'Enable wrapping when chips or buttons should flow onto new lines.'
		],
		accessibility: [
			'Flex affects visual arrangement only, so ensure the source order still reflects the logical reading order.',
			'Avoid using reverse ordering if it would make focus order confusing.'
		],
		props: [
			{
				name: 'gap',
				type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
				defaultValue: "'md'",
				description: 'Controls spacing between items.'
			},
			{
				name: 'align / justify',
				type: 'alignment keywords',
				description: 'Aligns and distributes items along the cross and main axes.'
			},
			{
				name: 'wrap',
				type: "'nowrap' | 'wrap' | 'wrap-reverse'",
				defaultValue: "'nowrap'",
				description: 'Controls whether items can wrap.'
			}
		],
		previewId: 'flex',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	divider: {
		summary: 'A themed horizontal or vertical separator for visual grouping.',
		description:
			'Divider creates separation between adjacent chunks of content without hard-coding borders or spacing into each surrounding component.',
		whenToUse: [
			'Use it between sections of related content or between controls in a toolbar.',
			'Switch to vertical orientation when separating inline groups.'
		],
		accessibility: [
			'The component renders an `<hr>`, which carries separator semantics for assistive technology.',
			'Only use decorative variations when the surrounding structure remains understandable without the line.'
		],
		props: [
			{
				name: 'orientation',
				type: "'horizontal' | 'vertical'",
				defaultValue: "'horizontal'",
				description: 'Changes the divider direction.'
			},
			{
				name: 'variant',
				type: "'solid' | 'dashed' | 'dotted'",
				defaultValue: "'solid'",
				description: 'Changes line style.'
			},
			{
				name: 'spacing',
				type: "'none' | 'sm' | 'md' | 'lg'",
				defaultValue: "'md'",
				description: 'Adds margin around the divider.'
			}
		],
		previewId: 'divider',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	},
	card: {
		summary: 'A reusable surface for grouping content with optional header and footer slots.',
		description:
			'Card packages the site’s surface styling into a single component so content groups can share borders, spacing, and slot structure.',
		whenToUse: [
			'Use it for grouped content such as summaries, settings clusters, or promo blocks.',
			'Attach header and footer snippets when a card needs actions or supporting metadata.'
		],
		accessibility: [
			'Cards are generic containers, so add semantic headings or landmarks inside when the content needs stronger structure.',
			'Keep interactive controls inside the body or footer clearly labeled.'
		],
		props: [
			{
				name: 'variant',
				type: "'elevated' | 'flat' | 'outlined'",
				defaultValue: "'elevated'",
				description: 'Controls the surface treatment.'
			},
			{
				name: 'header / footer',
				type: 'Snippet',
				description: 'Optional regions rendered above and below the main body.'
			},
			{ name: 'class', type: 'string', description: 'Adds classes to the card wrapper.' }
		],
		previewId: 'card',
		hasDetailedDocs: true,
		statusLabel: 'Documented'
	}
};

function createId(name: string) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/\s+/g, '-')
		.toLowerCase();
}

function createFallbackItem(
	name: string,
	categoryId: ComponentLibraryCategoryId,
	categoryName: string
): ComponentLibraryItem {
	return {
		id: createId(name),
		name,
		categoryId,
		categoryName,
		sourcePath: `$lib/components/ui/${name}.svelte`,
		summary: `${name} is implemented in the shared UI library.`,
		description:
			'This component is already available to product code today. Richer guidance and tailored examples are being added category by category inside the explorer.',
		whenToUse: ['Use this when you need a consistent, reusable version of this UI pattern.'],
		accessibility: [
			'Review the component source before introducing non-standard behavior.',
			'Prefer semantic labels, focus states, and keyboard support when composing interactive patterns.'
		],
		props: [],
		hasDetailedDocs: false,
		statusLabel: 'Implemented'
	};
}

function createComponentItem(
	name: string,
	categoryId: ComponentLibraryCategoryId,
	categoryName: string
): ComponentLibraryItem {
	const fallback = createFallbackItem(name, categoryId, categoryName);
	const override = detailedDocs[fallback.id];

	return {
		...fallback,
		...override
	};
}

export const componentLibraryCategories: ComponentLibraryCategory[] = categoryDefinitions.map(
	(category) => ({
		...category,
		components: category.components.map((name) =>
			createComponentItem(name, category.id, category.name)
		)
	})
);

export const componentLibraryItems = componentLibraryCategories.flatMap(
	(category) => category.components
);

export function getComponentLibraryItemById(id: string) {
	return componentLibraryItems.find((component) => component.id === id) ?? null;
}
