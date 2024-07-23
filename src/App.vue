<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationMenu from '@/components/NavigationMenu.vue'
</script>

<template>
  <header>

    <div class="wrapper">

      <nav>
        <NavigationMenu />
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
