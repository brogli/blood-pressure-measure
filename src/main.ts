import './assets/main.css'
import '@openvue/openicons/openicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import OpenVue from 'openvue/config'
import ToastService from 'openvue/toastservice'
import ConfirmationService from 'openvue/confirmationservice'
import { createI18n } from 'vue-i18n'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'
import { AppPreset } from './theme/preset'
import { en } from '@/i18n/en'
import { de } from '@/i18n/de'
import { ch } from '@/i18n/ch'
import { getInitLocale } from '@/functions/internationalization'
import { useAppSettingsStore } from '@/stores/appSettings'

registerSW({ immediate: true })

const app = createApp(App)

app.use(createPinia())

const appSettingsStore = useAppSettingsStore()

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  fallbackLocale: 'en',
  locale: appSettingsStore.locale || getInitLocale(),
  messages: {
    en: en,
    de: de,
    ch: ch,
  },
})
app.use(i18n)
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)
app.use(OpenVue, {
  theme: {
    preset: AppPreset,
    options: {
      darkModeSelector: '.my-app-dark',
      cssLayer: {
        name: 'openvue',
        order: 'theme, base, openvue, components, utilities',
      },
    },
  },
})

app.mount('#app')
