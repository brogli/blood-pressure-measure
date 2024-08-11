import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import type { ToastMessageOptions } from "primevue/toast";

export const useToastStore = defineStore("toasts", () => {
  const currentToast: Ref<ToastMessageOptions | null> = ref(null);

  return { currentToast };
});
