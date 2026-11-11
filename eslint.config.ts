import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/dev-dist/**']),
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.spec.ts'],
  },
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/*.spec.ts'],
  },
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  skipFormatting,
)
