export type Project = {
  name: string
  url: string
  tags: string[]
  desc: { en: string; ru: string }
}

export const PROJECTS: Project[] = [
  {
    name: 'codebase-index',
    url: 'https://github.com/denfry/codebase-index',
    tags: ['Python', '★ 4'],
    desc: {
      en: 'Local-first codebase indexing for AI coding agents — hybrid FTS5 + Tree-sitter + graph search, fully offline.',
      ru: 'Локальная индексация кода для AI-агентов — гибрид FTS5 + Tree-sitter + графовый поиск, полностью офлайн.',
    },
  },
  {
    name: 'agent-sync',
    url: 'https://github.com/denfry/agent-sync',
    tags: ['Python', 'CLI'],
    desc: {
      en: 'Coordinate multiple AI coding-agent sessions in one repo: shared tasks, file locks, and live messaging over a local SQLite layer.',
      ru: 'Координация нескольких сессий AI-агентов в одном репозитории: общие задачи, блокировки файлов и обмен сообщениями поверх локального SQLite.',
    },
  },
  {
    name: 'OverWatch-ML',
    url: 'https://github.com/denfry/OverWatch-ML',
    tags: ['Java', 'ML'],
    desc: {
      en: 'Cheat-detection system for modern Minecraft servers, using behavior analysis and machine learning.',
      ru: 'Система детекта читов для современных Minecraft-серверов на основе анализа поведения и машинного обучения.',
    },
  },
  {
    name: 'AquaGuard',
    url: 'https://github.com/denfry/AquaGuard',
    tags: ['Java', 'Forge mod'],
    desc: {
      en: 'Block logging, inspection and rollback mod for Minecraft Forge 1.18.2–1.21.1.',
      ru: 'Мод логирования блоков, инспекции и отката для Minecraft Forge 1.18.2–1.21.1.',
    },
  },
  {
    name: 'ContinentRegions',
    url: 'https://github.com/denfry/ContinentRegions',
    tags: ['Java', 'Paper plugin'],
    desc: {
      en: 'Paper 1.21.x plugin: draw continents on a BlueMap web map and turn them into WorldGuard regions. SQLite, flag presets, rollback, REST API.',
      ru: 'Плагин Paper 1.21.x: рисует континенты на веб-карте BlueMap и превращает их в регионы WorldGuard. SQLite, пресеты флагов, откат, REST API.',
    },
  },
  {
    name: 'WorldAccessBlocker',
    url: 'https://github.com/denfry/WorldAccessBlocker',
    tags: ['Java', 'Paper plugin'],
    desc: {
      en: 'Blocks access to the End, Nether and elytra with configurable, fine-grained rules.',
      ru: 'Блокирует доступ в Энд, Незер и к элитрам с гибкими настраиваемыми правилами.',
    },
  },
  {
    name: 'VeritasAd',
    url: 'https://github.com/denfry/VeritasAd',
    tags: ['Python', 'ML'],
    desc: {
      en: 'Neural-network analysis system for detecting advertising integrations.',
      ru: 'Нейросетевая система анализа для детекта рекламных интеграций.',
    },
  },
]

export const CONTACTS = {
  telegram: 'https://t.me/kfcbossalbino',
  github: 'https://github.com/denfry',
  allRepos: 'https://github.com/denfry?tab=repositories',
}
