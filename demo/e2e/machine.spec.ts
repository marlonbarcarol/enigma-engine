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

test('debug mode shows the full trace for a keypress', async ({ page }) => {
	await page.goto('/');

	await page.getByTestId('debug-toggle').check();
	await page.getByTestId('plaintext-input').fill('N');

	await expect(page.getByTestId('debug-panel')).toBeVisible();
	await expect(page.getByTestId('trace-step')).toHaveCount(11);
});
