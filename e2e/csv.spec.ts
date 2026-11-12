import { readFile } from 'node:fs/promises'
import { addReading, confirm, expect, importCsv, legacyCsvPath, readingRows, test } from './app'

test('an exported file restores all readings into empty storage', async ({ page }) => {
  await addReading(page, { systolic: 128, diastolic: 84, heartRate: 66 })
  await addReading(page, { systolic: 135, diastolic: 88, heartRate: 72 })

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export' }).click()
  const exportPath = await (await download).path()
  const csv = await readFile(exportPath, 'utf8')
  expect(csv.split('\r\n')[0]).toBe('id,timestampIso8601,systolic,diastolic,heartRate,whichArm')

  await page.getByRole('button', { name: 'Delete all' }).click()
  await confirm(page, 'Delete')
  await expect(readingRows(page)).toHaveCount(0)

  await importCsv(page, exportPath)
  await expect(readingRows(page)).toHaveCount(2)
  await page.reload()
  await expect(readingRows(page)).toHaveCount(2)
  await expect(readingRows(page).filter({ hasText: '128' })).toContainText('84')
  await expect(readingRows(page).filter({ hasText: '135' })).toContainText('88')
})

test('a legacy export imports, and importing it again adds no duplicates', async ({ page }) => {
  await page.goto('/')
  await importCsv(page, legacyCsvPath)
  await expect(readingRows(page)).toHaveCount(4)

  await importCsv(page, legacyCsvPath)
  await page.reload()
  await expect(readingRows(page)).toHaveCount(4)
})

test('a file with an invalid row imports the valid rows and shows an error', async ({ page }) => {
  await page.goto('/')
  const legacyCsv = await readFile(legacyCsvPath, 'utf8')
  await importCsv(page, {
    name: 'partly-broken.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(`${legacyCsv}x,not a date,1,2,3,Left\n`),
  })

  await expect(page.getByText("your CSV file couldn't be imported")).toBeVisible()
  await expect(readingRows(page)).toHaveCount(4)
})

test('the import notice can be hidden', async ({ page }) => {
  await page.goto('/')
  const firstChooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Import' }).click()
  await page.getByLabel("Don't show again").check()
  await confirm(page, 'Import')
  await (await firstChooser).setFiles(legacyCsvPath)
  await expect(readingRows(page)).toHaveCount(4)

  await page.reload()
  const secondChooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Import' }).click()
  await secondChooser
  await expect(page.getByRole('alertdialog')).toBeHidden()
})
