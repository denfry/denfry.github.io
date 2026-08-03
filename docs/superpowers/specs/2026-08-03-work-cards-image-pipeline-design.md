# Work cards redesign, image pipeline, and page polish — design

## Context

Follow-up to the 2026-07-30 client portfolio redesign. The site structure,
palette (paper/indigo), typography (Fraunces / Inter Tight / JetBrains Mono),
and the wireframe terrain scene stay as-is. This pass fixes three concrete
problems:

1. **Heavy PNG screenshots** — four PNGs at 394–787 KB each (2.2 MB total),
   loaded at full width on every viewport.
2. **Cropped screenshots** — images are 1568×756 (~2.07:1) but rendered at
   16:9 with `object-fit: cover`, cutting ~14% off each shot.
3. **Plain card look** — screenshots sit flat in a hairline box; the Work
   section is the proof-of-capability centerpiece and should look like real
   product shots.

Plus a light polish pass on the hero and page rhythm.

## 1. Work cards — browser-chrome frame

`WorkItem` renders each screenshot inside a fake browser window:

- Window chrome: three traffic-light dots + URL pill showing the project's
  live URL host (`uk-altegra.vercel.app`, `crystal-tower-ten.vercel.app`, …).
  For projects with a `codeUrl` but no `liveUrl` (lk-fd-demo), the pill shows
  the GitHub host path.
- Chrome drawn in pure CSS/HTML (no image assets): dots, hairline borders,
  background matching the theme (`--bg`), radius ~10px, soft shadow.
- Screenshot fills the window body at its **natural aspect ratio (~2.07:1)**
  — no cropping. `width`/`height` attributes set to the natural pixel
  dimensions to prevent layout shift.
- Hover: the card lifts (translateY) and the screenshot zooms slightly
  (scale 1.03), both via CSS transitions, disabled under
  `prefers-reduced-motion` (existing global reduced-motion rule covers this).
- Text block below (name, desc, tags, link) unchanged.

Cards without an image (archivesecrets, all personal projects) keep the
current compact row layout.

## 2. Image pipeline

- Convert the four `public/work/*.png` screenshots to **WebP** with the
  `sharp` package (devDependency), one-time script `scripts/optimize-images.mjs`.
- Two widths per image: 1600px (max) and 800px (mobile).
- Output: `public/work/<slug>-1600.webp`, `public/work/<slug>-800.webp`.
- PNGs remain as `src` fallback (kept, since `<picture>` needs a fallback).
- `WorkItem` uses `<picture>`:

```tsx
<picture>
  <source type="image/webp" srcSet="...800.webp 800w, ...1600.webp 1600w" sizes="(max-width: 520px) 100vw, 80vw" />
  <img src="/work/x.png" srcSet="..." width={1568} height={756} alt={...} loading="lazy" decoding="async" />
</picture>
```

- `alt`: per-project alt text in the current language, added to `Project`
  type as `alt: { en: string; ru: string }` (descriptive, not empty).
- `sizes` accounts for the card being ~1fr of a gutter-grid column (~80vw at
  most).

## 3. Page polish

- **Intro lead**: switch to the display face (Fraunces), slightly larger,
  tighter leading; the final sentence gets an indigo accent treatment
  (a highlighted span). Content unchanged.
- **Scroll progress bar**: thin 1–2px indigo bar fixed at the top of the
  viewport, width driven by the existing `useScrollProgress` hook.
- **Footer**: already consistent — no changes beyond existing hover styles.
- Focus/Background `LabeledSection` spacing: unchanged (already matches
  `.section` rhythm); verify rhythm against new card height only.

## Out of scope

- New screenshots for archivesecrets / personal projects (text-only cards
  stay as they are).
- AVIF (WebP covers modern browsers; keep the pipeline simple).
- Any change to the 3D scene, header, theme toggle, or i18n strings.

## Testing

- `npm run typecheck` and `npm run build` pass.
- Screenshots render at natural ratio in both themes; WebP loads on modern
  browsers, PNG fallback intact; no layout shift (width/height set).
- Hover lift/zoom works, and is inert under reduced motion.
- Manual check: mobile viewport, light/dark, en/ru.
