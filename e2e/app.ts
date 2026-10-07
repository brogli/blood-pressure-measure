import { test as base, expect, type Locator, type Page } from '@playwright/test'
import packageJson from '../package.json' with { type: 'json' }

export { expect }

export const legacyCsvPath = 'fixtures/legacy-export.csv'

/** A page whose user already accepted the consent modal for the current version. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await seedConsent(page, packageJson.version)
    await use(page)
  },
})

export async function seedConsent(page: Page, consentedVersion: string): Promise<void> {
  await page.addInitScript((version) => {
    localStorage.setItem('hasUserAcceptedConsentModal', 'true')
    localStorage.setItem('versionNumberWhenConsented', version)
  }, consentedVersion)
}

export async function addReading(
  page: Page,
  reading: { systolic: number; diastolic: number; heartRate: number },
): Promise<void> {
  await page.goto('/new')
  await typeInto(page, 'Systolic', reading.systolic)
  await typeInto(page, 'Diastolic', reading.diastolic)
  await typeInto(page, 'Heart Rate', reading.heartRate)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page).toHaveURL('/')
}

/** Replaces a field's value by typing it key by key, like a user. */
export async function typeInto(page: Page, label: string, value: number): Promise<void> {
  const input = page.getByLabel(label)
  await input.clear()
  await input.pressSequentially(String(value))
}

export function readingRows(page: Page): Locator {
  return page.locator('tbody tr')
}

export async function importCsv(
  page: Page,
  file: string | Parameters<Page['setInputFiles']>[1],
): Promise<void> {
  const fileChooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Import' }).click()
  await (await fileChooser).setFiles(file)
}

export async function confirm(page: Page, buttonName: string): Promise<void> {
  await page.getByRole('alertdialog').getByRole('button', { name: buttonName }).click()
}
