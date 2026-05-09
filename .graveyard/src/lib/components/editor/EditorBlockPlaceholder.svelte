<script lang="ts">
	interface Props {
		label: string;
		description: string;
		tone?: 'blue' | 'violet' | 'amber';
		class?: string;
	}

	let { label, description, tone = 'blue', class: className = '' }: Props = $props();
</script>

<div class={`editor-block-placeholder editor-block-placeholder--${tone} ${className}`}>
	<div class="editor-block-placeholder__glow" aria-hidden="true"></div>
	<div class="editor-block-placeholder__content">
		<p class="editor-block-placeholder__label">{label}</p>
		<p class="editor-block-placeholder__description">{description}</p>
	</div>
</div>

<style>
	.editor-block-placeholder {
		position: relative;
		display: flex;
		height: 100%;
		width: 100%;
		min-height: 7.5rem;
		overflow: hidden;
		border-radius: 1rem;
		border: 0.0625rem solid color-mix(in srgb, var(--border-color) 72%, transparent);
		background:
			radial-gradient(circle at top right, rgba(255, 255, 255, 0.12), transparent 30%),
			linear-gradient(180deg, color-mix(in srgb, var(--surface) 88%, transparent), var(--card-bg));
	}

	.editor-block-placeholder--blue {
		--editor-block-glow: rgba(84, 139, 255, 0.22);
	}

	.editor-block-placeholder--violet {
		--editor-block-glow: rgba(152, 103, 255, 0.24);
	}

	.editor-block-placeholder--amber {
		--editor-block-glow: rgba(245, 158, 11, 0.22);
	}

	.editor-block-placeholder__glow {
		position: absolute;
		inset: -20%;
		background: radial-gradient(circle at center, var(--editor-block-glow), transparent 55%);
		pointer-events: none;
	}

	.editor-block-placeholder__content {
		position: relative;
		z-index: 1;
		display: grid;
		align-content: end;
		gap: 0.4rem;
		padding: 1rem;
	}

	.editor-block-placeholder__label {
		margin: 0;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.editor-block-placeholder__description {
		margin: 0;
		max-width: 18rem;
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--text-primary);
		text-wrap: balance;
	}
</style>
