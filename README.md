# Blood Pressure Measure

This project was created to easily note down manually taken blood pressure measurement with ease of use and a privacy first design in mind.

## Using

Access [the app in production](https://bluetdruck.nebeprojekt.li), add your measurements, export your measurements to csv, keep that file secure.

## Providing Feedback

Feel free to create an issue [here](https://github.com/brogli/blood-pressure-measure/issues).

## Run locally

### Prerequisites

- [Nix package manager](https://nixos.org/download/) with flakes enabled
- [direnv](https://direnv.net/) hooked into your shell

Node.js and pnpm come from the dev shell in `flake.nix`, pinned via `flake.lock`. On first `cd` into the repo run
`direnv allow`; afterwards the shell loads automatically. Without direnv: `nix develop`.

`.nvmrc` only tells Cloudflare Pages which Node version to build with.

### Getting started

```sh
git clone <this-repo>
cd blood-pressure-measure
direnv allow
pnpm install
pnpm dev          # http://localhost:5173
```

Or run the IntelliJ run config.

### Scripts

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | Vite dev server with HMR (`http://localhost:5173`)   |
| `pnpm build`      | Type-check + production build (runs in parallel)     |
| `pnpm preview`    | Serve the production build (`http://localhost:4173`) |
| `pnpm type-check` | `vue-tsc --build` only                               |
| `pnpm test:unit`  | Unit tests with Vitest (jsdom)                       |
| `pnpm lint`       | oxlint, ESLint, Stylelint in sequence (`--fix`)      |
| `pnpm format`     | Formats `src/` with oxfmt                            |
| `treefmt`         | Repo-wide: lint fixes + oxfmt (incl. `.md`), nixfmt  |

## Tech Stack

Vue3 using Composition API, Pinia, Typescript, OpenVue and Tailwind CSS. It's hosted on Cloudflare Pages.

## Testing PWA

1. Build and preview — the dev server doesn't generate the service worker, so you need a production build:
   `pnpm build && pnpm preview`
2. Check in browser — open the preview URL, then in Chrome DevTools:
   - Application > Manifest — verify the manifest loads with correct name, icons, theme color
   - Application > Service Workers — verify a service worker is registered and active
   - Application > Cache Storage — verify static assets (js, css, html, icons) are cached
3. Test offline — in DevTools Network tab, check "Offline", then reload. The app should still load and function from cache.
4. Test install — the browser should show an install prompt (or the install icon in the address bar) if the manifest is valid.
