<script setup lang="ts">
import Menubar from "primevue/menubar";
import { type Ref, ref } from "vue";
import Button from "primevue/button";
import Select from "primevue/select";
import { useI18n } from "vue-i18n";
import { useColorScheme } from "@/composables/colorScheme";

const { t, locale } = useI18n({ useScope: "global" });
const colorScheme = useColorScheme();

const items = ref([
  {
    label: t("menu.home"),
    route: "/",
  },
  {
    label: t("menu.aboutAndHelp"),
    route: "/about",
  },
  {
    label: t("menu.chart"),
    route: "/chart",
  },
]);

let isDarkBrightMode: Ref<boolean> = ref<boolean>(false);

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
          <span class="title">Pressure Tracker</span>
          <Select v-model="locale" :options="localeOptions" />
          <Button label="Toggle Color Scheme" @click="colorScheme.toggleColorScheme()">
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

  text-align: center;
  gap: 1rem;
}

.title {
  display: flex;
  align-items: center;
  font-size: 1.7rem;
}

@media only screen and (max-width: 500px) {
  .title {
    font-size: 5vw;
  }
}
</style>
