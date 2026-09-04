import { expect, test } from '@playwright/test';

test('the machine renders with all its components', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByTestId('machine')).toBeVisible();
	await expect(page.getByTestId('plugboard')).toBeVisible();
	await expect(page.getByTestId('entry-wheel')).toBeVisible();
	await expect(page.getByTestId('rotor-0')).toBeVisible();
	await expect(page.getByTestId('rotor-1')).toBeVisible();
	await expect(page.getByTestId('rotor-2')).toBeVisible();
	await expect(page.getByTestId('reflector')).toBeVisible();
	await expect(page.getByTestId('lampboard')).toBeVisible();
	await expect(page.getByTestId('keyboard')).toBeVisible();
});

test('the machine is laid out within the page, not overflowing it', async ({ page }) => {
	await page.goto('/');

	// The case renders as a bounded panel rather than sprawling across the
	// viewport — this is what a stray unconstrained element would break.
	const machine = page.getByTestId('machine');
	const box = await machine.boundingBox();

	expect(box).not.toBeNull();
	expect(box!.width).toBeLessThanOrEqual(800);
	expect(
		await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
	).toBe(false);
});

test('clicking a key on the machine enciphers that letter and lights its lamp', async ({
	page,
}) => {
	await page.goto('/');

	await page.getByTestId('key-A').click();

	// 'A' is the first letter of the reference phrase's machine state, so this
	// is the same substitution the engine's own tests pin down.
	await expect(page.getByTestId('ciphertext-output')).toHaveText('Q');
	await expect(page.getByTestId('lamp-Q')).toHaveClass(/lamp--lit/);
	await expect(page.getByTestId('lamp-A')).not.toHaveClass(/lamp--lit/);
});

test('the rotor window advances as keys are struck', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByTestId('rotor-2')).toHaveText(/A/);

	await page.getByTestId('key-A').click();
	await expect(page.getByTestId('rotor-2')).toHaveText(/B/);

	await page.getByTestId('key-A').click();
	await expect(page.getByTestId('rotor-2')).toHaveText(/C/);
});

test('typing a full phrase produces the correct ciphertext, including a stripped space', async ({
	page,
}) => {
	await page.goto('/');

	await page.getByTestId('plaintext-input').fill('NEVER GONNA GIVE YOU UP');

	await expect(page.getByTestId('ciphertext-output')).toHaveText('YQBUNEVTVMPZZWRISJW');
	await expect(page.getByTestId('skipped-count')).toHaveText('4'); // 4 spaces in the phrase
});

test('encrypt/decrypt symmetry holds through the rendered UI', async ({ page, context }) => {
	await page.goto('/');
	await page.getByTestId('plaintext-input').fill('NEVER GONNA GIVE YOU UP');
	const ciphertext = await page.getByTestId('ciphertext-output').innerText();

	const decryptPage = await context.newPage();
	await decryptPage.goto('/');
	await decryptPage.getByTestId('plaintext-input').fill(ciphertext);

	await expect(decryptPage.getByTestId('ciphertext-output')).toHaveText('NEVERGONNAGIVEYOUUP');
});

test('the whole machine fits a laptop viewport without scrolling', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 800 });
	await page.goto('/');

	// You have to be able to see the rotors and lamps while typing beside them.
	// The written sections below the fold are expected to extend the page, so
	// this measures the machine itself rather than the whole document.
	const machine = await page.getByTestId('machine').boundingBox();

	expect(machine).not.toBeNull();
	expect(machine!.y + machine!.height).toBeLessThanOrEqual(800);

	await expect(page.getByTestId('plugboard')).toBeInViewport();
	await expect(page.getByTestId('rotor-0')).toBeInViewport();
	await expect(page.getByTestId('plaintext-input')).toBeInViewport();
});

test('deleting characters re-enciphers instead of leaving stale output', async ({ page }) => {
	await page.goto('/');

	const input = page.getByTestId('plaintext-input');
	await input.fill('ENIGMA');
	const full = await page.getByTestId('ciphertext-output').innerText();

	await input.fill('ENI');

	await expect(page.getByTestId('ciphertext-output')).toHaveText(full.slice(0, 3));
});

test('reset clears the message and winds the rotors back', async ({ page }) => {
	await page.goto('/');

	await page.getByTestId('plaintext-input').fill('ENIGMA');
	await expect(page.getByTestId('rotor-2')).not.toHaveText(/A/);

	await page.getByTestId('reset').click();

	await expect(page.getByTestId('plaintext-input')).toHaveValue('');
	await expect(page.getByTestId('ciphertext-output')).toHaveText('');
	await expect(page.getByTestId('rotor-2')).toHaveText(/A/);
});

test('changing the key settings re-enciphers the same message', async ({ page }) => {
	await page.goto('/');

	await page.getByTestId('plaintext-input').fill('ENIGMA');
	const withDefaults = await page.getByTestId('ciphertext-output').innerText();

	await page.getByTestId('setting-rotor-0').selectOption('IV');

	await expect(page.getByTestId('ciphertext-output')).not.toHaveText(withDefaults);
	await expect(page.getByTestId('rotor-0')).toContainText('IV');
});

test('patching a plugboard cable changes the output', async ({ page }) => {
	await page.goto('/');

	await page.getByTestId('plaintext-input').fill('ENIGMA');
	const before = await page.getByTestId('ciphertext-output').innerText();

	// 'A' has no cable in the default key sheet, so pairing it with 'N' is a real change.
	await page.getByTestId('socket-A').click();
	await page.getByTestId('socket-N').click();

	await expect(page.getByTestId('ciphertext-output')).not.toHaveText(before);
	await expect(page.getByTestId('socket-A')).toHaveClass(/plugboard__socket--plugged/);
});

test('debug mode shows the full trace for a keypress', async ({ page }) => {
	await page.goto('/');

	await page.getByTestId('debug-toggle').check();
	await page.getByTestId('plaintext-input').fill('N');

	await expect(page.getByTestId('debug-panel')).toBeVisible();
	await expect(page.getByTestId('trace-step')).toHaveCount(11);
});

test('the page explains how the machine works and how to use the library', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByTestId('explainer')).toBeVisible();
	await expect(page.getByTestId('explainer')).toContainText('no letter can ever encipher to itself');
	await expect(page.getByTestId('explainer')).toContainText('Naval M4');

	await expect(page.getByTestId('library-guide')).toBeVisible();
	await expect(page.getByTestId('library-guide')).toContainText('npm install @enigmaciphy/engine');
});

test('the header links jump to the written sections', async ({ page }) => {
	await page.goto('/');

	await page.getByRole('link', { name: 'How it works' }).click();
	await expect(page).toHaveURL(/#how-it-works$/);
	await expect(page.getByTestId('explainer')).toBeInViewport();

	await page.getByRole('link', { name: 'Using the library' }).click();
	await expect(page).toHaveURL(/#library$/);
	await expect(page.getByTestId('library-guide')).toBeInViewport();
});
