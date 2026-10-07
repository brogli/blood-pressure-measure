<script setup lang="ts">
const currentBuildVersion = import.meta.env.VITE_APP_VERSION
</script>

<template>
  <section class="flex items-center justify-center gap-2">
    <p>© Alexander Brogli-Urech {{ new Date().getFullYear() }}</p>
    <a href="https://www.linkedin.com/in/alexbrogli/" rel="noopener noreferrer" target="_blank"
      ><img class="h-8" src="@/assets/icons8-linkedin.svg" alt="LinkedIn Icon"
    /></a>
    <a
      href="https://github.com/brogli/blood-pressure-measure"
      rel="noopener noreferrer"
      target="_blank"
    >
      <img class="h-[1.6rem] dark:hidden" src="@/assets/github-mark.svg" alt="Github Icon" />
      <img
        class="hidden h-[1.6rem] dark:block"
        src="@/assets/github-mark-white.svg"
        alt="Github Icon"
      />
    </a>
    <p>Version {{ currentBuildVersion }}</p>
  </section>
</template>
