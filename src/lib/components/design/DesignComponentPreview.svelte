<script lang="ts">
	import type { DesignComponentDoc } from '$lib/registry/designComponents';
	import {
		Accordion,
		Alert,
		Avatar,
		Badge,
		Breadcrumbs,
		Button,
		ButtonGroup,
		Card,
		Carousel,
		Checkbox,
		Collapse,
		Combobox,
		Container,
		DatePicker,
		DescriptionList,
		Divider,
		DropdownMenu,
		EmptyState,
		FileInput,
		Flex,
		Grid,
		Icon,
		IconButton,
		InlineValidation,
		Input,
		LinkButton,
		List,
		ListItem,
		Navbar,
		PageShell,
		Pagination,
		Popover,
		ProgressBar,
		Radio,
		SearchField,
		Section,
		Select,
		Sidebar,
		Slider,
		Spinner,
		Stack,
		Statistic,
		Stepper,
		Switch,
		Table,
		Tabs,
		Tag,
		Textarea,
		ThemeToggle,
		Tooltip,
		Typography
	} from '$lib/components/ui';
	import Header from '$lib/components/ui/header/Header.svelte';
	import HeaderLogo from '$lib/components/ui/header/HeaderLogo.svelte';
	import HeaderLogoMark from '$lib/components/ui/header/HeaderLogoMark.svelte';
	import HeaderNav from '$lib/components/ui/header/HeaderNav.svelte';
	import HeaderNavItem from '$lib/components/ui/header/HeaderNavItem.svelte';
	import ApiExplorerBlock from '$lib/components/blocks/devtools/ApiExplorerBlock.svelte';
	import ComponentLibraryPreview from '$lib/components/blocks/devtools/ComponentLibraryPreview.svelte';
	import DesignSystemAd from '$lib/components/blocks/devtools/DesignSystemAd.svelte';
	import DesignSystemBrowser from '$lib/components/blocks/devtools/DesignSystemBrowser.svelte';
	import ArticleBlock from '$lib/components/blocks/content/ArticleBlock.svelte';
	import ArticleCard from '$lib/components/blocks/content/ArticleCard.svelte';
	import ProjectBlock from '$lib/components/blocks/content/ProjectBlock.svelte';
	import CityCard from '$lib/components/blocks/location/CityCard.svelte';
	import LocationBlock from '$lib/components/blocks/location/LocationBlock.svelte';
	import RootDiscoBlock from '$lib/components/blocks/DiscoBlock.svelte';
	import MediaDiscoBlock from '$lib/components/blocks/media/DiscoBlock.svelte';
	import ImageBlock from '$lib/components/blocks/media/ImageBlock.svelte';
	import PokemonBlock from '$lib/components/blocks/personal/PokemonBlock.svelte';
	import TopLanguages from '$lib/components/blocks/personal/TopLanguages.svelte';
	import CommitBlock from '$lib/components/blocks/site/CommitBlock.svelte';
	import HomeBlock from '$lib/components/blocks/site/HomeBlock.svelte';
	import InterestsBlock from '$lib/components/blocks/site/InterestsBlock.svelte';
	import ThisSiteBlock from '$lib/components/blocks/site/ThisSiteBlock.svelte';
	import EditorAnalyticsSection from '$lib/components/editor/EditorAnalyticsSection.svelte';
	import EditorBlockPlaceholder from '$lib/components/editor/EditorBlockPlaceholder.svelte';
	import EditorContentSection from '$lib/components/editor/EditorContentSection.svelte';
	import EditorGridLegend from '$lib/components/editor/EditorGridLegend.svelte';
	import EditorGridSection from '$lib/components/editor/EditorGridSection.svelte';
	import EditorSettingsSection from '$lib/components/editor/EditorSettingsSection.svelte';
	import EditorThemeSection from '$lib/components/editor/EditorThemeSection.svelte';
	import EditorVisitorsSection from '$lib/components/editor/EditorVisitorsSection.svelte';
	import Articles from '$lib/components/panels/Articles.svelte';
	import FeaturedGrid from '$lib/components/grids/FeaturedGrid.svelte';
	import GridArticleTile from '$lib/components/grids/GridArticleTile.svelte';
	import GridProjectTile from '$lib/components/grids/GridProjectTile.svelte';
	import Blob from '$lib/components/graphics/Blob.svelte';
	import Bloblet from '$lib/components/graphics/Bloblet.svelte';
	import Bloblet2 from '$lib/components/graphics/Bloblet2.svelte';
	import Bloblet4 from '$lib/components/graphics/Bloblet4.svelte';
	import ColorPicker from '$lib/components/dev/ColorPicker.svelte';

	interface Props {
		component: DesignComponentDoc;
		minimal?: boolean;
	}

	let { component, minimal = false }: Props = $props();
	let activeTab = $state('preview');
	const tabs = [
		{ id: 'preview', label: 'Preview' },
		{ id: 'usage', label: 'Usage' }
	];

	const selectOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' }
	];

	const tableColumns = [
		{ key: 'token', header: 'Token', sortable: true },
		{ key: 'role', header: 'Role' }
	];

	const tableRows = [
		{ token: 'caroline-blue', role: 'Primary action' },
		{ token: 'sandy-tan', role: 'Warm surface' }
	];

	const steps = [
		{ id: 'draft', label: 'Draft', description: 'Write the content' },
		{ id: 'review', label: 'Review', description: 'Check the details' },
		{ id: 'ship', label: 'Ship', description: 'Publish it' }
	];

	const accordionItems = [
		{ id: 'usage', title: 'Usage guidance', content: 'Keep examples small and focused.' },
		{ id: 'a11y', title: 'Accessibility', content: 'Prefer semantic labels and keyboard support.' }
	];

	const colorOptions = [
		'var(--caroline-blue-700)',
		'var(--transit-yellow-500)',
		'var(--magic-mint-500)'
	];

	const comboboxOptions = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' }
	];

	const dropdownItems = [
		{ id: 'edit', label: 'Edit' },
		{ id: 'duplicate', label: 'Duplicate' },
		{ id: 'archive', label: 'Archive', danger: true }
	];

	const navbarBrand = 'EMZINNIA';

	const sidebarItems = [
		{ label: 'Components', href: '/design' },
		{ label: 'Articles', href: '/blog' }
	];

	const mockArticle = {
		id: 'design-system-launch',
		slug: 'design-system-launch',
		title: 'Launching the design system',
		content: 'A small post about how the design system came together.',
		date: '2026-04-26',
		tags: ['design', 'svelte']
	};

	const mockArticles = [mockArticle];

	const mockProject = {
		kind: 'project' as const,
		id: 'site' as const,
		title: 'emzinnia.dev',
		pill: 'this site',
		image: '/projects/site.png',
		description: 'A personal site, design system, and writing surface.'
	};

	const mockPokemonTeam = [
		{ id: 25, name: 'Pikachu' },
		{ id: 133, name: 'Eevee' }
	];

	function noop() {
		// Preview callbacks intentionally do nothing.
	}
</script>

<div
	class="design-preview"
	class:design-preview--minimal={minimal}
	data-preview-mode={component.previewMode}
>
	{#if component.previewMode === 'documented'}
		{#if minimal}
			<div class="design-preview__minimal-placeholder">
				<span class="design-preview__minimal-name">{component.name}</span>
				<span class="design-preview__minimal-note">Documented only</span>
			</div>
		{:else}
			<div class="design-preview__guard">
				<p class="design-preview__eyebrow">Documented-only example</p>
				<p>
					This component is intentionally not mounted on the design page because it depends on
					runtime services, editor state, heavy animation, or app navigation.
				</p>
			</div>
		{/if}
	{:else if component.sourcePath === 'src/lib/components/ui/Button.svelte'}
		<Flex gap="sm" wrap="wrap">
			<Button size="sm">Primary</Button>
			<Button variant="secondary" size="sm">Secondary</Button>
			<Button variant="outline" size="sm">Outline</Button>
			<Button variant="ghost" size="sm">Ghost</Button>
		</Flex>
	{:else if component.sourcePath === 'src/lib/components/ui/ButtonGroup.svelte'}
		<ButtonGroup>
			<Button size="sm">Save</Button>
			<Button variant="secondary" size="sm">Preview</Button>
		</ButtonGroup>
	{:else if component.sourcePath === 'src/lib/components/ui/Badge.svelte'}
		<Flex gap="sm" wrap="wrap">
			<Badge>Default</Badge>
			<Badge variant="primary">Primary</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
		</Flex>
	{:else if component.sourcePath === 'src/lib/components/ui/Tag.svelte'}
		<Flex gap="sm" wrap="wrap">
			<Tag>design</Tag>
			<Tag variant="primary">svelte</Tag>
			<Tag variant="warning" removable onremove={noop}>draft</Tag>
		</Flex>
	{:else if component.sourcePath === 'src/lib/components/ui/Alert.svelte'}
		<Alert title="Design note">Use alerts for contextual feedback that should stay in flow.</Alert>
	{:else if component.sourcePath === 'src/lib/components/ui/Avatar.svelte'}
		<Flex gap="sm" align="center">
			<Avatar fallback="ER" />
			<Avatar fallback="EZ" size="lg" shape="square" />
		</Flex>
	{:else if component.sourcePath === 'src/lib/components/ui/Card.svelte'}
		{#snippet cardHeader()}
			<strong>Component card</strong>
		{/snippet}
		{#snippet cardFooter()}
			<span class="text-sm text-(--text-muted)">Footer metadata</span>
		{/snippet}
		<Card variant="outlined" header={cardHeader} footer={cardFooter}>
			Cards group related controls or content into one surface.
		</Card>
	{:else if component.sourcePath === 'src/lib/components/ui/Typography.svelte'}
		<Stack gap="xs">
			<Typography variant="h3">Design hierarchy</Typography>
			<Typography color="muted">Readable body copy with semantic color.</Typography>
			<Typography variant="code">npm run check</Typography>
		</Stack>
	{:else if component.sourcePath === 'src/lib/components/ui/Icon.svelte'}
		<Icon aria-label="Sparkle icon" size="lg">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
			</svg>
		</Icon>
	{:else if component.sourcePath === 'src/lib/components/ui/Input.svelte'}
		<Input label="Project name" value="Design archive" />
	{:else if component.sourcePath === 'src/lib/components/ui/Textarea.svelte'}
		<Textarea label="Notes" value="Document the component behavior and expected props." rows={3} />
	{:else if component.sourcePath === 'src/lib/components/ui/Select.svelte'}
		<Select label="Status" options={selectOptions} value="draft" />
	{:else if component.sourcePath === 'src/lib/components/ui/Checkbox.svelte'}
		<Checkbox label="Include accessibility notes" checked />
	{:else if component.sourcePath === 'src/lib/components/ui/Radio.svelte'}
		<Radio name="density" value="compact" group="compact" label="Compact density" />
	{:else if component.sourcePath === 'src/lib/components/ui/Switch.svelte'}
		<Switch label="Show live previews" checked />
	{:else if component.sourcePath === 'src/lib/components/ui/Slider.svelte'}
		<Slider label="Preview width" value={72} />
	{:else if component.sourcePath === 'src/lib/components/ui/SearchField.svelte'}
		<SearchField placeholder="Search components" value="button" />
	{:else if component.sourcePath === 'src/lib/components/ui/FileInput.svelte'}
		<FileInput label="Upload asset" accept="image/*" />
	{:else if component.sourcePath === 'src/lib/components/ui/Spinner.svelte'}
		<Spinner aria-label="Loading preview" />
	{:else if component.sourcePath === 'src/lib/components/ui/ProgressBar.svelte'}
		<ProgressBar value={64} showLabel aria-label="Documentation progress" />
	{:else if component.sourcePath === 'src/lib/components/ui/Statistic.svelte'}
		<Statistic label="Components documented" value="108" trend="up" trendValue="Complete" />
	{:else if component.sourcePath === 'src/lib/components/ui/Table.svelte'}
		<Table columns={tableColumns} data={tableRows} />
	{:else if component.sourcePath === 'src/lib/components/ui/Tabs.svelte'}
		<Tabs {tabs} bind:activeTab>
			{#snippet children(tab)}
				<p class="text-sm text-(--text-muted)">Active tab: {tab}</p>
			{/snippet}
		</Tabs>
	{:else if component.sourcePath === 'src/lib/components/ui/Accordion.svelte'}
		<Accordion items={accordionItems} defaultOpen={['usage']} />
	{:else if component.sourcePath === 'src/lib/components/ui/Carousel.svelte'}
		<Carousel slideCount={3} showDots showArrows={false}>
			{#snippet children(index)}
				<div class="design-preview__slide">Slide {index + 1}</div>
			{/snippet}
		</Carousel>
	{:else if component.sourcePath === 'src/lib/components/ui/Pagination.svelte'}
		<Pagination currentPage={2} totalPages={5} onchange={noop} />
	{:else if component.sourcePath === 'src/lib/components/ui/Stepper.svelte'}
		<Stepper {steps} currentStep={1} />
	{:else if component.sourcePath === 'src/lib/components/ui/Breadcrumbs.svelte'}
		<Breadcrumbs
			items={[
				{ label: 'Home', href: '/' },
				{ label: 'Design', href: '/design' },
				{ label: component.name }
			]}
		/>
	{:else if component.sourcePath === 'src/lib/components/ui/DescriptionList.svelte'}
		<DescriptionList
			items={[
				{ term: 'Source', description: component.sourcePath },
				{ term: 'Mode', description: component.previewMode }
			]}
			dividers
		/>
	{:else if component.sourcePath === 'src/lib/components/ui/List.svelte'}
		<List>
			<ListItem description="Primary navigation surface">Header</ListItem>
			<ListItem description="Documentation surface">Design page</ListItem>
		</List>
	{:else if component.sourcePath === 'src/lib/components/ui/ListItem.svelte'}
		<ul class="rounded-lg border border-(--border-color)">
			<ListItem description="A single row with optional secondary text">Component entry</ListItem>
		</ul>
	{:else if component.sourcePath === 'src/lib/components/ui/Container.svelte'}
		<Container size="sm" padding="sm">
			<div class="design-preview__outline">Constrained content</div>
		</Container>
	{:else if component.sourcePath === 'src/lib/components/ui/Section.svelte'}
		<Section spacing="sm" background="muted" aria-label="Preview section">
			<div class="design-preview__outline">Section content</div>
		</Section>
	{:else if component.sourcePath === 'src/lib/components/ui/Flex.svelte'}
		<Flex gap="sm" wrap="wrap">
			<span class="design-preview__chip">One</span>
			<span class="design-preview__chip">Two</span>
			<span class="design-preview__chip">Three</span>
		</Flex>
	{:else if component.sourcePath === 'src/lib/components/ui/Grid.svelte'}
		<Grid cols={2} gap="sm">
			<div class="design-preview__tile">A</div>
			<div class="design-preview__tile">B</div>
			<div class="design-preview__tile">C</div>
			<div class="design-preview__tile">D</div>
		</Grid>
	{:else if component.sourcePath === 'src/lib/components/ui/Stack.svelte'}
		<Stack gap="xs">
			<div class="design-preview__line"></div>
			<div class="design-preview__line design-preview__line--short"></div>
			<div class="design-preview__line"></div>
		</Stack>
	{:else if component.sourcePath === 'src/lib/components/ui/Divider.svelte'}
		<div>
			<p>Above</p>
			<Divider spacing="sm" />
			<p>Below</p>
		</div>
	{:else if component.sourcePath === 'src/lib/components/ui/PageShell.svelte'}
		{#snippet shellHeader()}
			<div class="design-preview__bar">Header</div>
		{/snippet}
		{#snippet shellFooter()}
			<div class="design-preview__bar">Footer</div>
		{/snippet}
		<PageShell header={shellHeader} footer={shellFooter}>
			<div class="design-preview__shell-main">Main content</div>
		</PageShell>
	{:else if component.sourcePath === 'src/lib/components/ui/EmptyState.svelte'}
		<EmptyState
			title="Nothing selected"
			description="Choose a component to see implementation notes."
		/>
	{:else if component.sourcePath === 'src/lib/components/ui/LinkButton.svelte'}
		<LinkButton href="/design" variant="outline">Open design page</LinkButton>
	{:else if component.sourcePath === 'src/lib/components/ui/ThemeToggle.svelte'}
		<ThemeToggle />
	{:else if component.sourcePath === 'src/lib/components/ui/Tooltip.svelte'}
		<Tooltip text="Tooltip copy explains a control.">
			<Button variant="outline" size="sm">Hover for context</Button>
		</Tooltip>
	{:else if component.sourcePath === 'src/lib/components/ui/header/Header.svelte'}
		<Header>
			<HeaderLogo>Design</HeaderLogo>
			<HeaderNav>
				<HeaderNavItem href="/design" active>Components</HeaderNavItem>
				<HeaderNavItem href="/">Site</HeaderNavItem>
			</HeaderNav>
		</Header>
	{:else if component.sourcePath === 'src/lib/components/ui/header/HeaderLogo.svelte'}
		<HeaderLogo>EMZINNIA</HeaderLogo>
	{:else if component.sourcePath === 'src/lib/components/ui/header/HeaderLogoMark.svelte'}
		<HeaderLogoMark />
	{:else if component.sourcePath === 'src/lib/components/ui/header/HeaderNav.svelte'}
		<HeaderNav>
			<HeaderNavItem href="/design" active>Design</HeaderNavItem>
			<HeaderNavItem href="/blog">Blog</HeaderNavItem>
		</HeaderNav>
	{:else if component.sourcePath === 'src/lib/components/ui/header/HeaderNavItem.svelte'}
		<HeaderNav>
			<HeaderNavItem href="/design" active>Active item</HeaderNavItem>
		</HeaderNav>
	{:else if component.sourcePath === 'src/lib/components/blocks/devtools/ComponentLibraryPreview.svelte'}
		<ComponentLibraryPreview componentId="button" />
	{:else if component.sourcePath === 'src/lib/components/blocks/devtools/DesignSystemAd.svelte'}
		<DesignSystemAd onclick={noop} />
	{:else if component.sourcePath === 'src/lib/components/blocks/devtools/DesignSystemBrowser.svelte'}
		<DesignSystemBrowser open inline onclose={noop} />
	{:else if component.sourcePath === 'src/lib/components/blocks/location/CityCard.svelte'}
		<CityCard
			photo="/projects/nuzlocke-generator.png"
			description="A compact location card with media and copy."
		/>
	{:else if component.sourcePath === 'src/lib/components/blocks/site/CommitBlock.svelte'}
		<CommitBlock
			title="Document design route"
			date="Apr 26, 2026"
			hash="abc1234"
			class="max-w-sm"
		/>
	{:else if component.sourcePath === 'src/lib/components/editor/EditorBlockPlaceholder.svelte'}
		<EditorBlockPlaceholder
			label="Editor preview"
			description="Placeholder used by editor-only sections."
		/>
	{:else if component.sourcePath === 'src/lib/components/graphics/Bloblet.svelte'}
		<Bloblet class="h-28 w-28" fill="var(--caroline-blue-500)" />
	{:else if component.sourcePath === 'src/lib/components/graphics/Bloblet4.svelte'}
		<Bloblet4 class="h-28 w-28" fill="var(--magic-mint-500)" />
	{:else if component.sourcePath === 'src/lib/components/dev/ColorPicker.svelte'}
		<ColorPicker
			label="Accent"
			name="accent"
			value="var(--caroline-blue-700)"
			colors={colorOptions}
			onColorChange={noop}
		/>
	{:else if component.sourcePath === 'src/lib/components/ui/Collapse.svelte'}
		<Collapse title="Implementation notes" open>
			<p class="text-sm">Wraps content in a collapsible panel with an aria-expanded button.</p>
		</Collapse>
	{:else if component.sourcePath === 'src/lib/components/ui/Combobox.svelte'}
		<Combobox label="Framework" options={comboboxOptions} value="svelte" />
	{:else if component.sourcePath === 'src/lib/components/ui/CommandPalette.svelte'}
		<div class="design-mock design-mock--palette">
			<div class="design-mock__bar">
				<span class="design-mock__kbd">⌘K</span>
				<span class="design-mock__placeholder">Search commands…</span>
			</div>
			<ul class="design-mock__list">
				<li>Open design page</li>
				<li>Toggle theme</li>
				<li>Search components</li>
			</ul>
		</div>
	{:else if component.sourcePath === 'src/lib/components/ui/DatePicker.svelte'}
		<DatePicker label="Publish date" />
	{:else if component.sourcePath === 'src/lib/components/ui/Drawer.svelte'}
		<div class="design-mock design-mock--drawer">
			<div class="design-mock__panel">
				<header>Drawer title</header>
				<div class="design-mock__line"></div>
				<div class="design-mock__line design-mock__line--short"></div>
			</div>
		</div>
	{:else if component.sourcePath === 'src/lib/components/ui/DropdownMenu.svelte'}
		{#snippet ddTrigger()}
			<Button size="sm" variant="outline">Actions ▾</Button>
		{/snippet}
		<DropdownMenu items={dropdownItems} trigger={ddTrigger} onselect={noop} />
	{:else if component.sourcePath === 'src/lib/components/ui/IconButton.svelte'}
		<IconButton aria-label="Star" variant="primary">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
			</svg>
		</IconButton>
	{:else if component.sourcePath === 'src/lib/components/ui/InlineValidation.svelte'}
		<Stack gap="xs">
			<InlineValidation status="error" message="Title is required" />
			<InlineValidation status="success" message="Slug is available" />
		</Stack>
	{:else if component.sourcePath === 'src/lib/components/ui/Modal.svelte'}
		<div class="design-mock design-mock--modal">
			<div class="design-mock__panel">
				<header>Modal title</header>
				<div class="design-mock__line"></div>
				<div class="design-mock__line design-mock__line--short"></div>
				<footer>
					<span class="design-mock__btn">Cancel</span>
					<span class="design-mock__btn design-mock__btn--primary">Confirm</span>
				</footer>
			</div>
		</div>
	{:else if component.sourcePath === 'src/lib/components/ui/Navbar.svelte'}
		{#snippet navBrand()}
			<strong>{navbarBrand}</strong>
		{/snippet}
		{#snippet navLinks()}
			<a href="/" class="text-sm">Home</a>
			<a href="/design" class="text-sm">Design</a>
		{/snippet}
		<Navbar brand={navBrand} nav={navLinks} />
	{:else if component.sourcePath === 'src/lib/components/ui/Popover.svelte'}
		{#snippet popoverTrigger()}
			<Button size="sm" variant="outline">Open popover</Button>
		{/snippet}
		<Popover trigger={popoverTrigger}>
			<p class="text-sm">Popover content stays out of the document flow.</p>
		</Popover>
	{:else if component.sourcePath === 'src/lib/components/ui/Sidebar.svelte'}
		<Sidebar width="14rem">
			<List>
				{#each sidebarItems as item (item.href)}
					<ListItem>{item.label}</ListItem>
				{/each}
			</List>
		</Sidebar>
	{:else if component.sourcePath === 'src/lib/components/ui/SiteSearch.svelte'}
		<div class="design-mock design-mock--search">
			<div class="design-mock__bar">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm9 16-4.5-4.5"
					/>
				</svg>
				<span class="design-mock__placeholder">Search the site</span>
				<span class="design-mock__kbd">/</span>
			</div>
		</div>
	{:else if component.sourcePath === 'src/lib/components/ui/Toast.svelte'}
		<div class="design-mock design-mock--toast">
			<div class="design-mock__toast-row">
				<span class="design-mock__dot" data-tone="success"></span>
				<span>Saved successfully</span>
			</div>
			<div class="design-mock__toast-row">
				<span class="design-mock__dot" data-tone="info"></span>
				<span>Component documented</span>
			</div>
		</div>
	{:else if component.sourcePath === 'src/lib/components/blocks/DiscoBlock.svelte'}
		<RootDiscoBlock
			image="/projects/disco.jpeg"
			alt="Disco ball"
			caption="Disco"
			class=""
			effectsEnabled={false}
		/>
	{:else if component.sourcePath === 'src/lib/components/blocks/media/DiscoBlock.svelte'}
		<MediaDiscoBlock
			image="/projects/disco.jpeg"
			alt="Disco ball"
			caption="Disco"
			class=""
			effectsEnabled={false}
		/>
	{:else if component.sourcePath === 'src/lib/components/blocks/content/ArticleBlock.svelte'}
		<ArticleBlock
			title="Designing the index"
			content="A small note about how component galleries help us reason about UI."
			date="2026-04-26"
			tags={['design']}
		/>
	{:else if component.sourcePath === 'src/lib/components/blocks/content/ArticleCard.svelte'}
		<ArticleCard
			title="Designing the index"
			content="A small note about how component galleries help us reason about UI."
			date="2026-04-26"
		/>
	{:else if component.sourcePath === 'src/lib/components/blocks/content/ProjectBlock.svelte'}
		{#snippet projectDescription()}
			<p class="text-sm">A personal site, design system, and writing surface.</p>
		{/snippet}
		<ProjectBlock title="emzinnia.dev" pill="site" description={projectDescription} />
	{:else if component.sourcePath === 'src/lib/components/blocks/location/LocationBlock.svelte'}
		<div class="design-mock design-mock--location">
			<div class="design-mock__map"></div>
			<div class="design-mock__map-pin"></div>
			<span class="design-mock__placeholder">North America map (Mapbox)</span>
		</div>
	{:else if component.sourcePath === 'src/lib/components/blocks/media/ImageBlock.svelte'}
		<ImageBlock image="/projects/site.png" alt="Site preview" caption="Site cover" class="" />
	{:else if component.sourcePath === 'src/lib/components/blocks/personal/PokemonBlock.svelte'}
		<PokemonBlock team={mockPokemonTeam} effectsEnabled={false} />
	{:else if component.sourcePath === 'src/lib/components/blocks/personal/TopLanguages.svelte'}
		<TopLanguages effectsEnabled={false} />
	{:else if component.sourcePath === 'src/lib/components/blocks/personal/TopLanguagesLoader.svelte'}
		<div class="design-mock design-mock--loader">
			<Spinner aria-label="Loading languages" />
			<span class="design-mock__placeholder">Fetches /api/github/top-languages on mount</span>
		</div>
	{:else if component.sourcePath === 'src/lib/components/blocks/site/HomeBlock.svelte'}
		<HomeBlock />
	{:else if component.sourcePath === 'src/lib/components/blocks/site/InterestsBlock.svelte'}
		<InterestsBlock />
	{:else if component.sourcePath === 'src/lib/components/blocks/site/ThisSiteBlock.svelte'}
		<ThisSiteBlock />
	{:else if component.sourcePath === 'src/lib/components/blocks/devtools/ApiExplorerBlock.svelte'}
		<ApiExplorerBlock onopen={noop} onclose={noop} />
	{:else if component.sourcePath === 'src/lib/components/editor/EditorAnalyticsSection.svelte'}
		<EditorAnalyticsSection />
	{:else if component.sourcePath === 'src/lib/components/editor/EditorContentSection.svelte'}
		<EditorContentSection projects={[]} articles={[]} />
	{:else if component.sourcePath === 'src/lib/components/editor/EditorGridLegend.svelte'}
		<EditorGridLegend />
	{:else if component.sourcePath === 'src/lib/components/editor/EditorGridSection.svelte'}
		<EditorGridSection articles={[]} projects={[]} />
	{:else if component.sourcePath === 'src/lib/components/editor/EditorSettingsSection.svelte'}
		<EditorSettingsSection />
	{:else if component.sourcePath === 'src/lib/components/editor/EditorThemeSection.svelte'}
		<EditorThemeSection />
	{:else if component.sourcePath === 'src/lib/components/editor/EditorVisitorsSection.svelte'}
		<EditorVisitorsSection />
	{:else if component.sourcePath === 'src/lib/components/panels/ArticleReaderPanel.svelte'}
		<div class="design-mock design-mock--reader">
			<div class="design-mock__panel design-mock__panel--reader">
				<p class="design-mock__eyebrow">Article</p>
				<h4>Designing the index</h4>
				<div class="design-mock__line"></div>
				<div class="design-mock__line design-mock__line--short"></div>
				<div class="design-mock__line"></div>
			</div>
		</div>
	{:else if component.sourcePath === 'src/lib/components/panels/Articles.svelte'}
		<Articles articles={mockArticles} />
	{:else if component.sourcePath === 'src/lib/components/panels/Omnibar.svelte'}
		<div class="design-mock design-mock--palette">
			<div class="design-mock__bar">
				<span class="design-mock__kbd">⌘K</span>
				<span class="design-mock__placeholder">Search articles &amp; projects…</span>
			</div>
			<ul class="design-mock__list">
				<li>Article — Designing the index</li>
				<li>Project — emzinnia.dev</li>
			</ul>
		</div>
	{:else if component.sourcePath === 'src/lib/components/panels/ProjectReaderPanel.svelte'}
		<div class="design-mock design-mock--reader">
			<div class="design-mock__panel design-mock__panel--reader">
				<p class="design-mock__eyebrow">Project</p>
				<h4>emzinnia.dev</h4>
				<div class="design-mock__line"></div>
				<div class="design-mock__line design-mock__line--short"></div>
				<div class="design-mock__line"></div>
			</div>
		</div>
	{:else if component.sourcePath === 'src/lib/components/panels/TagDrawer.svelte'}
		<div class="design-mock design-mock--drawer">
			<div class="design-mock__panel">
				<header>#design</header>
				<div class="design-mock__line"></div>
				<div class="design-mock__line design-mock__line--short"></div>
				<div class="design-mock__line"></div>
			</div>
		</div>
	{:else if component.sourcePath === 'src/lib/components/grids/FeaturedGrid.svelte'}
		<FeaturedGrid
			items={[
				{ kind: 'article', article: mockArticle },
				{ kind: 'project', project: mockProject }
			]}
			selectedArticleSlug={null}
			selectedProjectId={null}
			articlePanelOpen={false}
			projectPanelOpen={false}
			onArticleClick={noop}
			onProjectClick={noop}
		/>
	{:else if component.sourcePath === 'src/lib/components/grids/GridArticleTile.svelte'}
		<GridArticleTile article={mockArticle} />
	{:else if component.sourcePath === 'src/lib/components/grids/GridProjectTile.svelte'}
		<GridProjectTile project={mockProject} />
	{:else if component.sourcePath === 'src/lib/components/grids/MainGrid.svelte'}
		<div class="design-mock design-mock--grid">
			<div class="design-mock__grid-cell"></div>
			<div class="design-mock__grid-cell design-mock__grid-cell--wide"></div>
			<div class="design-mock__grid-cell design-mock__grid-cell--tall"></div>
			<div class="design-mock__grid-cell"></div>
			<div class="design-mock__grid-cell"></div>
			<span class="design-mock__placeholder">Bento grid (homepage layout)</span>
		</div>
	{:else if component.sourcePath === 'src/lib/components/hero/Hero.svelte'}
		<div class="design-mock design-mock--hero">
			<div class="design-mock__hero-orb"></div>
			<div class="design-mock__hero-text">
				<strong>Hero</strong>
				<span>Static fallback / Threlte canvas</span>
			</div>
		</div>
	{:else if component.sourcePath === 'src/lib/components/hero/Hero3D.svelte'}
		<div class="design-mock design-mock--hero">
			<div class="design-mock__hero-orb"></div>
			<span class="design-mock__placeholder">Threlte 3D scene</span>
		</div>
	{:else if component.sourcePath === 'src/lib/components/hero/Hero3DScene.svelte'}
		<div class="design-mock design-mock--hero">
			<div class="design-mock__hero-orb"></div>
			<span class="design-mock__placeholder">Three.js shader (mounts inside Hero3D Canvas)</span>
		</div>
	{:else if component.sourcePath === 'src/lib/components/graphics/Blob.svelte'}
		<Blob class="h-28 w-28" fill="var(--caroline-blue-500)" />
	{:else if component.sourcePath === 'src/lib/components/graphics/Bloblet2.svelte'}
		<Bloblet2 class="h-28 w-28" fill="var(--magic-mint-500)" />
	{:else if component.sourcePath === 'src/lib/components/graphics/Bloblet3.svelte'}
		<div class="design-mock design-mock--blob">
			<div class="design-mock__blob"></div>
			<span class="design-mock__placeholder">Requires @georgedoescode/spline</span>
		</div>
	{:else if component.sourcePath === 'src/lib/components/dev/DebugMenu.svelte'}
		<div class="design-mock design-mock--modal">
			<div class="design-mock__panel">
				<header>Debug menu</header>
				<div class="design-mock__line"></div>
				<div class="design-mock__line design-mock__line--short"></div>
				<footer>
					<span class="design-mock__btn">Reset</span>
					<span class="design-mock__btn design-mock__btn--primary">Save</span>
				</footer>
			</div>
		</div>
	{:else if minimal}
		<div class="design-preview__minimal-placeholder">
			<span class="design-preview__minimal-name">{component.name}</span>
		</div>
	{:else}
		<div class="design-preview__guard">
			<p class="design-preview__eyebrow">
				{component.previewMode === 'live' ? 'Example contract' : 'Mocked example'}
			</p>
			<p>
				Use the documented props below to mount this component in its app context. This preview
				keeps side effects, routing changes, and network calls out of the gallery.
			</p>
		</div>
	{/if}

	{#if !minimal}
		<div class="design-preview__usage">
			<p class="design-preview__eyebrow">Example</p>
			<pre><code>{component.example}</code></pre>
		</div>
	{/if}
</div>

<style>
	.design-preview {
		--p-text: #e9eaff;
		--p-muted: rgba(225, 226, 255, 0.62);
		--p-subtle: rgba(225, 226, 255, 0.42);
		--p-border: rgba(255, 255, 255, 0.1);
		--p-border-strong: rgba(255, 255, 255, 0.18);
		--p-orb-from: #2d4ad4;
		--p-orb-via: #9936b6;
		--p-orb-pink: #d73a82;
		--p-orb-to: #f9614c;
		--p-orb-mint: #f2b1c9;

		position: relative;
		display: grid;
		gap: 1rem;
		padding: 1.25rem;
		border: 0.0625rem solid var(--p-border);
		border-radius: 1rem;
		background:
			radial-gradient(circle at 80% 0%, rgba(45, 74, 212, 0.08), transparent 60%),
			radial-gradient(circle at 0% 100%, rgba(217, 58, 130, 0.07), transparent 55%),
			rgba(10, 11, 26, 0.55);
		color: var(--p-text);
		overflow: hidden;
	}

	.design-preview--minimal {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: inherit;
		overflow: visible;
		max-width: 100%;
	}

	.design-preview--minimal[data-preview-mode='live'],
	.design-preview--minimal[data-preview-mode='mocked'],
	.design-preview--minimal[data-preview-mode='documented'] {
		border-color: transparent;
	}

	.design-preview__minimal-placeholder {
		display: grid;
		gap: 0.25rem;
		text-align: center;
		color: rgba(225, 226, 255, 0.42);
	}

	.design-preview__minimal-name {
		font-family:
			'JetBrains Mono',
			ui-monospace,
			SFMono-Regular,
			SF Mono,
			Menlo,
			Consolas,
			Liberation Mono,
			monospace;
		font-size: 0.75rem;
		color: rgba(225, 226, 255, 0.6);
	}

	.design-preview__minimal-note {
		font-size: 0.6875rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(225, 226, 255, 0.32);
	}

	.design-preview[data-preview-mode='live'] {
		border-color: rgba(184, 255, 229, 0.18);
	}

	.design-preview[data-preview-mode='mocked'] {
		border-color: rgba(45, 74, 212, 0.28);
	}

	.design-preview[data-preview-mode='documented'] {
		border-color: rgba(215, 58, 130, 0.22);
	}

	.design-preview__guard,
	.design-preview__usage,
	.design-preview__outline,
	.design-preview__tile,
	.design-preview__bar,
	.design-preview__shell-main {
		border: 0.0625rem dashed var(--p-border-strong);
		border-radius: 0.75rem;
		background: rgba(20, 21, 45, 0.55);
		color: var(--p-muted);
	}

	.design-preview__guard {
		padding: 1rem;
	}

	.design-preview__usage {
		display: grid;
		gap: 0.5rem;
		padding: 0.875rem;
		border-style: solid;
		background: rgba(10, 11, 26, 0.7);
	}

	.design-preview__usage pre {
		overflow-x: auto;
		margin: 0;
		font-family:
			'JetBrains Mono',
			ui-monospace,
			SFMono-Regular,
			SF Mono,
			Menlo,
			Consolas,
			Liberation Mono,
			monospace;
		font-size: 0.8125rem;
		line-height: 1.55;
		color: var(--p-text);
	}

	.design-preview__eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--p-orb-mint);
	}

	.design-preview__eyebrow::before {
		content: '';
		display: inline-block;
		width: 0.3125rem;
		height: 0.3125rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, var(--p-orb-from), var(--p-orb-pink));
		box-shadow: 0 0 0.4rem rgba(217, 58, 130, 0.7);
	}

	.design-preview__slide {
		display: grid;
		min-height: 7rem;
		place-items: center;
		border-radius: 0.75rem;
		background: linear-gradient(135deg, rgba(45, 74, 212, 0.45), rgba(153, 54, 182, 0.45));
		border: 0.0625rem solid rgba(255, 255, 255, 0.1);
		font-weight: 700;
		color: #fff;
	}

	.design-preview__outline,
	.design-preview__tile,
	.design-preview__shell-main {
		padding: 1rem;
		text-align: center;
	}

	.design-preview__chip {
		border: 0.0625rem solid var(--p-border-strong);
		border-radius: 9999px;
		padding: 0.5rem 0.875rem;
		background: rgba(20, 21, 45, 0.7);
		color: var(--p-text);
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.design-preview__line {
		height: 0.625rem;
		border-radius: 9999px;
		background: linear-gradient(
			90deg,
			rgba(45, 74, 212, 0.4),
			rgba(153, 54, 182, 0.4),
			rgba(217, 58, 130, 0.4)
		);
		opacity: 0.7;
	}

	.design-preview__line--short {
		width: 68%;
	}

	.design-preview__bar {
		border-radius: 0.5rem;
		border-style: solid;
		padding: 0.625rem 0.875rem;
		font-weight: 700;
		color: var(--p-text);
		background: rgba(28, 30, 58, 0.7);
	}

	/* ===== Inline mocks for overlay-only / heavy components ===== */

	.design-mock {
		position: relative;
		display: grid;
		gap: 0.5rem;
		width: 100%;
		max-width: 18rem;
		padding: 0.875rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.12);
		border-radius: 0.625rem;
		background: rgba(20, 21, 45, 0.7);
		color: rgba(225, 226, 255, 0.85);
		font-size: 0.8125rem;
	}

	.design-mock__bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.625rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.1);
		border-radius: 0.375rem;
		background: rgba(0, 0, 0, 0.35);
	}

	.design-mock__bar svg {
		width: 0.875rem;
		height: 0.875rem;
		color: rgba(225, 226, 255, 0.55);
	}

	.design-mock__placeholder {
		color: rgba(225, 226, 255, 0.55);
		font-size: 0.75rem;
		flex: 1;
	}

	.design-mock__kbd {
		display: inline-grid;
		place-items: center;
		min-width: 1.25rem;
		padding: 0.0625rem 0.375rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.18);
		border-radius: 0.25rem;
		background: rgba(0, 0, 0, 0.4);
		color: rgba(225, 226, 255, 0.7);
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.6875rem;
	}

	.design-mock__list {
		list-style: none;
		display: grid;
		gap: 0.25rem;
		margin: 0;
		padding: 0;
		font-size: 0.75rem;
	}

	.design-mock__list li {
		padding: 0.375rem 0.5rem;
		border-radius: 0.25rem;
		background: rgba(0, 0, 0, 0.25);
		color: rgba(225, 226, 255, 0.78);
	}

	.design-mock__panel {
		display: grid;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.16);
		border-radius: 0.5rem;
		background: rgba(28, 30, 58, 0.85);
	}

	.design-mock__panel header {
		font-weight: 700;
		color: var(--p-text);
	}

	.design-mock__panel footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.375rem;
		padding-top: 0.375rem;
		border-top: 0.0625rem solid rgba(255, 255, 255, 0.08);
	}

	.design-mock__line {
		height: 0.5rem;
		border-radius: 9999px;
		background: linear-gradient(
			90deg,
			rgba(45, 74, 212, 0.35),
			rgba(153, 54, 182, 0.35),
			rgba(217, 58, 130, 0.35)
		);
		opacity: 0.7;
	}

	.design-mock__line--short {
		width: 60%;
	}

	.design-mock__btn {
		padding: 0.25rem 0.625rem;
		border: 0.0625rem solid rgba(255, 255, 255, 0.18);
		border-radius: 0.25rem;
		background: rgba(0, 0, 0, 0.3);
		color: rgba(225, 226, 255, 0.85);
		font-size: 0.6875rem;
	}

	.design-mock__btn--primary {
		background: linear-gradient(135deg, var(--p-orb-from), var(--p-orb-via));
		border-color: transparent;
		color: #fff;
		font-weight: 600;
	}

	.design-mock--drawer .design-mock__panel {
		max-width: 12rem;
		margin-left: auto;
	}

	.design-mock--reader .design-mock__panel--reader {
		gap: 0.4rem;
	}

	.design-mock__eyebrow {
		margin: 0;
		color: var(--p-orb-mint);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.design-mock__panel h4 {
		margin: 0;
		font-family: 'DM Serif Text', serif;
		font-weight: 400;
		font-size: 1.125rem;
	}

	.design-mock--toast {
		display: grid;
		gap: 0.375rem;
		padding: 0.625rem;
	}

	.design-mock__toast-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.625rem;
		border-radius: 0.375rem;
		background: rgba(28, 30, 58, 0.95);
		border: 0.0625rem solid rgba(255, 255, 255, 0.1);
		font-size: 0.75rem;
	}

	.design-mock__dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: rgba(225, 226, 255, 0.6);
	}

	.design-mock__dot[data-tone='success'] {
		background: #69e8b8;
	}

	.design-mock__dot[data-tone='info'] {
		background: #6a8fff;
	}

	.design-mock--location {
		min-height: 7rem;
		overflow: hidden;
		padding: 0;
	}

	.design-mock__map {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 30% 40%, rgba(106, 143, 255, 0.32), transparent 40%),
			radial-gradient(circle at 70% 60%, rgba(105, 232, 184, 0.28), transparent 45%),
			repeating-linear-gradient(
				45deg,
				rgba(255, 255, 255, 0.04) 0,
				rgba(255, 255, 255, 0.04) 0.0625rem,
				transparent 0.0625rem,
				transparent 0.5rem
			),
			#0e1230;
	}

	.design-mock__map-pin {
		position: absolute;
		top: 45%;
		left: 50%;
		width: 0.625rem;
		height: 0.625rem;
		border-radius: 9999px;
		background: var(--p-orb-pink);
		box-shadow: 0 0 0 0.25rem rgba(217, 58, 130, 0.3);
	}

	.design-mock--location .design-mock__placeholder {
		position: absolute;
		bottom: 0.5rem;
		left: 0.625rem;
		text-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.6);
	}

	.design-mock--grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 1.5rem;
		gap: 0.25rem;
		padding: 0.625rem;
	}

	.design-mock__grid-cell {
		grid-column: span 1;
		grid-row: span 1;
		border-radius: 0.25rem;
		background: linear-gradient(135deg, rgba(106, 143, 255, 0.35), rgba(217, 58, 130, 0.25));
	}

	.design-mock__grid-cell--wide {
		grid-column: span 2;
	}

	.design-mock__grid-cell--tall {
		grid-row: span 2;
	}

	.design-mock--grid .design-mock__placeholder {
		grid-column: 1 / -1;
		text-align: center;
	}

	.design-mock--hero {
		display: grid;
		place-items: center;
		gap: 0.5rem;
		min-height: 7rem;
		padding: 1rem;
		text-align: center;
	}

	.design-mock__hero-orb {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 9999px;
		background: radial-gradient(
			circle at 30% 30%,
			var(--p-orb-from),
			var(--p-orb-via) 50%,
			var(--p-orb-pink)
		);
		box-shadow: 0 0 1.25rem rgba(217, 58, 130, 0.45);
	}

	.design-mock__hero-text {
		display: grid;
		gap: 0.125rem;
	}

	.design-mock__hero-text strong {
		font-family: 'DM Serif Text', serif;
		font-weight: 400;
		font-size: 1.125rem;
	}

	.design-mock__hero-text span {
		font-size: 0.6875rem;
		color: rgba(225, 226, 255, 0.55);
	}

	.design-mock--loader {
		display: grid;
		place-items: center;
		gap: 0.5rem;
		min-height: 6rem;
		text-align: center;
	}

	.design-mock--blob {
		display: grid;
		place-items: center;
		gap: 0.375rem;
		min-height: 6rem;
		text-align: center;
	}

	.design-mock__blob {
		width: 3rem;
		height: 3rem;
		border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
		background: linear-gradient(135deg, var(--p-orb-from), var(--p-orb-pink));
		filter: blur(0.0625rem);
	}

	/* Minimal-mode trims to actual content (no chrome) */
	.design-preview--minimal .design-mock {
		border: 0;
		background: transparent;
		padding: 0;
		max-width: 100%;
	}
</style>
