<script lang="ts">
	interface BlobletProps {
		class?: string;
		fill?: string;
	    }

	let { class: className, fill = 'var(--magic-mint-500)' }: BlobletProps = $props();
</script>

<svg
	class={className}
	
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M76.6612 281.097C189.495 205.083 337.577 37.3636 254.716 7.96718C171.855 -21.4292 219.95 43.969 100.042 3.341C-19.8662 -37.287 -36.1724 357.11 76.6612 281.097Z"
		fill={fill}
	/>
</svg>
