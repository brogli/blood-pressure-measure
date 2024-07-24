<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationMenu from '@/components/NavigationMenu.vue'
</script>

<template>
  <div class="root-wrapper">
  <header>
      <nav>
        <NavigationMenu />
      </nav>
  </header>
  <main>
    <RouterView />
  </main>
  </div>

</template>

<style scoped>
.root-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
</style>
