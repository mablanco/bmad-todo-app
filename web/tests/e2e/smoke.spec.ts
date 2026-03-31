import type { APIRequestContext, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const e2eApiBaseUrl = 'http://127.0.0.1:8001'

async function resetState(request: APIRequestContext) {
  const response = await request.delete(`${e2eApiBaseUrl}/api/v1/test/reset`)
  expect(response.ok()).toBeTruthy()
}

function todoListItem(page: Page, description: string) {
  return page.locator('.todo-list__item', {
    has: page.locator('.todo-card__description', { hasText: description }),
  })
}

test.describe('Todo App Core Loop', () => {
  test.beforeEach(async ({ request }) => {
    await resetState(request)
  })

  test('loads the app and shows the capture shell', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Capture what matters now' })).toBeVisible()
    await expect(page.getByLabel('Task description')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible()
  })

  test('creates a todo from the composer', async ({ page }) => {
    await page.goto('/')

    const description = 'Buy groceries'
    const input = page.getByLabel('Task description')
    await input.fill(description)
    await page.getByRole('button', { name: 'Add task' }).click()

    await expect(todoListItem(page, description)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Your tasks' })).toBeVisible()
  })

  test('toggles a todo between active and completed', async ({ page }) => {
    await page.goto('/')

    const description = 'Toggle this task'

    await page.getByLabel('Task description').fill(description)
    await page.getByRole('button', { name: 'Add task' }).click()
    const item = todoListItem(page, description)
    await expect(item).toBeVisible()

    await item.getByRole('button', { name: /mark complete/i }).click()
    await expect(item.locator('.todo-card--completed')).toBeVisible()

    await item.getByRole('button', { name: /mark active/i }).click()
    await expect(item.locator('.todo-card--completed')).not.toBeVisible()
  })

  test('deletes a todo from the list', async ({ page }) => {
    await page.goto('/')

    const description = 'Delete this task'

    await page.getByLabel('Task description').fill(description)
    await page.getByRole('button', { name: 'Add task' }).click()
    const item = todoListItem(page, description)
    await expect(item).toBeVisible()

    await item.getByRole('button', { name: /delete/i }).click()

    await expect(item).not.toBeVisible()
    await expect(page.getByRole('heading', { name: 'No tasks yet' })).toBeVisible()
  })

  test('persists todos across page reload', async ({ page }) => {
    await page.goto('/')

    const description = 'Survive the reload'

    await page.getByLabel('Task description').fill(description)
    await page.getByRole('button', { name: 'Add task' }).click()
    await expect(todoListItem(page, description)).toBeVisible()

    await page.reload()

    await expect(todoListItem(page, description)).toBeVisible()
  })
})
