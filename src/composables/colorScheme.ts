import { useAppSettingsStore } from "@/stores/appSettings";
import { watch } from "vue";
import { storeToRefs } from "pinia";

export function useColorScheme() {
  const appSettingsStore = useAppSettingsStore();
  const { isDarkModeActive } = storeToRefs(appSettingsStore);

  function initColorScheme(): void {
    if (!appSettingsStore.isDarkModeOverwrittenByUser) {
      const isDarkActive = window.matchMedia("(prefers-color-scheme: dark)");
      appSettingsStore.isDarkModeActive = isDarkActive.matches;
    }
    setColorScheme();
  }

  function setColorScheme() {
    if (!appSettingsStore.isDarkModeActive) {
      const element = document.querySelector("html");
      element?.classList.remove("my-app-dark");
    } else {
      const element = document.querySelector("html");
      element?.classList.add("my-app-dark");
    }
  }

  watch(isDarkModeActive, () => {
    setColorScheme();
  });

  function toggleColorScheme() {
    appSettingsStore.isDarkModeOverwrittenByUser = true;
    appSettingsStore.isDarkModeActive = !appSettingsStore.isDarkModeActive;
  }

  return { initColorScheme, toggleColorScheme };
}
