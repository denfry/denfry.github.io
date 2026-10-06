# denfry.github.io

Source of [denfry.github.io](https://denfry.github.io), the portfolio of Danila Yurkov: a single-page React site with a static prerender step so the content is present in the served HTML.

[![Deploy to GitHub Pages](https://github.com/denfry/denfry.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/denfry/denfry.github.io/actions/workflows/deploy.yml)

## Features

- English and Russian content with a language toggle; the choice is stored in `localStorage`.
- Light and dark themes with a toggle.
- Work section driven by a typed project list (`src/content.ts`) with responsive WebP images (800 and 1600 px).
- Animated WebGL terrain scene (three.js via react-three-fiber) with a fallback when WebGL is unavailable.
- Static prerender of the React tree into `dist/index.html`, plus Open Graph image, sitemap and `robots.txt`.

## Stack

React 18, TypeScript, Vite 5, three.js with `@react-three/fiber` and `drei`, Framer Motion, CSS Modules, `sharp` for image generation. Fonts come from `@fontsource` packages (Fraunces, Inter Tight, JetBrains Mono).

## Getting started

Requires Node.js 20 or newer (the CI workflow uses Node 20).

```bash
npm ci
npm run dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Full production build (see below) |
| `npm run preview` | Serve the built `dist/` locally |

`npm run build` runs these steps in order:

1. `scripts/generate-og.mjs` renders the 1200x630 Open Graph image to `public/og.png`.
2. `tsc --noEmit` type-checks the project.
3. `vite build` builds the client bundle into `dist/`.
4. `vite build --ssr src/ssr.tsx --outDir .ssr` builds a server bundle that exports `render()`.
5. `scripts/prerender.mjs` calls `render()` and injects the markup into the empty `#root` of `dist/index.html`, then removes `.ssr`.

`scripts/optimize-images.mjs` is run manually (`node scripts/optimize-images.mjs`) to produce the 800 and 1600 px WebP variants of the PNG screenshots in `public/work/`.

## Project layout

```
src/
  App.tsx, main.tsx, ssr.tsx   app root, client entry, prerender entry
  components/                  Header, Intro, Work, Footer, Scene (WebGL), controls
  content.ts                   project list with en/ru descriptions
  i18n.ts                      UI strings per language
  context/PrefsContext.tsx     language and theme state
scripts/                       OG image, image optimization, prerender
public/                        favicons, og.png, sitemap, robots.txt, work images
docs/superpowers/              design specs and implementation plans
```

## Deployment

`.github/workflows/deploy.yml` builds the site with `npm ci && npm run build` on every push to `master` (or manually via `workflow_dispatch`) and publishes `dist/` with the GitHub Pages actions.

## Editing content

Add or change projects in `src/content.ts` and UI strings in `src/i18n.ts`. Put new screenshots in `public/work/` and add them to the `INPUT` list in `scripts/optimize-images.mjs` before generating the WebP sizes.

## License

MIT. See [LICENSE](LICENSE).
