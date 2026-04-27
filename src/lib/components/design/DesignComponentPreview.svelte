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
		Container,
		DescriptionList,
		Divider,
		EmptyState,
		FileInput,
		Flex,
		Grid,
		Icon,
		Input,
		LinkButton,
		List,
		ListItem,
		PageShell,
		Pagination,
		ProgressBar,
		Radio,
		SearchField,
		Section,
		Select,
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
	import ComponentLibraryPreview from '$lib/components/blocks/devtools/ComponentLibraryPreview.svelte';
	import DesignSystemAd from '$lib/components/blocks/devtools/DesignSystemAd.svelte';
	import DesignSystemBrowser from '$lib/components/blocks/devtools/DesignSystemBrowser.svelte';
	import CityCard from '$lib/components/blocks/location/CityCard.svelte';
	import CommitBlock from '$lib/components/blocks/site/CommitBlock.svelte';
	import EditorBlockPlaceholder from '$lib/components/editor/EditorBlockPlaceholder.svelte';
	import Bloblet from '$lib/components/graphics/Bloblet.svelte';
	import Bloblet4 from '$lib/components/graphics/Bloblet4.svelte';
	import ColorPicker from '$lib/components/dev/ColorPicker.svelte';

	interface Props {
		component: DesignComponentDoc;
	}

	let { component }: Props = $props();
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

	function noop() {
		// Preview callbacks intentionally do nothing.
	}
</script>

<div class="design-preview" data-preview-mode={component.previewMode}>
	{#if component.previewMode === 'documented'}
		<div class="design-preview__guard">
			<p class="design-preview__eyebrow">Documented-only example</p>
			<p>
				This component is intentionally not mounted on the design page because it depends on runtime
				services, editor state, heavy animation, or app navigation.
			</p>
		</div>
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

	<div class="design-preview__usage">
		<p class="design-preview__eyebrow">Example</p>
		<pre><code>{component.example}</code></pre>
	</div>
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
</style>
