# Task 28 Report — Complete EN/RU i18n coverage (case CTA + aria-labels); restrict CI token

Date: 2026-06-25

## Keys added

### `messages/en.json`
- `projects.viewOnGithub` → "View on GitHub"
- `a11y.switchLanguage` → "Switch language"
- `a11y.toggleTheme` → "Toggle theme"
- `a11y.moreRepositories` → "More repositories"

### `messages/ru.json`
- `projects.viewOnGithub` → "Открыть на GitHub"
- `a11y.switchLanguage` → "Сменить язык"
- `a11y.toggleTheme` → "Переключить тему"
- `a11y.moreRepositories` → "Другие репозитории"

## EN/RU key parity
Both files now contain identical namespaces and key sets:
- `meta`: title, description
- `nav`: projects, order, github
- `hero`: role, lead, cta, see
- `about`: label, text
- `stack`: label, text
- `projects`: selected, more, allRepos, back, **viewOnGithub** (new)
- `a11y`: **switchLanguage, toggleTheme, moreRepositories** (new namespace)
- `contact`: title, order, or, name, contact, message, send, sent, error

## Components updated

- `app/[locale]/projects/[slug]/page.tsx` — replaced hardcoded `View on GitHub →` with `{t('viewOnGithub')} →` (uses existing `getTranslations('projects')` as `t`)
- `components/ui/LocaleSwitch.tsx` — added `useTranslations` import from `next-intl`, added `const t = useTranslations('a11y')`, changed `aria-label="Switch language"` to `aria-label={t('switchLanguage')}`
- `components/ui/ThemeToggle.tsx` — added `useTranslations` import from `next-intl`, added `const t = useTranslations('a11y')`, changed both `aria-label="Toggle theme"` occurrences to `aria-label={t('toggleTheme')}`. Import order corrected to satisfy Biome (`next-intl` before `next-themes`).
- `components/sections/MoreOnGitHub.tsx` — added `const a = await getTranslations('a11y')`, changed `aria-label="More repositories"` to `aria-label={a('moreRepositories')}`

## CI token permissions

`.github/workflows/ci.yml` — added top-level `permissions: contents: read` block after the `on:` block.

## Verification outputs

All steps ran in `C:\Projects\portfolio\.claude\worktrees\agent-ad4077e7a3f4e9907`.

### 1. `pnpm format`
```
Formatted 66 files in 155ms. Fixed 65 files.
```
Exit 0. Biome also auto-wrapped the `ThemeToggle` early-return JSX line.

### 2. `pnpm lint`
```
Checked 72 files in 53ms. No fixes applied.
```
Exit 0. (Initial run failed on import order in `ThemeToggle.tsx`; fixed by reordering `next-intl` before `next-themes`, then re-ran lint successfully.)

### 3. `pnpm typecheck`
```
velite build — 7 warnings (pre-existing s.path() slug warnings)
tsc --noEmit — no errors
```
Exit 0.

### 4. `pnpm build`
```
✓ Compiled successfully in 6.3s
✓ Generating static pages using 10 workers (21/21) in 3.7s
```
Exit 0.

### 5. `pnpm test`
```
Test Files  3 passed (3)
     Tests  4 passed (4)
  Duration  433ms
```
Exit 0.

### 6. `pnpm e2e`
```
4 passed (28.7s)
  - home page renders the name
  - locale switch navigates to ru
  - case study page renders the title
  - contact section: empty submit stays on page and does not navigate
```
Exit 0.
