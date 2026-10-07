import { addReading, expect, test } from './app'

test('the chart page renders all charts without errors', async ({ page }) => {
  const errors: Error[] = []
  page.on('pageerror', (error) => errors.push(error))

  await addReading(page, { systolic: 128, diastolic: 84, heartRate: 66 })
  await page.goto('/chart')

  await expect(page.locator('canvas')).toHaveCount(3)
  expect(errors).toEqual([])
})
