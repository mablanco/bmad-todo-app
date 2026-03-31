import { expect, test } from '@playwright/test';

test.describe('Todo App Core Loop', () => {
  test('loads the app and shows the capture shell', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Capture what matters now' })).toBeVisible();
    await expect(page.getByLabelText('Task description')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible();
  });

  test('creates a todo from the composer', async ({ page }) => {
    await page.goto('/');

    const input = page.getByLabelText('Task description');
    await input.fill('Buy groceries');
    await page.getByRole('button', { name: 'Add task' }).click();

    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your tasks' })).toBeVisible();
  });

  test('toggles a todo between active and completed', async ({ page }) => {
    await page.goto('/');

    // Create a todo first
    await page.getByLabelText('Task description').fill('Toggle this task');
    await page.getByRole('button', { name: 'Add task' }).click();
    await expect(page.getByText('Toggle this task')).toBeVisible();

    // Toggle to completed
    await page.getByRole('button', { name: /mark complete/i }).click();
    await expect(page.locator('.todo-card--completed')).toBeVisible();

    // Toggle back to active
    await page.getByRole('button', { name: /mark active/i }).click();
    await expect(page.locator('.todo-card--completed')).not.toBeVisible();
  });

  test('deletes a todo from the list', async ({ page }) => {
    await page.goto('/');

    // Create a todo
    await page.getByLabelText('Task description').fill('Delete this task');
    await page.getByRole('button', { name: 'Add task' }).click();
    await expect(page.getByText('Delete this task')).toBeVisible();

    // Delete it
    await page.getByRole('button', { name: /delete/i }).click();

    // Should transition to empty state
    await expect(page.getByText('Delete this task')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'No tasks yet' })).toBeVisible();
  });

  test('persists todos across page reload', async ({ page }) => {
    await page.goto('/');

    // Create a todo
    await page.getByLabelText('Task description').fill('Survive the reload');
    await page.getByRole('button', { name: 'Add task' }).click();
    await expect(page.getByText('Survive the reload')).toBeVisible();

    // Reload
    await page.reload();

    // Todo should still be visible
    await expect(page.getByText('Survive the reload')).toBeVisible();
  });
});
