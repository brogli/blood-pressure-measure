import { addReading, expect, readingRows, test } from './app'

test('the chosen language is remembered and used in the table', async ({ page }) => {
  await addReading(page, { systolic: 128, diastolic: 84, heartRate: 66 })
  await page.getByRole('combobox', { name: 'Language' }).click()
  await page.getByRole('option', { name: 'de' }).click()
  await page.reload()
  await expect(page.getByText('Messungen')).toBeVisible()
  await expect(readingRows(page)).toContainText('Links')
})

test('the chosen color scheme is remembered', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Toggle Color Scheme' }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/my-app-dark/)
})
