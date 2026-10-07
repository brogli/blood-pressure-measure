import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:4173'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, locale: 'en-GB', trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: devices['Desktop Chrome'] },
    { name: 'mobile', use: devices['Pixel 7'] },
  ],
  // the production build, so the service worker precaches like in the deployed app
  webServer: {
    // CI has built already
    command: `${process.env.CI ? '' : 'pnpm build-only && '}pnpm preview --port 4173 --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
