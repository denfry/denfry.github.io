import { useEffect, useState } from 'react'

type Project = {
  index: string
  name: string
  status: string
  summary: string
  description: string
  stack: string[]
  note?: string
  codeUrl?: string
  liveUrl?: string
  image?: string
  imageAlt?: string
  visual: 'image' | 'coordination' | 'stream' | 'architecture'
  reverse?: boolean
}

const PROJECTS: Project[] = [
  {
    index: '01',
    name: 'codebase-index',
    status: 'Personal open source',
    summary: 'Retrieval/context infrastructure for coding agents.',
    description:
      'Локальный слой поиска и code-graph для Claude Code, Codex CLI и MCP-клиентов. Индексирует репозиторий в SQLite, извлекает символы и связи через Tree-sitter и возвращает ранжированный file:line context вместо широкого сканирования.',
    stack: ['Python', 'SQLite FTS5', 'Tree-sitter', 'MCP', 'Hybrid / vector retrieval'],
    note: 'Benchmark на одном Java repository (~55k LOC): Recall@3 70% против 40% у disciplined rg baseline; примерно в 13× меньше answer-context tokens.',
    codeUrl: 'https://github.com/denfry/codebase-index',
    image: '/work/codebase-index-demo.png',
    imageAlt: 'Демонстрация codebase-index: Find, Trace, Predict и evidence contract',
    visual: 'image',
  },
  {
    index: '02',
    name: 'agent-sync',
    status: 'Personal open source',
    summary: 'Multi-agent coordination layer for one repository.',
    description:
      'Локальная координация независимых coding-agent сессий: общий task board, file locks, присутствие, сообщения, решения и activity log поверх SQLite. Claude Code hooks доставляют сообщения и fail-closed блокируют конфликтующие правки.',
    stack: ['Python', 'SQLite', 'CLI', 'Claude Code hooks'],
    note: 'Core работает без отдельного сервера и сетевого взаимодействия.',
    codeUrl: 'https://github.com/denfry/agent-sync',
    visual: 'coordination',
    reverse: true,
  },
  {
    index: '03',
    name: 'streamforge-go',
    status: 'Personal project',
    summary: 'Event-driven backend for ingestion and analytics.',
    description:
      'HTTP API принимает и валидирует события, Kafka отделяет request latency от аналитической записи, bounded worker pool обрабатывает сообщения с backpressure, retry/DLQ и contiguous offset commits, а ClickHouse хранит аналитику.',
    stack: ['Go', 'Kafka', 'ClickHouse', 'PostgreSQL', 'Redis', 'Prometheus'],
    note: 'BenchmarkPoolSubmit: 792 ns/op, 0 allocs/op. Local microbenchmark с no-op handler, not production throughput.',
    codeUrl: 'https://github.com/denfry/streamforge-go',
    visual: 'stream',
  },
  {
    index: '04',
    name: 'lk-fd-demo',
    status: 'Personal project · public demo',
    summary: 'Fullstack case from a real-world OOH media specification.',
    description:
      'Личный кабинет медиаселлера наружной рекламы: роли CLIENT/ADMIN, REST API, интерактивная карта, фильтры, календарь доступности, рабочие списки, CSV/XLSX import, идемпотентный upsert и Excel export.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Vitest', 'Playwright'],
    note: 'Данные в демо сгенерированы; screenshot показывает рабочий кабинет с картой Санкт-Петербурга.',
    codeUrl: 'https://github.com/denfry/lk-fd-demo',
    image: '/work/lk-fd-demo-1600.webp',
    imageAlt: 'Рабочий стол lk-fd-demo с картой размещений и фильтрами',
    visual: 'image',
    reverse: true,
  },
  {
    index: '05',
    name: 'VibeForge',
    status: 'Private project',
    summary: 'Agent framework and product delivery platform.',
    description:
      'Платформа, которая переводит идею в требования, архитектуру, backlog и реализацию. Архитектура включает отдельный agent framework/provider abstraction, NestJS backend, очереди, realtime, PostgreSQL, Redis, frontend и инфраструктурный слой.',
    stack: ['NestJS', 'Next.js', 'PostgreSQL', 'Redis', 'BullMQ', 'WebSocket'],
    note: 'Исходный код закрыт; архитектуру можно разобрать на технической встрече.',
    visual: 'architecture',
  },
  {
    index: '06',
    name: 'Politernal',
    status: 'Production · fullstack / operations',
    summary: 'Production web platform with product and operations surfaces.',
    description:
      'Production-платформа с магазином, аккаунтами, админ-инструментами, ботами и внешними интеграциями. Работа включает schema/data design, миграции, CI/CD, health checks и разбор production-проблем.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker Compose', 'GitHub Actions'],
    note: 'Minecraft — предметная область продукта, не специализация портфолио.',
    image: '/work/politernal-site-1600.webp',
    imageAlt: 'Главная страница production-платформы Politernal',
    visual: 'image',
  },
]

const STACK = [
  ['Backend', 'Python / FastAPI / Node.js / NestJS / Go / Java'],
  ['Data', 'PostgreSQL / MySQL / SQLite / Redis / ClickHouse / Kafka'],
  ['AI', 'LLM API / MCP / RAG / retrieval / vector search / context engineering'],
  ['Infra', 'Docker / Linux / CI/CD / GitHub Actions / Nginx'],
  ['Frontend', 'React / Next.js / TypeScript'],
  ['Quality', 'pytest / Vitest / Playwright / Testcontainers / OpenAPI'],
]

const WORKFLOW = [
  ['Research', 'Изучаю репозиторий, ограничения и существующие контракты.'],
  ['Implementation', 'Использую Claude Code и Codex для навигации, реализации и рефакторинга.'],
  ['Review', 'Сам отвечаю за requirements, архитектуру, security и качество решений.'],
  ['Verification', 'Проверяю тестами, сборкой, runtime-сценарием и production readiness.'],
]

function ExternalArrow() {
  return <span className="externalArrow" aria-hidden="true">↗</span>
}

function CoordinationVisual() {
  return (
    <div className="coordinationDiagram" role="img" aria-label="Схема agent-sync: несколько agent-сессий координируются через локальный SQLite state">
      <div className="diagramTopline">
        <span>LOCAL COORDINATION</span>
        <span>NO SERVER / NO NETWORK</span>
      </div>
      <div className="agentLane">
        <span className="agentNode">frontend</span>
        <span className="agentNode">backend</span>
        <span className="agentNode">tests</span>
      </div>
      <div className="diagramConnector" aria-hidden="true" />
      <div className="syncCore">
        <strong>.claude/coordination/state.sqlite</strong>
        <span>tasks · locks · messages · decisions · activity</span>
      </div>
      <div className="diagramFooter">
        <span>CLI</span>
        <span>Claude Code skill</span>
        <span>hooks</span>
      </div>
    </div>
  )
}

function StreamVisual() {
  return (
    <div className="streamDiagram" role="img" aria-label="Поток streamforge-go: HTTP, Kafka, bounded worker pool и ClickHouse">
      <div className="diagramTopline">
        <span>EVENT PATH</span>
        <span>AT-LEAST-ONCE</span>
      </div>
      <div className="flowTrack">
        <span className="flowNode">HTTP</span>
        <span className="flowArrow" aria-hidden="true">→</span>
        <span className="flowNode">Kafka</span>
        <span className="flowArrow" aria-hidden="true">→</span>
        <span className="flowNode flowNodeAccent">bounded<br />pool</span>
        <span className="flowArrow" aria-hidden="true">→</span>
        <span className="flowNode">ClickHouse</span>
      </div>
      <div className="flowSupport">
        <span>PostgreSQL / source of truth</span>
        <span>Redis / cache + counters</span>
        <span>retry → DLQ</span>
      </div>
      <div className="diagramFooter">
        <span>goroutines</span>
        <span>channels</span>
        <span>Prometheus</span>
      </div>
    </div>
  )
}

function ArchitectureVisual() {
  return (
    <div className="architectureDiagram" role="img" aria-label="Схема VibeForge: frontend, NestJS API, agent framework, queues, realtime и data layer">
      <div className="diagramTopline">
        <span>PRIVATE ARCHITECTURE</span>
        <span>SOURCE AVAILABLE ON REQUEST</span>
      </div>
      <div className="architectureGrid">
        <span className="architectureNode architectureNodeWide">Next.js / React frontend</span>
        <span className="architectureNode">NestJS API</span>
        <span className="architectureNode architectureNodeAccent">agent framework<br />provider abstraction</span>
        <span className="architectureNode">BullMQ queues</span>
        <span className="architectureNode">WebSocket / realtime</span>
        <span className="architectureNode architectureNodeWide">PostgreSQL · Redis · Docker</span>
      </div>
      <div className="diagramFooter">
        <span>requirements</span>
        <span>backlog</span>
        <span>implementation</span>
      </div>
    </div>
  )
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.visual === 'coordination') return <CoordinationVisual />
  if (project.visual === 'stream') return <StreamVisual />
  if (project.visual === 'architecture') return <ArchitectureVisual />

  return (
    <div className="imageVisual">
      <img
        src={project.image}
        alt={project.imageAlt}
        width={project.name === 'codebase-index' ? 1200 : 1600}
        height={project.name === 'codebase-index' ? 760 : 900}
        loading={project.index === '01' ? 'eager' : 'lazy'}
      />
      <span className="imageCaption">{project.name === 'codebase-index' ? 'actual repository demo' : 'actual project screenshot'}</span>
    </div>
  )
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.codeUrl && !project.liveUrl) {
    return <span className="projectPrivate">Source available during hiring process</span>
  }

  return (
    <div className="projectLinks">
      {project.codeUrl && (
        <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
          GitHub <ExternalArrow />
        </a>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
          Live demo <ExternalArrow />
        </a>
      )}
    </div>
  )
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
      <a className="skipLink" href="#content">К содержанию</a>

      <header className="siteHeader">
        <div className="sectionFrame headerInner">
          <a className="brand" href="#top" aria-label="Данила Юрков — начало страницы">
            <span className="brandMark">DY</span>
            <span className="brandText">Данила Юрков</span>
          </a>
          <nav className="siteNav" aria-label="Основная навигация">
            <a href="#projects">Проекты</a>
            <a href="#practice">Практика</a>
            <a href="#stack">Стек</a>
            <a href="#contact">Контакты</a>
          </nav>
          <div className="headerActions">
            <button
              className="themeToggle"
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              aria-pressed={theme === 'light'}
            >
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
            <a className="headerGithub" href="https://github.com/denfry" target="_blank" rel="noopener noreferrer">
              GitHub <ExternalArrow />
            </a>
          </div>
        </div>
      </header>

      <main id="content">
        <section className="hero sectionFrame" id="top">
          <div className="heroCopy">
            <div className="availability"><span className="statusDot" /> Открыт к предложениям</div>
            <p className="eyebrow">Данила Юрков · Москва · Backend / Python / AI Developer</p>
            <h1>Backend / Python / AI Developer</h1>
            <p className="heroLead">
              Проектирую backend и AI-системы — от API и данных до retrieval, agents и production-инфраструктуры.
            </p>
            <p className="heroStack">
              Python · TypeScript · Go · FastAPI · NestJS · PostgreSQL · Kafka · Docker · LLM · MCP · RAG
            </p>
            <div className="heroActions">
              <a className="button buttonPrimary" href="#projects">Проекты <span aria-hidden="true">↓</span></a>
              <a className="textLink" href="https://github.com/denfry" target="_blank" rel="noopener noreferrer">GitHub <ExternalArrow /></a>
              <a className="textLink" href="mailto:dabinayo@pm.me">Написать <ExternalArrow /></a>
            </div>
            <div className="proofStrip" aria-label="Проверяемые показатели codebase-index">
              <div className="proofItem">
                <strong>70%</strong>
                <span>Recall@3</span>
              </div>
              <div className="proofItem">
                <strong>~13×</strong>
                <span>less context</span>
              </div>
              <div className="proofItem">
                <strong>55k</strong>
                <span>LOC benchmark</span>
              </div>
              <p className="proofNote">Все три показателя относятся к benchmark codebase-index на одном Java repository.</p>
            </div>
          </div>

          <aside className="profileEditorial" aria-label="Профиль Данилы Юркова">
            <div className="portraitColumn">
              <span className="portraitLabel portraitLabelTop">PROFILE / 01</span>
              <div className="portraitFrame">
                <img
                  src="https://avatars.githubusercontent.com/u/63917857?v=4"
                  alt="Данила Юрков"
                  width="460"
                  height="460"
                />
              </div>
              <span className="portraitLabel portraitLabelBottom">Moscow · UTC+3</span>
            </div>
            <dl className="profileMeta">
              <div>
                <dt>Focus</dt>
                <dd>Backend / AI</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Moscow</dd>
              </div>
              <div>
                <dt>Work</dt>
                <dd>Full-time / Hybrid / Remote</dd>
              </div>
            </dl>
          </aside>
        </section>

        <div className="techRail" aria-label="Основной стек">
          <div className="sectionFrame techRailInner">
            <span>Primary tools</span>
            <span>Python</span>
            <span>TypeScript</span>
            <span>Go</span>
            <span>PostgreSQL</span>
            <span>Kafka</span>
            <span>MCP / RAG</span>
          </div>
        </div>

        <section className="sectionFrame sectionBlock projectsSection" id="projects">
          <div className="sectionIntro">
            <div>
              <p className="sectionKicker">01 / Selected work</p>
              <h2>Системы, которые можно разобрать</h2>
            </div>
            <p>
              Не витрина технологий. Каждый кейс показывает задачу, архитектуру, ограничение или измеримый результат.
            </p>
          </div>

          <div className="caseStudies">
            {PROJECTS.map((project) => (
              <article className={`caseStudy ${project.reverse ? 'caseStudyReverse' : ''}`} key={project.name}>
                <div className={`caseVisual caseVisual--${project.visual}`}>
                  <ProjectVisual project={project} />
                </div>
                <div className="caseBody">
                  <div className="caseMeta">
                    <span>{project.index}</span>
                    <span>{project.status}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p className="caseSummary">{project.summary}</p>
                  <p className="caseDescription">{project.description}</p>
                  {project.note && <p className="caseNote"><span>Evidence</span>{project.note}</p>}
                  <div className="caseStack">
                    {project.stack.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <ProjectLinks project={project} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="practiceBand" id="practice">
          <div className="sectionFrame sectionBlock">
            <div className="sectionIntro sectionIntroCompact">
              <div>
                <p className="sectionKicker">02 / Practice</p>
                <h2>Инженерная практика вне pet-проектов</h2>
              </div>
            </div>
            <div className="practiceList">
              <article className="practiceItem">
                <div className="practiceLabel"><span>01</span><span>Production / project work</span></div>
                <div>
                  <h3>Схема данных → API → эксплуатация</h3>
                  <p>Работаю со schema/data design, REST/API, интеграциями, миграциями, Docker, CI/CD, monitoring и debugging production issues.</p>
                </div>
              </article>
              <article className="practiceItem">
                <div className="practiceLabel"><span>02</span><span>Internal automation</span></div>
                <div>
                  <h3>Автоматизация внутренних процессов</h3>
                  <p>В рамках основной работы разработал приложение для работы с архивом документов и скрипты для рутинных операций с внешними информационными системами.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="sectionFrame sectionBlock workflowSection" id="workflow">
          <div className="sectionIntro">
            <div>
              <p className="sectionKicker">03 / AI-assisted engineering</p>
              <h2>AI ускоряет работу. Ответственность остаётся инженерной.</h2>
            </div>
            <p>Использую AI как инструмент исследования и реализации, а не как замену требованиям, архитектуре и проверке.</p>
          </div>
          <div className="workflowGrid">
            {WORKFLOW.map(([title, text]) => (
              <article className="workflowItem" key={title}>
                <span>{title}</span>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="workflowFootnote">Claude Code · Codex · research · implementation · refactoring · test generation · repository navigation</p>
        </section>

        <section className="sectionFrame sectionBlock stackSection" id="stack">
          <div className="sectionIntro sectionIntroCompact">
            <div>
              <p className="sectionKicker">04 / Technical matrix</p>
              <h2>Стек по зонам ответственности</h2>
            </div>
          </div>
          <div className="stackTable" role="table" aria-label="Технологический стек">
            {STACK.map(([area, tools]) => (
              <div className="stackRow" role="row" key={area}>
                <span role="cell">{area}</span>
                <span role="cell">{tools}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="sectionFrame contactSection" id="contact">
          <div className="contactRule">
            <p className="sectionKicker">05 / Contact</p>
            <div className="contactGrid">
              <h2>Ищу Backend / Python / AI Developer позиции.</h2>
              <div>
                <p>Интересны команды, где backend, данные и AI-системы нужно не только собрать, но и объяснить, проверить и довести до production.</p>
                <div className="contactLinks">
                  <a className="button buttonPrimary" href="mailto:dabinayo@pm.me">Email <ExternalArrow /></a>
                  <a className="textLink" href="https://t.me/denfry" target="_blank" rel="noopener noreferrer">Telegram <ExternalArrow /></a>
                  <a className="textLink" href="https://github.com/denfry" target="_blank" rel="noopener noreferrer">GitHub <ExternalArrow /></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="siteFooter sectionFrame">
        <span>© 2026 Данила Юрков</span>
        <span>Backend · Python · AI · Open Source</span>
        <a href="#top">Наверх ↑</a>
      </footer>
    </div>
  )
}
