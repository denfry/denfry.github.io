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
      'Retrieval/context layer для Claude Code, Codex и MCP-клиентов. Индексирует кодовую базу, строит граф символов и зависимостей и отдаёт агенту точный контекст с привязкой к файлам и строкам.',
    tags: ['Python', 'SQLite FTS5', 'Tree-sitter', 'MCP', 'Hybrid / Vector Retrieval'],
    metrics: ['Recall@3 70% vs 40%', '~13× меньше answer-context', 'benchmark: 55k LOC Java'],
    codeUrl: 'https://github.com/denfry/codebase-index',
    image: 'https://raw.githubusercontent.com/denfry/codebase-index/main/assets/demo.png',
    imageAlt: 'Демонстрация codebase-index',
    featured: true,
  },
  {
    name: 'agent-sync',
    eyebrow: 'Личный open-source · Multi-agent workflow',
    description:
      'Локальный слой координации нескольких coding-agent сессий: общие задачи, file locks, сообщения, решения, журнал активности и Claude Code hooks.',
    tags: ['Python', 'SQLite', 'Claude Code Hooks', 'CLI', 'Multi-agent'],
    metrics: ['Shared task board', 'Fail-closed file locks', 'No server required'],
    codeUrl: 'https://github.com/denfry/agent-sync',
    featured: true,
  },
  {
    name: 'streamforge-go',
    eyebrow: 'Личный проект · Event-driven backend',
    description:
      'Сервис аналитики событий с акцентом на конкурентность и надёжность: bounded worker pool, backpressure, retry/DLQ, Kafka, ClickHouse и PostgreSQL.',
    tags: ['Go', 'Kafka', 'ClickHouse', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: ['goroutines / channels', 'Testcontainers', 'Prometheus metrics'],
    codeUrl: 'https://github.com/denfry/streamforge-go',
    featured: true,
  },
  {
    name: 'lk-fd-demo',
    eyebrow: 'Fullstack · Реальное ТЗ',
    description:
      'Личный кабинет для управления наружной рекламой: роли CLIENT/ADMIN, карта, фильтры, календарь доступности, импорт CSV/XLSX, Excel-экспорт и административный контур.',
    tags: ['Next.js 16', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Playwright'],
    codeUrl: 'https://github.com/denfry/lk-fd-demo',
    image: '/work/lk-fd-demo-1600.webp',
    imageAlt: 'Интерфейс lk-fd-demo',
  },
  {
    name: 'VibeForge',
    eyebrow: 'Закрытый проект · Agentic coding platform',
    description:
      'Платформа для превращения идеи в требования, архитектуру, задачи и реализацию. Отдельный AI-agent framework/provider abstraction, NestJS API, очереди, realtime и инфраструктура.',
    tags: ['NestJS', 'Next.js', 'PostgreSQL', 'Redis', 'BullMQ', 'WebSocket', 'AI Agents'],
    metrics: ['Модульная backend-архитектура', 'Agent layer', 'CI/CD + Docker'],
  },
  {
    name: 'Politernal web platform',
    eyebrow: 'Production · Fullstack / Operations',
    description:
      'Production-платформа с магазином, аккаунтами, админ-инструментами, ботами и внешними интеграциями. Самостоятельная эксплуатация, миграции, CI/CD и health checks.',
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
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
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
            <div className="availability"><span className="statusDot" /> Открыт к предложениям</div>
            <p className="eyebrow">Backend / AI-разработчик · Москва</p>
            <h1>
              Строю backend и AI-системы,
              <span> которые можно измерить и запустить.</span>
            </h1>
            <p className="heroLead">
              Python, TypeScript и Go. API, базы данных, интеграции, AI-агенты, retrieval/context infrastructure,
              realtime и production-эксплуатация. AI использую как инженерный ускоритель, а не замену ревью и архитектуре.
            </p>
            <div className="heroButtons">
              <a className="primaryButton" href="#projects">Смотреть проекты ↓</a>
              <a className="secondaryButton" href="mailto:dabinayo@pm.me">Написать мне</a>
            </div>
            <div className="heroProof" aria-label="Ключевые показатели">
              <div><strong>70%</strong><span>Recall@3<br />codebase-index</span></div>
              <div><strong>~13×</strong><span>меньше<br />answer-context</span></div>
              <div><strong>55k LOC</strong><span>реальный Java<br />benchmark</span></div>
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
                <span className="metaLabel">Фокус сейчас</span>
                <strong>Python · AI · Backend</strong>
              </div>
              <div>
                <span className="metaLabel">Формат</span>
                <strong>Москва / hybrid / remote</strong>
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
          <span>AI / LLM</span><i />
          <span>MCP</span><i />
          <span>RAG</span><i />
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
              <h3>Production-разработка</h3>
              <p>Веду fullstack-системы от схемы данных и API до Docker, CI/CD, миграций, мониторинга и исправления production-проблем.</p>
            </article>
            <article>
              <span className="experienceNumber">02</span>
              <h3>Внутренняя автоматизация</h3>
              <p>На текущей работе создавал приложение для архива документов и скрипты, которые убирают ручные операции в рабочих процессах.</p>
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
            <h2>Ищу команду, где можно строить реальные backend и AI-продукты.</h2>
            <p className="contactLead">Интересны Backend / Python / AI Developer позиции и сильные инженерные команды. Готов подробно разобрать архитектуру и код проектов на технической встрече.</p>
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
        <span>Backend · AI · Open Source</span>
      </footer>
    </div>
  )
}
