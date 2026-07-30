# Client Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `denfry.github.io` from a personal "Java developer / Minecraft" page into a client-facing portfolio — real client case studies in Work, repositioned copy, and a distinctive three.js wireframe-terrain visual identity.

**Architecture:** Same Vite + React 18 + TypeScript SPA, no new pages/routes. Content (`content.ts`) and copy (`i18n.ts`) change to lead with client work. A new fixed-position `<Scene>` (react-three-fiber) renders behind all content, driven by a scroll-progress hook and `prefers-reduced-motion`. Fonts move from system stacks to self-hosted `@fontsource` packages; color tokens move from cream+terracotta to paper+indigo.

**Tech Stack:** Vite 5, React 18, TypeScript 5, framer-motion (existing), three, @react-three/fiber, @react-three/drei, @fontsource-variable/fraunces, @fontsource-variable/inter-tight, @fontsource-variable/jetbrains-mono.

**Note on testing:** This project has no test runner (`package.json` only has `typecheck`/`build`/`preview` scripts) — do not add one for this feature. "Test" steps in this plan mean: `npm run typecheck`, `npm run build`, and scripted manual verification in the browser with exact things to check. Do not invent a Jest/Vitest suite that doesn't exist in the project.

## Global Constraints

- No external font/CDN requests — all fonts self-hosted via npm packages, bundled by Vite.
- Private client repos (`uk-altegra-landing`, `crystal-tower`, `PoliternalSite`) never get a `codeUrl` — only `liveUrl` (or nothing).
- `prefers-reduced-motion: reduce` must fully freeze the 3D scene: no rotation, no scroll-driven camera movement, no pointer parallax.
- WebGL context-creation failure must render a static fallback, never a crash or blank canvas.
- Mobile/low-end: capped device pixel ratio, reduced geometry, frame loop paused when tab is hidden.
- `npm run typecheck` and `npm run build` must pass after every task.
- Existing i18n shape (`Record<Lang, Strings>` with `en`/`ru`) and existing `Reveal`/`useReducedMotion` motion conventions must be followed, not replaced.

---

### Task 1: Install three.js and font dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `three`, `@react-three/fiber`, `@react-three/drei` importable in later tasks; `@fontsource-variable/fraunces`, `@fontsource-variable/inter-tight`, `@fontsource-variable/jetbrains-mono` importable as CSS in Task 2.

- [ ] **Step 1: Add dependencies to `package.json`**

Edit the `dependencies` block:

```json
  "dependencies": {
    "@fontsource-variable/fraunces": "^5.1.0",
    "@fontsource-variable/inter-tight": "^5.1.0",
    "@fontsource-variable/jetbrains-mono": "^5.1.0",
    "@react-three/drei": "^9.114.0",
    "@react-three/fiber": "^8.17.10",
    "framer-motion": "^11.11.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.169.0"
  },
```

- [ ] **Step 2: Add `@types/three` to devDependencies**

```json
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.169.0",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  }
```

- [ ] **Step 3: Install**

Run: `npm install`
Expected: lockfile updates, no errors.

- [ ] **Step 4: Verify baseline still builds**

Run: `npm run typecheck && npm run build`
Expected: both pass (no source changes yet, this just confirms the new deps didn't break resolution).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three.js and self-hosted font dependencies"
```

---

### Task 2: Design tokens — colors, self-hosted fonts, meta

**Files:**
- Modify: `src/index.css`
- Modify: `src/main.tsx`
- Modify: `index.html`

**Interfaces:**
- Produces: CSS custom properties `--bg`, `--text`, `--muted`, `--accent`, `--glow`, `--hair`, `--display`, `--sans`, `--mono` used by every later component task.

- [ ] **Step 1: Import font CSS in `src/main.tsx`**

Read current `src/main.tsx` first to preserve its existing imports, then add these three lines before the existing CSS import:

```ts
import '@fontsource-variable/fraunces'
import '@fontsource-variable/fraunces/wght-cyrillic.css'
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/inter-tight/wght-cyrillic.css'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/jetbrains-mono/wght-cyrillic.css'
```

If `wght-cyrillic.css` doesn't exist for a package (check `node_modules/@fontsource-variable/<name>/` after `npm install` — list the directory and use whatever cyrillic-subset file is actually shipped, e.g. it may be named differently per package), use the actual filename found there instead. Don't skip the cyrillic subset — the RU copy needs it.

- [ ] **Step 2: Replace color and font tokens in `src/index.css`**

Replace lines 1–18 (the `:root` and `[data-theme="dark"]` blocks) with:

```css
:root {
  --bg: #F7F6F2;
  --text: #16161D;
  --muted: #6E6B76;
  --accent: #3D2FA6;
  --glow: #8C86FF;
  --hair: #DEDAD0;
  --maxw: 1200px;
  --gutter: clamp(120px, 16vw, 200px);
  --display: "Fraunces Variable", ui-serif, Georgia, serif;
  --sans: "Inter Tight Variable", "Helvetica Neue", Arial, sans-serif;
  --mono: "JetBrains Mono Variable", ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace;
}
[data-theme="dark"] {
  --bg: #121014;
  --text: #EDEAF5;
  --muted: #948FA0;
  --accent: #8C7CFF;
  --glow: #8C86FF;
  --hair: #2A2733;
}
```

Check the actual font-family name each `@fontsource-variable` package registers (open
`node_modules/@fontsource-variable/fraunces/index.css` and read the `font-family` value in
its first `@font-face` block) and use that exact string in `--display`/`--sans`/`--mono` —
adjust the values above if they differ from `"Fraunces Variable"` / `"Inter Tight Variable"`
/ `"JetBrains Mono Variable"`.

- [ ] **Step 3: Update `index.html` meta/theme-color to match new tokens**

Replace lines 11–12:

```html
  <meta name="theme-color" content="#F7F6F2" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#121014" media="(prefers-color-scheme: dark)" />
```

(Title/description copy is updated in Task 4 alongside the i18n strings it mirrors — don't change it here.)

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run build`
Expected: both pass.

Run: `npm run dev`, open the site, open devtools and confirm (via `getComputedStyle(document.body).fontFamily`) that the body font resolves to the Inter Tight variable family, not the Arial fallback.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/main.tsx index.html
git commit -m "feat: switch to indigo/paper palette and self-hosted variable fonts"
```

---

### Task 3: Work content model and case data

**Files:**
- Modify: `src/content.ts`

**Interfaces:**
- Produces: `export type Project = { name, role: 'client' | 'personal', image?, liveUrl?, codeUrl?, tags, desc }`, `export const PROJECTS: Project[]`. Consumed by `WorkItem` (Task 6) and `Work` (Task 8).

- [ ] **Step 1: Replace `src/content.ts` in full**

```ts
export type ProjectRole = 'client' | 'personal'

export type Project = {
  name: string
  role: ProjectRole
  image?: string
  liveUrl?: string
  codeUrl?: string
  tags: string[]
  desc: { en: string; ru: string }
}

export const PROJECTS: Project[] = [
  {
    name: 'uk-altegra-landing',
    role: 'client',
    image: '/work/uk-altegra-landing.png',
    liveUrl: 'https://uk-altegra.vercel.app',
    tags: ['Client', 'Landing'],
    desc: {
      en: 'Landing page for a residential property management company — service overview, request forms, and a trust-building layout built to the client\'s brand.',
      ru: 'Лендинг управляющей компании — обзор услуг, формы заявок и вёрстка на доверие, под бренд заказчика.',
    },
  },
  {
    name: 'crystal-tower',
    role: 'client',
    image: '/work/crystal-tower.png',
    liveUrl: 'https://crystal-tower-ten.vercel.app',
    tags: ['Client', 'Landing'],
    desc: {
      en: 'Short-term rental landing for two Moscow-City apartments — live availability calculator, photo carousels, and a custom hotel-grade design built to the client\'s reference.',
      ru: 'Лендинг посуточной аренды двух апартаментов в Москва-Сити — калькулятор дат, карусели фото, кастомный «отельный» дизайн под референс заказчика.',
    },
  },
  {
    name: 'PoliternalSite',
    role: 'client',
    image: '/work/politernal-site.png',
    liveUrl: 'https://politernal-site.vercel.app',
    tags: ['Client', 'Next.js', 'Prisma'],
    desc: {
      en: 'Production web platform for a Minecraft server business: item/rank shop, player guide, and an admin panel for orders — Next.js, Prisma, Supabase, full EN/RU i18n.',
      ru: 'Продакшн веб-платформа для Minecraft-сервера: магазин рангов и предметов, гайд для игроков, админ-панель заказов — Next.js, Prisma, Supabase, полная EN/RU локализация.',
    },
  },
  {
    name: 'lk-fd-demo',
    role: 'client',
    image: '/work/lk-fd-demo.png',
    codeUrl: 'https://github.com/denfry/lk-fd-demo',
    tags: ['Next.js', 'Prisma', 'PostgreSQL'],
    desc: {
      en: 'Full-stack demo of a client cabinet for an out-of-home ad seller — interactive map, month-by-month availability calendar, work lists with Excel export, and an admin panel with feed import.',
      ru: 'Full-stack демо личного кабинета продавца наружной рекламы — интерактивная карта, календарь занятости по месяцам, рабочие списки с выгрузкой в Excel и админка с импортом фида.',
    },
  },
  {
    name: 'archivesecrets',
    role: 'client',
    tags: ['Next.js', 'WebSocket', 'Prisma'],
    desc: {
      en: 'Puzzle-hunt web app where secrets are physically embedded in real site pages — dashboard, profile, leaderboard, even robots.txt — with a WebSocket server tracking live progress.',
      ru: 'Пазл-хантинг веб-приложение: секреты физически встроены в реальные страницы сайта — дашборд, профиль, лидерборд, даже robots.txt — с WebSocket-сервером для live-прогресса.',
    },
  },
  {
    name: 'codebase-index',
    role: 'personal',
    codeUrl: 'https://github.com/denfry/codebase-index',
    tags: ['Python', '★ 4'],
    desc: {
      en: 'Local-first codebase indexing for AI coding agents — hybrid FTS5 + Tree-sitter + graph search, fully offline.',
      ru: 'Локальная индексация кода для AI-агентов — гибрид FTS5 + Tree-sitter + графовый поиск, полностью офлайн.',
    },
  },
  {
    name: 'agent-sync',
    role: 'personal',
    codeUrl: 'https://github.com/denfry/agent-sync',
    tags: ['Python', 'CLI'],
    desc: {
      en: 'Coordinate multiple AI coding-agent sessions in one repo: shared tasks, file locks, and live messaging over a local SQLite layer.',
      ru: 'Координация нескольких сессий AI-агентов в одном репозитории: общие задачи, блокировки файлов и обмен сообщениями поверх локального SQLite.',
    },
  },
  {
    name: 'OverWatch-ML',
    role: 'personal',
    codeUrl: 'https://github.com/denfry/OverWatch-ML',
    tags: ['Java', 'ML'],
    desc: {
      en: 'Cheat-detection system for modern Minecraft servers, using behavior analysis and machine learning.',
      ru: 'Система детекта читов для современных Minecraft-серверов на основе анализа поведения и машинного обучения.',
    },
  },
]

export const CONTACTS = {
  telegram: 'https://t.me/kfcbossalbino',
  github: 'https://github.com/denfry',
  allRepos: 'https://github.com/denfry?tab=repositories',
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: FAILS at this point — `Work.tsx`/`WorkItem.tsx` still reference the old `project.url` field. That's expected; Tasks 6–8 fix the consumers. Confirm the error is specifically about `url` not existing on `Project`, not a syntax error in `content.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/content.ts
git commit -m "feat: replace Work content with client case studies"
```

---

### Task 4: i18n copy — new positioning and Work labels

**Files:**
- Modify: `src/i18n.ts`
- Modify: `index.html`

**Interfaces:**
- Produces: `Strings` gains `workClientLabel`, `workPersonalLabel`, `viewSite`, `viewCode`. Consumed by `WorkItem`/`Work` (Tasks 6, 8).

- [ ] **Step 1: Replace `src/i18n.ts` in full**

```ts
import type { Lang } from './context/PrefsContext'

export type Strings = {
  role: string
  introLead: string
  selectedWork: string
  workClientLabel: string
  workPersonalLabel: string
  viewSite: string
  viewCode: string
  focusLabel: string
  focusText: string
  backgroundLabel: string
  backgroundText: string
  allRepos: string
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    role: 'Web developer',
    introLead:
      'I build distinctive websites and web apps for clients — from custom landing pages to full-stack platforms — plus server-side Minecraft systems and open-source tooling for AI coding agents.',
    selectedWork: 'Selected work',
    workClientLabel: 'Client work',
    workPersonalLabel: 'Labs',
    viewSite: 'View site →',
    viewCode: 'Code on GitHub →',
    focusLabel: 'Focus',
    focusText:
      'Next.js, React, TypeScript · full-stack apps (Prisma, PostgreSQL) · custom landing pages and client platforms · Minecraft (Paper, Spigot, Forge) backend systems · Python tooling and ML for anti-cheat and behavior analysis.',
    backgroundLabel: 'Background',
    backgroundText:
      'Networking and information systems, database design, and backend architecture. I ship client sites into real production and run my own Minecraft server, so most projects are tested under real usage, not just prototypes.',
    allRepos: 'All repositories →',
  },
  ru: {
    role: 'Веб-разработчик',
    introLead:
      'Делаю нестандартные сайты и веб-приложения для заказчиков — от лендингов до full-stack платформ — а также серверные системы для Minecraft и open-source инструменты для AI-агентов.',
    selectedWork: 'Избранные проекты',
    workClientLabel: 'Клиентские проекты',
    workPersonalLabel: 'Личные проекты',
    viewSite: 'Смотреть сайт →',
    viewCode: 'Код на GitHub →',
    focusLabel: 'Направления',
    focusText:
      'Next.js, React, TypeScript · full-stack приложения (Prisma, PostgreSQL) · лендинги и платформы под заказчика · Minecraft (Paper, Spigot, Forge) бэкенд-системы · инструменты на Python и ML для античита и анализа поведения.',
    backgroundLabel: 'О себе',
    backgroundText:
      'Сетевые технологии и информационные системы, проектирование баз данных и серверная архитектура. Клиентские сайты уезжают в реальный продакшн, плюс держу собственный Minecraft-сервер — большинство проектов проверены в реальной эксплуатации, а не только в прототипах.',
    allRepos: 'Все репозитории →',
  },
}
```

- [ ] **Step 2: Update `index.html` title/description/OG copy to match**

Replace lines 6–7, 15–16, 21–22:

```html
  <title>Denfry — Web developer</title>
  <meta name="description" content="Denfry — web developer building distinctive client sites and apps, plus server-side Minecraft systems and open-source AI-agent tooling." />
```

```html
  <meta property="og:title" content="Denfry — Web developer" />
  <meta property="og:description" content="Distinctive client sites and apps, server-side Minecraft systems, open-source AI-agent tooling." />
```

```html
  <meta name="twitter:title" content="Denfry — Web developer" />
  <meta name="twitter:description" content="Distinctive client sites and apps, server-side Minecraft systems, open-source AI-agent tooling." />
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck`
Expected: still fails the same way as Task 3 (WorkItem/Work not yet updated) — confirm no *new* errors were introduced by `i18n.ts`/`index.html`.

- [ ] **Step 4: Commit**

```bash
git add src/i18n.ts index.html
git commit -m "feat: reposition copy toward client web work"
```

---

### Task 5: Screenshot assets for client cases

**Files:**
- Create: `public/work/uk-altegra-landing.png`
- Create: `public/work/crystal-tower.png`
- Create: `public/work/politernal-site.png`
- Create: `public/work/lk-fd-demo.png`

**Interfaces:**
- Produces: static image files at the exact paths referenced by `Project.image` in `src/content.ts` (Task 3).

- [ ] **Step 1: Capture the three live deploys**

For each of `https://uk-altegra.vercel.app`, `https://crystal-tower-ten.vercel.app`,
`https://politernal-site.vercel.app`: navigate to the URL in a browser at a 1600×900
viewport, wait for the page to finish loading (fonts/images settled), and capture a
screenshot of the initial viewport (hero — not a full-page scroll capture, the Work
card is a fixed 16:9 slot). Save each as a PNG at:

- `public/work/uk-altegra-landing.png`
- `public/work/crystal-tower.png`
- `public/work/politernal-site.png`

- [ ] **Step 2: Fetch the lk-fd-demo screenshot from its repo**

```bash
gh api repos/denfry/lk-fd-demo/contents/docs/screenshots/workspace-map.png --jq '.content' | base64 -d > public/work/lk-fd-demo.png
```

- [ ] **Step 3: Verify all four files exist and are non-empty**

```bash
ls -la public/work/
```

Expected: 4 files, each with a nonzero byte size.

- [ ] **Step 4: Commit**

```bash
git add public/work/
git commit -m "feat: add client case screenshots"
```

---

### Task 6: WorkItem card component

**Files:**
- Modify: `src/components/Work/WorkItem.tsx`

**Interfaces:**
- Consumes: `Project` type from Task 3 (`role`, `image?`, `liveUrl?`, `codeUrl?`), `Strings.viewSite`/`viewCode` from Task 4.
- Produces: `WorkItem({ project, index, lang, delay })` renders an optional screenshot, name, description, tags, and at most one action link — used by `Work` (Task 8).

- [ ] **Step 1: Replace `src/components/Work/WorkItem.tsx` in full**

```tsx
import { motion, useReducedMotion } from 'framer-motion'
import { type Project } from '../../content'
import { type Lang } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import styles from './Work.module.css'

export function WorkItem({
  project,
  index,
  lang,
  delay = 0,
}: {
  project: Project
  index: number
  lang: Lang
  delay?: number
}) {
  const reduce = useReducedMotion()
  const t = STRINGS[lang]
  const num = String(index).padStart(2, '0')
  const link = project.liveUrl
    ? { href: project.liveUrl, label: t.viewSite }
    : project.codeUrl
      ? { href: project.codeUrl, label: t.viewCode }
      : null

  return (
    <motion.li
      className={styles.item}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
    >
      <span className={styles.num}>{num}</span>
      <div>
        {project.image && (
          <img
            className={styles.image}
            src={project.image}
            alt=""
            loading="lazy"
            width={1600}
            height={900}
          />
        )}
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.desc}>{project.desc[lang]}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {link && (
          <a className={styles.link} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        )}
      </div>
    </motion.li>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: still fails — `Work.tsx` (Task 8) hasn't been updated to group by `role` yet, so this is the last expected-fail checkpoint. Confirm the only remaining error is in `Work.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Work/WorkItem.tsx
git commit -m "feat: rework WorkItem into a screenshot card with a single action link"
```

---

### Task 7: Work.module.css — card and group-label styles

**Files:**
- Modify: `src/components/Work/Work.module.css`

**Interfaces:**
- Produces: `.image`, `.link`, `.groupLabel` classes consumed by `WorkItem` (Task 6) and `Work` (Task 8). Keeps existing `.item`, `.num`, `.name`, `.desc`, `.tags` selectors working for the new markup shape (`<h3>` instead of `<a>` for `.name`).

- [ ] **Step 1: Replace `src/components/Work/Work.module.css` in full**

```css
.groupLabel {
  font-family: var(--mono);
  font-weight: 400;
  font-size: .72rem;
  text-transform: uppercase;
  letter-spacing: .18em;
  color: var(--muted);
  margin: 0 0 .5rem;
}
.groupLabel:not(:first-child) { margin-top: 2rem; }

.item {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 0 1.25rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--hair);
}
.item:first-child { border-top: 0; padding-top: 0; }
.num { font-family: var(--mono); font-size: .85rem; color: var(--muted); padding-top: .35rem; }

.image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border: 1px solid var(--hair);
  margin-bottom: .75rem;
  background: var(--hair);
}

.name {
  display: block;
  margin: 0;
  font-family: var(--display);
  font-size: clamp(1.25rem, 3vw, 1.6rem);
  font-weight: 600;
}
.desc { margin: .4rem 0 .6rem; max-width: 62ch; }
.tags { display: flex; gap: .5rem; flex-wrap: wrap; }
.tags span {
  font-family: var(--mono);
  font-size: .72rem;
  letter-spacing: .04em;
  color: var(--muted);
  border: 1px solid var(--hair);
  padding: .15rem .5rem;
}
.link {
  display: inline-block;
  margin-top: .6rem;
  font-family: var(--mono);
  font-size: .8rem;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color .15s ease;
}
.link:hover { border-bottom-color: var(--accent); }

@media (max-width: 520px) {
  .item { grid-template-columns: 2rem minmax(0, 1fr); gap: 0 .75rem; }
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: same single remaining failure as Task 6 (in `Work.tsx`) — CSS modules don't affect typecheck otherwise.

- [ ] **Step 3: Commit**

```bash
git add src/components/Work/Work.module.css
git commit -m "feat: style Work cards with screenshots and group labels"
```

---

### Task 8: Work.tsx — group cases by client/personal

**Files:**
- Modify: `src/components/Work/Work.tsx`

**Interfaces:**
- Consumes: `PROJECTS` (Task 3), `STRINGS.workClientLabel`/`workPersonalLabel` (Task 4), `styles.groupLabel` (Task 7).
- Produces: renders two labelled `<ol>` groups instead of one flat list.

- [ ] **Step 1: Replace `src/components/Work/Work.tsx` in full**

```tsx
import { usePrefs } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import { PROJECTS } from '../../content'
import { WorkItem } from './WorkItem'
import styles from './Work.module.css'

export function Work() {
  const { lang } = usePrefs()
  const t = STRINGS[lang]
  const clientProjects = PROJECTS.filter((p) => p.role === 'client')
  const personalProjects = PROJECTS.filter((p) => p.role === 'personal')

  return (
    <section className="section">
      <h2 className="gutterLabel">{t.selectedWork}</h2>
      <div>
        <h3 className={styles.groupLabel}>{t.workClientLabel}</h3>
        <ol>
          {clientProjects.map((project, i) => (
            <WorkItem key={project.name} project={project} index={i + 1} lang={lang} delay={i * 0.06} />
          ))}
        </ol>
        <h3 className={styles.groupLabel}>{t.workPersonalLabel}</h3>
        <ol>
          {personalProjects.map((project, i) => (
            <WorkItem key={project.name} project={project} index={i + 1} lang={lang} delay={i * 0.06} />
          ))}
        </ol>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run build`
Expected: both pass — this clears the expected-fail chain from Tasks 3, 4, 6, 7.

Run: `npm run dev`, open the site in both `en` and `ru` (language toggle), and confirm:
- "Client work" / "Клиентские проекты" group shows 5 cards (4 with screenshots, `archivesecrets` without).
- "Labs" / "Личные проекты" group shows 3 cards, none with screenshots.
- Each card with a `liveUrl` shows a "View site →" / "Смотреть сайт →" link; `lk-fd-demo` shows "Code on GitHub →" / "Код на GitHub →"; `archivesecrets` shows no link.

- [ ] **Step 3: Commit**

```bash
git add src/components/Work/Work.tsx
git commit -m "feat: split Work section into client and personal groups"
```

---

### Task 9: Scroll-progress hook

**Files:**
- Create: `src/hooks/useScrollProgress.ts`

**Interfaces:**
- Produces: `useScrollProgress(): number` — a 0–1 value, `document.scrollTop / (scrollHeight - clientHeight)`. Consumed by `Scene` (Task 11).

- [ ] **Step 1: Write `src/hooks/useScrollProgress.ts`**

```ts
import { useEffect, useState } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: passes (unused-export is fine, nothing imports it yet).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useScrollProgress.ts
git commit -m "feat: add scroll-progress hook"
```

---

### Task 10: WebGL support detection utility

**Files:**
- Create: `src/components/Scene/supportsWebGL.ts`

**Interfaces:**
- Produces: `supportsWebGL(): boolean`. Consumed by `Scene` (Task 11).

- [ ] **Step 1: Write `src/components/Scene/supportsWebGL.ts`**

```ts
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/Scene/supportsWebGL.ts
git commit -m "feat: add WebGL support detection"
```

---

### Task 11: Three.js wireframe terrain Scene

**Files:**
- Create: `src/components/Scene/TerrainMesh.tsx`
- Create: `src/components/Scene/Scene.tsx`
- Create: `src/components/Scene/Scene.module.css`

**Interfaces:**
- Consumes: `useScrollProgress` (Task 9), `supportsWebGL` (Task 10), `useReducedMotion` from `framer-motion` (existing dependency).
- Produces: `Scene()` — a component with no props, renders a `position: fixed`, `z-index: -1`, `pointer-events: none` layer. Consumed by `App.tsx` (Task 12).

- [ ] **Step 1: Write `src/components/Scene/TerrainMesh.tsx`**

```tsx
import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function TerrainMesh({
  reduced,
  scrollProgress,
}: {
  reduced: boolean
  scrollProgress: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(24, 24, 48, 48)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z =
        (Math.sin(x * 0.35) + Math.cos(y * 0.4)) * 0.9 +
        Math.sin(x * 0.9 + y * 0.6) * 0.3
      pos.setZ(i, z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    // prefers-reduced-motion: freeze entirely — no dolly, no opacity easing,
    // no rotation, no parallax. The scene renders one static frame and stops.
    if (reduced) return

    // Camera dolly across scroll progress: close over hero (0), pulled back
    // and dimmer through Work (~0.4), near-static toward the footer (1).
    const targetZ = 6 + scrollProgress * 5
    camera.position.z += (targetZ - camera.position.z) * 0.08
    camera.lookAt(0, 0, 0)

    const material = meshRef.current.material as THREE.MeshBasicMaterial
    const targetOpacity = 0.35 - scrollProgress * 0.2
    material.opacity += (targetOpacity - material.opacity) * 0.08

    meshRef.current.rotation.z += delta * 0.03
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15

    // Pointer parallax
    const px = state.pointer.x * 0.3
    const py = state.pointer.y * 0.15
    meshRef.current.rotation.x += (-Math.PI / 2.6 + py - meshRef.current.rotation.x) * 0.04
    meshRef.current.rotation.y += (px - meshRef.current.rotation.y) * 0.04
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -1.5, 0]}>
      <meshBasicMaterial color="#8C86FF" wireframe transparent opacity={0.35} />
    </mesh>
  )
}
```

- [ ] **Step 2: Write `src/components/Scene/Scene.module.css`**

```css
.stage {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.stage canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
.fallback {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--glow) 14%, transparent), transparent 60%);
}
```

- [ ] **Step 3: Write `src/components/Scene/Scene.tsx`**

```tsx
import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import { TerrainMesh } from './TerrainMesh'
import { supportsWebGL } from './supportsWebGL'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import styles from './Scene.module.css'

export function Scene() {
  const reduced = useReducedMotion()
  const scrollProgress = useScrollProgress()
  const [webglOk, setWebglOk] = useState(true)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setWebglOk(supportsWebGL())
    function onVisibility() {
      setHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (!webglOk) {
    return <div className={styles.fallback} aria-hidden="true" />
  }

  return (
    <div className={styles.stage} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2.4, 6], fov: 45 }}
        frameloop={hidden ? 'never' : 'always'}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <TerrainMesh reduced={!!reduced} scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run build`
Expected: both pass.

Run: `npm run dev`, open the site. Confirm:
- A faint indigo wireframe grid is visible behind the page content.
- Scrolling from top to bottom pulls the camera back and dims the wireframe.
- Moving the pointer subtly tilts the mesh (in a browser/OS with no reduced-motion preference set).
- With OS-level "reduce motion" enabled (or `prefers-reduced-motion: reduce` emulated in devtools), reload and confirm the scene is fully frozen: no rotation, no pointer response, and no camera dolly/opacity change while scrolling — the wireframe stays a single static frame.

- [ ] **Step 5: Commit**

```bash
git add src/components/Scene/
git commit -m "feat: add scroll-reactive wireframe terrain scene"
```

---

### Task 12: Wire Scene into App and add translucent section panels

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `Scene` (Task 11).
- Produces: `Scene` rendered as the first child of the page shell; `.section` gets a translucent backdrop so text stays legible over the fixed canvas.

- [ ] **Step 1: Update `src/App.tsx`**

```tsx
import { Header } from './components/Header/Header'
import { Intro } from './components/Intro/Intro'
import { Work } from './components/Work/Work'
import { LabeledSection } from './components/LabeledSection/LabeledSection'
import { Footer } from './components/Footer/Footer'
import { Scene } from './components/Scene/Scene'
import { usePrefs } from './context/PrefsContext'
import { STRINGS } from './i18n'

export default function App() {
  const { lang } = usePrefs()
  const t = STRINGS[lang]
  return (
    <>
      <Scene />
      <div className="shell">
        <Header />
        <Intro />
        <Work />
        <LabeledSection label={t.focusLabel} text={t.focusText} />
        <LabeledSection label={t.backgroundLabel} text={t.backgroundText} />
        <Footer />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Give `.section` a translucent backdrop in `src/index.css`**

Add after the existing `.section` rule:

```css
.section {
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run build`
Expected: both pass.

Run: `npm run dev`. Confirm the wireframe scene is visible in the gaps between sections/at the top of the page, and section content (text, cards) stays fully readable with the blurred paper panel behind it in both light and dark themes.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "feat: mount wireframe scene behind translucent content panels"
```

---

### Task 13: Final QA pass

**Files:** none (verification only)

- [ ] **Step 1: Full build check**

Run: `npm run typecheck && npm run build`
Expected: both pass with zero errors/warnings.

- [ ] **Step 2: Manual cross-condition check**

Run `npm run dev` and, in the browser, verify each of the following (check every box mentally, don't skip any):
- Light theme + `en`: hero copy reads "Web developer" / distinctive-sites intro; Work section shows Client work then Labs groups.
- Light theme + `ru`: same structure, Russian copy, no untranslated strings, no layout breakage from longer RU text.
- Dark theme (`data-theme="dark"`) in both languages: indigo accent (`#8C7CFF`) and paper/ink tokens read correctly, wireframe glow still visible against dark bg.
- Mobile viewport (375×812 in devtools): Work cards stack single-column, screenshots keep 16:9 aspect ratio, no horizontal scroll.
- `prefers-reduced-motion: reduce` emulated in devtools: scene rotation/parallax off, framer-motion reveal animations on Work items also disabled (existing behavior, confirm it still works after the App.tsx restructuring in Task 12).
- Throttle CPU 4x–6x in devtools performance panel, scroll the full page: confirm no dropped-frame stutter severe enough to make scrolling feel broken (some frame variance is expected on throttled CPU, this is a sanity check not a benchmark).
- All 8 Work cards render with the correct link state: 4 with "View site →", 1 (`lk-fd-demo`) with "Code on GitHub →", 1 (`archivesecrets`) with no link and no image slot, 3 personal projects with "Code on GitHub →" and no image.

- [ ] **Step 3: Fix any issues found, re-run Step 1 and the relevant part of Step 2**

If a check fails, fix it in the relevant component/file from the task that owns it, re-verify, then continue.

- [ ] **Step 4: Final commit (only if fixes were needed in Step 3)**

```bash
git add -A
git commit -m "fix: address QA pass findings"
```
