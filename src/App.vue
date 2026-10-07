<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationMenu from '@/components/NavigationMenu.vue'
import Divider from 'openvue/divider'
import FooterSection from '@/components/FooterSection.vue'
import { useColorScheme } from '@/composables/colorScheme'
import { useToastStore } from '@/stores/toastStore'
import { useToast } from 'openvue/usetoast'
import Toast, { type ToastMessageOptions } from 'openvue/toast'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import ConsentModal from '@/components/ConsentModal.vue'

const colorScheme = useColorScheme()
colorScheme.initColorScheme()

const toastStore = useToastStore()
const { currentToast } = storeToRefs(toastStore)
const toast = useToast()

function showToast(message: ToastMessageOptions) {
  toast.add(message)
}

watch(currentToast, (newValue) => {
  if (newValue) {
    showToast(newValue)
  }
})
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-280 flex-col gap-y-4 pt-4 text-color lg:w-7/10">
    <ConsentModal />
    <Toast />
    <header>
      <nav>
        <NavigationMenu />
      </nav>
    </header>
    <main class="flex-1">
      <RouterView />
    </main>
    <footer class="pb-4 text-xs">
      <Divider />
      <FooterSection />
    </footer>
  </div>
</template>
