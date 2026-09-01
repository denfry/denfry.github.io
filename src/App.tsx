import { useEffect, useState } from 'react'

type Project = {
  name: string
  eyebrow: string
  description: string
  tags: string[]
  metrics?: string[]
  codeUrl?: string
  liveUrl?: string
  image?: string
  imageAlt?: string
  featured?: boolean
}

const PROJECTS: Project[] = [
  {
    name: 'codebase-index',
    eyebrow: 'Личный open-source · Python · AI tooling',
    description:
      'Retrieval/context layer для AI coding agents: индексирует кодовую базу, строит граф символов и зависимостей и возвращает точный контекст с привязкой к файлам и строкам. На benchmark 55k LOC Java — Recall@3 70% против 40% у disciplined rg baseline при ~13× меньшем answer-context.',
    tags: ['Python', 'SQLite FTS5', 'Tree-sitter', 'MCP', 'Hybrid / Vector Retrieval'],
    metrics: ['Recall@3 70% vs 40%', '~13× меньше answer-context', 'benchmark: 55k LOC Java'],
    codeUrl: 'https://github.com/denfry/codebase-index',
    image: 'https://raw.githubusercontent.com/denfry/codebase-index/main/assets/demo.png',
    imageAlt: 'Демонстрация codebase-index',
    featured: true,
  },
  {
    name: 'streamforge-go',
    eyebrow: 'Личный проект · Go · Event-driven backend',
    description:
      'Сервис ingestion и аналитики рекламных событий: HTTP API → Kafka → bounded worker pool → ClickHouse, с PostgreSQL как transactional source of truth, Redis-кэшем, backpressure, retry/DLQ, метриками и graceful shutdown.',
    tags: ['Go', 'Kafka', 'ClickHouse', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: ['goroutines / channels', 'Testcontainers', 'Prometheus metrics'],
    codeUrl: 'https://github.com/denfry/streamforge-go',
    featured: true,
  },
  {
    name: 'agent-sync',
    eyebrow: 'Личный open-source · Multi-agent workflow',
    description:
      'Локальный coordination layer для параллельной работы coding-agent сессий в одном репозитории: task board, file locks, сообщения, решения и журнал активности поверх SQLite. Снижает риск конфликтующих правок без отдельного сервера.',
    tags: ['Python', 'SQLite', 'Claude Code Hooks', 'CLI', 'Multi-agent'],
    metrics: ['Shared task board', 'Fail-closed file locks', 'No server required'],
    codeUrl: 'https://github.com/denfry/agent-sync',
    featured: true,
  },
  {
    name: 'lk-fd-demo',
    eyebrow: 'Fullstack · Реальное ТЗ',
    description:
      'Личный кабинет для управления наружной рекламой: роли CLIENT/ADMIN, интерактивная карта, фильтры, календарь доступности, импорт CSV/XLSX, Excel-экспорт и административный контур.',
    tags: ['Next.js 16', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Playwright'],
    codeUrl: 'https://github.com/denfry/lk-fd-demo',
    image: '/work/lk-fd-demo-1600.webp',
    imageAlt: 'Интерфейс lk-fd-demo',
  },
  {
    name: 'VibeForge',
    eyebrow: 'Собственный закрытый проект · Agentic coding platform',
    description:
      'Платформа для превращения идеи в требования, архитектуру, backlog и реализацию. Отдельный AI-agent framework/provider abstraction, NestJS API, очереди, realtime и инфраструктурный слой.',
    tags: ['NestJS', 'Next.js', 'PostgreSQL', 'Redis', 'BullMQ', 'WebSocket', 'AI Agents'],
    metrics: ['Модульная backend-архитектура', 'Agent layer', 'CI/CD + Docker'],
  },
  {
    name: 'Politernal web platform',
    eyebrow: 'Production · Fullstack / Operations',
    description:
      'Production-платформа с магазином, аккаунтами, админ-инструментами, ботами и внешними интеграциями. Поддерживаю схему данных, миграции, CI/CD, health checks и исправление production-проблем.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker Compose', 'GitHub Actions'],
    image: '/work/politernal-site-1600.webp',
    imageAlt: 'Интерфейс Politernal web platform',
  },
]

const STACK = [
  {
    title: 'Backend',
    items: ['Python', 'FastAPI', 'TypeScript', 'Node.js', 'NestJS', 'Go', 'Java', 'REST', 'WebSocket'],
  },
  {
    title: 'AI / Agents',
    items: ['Claude Code', 'Codex', 'MCP', 'RAG', 'Hybrid Retrieval', 'Vector Search', 'LLM API', 'Context Engineering'],
  },
  {
    title: 'Data',
    items: ['PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'ClickHouse', 'Kafka', 'Prisma', 'SQLAlchemy'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'SSR', 'TanStack Query', 'Zustand'],
  },
  {
    title: 'Infrastructure',
    items: ['Docker', 'Docker Compose', 'Linux', 'GitHub Actions', 'CI/CD', 'Nginx', 'Caddy'],
  },
  {
    title: 'Quality',
    items: ['pytest', 'Vitest', 'Playwright', 'Testcontainers', 'OpenAPI', 'Structured logging'],
  },
]

const PROCESS = [
  {
    index: '01',
    title: 'Разбираю задачу',
    text: 'Фиксирую пользователя, бизнес-цель, ограничения, данные и измеримый критерий результата — до генерации кода.',
  },
  {
    index: '02',
    title: 'Проектирую систему',
    text: 'Разделяю frontend, backend, данные, интеграции и AI-слой. Выбираю минимальную архитектуру, которую можно безопасно развивать.',
  },
  {
    index: '03',
    title: 'Ускоряю реализацию AI',
    text: 'Использую Claude Code и Codex с контекстом, ограничениями, MCP и несколькими агентами — но архитектурные решения не делегирую вслепую.',
  },
  {
    index: '04',
    title: 'Проверяю и довожу',
    text: 'Ревью кода, тесты, security checks, Docker, CI/CD, наблюдаемость и эксплуатация. README описывает только то, что реально работает.',
  },
]

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light'
      ? 'light'
      : 'dark',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="portfolio">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="На главную">
          <span className="brandMark">DY</span>
          <span className="brandText">Данила Юрков</span>
        </a>
        <nav className="nav" aria-label="Основная навигация">
          <a href="#projects">Проекты</a>
          <a href="#process">Подход</a>
          <a href="#stack">Стек</a>
          <a href="#contact">Контакты</a>
        </nav>
        <div className="topActions">
          <button
            className="themeToggle"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          >
            {theme === 'dark' ? '☼' : '●'}
          </button>
          <a className="miniCta" href="https://github.com/denfry" target="_blank" rel="noreferrer">
            GitHub <ExternalArrow />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero sectionWrap">
          <div className="heroCopy">
            <div className="availability"><span className="statusDot" /> Открыт к Backend / Python / AI предложениям</div>
            <p className="eyebrow">Данила Юрков · Backend / AI Developer · Москва</p>
            <h1>
              Backend и AI-разработка —
              <span> от API и данных до production.</span>
            </h1>
            <p className="heroLead">
              Python, TypeScript и Go. Строю backend-сервисы, интеграции и AI-инструменты; проектирую архитектуру,
              работаю с данными, Docker и CI/CD и довожу систему до запуска. Сильный фокус — retrieval,
              agentic systems и прикладная автоматизация.
            </p>
            <div className="heroButtons">
              <a className="primaryButton" href="#projects">Смотреть проекты ↓</a>
              <a className="secondaryButton" href="mailto:dabinayo@pm.me">Написать мне</a>
            </div>
            <div className="heroProof" aria-label="Проверяемые показатели codebase-index">
              <div><strong>70%</strong><span>Recall@3<br />codebase-index</span></div>
              <div><strong>~13×</strong><span>меньше<br />answer-context</span></div>
              <div><strong>55k LOC</strong><span>Java repo<br />benchmark</span></div>
            </div>
          </div>

          <aside className="profileCard" aria-label="Профиль">
            <div className="photoFrame">
              <img
                src="https://avatars.githubusercontent.com/u/63917857?v=4"
                alt="Данила Юрков"
                width="460"
                height="460"
              />
              <span className="photoBadge">Moscow · UTC+3</span>
            </div>
            <div className="profileMeta">
              <div>
                <span className="metaLabel">Целевая роль</span>
                <strong>Backend · Python · AI</strong>
              </div>
              <div>
                <span className="metaLabel">Формат</span>
                <strong>Москва · full-time · hybrid / remote</strong>
              </div>
            </div>
            <div className="profileLinks">
              <a href="https://t.me/denfry" target="_blank" rel="noreferrer">Telegram <ExternalArrow /></a>
              <a href="https://github.com/denfry" target="_blank" rel="noreferrer">GitHub <ExternalArrow /></a>
            </div>
          </aside>
        </section>

        <section className="signalBar" aria-label="Специализация">
          <span>Python</span><i />
          <span>TypeScript</span><i />
          <span>Go</span><i />
          <span>AI / LLM</span><i />
          <span>MCP / RAG</span><i />
          <span>PostgreSQL</span><i />
          <span>Docker</span>
        </section>

        <section className="sectionWrap sectionBlock" id="projects">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">01 / Избранное</p>
              <h2>Проекты, которые показывают инженерный уровень</h2>
            </div>
            <p>Не список технологий, а законченные системы: что решают, как устроены и какие результаты можно проверить.</p>
          </div>

          <div className="projectGrid">
            {PROJECTS.map((project, index) => (
              <article className={`projectCard ${project.featured ? 'featured' : ''}`} key={project.name}>
                <div className={`projectVisual ${project.image ? 'withImage' : 'placeholder'}`}>
                  {project.image ? (
                    <img src={project.image} alt={project.imageAlt ?? ''} loading={index < 2 ? 'eager' : 'lazy'} />
                  ) : (
                    <>
                      <span className="visualNumber">0{index + 1}</span>
                      <div className="terminalMock" aria-hidden="true">
                        <span>$ {project.name}</span>
                        <span className="terminalMuted">status: ready</span>
                        <span className="terminalAccent">✓ architecture</span>
                        <span className="terminalAccent">✓ tests / tooling</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="projectBody">
                  <p className="projectEyebrow">{project.eyebrow}</p>
                  <h3>{project.name}</h3>
                  <p className="projectDescription">{project.description}</p>
                  {project.metrics && (
                    <div className="metricRow">
                      {project.metrics.map((metric) => <span key={metric}>{metric}</span>)}
                    </div>
                  )}
                  <div className="tagList">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="projectLinks">
                    {project.codeUrl && <a href={project.codeUrl} target="_blank" rel="noreferrer">Код <ExternalArrow /></a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live <ExternalArrow /></a>}
                    {!project.codeUrl && !project.liveUrl && <span className="privateNote">Код могу показать на технической встрече</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="sectionWrap sectionBlock experienceSection">
          <div className="sectionHeading compact">
            <div>
              <p className="eyebrow">02 / Практика</p>
              <h2>Не только pet-проекты</h2>
            </div>
          </div>
          <div className="experienceGrid">
            <article>
              <span className="experienceNumber">01</span>
              <h3>Production-проекты</h3>
              <p>Веду fullstack-системы от схемы данных и API до Docker, CI/CD, миграций, health checks и исправления production-проблем.</p>
            </article>
            <article>
              <span className="experienceNumber">02</span>
              <h3>Внутренняя автоматизация</h3>
              <p>На текущей работе создавал приложение для архива документов и скрипты, которые автоматизируют рутинные операции при работе с государственными информационными системами.</p>
            </article>
            <article>
              <span className="experienceNumber">03</span>
              <h3>Open-source AI tooling</h3>
              <p>Разрабатываю собственные инструменты для retrieval и координации AI-агентов — с документацией, тестами, CI и измеряемыми benchmark.</p>
            </article>
          </div>
        </section>

        <section className="sectionWrap sectionBlock" id="process">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">03 / AI-first без магии</p>
              <h2>Как я работаю с AI в разработке</h2>
            </div>
            <p>Быстро — не значит вслепую. Модель генерирует и исследует, инженер отвечает за решения, доказательства и итоговую систему.</p>
          </div>
          <div className="processGrid">
            {PROCESS.map((item) => (
              <article className="processCard" key={item.index}>
                <span>{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sectionWrap sectionBlock" id="stack">
          <div className="sectionHeading compact">
            <div>
              <p className="eyebrow">04 / Технологии</p>
              <h2>Стек, с которым работаю</h2>
            </div>
          </div>
          <div className="stackGrid">
            {STACK.map((group) => (
              <article className="stackGroup" key={group.title}>
                <h3>{group.title}</h3>
                <div className="stackTags">
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="sectionWrap contactSection" id="contact">
          <div className="contactPanel">
            <p className="eyebrow">05 / Контакты</p>
            <h2>Ищу Backend / Python / AI роль с реальными инженерными задачами.</h2>
            <p className="contactLead">Интересны продуктовые команды, где важны архитектура, качество, данные, интеграции и измеримый результат. Готов подробно разобрать код и решения проектов на технической встрече.</p>
            <div className="contactButtons">
              <a className="primaryButton" href="mailto:dabinayo@pm.me">dabinayo@pm.me</a>
              <a className="secondaryButton" href="https://t.me/denfry" target="_blank" rel="noreferrer">Telegram <ExternalArrow /></a>
              <a className="secondaryButton" href="https://github.com/denfry" target="_blank" rel="noreferrer">GitHub <ExternalArrow /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer sectionWrap">
        <span>© 2026 Данила Юрков</span>
        <span>Backend · Python · AI · Open Source</span>
      </footer>
    </div>
  )
}
