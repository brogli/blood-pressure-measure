<script setup lang="ts">
import Menubar from 'openvue/menubar'
import { computed, ref } from 'vue'
import Button from 'openvue/button'
import Select from 'openvue/select'
import { useI18n } from 'vue-i18n'
import { useColorScheme } from '@/composables/colorScheme'
import { useAppSettingsStore } from '@/stores/appSettings'

const { t, locale } = useI18n({ useScope: 'global' })
const colorScheme = useColorScheme()
const appSettingsStore = useAppSettingsStore()

const items = computed(() => [
  {
    label: t('menu.home'),
    route: '/',
  },
  {
    label: t('menu.aboutAndHelp'),
    route: '/about',
  },
  {
    label: t('menu.chart'),
    route: '/chart',
  },
])

const localeOptions = ref<string[]>(['ch', 'de', 'en'])
</script>

<template>
  <div>
    <Menubar :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span>{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <div class="flex justify-between gap-4 text-center">
          <span class="flex items-center text-[1.7rem] max-[500px]:text-[5vw]"
            >Pressure Tracker</span
          >
          <Select
            v-model="locale"
            :options="localeOptions"
            ariaLabel="Language"
            @change="appSettingsStore.locale = $event.value"
          />
          <Button label="Toggle Color Scheme" @click="colorScheme.toggleColorScheme()">
            <i v-if="appSettingsStore.isDarkModeActive" class="oi oi-sun"></i>
            <i v-else class="oi oi-moon"></i>
          </Button>
        </div>
      </template>
    </Menubar>
  </div>
</template>
