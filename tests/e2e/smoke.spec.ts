import { expect, test } from '@playwright/test';

test('renders the starter page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Get started' })).toBeVisible();
  await expect(page.getByRole('button', { name: /count is/i })).toBeVisible();
});
