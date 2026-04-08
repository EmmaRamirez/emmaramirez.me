import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import DesignSystemBrowser from './DesignSystemBrowser.svelte';

describe('DesignSystemBrowser', () => {
	it('opens a detailed view for documented components', async () => {
		render(DesignSystemBrowser, { props: { open: true, inline: true } });

		await page.getByRole('tab', { name: 'Components' }).click();
		await page.getByRole('button', { name: 'View Container details' }).click();

		await expect.element(page.getByRole('heading', { name: 'Container' })).toBeVisible();
		await expect
			.element(page.getByText('Constrains page width and horizontal padding for readable layouts.'))
			.toBeVisible();
		await expect.element(page.getByText('$lib/components/ui/Container.svelte')).toBeVisible();
		await expect.element(page.getByText('Controls horizontal gutter spacing.')).toBeVisible();
	});

	it('closes detail before closing the explorer on Escape', async () => {
		const onclose = vi.fn();

		render(DesignSystemBrowser, { props: { open: true, inline: true, onclose } });

		await page.getByRole('tab', { name: 'Components' }).click();
		await page.getByRole('button', { name: 'View Button details' }).click();

		await expect.element(page.getByRole('button', { name: 'Close details' })).toBeVisible();
		await expect.element(page.getByText('Documentation status')).toBeVisible();

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		await expect
			.element(page.getByRole('button', { name: 'Close details' }))
			.not.toBeInTheDocument();
		expect(onclose).not.toHaveBeenCalled();

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		expect(onclose).toHaveBeenCalledOnce();
	});
});
