import { expect, test } from '@playwright/test'
import { seedConsent } from './app'

test('consent is asked once and remembered', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Accept' }).click()
  await page.reload()
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page.getByText('Measurements')).toBeVisible()
})

test('consent is asked again after an app update', async ({ page }) => {
  await seedConsent(page, '0.0.1')
  await page.goto('/')
  await expect(page.getByRole('dialog', { name: 'Data Privacy' })).toBeVisible()
})
