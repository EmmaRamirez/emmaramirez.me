<script lang="ts">
	import { editorGridLegendItems } from './editorGridMeta';
</script>

<div class="legend">
	<h4>Legend</h4>
	<div class="legend-items">
		{#each editorGridLegendItems as item (item.label)}
			<div class="legend-item">
				<span class="legend-color" style={`background: ${item.color}`}></span>
				<span>{item.label}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border: 1px solid var(--border-color);
		border-radius: 0.75rem;
		background: var(--surface);
	}

	.legend h4 {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.legend-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1rem;
	}

	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.legend-color {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 999px;
	}
</style>
