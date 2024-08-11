# Blood Pressure Measure

This project was created to easily note down manually taken blood pressure measurement with ease of use and a privacy first design in mind.

## Using

Access [the app in production](https://bluetdruck.nebeprojekt.li), add your measurements, export your measurements to csv, keep that file secure.

## Developing

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

### Making a pull request
1. branch out from staging branch into a feature branch
2. make a PR into staging branch

### Deployment
- After receiving a commit, the **staging** branch is automatically deployed to staging.bluetdruck.nebeprojekt.li
- After receiving a commit, the **main** branch is automatically deployed to bluetdruck.nebeprojekt.li which is production.

Both staging and production are hosted on Cloudflare Pages.

## Tech Stack
Vue3 using Composition API, Pinia, Typescript and PrimeVue.