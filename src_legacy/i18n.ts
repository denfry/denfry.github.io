import type { Lang } from './context/PrefsContext'

export type Strings = {
  role: string
  introLead: string
  selectedWork: string
  focusLabel: string
  focusText: string
  backgroundLabel: string
  backgroundText: string
  allRepos: string
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    role: 'Java developer',
    introLead:
      'I build server-side Minecraft systems — plugins, mods, anti-cheat — and open-source tooling for AI coding agents.',
    selectedWork: 'Selected work',
    focusLabel: 'Focus',
    focusText:
      'Minecraft (Paper, Spigot, Forge) · Java backend (Spring, PostgreSQL, MySQL) · Python tooling and ML · anti-cheat and behavior analysis · server performance and infrastructure.',
    backgroundLabel: 'Background',
    backgroundText:
      'Networking and information systems, database design, and backend architecture. I run my own Minecraft server, so most projects are tested in real production, not just prototypes.',
    allRepos: 'All repositories →',
  },
  ru: {
    role: 'Java-разработчик',
    introLead:
      'Делаю серверные системы для Minecraft — плагины, моды, античит — и open-source инструменты для AI-агентов.',
    selectedWork: 'Избранные проекты',
    focusLabel: 'Направления',
    focusText:
      'Minecraft (Paper, Spigot, Forge) · Java-бэкенд (Spring, PostgreSQL, MySQL) · инструменты на Python и ML · античит и анализ поведения · производительность серверов и инфраструктура.',
    backgroundLabel: 'О себе',
    backgroundText:
      'Сетевые технологии и информационные системы, проектирование баз данных и серверная архитектура. Держу собственный Minecraft-сервер, поэтому большинство проектов проверены в реальной эксплуатации, а не только в прототипах.',
    allRepos: 'Все репозитории →',
  },
}
