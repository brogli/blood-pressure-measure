# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blood Pressure Measure is a privacy-first Vue 3 SPA for tracking blood pressure readings. All data is stored locally in the browser (localStorage). Deployed to Cloudflare Pages as a PWA with offline support.

Production URL: https://bluetdruck.nebeprojekt.li

## Prerequisites

Node and pnpm come from the Nix dev shell in `flake.nix` (`nodejs_24`, `pnpm_11` from `nixos-unstable`), loaded via direnv (`.envrc`) locally and via `nix develop` in CI. Do not add `engines` or `packageManager` — `flake.lock` is the source of truth. `.nvmrc` exists only for the Cloudflare Pages build; keep it on the same Node major. When bumping the Node major, update `nodejs_*`, `.nvmrc` and `@tsconfig/node*` in one change.

## Commands

- `pnpm dev` — start Vite dev server with HMR
- `pnpm build` — type-check + production build (runs in parallel via npm-run-all2)
- `pnpm build-only` — Vite production build without type-checking
- `pnpm type-check` — run vue-tsc for TypeScript validation
- `pnpm lint` — oxlint, ESLint, Stylelint sequentially (all with `--fix`)
- `pnpm format` — oxfmt format src/ directory
- `pnpm test:unit` — run Vitest tests (jsdom environment); specs live next to the code as `*.spec.ts`
- `pnpm test:e2e` — run Playwright tests in `e2e/` against a production build (`pnpm preview`, so the service worker is real); first run `pnpm exec playwright install chromium`
- `pnpm preview` — preview production build locally
- `treefmt` — repo-wide lint fixes + formatting; `treefmt --ci` is the CI check

## Architecture

**Stack**: Vue 3 (Composition API) + TypeScript + Pinia + OpenVue + Tailwind CSS v4 + Vite

**OpenVue** (MIT fork of PrimeVue 4.5.5, same API; styled mode). Do not add `primevue`, `@primeuix/*` or `primeicons`. Icons come from `@openvue/openicons` (`oi oi-*` classes). All design-token overrides live in `src/theme/preset.ts`. Components and directives are imported per file, not registered globally; services (`ToastService`, `ConfirmationService`) are registered in `main.ts`.

**Tailwind CSS v4** is the styling layer: prefer utilities over `<style>` blocks. `src/assets/main.css` is the only stylesheet. Its layer order `theme, base, openvue, components, utilities` is mirrored in `main.ts` (`cssLayer`), so utilities override OpenVue component styles. `tailwindcss-primeui` exposes theme tokens as utilities (`text-color`, `bg-primary`). The `dark:` variant follows the app's `.my-app-dark` class, not the OS preference.

**State management**: Three Pinia setup stores in `src/stores/`:

- `measurements.ts` — core data store; persists a `Map<string, Measurement>` to localStorage under key "localMeasurements"
- `appSettings.ts` — dark mode, locale, consent state; uses `@vueuse/core` reactive localStorage
- `toastStore.ts` — notification queue

**Routing** (`src/router/`): All views are lazy-loaded. Routes: `/` (home/list), `/new` (add), `/edit/:id` (edit), `/chart` (visualization), `/about`.

**Data model** (`src/models/`): `Measurement` class with UUID auto-generation and a `MeasurementDto` for CSV/storage serialization. `toMeasurement` narrows untrusted input (localStorage, CSV rows) back into a `Measurement`.

**CSV backwards compatibility**: the CSV export is the users' only backup, so files they already exported must stay importable. The format is the `MeasurementDto` field list `id,timestampIso8601,systolic,diastolic,heartRate,whichArm`. Do not rename, reorder or remove columns; new columns must be optional on import. Import must keep tolerating legacy data (empty `whichArm`, missing `id`, `0` for missing numbers); `fixtures/legacy-export.csv` pins this in unit and e2e tests. Rows without an `id` get one derived from their content, so re-importing a file does not duplicate them.

**Composables** (`src/composables/`): `colorScheme` (dark/light toggle), `exportFile` (CSV download), `importFile` (CSV upload via papaparse), `averageChart` (chart data).

**i18n** (`src/i18n/`): Three locales — English (`en`), German (`de`), Swiss German (`ch`). Browser language auto-detection in `src/functions/internationalization.ts`.

**PWA**: Configured via `vite-plugin-pwa` with Workbox auto-update strategy. Service worker caches all static assets (js, css, html, ico, png, svg) for full offline support. Manifest is defined inline in `vite.config.ts`.

**Path alias**: `@` maps to `./src` (configured in both Vite and tsconfig).

## TypeScript conventions

**Type everything strictly. No `any`, no implicit `any`, no escape hatches without a comment explaining why.**

- **No `any`** — reach for `unknown` and narrow, or model the actual shape. If `any` is unavoidable (third-party typing gap), annotate with a `// why:` comment.
- **No non-null assertions (`!`) or `as` casts** unless justified by a short comment. Prefer refactoring to make the type flow correct.
- **Exported APIs** (functions, composables, store actions) must have explicit parameter and return types. Local variables and small internal helpers can rely on inference.
- **Vue SFCs**: use the type-based forms — `defineProps<Props>()`, `defineEmits<{ change: [value: string] }>()`. Do not use the runtime object form.
- **Pinia stores**: explicitly type `ref<T>(...)`, getter return types, and action signatures.
- **Router**: type `RouteMeta` via module augmentation (`declare module 'vue-router'`) when adding meta fields.
- **External data** (`JSON.parse`, `localStorage`, CSV): treat as `unknown` at the boundary and validate/narrow before use.

## Linting & formatting

oxc toolchain (oxlint + oxfmt), not Prettier; `eslint-config-prettier` only disables ESLint's stylistic rules so oxfmt owns formatting (config in `.oxfmtrc.json` — single quotes, no semicolons).

1. `oxlint` runs first (`.oxlintrc.json`).
2. `eslint` second (flat config in `eslint.config.ts`, vue/essential + TypeScript recommended); `eslint-plugin-oxlint` disables rules oxlint already covers.
3. `stylelint` lints CSS and `.vue` `<style>` blocks (`stylelint.config.mjs`). It does not read `.gitignore` itself, hence `--ignore-path`.

`treefmt.toml` is the repo-wide alternative to the pnpm scripts: oxlint/eslint/stylelint → oxfmt (lower `priority` runs first) over `*.vue`/`*.ts`/`*.css`, oxfmt over `*.md`, nixfmt over `*.nix`. JS tools run via `pnpm exec`; `treefmt` and `nixfmt` come from the nix shell.

## CI/CD

GitHub Actions (`.github/workflows/build.yaml`) runs inside `nix develop`: `pnpm install --frozen-lockfile`, `treefmt --ci`, `pnpm test:unit --run`, `pnpm build`, `pnpm test:e2e` on pushes and PRs to `main`/`staging`. Deployment to Cloudflare Pages is handled separately.

PRs target the `staging` branch, not `main`.

## Dependencies

`pnpm-workspace.yaml` sets `minimumReleaseAge` (7 days, also for transitive deps); `renovate.json` mirrors it. Renovate policy:

- **Auto-merge**: minor/patch/pin/digest on ≥1.0.0; lockfile maintenance (which also refreshes `flake.lock` via the `nix` manager).
- **Manual**: majors; any 0.x update. The 0.x exclusion rule must come **last** in `packageRules` to override the general automerge rule.
- `platformAutomerge` is intentionally `true` here in combination with `automergeType: "branch"`; if you ever flip `automergeType` back to `"pr"`, set `platformAutomerge: false` — GitHub's native auto-merge cannot satisfy the "1 review required" branch protection rule (the Renovate bot can't approve its own PR), so Renovate must handle the merge itself.
