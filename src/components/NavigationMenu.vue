<script setup lang="ts">
import Menubar from "primevue/menubar";
import { onMounted, type Ref, ref } from "vue";
import Button from "primevue/button";
import Select from "primevue/select";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: "global" });
const items = ref([
  {
    label: t("menu.home"),
    route: "/",
  },
  {
    label: t("menu.aboutAndHelp"),
    route: "/about",
  },
]);

let isDarkBrightMode: Ref<boolean> = ref<boolean>(false);

function toggleColorScheme() {
  const element = document.querySelector("html");
  element?.classList.toggle("my-app-dark");
  isDarkBrightMode.value = !isDarkBrightMode.value;
}

const localeOptions = ref<string[]>(["ch", "de", "en"]);
</script>

<template>
  <div class="card">
    <Menubar :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span class="">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <div class="menubar-end">
          <h2>Pressure Tracker</h2>
          <Select v-model="locale" :options="localeOptions" />
          <Button label="Toggle Color Scheme" @click="toggleColorScheme()">
            <i v-if="isDarkBrightMode" class="pi pi-sun"></i>
            <i v-else class="pi pi-moon"></i>
          </Button>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>
.menubar-end {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>
