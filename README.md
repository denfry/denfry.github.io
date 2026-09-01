# denfry.github.io

Source for [denfry.github.io](https://denfry.github.io) — a React/Vite portfolio
with a static SSR prerender step for SEO-friendly delivery.

```bash
npm ci
npm run dev
```

`npm run build` generates the 1200×630 Open Graph image, builds the client and
SSR bundles, and writes the prerendered page to `dist/index.html`.
