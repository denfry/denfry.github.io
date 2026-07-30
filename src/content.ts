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
    tags: [],
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
    tags: [],
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
    tags: ['Next.js', 'Prisma'],
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
