<script lang="ts">
	import {
		Card,
		Container,
		Divider,
		Flex,
		Grid,
		Icon,
		PageShell,
		Section,
		Stack,
		Typography
	} from '$lib/components/ui';

	interface Props {
		componentId: string;
	}

	let { componentId }: Props = $props();
</script>

{#if componentId === 'typography'}
	<div class="preview-frame">
		<Stack gap="sm">
			<Typography variant="h4">Design systems feel calmer with hierarchy.</Typography>
			<Typography variant="p" color="muted">
				Body copy stays readable while still matching the site voice.
			</Typography>
			<Typography variant="code">npm run check</Typography>
			<Typography variant="link" href="/blog">Read the writing archive</Typography>
		</Stack>
	</div>
{:else if componentId === 'icon'}
	<div class="preview-frame">
		<Flex gap="md">
			<Icon size="sm" aria-label="Sparkle icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
				</svg>
			</Icon>
			<Icon size="md" aria-label="Heart icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path
						d="M12 21s-6.7-4.4-9-8.2C1.1 9.8 2.5 6 6.3 6c2 0 3.2 1 4.1 2.2C11.3 7 12.5 6 14.5 6c3.8 0 5.2 3.8 3.3 6.8C18.7 16.6 12 21 12 21z"
					/>
				</svg>
			</Icon>
			<Icon size="lg">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="8" />
					<path d="M12 8v4l3 3" />
				</svg>
			</Icon>
		</Flex>
	</div>
{:else if componentId === 'container'}
	<div class="preview-frame preview-frame--bleed">
		<Container size="md" padding="sm">
			<div class="preview-outline">
				<Typography variant="small" color="muted">Centered content with shared gutters</Typography>
			</div>
		</Container>
	</div>
{:else if componentId === 'section'}
	<div class="preview-frame preview-frame--bleed">
		<Section spacing="sm" background="muted" aria-label="Preview section">
			<div class="preview-outline">
				<Typography variant="small">Muted section surface</Typography>
			</div>
		</Section>
		<Section spacing="sm">
			<div class="preview-outline preview-outline--subtle">
				<Typography variant="small" color="muted">Transparent section with spacing only</Typography>
			</div>
		</Section>
	</div>
{:else if componentId === 'page-shell'}
	<div class="preview-frame preview-shell">
		{#snippet shellHeader()}
			<div class="preview-shell__bar">Header</div>
		{/snippet}
		{#snippet shellFooter()}
			<div class="preview-shell__bar preview-shell__bar--footer">Footer</div>
		{/snippet}
		<PageShell
			header={shellHeader}
			footer={shellFooter}
			class="overflow-hidden rounded-lg border border-(--border-color)"
		>
			<div class="preview-shell__main">Main content</div>
		</PageShell>
	</div>
{:else if componentId === 'grid'}
	<div class="preview-frame">
		<Grid cols={1} colsSm={2} gap="sm">
			<div class="preview-tile">One</div>
			<div class="preview-tile">Two</div>
			<div class="preview-tile">Three</div>
			<div class="preview-tile">Four</div>
		</Grid>
	</div>
{:else if componentId === 'stack'}
	<div class="preview-frame">
		<Stack gap="sm">
			<div class="preview-line">Profile</div>
			<div class="preview-line">Notifications</div>
			<div class="preview-line">Appearance</div>
		</Stack>
	</div>
{:else if componentId === 'flex'}
	<div class="preview-frame">
		<Flex gap="sm" wrap="wrap" justify="between">
			<div class="preview-chip">Filters</div>
			<div class="preview-chip">Sort</div>
			<div class="preview-chip">Export</div>
		</Flex>
	</div>
{:else if componentId === 'divider'}
	<div class="preview-frame">
		<Typography variant="small">Above the divider</Typography>
		<Divider spacing="sm" />
		<Flex align="stretch" class="h-12">
			<div class="preview-column">Left</div>
			<Divider orientation="vertical" spacing="sm" />
			<div class="preview-column">Right</div>
		</Flex>
	</div>
{:else if componentId === 'card'}
	<div class="preview-frame">
		{#snippet cardHeader()}
			<Typography variant="small" weight="semibold">Card header</Typography>
		{/snippet}
		{#snippet cardFooter()}
			<Typography variant="small" color="muted">Footer actions or metadata</Typography>
		{/snippet}
		<Card variant="outlined" header={cardHeader} footer={cardFooter}>
			<Typography variant="p">Grouped content lives comfortably inside a shared surface.</Typography
			>
		</Card>
	</div>
{:else}
	<div class="preview-frame preview-frame--empty">
		<Typography variant="small" color="muted">
			Live preview for this component is coming soon.
		</Typography>
	</div>
{/if}

<style>
	.preview-frame {
		display: grid;
		gap: 0.75rem;
		padding: 1rem;
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.75rem;
		background: var(--card-bg);
	}

	.preview-frame--bleed {
		padding: 0;
		overflow: hidden;
	}

	.preview-frame--empty {
		min-height: 8rem;
		place-items: center;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--card-bg) 92%, white),
			var(--card-bg)
		);
	}

	.preview-outline {
		border: 0.125rem dashed var(--border-color);
		border-radius: 0.75rem;
		padding: 0.875rem;
		margin: 0.75rem;
		background: color-mix(in srgb, var(--page-bg-subtle) 82%, white);
	}

	.preview-outline--subtle {
		background: transparent;
	}

	.preview-shell {
		padding: 0;
		overflow: hidden;
	}

	.preview-shell__bar {
		padding: 0.625rem 0.875rem;
		background: var(--header-bg);
		border-bottom: 0.0625rem solid var(--border-color);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.preview-shell__bar--footer {
		border-top: 0.0625rem solid var(--border-color);
		border-bottom: none;
	}

	.preview-shell__main {
		padding: 1rem;
		min-height: 5rem;
		display: grid;
		place-items: center;
		color: var(--text-primary);
		background: color-mix(in srgb, var(--page-bg-subtle) 85%, white);
	}

	.preview-tile,
	.preview-line,
	.preview-chip,
	.preview-column {
		border: 0.0625rem solid var(--border-color);
		border-radius: 0.625rem;
		padding: 0.75rem;
		background: color-mix(in srgb, var(--page-bg-subtle) 88%, white);
		color: var(--text-primary);
		font-size: 0.875rem;
	}

	.preview-line {
		padding-block: 0.625rem;
	}

	.preview-chip {
		border-radius: 9999px;
		padding: 0.5rem 0.875rem;
	}

	.preview-column {
		display: grid;
		place-items: center;
		flex: 1;
	}
</style>
