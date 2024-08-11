<script setup lang="ts">
import { RouterView } from "vue-router";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Divider from "primevue/divider";
import FooterSection from "@/components/FooterSection.vue";
import { useColorScheme } from "@/composables/colorScheme";
import { useToastStore } from "@/stores/toastStore";
import { useToast } from "primevue/usetoast";
import Toast, { type ToastMessageOptions } from "primevue/toast";
import { watch } from "vue";
import { storeToRefs } from "pinia";
import ConsentModal from "@/components/ConsentModal.vue";

const colorScheme = useColorScheme();
colorScheme.initColorScheme();

const toastStore = useToastStore();
const { currentToast } = storeToRefs(toastStore);
const toast = useToast();

function showToast(message: ToastMessageOptions) {
  toast.add(message);
}

watch(currentToast, (newValue, _) => {
  if (newValue) {
    showToast(newValue);
  }
});
</script>

<template>
  <div class="root-wrapper">
    <ConsentModal />
    <Toast />
    <header>
      <nav>
        <NavigationMenu />
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
    <footer>
      <Divider />
      <FooterSection />
    </footer>
  </div>
</template>

<style scoped>
.root-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  width: 70%;
  max-width: 70rem;
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
  padding-top: 1rem;
}

html,
body {
  height: 100%;
  margin-top: 1rem;
}

main {
  flex: 1;
}

footer {
  /*noinspection CssUnresolvedCustomProperty*/
  color: var(--p-text-color);
  padding-bottom: 1rem;
  font-size: 80%;
}

@media only screen and (max-width: 800px) {
  .root-wrapper {
    width: unset;
  }
}
</style>
