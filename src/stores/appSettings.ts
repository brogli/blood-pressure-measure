import { computed, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getInitLocale } from '@/functions/internationalization'

export const useAppSettingsStore = defineStore('appSettings', () => {
  const isDarkModeActive = useStorage('isDarkModeActive', false)
  const isDarkModeOverwrittenByUser = useStorage('isDarkModeOverwrittenByUser', false)
  const hasUserAcceptedConsentModal = useStorage('hasUserAcceptedConsentModal', false)
  const versionNumberWhenConsented = useStorage('versionNumberWhenConsented', '0.0.0')
  const locale = useStorage('locale', getInitLocale())
  /** App version in which the user hid the import notice; a new version shows it again. */
  const importNoticeHiddenInVersion = useStorage('importNoticeHiddenInVersion', '0.0.0')
  const isImportNoticeHidden: ComputedRef<boolean> = computed(
    () => importNoticeHiddenInVersion.value === import.meta.env.VITE_APP_VERSION,
  )

  function hideImportNotice(): void {
    importNoticeHiddenInVersion.value = import.meta.env.VITE_APP_VERSION
  }

  return {
    isDarkModeActive,
    isDarkModeOverwrittenByUser,
    hasUserAcceptedConsentModal,
    versionNumberWhenConsented,
    locale,
    isImportNoticeHidden,
    hideImportNotice,
  }
})
