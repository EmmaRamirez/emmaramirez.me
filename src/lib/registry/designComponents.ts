export type DesignComponentCategoryId =
	| 'ui'
	| 'ui-header'
	| 'blocks'
	| 'devtools'
	| 'editor'
	| 'panels'
	| 'grids'
	| 'hero'
	| 'graphics'
	| 'dev';

export type DesignPreviewMode = 'live' | 'mocked' | 'documented';

export interface DesignComponentDoc {
	id: string;
	name: string;
	categoryId: DesignComponentCategoryId;
	categoryName: string;
	sourcePath: string;
	summary: string;
	description: string;
	props: string[];
	dependencies: string[];
	previewMode: DesignPreviewMode;
	example: string;
}

export interface DesignComponentCategory {
	id: DesignComponentCategoryId;
	name: string;
	description: string;
	components: DesignComponentDoc[];
}

interface ComponentDefinition {
	path: string;
	previewMode?: DesignPreviewMode;
	summary?: string;
	description?: string;
	props?: string[];
	dependencies?: string[];
	example?: string;
}

interface CategoryDefinition {
	id: DesignComponentCategoryId;
	name: string;
	description: string;
	defaultPreviewMode: DesignPreviewMode;
	defaultSummary: string;
	defaultDescription: string;
	defaultProps: string[];
	defaultDependencies: string[];
	components: ComponentDefinition[];
}

const categoryDefinitions: CategoryDefinition[] = [
	{
		id: 'ui',
		name: 'UI primitives',
		description: 'Reusable design-system primitives exported from the shared UI barrel.',
		defaultPreviewMode: 'live',
		defaultSummary: 'Shared UI primitive for composing consistent interface surfaces.',
		defaultDescription:
			'Use this component when a screen needs the site design language without rebuilding spacing, typography, state, or accessibility details from scratch.',
		defaultProps: ['class?: string', 'children?: Snippet', 'HTML attributes where supported'],
		defaultDependencies: ['Design tokens from app CSS'],
		components: [
			{
				path: 'ui/Accordion.svelte',
				props: ['items: AccordionItem[]', 'multiple?: boolean', 'defaultOpen?: string[]']
			},
			{
				path: 'ui/Alert.svelte',
				props: [
					'variant?: "info" | "success" | "warning" | "error"',
					'title?: string',
					'children?: Snippet'
				]
			},
			{
				path: 'ui/Avatar.svelte',
				props: [
					'src?: string',
					'alt?: string',
					'fallback?: string',
					'size?: "sm" | "md" | "lg" | "xl"'
				]
			},
			{
				path: 'ui/Badge.svelte',
				props: ['variant?: semantic color', 'size?: "sm" | "md"', 'pill?: boolean']
			},
			{ path: 'ui/Breadcrumbs.svelte', props: ['items: BreadcrumbItem[]'] },
			{
				path: 'ui/Button.svelte',
				props: [
					'variant?: "primary" | "secondary" | "outline" | "ghost"',
					'size?: "sm" | "md" | "lg"'
				]
			},
			{
				path: 'ui/ButtonGroup.svelte',
				props: ['orientation?: "horizontal" | "vertical"', 'children?: Snippet']
			},
			{
				path: 'ui/Card.svelte',
				props: [
					'variant?: "elevated" | "flat" | "outlined"',
					'header?: Snippet',
					'footer?: Snippet'
				]
			},
			{
				path: 'ui/Carousel.svelte',
				props: [
					'slideCount: number',
					'currentSlide?: number',
					'showArrows?: boolean',
					'children?: Snippet<[number]>'
				]
			},
			{
				path: 'ui/Checkbox.svelte',
				props: ['label?: string', 'checked?: boolean', 'description?: string', 'error?: string']
			},
			{
				path: 'ui/Collapse.svelte',
				props: ['title: string', 'open?: boolean', 'children?: Snippet']
			},
			{
				path: 'ui/Combobox.svelte',
				props: ['options: ComboboxOption[]', 'value?: string', 'placeholder?: string']
			},
			{
				path: 'ui/CommandPalette.svelte',
				props: ['open?: boolean', 'commands: CommandItem[]', 'onselect?: callback'],
				dependencies: ['Global keyboard shortcut handling']
			},
			{
				path: 'ui/Container.svelte',
				props: ['size?: "sm" | "md" | "lg" | "xl" | "full"', 'padding?: spacing token']
			},
			{
				path: 'ui/DatePicker.svelte',
				props: ['value?: string', 'label?: string', 'min?: string', 'max?: string']
			},
			{ path: 'ui/DescriptionList.svelte', props: ['items: DescriptionItem[]'] },
			{
				path: 'ui/Divider.svelte',
				props: ['orientation?: "horizontal" | "vertical"', 'spacing?: spacing token']
			},
			{
				path: 'ui/Drawer.svelte',
				props: [
					'open?: boolean',
					'position?: "left" | "right" | "top" | "bottom"',
					'title?: string'
				]
			},
			{
				path: 'ui/DropdownMenu.svelte',
				props: ['items: DropdownMenuItem[]', 'trigger?: Snippet', 'onselect?: callback']
			},
			{
				path: 'ui/EmptyState.svelte',
				props: ['title: string', 'description?: string', 'action?: Snippet']
			},
			{
				path: 'ui/FileInput.svelte',
				props: ['label?: string', 'accept?: string', 'multiple?: boolean', 'onchange?: callback']
			},
			{
				path: 'ui/Flex.svelte',
				props: ['gap?: spacing token', 'align?: flex alignment', 'justify?: flex alignment']
			},
			{
				path: 'ui/Grid.svelte',
				props: ['cols?: number', 'colsSm?: number', 'colsMd?: number', 'gap?: spacing token']
			},
			{
				path: 'ui/Icon.svelte',
				props: ['size?: "sm" | "md" | "lg" | "xl"', 'aria-label?: string']
			},
			{
				path: 'ui/IconButton.svelte',
				props: ['aria-label: string', 'variant?: button variant', 'size?: button size']
			},
			{
				path: 'ui/InlineValidation.svelte',
				props: ['message?: string', 'state?: "error" | "success" | "warning"']
			},
			{
				path: 'ui/Input.svelte',
				props: ['label?: string', 'value?: string', 'error?: string', 'leadingIcon?: Snippet']
			},
			{
				path: 'ui/LinkButton.svelte',
				props: ['href: string', 'variant?: button variant', 'size?: button size']
			},
			{ path: 'ui/List.svelte', props: ['dividers?: boolean', 'children?: Snippet'] },
			{
				path: 'ui/ListItem.svelte',
				props: ['title?: string', 'description?: string', 'href?: string', 'onclick?: callback']
			},
			{
				path: 'ui/Modal.svelte',
				props: [
					'open?: boolean',
					'title?: string',
					'size?: "sm" | "md" | "lg"',
					'onclose?: callback'
				]
			},
			{ path: 'ui/Navbar.svelte', props: ['items: NavItem[]', 'activeHref?: string'] },
			{
				path: 'ui/PageShell.svelte',
				props: ['header?: Snippet', 'footer?: Snippet', 'children?: Snippet']
			},
			{
				path: 'ui/Pagination.svelte',
				props: ['currentPage: number', 'totalPages: number', 'onchange?: callback']
			},
			{
				path: 'ui/Popover.svelte',
				props: ['trigger?: Snippet', 'children?: Snippet', 'placement?: string']
			},
			{ path: 'ui/ProgressBar.svelte', props: ['value: number', 'max?: number', 'label?: string'] },
			{
				path: 'ui/Radio.svelte',
				props: ['label?: string', 'checked?: boolean', 'name?: string', 'value?: string']
			},
			{
				path: 'ui/SearchField.svelte',
				props: ['value?: string', 'placeholder?: string', 'onsearch?: callback']
			},
			{
				path: 'ui/Section.svelte',
				props: ['spacing?: spacing token', 'background?: surface token', 'children?: Snippet']
			},
			{
				path: 'ui/Select.svelte',
				props: ['options: SelectOption[]', 'value?: string', 'label?: string']
			},
			{ path: 'ui/Sidebar.svelte', props: ['items: SidebarItem[]', 'activeHref?: string'] },
			{
				path: 'ui/SiteSearch.svelte',
				previewMode: 'mocked',
				dependencies: ['App article and project registries', 'SvelteKit navigation']
			},
			{
				path: 'ui/Slider.svelte',
				props: ['value?: number', 'min?: number', 'max?: number', 'step?: number']
			},
			{
				path: 'ui/Spinner.svelte',
				props: ['size?: "sm" | "md" | "lg"', 'variant?: semantic color']
			},
			{
				path: 'ui/Stack.svelte',
				props: ['gap?: spacing token', 'align?: alignment token', 'children?: Snippet']
			},
			{
				path: 'ui/Statistic.svelte',
				props: ['label: string', 'value: string | number', 'trend?: string']
			},
			{
				path: 'ui/Stepper.svelte',
				props: ['steps: StepperStep[]', 'currentStep: number', 'clickable?: boolean']
			},
			{
				path: 'ui/Switch.svelte',
				props: ['label?: string', 'checked?: boolean', 'description?: string']
			},
			{
				path: 'ui/Table.svelte',
				props: ['columns: Column[]', 'data: Record<string, unknown>[]', 'cell?: Snippet']
			},
			{
				path: 'ui/Tabs.svelte',
				props: ['tabs: TabItem[]', 'activeTab?: string', 'children?: Snippet<[string]>']
			},
			{
				path: 'ui/Tag.svelte',
				props: ['variant?: semantic color', 'removable?: boolean', 'onclick?: callback']
			},
			{
				path: 'ui/Textarea.svelte',
				props: ['label?: string', 'value?: string', 'rows?: number', 'error?: string']
			},
			{ path: 'ui/ThemeToggle.svelte', dependencies: ['Theme store'] },
			{ path: 'ui/Toast.svelte', dependencies: ['Module-level toasts store'] },
			{
				path: 'ui/Tooltip.svelte',
				props: ['content: string', 'position?: string', 'children?: Snippet']
			},
			{
				path: 'ui/Typography.svelte',
				props: ['variant?: text style', 'as?: element name', 'color?: semantic color']
			}
		]
	},
	{
		id: 'ui-header',
		name: 'Header system',
		description: 'Header-specific components that coordinate navigation and logo interactions.',
		defaultPreviewMode: 'live',
		defaultSummary: 'Header component used to assemble the site chrome.',
		defaultDescription:
			'Use these components together so the header context, active indicator, logo affordances, and navigation semantics stay coordinated.',
		defaultProps: ['class?: string', 'children?: Snippet'],
		defaultDependencies: ['Header context for navigation indicator'],
		components: [
			{ path: 'ui/header/Header.svelte' },
			{ path: 'ui/header/HeaderLogo.svelte' },
			{
				path: 'ui/header/HeaderLogoMark.svelte',
				previewMode: 'mocked',
				dependencies: [
					'Browser feature detection',
					'Reduced motion preference',
					'Canvas/WebGL-style animation'
				]
			},
			{ path: 'ui/header/HeaderNav.svelte' },
			{
				path: 'ui/header/HeaderNavItem.svelte',
				dependencies: ['Must be rendered inside HeaderNav']
			}
		]
	},
	{
		id: 'blocks',
		name: 'Homepage and content blocks',
		description: 'Larger site sections used by the homepage, content pages, and media features.',
		defaultPreviewMode: 'mocked',
		defaultSummary: 'Feature block that composes content, media, or site-specific data.',
		defaultDescription:
			'Use this block in app contexts where its required data and global stores are available. The design page documents its contract and shows a safe fixture when possible.',
		defaultProps: ['class?: string', 'feature-specific content props'],
		defaultDependencies: ['Homepage registries or app stores where noted'],
		components: [
			{ path: 'blocks/DiscoBlock.svelte', dependencies: ['Canvas animation', 'Image asset'] },
			{
				path: 'blocks/content/ArticleBlock.svelte',
				props: ['title: string', 'content: string | Snippet', 'tags?: string[]', 'href?: string']
			},
			{
				path: 'blocks/content/ArticleCard.svelte',
				props: ['title: string', 'excerpt: string', 'href: string', 'tags?: string[]']
			},
			{
				path: 'blocks/content/ProjectBlock.svelte',
				props: ['name: string', 'asset?: string', 'href?: string'],
				dependencies: ['Project image path conventions']
			},
			{ path: 'blocks/location/CityCard.svelte', props: ['photo: string', 'description: string'] },
			{
				path: 'blocks/location/LocationBlock.svelte',
				previewMode: 'documented',
				dependencies: ['Mapbox token', 'GeoJSON data', 'Theme store', 'Places API']
			},
			{ path: 'blocks/media/DiscoBlock.svelte', dependencies: ['Canvas animation', 'Image asset'] },
			{
				path: 'blocks/media/ImageBlock.svelte',
				props: ['src: string', 'alt: string', 'class: string']
			},
			{
				path: 'blocks/personal/PokemonBlock.svelte',
				dependencies: ['Pokemon team data', 'Optional PokeAPI details', 'Editor surface context']
			},
			{
				path: 'blocks/personal/TopLanguages.svelte',
				dependencies: ['GitHub language data', 'Optional editor surface context']
			},
			{
				path: 'blocks/personal/TopLanguagesLoader.svelte',
				previewMode: 'documented',
				dependencies: ['/api/github/top-languages', 'Performance analytics store']
			},
			{
				path: 'blocks/site/CommitBlock.svelte',
				props: ['title: string', 'date: string', 'hash: string', 'class: string']
			},
			{
				path: 'blocks/site/HomeBlock.svelte',
				dependencies: ['Theme store', 'Static project imagery']
			},
			{ path: 'blocks/site/InterestsBlock.svelte' },
			{ path: 'blocks/site/ThisSiteBlock.svelte', dependencies: ['thisSiteSettings store'] }
		]
	},
	{
		id: 'devtools',
		name: 'Design and debug tools',
		description: 'Development surfaces for browsing the design system and API/debug settings.',
		defaultPreviewMode: 'mocked',
		defaultSummary: 'Development helper surfaced in editor or debug contexts.',
		defaultDescription:
			'Use this component in development-only surfaces. The design page keeps network-heavy behavior closed and documents its required APIs.',
		defaultProps: ['open?: boolean', 'class?: string', 'callbacks for open/close actions'],
		defaultDependencies: ['Development/debug routes where noted'],
		components: [
			{
				path: 'blocks/devtools/ApiExplorerBlock.svelte',
				previewMode: 'documented',
				dependencies: ['/api/debug-settings']
			},
			{ path: 'blocks/devtools/ComponentLibraryPreview.svelte', props: ['componentId: string'] },
			{ path: 'blocks/devtools/DesignSystemAd.svelte', props: ['onclick?: callback'] },
			{
				path: 'blocks/devtools/DesignSystemBrowser.svelte',
				props: ['open?: boolean', 'inline?: boolean', 'onclose?: callback']
			}
		]
	},
	{
		id: 'editor',
		name: 'Editor sections',
		description: 'Dev-only editor route sections and controls.',
		defaultPreviewMode: 'documented',
		defaultSummary: 'Editor-only component for homepage customization workflows.',
		defaultDescription:
			'Use inside the `/editor` experience, where editor state, project/article fixtures, and performance stores are already wired.',
		defaultProps: ['Editor-specific data props and callbacks'],
		defaultDependencies: ['Editor route state', 'Browser APIs', 'Performance analytics'],
		components: [
			{ path: 'editor/EditorAnalyticsSection.svelte' },
			{
				path: 'editor/EditorBlockPlaceholder.svelte',
				previewMode: 'live',
				props: ['label: string', 'description: string', 'tone?: "blue" | "yellow" | "green"']
			},
			{
				path: 'editor/EditorContentSection.svelte',
				dependencies: ['Project and article content fixtures', 'Save callbacks']
			},
			{ path: 'editor/EditorGridLegend.svelte', previewMode: 'mocked' },
			{
				path: 'editor/EditorGridSection.svelte',
				dependencies: ['Articles/projects data', 'Grid layout store', 'Performance analytics']
			},
			{ path: 'editor/EditorSettingsSection.svelte' },
			{ path: 'editor/EditorThemeSection.svelte' },
			{ path: 'editor/EditorVisitorsSection.svelte' }
		]
	},
	{
		id: 'panels',
		name: 'Reader and search panels',
		description: 'Overlay and panel components for article, project, tag, and omnibar workflows.',
		defaultPreviewMode: 'documented',
		defaultSummary: 'Panel component for browsing or reading app content.',
		defaultDescription:
			'Use with real article/project registries and navigation callbacks. The design page documents expected data and avoids hijacking navigation.',
		defaultProps: ['Content arrays, selected ids/slugs, open/close callbacks'],
		defaultDependencies: ['Article and project registries', 'Routing callbacks'],
		components: [
			{
				path: 'panels/ArticleReaderPanel.svelte',
				dependencies: ['Article list', 'Selected article slug', 'Markdown/article lookup']
			},
			{ path: 'panels/Articles.svelte', previewMode: 'mocked', props: ['articles?: Article[]'] },
			{ path: 'panels/Omnibar.svelte', dependencies: ['GridItem[]', 'Keyboard navigation'] },
			{
				path: 'panels/ProjectReaderPanel.svelte',
				dependencies: ['Project entries with markdown content']
			},
			{
				path: 'panels/TagDrawer.svelte',
				previewMode: 'mocked',
				props: ['open?: boolean', 'tag?: string', 'onclose?: callback']
			}
		]
	},
	{
		id: 'grids',
		name: 'Grid tiles and layouts',
		description: 'Homepage grid containers and selectable article/project tiles.',
		defaultPreviewMode: 'documented',
		defaultSummary: 'Grid component that depends on homepage layout contracts.',
		defaultDescription:
			'Use with homepage registry items and selection state. Standalone examples use documented fixtures to avoid mutating the live grid stores.',
		defaultProps: ['Grid item arrays', 'selected ids/slugs', 'selection callbacks'],
		defaultDependencies: ['Homepage registries', 'Grid layout store', 'Reader panel store'],
		components: [
			{ path: 'grids/FeaturedGrid.svelte' },
			{ path: 'grids/GridArticleTile.svelte', previewMode: 'mocked' },
			{ path: 'grids/GridProjectTile.svelte', previewMode: 'mocked' },
			{
				path: 'grids/MainGrid.svelte',
				dependencies: [
					'Grid layout store',
					'Pokemon settings',
					'Reader panel store',
					'Performance tracking'
				]
			}
		]
	},
	{
		id: 'hero',
		name: 'Hero and 3D scene',
		description: 'Homepage hero components and Threlte/Three-powered scene pieces.',
		defaultPreviewMode: 'documented',
		defaultSummary: 'Hero component with GPU/browser runtime requirements.',
		defaultDescription:
			'Use on client-rendered hero surfaces with motion and WebGL capabilities available. The design page documents tunables without mounting every scene by default.',
		defaultProps: ['Hero3D parameter overrides', 'effectsEnabled?: boolean'],
		defaultDependencies: ['Threlte', 'Three.js', 'Browser/WebGL', 'Texture assets'],
		components: [
			{ path: 'hero/Hero.svelte' },
			{ path: 'hero/Hero3D.svelte', props: ['sceneParams: Hero3DParams', 'resetKey?: string'] },
			{
				path: 'hero/Hero3DScene.svelte',
				props: ['mouseX?: number', 'mouseY?: number', 'sceneParams?: Hero3DParams']
			}
		]
	},
	{
		id: 'graphics',
		name: 'Graphics',
		description: 'Blob graphics and the creator block used for playful visual experiments.',
		defaultPreviewMode: 'live',
		defaultSummary: 'Decorative graphic component for visual texture and accent shapes.',
		defaultDescription:
			'Use for non-critical decorative accents. Keep accessible names on surrounding content instead of making these graphics semantic.',
		defaultProps: ['class?: string', 'fill?: string'],
		defaultDependencies: ['SVG rendering'],
		components: [
			{
				path: 'graphics/Blob.svelte',
				previewMode: 'documented',
				dependencies: ['Bloblet or Bloblet2 child graphic']
			},
			{ path: 'graphics/Bloblet.svelte' },
			{
				path: 'graphics/Bloblet2.svelte',
				previewMode: 'documented',
				dependencies: ['Console-logging hover experiment']
			},
			{
				path: 'graphics/Bloblet3.svelte',
				previewMode: 'documented',
				props: ['fill?: string', 'stroke?: string', 'strokeWidth?: number'],
				dependencies: ['@georgedoescode/spline', 'simplex-noise', 'Browser animation frame']
			},
			{ path: 'graphics/Bloblet4.svelte' },
			{
				path: 'graphics/BlobletCreatorBlock.svelte',
				previewMode: 'mocked',
				dependencies: ['ColorPicker state']
			}
		]
	},
	{
		id: 'dev',
		name: 'Developer controls',
		description: 'Low-level developer controls for theme/debug experimentation.',
		defaultPreviewMode: 'mocked',
		defaultSummary: 'Developer-only control component.',
		defaultDescription:
			'Use inside debug and editor surfaces where direct state manipulation is expected and visible to the developer.',
		defaultProps: ['open state, callbacks, or bindable values'],
		defaultDependencies: ['Development-only state'],
		components: [
			{
				path: 'dev/ColorPicker.svelte',
				previewMode: 'live',
				props: ['color?: string', 'onchange?: callback']
			},
			{
				path: 'dev/DebugMenu.svelte',
				previewMode: 'documented',
				dependencies: ['/api/debug-settings', 'Bindable header blend mode']
			}
		]
	}
];

function componentName(path: string) {
	return path.split('/').at(-1)?.replace('.svelte', '') ?? path;
}

function slugify(value: string) {
	return value
		.replace('.svelte', '')
		.replaceAll('/', '-')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

function defaultExample(path: string) {
	const name = componentName(path);
	return `<${name} />`;
}

function toComponentDoc(
	category: CategoryDefinition,
	definition: ComponentDefinition
): DesignComponentDoc {
	const name = componentName(definition.path);
	return {
		id: slugify(definition.path),
		name,
		categoryId: category.id,
		categoryName: category.name,
		sourcePath: `src/lib/components/${definition.path}`,
		summary: definition.summary ?? category.defaultSummary,
		description: definition.description ?? category.defaultDescription,
		props: definition.props ?? category.defaultProps,
		dependencies: definition.dependencies ?? category.defaultDependencies,
		previewMode: definition.previewMode ?? category.defaultPreviewMode,
		example: definition.example ?? defaultExample(definition.path)
	};
}

export const designComponentCategories: DesignComponentCategory[] = categoryDefinitions.map(
	(category) => ({
		id: category.id,
		name: category.name,
		description: category.description,
		components: category.components.map((component) => toComponentDoc(category, component))
	})
);

export const designComponents = designComponentCategories.flatMap(
	(category) => category.components
);

export const designComponentCount = designComponents.length;

export function getDesignComponentById(id: string) {
	return designComponents.find((component) => component.id === id) ?? null;
}
