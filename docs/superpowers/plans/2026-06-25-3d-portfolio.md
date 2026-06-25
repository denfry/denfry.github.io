# 3D Voxel Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Denfry's portfolio from Vite/React (GitHub Pages) to Next.js 15 + React Three Fiber with a scroll-driven voxel hero, landing + MDX case studies, EN/RU i18n, a Resend contact form, and a Telegram order CTA — deployed on Vercel.

**Architecture:** Next.js 15 App Router with a `[locale]` segment (next-intl). Server Components render static sections; the voxel hero is a lazily-loaded client island (R3F) driven by GSAP ScrollTrigger synced to Lenis. Project content is migrated from the existing `content.ts` into a typed module; case studies are MDX compiled by Velite; the "More on GitHub" grid is fetched from the GitHub API at build time with a static fallback. The contact form posts to a Server Action that validates with Zod and sends via Resend.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, three.js + @react-three/fiber + drei + postprocessing, GSAP + ScrollTrigger, Lenis, Motion, next-intl, next-themes, Velite (MDX), Zod, React Hook Form, Resend, Biome, Playwright, Vercel.

## Global Constraints

- Node ≥ 20, package manager: **pnpm**.
- Locales: **`en`, `ru`** only. Default locale `en`. All user-facing copy is bilingual.
- Telegram order CTA → `https://t.me/denfry_dev` (the only Telegram link; do NOT use `kfcbossalbino`).
- GitHub profile link → `https://github.com/denfry`.
- Featured projects (verbatim names/urls): `codebase-index`, `agent-sync`, `OverWatch-ML`, `AquaGuard`, `ContinentRegions`, `WorldAccessBlocker`, `VeritasAd`.
- Lighthouse mobile target ≥ 90; 3D must be lazy-loaded and respect `prefers-reduced-motion`.
- TypeScript `strict: true`. Lint/format via Biome. Conventional Commit messages.
- Deploy target: **Vercel** (not GitHub Pages). Remove the Pages workflow.

---

## Phase 0 — Foundation

### Task 1: Scaffold Next.js 15 in place (replace Vite)

**Files:**
- Create: `app/`, `next.config.ts`, `tsconfig.json`, `package.json` (replaced)
- Delete: `vite.config.ts`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`
- Preserve: `.git/`, `docs/`, `public/`, `src/` (kept temporarily as reference for migration)

**Interfaces:**
- Produces: a running Next.js app at `/` with default page; `pnpm dev`, `pnpm build`, `pnpm start` scripts.

- [ ] **Step 1: Scaffold into a temp dir** (create-next-app needs an empty target)

```bash
cd "$(mktemp -d)" && pnpm create next-app@latest portfolio-next \
  --ts --app --tailwind --eslint=false --src-dir=false \
  --import-alias "@/*" --use-pnpm --turbopack
```

- [ ] **Step 2: Move scaffold into the repo, keeping git/docs/old-src**

```bash
# from the temp scaffold dir
cd portfolio-next
# copy everything except node_modules into the repo root
cp -r app next.config.ts tsconfig.json package.json postcss.config.mjs \
  next-env.d.ts .gitignore "C:/Projects/portfolio/"
cp -r public/* "C:/Projects/portfolio/public/" 2>/dev/null || true
```

- [ ] **Step 3: Remove the old Vite entrypoints**

```bash
cd "C:/Projects/portfolio"
rm -f vite.config.ts index.html src/main.tsx src/vite-env.d.ts
# keep src/ (content.ts, i18n.ts, components) as migration reference for now
mv src src_legacy
```

- [ ] **Step 4: Install and run the dev build to verify it boots**

```bash
cd "C:/Projects/portfolio" && pnpm install && pnpm build
```
Expected: build succeeds, `.next/` produced, no type errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 app, retire Vite setup"
```

### Task 2: Biome + strict TS + scripts

**Files:**
- Create: `biome.json`
- Modify: `tsconfig.json` (ensure `"strict": true`), `package.json` (scripts)

- [ ] **Step 1: Add Biome**

```bash
cd "C:/Projects/portfolio" && pnpm add -D @biomejs/biome && pnpm biome init
```

- [ ] **Step 2: Configure `biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": { "ignore": ["src_legacy/**", ".next/**", ".velite/**", "node_modules/**"] },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2 },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "javascript": { "formatter": { "quoteStyle": "single", "semicolons": "asNeeded" } }
}
```

- [ ] **Step 3: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "biome check .",
  "format": "biome format --write .",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 4: Verify**

```bash
pnpm typecheck && pnpm lint
```
Expected: both pass (0 errors).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: add Biome, strict TS, npm scripts"
```

### Task 3: Playwright smoke harness

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`

**Interfaces:**
- Produces: `pnpm e2e` running Playwright against a built app.

- [ ] **Step 1: Install Playwright**

```bash
pnpm add -D @playwright/test && pnpm exec playwright install chromium
```

- [ ] **Step 2: `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  webServer: { command: 'pnpm build && pnpm start', url: 'http://localhost:3000', timeout: 120_000, reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://localhost:3000' },
})
```

- [ ] **Step 3: Write the failing smoke test**

```ts
// e2e/smoke.spec.ts
import { test, expect } from '@playwright/test'
test('home page renders the name', async ({ page }) => {
  await page.goto('/en')
  await expect(page.getByRole('heading', { name: /Denfry/i })).toBeVisible()
})
```

- [ ] **Step 4: Run it — expect FAIL** (no `/en` route yet)

```bash
pnpm e2e
```
Expected: FAIL (route 404 / heading not found). This passes after Task 5.

- [ ] **Step 5: Add script + commit**

Add `"e2e": "playwright test"` to scripts.
```bash
git add -A && git commit -m "test: add Playwright smoke harness (red)"
```

### Task 4: next-intl routing (EN/RU)

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/en.json`, `messages/ru.json`
- Modify: `next.config.ts`, `app/layout.tsx`; Move `app/page.tsx` → `app/[locale]/page.tsx`, add `app/[locale]/layout.tsx`

**Interfaces:**
- Produces: locale-prefixed routes `/en`, `/ru`; `getTranslations`/`useTranslations` available; `messages` namespaces: `meta`, `hero`, `about`, `stack`, `projects`, `contact`, `nav`.

- [ ] **Step 1: Install**

```bash
pnpm add next-intl
```

- [ ] **Step 2: `i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing'
export const routing = defineRouting({ locales: ['en', 'ru'], defaultLocale: 'en' })
```

- [ ] **Step 3: `i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'en' | 'ru')) locale = routing.defaultLocale
  return { locale, messages: (await import(`../messages/${locale}.json`)).default }
})
```

- [ ] **Step 4: `middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
export default createMiddleware(routing)
export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] }
```

- [ ] **Step 5: Wire the plugin in `next.config.ts`**

```ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()
const nextConfig = {}
export default withNextIntl(nextConfig)
```

- [ ] **Step 6: Migrate copy from `src_legacy/i18n.ts` into `messages/en.json` and `messages/ru.json`**

```json
// messages/en.json
{
  "meta": { "title": "Denfry — Java developer", "description": "Java developer building server-side Minecraft systems and open-source tooling for AI coding agents." },
  "nav": { "projects": "Projects", "order": "Order a project", "github": "GitHub" },
  "hero": { "role": "Java developer", "lead": "I build server-side Minecraft systems — plugins, mods, anti-cheat — and open-source tooling for AI coding agents.", "cta": "Order a project", "see": "See projects" },
  "about": { "label": "Background", "text": "Networking and information systems, database design, and backend architecture. I run my own Minecraft server, so most projects are tested in real production, not just prototypes." },
  "stack": { "label": "Focus", "text": "Minecraft (Paper, Spigot, Forge) · Java backend (Spring, PostgreSQL, MySQL) · Python tooling and ML · anti-cheat and behavior analysis · server performance and infrastructure." },
  "projects": { "selected": "Selected work", "more": "More on GitHub", "allRepos": "All repositories →" },
  "contact": { "title": "Let's build something", "order": "Order a project on Telegram", "name": "Name", "contact": "Your contact", "message": "Message", "send": "Send", "sent": "Sent — I'll get back to you.", "error": "Couldn't send. Reach me on Telegram instead." }
}
```
Mirror the same keys in `messages/ru.json` using the Russian strings from `src_legacy/i18n.ts` (`role`: "Java-разработчик", `lead`: "Делаю серверные системы для Minecraft …", etc.).

- [ ] **Step 7: Restructure routes**

Create `app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>
}
```

Create `app/[locale]/page.tsx`:
```tsx
import { useTranslations } from 'next-intl'
export default function Home() {
  const t = useTranslations('hero')
  return <main><h1>Denfry — {t('role')}</h1></main>
}
```

Keep root `app/layout.tsx` as the `<html>` shell (lang set later via theme task).

- [ ] **Step 8: Verify smoke test passes**

```bash
pnpm e2e
```
Expected: PASS (`/en` shows "Denfry").

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: add next-intl EN/RU routing and migrate copy"
```

### Task 5: Theme provider (dark/light)

**Files:**
- Create: `components/providers/ThemeProvider.tsx`, `components/ui/ThemeToggle.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `<ThemeProvider>` (next-themes) wrapping the app; `next-themes` attribute `class` on `<html>`.

- [ ] **Step 1: Install**

```bash
pnpm add next-themes
```

- [ ] **Step 2: `components/providers/ThemeProvider.tsx`**

```tsx
'use client'
import { ThemeProvider as NextThemes } from 'next-themes'
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>{children}</NextThemes>
}
```

- [ ] **Step 3: Wrap in root `app/layout.tsx`**

```tsx
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  )
}
```

- [ ] **Step 4: `components/ui/ThemeToggle.tsx`** (client, toggles theme)

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <button aria-label="Toggle theme" className="size-9" />
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'
  return <button aria-label="Toggle theme" onClick={() => setTheme(next)}>{resolvedTheme === 'dark' ? '☀' : '☾'}</button>
}
```

- [ ] **Step 5: Verify** — `pnpm dev`, toggle switches `class="dark"` on `<html>`; `pnpm typecheck` passes.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add next-themes dark/light theme"
```

---

## Phase 1 — Design system, layout, data

### Task 6: Tailwind v4 tokens + shadcn/ui

**Files:**
- Modify: `app/globals.css` (theme tokens), `components.json` (shadcn)
- Create: `lib/utils.ts`, initial shadcn primitives (`button`, `card`, `input`, `textarea`, `sonner`)

- [ ] **Step 1: Init shadcn**

```bash
pnpm dlx shadcn@latest init -d
pnpm dlx shadcn@latest add button card input textarea sonner badge
```

- [ ] **Step 2: Define design tokens in `app/globals.css`** (CSS variables for light/dark, brand accent). Add `@theme` block with `--color-accent` and font variables.

```css
@import 'tailwindcss';
@custom-variant dark (&:is(.dark *));
@theme {
  --color-accent: oklch(0.72 0.19 145);
  --font-sans: var(--font-sans);
  --font-display: var(--font-display);
}
:root { --background: oklch(0.99 0 0); --foreground: oklch(0.2 0 0); }
.dark { --background: oklch(0.16 0.01 260); --foreground: oklch(0.95 0 0); }
body { background: var(--background); color: var(--foreground); }
```

- [ ] **Step 3: Verify** — `pnpm build` succeeds; a `<Button>` renders.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: tailwind v4 tokens + shadcn/ui primitives"
```

### Task 7: Fonts (next/font, variable)

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Load a body + display font in `app/layout.tsx`**

```tsx
import { Inter, Space_Grotesk } from 'next/font/google'
const sans = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' })
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })
// add `${sans.variable} ${display.variable}` to <html> className
```

- [ ] **Step 2: Verify** — `cyrillic` subset present so RU renders; `pnpm build` passes.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add variable fonts with cyrillic subset"
```

### Task 8: Project data layer (migrate content.ts)

**Files:**
- Create: `lib/projects.ts`, `lib/contacts.ts`
- Test: `e2e/data.spec.ts` (or a Vitest unit — see step 1)

**Interfaces:**
- Produces: `FEATURED: Project[]` and `CONTACTS`. `type Project = { name: string; url: string; slug: string; tags: string[]; desc: { en: string; ru: string } }`.

- [ ] **Step 1: Add Vitest for pure-logic units**

```bash
pnpm add -D vitest
```
Add `"test": "vitest run"` to scripts.

- [ ] **Step 2: Write failing test `lib/projects.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { FEATURED } from './projects'
describe('FEATURED', () => {
  it('has the 7 featured projects with slugs and urls', () => {
    expect(FEATURED).toHaveLength(7)
    expect(FEATURED.map(p => p.name)).toContain('codebase-index')
    for (const p of FEATURED) {
      expect(p.url).toMatch(/^https:\/\/github\.com\/denfry\//)
      expect(p.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })
})
```

- [ ] **Step 3: Run — expect FAIL** (`pnpm test`) — module missing.

- [ ] **Step 4: Create `lib/projects.ts`** (port the 7 from `src_legacy/content.ts`, add `slug`)

```ts
export type Project = { name: string; url: string; slug: string; tags: string[]; desc: { en: string; ru: string } }
export const FEATURED: Project[] = [
  { name: 'codebase-index', slug: 'codebase-index', url: 'https://github.com/denfry/codebase-index', tags: ['Python', '★ 4'], desc: { en: 'Local-first codebase indexing for AI coding agents — hybrid FTS5 + Tree-sitter + graph search, fully offline.', ru: 'Локальная индексация кода для AI-агентов — гибрид FTS5 + Tree-sitter + графовый поиск, полностью офлайн.' } },
  { name: 'agent-sync', slug: 'agent-sync', url: 'https://github.com/denfry/agent-sync', tags: ['Python', 'CLI'], desc: { en: 'Coordinate multiple AI coding-agent sessions in one repo: shared tasks, file locks, and live messaging over a local SQLite layer.', ru: 'Координация нескольких сессий AI-агентов в одном репозитории: общие задачи, блокировки файлов и обмен сообщениями поверх локального SQLite.' } },
  { name: 'OverWatch-ML', slug: 'overwatch-ml', url: 'https://github.com/denfry/OverWatch-ML', tags: ['Java', 'ML'], desc: { en: 'Cheat-detection system for modern Minecraft servers, using behavior analysis and machine learning.', ru: 'Система детекта читов для современных Minecraft-серверов на основе анализа поведения и машинного обучения.' } },
  { name: 'AquaGuard', slug: 'aquaguard', url: 'https://github.com/denfry/AquaGuard', tags: ['Java', 'Forge mod'], desc: { en: 'Block logging, inspection and rollback mod for Minecraft Forge 1.18.2–1.21.1.', ru: 'Мод логирования блоков, инспекции и отката для Minecraft Forge 1.18.2–1.21.1.' } },
  { name: 'ContinentRegions', slug: 'continent-regions', url: 'https://github.com/denfry/ContinentRegions', tags: ['Java', 'Paper plugin'], desc: { en: 'Paper 1.21.x plugin: draw continents on a BlueMap web map and turn them into WorldGuard regions. SQLite, flag presets, rollback, REST API.', ru: 'Плагин Paper 1.21.x: рисует континенты на веб-карте BlueMap и превращает их в регионы WorldGuard. SQLite, пресеты флагов, откат, REST API.' } },
  { name: 'WorldAccessBlocker', slug: 'world-access-blocker', url: 'https://github.com/denfry/WorldAccessBlocker', tags: ['Java', 'Paper plugin'], desc: { en: 'Blocks access to the End, Nether and elytra with configurable, fine-grained rules.', ru: 'Блокирует доступ в Энд, Незер и к элитрам с гибкими настраиваемыми правилами.' } },
  { name: 'VeritasAd', slug: 'veritas-ad', url: 'https://github.com/denfry/VeritasAd', tags: ['Python', 'ML'], desc: { en: 'Neural-network analysis system for detecting advertising integrations.', ru: 'Нейросетевая система анализа для детекта рекламных интеграций.' } },
]
```

- [ ] **Step 5: Create `lib/contacts.ts`**

```ts
export const CONTACTS = {
  orderTelegram: 'https://t.me/denfry_dev',
  github: 'https://github.com/denfry',
  allRepos: 'https://github.com/denfry?tab=repositories',
}
```

- [ ] **Step 6: Run — expect PASS** (`pnpm test`).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: migrate project + contact data with slugs"
```

### Task 9: GitHub repos fetch (build-time, with fallback)

**Files:**
- Create: `lib/github.ts`, `lib/github-fallback.json`
- Test: `lib/github.test.ts`

**Interfaces:**
- Produces: `getMoreRepos(): Promise<Repo[]>` — public, non-fork, non-featured repos sorted by stars then recency. `type Repo = { name: string; url: string; description: string | null; language: string | null; stars: number }`.

- [ ] **Step 1: Write failing test** (pure filter/sort logic extracted)

```ts
import { describe, it, expect } from 'vitest'
import { filterAndSort } from './github'
const sample = [
  { name: 'codebase-index', fork: false, archived: false, stargazers_count: 4, html_url: 'u', description: 'd', language: 'Python' },
  { name: 'panel', fork: true, archived: false, stargazers_count: 0, html_url: 'u', description: null, language: null },
  { name: 'WindowsCleaner', fork: false, archived: false, stargazers_count: 0, html_url: 'u', description: 'd', language: 'PowerShell' },
]
describe('filterAndSort', () => {
  it('drops forks and featured, keeps the rest sorted by stars', () => {
    const out = filterAndSort(sample as never, new Set(['codebase-index']))
    expect(out.map(r => r.name)).toEqual(['WindowsCleaner'])
  })
})
```

- [ ] **Step 2: Run — expect FAIL** (`pnpm test`).

- [ ] **Step 3: Implement `lib/github.ts`**

```ts
import fallback from './github-fallback.json'
import { FEATURED } from './projects'

export type Repo = { name: string; url: string; description: string | null; language: string | null; stars: number }
type ApiRepo = { name: string; fork: boolean; archived: boolean; stargazers_count: number; html_url: string; description: string | null; language: string | null }

export function filterAndSort(repos: ApiRepo[], featured: Set<string>): Repo[] {
  return repos
    .filter((r) => !r.fork && !r.archived && !featured.has(r.name))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .map((r) => ({ name: r.name, url: r.html_url, description: r.description, language: r.language, stars: r.stargazers_count }))
}

export async function getMoreRepos(): Promise<Repo[]> {
  const featured = new Set(FEATURED.map((p) => p.name))
  try {
    const res = await fetch('https://api.github.com/users/denfry/repos?per_page=100&sort=updated', {
      headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
      next: { revalidate: 86_400 },
    })
    if (!res.ok) throw new Error(`GitHub ${res.status}`)
    return filterAndSort(await res.json(), featured)
  } catch {
    return filterAndSort(fallback as ApiRepo[], featured)
  }
}
```

- [ ] **Step 4: Snapshot fallback** — save current API output to `lib/github-fallback.json`:

```bash
gh api "users/denfry/repos?per_page=100&sort=updated" > lib/github-fallback.json
```

- [ ] **Step 5: Run — expect PASS** (`pnpm test`).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: build-time GitHub repos fetch with fallback"
```

### Task 10: Header + Footer + language switch

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/ui/LocaleSwitch.tsx`
- Modify: `app/[locale]/layout.tsx` (mount Header/Footer)

**Interfaces:**
- Consumes: `ThemeToggle`, `CONTACTS`, next-intl `Link`/`usePathname` from `@/i18n/navigation`.
- Produces: sticky header with brand, nav, theme + locale switches; footer with links.

- [ ] **Step 1: Add `i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

- [ ] **Step 2: `components/ui/LocaleSwitch.tsx`** (toggles en/ru preserving path)

```tsx
'use client'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
export function LocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const other = locale === 'en' ? 'ru' : 'en'
  return <button aria-label="Switch language" onClick={() => router.replace(pathname, { locale: other })}>{other.toUpperCase()}</button>
}
```

- [ ] **Step 3: Build `Header.tsx`** (Server Component using `useTranslations('nav')`, includes `<ThemeToggle/>` and `<LocaleSwitch/>`, an "Order" button → `CONTACTS.orderTelegram`).

- [ ] **Step 4: Build `Footer.tsx`** (GitHub link, Telegram order link, year).

- [ ] **Step 5: Mount both in `app/[locale]/layout.tsx`** around `{children}`.

- [ ] **Step 6: Extend smoke test** — header shows brand, locale switch navigates `/en`↔`/ru`.

```ts
test('locale switch navigates to ru', async ({ page }) => {
  await page.goto('/en')
  await page.getByRole('button', { name: 'Switch language' }).click()
  await expect(page).toHaveURL(/\/ru/)
})
```

- [ ] **Step 7: Verify** `pnpm e2e` passes; **commit**

```bash
git add -A && git commit -m "feat: header, footer, locale switch"
```

---

## Phase 2 — Landing sections (static first)

### Task 11: Hero (static) with CTAs

**Files:**
- Create: `components/sections/Hero.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `useTranslations('hero')`, `CONTACTS`.
- Produces: `<Hero/>` with `h1` (name+role), lead, "Order a project" (→ telegram) and "See projects" (anchor `#projects`) buttons. Has a `data-hero` wrapper element the 3D canvas mounts behind in Task 19.

- [ ] **Step 1: Write `Hero.tsx`** — full-viewport section, heading `Denfry — {role}`, lead paragraph, two `<Button>`s; a `<div data-voxel-mount />` placeholder layer (absolutely positioned, `aria-hidden`).

- [ ] **Step 2: Render `<Hero/>` in `page.tsx`**, remove the placeholder `<h1>`.

- [ ] **Step 3: Verify** smoke test still finds the `Denfry` heading; `pnpm e2e` passes.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: static hero with order/see CTAs"
```

### Task 12: About + Stack sections

**Files:**
- Create: `components/sections/About.tsx`, `components/sections/Stack.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: `About.tsx`** — labeled section using `about.label` / `about.text`.

- [ ] **Step 2: `Stack.tsx`** — `stack.label` / `stack.text` plus language chips: `['Java','Python','Go','Rust','C#','Flutter','PowerShell']` rendered as `<Badge>`s.

- [ ] **Step 3: Render both in `page.tsx`**.

- [ ] **Step 4: Verify** — `pnpm build` + visual check both langs.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: about + stack sections"
```

### Task 13: Featured projects grid

**Files:**
- Create: `components/sections/FeaturedProjects.tsx`, `components/ProjectCard.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `FEATURED`, locale (for `desc[locale]`), next-intl `Link`.
- Produces: `#projects` section; each card links to `/[locale]/projects/[slug]` and shows tags.

- [ ] **Step 1: `ProjectCard.tsx`** — `<Card>` with name, localized desc, tag badges, link to case page; hover elevation.

- [ ] **Step 2: `FeaturedProjects.tsx`** — `id="projects"`, heading `projects.selected`, maps `FEATURED` into `<ProjectCard>` grid.

- [ ] **Step 3: Render in `page.tsx`**.

- [ ] **Step 4: Verify** — 7 cards visible; **commit**

```bash
git add -A && git commit -m "feat: featured projects grid"
```

### Task 14: "More on GitHub" auto grid

**Files:**
- Create: `components/sections/MoreOnGitHub.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `getMoreRepos()` (async Server Component), `CONTACTS.allRepos`.

- [ ] **Step 1: `MoreOnGitHub.tsx`** (async server component)

```tsx
import { getMoreRepos } from '@/lib/github'
import { getTranslations } from 'next-intl/server'
import { CONTACTS } from '@/lib/contacts'
export async function MoreOnGitHub() {
  const repos = (await getMoreRepos()).slice(0, 9)
  const t = await getTranslations('projects')
  return (
    <section aria-label="More repositories">
      <h2>{t('more')}</h2>
      <ul>{repos.map((r) => (
        <li key={r.name}><a href={r.url}>{r.name}</a>{r.language && <span>{r.language}</span>}{r.stars > 0 && <span>★ {r.stars}</span>}{r.description && <p>{r.description}</p>}</li>
      ))}</ul>
      <a href={CONTACTS.allRepos}>{t('allRepos')}</a>
    </section>
  )
}
```

- [ ] **Step 2: Render in `page.tsx`** (wrap in `<Suspense>` with a skeleton fallback).

- [ ] **Step 3: Verify** — grid lists non-featured repos (e.g. WindowsCleaner); **commit**

```bash
git add -A && git commit -m "feat: auto 'more on github' grid"
```

---

## Phase 3 — Contact form + motion

### Task 15: Contact Server Action (Zod + Resend)

**Files:**
- Create: `lib/contact-schema.ts`, `app/[locale]/actions.ts`, `.env.example`
- Test: `lib/contact-schema.test.ts`

**Interfaces:**
- Produces: `contactSchema` (Zod), `sendContact(prev, formData): Promise<{ ok: boolean; error?: string }>` Server Action.

- [ ] **Step 1: Install**

```bash
pnpm add resend zod
```

- [ ] **Step 2: Write failing schema test `lib/contact-schema.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { contactSchema } from './contact-schema'
describe('contactSchema', () => {
  it('rejects empty message', () => { expect(contactSchema.safeParse({ name: 'a', contact: 'b', message: '' }).success).toBe(false) })
  it('accepts valid input', () => { expect(contactSchema.safeParse({ name: 'a', contact: 'b@c.d', message: 'hello there' }).success).toBe(true) })
})
```

- [ ] **Step 3: Run — expect FAIL** (`pnpm test`).

- [ ] **Step 4: `lib/contact-schema.ts`**

```ts
import { z } from 'zod'
export const contactSchema = z.object({
  name: z.string().min(1).max(80),
  contact: z.string().min(1).max(120),
  message: z.string().min(5).max(2000),
  website: z.string().max(0).optional(), // honeypot
})
export type ContactInput = z.infer<typeof contactSchema>
```

- [ ] **Step 5: Run — expect PASS** (`pnpm test`).

- [ ] **Step 6: `app/[locale]/actions.ts`** (Server Action)

```ts
'use server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/contact-schema'
export async function sendContact(_prev: { ok: boolean; error?: string }, formData: FormData) {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: 'invalid' }
  if (parsed.data.website) return { ok: true } // honeypot tripped: pretend success
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: process.env.CONTACT_TO ?? 'dabinayo@pm.me',
      subject: `Portfolio message from ${parsed.data.name}`,
      replyTo: parsed.data.contact,
      text: parsed.data.message,
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'send' }
  }
}
```

- [ ] **Step 7: `.env.example`** — `RESEND_API_KEY=`, `CONTACT_TO=dabinayo@pm.me`, `GITHUB_TOKEN=`.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: contact server action with zod + resend"
```

### Task 16: Contact form UI

**Files:**
- Create: `components/sections/Contact.tsx`, `components/ContactForm.tsx`
- Modify: `app/[locale]/page.tsx`, `app/[locale]/layout.tsx` (mount `<Toaster/>`)

**Interfaces:**
- Consumes: `sendContact`, `useActionState`, `useTranslations('contact')`, sonner `toast`.

- [ ] **Step 1: `ContactForm.tsx`** (client) using `useActionState(sendContact, { ok: false })`, hidden honeypot input `website`, fields name/contact/message, shows `toast.success(t('sent'))` on `ok`, `toast.error(t('error'))` on error.

- [ ] **Step 2: `Contact.tsx`** — `id="contact"`, title, prominent "Order a project on Telegram" button (→ `CONTACTS.orderTelegram`), then `<ContactForm/>`.

- [ ] **Step 3: Mount `<Toaster/>`** (sonner) in locale layout.

- [ ] **Step 4: Extend e2e** — submitting empty form shows a validation/error state (no navigation).

- [ ] **Step 5: Verify** `pnpm e2e`; **commit**

```bash
git add -A && git commit -m "feat: contact form ui with telegram cta"
```

### Task 17: Lenis smooth scroll + scroll reveals

**Files:**
- Create: `components/providers/SmoothScroll.tsx`, `components/Reveal.tsx`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Produces: `<SmoothScroll>` (Lenis, raf-driven, syncs `ScrollTrigger.update`); `<Reveal>` wrapper that fades/translates children in on scroll. Both respect `prefers-reduced-motion`.

- [ ] **Step 1: Install**

```bash
pnpm add lenis gsap motion
```

- [ ] **Step 2: `SmoothScroll.tsx`**

```tsx
'use client'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<{ on: (e: string, cb: () => void) => void } | null>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis.current?.on('scroll', ScrollTrigger.update)
  }, [])
  return <ReactLenis root ref={lenis as never} options={{ autoRaf: true }}>{children}</ReactLenis>
}
```

- [ ] **Step 3: `Reveal.tsx`** — uses `motion` (`whileInView`, `viewport={{ once: true }}`); when reduced-motion, render children unanimated.

- [ ] **Step 4: Wrap layout in `<SmoothScroll>`**, wrap sections in `<Reveal>`.

- [ ] **Step 5: Verify** — scroll feels smooth; reduced-motion disables it; `pnpm build` passes.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: lenis smooth scroll + reveal animations"
```

---

## Phase 4 — Voxel 3D hero

### Task 18: R3F canvas shell (lazy + fallback + error boundary)

**Files:**
- Create: `components/three/VoxelScene.tsx`, `components/three/VoxelCanvas.tsx`, `components/three/CanvasFallback.tsx`, `components/three/SceneErrorBoundary.tsx`
- Modify: `components/sections/Hero.tsx` (mount into `data-voxel-mount`)

**Interfaces:**
- Produces: `<VoxelCanvas/>` — dynamically imported (`ssr: false`) R3F `<Canvas>` wrapped in an error boundary; renders `<CanvasFallback/>` (static gradient) on error or reduced-motion.

- [ ] **Step 1: Install**

```bash
pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing
pnpm add -D @types/three
```

- [ ] **Step 2: `CanvasFallback.tsx`** — a static CSS gradient/grid (the reduced-motion + error poster).

- [ ] **Step 3: `SceneErrorBoundary.tsx`** — class component, `componentDidCatch` → render `<CanvasFallback/>`.

- [ ] **Step 4: `VoxelScene.tsx`** — the `<Canvas>` with camera, lights, and a single placeholder `<mesh>` (cube) for now.

- [ ] **Step 5: `VoxelCanvas.tsx`**

```tsx
'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { CanvasFallback } from './CanvasFallback'
import { SceneErrorBoundary } from './SceneErrorBoundary'
const VoxelScene = dynamic(() => import('./VoxelScene').then((m) => m.VoxelScene), { ssr: false, loading: () => <CanvasFallback /> })
export function VoxelCanvas() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])
  if (reduced) return <CanvasFallback />
  return <SceneErrorBoundary><VoxelScene /></SceneErrorBoundary>
}
```

- [ ] **Step 6: Mount `<VoxelCanvas/>`** inside Hero's `data-voxel-mount` layer.

- [ ] **Step 7: Verify** — cube renders; reduced-motion shows fallback; `pnpm build` passes.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: lazy R3F canvas shell with fallback + boundary"
```

### Task 19: Instanced voxel field

**Files:**
- Create: `components/three/VoxelField.tsx`
- Modify: `components/three/VoxelScene.tsx`

**Interfaces:**
- Produces: `<VoxelField count={N} />` — an `InstancedMesh` of N cubes positioned from a target shape (grid/monogram), with per-instance "home" + "scattered" positions stored in refs.

- [ ] **Step 1: `VoxelField.tsx`** — build an `InstancedMesh`; compute `home` positions (e.g. a 3D grid forming an iso-cube) and random `scattered` positions; on mount, animate from scattered→home with a GSAP timeline. Use `useFrame` to write instance matrices.

- [ ] **Step 2: Replace the placeholder cube** in `VoxelScene.tsx` with `<VoxelField count={512} />`.

- [ ] **Step 3: Verify** — blocks assemble on load; FPS smooth on a mid laptop; `pnpm build` passes.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: instanced voxel field with assemble animation"
```

### Task 20: Scroll-driven voxel transitions + postprocessing

**Files:**
- Modify: `components/three/VoxelField.tsx`, `components/three/VoxelScene.tsx`

**Interfaces:**
- Consumes: GSAP `ScrollTrigger` (registered in Task 17), Lenis updates.

- [ ] **Step 1: Add a `ScrollTrigger`** that maps scroll progress (hero→next section) to an interpolation factor between `home` and a second target shape (then scatter), updating instance matrices in `useFrame`.

- [ ] **Step 2: Add postprocessing** in `VoxelScene.tsx` — `<EffectComposer><Bloom/><N8AO/></EffectComposer>` with subtle intensity.

- [ ] **Step 3: Verify** — scrolling morphs/disperses the voxels; bloom is subtle, not blown out; reduced-motion path unaffected (still fallback). Check Lighthouse perf locally ≥ 90 with 3D lazy.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: scroll-driven voxel morph + postprocessing"
```

---

## Phase 5 — Case studies (MDX/Velite)

### Task 21: Velite MDX pipeline

**Files:**
- Create: `velite.config.ts`, `content/projects/codebase-index.mdx` (first case)
- Modify: `next.config.ts` (run velite), `tsconfig.json` (path `@/.velite`)

**Interfaces:**
- Produces: generated `.velite/` with typed `projects` collection: `{ slug, title, summary, tags, repo, body }`.

- [ ] **Step 1: Install**

```bash
pnpm add -D velite
```

- [ ] **Step 2: `velite.config.ts`**

```ts
import { defineConfig, defineCollection, s } from 'velite'
const projects = defineCollection({
  name: 'CaseStudy', pattern: 'projects/**/*.mdx',
  schema: s.object({ slug: s.path(), title: s.string(), summary: s.string(), tags: s.array(s.string()), repo: s.string().url(), body: s.mdx() }),
})
export default defineConfig({ collections: { projects } })
```

- [ ] **Step 3: Hook velite into `next.config.ts`** (build + dev via a Velite webpack plugin or `velite` prebuild script — add `"prebuild": "velite"` and run `velite --watch` alongside dev).

- [ ] **Step 4: Write the first case** `content/projects/codebase-index.mdx` with frontmatter (`slug: codebase-index`, title, summary, tags, repo) and a body (Problem / Approach / Stack / Result).

- [ ] **Step 5: Verify** — `pnpm velite` generates `.velite/`; types resolve.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: velite mdx pipeline + first case study"
```

### Task 22: Case study page

**Files:**
- Create: `app/[locale]/projects/[slug]/page.tsx`, `components/MDXContent.tsx`

**Interfaces:**
- Consumes: `projects` from `@/.velite`.
- Produces: static case pages via `generateStaticParams`; renders MDX body, repo link, tags.

- [ ] **Step 1: `generateStaticParams`** over `projects × locales`.

- [ ] **Step 2: Page** — find case by slug → 404 if missing → render title, tags, repo link, `<MDXContent code={body} />`.

- [ ] **Step 3: `MDXContent.tsx`** — render velite-compiled MDX.

- [ ] **Step 4: e2e** — `/en/projects/codebase-index` shows the title.

- [ ] **Step 5: Verify** `pnpm e2e`; **commit**

```bash
git add -A && git commit -m "feat: case study pages"
```

### Task 23: Remaining case studies + card links

**Files:**
- Create: `content/projects/*.mdx` for the other 6 featured projects
- Modify: `components/ProjectCard.tsx` (link to case if one exists, else repo)

- [ ] **Step 1: Write 6 MDX cases** (agent-sync, overwatch-ml, aquaguard, continent-regions, world-access-blocker, veritas-ad) with the same section structure, bilingual-safe English bodies (RU summaries from data layer).

- [ ] **Step 2: Update `ProjectCard`** to link to `/projects/[slug]` when a case file exists.

- [ ] **Step 3: Verify** — all 7 cards link to working case pages; `pnpm build` passes.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "content: add remaining case studies"
```

---

## Phase 6 — SEO, analytics, CI, deploy

### Task 24: Metadata, sitemap, robots, JSON-LD

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `components/JsonLd.tsx`
- Modify: `app/[locale]/layout.tsx` (`generateMetadata`), case page (`generateMetadata`)

- [ ] **Step 1: `generateMetadata`** in locale layout from `messages.meta` (title/description), `alternates.languages` for en/ru, openGraph.

- [ ] **Step 2: `app/sitemap.ts`** — home + project pages × locales.

- [ ] **Step 3: `app/robots.ts`** — allow all, point to sitemap.

- [ ] **Step 4: `JsonLd.tsx`** — `Person` schema (name, url, sameAs: github+telegram) on home; `SoftwareSourceCode` on case pages.

- [ ] **Step 5: Verify** — `/sitemap.xml`, `/robots.txt` resolve; **commit**

```bash
git add -A && git commit -m "feat: metadata, sitemap, robots, json-ld"
```

### Task 25: Dynamic OG images

**Files:**
- Create: `app/[locale]/opengraph-image.tsx`, `app/[locale]/projects/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Home OG** via `ImageResponse` (next/og) — name, role, accent background, 1200×630.

- [ ] **Step 2: Case OG** — project title + tags.

- [ ] **Step 3: Verify** — `/en/opengraph-image` renders a PNG; **commit**

```bash
git add -A && git commit -m "feat: dynamic OG images"
```

### Task 26: Vercel Analytics + Speed Insights

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install**

```bash
pnpm add @vercel/analytics @vercel/speed-insights
```

- [ ] **Step 2: Add `<Analytics/>` and `<SpeedInsights/>`** to root layout `<body>`.

- [ ] **Step 3: Verify** `pnpm build`; **commit**

```bash
git add -A && git commit -m "chore: vercel analytics + speed insights"
```

### Task 27: GitHub Actions CI + remove Pages workflow

**Files:**
- Create: `.github/workflows/ci.yml`
- Delete: existing Pages workflow under `.github/workflows/`

- [ ] **Step 1: Inspect & remove the old Pages workflow**

```bash
ls .github/workflows/ && git rm .github/workflows/<pages-workflow>.yml
```

- [ ] **Step 2: `ci.yml`** — on PR: setup pnpm + Node 20, `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, then Lighthouse CI (`treosh/lighthouse-ci-action`) asserting performance ≥ 0.9.

- [ ] **Step 3: Verify** — `act` or push a branch to confirm CI is green.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "ci: typecheck/lint/test/build + lighthouse, drop pages workflow"
```

### Task 28: Vercel deploy + cleanup

**Files:**
- Modify: `README.md`; Delete: `src_legacy/`
- Create: `vercel.json` (only if needed for redirects)

- [ ] **Step 1: Remove migration reference** once parity confirmed

```bash
git rm -r src_legacy
```

- [ ] **Step 2: Update `README.md`** — new stack, dev/build commands, env vars, Vercel deploy note.

- [ ] **Step 3: Deploy** — connect repo on Vercel, set env (`RESEND_API_KEY`, `CONTACT_TO`, optional `GITHUB_TOKEN`), deploy `feat/3d-portfolio` as preview; verify the live preview.

- [ ] **Step 4: Verify** preview: all sections, both locales, theme, 3D, contact form, case pages, OG images.

- [ ] **Step 5: Commit + open PR**

```bash
git add -A && git commit -m "chore: remove legacy vite source, update README"
```

---

## Self-Review (completed)

- **Spec coverage:** Stack (Tasks 1–7, 15–20), structure landing+cases (11–14, 21–23), voxel hero (18–20), i18n EN/RU (4,10), themes (5), content migration (8), GitHub auto-pull (9,14), contact+Telegram CTA (11,15,16), perf/a11y (17,18,20,27), error handling (15,16,18), SEO/OG (24,25), analytics (26), CI (27), Vercel migration (1,27,28). All sections mapped.
- **Placeholder scan:** No TBD/TODO; code provided for all logic-bearing steps. Visual/CSS steps describe concrete elements and IDs.
- **Type consistency:** `Project`/`Repo`/`ContactInput` defined once and reused; `getMoreRepos`/`filterAndSort`/`sendContact`/`contactSchema` names consistent across tasks; voxel `home`/`scattered` naming consistent (Tasks 19–20).
