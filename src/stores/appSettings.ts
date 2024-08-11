import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useAppSettingsStore = defineStore("appSettings", () => {
  const isDarkModeActive = useStorage("isDarkModeActive", false);
  const isDarkModeOverwrittenByUser = useStorage("isDarkModeOverwrittenByUser", false);
  const hasUserAcceptedConsentModal = useStorage("hasUserAcceptedConsentModal", false);

  return { isDarkModeActive, isDarkModeOverwrittenByUser, hasUserAcceptedConsentModal };
});
