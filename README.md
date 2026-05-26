# svetik-design

Сайт-портфолио дизайнера интерьеров. Статический Astro 6 + Tailwind 4,
контент в Markdown через Decap CMS, два Cloudflare Workers (OAuth proxy
для админки + Submit Worker для контактной формы), прод-деплой на
Cloudflare Pages.

Этот README — для разработчика, который будет поддерживать или развивать
проект. Конституция, бизнес-контекст и история эпиков —
[`CLAUDE.md`](CLAUDE.md) и [`docs/vision.md`](docs/vision.md). Гайд для
владельца контента — [`docs/guide-for-svetlana.md`](docs/guide-for-svetlana.md).

## Что нужно

- **Node 22 LTS** (CF Pages и CI прибиты к 22; локально работает и 24).
  В `.nvmrc` — `24`, можно переключить если nvm настроен. Если ставишь
  с нуля: `winget install OpenJS.NodeJS.LTS`.
- **pnpm 9** (`pnpm-lock.yaml` детерминирован под эту мажорную). Install:
  `npm install -g pnpm@9`. `corepack` на Windows без админ-прав не
  настраивается, npm-global-install чище.
- **wrangler ≥4** — только если будешь деплоить/изменять Workers
  (`workers/oauth/`, `workers/submit/`). Install: `npm install -g wrangler`,
  затем `wrangler login`.

## Локальный запуск

```powershell
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # сборка в dist/
pnpm preview  # просмотр сборки на http://localhost:4321
```

Для смоук-теста контактной формы локально нужен Submit Worker URL в
`.env` (создай файл — он gitignored):

```
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SUBMIT_URL=https://svetik-design-submit.svetik-design.workers.dev/api/submit
PUBLIC_METRIKA_ID=
```

Worker валидирует `Origin` против `PUBLIC_SITE_URL` (своего env), поэтому
для локального dev обычно проще не подключаться к проду — форма покажет
graceful-fallback «Отправка временно недоступна» при пустом
`PUBLIC_SUBMIT_URL` и не упадёт.

## Структура

```
src/
├── content/                # Markdown + JSON, источник истины контента
│   ├── projects/           # 4 проекта-концепта (project-01..04.md)
│   ├── services/           # 3 услуги (full-design / supervision / consulting)
│   ├── pages/              # 5 страничных текстов (hero / about / *-intro / privacy)
│   └── settings/           # contacts.json + seo.json (через glob+union)
├── content.config.ts       # Zod-схемы коллекций (Astro 6: import z from 'astro/zod')
├── assets/                 # картинки, оптимизируются через Astro <Image>
│   ├── projects/<slug>/    # cover.jpg + 01.jpg / 02.jpg / 03.jpg (минимум 3)
│   └── about/              # placeholder.jpg для authorPhoto
├── components/
│   ├── layout/             # Layout + Header + Footer
│   ├── home/               # Hero + ManifestoBlock + TelegramFeed
│   ├── projects/           # ProjectCard + ProjectMeta + ImageGallery
│   ├── services/           # ServiceCard
│   ├── contact/            # ContactChannels + ContactForm (vanilla JS, no React)
│   ├── seo/                # MetaTags + SchemaPerson (JSON-LD Person)
│   ├── analytics/          # YandexMetrica (consent-gated loader)
│   └── ui/                 # CookieBanner (no-flash, 152-ФЗ)
├── pages/                  # маршруты Astro: /, /works/, /works/[slug]/,
│                           # /about/, /services/, /contact/, /privacy/, /404
├── lib/                    # pure-utility, юнит-тестируемые без astro:content
│   ├── settings.ts         # getContacts() / getSiteSeo() — narrowing helpers для z.union
│   ├── telegram-feed.ts    # build-time парсер t.me/s/<channel> + санитизация
│   ├── sortProjects.ts     # сорт+фильтр для /works (extracted из .astro)
│   ├── seo.ts              # buildCanonical + absoluteOgImage (pure)
│   └── format.ts           # localeProjectType + formatArea + formatPostDate
└── styles/
    ├── global.css          # @import 'tailwindcss' + @import @fontsource*
    └── tokens.css          # @theme placeholder под ep02 (визуальный код)

public/
├── admin/                  # Decap CMS — статический shell (index.html + config.yml)
├── images/og/default.png   # OG-картинка по умолчанию (placeholder под ep02)
├── _headers                # CF Pages: CSP + 4 security headers, два scope'а
├── robots.txt              # allow + disallow /admin + sitemap link
├── favicon.svg + .ico + apple-touch-icon.png

workers/
├── oauth/                  # GitHub OAuth proxy для Decap (~110 строк TS)
│   ├── src/index.ts        # /auth + /callback handshake с decap-cms-lib-auth
│   ├── wrangler.toml       # name=svetik-design-oauth, account_id зашит
│   └── README.md           # инструкция деплоя
└── submit/                 # Контактная форма (~210 строк TS)
    ├── src/index.ts        # POST /api/submit: validate + rate-limit + TG + mock-mode
    ├── test/index.test.ts  # 26 vitest кейсов: happy / honeypot / rate-limit / CORS / XSS-escape
    └── wrangler.toml       # name=svetik-design-submit

tests/
├── unit/                   # vitest по src/lib/* (запускается `pnpm test`)
└── e2e/                    # Playwright (запускается `pnpm test:e2e`)

.github/workflows/ci.yml    # 5 status checks: lint, typecheck, test, lighthouse, e2e
.lighthouserc.json          # 95+ бюджет на 7 публичных маршрутах (mobile preset)
playwright.config.ts        # chromium Desktop + iPhone 13 webkit, 2 workers
astro.config.mjs            # tailwind 4 vite plugin + sitemap filter + dev admin-index shim
vitest.config.ts            # root config, ловит и src/, и workers/*/test/
eslint.config.js            # flat config: @eslint/js + typescript-eslint + plugin-astro
```

## Quality gates

```powershell
pnpm lint        # ESLint flat config + plugin-astro
pnpm format      # Prettier (+ prettier-plugin-astro)
pnpm typecheck   # astro check (purpose-built для .astro)
pnpm test        # vitest (src/lib + workers/*/test, 69 кейсов)
pnpm test:e2e    # Playwright (tests/e2e/, builds + serves dist/ once, 22 кейса)
pnpm build       # астро билд в dist/
```

E2E использует `@playwright/test` с двумя проектами (`chromium` Desktop +
`mobile-safari` iPhone 13 webkit). Браузеры ставятся отдельно от
npm-зависимостей — один раз локально через
`pnpm exec playwright install chromium webkit`. В CI job `e2e` делает то
же самое с флагом `--with-deps` (ставит OS-libs Ubuntu).

## Деплой

**Pages**: автоматом при push в `main`. Cloudflare Pages-проект
`svetik-design` подключён к репозиторию, build command
`pnpm install --frozen-lockfile && pnpm build`, output `dist/`,
Node 22. Превью на `https://svetik-design.pages.dev`. Каждый PR получает
свой preview-URL `<hash>.svetik-design.pages.dev`.

**Workers**: руками через wrangler.

```powershell
cd workers/submit
wrangler deploy

cd ../oauth
wrangler deploy
```

Изменения в коде Worker'а вступают сразу после `wrangler deploy`
(никакого автодеплоя из git нет — это сознательно, чтобы случайный push
не уронил OAuth для админки).

**Секреты** (никогда не коммитятся):

- `workers/oauth/`: `OAUTH_CLIENT_SECRET` (GitHub OAuth App secret).
  Client ID — публичный, лежит в `wrangler.toml#vars`.
- `workers/submit/`: `TELEGRAM_BOT_TOKEN`, `OWNER_CHAT_ID`, `SMTP_USER`,
  `SMTP_PASS`. При отсутствии любого Worker уходит в mock-mode (200
  `{ok:true, mock:true}` + `console.warn('[mock]')`), фронт показывает
  «Заявка отправлена» — graceful no-op.

Постановка секрета: `wrangler secret put <NAME>` в директории Worker'а.

**Env vars CF Pages** (Settings → Environment variables, Production и
Preview): `NODE_VERSION=22`, `PUBLIC_SITE_URL`, `PUBLIC_METRIKA_ID`
(может быть пустым — YandexMetrica.astro no-op'ит), `PUBLIC_SUBMIT_URL`.

## Куда смотреть при поломке (3 самые ломкие точки)

### 1. Decap admin (`/admin/`)

Симптом: на `/admin/` пусто / login зацикливается / коллекция показывает
«invalid frontmatter» при сохранении.

Где искать:

- `public/admin/config.yml` — Decap-сторона схемы. Должна быть
  синхронизирована **руками** с `src/content.config.ts` (два независимых
  описания модели). Если добавил поле в Zod — добавь widget в `config.yml`.
- `workers/oauth/src/index.ts` — handshake echo строка. Реальный протокол
  decap-cms-lib-auth: opener эхо-отвечает `'authorizing:github'`. Если
  popup закрывается, но opener не получает токен — проверь именно эту
  литералу (был баг в первой версии, см. log.md 2026-05-26 T12 fix).
- GitHub OAuth App `svetik-design admin` (Developer Settings → OAuth Apps,
  на аккаунте `pavloboss87-stack`). `Authorization callback URL` должен
  совпадать с реальным деплоем OAuth Worker'а
  (`https://svetik-design-oauth.svetik-design.workers.dev/callback`).
- `astro.config.mjs` — dev-only Vite plugin `serveAdminIndexInDev`. Без
  него `pnpm dev` отдаёт `/admin/` как 404 (Astro/Vite quirk: `public/<dir>/index.html`
  не резолвится по trailing-slash в dev-сервере). На `pnpm preview` и
  CF Pages работает нативно.

### 2. Контактная форма (`/contact` → Submit Worker)

Симптом: форма показывает «Не удалось отправить» / CORS-блок в Network /
заявки не приходят в Telegram.

Где искать:

- `PUBLIC_SUBMIT_URL` в env (`.env` локально или CF Pages env). Должен
  быть полным URL с `/api/submit`. Если пустой — фронт пишет «Отправка
  временно недоступна», `console.error` подсказывает причину.
- `workers/submit/wrangler.toml` — `[vars] PUBLIC_SITE_URL` должен
  совпадать с реальным origin'ом, который шлёт запрос. Если поменялся
  домен — обнови, передеплой. CORS-блок виден в DevTools Network как
  403 с пустым `access-control-allow-origin`.
- Секреты в Worker'е (см. «Деплой»). Если в логах `wrangler tail` видишь
  `[mock]` — секреты не выставлены, Worker отвечает 200, но в Telegram
  никуда не идёт.
- Rate-limit: 5 запросов в час с одного IP, in-memory Map per-isolate.
  Если IP попал в лимит, ответ 429 `{ok:false, error:'rate_limit'}`. Лечится
  ожиданием часа или передеплоем Worker'а (свежий isolate = пустой Map).
- `consent: true` в payload — обязательно. Без него Worker возвращает
  400 `consent_required` (Принцип ПДн — явное согласие, см.
  Constitution №2).

### 3. Telegram-виджет (TelegramFeed на главной)

Симптом: на `/` нет ленты постов или fallback «Свежие записи — в
Telegram-блоге».

Где искать:

- `src/lib/telegram-feed.ts` — селекторы под `t.me/s/<channel>`
  (`.tgme_widget_message`, `.tgme_widget_message_text`,
  `.tgme_widget_message_date a[href]`, `.tgme_widget_message_date time[datetime]`,
  `.tgme_widget_message_photo_wrap[style*=background-image]`). Если
  Telegram сменил вёрстку — `parseFeedHtml` вернёт пустой массив, билд
  не падает, страница рендерит fallback. Чинить — найти актуальные
  селекторы через DevTools на живой странице и обновить.
- `https://t.me/s/<channel>` фетчится с **build**-таймом (не runtime).
  Если CF Pages runner в момент билда не достучался до Telegram (rate-limit,
  блок) — на превью пусто до следующего билда. Обычно лечится через
  «Retry deployment» в CF dashboard.
- `linkedom` — единственный парсер; не пересаживайся на `cheerio`/`jsdom`,
  они весят в разы больше. Если parse-баг — посмотри юнит-тесты в
  `tests/unit/lib/telegram-feed.test.ts`, добавь свой кейс по
  актуальному snapshot HTML.
- CSP `img-src` должен содержать `*.telesco.pe` (телеграм CDN).
  Если посты есть, но картинок нет — открой Network, посмотри CSP-block
  в Console. Лечится правкой `public/_headers` (см. ниже).

## Branch protection setup (Принцип 3 enforcement)

Lighthouse-бюджет 95+ работает как информационный, пока GitHub не
запрещает прямой push в `main` и merge PR с красными checks. Включается
руками владельца репозитория один раз через GitHub UI:

1. Откройте репозиторий → **Settings → Branches → Add branch protection rule**.
2. **Branch name pattern**: `main`.
3. Поставьте галочки:
   - **Require a pull request before merging** → внутри: **Require approvals = 0**
     (один автор работает в проекте — review-обязательность только мешает; merge
     остаётся за владельцем).
   - **Require status checks to pass before merging** → **Require branches to be
     up to date before merging**.
   - В поле **Status checks that are required** добавьте: `lint`, `typecheck`,
     `test`, `lighthouse`, `e2e`. (Имена должны совпадать с `name:` job'ов из
     [`ci.yml`](.github/workflows/ci.yml).)
   - **Do not allow bypassing the above settings** (включая admins) — оставьте
     включённым, иначе любой `git push origin main --force` от админа обнуляет
     enforcement.
4. **Create** / **Save changes**.
5. Проверка: `git push origin main` напрямую (без PR) должен отвергаться
   GitHub'ом с сообщением `Protected branch update failed`.

Если защиту нужно временно снять (миграции, ручные исправления) — выключайте
только конкретное правило, не удаляйте всю rule. После — включите обратно.

## CSP при добавлении нового сервиса

`public/_headers` содержит CSP в двух scope'ах — `/admin/*` (ослабленная,
под Decap) и `/*` (строгая, под публичные страницы). Если добавляешь
**новый внешний домен** (CDN, аналитика, embed, шрифты, image-host) —
обнови соответствующую директиву.

| Что добавляешь                        | Куда правка в CSP `/*` блока                                    |
| ------------------------------------- | --------------------------------------------------------------- |
| Внешний JS (например, виджет чата)    | `script-src` + домен скрипта                                    |
| Внешние картинки (другой CDN)         | `img-src` + домен (или `*.example.com` для wildcard)            |
| Внешние шрифты (если уйдёт self-host) | `font-src` + домен                                              |
| Внешний API (fetch из браузера)       | `connect-src` + домен                                           |
| Внешняя форма (вместо `/api/submit`)  | `form-action` + домен                                           |
| Iframe-embed (карта, видео)           | `frame-src` + домен (сейчас не задан → ничего нельзя embed'ить) |

Правило для admin-scope (`/admin/*`) — то же, но scope отдельный, потому
что Decap нужны `unsafe-eval` + `unpkg.com` + GitHub API, которых публичной
части давать не надо.

Inline-скрипты (`<script is:inline>` в Astro-компонентах) сейчас разрешены
через `'unsafe-inline'` в `script-src` — это осознанный compromise (см.
log.md 2026-05-26 T24a). Если будешь tighten'ить — переходи на nonce-based
CSP, для этого нужен SSR (а у нас static), либо runtime через CF Worker
middleware. Пока инлайн-payload меняется от правки к правке
(YandexMetrica ID + текст CookieBanner) — hash-based CSP нерабочий.

После любой правки `_headers`:

1. Локально проверь синтаксис: `pnpm build`, `dist/_headers` должен
   быть точной копией исходника.
2. Деплой через push в main.
3. На превью: `curl.exe -I https://svetik-design.pages.dev/` — должен
   вернуть обновлённый CSP в `content-security-policy:`.
4. В DevTools Console на каждом затронутом маршруте — 0 CSP-violations.

## CI

GitHub Actions workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
запускается на каждый PR и push в `main`. Пять job'ов — каждый отдельный
status-check в GitHub UI:

- `lint` — `pnpm lint` + `pnpm format:check`.
- `typecheck` — `pnpm typecheck` (`astro check`).
- `test` — `pnpm test` (vitest по `src/lib/` и `workers/*/test/`).
- `lighthouse` — `pnpm build` + `treosh/lighthouse-ci-action@v12` против
  `dist/` через встроенный static-сервер. Бюджет — `categories:{performance,
accessibility, best-practices, seo} ≥ 0.95` (mobile preset по умолчанию)
  на 7 публичных маршрутах. Конфиг — [`.lighthouserc.json`](.lighthouserc.json).
- `e2e` — Playwright против реального `pnpm build && pnpm preview` под двумя
  проектами (chromium Desktop + iPhone 13 webkit). Покрывает 7 маршрутов +
  404, /admin/, форму (happy + negative). Конфиг — [`playwright.config.ts`](playwright.config.ts).

Имена job'ов важны — они должны совпадать с required-checks в branch
protection. Если переименуешь job в YAML — обнови protection rule, иначе
silent pass всех PR.

## Документация

- [docs/vision.md](docs/vision.md) — продуктовый и архитектурный обзор.
- [docs/ep01-portfolio/plan.md](docs/ep01-portfolio/plan.md) — план эпика, decisions, data model.
- [docs/ep01-portfolio/tasks.md](docs/ep01-portfolio/tasks.md) — task list + Definition of Done.
- [docs/ep01-portfolio/log.md](docs/ep01-portfolio/log.md) — execution log: что было сделано, что не вышло, почему такое решение.
- [docs/ep01-portfolio/research.md](docs/ep01-portfolio/research.md) — рисёрч-фаза (стэк, риски, free tier).
- [docs/guide-for-svetlana.md](docs/guide-for-svetlana.md) — гайд по админке для владельца контента.
- [docs/guide-for-svetlana-activation.md](docs/guide-for-svetlana-activation.md) — чек-лист активации перед публичным запуском (13 пунктов).
- [CLAUDE.md](CLAUDE.md) — Constitution (immutable principles) + Epics index.
- [progress.md](progress.md) — codebase patterns, docs debt, follow-ups.
