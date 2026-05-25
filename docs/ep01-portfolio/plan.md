# Plan — ep01-portfolio

> Дата плана: 2026-05-25. Основа: [`docs/vision.md`](../vision.md) и [`docs/ep01-portfolio/research.md`](research.md). Это первый эпик — план фиксирует архитектурные паттерны для последующих эпиков (ep02-design-and-copy, ep03-content-and-launch).

---

## Step 1 — Project Definition

- **Project name (working)**: `svetik-design` (внутреннее имя репозитория). Публичное имя сайта — «Светлана Головина · дизайн интерьеров».
- **One-line description**: Статический сайт-портфолио начинающего дизайнера интерьеров с git-backed CMS для самостоятельного редактирования контента нетехническим автором.
- **MVP scope (этот эпик ep01)**:
  - Каркас Astro-сайта с 5 страницами: Главная / Работы (листинг + страница проекта) / About / Услуги / Контакты + `/admin` + 404.
  - 4 проекта с галереей и метаданными (год, тип, метраж) — на placeholder-фото до ретуши watermark.
  - Услуги — 3 управляемые карточки через CRUD (Полный проект / Авторский надзор / Консультации).
  - Контакты — 4 канала (Telegram личный, Telegram-блог, VK, max.me) + форма заявки → Cloudflare Worker → Telegram Bot + email копия.
  - Виджет «Последние из Telegram» (@Golovina_design_ambersoftloft) в подвале/на главной — статический RSS-парсинг при build.
  - Decap CMS на `/admin` с GitHub OAuth.
  - Базовая типографика и сетка (без финального визуального кода — это ep02).
  - Yandex.Metrica, sitemap, robots.txt, OG, Schema.org Person/самозанятость, 152-ФЗ cookie banner.
  - Деплой на Cloudflare Pages превью-поддомен `*.pages.dev` (без покупки собственного домена).
  - Артефакт эпика: [`docs/guide-for-svetlana.md`](../guide-for-svetlana.md) — гайд на русском (минимальная версия: админка + домены + миграция).
- **Out of scope (для ep01)**:
  - Финальный визуальный код, финальная типографическая система, moodboard-выбор (→ ep02).
  - Финальные тексты Hero/About/Services (→ ep02). На MVP — placeholder с явной пометкой.
  - Hero-фото — placeholder типографикой (→ ep02).
  - Один проект как pilot с полным контентом (→ ep02).
  - Регистрация собственного домена и миграция с `*.pages.dev` (→ ep03 по гайду).
  - Реальное наполнение проектами через админку сестрой (→ ep03).
  - Финальная ретушь watermark на проектных фото (внешняя зависимость — параллельный поток, не блокирует каркас).
  - EN-локализация, блог как раздел сайта, AR, booking-форма, личный кабинет, калькулятор стоимости.

---

## Cross-Epic Context

Первый эпик в проекте — фиксирует precedent для будущих. Прямых блокирующих зависимостей от sibling-эпиков нет (их пока нет).

### ep02-design-and-copy (следующий, не существует на момент плана)
- **Builds on (что унаследует от ep01)**: Astro-проект с готовой маршрутизацией; Decap-схема контента (collections `projects`, `services`, `pages`, `contacts`, `seo`); компонентная база (Layout, Header, Footer, ProjectCard, ImageGallery, ContactForm); design tokens заглушки в `tailwind.config.mjs` под замену; placeholder-Hero под замену; админка с заведёнными типами полей под все коллекции.
- **Blocking dependency**: ep02 не может стартовать, пока в ep01 не зафиксированы все content collections с финальным набором полей (год, тип, метраж, slug, gallery, description) — переименование полей задним числом ломает админку и контент сестры.
- **Conflicts with**: нет (ep02 не существует).
- **Locked choices (что ep01 закрывает за ep02)**: фреймворк (Astro), CSS (Tailwind), CMS (Decap), маршруты страниц, slug-структура, шрифтовая стратегия (self-host `.woff2`), типы и количество услуг (3, расширяемо), список контактов (4 канала). ep02 меняет визуальный язык (типографика, палитра, ритм, страница проекта как pilot), но НЕ архитектуру.

### ep03-content-and-launch (после ep02, не существует)
- **Builds on**: финальный визуальный код из ep02 + рабочую админку из ep01.
- **Blocking dependency**: ep03 требует, чтобы из ep01 был готов `docs/guide-for-svetlana.md` с разделами «как зарегистрировать домен» и «как мигрировать на свой домен с pages.dev».
- **Locked choices (что ep01 закрывает за ep03)**: CF Pages как хостинг (переезд возможен, но не предполагается); схема DNS-проксирования через CF; вариант резервного хостинга (Timeweb Cloud / Selectel) описан, но не реализован.

### Возможные будущие эпики (EN-локализация, блог, конструктор страниц)
- **Locked choices**: Astro i18n routing совместим без переделок; контент-коллекция `journal/*.md` добавляется в одну строку конфига — архитектура не блокирует.

Конфликтов не обнаружено.

---

## Step 2 — Constitution Additions

CLAUDE.md в проекте отсутствует — будет создан в Step 8 с полным набором принципов из `research.md` (Step 6, Принципы 1–7). План **не вводит дополнительных принципов сверх Constitution Draft** в research.md — там уже исчерпывающий набор для всех трёх эпиков.

Чтобы не дублировать, ниже список принципов с однострочным напоминанием:

1. **Копирайт уровня зрелого редактора, не нейросети** — личный голос, никаких штампов.
2. **Админка для нетехнического пользователя** — всё через WYSIWYG, никакого CLI/Markdown-знания.
3. **Lighthouse 95+ как пороговый CI-чек** — не пускаем коммит в main, если упало.
4. **Контент с тобой навсегда** — Markdown в Git, никаких SaaS-CMS.
5. **Бюджет нулевой по умолчанию** — любой layer >$5/мес требует обоснования.
6. **Простота сильнее красоты архитектуры** — меньше движущихся частей всегда выигрывает.
7. **Честность подачи** — концепт-проект называется концепт-проектом, junior говорит языком junior.

Полные формулировки с rationale войдут в CLAUDE.md (Step 8).

---

## Step 3 — Tech Stack (Final)

Все решения наследованы из `research.md` и Q&A 2026-05-25. Версии — текущие LTS на момент плана.

| Слой | Технология | Версия | Обоснование |
|---|---|---|---|
| Язык | TypeScript | 5.6+ | Стандарт для Astro; `strict: true` в `tsconfig`. |
| Фреймворк | Astro | 5.x (latest stable) | См. Key Decisions в research.md → "Astro вместо Next.js". |
| CSS | Tailwind CSS | 4.x (Vite plugin для Astro) | Стандарт, передаваемость, скорость для single-author стадии. |
| Шрифты | `@fontsource` (self-host) | latest | Никаких Google Fonts CDN — приватность + санкционная резильентность. Конкретные семейства (display + body) выбирает ep02; на ep01 — Inter + Fraunces как нейтральные заглушки. |
| CMS | Decap CMS | 3.x | Git-backed, MIT, $0 forever. Резерв — Keystatic (миграция MD→MD тривиальна). |
| Контент-валидация | Astro Content Collections + Zod | встроенно в Astro 5 | Zod-схема в `src/content.config.ts` — гарантирует, что админ не сломает структуру. |
| Изображения | Astro `<Image />` (sharp) | встроенно | Build-time AVIF/WebP/responsive sizes; оригиналы в `src/assets/projects/`. |
| Хостинг | Cloudflare Pages | free tier | Unlimited bandwidth, 500 builds/мес, превью-поддомен `*.pages.dev`. |
| Edge-функции | Cloudflare Workers | bound to CF Pages project | `/api/submit` для формы заявок. |
| Auth админки | Decap GitHub OAuth provider на CF Worker | sw-yx/netlify-cms-oauth-provider или аналог | Бесплатный OAuth proxy, ~30 строк JS. |
| Формы | Telegram Bot API + Яндекс SMTP | n/a | См. Key Decision research.md → "Telegram Bot для форм". |
| Аналитика | Yandex.Metrica | counter v2 | Тепловые карты + вебвизор, бесплатно, родная для РФ. |
| TG-виджет | Build-time парсинг `https://t.me/s/{channel}` через `linkedom` или `cheerio` | n/a | Telegram публикует канал как HTML на `t.me/s/...` — fetch + parse при сборке, рендерится статический блок последних 3–5 постов. Ноль клиентского JS. Источник не зависит от RSSHub/сторонних сервисов. См. Key Decisions ниже. |
| Build/Deploy | `git push main` → CF Pages автодеплой | n/a | Через 2–4 минуты на edge. |
| Линт/формат | ESLint + Prettier + `@astrojs/eslint-plugin` | latest | Базовый CI-гейт. |
| Тесты | Vitest (unit для утилит) + Playwright (e2e для формы и админки) | latest | Минимальный набор; Lighthouse CI как отдельный gate. |
| Lighthouse CI | `treosh/lighthouse-ci-action` в GitHub Actions | latest | Гарантирует Принцип 3. |
| Менеджер пакетов | pnpm | 9.x | Быстрее, чем npm; стабильный lockfile. |
| Node | Node.js LTS | 22.x | Соответствует CF Pages build env. |

### Версии явно не зафиксированные на этапе плана (берём latest stable на момент реализации)

- Astro CLI и интеграции: `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/check`, `@astrojs/mdx` (если потребуется для расширенного описания услуг — иначе не ставим).
- Decap CMS: ставим через CDN (`<script src="https://unpkg.com/decap-cms@^3.0.0/...`) — без node-зависимости в репо.

---

## Step 3.1 — Development Tooling (MCP)

В CLAUDE Code уже глобально доступны: GitHub, Context7.

**Дополнительно для этого проекта не нужно ничего.** Объяснение:
- Базы данных нет → DB MCP не нужен.
- Cloudflare-операции редкие (настройка проекта Pages, переменные среды) → удобнее через веб-консоль / wrangler CLI вручную, MCP не оправдан.
- Filesystem MCP не нужен (Claude уже имеет Read/Write/Edit).
- Browser MCP/Playwright MCP — отложить до ep02/ep03 (визуальная проверка может потребоваться при финальном дизайне; на этапе каркаса избыточно).

Запись об этом — для будущих эпиков, чтобы не возвращаться к вопросу.

---

## Step 4 — Project Structure

```
svetik-design/                    # repo root
├── .github/
│   └── workflows/
│       └── ci.yml                # lint + typecheck + lighthouse-ci on PR
├── public/
│   ├── admin/
│   │   ├── index.html            # Decap CMS shell
│   │   └── config.yml            # Decap collections схема
│   ├── images/
│   │   ├── projects/             # оригиналы фото (заливаются Decap'ом)
│   │   ├── about/                # фото автора
│   │   └── og/                   # OG-картинки по страницам
│   ├── fonts/                    # self-host .woff2
│   ├── robots.txt
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png      # 180×180, требует Lighthouse Best Practices
│   ├── _headers                  # CF Pages: CSP, X-Content-Type-Options, Permissions-Policy
│   └── humans.txt                # опционально, дань традиции
├── src/
│   ├── assets/                   # build-time изображения (компонентные)
│   │   └── placeholders/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Layout.astro      # root layout с meta/OG/schema
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── ManifestoBlock.astro
│   │   │   └── TelegramFeed.astro
│   │   ├── projects/
│   │   │   ├── ProjectCard.astro
│   │   │   ├── ProjectMeta.astro
│   │   │   └── ImageGallery.astro
│   │   ├── services/
│   │   │   └── ServiceCard.astro
│   │   ├── contact/
│   │   │   ├── ContactForm.astro
│   │   │   └── ContactChannels.astro
│   │   ├── seo/
│   │   │   ├── SchemaPerson.astro
│   │   │   └── MetaTags.astro
│   │   ├── ui/
│   │   │   ├── CookieBanner.astro    # 152-ФЗ согласие
│   │   │   └── Container.astro
│   │   └── analytics/
│   │       └── YandexMetrica.astro   # async, не блокирует
│   ├── content/
│   │   ├── projects/             # *.md проекты
│   │   │   ├── project-01.md
│   │   │   ├── project-02.md
│   │   │   ├── project-03.md
│   │   │   └── project-04.md
│   │   ├── services/
│   │   │   ├── full-design.md
│   │   │   ├── supervision.md
│   │   │   └── consulting.md
│   │   ├── pages/
│   │   │   ├── hero.md
│   │   │   ├── about.md
│   │   │   ├── services-intro.md
│   │   │   ├── contact-intro.md
│   │   │   └── privacy.md
│   │   └── settings/
│   │       ├── contacts.json     # 4 канала
│   │       └── seo.json          # глобальные SEO-настройки
│   ├── content.config.ts         # Zod-схемы коллекций (Astro Content Collections)
│   ├── lib/
│   │   ├── telegram-feed.ts      # парсинг RSS блога при build
│   │   ├── seo.ts                # утилиты OG/canonical/schema
│   │   └── format.ts             # дата, метраж
│   ├── pages/
│   │   ├── index.astro           # /
│   │   ├── works/
│   │   │   ├── index.astro       # /works
│   │   │   └── [slug].astro      # /works/{slug}
│   │   ├── about.astro           # /about
│   │   ├── services.astro        # /services
│   │   ├── contact.astro         # /contact
│   │   ├── privacy.astro         # /privacy (152-ФЗ policy)
│   │   ├── 404.astro
│   │   └── sitemap.xml.ts        # если @astrojs/sitemap не покрывает
│   ├── styles/
│   │   ├── global.css            # Tailwind + минимум кастомных utilities
│   │   └── tokens.css            # CSS custom properties (placeholder под ep02)
│   └── env.d.ts
├── workers/
│   └── submit/
│       ├── src/index.ts          # Telegram Bot proxy + SMTP
│       ├── wrangler.toml
│       └── README.md
├── tests/
│   ├── unit/
│   │   └── lib/
│   └── e2e/
│       ├── pages.spec.ts         # 200 на всех маршрутах
│       └── admin.spec.ts         # /admin загружается
├── docs/
│   ├── vision.md                 # уже существует
│   ├── guide-for-svetlana.md     # АРТЕФАКТ ЭПИКА — гайд сестре
│   ├── ep01-portfolio/
│   │   ├── research.md           # уже существует
│   │   ├── plan.md               # этот файл
│   │   ├── tasks.md              # создаст /my-tasks
│   │   └── log.md                # создаст /my-execute
│   └── adr/                      # опционально, для крупных архитектурных решений
├── .env.example                  # TELEGRAM_BOT_TOKEN, OWNER_CHAT_ID и т.д. (без значений)
├── .gitignore
├── .nvmrc                        # 22
├── .prettierrc.json
├── astro.config.mjs
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.mjs           # placeholder tokens
├── tsconfig.json
├── lighthouse.config.js          # бюджеты для CI
├── CLAUDE.md                     # создаётся в Step 8
└── README.md                     # для разработчика-преемника
```

### Назначения top-level директорий

- `public/` — статика, отдающаяся напрямую: админка Decap, оригиналы фото, шрифты, robots/favicon.
- `src/` — Astro-приложение: компоненты, контент (Markdown), маршруты, стили, утилиты.
- `src/content/` — единственный источник истины для всего контента сайта. Schema валидируется через `src/content.config.ts`.
- `workers/` — изолированные Cloudflare Workers (один на форму заявок). Собственный `wrangler.toml`, деплоится отдельно от CF Pages.
- `tests/` — unit (Vitest) и e2e (Playwright). Lighthouse CI отдельно через GitHub Actions.
- `docs/` — вся проектная документация: vision, гайды, эпики (research/plan/tasks/log).
- `.github/workflows/` — CI (lint + typecheck + Lighthouse CI).

---

## Step 5 — Data Model

Контент-сущности (Astro Content Collections, описаны в `src/content.config.ts`).

### Коллекция `projects` (4 записи на старте)

Файлы: `src/content/projects/*.md`

| Поле | Тип | Описание | Обязательно |
|---|---|---|---|
| `slug` | string | URL-сегмент (`/works/{slug}`). Slug = имя файла. | yes |
| `title` | string | Название проекта (например, «Квартира в Чертанове»). | yes |
| `year` | number (2020–2030) | Год концепта/реализации. | yes |
| `type` | enum | `apartment` / `house` / `studio` / `commercial`. UI лейблы локализованы. | yes |
| `area` | number | Метраж в м². | yes |
| `location` | string | Город (например, «Москва»). | no |
| `summary` | string (max 200) | Однопредложечная подача в карточке листинга. | yes |
| `concept` | markdown body | Короткая концепция 2–5 предложений (поле body). | yes |
| `cover` | image ref | Главное фото для карточки и OG. | yes |
| `gallery` | array of image refs | 3–10 фото в порядке отображения. | yes |
| `published` | boolean | Если false — не индексируется и не показывается в листинге. По умолчанию true. | yes |
| `isConcept` | boolean | Если true — на карточке и странице плашка «концепт-проект, фото в обработке». По умолчанию true (на старте все 4 — концепты); сестра снимает в админке по мере готовности ретуши и финальных текстов. | yes |
| `order` | number | Порядок сортировки в листинге (по убыванию). По умолчанию `year`. | no |
| `seo` | object {title?, description?, ogImage?} | Override стандартных meta. | no |

### Коллекция `services` (3 записи на старте, расширяемо)

Файлы: `src/content/services/*.md`

| Поле | Тип | Описание | Обязательно |
|---|---|---|---|
| `slug` | string | Идентификатор. | yes |
| `title` | string | Название (например, «Полный дизайн-проект»). | yes |
| `tagline` | string (max 120) | Подзаголовок-обещание. | yes |
| `description` | markdown body | Что входит, этапы. | yes |
| `order` | number | Порядок отображения. | yes |
| `published` | boolean | По умолчанию true. | yes |
| `priceNote` | string | Опционально (например, «от обсуждаемого бюджета»). | no |

### Коллекция `pages` (5 файлов)

`hero.md`, `about.md`, `services-intro.md`, `contact-intro.md`, `privacy.md`.

`privacy.md` — текст политики обработки ПДн под 152-ФЗ. Стартует как заглушка с явной пометкой «требует юридической вычитки перед публичным запуском». Редактируется сестрой через админку.

| Поле | Тип | Описание | Обязательно |
|---|---|---|---|
| `title` | string | Заголовок страницы (используется для `<title>` где применимо). | yes |
| `body` | markdown | Основной текст. | yes |
| `authorPhoto` | image ref | **Только для `about.md`**: фото автора (Принцип 2 — редактируется через админку). На других страницах поле игнорируется. | no |
| `seo` | object | Override meta. | no |

### Коллекция `settings`

`contacts.json` — единый источник для футера, страницы Контакты и schema.org:

```json
{
  "telegramPersonal": { "label": "Telegram", "handle": "@svgodesign", "url": "https://t.me/svgodesign", "primary": true },
  "telegramBlog": { "label": "Telegram-блог", "handle": "@Golovina_design_ambersoftloft", "url": "https://t.me/Golovina_design_ambersoftloft" },
  "vk": { "label": "VK", "handle": "vk.ru/sophiego", "url": "https://vk.ru/sophiego" },
  "maxMe": { "label": "max.me", "handle": "...", "url": "https://max.me/..." },
  "email": "...@yandex.ru",
  "telegramBlogRssUrl": "https://rsshub.app/telegram/channel/Golovina_design_ambersoftloft"
}
```

`seo.json` — глобальные SEO-настройки (siteName, siteUrl, defaultOgImage, twitterHandle если есть).

### Карта Decap-коллекций → файлы

| Decap collection (label в UI) | folder/file | Тип |
|---|---|---|
| «Проекты» | `src/content/projects/*.md` | folder |
| «Услуги» | `src/content/services/*.md` | folder |
| «Главная» | `src/content/pages/hero.md` | file |
| «О себе» | `src/content/pages/about.md` | file |
| «Услуги — вступление» | `src/content/pages/services-intro.md` | file |
| «Контакты — вступление» | `src/content/pages/contact-intro.md` | file |
| «Политика ПДн» | `src/content/pages/privacy.md` | file |
| «Контакты — каналы» | `src/content/settings/contacts.json` | file |
| «SEO» | `src/content/settings/seo.json` | file |

### Внешние источники данных

- **Telegram preview HTML** (TG-виджет): build-time fetch `https://t.me/s/Golovina_design_ambersoftloft` → парсинг `linkedom`/`cheerio` → top 3–5 постов (текст + первая картинка + дата + permalink) → статический HTML. Кешируется в build artifact. Fallback: если парсер падает (Telegram поменял вёрстку) или fetch timeout — рендерится блок «Читайте блог →» без ленты, билд не валится.
- **Telegram Bot API**: только в runtime воркера `/api/submit`. Не во фронте.

---

## Step 6 — Implementation Phases

Эпик разбит на 4 фазы. Каждая фаза заканчивается состоянием, которое можно показать сестре.

### Phase 1 — Foundation (репо, инструменты, локальный запуск)

**Deliverable**: `pnpm dev` поднимает Astro на `localhost:4321`, видна заглушка-главная с текстом «Site under construction», TypeScript и линт зелёные.

- [ ] Создать GitHub repo `svetik-design` (private, на аккаунте сестры или общем organization). Подключить как `origin`.
- [ ] `pnpm init`, поставить Node 22 (`.nvmrc`), pnpm 9.
- [ ] `pnpm create astro@latest .` с пресетом minimal + TypeScript strict.
- [ ] Добавить интеграции: `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/check`. (MDX — только если в процессе ep02 понадобится.)
- [ ] Tailwind 4 конфиг с базовыми токенами-заглушками (типографика placeholder, цвета placeholder под ep02).
- [ ] Self-host шрифтов через `@fontsource/inter` и `@fontsource/fraunces` (placeholder семейства).
- [ ] Базовый `Layout.astro` с meta/OG/canonical.
- [ ] Заглушка `index.astro` со словами «Каркас. Доделывается.»
- [ ] ESLint + Prettier конфиги, скрипты `lint`, `typecheck`, `format` в `package.json`.
- [ ] `.gitignore`, `.env.example`, `README.md` для разработчика-преемника.
- [ ] Первый commit, push в `main`.

### Phase 2 — Content Model & CMS (Decap admin работает локально и в облаке)

**Deliverable**: Сестра может зайти на `/admin` превью-сайта, залогиниться GitHub OAuth, создать/отредактировать тестовый проект — изменение попадает в репо и пересобирается на CF Pages.

- [ ] Описать Zod-схемы коллекций в `src/content.config.ts` (projects, services, pages, settings — всё из Step 5).
- [ ] Сидировать `src/content/` placeholder-контентом: 4 проекта с заглушка-фото из `Portfolio/1..4/` (watermark пока не убран — пометить `published: false` для проектов, не готовых к публичному показу; на ep01 показываем «как-есть» с явной плашкой «концепт-проект, рендер в работе»).
- [ ] Сидировать 3 услуги (тексты-заглушки в духе «полный проект включает …» — финальный копирайт делает ep02).
- [ ] Сидировать `contacts.json` с 4 каналами по research.md и `Contacts/Cont.txt`.
- [ ] Создать `public/admin/index.html` с Decap CDN-скриптом.
- [ ] Написать `public/admin/config.yml` — все коллекции с UI-лейблами на русском.
- [ ] Поднять Decap OAuth provider как Cloudflare Worker (`workers/oauth/`). Деплой на `*.workers.dev`. Создать GitHub OAuth App, прописать `client_id`/`client_secret` в Worker secrets.
- [ ] Прописать в `public/admin/config.yml`: `backend: { name: github, repo: ..., base_url: <worker-url> }`.
- [ ] Завести GitHub-аккаунт сестры (или пригласить в repo как collaborator) — закрывается до момента передачи в ep03.
- [ ] Локально проверить редактирование через Decap; убедиться, что schema-валидация Astro не падает на сохранённых файлах.

### Phase 3 — Pages, Components, Forms, Worker

**Deliverable**: Все 5 страниц рендерятся со связанным контентом из коллекций; форма заявки доходит до приватного Telegram-чата; виджет «Последние из Telegram» показывает 3 свежих поста; Yandex.Metrica подключена.

- [ ] `Header.astro` (минимальная навигация: Работы / About / Услуги / Контакты, лого-текст «Светлана Головина»).
- [ ] `Footer.astro` (4 канала, ссылка на политику ПДн, виджет «Последние из Telegram» опционально здесь, copyright + НПД самозанятая).
- [ ] `index.astro` (Hero placeholder с типографикой; ManifestoBlock — заглушка под ep02; ссылка «Смотреть работы → /works»; TelegramFeed внизу).
- [ ] `works/index.astro` — сетка из карточек ProjectCard (cover, title, year, type, area, summary).
- [ ] `works/[slug].astro` — генерируется `getStaticPaths()` из коллекции; ProjectMeta (год/тип/метраж/локация) + ImageGallery + concept (markdown body).
- [ ] `about.astro` — body из `pages/about.md` + место под фото автора + блок о дипломе (мягкая подача переподготовки).
- [ ] `services.astro` — `services-intro.md` body + рендер 3 ServiceCard сортированных по `order`.
- [ ] `contact.astro` — `contact-intro.md` body + ContactChannels (4 канала из `contacts.json`) + ContactForm.
- [ ] `404.astro` — лаконичный fallback.
- [ ] `CookieBanner.astro` — 152-ФЗ согласие (показывается до отправки формы / в первой сессии). Текст пишется юридически корректным языком.
- [ ] `YandexMetrica.astro` — async-loader, идентификатор счётчика через env (`PUBLIC_METRIKA_ID`); вешается в Layout.
- [ ] `SchemaPerson.astro` — JSON-LD Person + occupation «Дизайнер интерьеров», самозанятая НПД.
- [ ] `MetaTags.astro` — title/description/canonical/OG/twitter из `seo.json` + per-page override.
- [ ] `telegram-feed.ts` — fetch `https://t.me/s/Golovina_design_ambersoftloft` при build, parse через `linkedom`, селекторы по структуре превью-страницы Telegram (`.tgme_widget_message`), извлечь текст/картинку/дату/permalink для верхних 3–5 постов. На timeout/parse-error — вернуть пустой массив, не валить билд. Лог в build output. Юнит-тест на парсер по зафиксированному снапшоту HTML.
- [ ] `workers/submit/src/index.ts` — POST `/api/submit`, валидация (name/contact/message, honeypot, rate-limit per IP в Workers KV или просто in-memory с CF Cache API), TG `sendMessage` в OWNER_CHAT_ID, email через Яндекс SMTP (через NodeMailer-compatible или прямой SMTP).
- [ ] `workers/submit/wrangler.toml` — описаны переменные `TELEGRAM_BOT_TOKEN`, `OWNER_CHAT_ID`, `SMTP_USER`, `SMTP_PASS` (на ep01 значения не задаются — Worker отрабатывает в mock-режиме). Деплой на `submit.svetik-design.workers.dev`.
- [ ] Привязка формы в `ContactForm.astro` к Worker endpoint через переменную среды.

### Phase 4 — SEO, Performance, Deploy, Guide, Polish

**Deliverable**: Сайт на превью-домене `*.pages.dev`, Lighthouse CI зелёный (95+ по всем 4 метрикам на mobile), гайд для Светланы написан, README для разработчика готов.

- [ ] `sitemap.xml` через `@astrojs/sitemap` (только опубликованные).
- [ ] `robots.txt` (allow all, ссылка на sitemap).
- [ ] OG-картинка по умолчанию (типографическая, placeholder под ep02).
- [ ] Lighthouse CI workflow в `.github/workflows/ci.yml` с бюджетом 95 на каждой из 4 метрик; запускается на PR и push в main; блокирует merge при провале.
- [ ] Проверить image pipeline: оригиналы в `public/images/projects/{slug}/` → Astro `<Image />` отдаёт responsive AVIF/WebP в `dist/`.
- [ ] Привязать репо к Cloudflare Pages проекту, настроить build (`pnpm install --frozen-lockfile && pnpm build`), output `dist/`. Получить превью-URL `svetik-design.pages.dev`.
- [ ] Переменные среды в CF Pages: `PUBLIC_SITE_URL`, `PUBLIC_METRIKA_ID`, `PUBLIC_SUBMIT_URL` (URL Worker'а).
- [ ] Сделать первый продакшен-деплой, открыть превью-URL, прогнать Lighthouse вручную из РФ (либо запросить у сестры).
- [ ] Написать [`docs/guide-for-svetlana.md`](../guide-for-svetlana.md) — **расширенная версия**, состав по списку в Step 9 (введение / админка / ретушь watermark IOPaint / подготовка фото / копирайт / Telegram-бот заявок / Email-копия / домен / миграция на свой домен / резервный план).
- [ ] Написать `README.md` для разработчика-преемника: как поднять локально, где живёт что, как работает деплой.
- [ ] Финальная проверка: пройти весь сайт глазами, проверить, что админка работает в облаке, форма доходит до Telegram, виджет TG показывает посты.

---

## Step 7 — API / Interface Design

### Маршруты сайта

| URL | Назначение | Источник контента |
|---|---|---|
| `/` | Главная: Hero + manifesto + ссылка на работы + TG-виджет | `pages/hero.md`, RSS Telegram |
| `/works` | Листинг проектов (сетка 4 карточек) | коллекция `projects` |
| `/works/{slug}` | Страница проекта: meta + галерея + concept | `projects/{slug}.md` |
| `/about` | О себе: подход, диплом, фото | `pages/about.md` |
| `/services` | Услуги: 3 карточки | `pages/services-intro.md`, коллекция `services` |
| `/contact` | Контакты: 4 канала + форма | `pages/contact-intro.md`, `contacts.json` |
| `/privacy` | Политика обработки ПДн (152-ФЗ); ссылается из CookieBanner и формы | `pages/privacy.md` |
| `/admin/` | Decap CMS | static `public/admin/` |
| `/404` | Not found | static |
| `/sitemap.xml` | SEO | автогенерация |
| `/robots.txt` | SEO | static |

### Внешние API

#### POST `/api/submit` (Cloudflare Worker `submit`)

- **Body** (JSON): `{ name: string, contact: string, message: string, honeypot?: string }`
- **Validation**: все поля 1–500 chars; `contact` либо email-pattern либо TG-handle `@...`; `honeypot` должен быть пустым (если заполнен — silently return 200, не отправлять).
- **Rate-limit**: 5 запросов с одного IP за час (CF Cache API key или KV counter).
- **Side effects (последовательно)**:
  1. `sendMessage` через `https://api.telegram.org/bot{TOKEN}/sendMessage` в `OWNER_CHAT_ID` (значение проставляется позже — см. ниже).
  2. Email через SMTP (Яндекс) — копия владельцу.
- **Response**: 200 `{ ok: true }` при успехе; 400 при валидации; 429 при rate-limit; 5xx при сбое внешних служб.
- **CORS**: разрешён только с `PUBLIC_SITE_URL` origin.
- **Graceful-fail при незаполненных секретах**: на ep01 секреты `TELEGRAM_BOT_TOKEN`, `OWNER_CHAT_ID`, `SMTP_USER`, `SMTP_PASS` могут быть не заданы (заглушка). Если любого не хватает, Worker отвечает 200 `{ ok: true, mock: true }` и логирует факт в `console.warn` — фронт показывает «Заявка отправлена», сайт остаётся рабочим. Реальная настройка — после прочтения сестрой соответствующего раздела `guide-for-svetlana.md`.

### Админка `/admin/`

- **Auth**: GitHub OAuth через Decap proxy worker.
- **Operations**: CRUD по всем коллекциям Step 5.
- **Constraints**: схема Astro Content Collections + Decap field validation предотвращают невалидные значения.

### Виджет «Последние из Telegram»

- Не API. На build: `lib/telegram-feed.ts` → fetch RSS → parse → top 3–5 → embed в `TelegramFeed.astro`. Никакого клиентского JS.

---

## Step 8 — Update CLAUDE.md

Поскольку `CLAUDE.md` отсутствует, создаётся с нуля. Состав:

- Spine pointer на `docs/vision.md` (одна строка).
- `## Constitution (Immutable Principles)` — 7 принципов из Step 6 research.md, полные формулировки с rationale.
- `## Epics` — таблица с 3 эпиками roadmap'а.

Точный контент создаётся отдельным шагом в этом же эпике (см. файл `CLAUDE.md` в корне после исполнения /my-tasks).

---

## Step 9 — Open Questions (закрыто на Q&A 2026-05-25)

Все стратегические вопросы закрыты в research.md. Все операционные вопросы плана закрыты на Q&A 2026-05-25:

1. ✅ **GitHub account для репо.** Repo живёт на аккаунте бра́та, он же владеет OAuth App для Decap admin. Сестра подключается как collaborator позже, по необходимости.
2. ✅ **Ретушь watermark.** Self-host **IOPaint (LaMa/MAT)** локально, batch-обработкой. Делает бра́т или сестра по инструкции в `guide-for-svetlana.md`. Запасной вариант на 1–2 проблемных кадра — Cleanup.pictures онлайн. Не блокирует каркас ep01.
3. ✅ **OWNER_CHAT_ID.** На ep01 — заглушка (Worker отвечает 200 + warn-лог при отсутствии секрета). Полная инструкция «как завести бота, найти chat_id, прописать в CF Pages» — раздел в `guide-for-svetlana.md`. Реальная активация — сестрой при первом доступе или бра́том в момент передачи.
4. ✅ **Email-копия.** Поле в `contacts.json` стартует как `example@email.com` (заглушка), редактируется сестрой через админку. SMTP-секреты (`SMTP_USER`, `SMTP_PASS`) на ep01 не заданы — Worker отрабатывает без email-копии, заявка всё равно уходит в Telegram (когда настроено).
5. ✅ **TG-виджет источник.** Build-time парсинг публичной страницы `https://t.me/s/Golovina_design_ambersoftloft` через `linkedom`. Без RSSHub, без self-hosted сервисов, без клиентского iframe.
6. ✅ **GitHub OAuth Worker.** Делаем сразу — `workers/oauth/` собственным Cloudflare Worker'ом.
7. ✅ **Объём `guide-for-svetlana.md`.** Расширенный. Состав:
   - Введение: что такое сайт, как он устроен, где живёт сейчас.
   - **Админка**: как войти, как создать/отредактировать проект, как обновить тексты, услуги, контакты, SEO.
   - **Ретушь watermark (IOPaint)**: установка, batch-обработка папки, что делать с проблемными кадрами (Cleanup.pictures).
   - **Подготовка фото**: рекомендуемое разрешение, кроп, имена файлов, ориентация.
   - **Копирайт**: как писать о проекте (структура: что нашли, что хотели сохранить, какой материал стал центром); список запрещённых штампов из Constitution Принципа 1.
   - **Telegram-бот заявок**: как создать бота через @BotFather, найти `chat_id` (личный или групповой), прописать секреты в CF Pages dashboard.
   - **Email-копия**: как создать почту, получить пароль приложения для SMTP, прописать секреты.
   - **Домен**: что такое домен, рекомендация `golovinadesign.ru`, альтернативы (`golovina.design`, `svgodesign.ru`), регистрация в reg.ru за ~200₽/год, оплата с карты самозанятой.
   - **Миграция на свой домен**: пошагово CF Pages → Custom domains → DNS-настройка → проверка из РФ.
   - **Резервный план**: что делать, если CF Pages перестанет работать в РФ (краткое описание переезда на Timeweb Cloud).

---

## Step 10 — Key Decisions

> Эти решения сделаны на этапе планирования и могут быть пересмотрены при будущей переоценке. Constitution (выше) — иммутабельные правила; здесь — конкретные выборы с обоснованием.

### 2026-05-25 — Astro Content Collections + Zod как schema-источник
Context: контент пишется нетехническим автором через Decap; нужно гарантировать, что админка не создаст невалидный файл, ломающий билд.
Choice: использовать встроенный Astro Content Collections с Zod-валидацией (`src/content.config.ts`), параллельно описывая те же поля в `public/admin/config.yml` Decap.
Why: один источник истины для типов невозможен в архитектуре Decap (он не знает про Zod), но build-time валидация Astro поймает любое расхождение и упадёт раньше, чем CF Pages выкатит сломанный сайт. Альтернатива — runtime-валидация при чтении — приняли как лишнюю сложность для статического сайта.

### 2026-05-25 — Cloudflare Workers, не отдельный Node-сервер для формы
Context: форма заявок — единственный backend; нужен endpoint вне статики.
Choice: Cloudflare Worker под собственным `workers/submit/` каталогом, деплой через wrangler.
Why: free tier 100k requests/день — на порядки больше реалистичной нагрузки портфолио; нативная интеграция с CF Pages; нулевой downtime; не нужен VPS с pm2/systemd. Альтернатива — Vercel/Netlify Functions — отброшена по тем же причинам, что хостинг (см. research.md Key Decisions).

### 2026-05-25 — Build-time TG-виджет, не клиентский iframe Telegram
Context: главная и/или подвал показывают «Последние посты» @Golovina_design_ambersoftloft.
Choice: парсить RSS-feed канала при build-time и embed'ить статический HTML; никаких клиентских iframe/embed-скриптов Telegram.
Why: Принцип 3 (Lighthouse 95+) и Принцип 6 (простота) — Telegram embed-виджет тащит ~200KB JS и блокирует Performance; build-time pull добавляет 0 KB клиентского кода. Цена — лента обновляется не в реальном времени, а на каждом билде (~раз в день при ленивом обновлении контента сестрой) — для целевого пользователя сайта это незаметно.

### 2026-05-25 — Все 4 проекта стартуют как опубликованные с пометкой «концепт-проект»
Context: 4 проекта в Homestyler с watermark; ретушь идёт параллельно и может не успеть к концу ep01.
Choice: каждый проект публикуется с полем `published: true|false`; на ep01 показываем фотографии «как-есть» с явной плашкой «концепт-проект, фото в обработке» в карточке/на странице, при `published: false` — не индексируем и не показываем в листинге. По мере готовности ретуши сестра в админке переключает `published: true` без пометки.
Why: каркас сайта не должен зависеть от готовности фото (R1 в research.md). Альтернатива — показывать «Проекты — в работе» вообще без 4 карточек — оставляет сайт пустым и невыразительным даже на превью.

### 2026-05-25 — Lighthouse CI как блокирующий gate, не информационный
Context: Принцип 3 — Lighthouse 95+ заявлен как пороговое правило.
Choice: GitHub Actions workflow `lighthouse-ci.yml` запускается на PR и push в main; если любая из 4 метрик mobile < 95 → check fails → CF Pages не получает merge.
Why: «информационный» Lighthouse без блокировки гарантированно деградирует за 3 месяца — это эмпирический факт. Стоимость strict-gate — иногда нужно потратить время на оптимизацию перед merge. Это и есть смысл правила.

### 2026-05-25 — Decap config дублирует Zod-схему вручную, без code-gen
Context: разница между `content.config.ts` (Zod) и `admin/config.yml` (Decap fields) — два независимых описания одной модели.
Choice: поддерживать оба руками, синхронизировать при изменении схемы; не строить code-gen.
Why: 4 коллекции с ~5–10 полей каждая — это ~50 строк yaml + ~50 строк Zod, поддерживаемый объём. Code-gen из Zod в Decap config возможен (есть утилиты), но добавляет ещё один build-step и зависимость, ломаемую при апдейтах Decap. Принцип 6 — простота важнее DRY на этом масштабе.

### 2026-05-25 — TG-виджет через парсинг `t.me/s/{channel}`, не RSSHub
Context: нужен список свежих постов из @Golovina_design_ambersoftloft на сайте без клиентского JS.
Choice: build-time fetch публичной превью-страницы `https://t.me/s/Golovina_design_ambersoftloft` + парсинг через `linkedom` → статический HTML с топ-3..5 постами.
Why: Telegram сам отдаёт превью-страницу канала как HTML — никакой сторонней RSS-инфраструктуры (RSSHub публичный нестабилен; self-hosted — VPS за деньги, лишняя сложность). Меньше движущихся частей (Принцип 6). Источник «ломается» только если Telegram сменит вёрстку — тогда fallback на блок «Читайте блог →» без ленты, билд не падает.

### 2026-05-25 — IOPaint локально для ретуши watermark
Context: 4 проекта в Homestyler с watermark; нужно убрать перед публикацией; задача массовая, но повторяемая (watermark всегда в одном углу).
Choice: self-host IOPaint (LaMa/MAT) локально, batch-обработка папок. Запасной вариант для 1–2 сложных кадров — Cleanup.pictures онлайн.
Why: open-source MIT, бесплатно, batch из коробки, на однородных фонах (стена/пол — типовой Homestyler-фон) LaMa-модель почти безошибочна. Альтернативы (Photoshop Generative Fill, фрилансер с Kwork) — либо упираются в оплату из РФ, либо стоят денег и времени на координацию. IOPaint полностью укладывается в Принцип 5 (бюджет нулевой). Инструкция для сестры — раздел в `guide-for-svetlana.md`.

### 2026-05-25 — Worker формы и контакты — заглушки на ep01, активируются сестрой
Context: сестре в ep01 ещё не нужно вводить реальные секреты (бот, SMTP, email), но форма и страница «Контакты» уже должны существовать и быть демонстрабельны.
Choice: Worker `/api/submit` написан с проверкой наличия секретов — если их нет, отвечает 200 `{ ok: true, mock: true }` с warn-логом, не валится. `contacts.json` стартует с `email: "example@email.com"` как редактируемая болванка. Полная инструкция активации (создать @BotFather, найти chat_id, прописать секреты в CF Pages, создать почту, получить SMTP-пароль приложения) — отдельный раздел в `guide-for-svetlana.md`.
Why: разделяет «инфраструктура каркаса» (зона бра́та в ep01) и «персональные данные владельца» (зона сестры, делается перед запуском в ep03). Демонстрация сайта сестре не требует, чтобы заявки уже куда-то реально доходили. Альтернатива «не реализовывать форму до Q&A» — оставляет дыру в каркасе и риск, что в ep03 всплывут архитектурные сюрпризы. Альтернатива «вписать боевые секреты в ep01» — небезопасно и требует от бра́та владеть TG-аккаунтом сестры, чего избегаем.

### 2026-05-25 — Не вводим MDX в MVP
Context: Astro поддерживает MDX, в нём можно описывать услуги/проекты с компонентами внутри (callouts, custom blocks).
Choice: только чистый Markdown в MVP, MDX не подключаем.
Why: MDX усложняет редактирование в Decap (компоненты Decap не видит), увеличивает риск, что сестра напишет JSX-синтаксис, который сломает билд. Если в ep02 для страницы проекта понадобится расширенная структура — добавим в виде структурированных полей в коллекции, не в виде MDX.

---

## Step 11 — Save Plan

Этот файл сохранён в [`docs/ep01-portfolio/plan.md`](plan.md). CLAUDE.md создаётся отдельно (Step 8).
