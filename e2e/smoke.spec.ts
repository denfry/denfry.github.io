// e2e/smoke.spec.ts
import { expect, test } from '@playwright/test'

test('home page renders the name', async ({ page }) => {
  await page.goto('/en')
  await expect(page.getByRole('heading', { name: /Denfry/i })).toBeVisible()
})
