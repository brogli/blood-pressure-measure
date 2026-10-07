import { addReading, confirm, expect, readingRows, test, typeInto } from './app'

test('a new reading survives a reload', async ({ page }) => {
  await addReading(page, { systolic: 128, diastolic: 84, heartRate: 66 })
  await page.reload()
  await expect(readingRows(page)).toHaveCount(1)
  await expect(readingRows(page)).toContainText('128')
})

test('saving without systolic and diastolic marks them invalid', async ({ page }) => {
  await page.goto('/new')
  await typeInto(page, 'Heart Rate', 66)
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page).toHaveURL('/new')
  await expect(page.getByLabel('Systolic')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByLabel('Diastolic')).toHaveAttribute('aria-invalid', 'true')
})

test('editing a reading updates it', async ({ page }) => {
  await addReading(page, { systolic: 128, diastolic: 84, heartRate: 66 })
  await readingRows(page).first().click()
  await typeInto(page, 'Systolic', 131)
  await page.getByRole('button', { name: 'Save' }).click()

  await page.reload()
  await expect(readingRows(page)).toHaveCount(1)
  await expect(readingRows(page)).toContainText('131')
})

test('deleting a reading asks for confirmation', async ({ page }) => {
  await addReading(page, { systolic: 128, diastolic: 84, heartRate: 66 })
  await readingRows(page).first().click()
  await page.getByRole('button', { name: 'Delete' }).click()
  await confirm(page, 'Delete')

  await expect(page.getByText('Successfully deleted measurement')).toBeVisible()
  await page.reload()
  await expect(readingRows(page)).toHaveCount(0)
})

test('an unknown reading id leads back home with an error', async ({ page }) => {
  await page.goto('/edit/does-not-exist')
  await expect(page.getByText('The measurement could not be loaded')).toBeVisible()
  await expect(page).toHaveURL('/')
})
