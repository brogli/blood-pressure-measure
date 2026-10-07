import { expect, test } from './app'

test('the app works offline after the first visit', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(() => navigator.serviceWorker.ready)

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByText('Measurements')).toBeVisible()
  await page.goto('/chart')
  await expect(page.locator('canvas')).toHaveCount(3)
})
