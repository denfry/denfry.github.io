# Дизайн: 3D-портфолио Denfry

**Дата:** 2026-06-25
**Статус:** утверждён пользователем (брейншторм), готов к написанию плана
**Репозиторий:** `denfry/denfry.github.io` → переезд на Vercel

---

## 1. Контекст и цель

Denfry — Java-разработчик: серверные системы для Minecraft (Paper, Spigot, Forge),
Java-бэкенд (Spring, PostgreSQL/MySQL), Python-тулинг и ML, open-source инструменты
для AI-кодинг-агентов. Держит собственный Minecraft-сервер — большинство проектов
проверены в реальной эксплуатации.

Текущий сайт: Vite + React + TypeScript, статический GitHub Pages, с переключением
темы (тёмная/светлая) и языка (EN/RU). Минималистичный, без 3D.

**Цель:** превратить портфолио в эффектный 3D-сайт с воксельным героем (отсылка к
Minecraft), который одновременно работает как точка входа для заказов проектов через
Telegram-группу `@denfry_dev`.

## 2. Цели и не-цели

**Цели:**
- Воксельный 3D-герой с управляемой скроллом сборкой/разборкой блоков.
- Структура «лендинг + страницы-кейсы» для глубокой подачи топ-проектов.
- Сохранить и улучшить i18n (EN/RU) и тему (тёмная/светлая).
- Перенести существующий контент (`content.ts`, `i18n.ts`) без потерь.
- Автоподтягивание остальных репозиториев из GitHub API на этапе сборки.
- CTA «Заказать проект» → Telegram-группа `@denfry_dev`.
- Lighthouse ≥ 90 на мобайле, доступность (reduced-motion, клавиатура).

**Не-цели:**
- Полноценная CMS/админка (контент — в коде/MDX).
- Блог (можно добавить позже).
- Авторизация, личный кабинет, платежи.

## 3. Стек (финальный)

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 15 (App Router, React 19, Server Components, PPR) |
| Язык | TypeScript (strict) |
| 3D | three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing |
| Анимация | GSAP + ScrollTrigger, Lenis (smooth scroll), Motion (бывш. Framer Motion) |
| Стили | Tailwind CSS v4 + shadcn/ui (Radix) |
| Контент | MDX + Velite (типизированные кейсы) |
| i18n | next-intl (EN/RU) |
| Темы | next-themes (dark/light) |
| Формы | React Hook Form + Zod + Server Actions |
| Почта | Resend (доставка письма с формы контакта) |
| OG/SEO | next/og (динамические OG-картинки), Metadata API, JSON-LD |
| Аналитика | Vercel Analytics + Speed Insights |
| Качество | Biome (lint+format), TypeScript, Playwright (smoke) |
| CI | GitHub Actions: typecheck + lint + Lighthouse CI |
| Хостинг | Vercel (auto-deploy из GitHub) |

## 4. Архитектура проекта (Next App Router)

```
app/
  [locale]/
    layout.tsx          # провайдеры: тема, i18n, Lenis, аналитика
    page.tsx            # лендинг (секции 1–6)
    projects/
      [slug]/page.tsx   # страница-кейс из MDX
    not-found.tsx
  api/ (если нужно)
  globals.css
components/
  three/                # VoxelScene, VoxelField, useScrollVoxels, постобработка
  sections/             # Hero, About, Stack, FeaturedProjects, OpenSource, Contact
  ui/                   # shadcn-компоненты
  ContactForm.tsx
content/
  projects/*.mdx        # кейсы (frontmatter + тело)
lib/
  github.ts             # фетч репозиториев из GitHub API (build-time)
  resend.ts
messages/
  en.json, ru.json      # каталоги переводов
```

**Принцип изоляции:** 3D-логика инкапсулирована в `components/three/` за чётким
интерфейсом (пропсы сцены + хук прогресса скролла). Секции лендинга не знают о
внутренностях three.js — они только монтируют `<VoxelScene/>` и передают данные.

## 5. Структура страниц

**Лендинг — одностраничный скролл (`/[locale]`):**
1. **Hero** — воксельный мир на фоне; «Denfry — Java developer»; тэглайн из `introLead`;
   две кнопки: «Проекты» (скролл) и «Заказать проект» (→ `@denfry_dev`).
2. **About** — `backgroundText`: про сетевые системы, БД, собственный сервер.
3. **Stack** — `focusText` визуально: Minecraft (Paper/Spigot/Forge), Java-бэкенд,
   Python/ML, античит, инфраструктура. Чипы по языкам: Java · Python · Go · Rust · C# · Flutter.
4. **Featured Projects** — карточки топ-проектов → ведут на кейсы.
5. **Open Source / More on GitHub** — авто-сетка остальных репо из GitHub API.
6. **Contact** — форма (Server Action → Resend) + CTA Telegram-группы + ссылки GitHub.

**Страницы-кейсы (`/[locale]/projects/[slug]`):** герой проекта, задача → решение →
стек → результаты → ссылки (репозиторий, демо). Контент в MDX.

## 6. Воксельный Hero — техническая механика

- `<Canvas>` (R3F). Блоки рендерятся через **InstancedMesh** — тысячи кубов одним
  draw-call, дёшево по перфу.
- **Состояния:** старт — блоки рассыпаны → на загрузке **собираются** в форму
  (например, монограмму «D» или изо-куб). Скролл управляет переходами между секциями:
  собрать → трансформировать → рассыпать к следующему блоку.
- **GSAP ScrollTrigger** связывает прогресс скролла с матрицами инстансов; **Lenis**
  даёт инерционный скролл, синхронизированный со ScrollTrigger.
- **Постобработка:** мягкий bloom + ambient occlusion (лёгкие пресеты).
- **Lazy-load:** канвас грузится через `dynamic import` + `<Suspense>` со статичным
  постером-заглушкой; не блокирует первый осмысленный рендер.
- **Фолбэк:** при `prefers-reduced-motion`, слабом железе или ошибке — статичная
  картинка/градиент вместо канваса.

## 7. Контент и данные

- **Featured-проекты** (источник — текущий `content.ts`, мигрируем в типизированный
  слой + MDX):
  1. `codebase-index` — Python, AI-тулинг, ★4 — **флагман**
  2. `agent-sync` — Python, AI-тулинг
  3. `OverWatch-ML` — Java, ML-античит
  4. `AquaGuard` — Java, Forge mod
  5. `ContinentRegions` — Java, Paper plugin *(проверить, что репо публичный)*
  6. `WorldAccessBlocker` — Java, Paper plugin *(проверить, что репо публичный)*
  7. `VeritasAd` — Python, ML
  Для топ-проектов пишем MDX-кейсы; для всех — карточки.
- **More on GitHub:** `lib/github.ts` тянет публичные репо `denfry` из GitHub API на
  этапе сборки (ISR/revalidate), исключает форки и featured, сортирует по звёздам/дате.
  Так список свежий без ручной правки. Кэш + фолбэк на статический снимок при сбое API.
- Каждый проект: имя, описание (EN/RU), теги/язык, ссылка на репозиторий.

## 8. i18n и темы

- **next-intl**, локали `en`/`ru`, маршрутизация `/[locale]`. Переносим тексты из
  `i18n.ts` (`role`, `introLead`, `focusText`, `backgroundText`, …) в `messages/*.json`.
- **next-themes**: тёмная/светлая, сохранение в localStorage, уважение системной темы
  (как в текущем inline-скрипте). Тема влияет и на палитру воксельной сцены.
- Переключатели языка и темы — в шапке, как сейчас.

## 9. Контакты и Telegram CTA

- **CTA «Заказать проект / Order a project»** → `https://t.me/denfry_dev` (группа для
  заказов). Заметная кнопка в Hero и в секции Contact.
- Личные ссылки: GitHub (`https://github.com/denfry`), личный Telegram — опционально.
- **Форма контакта:** имя, контакт, сообщение → Server Action → Zod-валидация →
  Resend отправляет письмо. Успех/ошибка — тост. Honeypot + (опц.) rate-limit от спама.

## 10. Производительность (бюджет и правила)

- Цель **Lighthouse ≥ 90** (mobile), хорошие Core Web Vitals.
- 3D — отдельный чанк, lazy, не в критическом пути.
- InstancedMesh; внешние ассеты (если будут) — Draco/KTX2.
- Лёгкий initial JS; статика секций через Server Components/PPR.
- `next/image` (AVIF/WebP) для изображений кейсов.

## 11. Доступность (a11y)

- `prefers-reduced-motion` → отключение тяжёлой анимации и статичный фолбэк сцены.
- Клавиатурная навигация, фокус-стили, ARIA для интерактивных элементов.
- Контраст текста в обеих темах ≥ WCAG AA.
- Семантические заголовки, alt-тексты.

## 12. Обработка ошибок

- **Error boundary** вокруг `<Canvas>` → статичный постер, сайт не падает.
- Ошибки формы — инлайн + тост; сбой Resend не теряет данные пользователя (сообщение об ошибке + альтернативный контакт Telegram).
- Кастомные `not-found` (404) и сегментные `error.tsx`.
- Фолбэк GitHub API → статический снимок репозиториев.

## 13. SEO / метаданные

- Metadata API: title/description (из текущих meta), per-locale.
- next/og: динамические OG-картинки (1200×630) для лендинга и кейсов.
- `sitemap.ts`, `robots.ts`, JSON-LD (Person + SoftwareSourceCode для проектов).
- Канонические URL и hreflang для EN/RU.

## 14. Тестирование и CI

- **CI (GitHub Actions):** `tsc --noEmit`, Biome lint, build, **Lighthouse CI** на PR.
- **Playwright smoke:** лендинг грузится; переключение темы/языка работает; форма
  валидирует пустые поля; страница-кейс открывается.
- Превью-деплои Vercel на каждый PR.

## 15. Деплой и миграция

- Реструктуризация текущего Vite-проекта в Next App Router (переиспользуем идеи
  компонентов: Header, Intro→Hero, Work→FeaturedProjects, Footer; контент из
  `content.ts`/`i18n.ts`).
- Деплой через **Vercel**, репозиторий на GitHub — источник. Домен: свой или
  `*.vercel.app`. GitHub Pages отключаем (не тянет SSR/Server Actions/OG).
- Секреты в Vercel env: `RESEND_API_KEY`, (опц.) `GITHUB_TOKEN` для лимитов API.

## 16. Решения по открытым вопросам

- **Публичность** `ContinentRegions` и `WorldAccessBlocker` — ✅ проверено, оба
  репозитория публичны, ссылки рабочие.
- **Личный Telegram** (`kfcbossalbino`) — ✅ убираем; единственный CTA — группа
  `@denfry_dev` («Заказать проект»).
- **Домен** — ✅ стартуем на `*.vercel.app`; кастомный домен подключим позже.
- **Концепт воксельной формы** (монограмма «D» / изо-куб / мини-сцена) —
  финализируем на этапе реализации Hero (не блокирует план).
