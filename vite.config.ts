import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        theme_color: '#ffffff', // Light mode default (white background)
        background_color: '#ffffff', // Should match light mode background
        icons: [
          {
            src: '/heart-emoji.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
    // Only add visualizer if not in CI
    ...(process.env.CI
      ? []
      : [
          visualizer({
            open: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ]),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // pnpm's store directory names contain peer names (openvue@…_chart.js@…), so only
          // match below the last node_modules/.
          const modulePath = id.slice(id.lastIndexOf('node_modules/') + 'node_modules/'.length)

          if (modulePath.startsWith('@intlify') || modulePath.startsWith('vue-i18n')) {
            return 'i18n-vendor'
          }
          if (modulePath.startsWith('@openuxkit')) {
            return 'openvue-themes'
          }
          if (modulePath.startsWith('chart.js') || modulePath.startsWith('chartjs-adapter')) {
            return 'chart-vendor'
          }
          if (modulePath.startsWith('@openvue/openicons')) {
            return 'openicons'
          }
          if (modulePath.includes('openvue')) {
            if (modulePath.includes('/datatable') || modulePath.includes('/column')) {
              return 'openvue-table'
            }
            if (modulePath.includes('/chart/')) return 'openvue-chart'
            if (
              modulePath.includes('/datepicker') ||
              modulePath.includes('/inputnumber') ||
              modulePath.includes('/selectbutton')
            ) {
              return 'openvue-form'
            }
            return 'openvue-core'
          }
          if (modulePath.includes('vue') || modulePath.includes('pinia')) {
            return 'vue-vendor'
          }
          return 'vendor'
        },
      },
    },
  },
})
