import { addReading, expect, test } from './app'

test('the chart page renders all charts without errors', async ({ page }) => {
  const errors: Error[] = []
  page.on('pageerror', (error) => errors.push(error))

  await addReading(page, { systolic: 128, diastolic: 84, heartRate: 66 })
  await page.goto('/chart')

  await expect(page.locator('canvas')).toHaveCount(4)
  expect(errors).toEqual([])
})

test('the charts widen when the phone rotates to landscape', async ({ page }) => {
  await addReading(page, { systolic: 128, diastolic: 84, heartRate: 66 })
  await page.setViewportSize({ width: 412, height: 915 })
  await page.goto('/chart')
  await expect(page.locator('canvas')).toHaveCount(4)

  await page.setViewportSize({ width: 915, height: 412 })

  await expect
    .poll(() =>
      page
        .locator('canvas')
        .evaluateAll(
          (all) => all.filter((c) => c.clientWidth < (c.parentElement?.clientWidth ?? 0)).length,
        ),
    )
    .toBe(0)
})

test('the readings chart scrolls through time while its axes stay in view', async ({ page }) => {
  await page.addInitScript(() => {
    const readings = Array.from({ length: 30 }, (_, day) => ({
      timestampIso8601: new Date(Date.now() - day * 86_400_000).toISOString(),
      systolic: 125,
      diastolic: 82,
      heartRate: 65,
      whichArm: 'Left',
    }))
    localStorage.setItem('localMeasurements', JSON.stringify(readings))
  })
  await page.goto('/chart')

  const scroller = page.getByTestId('readings-scroller')
  await expect.poll(() => scroller.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
  const canvas = scroller.locator('canvas')
  const before = await canvas.boundingBox()
  await scroller.evaluate((el) => (el.scrollLeft = -200))
  expect(await canvas.boundingBox()).toEqual(before)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()?.width ?? 0,
  )
})
