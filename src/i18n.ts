import type { Lang } from './context/PrefsContext'

export type Strings = {
  role: string
  introLeadA: string
  introAccent: string
  introLeadB: string
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
    introLeadA: 'I build ',
    introAccent: 'distinctive websites and web apps',
    introLeadB:
      ' for clients — from custom landing pages to full-stack platforms — plus server-side Minecraft systems and open-source tooling for AI coding agents.',
    selectedWork: 'Selected work',
    workClientLabel: 'Client work',
    workPersonalLabel: 'Labs',
    viewSite: 'View site →',
    viewCode: 'Code on GitHub →',
    focusLabel: 'Focus',
    focusText:
      'Next.js, React, TypeScript · full-stack apps (Prisma, PostgreSQL) · custom landing pages and client platforms · CRM systems · bots for Telegram, Discord, VK and other messengers · Excel data processing · dashboards and reporting · Minecraft (Paper, Spigot, Forge) backend systems · Python tooling and ML for anti-cheat and behavior analysis.',
    backgroundLabel: 'Background',
    backgroundText:
      'Networking and information systems, database design, and backend architecture. I ship client sites into real production and run my own Minecraft server, so most projects are tested under real usage, not just prototypes.',
    allRepos: 'All repositories →',
  },
  ru: {
    role: 'Веб-разработчик',
    introLeadA: 'Делаю ',
    introAccent: 'нестандартные сайты и веб-приложения',
    introLeadB:
      ' для заказчиков — от лендингов до full-stack платформ — а также серверные системы для Minecraft и open-source инструменты для AI-агентов.',
    selectedWork: 'Избранные проекты',
    workClientLabel: 'Клиентские проекты',
    workPersonalLabel: 'Личные проекты',
    viewSite: 'Смотреть сайт →',
    viewCode: 'Код на GitHub →',
    focusLabel: 'Направления',
    focusText:
      'Next.js, React, TypeScript · full-stack приложения (Prisma, PostgreSQL) · лендинги и платформы под заказчика · CRM-системы · боты для Telegram, Discord, VK и других мессенджеров · обработка данных в Excel · дашборды и отчёты · Minecraft (Paper, Spigot, Forge) бэкенд-системы · инструменты на Python и ML для античита и анализа поведения.',
    backgroundLabel: 'О себе',
    backgroundText:
      'Сетевые технологии и информационные системы, проектирование баз данных и серверная архитектура. Клиентские сайты уезжают в реальный продакшн, плюс держу собственный Minecraft-сервер — большинство проектов проверены в реальной эксплуатации, а не только в прототипах.',
    allRepos: 'Все репозитории →',
  },
}
