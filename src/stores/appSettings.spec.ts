import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAppSettingsStore } from '@/stores/appSettings'

/** Lets useStorage write the pending change to localStorage. */
const persisted = nextTick

/** A fresh store reads localStorage again, like a page reload. */
function reloadStore() {
  setActivePinia(createPinia())
  return useAppSettingsStore()
}

beforeEach(() => localStorage.clear())
afterEach(() => vi.unstubAllEnvs())

describe('import notice', () => {
  it('shows until hidden, also when the build has no version', () => {
    vi.stubEnv('VITE_APP_VERSION', '')
    expect(reloadStore().isImportNoticeHidden).toBe(false)
  })

  it('stays hidden after a reload of the same version', async () => {
    vi.stubEnv('VITE_APP_VERSION', '1.0.0')
    reloadStore().hideImportNotice()
    await persisted()
    expect(reloadStore().isImportNoticeHidden).toBe(true)
  })

  it('shows again in a new version', async () => {
    vi.stubEnv('VITE_APP_VERSION', '1.0.0')
    reloadStore().hideImportNotice()
    await persisted()
    vi.stubEnv('VITE_APP_VERSION', '1.0.1')
    expect(reloadStore().isImportNoticeHidden).toBe(false)
  })
})
