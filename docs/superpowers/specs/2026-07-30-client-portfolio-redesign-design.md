# Client-facing portfolio redesign — design

## Context

`denfry.github.io` is currently framed as a personal "Java developer / Minecraft
systems" page: the Work section lists personal tools and Minecraft plugins/mods,
copy is Minecraft-first, and the visual style (`#F4F1EA` cream background +
`#C2492D` terracotta accent, system sans) reads as a generic AI-default palette.

Goal: repurpose this same site so it can be sent directly to prospective clients
as proof of capability — "I build distinctive websites and applications" — while
keeping the personal-projects material as secondary evidence of range. Ship both
a content change (real client case studies) and a visual redesign (unique,
three.js-driven identity) in one pass.

## Content: Work section

### Data model (`src/content.ts`)

```ts
export type ProjectRole = 'client' | 'personal'

export type Project = {
  name: string
  role: ProjectRole
  image?: string        // /work/<slug>.jpg — screenshot, optional
  liveUrl?: string       // "View site" — only if a live deploy exists
  codeUrl?: string       // "Code on GitHub" — only for public repos
  tags: string[]
  desc: { en: string; ru: string }
}
```

Private client repos get `image` (and `liveUrl` if deployed) but never
`codeUrl` — no link to source is exposed for client work. Public personal repos
keep `codeUrl` as today; they generally have no `image`.

### Case list

Client cases (role: `client`, in display order):

1. **uk-altegra-landing** — management company landing page. Screenshot from
   live deploy `uk-altegra.vercel.app`. No code link (private repo).
2. **crystal-tower** — short-term rental landing for two Moscow-City
   apartments, custom "hotel" design built to a client reference. Screenshot
   from `crystal-tower-ten.vercel.app`. No code link (private).
3. **PoliternalSite** — production web platform for a Minecraft server
   business (shop, player guide, admin panel, i18n). Screenshot from
   `politernal-site.vercel.app`. No code link (private).
4. **lk-fd-demo** — full-stack demo of an OOH media-seller's client cabinet
   (interactive map, availability calendar, Excel export, admin/feed import).
   Public repo, no live deploy — use the screenshot already committed at
   `docs/screenshots/workspace-map.png` in that repo. Code link allowed
   (public repo) since it's explicitly a portfolio demo project.
5. **archivesecrets** — puzzle-hunt web app with secrets embedded in real
   site pages (Next.js + WebSocket server + Prisma). Private repo, no live
   deploy — text-only case card, no image, no link.

Personal cases (role: `personal`, shown after client cases, own sub-heading):

6. **codebase-index** (existing entry, keep as-is)
7. **agent-sync** (existing entry, keep as-is)
8. **OverWatch-ML** (existing entry, keep as-is)

Drop from the current list: AquaGuard, ContinentRegions, WorldAccessBlocker,
VeritasAd — keeps the personal section to 3 tight, varied examples (AI
tooling, agent coordination, ML) instead of an all-Minecraft wall.

### Work section layout

- Two labelled groups under the existing `gutterLabel` pattern: "Client work"
  / "Клиентские проекты" then "Labs" / "Личные проекты" — same hairline
  section divider style already used elsewhere on the page.
- `WorkItem` becomes a card: optional screenshot on top (16:9, object-fit
  cover, lazy-loaded), then number/title/description/tags as today, then a
  single action link when applicable:
  - `liveUrl` present → "View site" / "Смотреть сайт"
  - else `codeUrl` present → "Code on GitHub" / "Код на GitHub"
  - else → no link, card is descriptive only (e.g. archivesecrets)
- Cards without an image keep the current compact row layout (no empty image
  slot).

### Screenshot pipeline

- Capture `uk-altegra.vercel.app`, `crystal-tower-ten.vercel.app`,
  `politernal-site.vercel.app` via browser automation (full-page or
  above-the-fold hero, whichever reads best per site), save to
  `public/work/<slug>.jpg`, optimized (~1600px wide, compressed).
- Download `docs/screenshots/workspace-map.png` from the `lk-fd-demo` repo via
  `gh api`, save as `public/work/lk-fd-demo.jpg`.
- No image asset for `archivesecrets`.

### Copy changes (`src/i18n.ts`)

Reframe `role` / `introLead` / `focusText` away from "Java developer /
Minecraft-first" to lead with client-facing site/app work, keeping Minecraft
and AI tooling as part of the range rather than the headline. Exact copy
drafted during implementation, in both `en` and `ru`, matching the existing
STRINGS shape (no new fields beyond what the redesign needs, e.g. section
labels for the two Work groups).

## Visual redesign

### Tokens

| Role | Light | Dark |
|---|---|---|
| Paper (bg) | `#F7F6F2` | `#121014` |
| Ink (text) | `#16161D` | `#EDEAF5` |
| Muted | `#6E6B76` | `#948FA0` |
| Accent (Indigo) | `#3D2FA6` | `#8C7CFF` |
| Glow (3D scene highlight) | `#8C86FF` | `#8C86FF` |
| Hairline | `#DEDAD0` | `#2A2733` |

Moves off the current cream+terracotta pairing (a recognizable AI-default
combo) to a cooler indigo accent — also deliberately distinct from the
burgundy already used in the `crystal-tower` client site, so the portfolio
doesn't visually collide with its own case study.

### Typography

- Display (name, section headers): **Fraunces** (variable serif), used at
  large sizes, moderate weight range — not on body text.
- Body: **Inter Tight**.
- Mono (labels, tags, gutter labels, numbering): **JetBrains Mono** — replaces
  the current system-mono stack, keeps the existing "technical label" motif
  but with a chosen, licensed face instead of `ui-monospace` fallback stack.

Fonts self-hosted (woff2, subset to used weights/charsets — Latin + Cyrillic
for RU copy) under `public/fonts/`, loaded via `@font-face` in `index.css` —
no external font CDN, keeps the no-external-request posture of a static
GitHub Pages site.

### Signature element: persistent wireframe terrain scene

A `three.js` scene (via `@react-three/fiber` + `@react-three/drei`) rendered
in a `position: fixed` canvas behind all page content:

- Geometry: a voxel/terrain-like wireframe mesh (displaced grid, abstract —
  not literal Minecraft blocks), rendered as line/wireframe material with a
  subtle indigo/glow emissive tint.
- Idle motion: slow auto-rotation + parallax offset from pointer position.
- Scroll behavior: camera distance/angle interpolates with scroll progress
  across three states — close/large over the hero, pulled back and dimmer
  through Work (so it doesn't compete with case cards), near-static in the
  footer. Driven by scroll progress (0–1), not per-section JS hacks.
- Content sections sit on translucent "paper" panels (`background:
  color-mix(paper, transparent) + backdrop-filter: blur(...)`) so text stays
  legible over the moving scene.

### Accessibility & performance

- `prefers-reduced-motion`: scene renders a single static frame, no
  auto-rotation, no scroll-driven camera movement, no pointer parallax —
  extends the reduced-motion handling already used for framer-motion reveals.
- Mobile / low-end: reduced line/segment count in the mesh, `devicePixelRatio`
  capped at 2, canvas frame loop paused when the tab is hidden
  (`document.visibilitychange`).
- Fallback: if `WebGL` context creation fails, render a static gradient/SVG
  background instead of the canvas (no crash, no blank page).
- Keep existing keyboard-focus and color-contrast floor; new indigo accent
  checked for AA contrast against paper/ink in both themes.

### Stack additions

`three`, `@react-three/fiber`, `@react-three/drei` added to `package.json`
dependencies. No other new runtime dependencies.

## Out of scope

- Redeploying/hosting `lk-fd-demo` live (uses its existing repo screenshot
  instead).
- Sourcing visuals for `plugineditor` (Electron) or `nutri-tracker` (Flutter)
  — excluded from this pass per the agreed case list.
- Any backend/CMS for managing case content — `content.ts` stays a static
  TS file, same as today.
- New site/domain — this is an in-place redesign of `denfry.github.io`.

## Testing

- `npm run typecheck` / `npm run build` must pass.
- Manual check in browser: both themes (light/dark), both languages (en/ru),
  `prefers-reduced-motion: reduce` emulated, mobile viewport width, and a
  throttled/low-end CPU profile to confirm the 3D scene doesn't jank the
  scroll.
- Visually confirm all Work cards render correctly with and without
  image/liveUrl/codeUrl present (the four link-state permutations).
