<script lang="ts">
	type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type AvatarShape = 'circle' | 'square';

	interface AvatarProps {
		/** Custom class names */
		class?: string;
		/** Image source URL */
		src?: string;
		/** Alt text for image */
		alt?: string;
		/** Fallback text (usually initials) when no image */
		fallback?: string;
		/** Size of the avatar */
		size?: AvatarSize;
		/** Shape of the avatar */
		shape?: AvatarShape;
	}

	let {
		class: className = '',
		src,
		alt = '',
		fallback = '',
		size = 'md',
		shape = 'circle'
	}: AvatarProps = $props();

	let imageError = $state(false);

	const sizeClasses: Record<AvatarSize, { container: string; text: string }> = {
		xs: { container: 'h-6 w-6', text: 'text-xs' },
		sm: { container: 'h-8 w-8', text: 'text-sm' },
		md: { container: 'h-10 w-10', text: 'text-base' },
		lg: { container: 'h-12 w-12', text: 'text-lg' },
		xl: { container: 'h-16 w-16', text: 'text-xl' }
	};

	const shapeClasses: Record<AvatarShape, string> = {
		circle: 'rounded-full',
		square: 'rounded-lg'
	};

	const initials = $derived(
		fallback
			.split(' ')
			.map(word => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	);

	const showImage = $derived(src && !imageError);
	const showFallback = $derived(!showImage);

	const baseClasses = "inline-flex items-center justify-center overflow-hidden shrink-0";
	const combinedClasses = `${baseClasses} ${sizeClasses[size].container} ${shapeClasses[shape]} ${className}`.trim();
</script>

<span class={combinedClasses}>
	{#if showImage}
		<img
			{src}
			{alt}
			class="h-full w-full object-cover"
			onerror={() => imageError = true}
		/>
	{:else if showFallback}
		<span 
			class="flex h-full w-full items-center justify-center bg-[var(--caroline-blue-600)] text-white font-medium {sizeClasses[size].text}"
			aria-label={alt || fallback}
		>
			{initials || '?'}
		</span>
	{/if}
</span>

