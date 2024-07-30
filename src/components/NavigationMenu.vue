<script setup lang="ts">
import Menubar from 'primevue/menubar'
import { ref } from 'vue'

const items = ref([
  {
    label: 'Home',
    route: '/'
  },
  {
    label: 'About',
    route: '/about'
  }
])


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
    </Menubar>
  </div>

</template>

<style scoped>

</style>