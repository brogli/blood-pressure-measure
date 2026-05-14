# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blood Pressure Measure is a privacy-first Vue 3 SPA for tracking blood pressure readings. All data is stored locally in the browser (localStorage). Deployed to Cloudflare Pages as a PWA with offline support.

Production URL: https://bluetdruck.nebeprojekt.li

## Prerequisites

Node 24 (pinned in `.nvmrc`). pnpm via Corepack (version pinned in `packageManager` field of `package.json`).

## Commands

- `pnpm dev` — start Vite dev server with HMR
- `pnpm build` — type-check + production build (runs in parallel via npm-run-all2)
- `pnpm build-only` — Vite production build without type-checking
- `pnpm type-check` — run vue-tsc for TypeScript validation
- `pnpm lint` — oxlint + ESLint with auto-fix (runs sequentially via run-s)
- `pnpm format` — oxfmt format src/ directory
- `pnpm test:unit` — run Vitest tests (jsdom environment)
- `pnpm preview` — preview production build locally

## Architecture

**Stack**: Vue 3 (Composition API) + TypeScript + Pinia + PrimeVue + Vite

**State management**: Three Pinia stores in `src/stores/`:
- `measurements.ts` — core data store; persists a `Map<string, Measurement>` to localStorage under key "localMeasurements"
- `appSettings.ts` — dark mode, locale, consent state; uses `@vueuse/core` reactive localStorage
- `toastStore.ts` — notification queue

**Routing** (`src/router/`): All views are lazy-loaded. Routes: `/` (home/list), `/new` (add), `/edit/:id` (edit), `/chart` (visualization), `/about`.

**Data model** (`src/models/`): `Measurement` class with UUID auto-generation and a `MeasurementDto` for CSV/storage serialization.

**Composables** (`src/composables/`): `colorScheme` (dark/light toggle), `exportFile` (CSV download), `importFile` (CSV upload via papaparse).

**i18n** (`src/i18n/`): Three locales — English (`en`), German (`de`), Swiss German (`ch`). Browser language auto-detection in `src/functions/internationalization.ts`.

**PWA**: Configured via `vite-plugin-pwa` with Workbox auto-update strategy. Service worker caches all static assets (js, css, html, ico, png, svg) for full offline support. Manifest is defined inline in `vite.config.ts`.

**Path alias**: `@` maps to `./src` (configured in both Vite and tsconfig).

## CI/CD

GitHub Actions (`.github/workflows/build.yaml`) runs `pnpm install --frozen-lockfile` + `pnpm build` on pushes and PRs to `main`/`staging`. Deployment to Cloudflare Pages is handled separately.

Renovate auto-merges minor/patch dependency updates and all dev dependency updates.

## Code Style

- Formatter: oxfmt (config in `.oxfmtrc.json`) — single quotes, no semicolons
- Linting: oxlint runs first, then ESLint (flat config in `eslint.config.ts`) with vue/essential + TypeScript recommended
- PRs target the `staging` branch, not `main`
