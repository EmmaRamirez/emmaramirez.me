<section class="welcome-hero" aria-labelledby="welcome-hero-title">
	<h1 id="welcome-hero-title">welcome to my internet.</h1>
	<p>
		my name's emma and my biggest passion is making stuff with code. i'm into startups,
		fashion, finance, and AI.
	</p>
</section>

<style>
	.welcome-hero {
		display: flex;
		min-height: clamp(16rem, 42vw, 28rem);
		flex-direction: column;
		align-items: center;
		justify-content: center;
		grid-column: 1 / -1;
		gap: 1.5rem;
		text-align: center;
	}

	h1 {
		max-width: 12ch;
		color: var(--text-primary);
		font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
		font-size: clamp(4rem, 12vw, 9rem);
		font-weight: 500;
		line-height: 0.9;
	}

	p {
		max-width: 40rem;
		color: var(--text-secondary);
		font-size: clamp(1.05rem, 2vw, 1.35rem);
		line-height: 1.5;
	}
</style>
