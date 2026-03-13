import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        theme_color: "#ffffff", // Light mode default (white background)
        background_color: "#ffffff", // Should match light mode background
        icons: [
          {
            src: "/heart-emoji.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
    // Only add visualizer if not in CI
    ...(process.env.CI
      ? []
      : [
          visualizer({
            open: true,
            filename: "dist/stats.html",
            gzipSize: true,
            brotliSize: true,
          }),
        ]),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@intlify") || id.includes("vue-i18n")) {
              return "i18n-vendor";
            }

            if (id.includes("@primeuix")) {
              return "primevue-core";
            }
            if (id.includes("primevue")) {
              if (id.includes("/datatable") || id.includes("/column")) return "primevue-table";
              if (id.includes("/chart/")) return "primevue-chart";
              return "primevue-core";
            }
            if (id.includes("primeicons")) {
              return "primeicons";
            }
            if (id.includes("vue") || id.includes("pinia")) {
              return "vue-vendor";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
