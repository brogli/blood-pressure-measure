# Blood Pressure Measure

This project was created to easily note down manually taken blood pressure measurement with ease of use and a privacy first design in mind.

## Using

Access [the app in production](https://bluetdruck.nebeprojekt.li), add your measurements, export your measurements to csv, keep that file secure.

## Providing Feedback

Feel free to create an issue [here](https://github.com/brogli/blood-pressure-measure/issues).

## Run locally

### Prerequisites

- **Node.js** — version pinned in `.nvmrc` (and enforced via `engines` in `package.json`). Use a version manager (`nvm`
  or `fnm`) so it picks up automatically:
  ```sh
  nvm install && nvm use   # reads .nvmrc
  # or
  fnm use                  # reads .nvmrc (fnm auto-switches on cd if configured)
  ```
- **pnpm** — version pinned via `packageManager` in `package.json`. Easiest path
  is [Corepack](https://nodejs.org/api/corepack.html), which ships with Node and will use the exact pinned version
  automatically:
  ```sh
  corepack enable
  ```
  Alternatively: `npm install -g pnpm` or follow the [pnpm install docs](https://pnpm.io/installation).

### Getting started

```sh
git clone <this-repo>
cd blood-pressure-measure
pnpm install
pnpm dev          # http://localhost:5173
```

Or run the IntelliJ run config.

### Scripts

| Command           | What it does                                         |
|-------------------|------------------------------------------------------|
| `pnpm dev`        | Vite dev server with HMR (`http://localhost:5173`)   |
| `pnpm build`      | Type-check + production build (runs in parallel)     |
| `pnpm preview`    | Serve the production build (`http://localhost:4173`) |
| `pnpm type-check` | `vue-tsc --build` only                               |
| `pnpm test:unit`  | Unit tests with Vitest (jsdom)                       |
| `pnpm lint`       | Runs oxlint then ESLint (both with `--fix`)          |
| `pnpm format`     | Formats `src/` with oxfmt                            |

## Tech Stack
Vue3 using Composition API, Pinia, Typescript and PrimeVue. It's hosted on Cloudflare Pages.

## Testing PWA

1. Build and preview — the dev server doesn't generate the service worker, so you need a production build:
   `pnpm build && pnpm preview`
2. Check in browser — open the preview URL, then in Chrome DevTools:
   - Application > Manifest — verify the manifest loads with correct name, icons, theme color
   - Application > Service Workers — verify a service worker is registered and active
   - Application > Cache Storage — verify static assets (js, css, html, icons) are cached
3. Test offline — in DevTools Network tab, check "Offline", then reload. The app should still load and function from cache.
4. Test install — the browser should show an install prompt (or the install icon in the address bar) if the manifest is valid.