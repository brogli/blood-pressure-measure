# Blood Pressure Measure

This project was created to easily note down manually taken blood pressure measurement with ease of use and a privacy first design in mind.

## Using

Access [the app in production](https://bluetdruck.nebeprojekt.li), add your measurements, export your measurements to csv, keep that file secure.

## Providing Feedback

Feel free to create an issue [here](https://github.com/brogli/blood-pressure-measure/issues).

## Run locally

### Prep
1. Clone repo
2. Run npm install

```sh
npm install
```
### Run in dev mode with hot reloading

```sh
npm run dev
```
Or run the IntelliJ run config for this.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Tech Stack
Vue3 using Composition API, Pinia, Typescript and PrimeVue. It's hosted on Cloudflare Pages.

## Testing PWA

1. Build and preview — the dev server doesn't generate the service worker, so you need a production build:
   npm run build && npm run preview
2. Check in browser — open the preview URL, then in Chrome DevTools:
   - Application > Manifest — verify the manifest loads with correct name, icons, theme color
   - Application > Service Workers — verify a service worker is registered and active
   - Application > Cache Storage — verify static assets (js, css, html, icons) are cached
3. Test offline — in DevTools Network tab, check "Offline", then reload. The app should still load and function from cache.
4. Test install — the browser should show an install prompt (or the install icon in the address bar) if the manifest is valid.