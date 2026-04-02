import type { APIRequestContext, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const e2eApiBaseUrl = 'http://127.0.0.1:8001'

async function resetState(request: APIRequestContext) {
  const response = await request.delete(`${e2eApiBaseUrl}/api/v1/test/reset`)
  expect(response.ok()).toBeTruthy()
}

test.describe('Accessibility — WCAG 2.1 AA', () => {
  test.beforeEach(async ({ request }) => {
    await resetState(request)
  })

  test('empty state has no WCAG AA violations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'No tasks yet' })).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('populated list has no WCAG AA violations', async ({ page }) => {
    await page.goto('/')

    await page.getByLabel('Task description').fill('Accessibility test task')
    await page.getByRole('button', { name: 'Add task' }).click()
    await expect(page.locator('.todo-card__description', { hasText: 'Accessibility test task' })).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('completed task state has no WCAG AA violations', async ({ page }) => {
    await page.goto('/')

    await page.getByLabel('Task description').fill('Complete me')
    await page.getByRole('button', { name: 'Add task' }).click()
    await expect(page.locator('.todo-card__description', { hasText: 'Complete me' })).toBeVisible()

    await page.getByRole('button', { name: /mark complete/i }).click()
    await expect(page.locator('.todo-card--completed')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
