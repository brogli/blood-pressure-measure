import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getInitLocale } from '@/functions/internationalization'

export const useAppSettingsStore = defineStore('appSettings', () => {
  const isDarkModeActive = useStorage('isDarkModeActive', false)
  const isDarkModeOverwrittenByUser = useStorage('isDarkModeOverwrittenByUser', false)
  const hasUserAcceptedConsentModal = useStorage('hasUserAcceptedConsentModal', false)
  const versionNumberWhenConsented = useStorage('versionNumberWhenConsented', '0.0.0')
  const locale = useStorage('locale', getInitLocale())

  return {
    isDarkModeActive,
    isDarkModeOverwrittenByUser,
    hasUserAcceptedConsentModal,
    versionNumberWhenConsented,
    locale,
  }
})
