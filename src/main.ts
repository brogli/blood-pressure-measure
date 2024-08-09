import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { definePreset } from "@primevue/themes";
import FocusTrap from "primevue/focustrap";
import Tooltip from "primevue/tooltip";
import { createI18n } from "vue-i18n";
import { en } from "@/i18n/en";
import { de } from "@/i18n/de";
import { ch } from "@/i18n/ch";
import { getInitLocale } from "@/functions/internationalization";

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  fallbackLocale: "en",
  locale: getInitLocale(),
  messages: {
    en: en,
    de: de,
    ch: ch,
  },
});

const app = createApp(App);

app.directive("focustrap", FocusTrap);
app.directive("tooltip", Tooltip);

app.use(createPinia());
app.use(router);
app.use(i18n);

const CustomNoir = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{zinc.50}",
      100: "{zinc.100}",
      200: "{zinc.200}",
      300: "{zinc.300}",
      400: "{zinc.400}",
      500: "{zinc.500}",
      600: "{zinc.600}",
      700: "{zinc.700}",
      800: "{zinc.800}",
      900: "{zinc.900}",
      950: "{zinc.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{zinc.950}",
          inverseColor: "#ffffff",
          hoverColor: "{zinc.900}",
          activeColor: "{zinc.800}",
        },
        highlight: {
          background: "{zinc.950}",
          focusBackground: "{zinc.700}",
          color: "#ffffff",
          focusColor: "#ffffff",
        },
      },
      dark: {
        primary: {
          color: "{zinc.50}",
          inverseColor: "{zinc.950}",
          hoverColor: "{zinc.100}",
          activeColor: "{zinc.200}",
        },
        highlight: {
          background: "rgba(250, 250, 250, .16)",
          focusBackground: "rgba(250, 250, 250, .24)",
          color: "rgba(255,255,255,.87)",
          focusColor: "rgba(255,255,255,.87)",
        },
      },
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: CustomNoir,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
});

app.component("DataTable", DataTable);
// eslint-disable-next-line vue/multi-word-component-names
app.component("Column", Column);
// eslint-disable-next-line vue/multi-word-component-names

app.mount("#app");
