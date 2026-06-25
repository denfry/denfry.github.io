// e2e/smoke.spec.ts
import { expect, test } from '@playwright/test'

test('home page renders the name', async ({ page }) => {
  await page.goto('/en')
  await expect(page.getByRole('heading', { name: /Denfry/i })).toBeVisible()
})

test('locale switch navigates to ru', async ({ page }) => {
  await page.goto('/en')
  await page.getByRole('button', { name: 'Switch language' }).click()
  await expect(page).toHaveURL(/\/ru/)
})

test('case study page renders the title', async ({ page }) => {
  await page.goto('/en/projects/codebase-index')
  await expect(
    page.getByRole('heading', { name: /codebase index/i }),
  ).toBeVisible()
})

test('contact section: empty submit stays on page and does not navigate', async ({
  page,
}) => {
  await page.goto('/en#contact')

  // Wait for the contact section to be in view
  const section = page.locator('#contact')
  await expect(section).toBeVisible()

  // Click the send button without filling fields
  const sendButton = section.getByRole('button', { name: /send/i })
  await sendButton.click()

  // Browser validation blocks navigation — URL stays on /en
  await expect(page).toHaveURL(/\/en/)

  // The form fields are still present (no redirect happened)
  await expect(section.locator('input[name="name"]')).toBeVisible()
})
