import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import DesignSystemBrowser from './DesignSystemBrowser.svelte';

function mountDesignSystemBrowser(props: {
	open?: boolean;
	inline?: boolean;
	onclose?: () => void;
}) {
	const target = document.createElement('div');
	document.body.appendChild(target);
	return render(DesignSystemBrowser, { target, props });
}

describe('DesignSystemBrowser', () => {
	it('renders the popup chrome with a blank workspace', async () => {
		mountDesignSystemBrowser({ open: true, inline: true });

		await expect
			.element(page.getByRole('heading', { name: 'EMZINNIA Design System' }))
			.toBeVisible();
		await expect.element(page.getByLabelText('Design system workspace')).toBeVisible();
		await expect.element(page.getByRole('tab', { name: 'Overview' })).not.toBeInTheDocument();
		await expect.element(page.getByText('Featured Components')).not.toBeInTheDocument();
	});

	it('closes the browser on Escape', async () => {
		const onclose = vi.fn();

		mountDesignSystemBrowser({ open: true, inline: true, onclose });

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		expect(onclose).toHaveBeenCalledOnce();
	});
});
