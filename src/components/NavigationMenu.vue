<script setup lang="ts">
import Menubar from "primevue/menubar";
import { type Ref, ref } from "vue";
import Button from "primevue/button";

const items = ref([
  {
    label: "Home",
    route: "/",
  },
  {
    label: "About",
    route: "/about",
  },
]);

let isDarkBrightMode: Ref<boolean> = ref<boolean>(false);

function toggleColorScheme() {
  const element = document.querySelector("html");
  element?.classList.toggle("my-app-dark");
  isDarkBrightMode.value = !isDarkBrightMode.value;
}
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
