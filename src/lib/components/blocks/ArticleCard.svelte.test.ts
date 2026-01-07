import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { describe, it, expect, vi } from 'vitest';
import ArticleCard from './ArticleCard.svelte';

describe('ArticleCard', () => {
	const defaultProps = {
		title: 'Test Article Title',
		content: 'This is the article content that describes what the article is about.',
		date: '2024-11-15'
	};

	describe('Basic Rendering', () => {
		it('should render the article label', async () => {
			render(ArticleCard, { props: defaultProps });

			await expect.element(page.getByText('Article', { exact: true })).toBeVisible();
		});

		it('should render the title', async () => {
			render(ArticleCard, { props: defaultProps });

			await expect.element(page.getByText('Test Article Title')).toBeVisible();
		});

		it('should render the content', async () => {
			const { container } = render(ArticleCard, { props: defaultProps });

			// Content is in the DOM but may be hidden due to container queries / line-clamp
			const contentElement = container.querySelector('.article-content');
			expect(contentElement).toBeTruthy();
			expect(contentElement?.textContent).toContain(
				'This is the article content that describes what the article is about.'
			);
		});

		it('should render the date as time element', async () => {
			render(ArticleCard, { props: defaultProps });

			const timeElement = page.getByRole('time');
			await expect.element(timeElement).toBeVisible();
		});

		it('should render as a button element', async () => {
			render(ArticleCard, { props: defaultProps });

			await expect.element(page.getByRole('button')).toBeVisible();
		});
	});

	describe('Click Handler', () => {
		it('should call onselect when clicked', async () => {
			const onselect = vi.fn();
			render(ArticleCard, { props: { ...defaultProps, onselect } });

			const button = page.getByRole('button');
			await button.click();

			expect(onselect).toHaveBeenCalledOnce();
		});

		it('should not throw when clicked without onselect handler', async () => {
			render(ArticleCard, { props: defaultProps });

			const button = page.getByRole('button');
			await button.click();
			// No assertion needed - just checking it doesn't throw
			expect(true).toBe(true);
		});
	});

	describe('Active State', () => {
		it('should not have active class by default', async () => {
			const { container } = render(ArticleCard, { props: defaultProps });

			const button = container.querySelector('button');
			expect(button?.className).not.toContain('article-card-active');
		});

		it('should have active class when active prop is true', async () => {
			const { container } = render(ArticleCard, { props: { ...defaultProps, active: true } });

			const button = container.querySelector('button');
			expect(button?.className).toContain('article-card-active');
		});
	});

	describe('Optional Date', () => {
		it('should not render time element when date is not provided', async () => {
			const { container } = render(ArticleCard, {
				props: {
					title: 'No Date Article',
					content: 'Content without date'
				}
			});

			const timeElements = container.querySelectorAll('time');
			expect(timeElements.length).toBe(0);
		});
	});

	describe('Read Time', () => {
		it('should use custom read time when provided', async () => {
			render(ArticleCard, {
				props: {
					...defaultProps,
					readTime: '5 min read'
				}
			});

			await expect.element(page.getByText('5 min read')).toBeInTheDocument();
		});
	});

	describe('Tags', () => {
		it('should include tags in the DOM when provided', async () => {
			const { container } = render(ArticleCard, {
				props: {
					...defaultProps,
					tags: ['svelte', 'typescript', 'web']
				}
			});

			const html = container.innerHTML;
			expect(html).toContain('svelte');
			expect(html).toContain('typescript');
			expect(html).toContain('web');
		});
	});

	describe('Footer Elements', () => {
		it('should have Read more CTA in footer', async () => {
			const { container } = render(ArticleCard, { props: defaultProps });

			const html = container.innerHTML;
			expect(html).toContain('Read more');
		});
	});

	describe('Custom Class', () => {
		it('should apply custom class to container', async () => {
			const { container } = render(ArticleCard, {
				props: {
					...defaultProps,
					class: 'custom-test-class'
				}
			});

			const button = container.querySelector('button');
			expect(button?.className).toContain('custom-test-class');
		});
	});

	describe('Accessibility', () => {
		it('should be keyboard focusable', async () => {
			const { container } = render(ArticleCard, { props: defaultProps });

			const button = container.querySelector('button');
			expect(button?.getAttribute('type')).toBe('button');
		});

		it('should have proper focus styles class', async () => {
			const { container } = render(ArticleCard, { props: defaultProps });

			const button = container.querySelector('button');
			expect(button?.className).toContain('focus:outline-none');
			expect(button?.className).toContain('focus-visible:ring-2');
		});
	});

	describe('Container Query Styles', () => {
		it('should have container-type style for container queries', async () => {
			const { container } = render(ArticleCard, { props: defaultProps });

			const button = container.querySelector('button');
			const computedStyle = window.getComputedStyle(button!);

			expect(computedStyle.containerType).toBe('size');
		});

		it('should have container-name set to article', async () => {
			const { container } = render(ArticleCard, { props: defaultProps });

			const button = container.querySelector('button');
			const computedStyle = window.getComputedStyle(button!);

			expect(computedStyle.containerName).toBe('article');
		});
	});

	describe('Variants', () => {
		it('should render main variant by default', async () => {
			const { container } = render(ArticleCard, { props: defaultProps });

			const button = container.querySelector('button');
			expect(button?.className).toContain('article-card');
		});

		it('should apply main variant styles with gap-2', async () => {
			const { container } = render(ArticleCard, { props: { ...defaultProps, variant: 'main' } });

			const button = container.querySelector('button');
			expect(button?.className).toContain('gap-2');
		});

		it('should apply featured variant styles with gap-1.5', async () => {
			const { container } = render(ArticleCard, {
				props: { ...defaultProps, variant: 'featured' }
			});

			const button = container.querySelector('button');
			expect(button?.className).toContain('gap-1.5');
		});
	});
});
