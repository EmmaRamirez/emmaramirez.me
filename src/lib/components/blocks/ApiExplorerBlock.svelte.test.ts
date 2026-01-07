import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { describe, it, expect, vi } from 'vitest';
import ApiExplorerBlock from './ApiExplorerBlock.svelte';

describe('ApiExplorerBlock', () => {
	describe('Collapsed State (Ad Mode)', () => {
		it('should render the ad when closed', async () => {
			render(ApiExplorerBlock, { props: { open: false } });

			await expect.element(page.getByText('API Explorer')).toBeVisible();
			await expect.element(page.getByText('Open Explorer')).toBeVisible();
			await expect
				.element(page.getByText("Discover and test the site's internal API endpoints."))
				.toBeVisible();
		});

		it('should call onopen when ad is clicked', async () => {
			const onopen = vi.fn();
			render(ApiExplorerBlock, { props: { open: false, onopen } });

			const button = page.getByRole('button');
			await button.click();

			expect(onopen).toHaveBeenCalledOnce();
		});

		it('should have accessible button', async () => {
			render(ApiExplorerBlock, { props: { open: false } });

			await expect.element(page.getByRole('button')).toBeVisible();
		});
	});

	describe('Expanded State', () => {
		it('should render the explorer when open', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			await expect.element(page.getByRole('region', { name: /API Explorer/i })).toBeVisible();
			await expect.element(page.getByText('Test and explore endpoints')).toBeVisible();
		});

		it('should show close button when open', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			await expect
				.element(page.getByRole('button', { name: /Close API explorer/i }))
				.toBeVisible();
		});

		it('should call onclose when close button is clicked', async () => {
			const onclose = vi.fn();
			render(ApiExplorerBlock, { props: { open: true, onclose } });

			const closeButton = page.getByRole('button', { name: /Close API explorer/i });
			await closeButton.click();

			expect(onclose).toHaveBeenCalledOnce();
		});

		it('should render all three tabs', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			await expect.element(page.getByRole('tab', { name: 'Endpoints' })).toBeVisible();
			await expect.element(page.getByRole('tab', { name: 'Try It' })).toBeVisible();
			await expect.element(page.getByRole('tab', { name: 'Schemas' })).toBeVisible();
		});

		it('should show Endpoints tab content by default', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			await expect
				.element(page.getByText('Available API endpoints on this site.'))
				.toBeVisible();
		});
	});

	describe('Endpoints Tab', () => {
		it('should display GET and PUT endpoints', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			await expect.element(page.getByText('GET').first()).toBeVisible();
			await expect.element(page.getByText('PUT')).toBeVisible();
		});

		it('should display endpoint descriptions', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			await expect
				.element(page.getByText('Fetch current debug settings including hero 3D parameters'))
				.toBeVisible();
			await expect.element(page.getByText('Update debug settings with new values')).toBeVisible();
		});
	});

	describe('Try It Tab', () => {
		it('should show Send Request button when Try It tab is clicked', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			const tryItTab = page.getByRole('tab', { name: 'Try It' });
			await tryItTab.click();

			await expect.element(page.getByRole('button', { name: 'Send Request' })).toBeVisible();
		});

		it('should disable Send Request button when no endpoint is selected', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			const tryItTab = page.getByRole('tab', { name: 'Try It' });
			await tryItTab.click();

			const sendButton = page.getByRole('button', { name: 'Send Request' });
			await expect.element(sendButton).toBeDisabled();
		});
	});

	describe('Schemas Tab', () => {
		it('should display schema information when Schemas tab is clicked', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			const schemasTab = page.getByRole('tab', { name: 'Schemas' });
			await schemasTab.click();

			await expect.element(page.getByText('TypeScript schemas used by the API.')).toBeVisible();
		});

		it('should display DebugSettings schema', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			const schemasTab = page.getByRole('tab', { name: 'Schemas' });
			await schemasTab.click();

			await expect.element(page.getByText('DebugSettings')).toBeVisible();
			await expect.element(page.getByText('headerBlendMode')).toBeVisible();
		});

		it('should display Hero3DParams schema', async () => {
			render(ApiExplorerBlock, { props: { open: true } });

			const schemasTab = page.getByRole('tab', { name: 'Schemas' });
			await schemasTab.click();

			await expect
				.element(page.getByRole('heading', { name: 'Hero3DParams' }))
				.toBeVisible();
			await expect.element(page.getByText('depthScale')).toBeVisible();
		});
	});

	describe('Keyboard Navigation', () => {
		it('should close on Escape key when open', async () => {
			const onclose = vi.fn();
			render(ApiExplorerBlock, { props: { open: true, onclose } });

			// Simulate Escape key press
			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			window.dispatchEvent(event);

			expect(onclose).toHaveBeenCalledOnce();
		});

		it('should not call onclose on Escape when closed', async () => {
			const onclose = vi.fn();
			render(ApiExplorerBlock, { props: { open: false, onclose } });

			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			window.dispatchEvent(event);

			expect(onclose).not.toHaveBeenCalled();
		});
	});
});
