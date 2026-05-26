# Tasks — ep01-portfolio

> Источник: [`docs/ep01-portfolio/plan.md`](plan.md). Дата декомпозиции: 2026-05-25 (обновлено по итогам `/my-review` той же датой). Декомпозиция в гранулярные задачи под `/my-execute`. Каждая задача — атомарна, тестируема, укладывается в одну сессию Claude (~15–60 мин).

---

## Definition of Done (применяется к каждой задаче)

Задача не считается закрытой, пока не выполнены ВСЕ пункты ниже. Если какой-то пункт нерелевантен для задачи (например, в setup-задаче нет копирайта), он явно отмечается «n/a» в коммите/логе.

- [ ] Acceptance criteria из брифа задачи выполнены.
- [ ] `pnpm build` зелёный (нет ошибок).
- [ ] `pnpm typecheck` (`pnpm astro check`) зелёный.
- [ ] `pnpm lint` зелёный (нет новых warnings).
- [ ] Тесты из секции «Tests required» написаны/обновлены и проходят (`pnpm test` и/или `pnpm test:e2e`).
- [ ] Если задача меняет UI или маршруты — локально открыт `pnpm dev`, прокликан golden path в браузере; Lighthouse mobile на затронутой странице ≥ 95 по 4 метрикам (или зафиксирован знак ниже — почему).
- [ ] Если задача добавляет/меняет копирайт — `grep` по словарю штампов из Constitution Принципа 1 пусто (`уют и функциональность`, `стиль и комфорт`, `дом мечты`, `создаём пространства`, `не просто X, а Y`, и др.).
- [ ] Если задача добавляет admin-editable контент — соответствующее поле есть в `public/admin/config.yml`, и схема Zod в `src/content.config.ts` валидирует.
- [ ] Commit с сообщением, ссылающимся на task ID (формат: `ep01 T## <короткое описание>`).
- [ ] Progress Tracker в этом файле обновлён (чекбокс отмечен).

---

## Task List

### [T01] Bootstrap repo + Astro minimal + TS strict
- **Phase**: Phase 1 — Foundation
- **Type**: setup
- **Depends on**: none
- **Input**: пустой репо без кода (есть только `CLAUDE.md`, `docs/`, `Portfolio/`, `Contacts/`, `Diplom/`).
- **Output**:
  - Создан GitHub repo `svetik-design` (private, аккаунт бра́та), `origin` подключён локально.
  - `pnpm-workspace.yaml` НЕ создаём (моно-репо не нужно).
  - `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (минимальная заглушка).
  - `.nvmrc` (содержимое: `22`).
  - Первый commit + push в `main`.
- **Acceptance criteria**:
  - [ ] `pnpm install` в чистом клоне репо проходит без ошибок.
  - [ ] `pnpm dev` поднимает Astro на `localhost:4321`, видна заглушка-главная.
  - [ ] `pnpm build` создаёт `dist/` без ошибок.
  - [ ] `tsconfig.json` использует пресет `astro/tsconfigs/strict`.
  - [ ] `git remote -v` показывает `origin` GitHub.
- **Tests required**:
  - [ ] Ручная проверка: `pnpm dev` → открыть `localhost:4321` → видна заглушка.
  - [ ] Ручная проверка: `pnpm build` без ошибок.
- **Constitution check**: №6 (простота — minimal preset, без лишних зависимостей).
- **Implementation notes**:
  - Команды: `pnpm create astro@latest .` с флагами `--template minimal --typescript strict --no-install --no-git`, затем `pnpm install`.
  - Не подключать на этом этапе интеграции — это T02.
  - `Portfolio/`, `Contacts/`, `Diplom/`, `docs/`, `CLAUDE.md` уже в репо — НЕ удалять.
  - На Windows / PowerShell: `pnpm create astro@latest .` работает напрямую.

---

### [T02] Astro integrations (Tailwind 4 + sitemap + check) и токены-заглушки
- **Phase**: Phase 1 — Foundation
- **Type**: setup
- **Depends on**: T01
- **Input**: чистый Astro-проект из T01.
- **Output**:
  - Установлены `@tailwindcss/vite` (Tailwind 4) + `@astrojs/sitemap` + `@astrojs/check`.
  - `astro.config.mjs` — подключён tailwind vite-plugin, sitemap, site URL (placeholder `https://svetik-design.pages.dev`).
  - `src/styles/global.css` с `@import "tailwindcss";` + `tailwind.config.mjs` с минимальным контент-глобом.
  - `src/styles/tokens.css` — пустой плейсхолдер под ep02 (комментарий «design tokens — ep02»).
- **Acceptance criteria**:
  - [ ] `pnpm astro check` проходит без ошибок.
  - [ ] `pnpm build` создаёт `dist/sitemap-index.xml`.
  - [ ] В index.astro можно применить `class="text-2xl"` и стиль применился.
- **Tests required**:
  - [ ] Проверка `pnpm astro check` зелёный.
  - [ ] Проверка применения Tailwind-класса в браузере.
- **Constitution check**: №3 (Tailwind как стандарт для скорости/портабельности), №6 (один CSS-стэк, без styled-components/CSS-in-JS).
- **Implementation notes**:
  - Tailwind 4 в Astro — через Vite plugin (`@tailwindcss/vite`), не `@astrojs/tailwind` (deprecated).
  - `site:` в `astro.config.mjs` обязательно — иначе sitemap не сгенерируется.

---

### [T03] Self-host шрифты Inter + Fraunces через @fontsource
- **Phase**: Phase 1 — Foundation
- **Type**: setup
- **Depends on**: T02
- **Input**: Astro + Tailwind из T02.
- **Output**:
  - Установлены `@fontsource/inter` и `@fontsource-variable/fraunces`.
  - `src/styles/global.css` — `@import '@fontsource-variable/fraunces';` и `@import '@fontsource/inter/400.css';` `'inter/500.css'` `'inter/600.css'`.
  - В `tailwind.config.mjs` — `theme.extend.fontFamily` с `sans: ['Inter', ...]`, `display: ['"Fraunces Variable"', ...]`.
- **Acceptance criteria**:
  - [ ] При билде шрифты упаковываются в `dist/_astro/`, не запрашиваются с CDN.
  - [ ] `class="font-display"` применяет Fraunces, `class="font-sans"` — Inter.
- **Tests required**:
  - [ ] DevTools Network: после билда нет запросов к `fonts.googleapis.com` или `fonts.gstatic.com`.
- **Constitution check**: №3 (Lighthouse — self-host даёт лучший LCP), №4 (никаких внешних CDN для контента).
- **Implementation notes**:
  - Заглушка под ep02 — там семейства могут поменяться, важно зафиксировать сам паттерн self-host.

---

### [T04] Базовый Layout.astro со скелетом meta/OG/canonical
- **Phase**: Phase 1 — Foundation
- **Type**: ui
- **Depends on**: T02
- **Input**: Astro + Tailwind из T02.
- **Output**:
  - `src/components/layout/Layout.astro` с props `{ title, description, ogImage?, canonical? }`.
  - Структура `<!DOCTYPE html><html lang="ru"><head>...</head><body><slot /></body></html>`.
  - В `<head>`: charset, viewport, title, meta description, og:title/description/image/url, canonical, theme-color, **link rel=icon (svg+ico), link rel=apple-touch-icon**.
  - `src/pages/index.astro` использует Layout с заглушка-текстом «Каркас. Доделывается.».
  - В `public/`: `favicon.svg` (монограмма «СГ» или временная типографическая заглушка), `favicon.ico` (32×32), `apple-touch-icon.png` (180×180). Можно сгенерировать вручную или через realfavicongenerator.net (без аккаунта).
- **Acceptance criteria**:
  - [ ] `view-source` на главной показывает корректные meta-теги.
  - [ ] Если передать `ogImage="https://example/x.png"` — он попадает в `og:image`.
  - [ ] `lang="ru"` присутствует.
  - [ ] `curl -I http://localhost:4321/favicon.svg` → 200; то же для `/favicon.ico` и `/apple-touch-icon.png`.
  - [ ] В Lighthouse Best Practices нет ошибок «No favicon» / «No apple-touch-icon».
- **Tests required**:
  - [ ] Ручная проверка `view-source` главной страницы.
  - [ ] Проверка в Chrome DevTools → Application → Manifest/Icons — все три иконки видны.
- **Constitution check**: №3 (SEO/Best Practices 95+ — favicon обязателен), №7 (никаких «delivering excellence» — заглушка нейтральная).
- **Implementation notes**:
  - SEO-логика «откуда брать title, что если не задан» — здесь не финализируется (это T22, MetaTags-компонент). Тут — только skeleton.
  - Финальная иконка/монограмма — задача ep02 (визуальный код). На ep01 — нейтральная заглушка, важна только техническая корректность.

---

### [T05] ESLint + Prettier + npm-скрипты
- **Phase**: Phase 1 — Foundation
- **Type**: setup
- **Depends on**: T01
- **Input**: проект из T01.
- **Output**:
  - `eslint.config.js` (flat config) с `eslint-plugin-astro` и базовыми правилами.
  - `.prettierrc.json` (singleQuote, trailingComma all, printWidth 100, plugins: prettier-plugin-astro).
  - В `package.json` скрипты: `dev`, `build`, `preview`, `lint` (`eslint .`), `lint:fix`, `format` (`prettier --write .`), `typecheck` (`astro check`).
- **Acceptance criteria**:
  - [ ] `pnpm lint` — зелёный на чистом скелете.
  - [ ] `pnpm format` — переформатировал без изменения смысла.
  - [ ] `pnpm typecheck` — зелёный.
- **Tests required**:
  - [ ] Создать `.astro`-файл с ошибкой синтаксиса → `pnpm typecheck` падает.
- **Constitution check**: №6 (стандартный, не самодельный stack).
- **Implementation notes**:
  - Можно параллелить с T02/T03/T04 — независимая работа.

---

### [T06] Repo hygiene — .gitignore, .env.example, README-скелет
- **Phase**: Phase 1 — Foundation
- **Type**: docs
- **Depends on**: T01
- **Input**: проект из T01.
- **Output**:
  - `.gitignore` — `node_modules/`, `dist/`, `.astro/`, `.env`, `.env.local`, `.DS_Store`, `.vscode/`, `coverage/`, `playwright-report/`, `test-results/`.
  - `.env.example` — `PUBLIC_SITE_URL=`, `PUBLIC_METRIKA_ID=`, `PUBLIC_SUBMIT_URL=` (без значений, с комментариями назначения).
  - `README.md` — короткий скелет: prereqs (Node 22, pnpm 9), команды (`pnpm install`, `pnpm dev`, `pnpm build`), ссылка на `docs/vision.md` и `docs/guide-for-svetlana.md`.
- **Acceptance criteria**:
  - [ ] `git status` после `pnpm dev` не показывает `node_modules/`, `dist/`, `.astro/`.
  - [ ] `.env.example` существует, реальный `.env` отсутствует в репо.
  - [ ] `README.md` читается за 30 секунд и достаточен для запуска у разработчика-преемника.
- **Tests required**:
  - [ ] Проверка `git check-ignore node_modules` возвращает ignored.
- **Constitution check**: №6 (только минимально нужное).
- **Implementation notes**:
  - README полная версия — в T29. Здесь — минимум, чтобы можно было поднять.

---

### [T07] Zod-схемы контент-коллекций (src/content.config.ts)
- **Phase**: Phase 2 — Content Model & CMS
- **Type**: data
- **Depends on**: T02
- **Input**: Astro 5 с content collections support.
- **Output**:
  - `src/content.config.ts` с `defineCollection` для `projects`, `services`, `pages`, `settings`.
  - Поля строго по [`plan.md` Step 5](plan.md):
    - **projects**: slug (проверяется по имени файла), title, year 2020–2030, type enum, area, location?, summary max 200, cover image, gallery min(3), published default(true), **isConcept default(true)** — флаг плашки «концепт-проект», order?, seo?.
    - **services**: slug, title, tagline max 120, description (body), order, published default(true), priceNote?.
    - **pages**: title, body, **authorPhoto?: image()** (используется только для `about.md`), seo?.
    - **settings**: contacts.json + seo.json через `file()` loader.
- **Acceptance criteria**:
  - [ ] `pnpm typecheck` зелёный.
  - [ ] `getCollection('projects')` в любой странице компилируется и типизируется.
  - [ ] Попытка положить .md без обязательного поля → `pnpm build` падает с понятной ошибкой.
- **Tests required**:
  - [ ] Создать тестовый .md без `title` → проверить, что билд падает.
  - [ ] Удалить тестовый файл после проверки.
- **Constitution check**: №2 (валидация защищает админа от поломок), №4 (Markdown в репо).
- **Implementation notes**:
  - Astro 5 — `loader` API: `glob()` для папок, `file()` для одиночных JSON.
  - Type enum: `z.enum(['apartment', 'house', 'studio', 'commercial'])`.
  - `image()` schema-helper из `astro:assets` для ссылок на картинки (используется и в `projects.cover/gallery`, и в `pages.authorPhoto`).
  - `isConcept` — обязательное поле с дефолтом `true`. Сестра в админке снимает галочку, когда фото отретушировано и тексты финальны. Логика плашки на UI — в T17/T18.

---

### [T08] Сидирование 4 проектов + placeholder-фото
- **Phase**: Phase 2 — Content Model & CMS
- **Type**: data
- **Depends on**: T07
- **Input**: схема из T07; реальные исходники в `Portfolio/1`, `Portfolio/2`, `Portfolio/3`, `Portfolio/4` (с watermark).
- **Output**:
  - 4 файла `src/content/projects/project-{01..04}.md` с frontmatter (slug, title, year, type, area, location?, summary, cover, gallery, published, **isConcept**, order, seo?).
  - Фото скопированы в `src/assets/projects/{project-01..04}/` (для `<Image />`) и в `public/images/projects/{slug}/` если нужно (для Decap upload — выбор директории под Decap делается в T11).
  - Концепты (markdown body) — заглушки в духе «концепт-проект, рендер в работе, тексты пишутся».
  - У всех 4 — `published: true` и `isConcept: true`. Плашка «концепт-проект, фото в обработке» рендерится по флагу `isConcept` (логика — в T17/T18). По мере готовности ретуши сестра в админке снимает галочку — плашка исчезает.
- **Acceptance criteria**:
  - [ ] `pnpm build` зелёный.
  - [ ] `getCollection('projects')` возвращает 4 записи.
  - [ ] Каждый проект имеет ≥3 фото в `gallery`.
- **Tests required**:
  - [ ] Юнит-тест (Vitest или ручной): загрузить все 4 проекта, убедиться, что схема валидна.
- **Constitution check**: №1 (тексты концептов — без штампов даже на заглушках), №7 (плашка «концепт-проект» — честная подача).
- **Implementation notes**:
  - Watermark на этом этапе НЕ убираем — это zone сестры по `guide-for-svetlana.md`.
  - Имена файлов фото — `cover.jpg`, `01.jpg`, `02.jpg`... для предсказуемости.
  - Метраж/тип — заглушки (например, `apartment 65 м²`); сестра уточнит позже через админку.

---

### [T09] Сидирование 3 услуг + 5 страничных текстов (hero/about/services-intro/contact-intro/privacy)
- **Phase**: Phase 2 — Content Model & CMS
- **Type**: data
- **Depends on**: T07
- **Input**: схема из T07.
- **Output**:
  - `src/content/services/full-design.md`, `supervision.md`, `consulting.md` — title, tagline, description (markdown), order 1/2/3, published true, priceNote?.
  - `src/content/pages/hero.md`, `about.md`, `services-intro.md`, `contact-intro.md`, `privacy.md` — title + body (markdown).
  - `about.md` имеет поле `authorPhoto` со ссылкой на placeholder в `src/assets/about/placeholder.jpg` (заглушечный портрет — серый прямоугольник 800×800 или фото из исходников, если приемлемо). Поле обязательно для рендера в T19.
  - `privacy.md` — текст-заглушка с шапкой «⚠️ ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ ПЕРЕД ПУБЛИЧНЫМ ЗАПУСКОМ» и базовой структурой по 152-ФЗ (оператор: ФИО/ИНН/самозанятая; категории ПДн: имя, контакт, сообщение из формы; цели: ответ на заявку; срок хранения; права субъекта; контакт оператора). Финальный текст вычитывает юрист или сестра в ep03.
  - Все тексты — заглушки с явной пометкой «PLACEHOLDER — финальный копирайт в ep02», но БЕЗ штампов из Constitution Принципа 1 (не должны звучать как нейросетевой текст даже в заглушке).
- **Acceptance criteria**:
  - [ ] `pnpm build` зелёный.
  - [ ] `getCollection('services')` возвращает 3 записи в порядке `order`.
  - [ ] `getEntry('pages', 'about')` возвращает запись с непустым `authorPhoto`.
  - [ ] `getEntry('pages', 'privacy')` возвращает запись.
  - [ ] `grep -ri "уют и функциональность\|стиль и комфорт\|дом мечты"` в `src/content/` пусто.
- **Tests required**:
  - [ ] Авто-чек на запрещённые штампы — простой скрипт в `tests/unit/copy-smell.test.ts` (опционально, или вручную).
- **Constitution check**: №1 (даже заглушки без штампов), №7 (честный язык начинающего, а не псевдо-senior).
- **Implementation notes**:
  - About — заглушка с упоминанием диплома о переподготовке, без скрытия факта (Принцип 7).
  - Services tagline — короткое обещание, не маркетинговый слоган.
  - `privacy.md` — НЕ юридическая консультация, явно помечен как заглушка. Цель ep01 — закрыть техническую ссылку из CookieBanner на работающую страницу, чтобы Lighthouse и валидаторы не падали; финальный юридический текст — задача ep03.

---

### [T10] Сидирование settings: contacts.json + seo.json
- **Phase**: Phase 2 — Content Model & CMS
- **Type**: data
- **Depends on**: T07
- **Input**: схема из T07; исходник контактов в `Contacts/Cont.txt`.
- **Output**:
  - `src/content/settings/contacts.json` — 4 канала (Telegram личный, Telegram-блог, VK, max.me) по структуре из [`plan.md` Step 5](plan.md). `email` — `example@email.com` (заглушка, активируется сестрой). `telegramBlogRssUrl` — ссылка на превью `https://t.me/s/Golovina_design_ambersoftloft` (не RSSHub).
  - `src/content/settings/seo.json` — `siteName`, `siteUrl`, `defaultOgImage`, дефолтные `description` для главной.
- **Acceptance criteria**:
  - [ ] `pnpm build` зелёный.
  - [ ] `getEntry('settings', 'contacts')` возвращает данные.
  - [ ] Все URL-поля проходят `z.string().url()`.
- **Tests required**:
  - [ ] Проверка валидации: положить невалидный URL → билд падает.
- **Constitution check**: №2 (контакты редактируются через админку, не через код), №4 (источник истины в Git).
- **Implementation notes**:
  - Сверить с `Contacts/Cont.txt` точные handle'ы.
  - Email-копия и SMTP — заглушки, активируются сестрой по гайду (T28).

---

### [T11] Decap admin shell + config.yml со всеми коллекциями
- **Phase**: Phase 2 — Content Model & CMS
- **Type**: feature
- **Depends on**: T08, T09, T10
- **Input**: контент засеян, схемы валидны.
- **Output**:
  - `public/admin/index.html` — HTML-shell с подключением `https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js` (CDN, без node-зависимости).
  - `public/admin/config.yml` — все коллекции с UI-лейблами на русском по карте из [`plan.md` Step 5](plan.md). Полный набор file-коллекций под `pages`: «Главная», «О себе», «Услуги — вступление», «Контакты — вступление», «Политика ПДн».
  - Backend временно `git-gateway` или `proxy` (заглушка) — реальный backend GitHub OAuth подключается в T13. На этом этапе важно, чтобы UI рендерился локально.
  - `media_folder: "public/images"`, `public_folder: "/images"`.
  - Поле `isConcept` (boolean, widget `boolean`, default true) в коллекции «Проекты» с подписью «Концепт-проект (показывать плашку)».
  - Поле `authorPhoto` (widget `image`, optional) в file-коллекции «О себе» — сестра загружает фото портрета через стандартный image-widget.
- **Acceptance criteria**:
  - [ ] `pnpm dev` → открыть `localhost:4321/admin/` → видна Decap UI с 9 коллекциями (4 folder + 5 file под pages + 2 settings = по карте в плане).
  - [ ] Lables на русском («Проекты», «Услуги», «Главная», «О себе», «Политика ПДн» и т.д.).
  - [ ] Все поля схемы Zod (T07) имеют соответствующее поле в config.yml.
  - [ ] В UI «Проекты» виден чекбокс «Концепт-проект»; в UI «О себе» виден image-upload «Фото автора».
- **Tests required**:
  - [ ] Ручная проверка: открыть админку, пройти по всем коллекциям, увидеть поля.
  - [ ] Ручная проверка: снять чекбокс `isConcept` на тестовом проекте, сохранить — файл .md обновился, `isConcept: false` в frontmatter.
- **Constitution check**: №2 (WYSIWYG для нетехнического пользователя — это и есть критический пункт), №5 (Decap бесплатно forever).
- **Implementation notes**:
  - Decap config — два независимых описания модели (Zod + yaml), синхронизировать вручную — Key Decision из плана (Step 10).
  - Folder collections: `slug: "{{slug}}"` для projects/services; file collections для pages и settings.
  - Поле image в Decap: `widget: image`, `media_library: { ... }` — в media_folder проектов.

---

### [T12] GitHub OAuth Worker (workers/oauth/) + деплой + secrets
- **Phase**: Phase 2 — Content Model & CMS
- **Type**: api
- **Depends on**: T01
- **Input**: GitHub-аккаунт бра́та для OAuth App.
- **Output**:
  - `workers/oauth/src/index.ts` — небольшой OAuth proxy (~30–50 строк): принимает `/auth`, редиректит в GitHub OAuth, обменивает code на token, возвращает в Decap-окно через postMessage. Совместим с Decap (см. протокол).
  - `workers/oauth/wrangler.toml` — описание Worker'а, `name = "svetik-design-oauth"`, vars: `OAUTH_CLIENT_ID`, secrets: `OAUTH_CLIENT_SECRET`.
  - `workers/oauth/README.md` — короткая инструкция для бра́та: как создать GitHub OAuth App, какой callback URL, какие secrets в `wrangler secret put`.
  - Создана GitHub OAuth App (вручную бра́том), client_id/secret положены в Worker.
  - Worker задеплоен на `https://svetik-design-oauth.<account>.workers.dev`.
- **Acceptance criteria**:
  - [ ] `curl https://svetik-design-oauth.<account>.workers.dev/auth?provider=github&scope=repo` редиректит на GitHub OAuth страницу.
  - [ ] После авторизации возвращает token в окно-открыватель через postMessage.
- **Tests required**:
  - [ ] Ручная проверка OAuth-флоу из Decap UI.
- **Constitution check**: №5 (Cloudflare Worker бесплатно), №6 (50 строк вместо отдельного Node-сервера).
- **Implementation notes**:
  - Готовые имплементации (~10 ссылок в README ep02 не нужен): `sw-yx/netlify-cms-oauth-provider` адаптируется под CF Worker, или `i40west/netlify-cms-cloudflare-pages`.
  - Worker НЕ управляется через CF Pages, это отдельный проект в `wrangler.toml`.

---

### [T13] Wire Decap backend to OAuth worker + локальный smoke-test админки
- **Phase**: Phase 2 — Content Model & CMS
- **Type**: feature
- **Depends on**: T11, T12
- **Input**: Decap config из T11, Worker URL из T12.
- **Output**:
  - В `public/admin/config.yml` обновлён `backend`: `name: github`, `repo: <owner>/svetik-design`, `branch: main`, `base_url: https://svetik-design-oauth.<account>.workers.dev`.
  - Локально через `pnpm dev` пройден полный smoke: открыть `/admin/`, авторизоваться, отредактировать тестовый проект (например, изменить `summary` в `project-01.md`), сохранить → commit появился в репо.
- **Acceptance criteria**:
  - [ ] Логин через GitHub OAuth работает.
  - [ ] Сохранение редактирования из админки создаёт commit в `main` (или PR — зависит от настройки `publish_mode`).
  - [ ] Astro-валидация на сохранённых файлах проходит (`pnpm build` зелёный после редактирования).
- **Tests required**:
  - [ ] Ручной smoke-test полного флоу: login → edit → save → check repo.
- **Constitution check**: №2 (главная проверка — реальный нетехнический сценарий работает).
- **Implementation notes**:
  - Если `publish_mode: editorial_workflow` — изменения идут через PR, что безопаснее для ep03 (сестра без `--force`).

---

### [T14] Header.astro + Footer.astro компоненты
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: ui
- **Depends on**: T04, T10
- **Input**: Layout из T04, contacts.json из T10.
- **Output**:
  - `src/components/layout/Header.astro` — минимальная навигация: лого-текст «Светлана Головина» + ссылки `/works`, `/about`, `/services`, `/contact`. Адаптивный (мобильное меню — простой `<details>` или CSS-only).
  - `src/components/layout/Footer.astro` — 4 канала из `contacts.json`, ссылка на политику ПДн (placeholder `/privacy` — будет в ep03 или сейчас как .md), copyright + «Самозанятая. Налог на профессиональный доход».
  - Header/Footer подключены в `Layout.astro`.
- **Acceptance criteria**:
  - [ ] На `/` видны Header (с навигацией) и Footer (с 4 каналами).
  - [ ] Клики по навигации работают (даже если страницы пока 404 — это ok, они будут в T16–T21).
  - [ ] Контакты в футере читаются из `contacts.json`, не захардкожены.
- **Tests required**:
  - [ ] Изменить handle в `contacts.json` → перебилдить → видна новая ссылка в футере.
- **Constitution check**: №2 (контакты редактируются), №7 (никаких «Бесплатная консультация!» в футере).
- **Implementation notes**:
  - Стилистика — заглушка (Tailwind utilities), финальный визуал в ep02.
  - Mobile-menu: `<details>` без JS — Принцип 3 (Lighthouse).

---

### [T15] telegram-feed.ts build-time парсер + unit-тест
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: feature
- **Depends on**: T02
- **Input**: ничего, кроме базового проекта.
- **Output**:
  - `src/lib/telegram-feed.ts` — `async function fetchTelegramFeed(channel: string, limit = 5): Promise<TelegramPost[]>`. Fetch `https://t.me/s/{channel}` → parse через `linkedom` → селекторы `.tgme_widget_message` → извлечь текст, первую картинку, дату, permalink. Timeout 5 сек. На ошибку — возврат `[]` + `console.warn`.
  - **Санитизация**: текст поста перед возвратом проходит через явную функцию `sanitizeText(raw: string): string`, которая (а) использует `Node.textContent` из распарсенного DOM (не `innerHTML`) — гарантирует, что любые `<script>`/`<img onerror>`/inline-handlers из контента поста не попадают в итоговую модель; (б) дополнительно вырезает Unicode-control-chars (`-` кроме `\n`). Permalink и picture URL валидируются через `new URL(...)` и проверяются на `https:` схему — невалидные пост целиком пропускается.
  - Юнит-тест `tests/unit/lib/telegram-feed.test.ts` (Vitest) — зафиксирован snapshot HTML (одна страница `t.me/s/...`), парсер вызывается с моком fetch, проверяется корректность 3–5 распарсенных постов и graceful-fail.
  - `vitest.config.ts` создан (если не было).
- **Acceptance criteria**:
  - [ ] `pnpm test` зелёный.
  - [ ] При живом запуске (без мока) — возвращает массив постов из @Golovina_design_ambersoftloft.
  - [ ] При невалидном HTML — возвращает `[]` (graceful-fail).
  - [ ] При HTML с `<script>alert(1)</script>` в теле поста — результат не содержит тегов `<script>`, текст возвращается plain.
- **Tests required**:
  - [ ] Unit: парсер по зафиксированному snapshot HTML → ожидаемое кол-во постов.
  - [ ] Unit: fetch падает → возвращается `[]`, не throw.
  - [ ] Unit: пустой/мусорный HTML → возвращается `[]`.
  - [ ] Unit: пост с `<script>`, `<img onerror=...>`, `javascript:` в href — текст plain, permalink/picture либо валидный https URL, либо пост отброшен.
- **Constitution check**: №3 (build-time = 0 KB клиентского JS), №6 (один источник, без RSSHub), №2 косвенно (защита от XSS — сестра не должна узнавать о проблеме через хак сайта).
- **Implementation notes**:
  - `linkedom` намного легче, чем `cheerio` + `jsdom`.
  - Selectors могут поменяться — тест по snapshot не зависит от живого Telegram.
  - Дата на странице — относительная («2h ago»); забираем атрибут `datetime` из `<time>`.
  - Принцип санитизации: возвращаем из парсера только plain-text + валидированные URL, никогда не raw HTML. Render в `TelegramFeed.astro` использует обычное `{post.text}` (Astro escape по умолчанию), не `set:html`.

---

### [T16] Главная: Hero + ManifestoBlock + TelegramFeed
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: ui
- **Depends on**: T14, T15, T09
- **Input**: Layout, Header/Footer, telegram-feed, контент `pages/hero.md`.
- **Output**:
  - `src/components/home/Hero.astro` — типографический Hero без фото (placeholder под ep02). Берёт body из `pages/hero.md`.
  - `src/components/home/ManifestoBlock.astro` — заглушка-плашка под ep02 (комментарий «финальный копирайт в ep02»).
  - `src/components/home/TelegramFeed.astro` — вызывает `fetchTelegramFeed(...)` при build, рендерит 3–5 карточек постов (текст + дата + permalink). Если массив пустой — рендерит fallback «Читайте блог → https://t.me/...».
  - `src/pages/index.astro` собирает: Hero + Manifesto + ссылка на `/works` + TelegramFeed внизу.
- **Acceptance criteria**:
  - [ ] `/` рендерится без ошибок.
  - [ ] TelegramFeed виден на странице с реальными постами (или fallback, если парсер не получил данные).
  - [ ] Ноль клиентских JS-загрузок от Telegram в DevTools Network.
- **Tests required**:
  - [ ] Ручной: visit `/` → видны все 3 блока.
  - [ ] Build-log содержит сообщение от парсера (success или warn).
- **Constitution check**: №1 (нет штампов в Hero), №3 (TG-виджет без клиентского JS).
- **Implementation notes**:
  - Дата формат — `format.ts` (см. T22 / utility).

---

### [T17] Works listing (`/works`) + ProjectCard
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: ui
- **Depends on**: T14, T08
- **Input**: 4 проекта, Header/Footer.
- **Output**:
  - `src/components/projects/ProjectCard.astro` — props: project entry. Отображает cover (Astro `<Image />` AVIF/WebP), title, year, type (locale-label), area, summary, ссылку на `/works/{slug}`. Плашка «концепт-проект, фото в обработке» рендерится по полю `isConcept` из схемы (T07).
  - `src/pages/works/index.astro` — `getCollection('projects', ({ data }) => data.published)`, затем sort: сначала по `order` desc (если задан), затем по `year` desc. Записи без `order` сортируются только по `year`. → grid из ProjectCard.
- **Acceptance criteria**:
  - [ ] `/works` показывает 4 карточки.
  - [ ] Cover — отдаётся как AVIF/WebP responsive (проверка через DevTools Network).
  - [ ] Клик по карточке ведёт на `/works/{slug}` (даже если страница 404, пока T18 не сделан).
  - [ ] Плашка «концепт-проект» видна на всех 4 карточках (т.к. на старте у всех `isConcept: true`).
  - [ ] Если поменять `isConcept: false` на одном проекте — плашка исчезает только на этой карточке.
  - [ ] Проект с `published: false` НЕ появляется в листинге.
- **Tests required**:
  - [ ] Build: assert `dist/works/index.html` существует.
  - [ ] Unit (Vitest): функция сортировки в `src/lib/sortProjects.ts` (extracted из листинга) на 5 синтетических проектах возвращает ожидаемый порядок (комбинации с/без `order`, разные `year`).
  - [ ] Unit: функция фильтрации исключает `published: false`.
- **Constitution check**: №3 (Astro Image — performance), №7 (плашка «концепт-проект» — честная подача).
- **Implementation notes**:
  - Type-label локализация: маппа `{ apartment: 'Квартира', ... }` в `src/lib/format.ts`.
  - Логика сортировки и фильтрации вынесена в `src/lib/sortProjects.ts` для тестируемости (не inline в .astro).

---

### [T18] Project detail (`/works/[slug]`) + ProjectMeta + ImageGallery
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: ui
- **Depends on**: T17
- **Input**: ProjectCard работает, коллекция проектов читается.
- **Output**:
  - `src/components/projects/ProjectMeta.astro` — отображает year / type / area / location в одну строку или сетку. Также показывает плашку «концепт-проект, фото в обработке» (по полю `isConcept`).
  - `src/components/projects/ImageGallery.astro` — рендерит массив `<Image />` из `gallery`. Без клиентского JS (никакого lightbox в ep01 — это ep02). Grid responsive.
  - `src/pages/works/[slug].astro` — `getStaticPaths()` из `getCollection('projects', ({ data }) => data.published)` (опубликованные только), рендерит title + ProjectMeta + concept (markdown body via `await render(entry)`) + ImageGallery.
- **Acceptance criteria**:
  - [ ] `/works/project-01`, `/works/project-02` etc. отдают 200.
  - [ ] Галерея показывает все фото из `gallery`.
  - [ ] Если у проекта `published: false` — страница не генерируется и не попадает в sitemap (404 при прямом заходе).
  - [ ] Плашка «концепт-проект» видна на странице (т.к. seed `isConcept: true`).
  - [ ] Проект без `location` рендерится без пустой строки/«undefined» в meta.
- **Tests required**:
  - [ ] Build: проверить, что `dist/works/project-01/index.html` существует.
  - [ ] Build: создать временно тестовый проект с `published: false` → пересобрать → `dist/works/test-unpub/` отсутствует. Удалить тестовый файл после.
  - [ ] E2E (T30) covers это.
- **Constitution check**: №3 (без JS-галерей), №7 (плашка концепта).
- **Implementation notes**:
  - `<Image />` нужно с `widths={[400, 800, 1200]} sizes="..."`.

---

### [T19] About + Services + Contact pages (без формы)
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: ui
- **Depends on**: T14, T09, T10
- **Input**: контент pages + services + contacts.json.
- **Output**:
  - `src/pages/about.astro` — рендерит `pages/about.md` body + `<Image src={entry.data.authorPhoto} />` если задано (если не задано — fallback в виде нейтрального серого блока с подписью «Фото в работе»), упоминает диплом о переподготовке.
  - `src/pages/services.astro` — `services-intro.md` body + `getCollection('services', ({ data }) => data.published).sort((a,b) => a.data.order - b.data.order)` → ServiceCard для каждой записи. Пустой список (если сестра удалит все) — рендерит fallback «Услуги в разработке», не падает.
  - `src/components/services/ServiceCard.astro` — title, tagline, description (markdown), priceNote?.
  - `src/pages/contact.astro` — `contact-intro.md` body + ContactChannels (4 канала из contacts.json) + место под ContactForm (заглушка-комментарий, форма в T20).
  - `src/components/contact/ContactChannels.astro` — рендерит 4 канала из `contacts.json`.
- **Acceptance criteria**:
  - [ ] Все 3 страницы возвращают 200 и видимы.
  - [ ] services сортирует по `order` ascending (1 → 2 → 3).
  - [ ] services с `published: false` НЕ появляются в листинге.
  - [ ] contact-channels берёт URL из contacts.json.
  - [ ] About-страница показывает фото автора из поля `authorPhoto` (Astro `<Image />` AVIF/WebP responsive).
  - [ ] Если все services с `published: false` — страница рендерит fallback, не падает.
- **Tests required**:
  - [ ] Ручной обход всех 3 страниц.
  - [ ] Ручной: временно поменять `published: false` у одной услуги → пересобрать → её нет на странице.
  - [ ] Ручной: поменять `authorPhoto` на другой файл → пересобрать → новое фото видно.
- **Constitution check**: №1 (никаких штампов в текстах), №2 (фото автора редактируется через админку), №7 (диплом честно называется дипломом о переподготовке).
- **Implementation notes**:
  - `<Markdown />` или `await render(entry)` — стандартный паттерн Astro для render body.
  - При отсутствии `authorPhoto` (`entry.data.authorPhoto === undefined`) — рендерим заглушку, не падаем. Сестра обязана заполнить поле перед ep03-запуском (попадёт в activation checklist T28).

---

### [T20] ContactForm.astro + ПДн consent + клиентское wiring к Worker URL
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: feature
- **Depends on**: T19, T21a, T23
- **Input**: Worker URL (из T23), страница `/privacy` (из T21a).
- **Output**:
  - `src/components/contact/ContactForm.astro` — поля name, contact (email или @TG), message, honeypot (hidden, off-screen), **обязательный чекбокс `consent`** с текстом «Согласен с [политикой обработки персональных данных](/privacy)» (ссылка ведёт на `/privacy`). Native `<form>` с client-side fetch к `import.meta.env.PUBLIC_SUBMIT_URL`. Минимальный JS (vanilla, не React/Vue) inline в компоненте.
  - Submit blocked без `consent` (HTML5 `required` на чекбоксе + JS guard перед fetch).
  - Состояния: idle / submitting / success / error. Aria-live для feedback.
  - На странице `/contact` ContactForm вставлен под ContactChannels.
  - Валидация на фронте (HTML5 `required`, `pattern` для contact, `required` для consent); серверная валидация — в T23 (там же проверяется `consent === true` в payload).
  - Граничная валидация message: maxLength 500 на input + JS guard перед submit (граница соответствует серверной в T23).
- **Acceptance criteria**:
  - [ ] Сабмит формы в DevTools Network показывает POST на `PUBLIC_SUBMIT_URL` с полем `consent: true`.
  - [ ] При успехе (200) — пользователь видит «Заявка отправлена».
  - [ ] При сетевом сбое — ошибка с возможностью повторить.
  - [ ] Honeypot заполнен → форма silently «успешна» (не отправляет).
  - [ ] Без галочки `consent` — submit заблокирован (HTML5 валидация показывает подсказку), запрос не уходит.
  - [ ] Ссылка «политика обработки персональных данных» ведёт на `/privacy` и отдаёт 200.
  - [ ] Message > 500 символов — submit блокируется на фронте.
- **Tests required**:
  - [ ] Ручной: заполнить форму без галочки → сабмит блокируется.
  - [ ] Ручной: заполнить форму с галочкой → проверить запрос (`consent: true` в body).
  - [ ] Ручной: message 501 символ → блок на фронте.
  - [ ] E2E в T30 покрывает успешный путь и блок без consent.
- **Constitution check**: №3 (минимальный JS), №6 (vanilla, без фреймворков), №2 косвенно (152-ФЗ — оператор ПДн обязан получать явное согласие).
- **Implementation notes**:
  - JS в `<script>` тегом в `.astro` — Astro заинлайнит / отделит автоматически.
  - Чекбокс consent — НЕ pre-checked. По 152-ФЗ согласие должно быть активным действием.

---

### [T21] 404.astro + CookieBanner (152-ФЗ)
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: ui
- **Depends on**: T14
- **Input**: Layout + Header/Footer.
- **Output**:
  - `src/pages/404.astro` — лаконичный fallback, ссылка на главную.
  - `src/components/ui/CookieBanner.astro` — нативный `<dialog>` или фиксированный footer-баннер с текстом «Сайт использует Yandex.Metrica и cookies. Подробнее в политике ПДн.» Кнопка «ОК» сохраняет согласие в `localStorage` или cookie. Не показывается, если согласие уже дано.
  - CookieBanner подключён в `Layout.astro` (один раз глобально).
  - Текст баннера юридически корректен для 152-ФЗ (упоминание оператора, цели обработки, ссылка на политику; ссылка `/privacy` пока 404 — закроется в ep03, отметить в TODO).
- **Acceptance criteria**:
  - [ ] `/404` рендерится при заходе на несуществующий URL (в dev/preview Astro перехватывает).
  - [ ] CookieBanner виден на первом заходе, исчезает после «ОК», не появляется при перезагрузке.
- **Tests required**:
  - [ ] Ручной: cleared storage → виден баннер; click ОК → исчез; reload → не виден.
- **Constitution check**: №3 (минимальный JS для cookie-state).
- **Implementation notes**:
  - localStorage key: `consent.metrica.v1` — версия, чтобы при изменении политики можно было снова запросить согласие.

---

### [T21a] `/privacy` страница (152-ФЗ stub)
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: ui
- **Depends on**: T14, T09
- **Input**: Layout + Header/Footer + засеянный `pages/privacy.md` из T09.
- **Output**:
  - `src/pages/privacy.astro` — рендерит `pages/privacy.md` body через `await render(entry)`. Использует базовый Layout (заголовок, meta, OG как у других страниц).
  - Страница попадает в sitemap (T24), но **исключена из main-навигации** (Header) — ссылки только из CookieBanner, ContactForm consent-чекбокса и Footer (одна сдержанная ссылка «Политика обработки ПДн»).
  - Footer обновлён: добавлена ссылка `/privacy` (уже была placeholder в T14 — теперь резолвится).
- **Acceptance criteria**:
  - [ ] `/privacy` отдаёт 200, видна шапка «⚠️ ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ» из seed-текста.
  - [ ] Lighthouse mobile на `/privacy` ≥ 95 по 4 метрикам (это просто текстовая страница, должно проходить тривиально).
  - [ ] Ссылка из CookieBanner и из ContactForm consent ведут на работающий `/privacy`, не 404.
  - [ ] Страница НЕ в Header-навигации.
- **Tests required**:
  - [ ] Ручной: переход с / → CookieBanner → ссылка «политика» → 200.
  - [ ] E2E (T30) — добавить `/privacy` в список проверяемых маршрутов.
- **Constitution check**: №2 (текст редактируется через админку без developer'а), №3 (Lighthouse 95+), №7 (явная пометка «требует юридической вычитки» — честная подача незаконченности).
- **Implementation notes**:
  - Цель ep01 — закрыть техническую дыру (CookieBanner и форма ссылаются на работающую страницу), а не написать боевой юридический текст. Финальный текст — задача ep03 после консультации с юристом / по шаблону Роскомнадзора.

---

### [T22] SEO компоненты — MetaTags + SchemaPerson + YandexMetrica + format.ts
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: feature
- **Depends on**: T04, T10
- **Input**: Layout (skeleton), seo.json, contacts.json.
- **Output**:
  - `src/components/seo/MetaTags.astro` — финализирует логику из T04: source-of-truth title/description берёт из props, fallback из `seo.json`. Canonical из site + URL. OG (title, description, image, type, locale ru_RU). Twitter card.
  - `src/components/seo/SchemaPerson.astro` — JSON-LD `<script type="application/ld+json">` Person с occupation «Дизайнер интерьеров», jobTitle «Самозанятая», url, sameAs (TG, VK).
  - `src/components/analytics/YandexMetrica.astro` — async loader, ID из `import.meta.env.PUBLIC_METRIKA_ID`. Если env пустой — не рендерится (no-op). webvisor + clickmap включены. Загрузка только после согласия cookie (читает localStorage из T21).
  - `src/lib/seo.ts` — утилиты `buildCanonical(path)`, `getDefaultMeta()`.
  - `src/lib/format.ts` — `formatArea(n: number)`, `formatYear(n)`, `localeProjectType(type)`.
  - Все три компонента подключены в `Layout.astro`.
- **Acceptance criteria**:
  - [ ] `view-source` главной — `<script type="application/ld+json">` валидируется на schema.org validator.
  - [ ] `PUBLIC_METRIKA_ID` пустой → нет script-тега Yandex.
  - [ ] `PUBLIC_METRIKA_ID` задан + согласие дано → Metrica загружена.
- **Tests required**:
  - [ ] Unit `tests/unit/lib/seo.test.ts` — `buildCanonical('/works')` возвращает абсолютный URL.
  - [ ] Unit `tests/unit/lib/format.test.ts` — `localeProjectType('apartment')` → «Квартира».
- **Constitution check**: №3 (SEO 95+), №7 (Schema.org не приписывает несуществующие достижения).
- **Implementation notes**:
  - Metrica counter v2 webvisor — стандартный snippet, обёрнутый в проверку согласия.

---

### [T23] Submit Worker (`workers/submit/`) — валидация, rate-limit, TG, SMTP, mock-mode
- **Phase**: Phase 3 — Pages, Components, Forms, Worker
- **Type**: api
- **Depends on**: T01
- **Input**: ничего, кроме базы Worker'а.
- **Output**:
  - `workers/submit/src/index.ts` — POST `/api/submit`. Логика по [`plan.md` Step 7](plan.md): валидация (name/contact/message 1–500, **обязательное `consent === true`**, honeypot, email/TG regex), rate-limit 5/час по IP (CF Cache API или KV), Telegram `sendMessage`, email через SMTP. **Mock-mode**: если любой из секретов (`TELEGRAM_BOT_TOKEN`, `OWNER_CHAT_ID`, `SMTP_*`) не задан → return 200 `{ ok: true, mock: true }` + `console.warn`. CORS: только `PUBLIC_SITE_URL` origin.
  - `workers/submit/wrangler.toml` — name, compatibility_date, vars (`PUBLIC_SITE_URL`), secrets-плейсхолдеры (комментарии «set via wrangler secret put»). Деплой на `submit.svetik-design.workers.dev`.
  - `workers/submit/README.md` — как задеплоить, как поставить secrets, как переключить в боевой режим.
  - Unit-тесты `workers/submit/test/index.test.ts` (Vitest + Miniflare или unstable_dev) — happy path, validation fail, rate-limit, mock mode, CORS.
- **Acceptance criteria**:
  - [ ] `curl -X POST <worker-url> -d '{"name":"x","contact":"x@x.x","message":"x","consent":true}'` → 200 (mock-mode, без секретов).
  - [ ] Body без `consent: true` → 400 с ошибкой `consent_required`.
  - [ ] Honeypot заполнен → 200 (silently), но в TG не уходит. В mock-mode проверяется через `console.log` маркер `[honeypot-drop]` отдельный от `[mock]`.
  - [ ] Invalid body → 400.
  - [ ] 6-й запрос за час с одного IP → 429.
  - [ ] CORS блокирует cross-origin requests.
  - [ ] Конкурентные 6 запросов (Promise.all) от одного IP — counter не теряет инкремент (rate-limit срабатывает корректно).
- **Tests required**:
  - [ ] Unit: все ветки (mock, valid, invalid, rate-limit, honeypot, CORS, consent missing).
  - [ ] Unit: concurrent-burst test для rate-limit counter.
- **Constitution check**: №5 (CF Worker = $0), №6 (один файл, без фреймворков).
- **Implementation notes**:
  - SMTP в CF Worker — нет прямого Node SMTP API; решения: (а) использовать `nodemailer` через `npm:nodemailer` (Workers Node compat), (б) через MailChannels API (бесплатно для CF Workers, но требует SPF DKIM настройки), (в) HTTP-API почтового сервиса. На ep01 SMTP может остаться TODO в коде — главное mock-mode и TG ветка. Email активируется сестрой по гайду.
  - Rate-limit через CF Cache API: ключ `rl:{ip}:{hour}`, value counter — простейшая реализация ~10 строк.

---

### [T24] sitemap.xml + robots.txt + default OG image
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: seo
- **Depends on**: T22
- **Input**: `@astrojs/sitemap` подключён в T02.
- **Output**:
  - `astro.config.mjs` — конфиг `sitemap({ filter: (page) => !page.includes('/admin') })`. Только опубликованные projects (через `customPages` или контент-фильтр).
  - `public/robots.txt` — `User-agent: *`, `Allow: /`, `Disallow: /admin/`, `Sitemap: https://svetik-design.pages.dev/sitemap-index.xml`.
  - `public/images/og/default.png` — типографическая OG-картинка 1200×630 (placeholder под ep02, можно SVG-to-PNG).
  - `seo.json` обновлён с `defaultOgImage: "/images/og/default.png"`.
- **Acceptance criteria**:
  - [ ] `dist/sitemap-index.xml` существует и содержит главную, /works, /works/*, /about, /services, /contact.
  - [ ] `/admin/` НЕ в sitemap.
  - [ ] `dist/robots.txt` существует.
- **Tests required**:
  - [ ] Ручной: открыть `dist/sitemap-0.xml`, посмотреть URLs.
- **Constitution check**: №3 (SEO 95+).
- **Implementation notes**:
  - OG-картинка может быть сгенерирована вручную в Figma; финальная — ep02.

---

### [T24a] CSP и security headers через `public/_headers`
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: security
- **Depends on**: T22, T24
- **Input**: финальный набор внешних доменов (Yandex.Metrica, Submit Worker, OAuth Worker, Telegram).
- **Output**:
  - `public/_headers` (формат CF Pages) с заголовками:
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
    - `X-Frame-Options: DENY` (на не-admin путях)
    - `Content-Security-Policy` для путей кроме `/admin/*`: `default-src 'self'; script-src 'self' https://mc.yandex.ru; img-src 'self' data: https://mc.yandex.ru https://cdn4.telegram-cdn.org; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://mc.yandex.ru <SUBMIT_WORKER_URL>; frame-ancestors 'none'; base-uri 'self'; form-action 'self' <SUBMIT_WORKER_URL>`
    - Для `/admin/*` — ослабленная CSP, разрешающая `https://unpkg.com` (Decap CDN), `https://api.github.com`, `<OAUTH_WORKER_URL>`, и `'unsafe-eval'` если нужен для Decap.
  - Документ-комментарий в `public/_headers` объясняет, какие источники зачем разрешены — чтобы при добавлении нового внешнего сервиса в будущем (например, Cloudflare Images) было понятно, что обновить.
- **Acceptance criteria**:
  - [ ] После прод-деплоя `curl -I https://svetik-design.pages.dev/` показывает все 5 заголовков.
  - [ ] DevTools Console на главной не показывает CSP violations.
  - [ ] DevTools Console на `/admin/` не показывает CSP violations, Decap UI работает.
  - [ ] Yandex.Metrica загружается без CSP-блокировки (после consent).
  - [ ] Форма submit получает 200 (не CORS-блокировка из CSP `form-action`).
  - [ ] Lighthouse Best Practices не теряет баллы из-за headers (наоборот, может +5).
- **Tests required**:
  - [ ] Ручной: после деплоя пройти все маршруты, открыть Console — 0 CSP violations.
  - [ ] Ручной: попытка `<script>alert(1)</script>` через inline-добавление в HTML — Console показывает CSP block (proof: defence работает).
- **Constitution check**: №3 (Best Practices ≥ 95 — headers вклад положительный), №6 (один файл `_headers`, без отдельных middleware).
- **Implementation notes**:
  - CF Pages `_headers` синтаксис: блок `/path/*` + строки `Header-Name: value`. Поддерживает условные пути.
  - Если CSP блокирует что-то в админке — ослаблять точечно, не уходить в `unsafe-*` глобально.
  - При добавлении в ep02/ep03 новых третьих доменов (например, embed Telegram-виджета или внешний CDN) — обновить CSP `connect-src`/`img-src`/`script-src` соответственно.

---

### [T25] Image pipeline проверка (Astro `<Image />` оригинал → AVIF/WebP responsive)
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: test
- **Depends on**: T17, T18
- **Input**: фото проектов в `src/assets/projects/{slug}/` (положены в T08).
- **Output**:
  - Подтверждено, что `pnpm build` создаёт responsive variants в `dist/_astro/`.
  - Verified: oригинал не отдаётся клиенту в полном размере; cover на карточке = 800px max, gallery = 1200px max.
  - Документ-чеклист (или комментарий в `src/components/projects/`) — какие widths используются на каких компонентах.
- **Acceptance criteria**:
  - [ ] DevTools Network на `/works` показывает `.avif` или `.webp` файлы, не `.jpg`.
  - [ ] LCP-image на главной — оптимизированный variant, не оригинал.
- **Tests required**:
  - [ ] Ручной аудит — пройти `/`, `/works`, `/works/project-01` и проверить Network.
- **Constitution check**: №3 (Lighthouse Performance).
- **Implementation notes**:
  - Если sharp недоступен — Astro упадёт на билде. На CF Pages sharp работает в build env.

---

### [T26] Lighthouse CI workflow + бюджет 95+
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: test
- **Depends on**: T25
- **Input**: рабочий билд.
- **Output**:
  - `.github/workflows/ci.yml` — jobs: `lint`, `typecheck`, `lighthouse`, `e2e` (последний — расширяется в T30). `lighthouse` использует `treosh/lighthouse-ci-action@v12`, бюджет в `lighthouse.config.js` (или `.lighthouserc.json`): performance/a11y/best-practices/seo ≥ 0.95 на mobile preset.
  - Workflow триггерится на PR и push в main.
  - Failure на любой из 4 метрик → check fails.
  - **Branch protection включён на `main`** через GitHub Settings → Branches → Add rule: required status checks (`lint`, `typecheck`, `lighthouse`, `e2e`), require PR before merge, disallow direct push. Включается руками бра́та; шаги задокументированы в `README.md` (раздел «Branch protection setup») и в `docs/guide-for-svetlana.md` (короткое объяснение, зачем).
- **Acceptance criteria**:
  - [ ] Первый CI-ран на push: lighthouse зелёный (все 4 метрики ≥ 95).
  - [ ] Если намеренно ввести регресс (`document.write(...)` в Layout) — workflow падает.
  - [ ] На `main` нельзя пушить напрямую (попытка `git push origin main` без PR → reject от GitHub).
  - [ ] PR с failing Lighthouse check не может быть merged через UI.
- **Tests required**:
  - [ ] CI-ран на тестовом PR с введённым регрессом.
  - [ ] Ручной: попытка direct push в main → reject.
- **Constitution check**: №3 (это и есть автоматизация Принципа 3 — без branch protection правило становится информационным, что эмпирически деградирует за 3 месяца).
- **Implementation notes**:
  - `lighthouseci` запускает локальный `pnpm build && pnpm preview` или против deploy preview CF Pages. Простой вариант — против локального preview.
  - Шаги по включению branch protection (Settings → Branches → Add rule → выбрать checks) задокументировать в README + скриншот в гайде для сестры (на случай, если ей потребуется поправить настройки после передачи).

---

### [T27] CF Pages project setup + env vars + первый прод-деплой
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: deploy
- **Depends on**: T13, T23, T26
- **Input**: репо готов, Worker'ы задеплоены.
- **Output**:
  - В Cloudflare Dashboard создан проект Pages `svetik-design`, привязан к GitHub repo.
  - Build settings: `pnpm install --frozen-lockfile && pnpm build`, output `dist/`, Node 22.
  - Env vars: `PUBLIC_SITE_URL=https://svetik-design.pages.dev`, `PUBLIC_METRIKA_ID=<actual>`, `PUBLIC_SUBMIT_URL=<submit-worker-url>`.
  - Превью-домен `svetik-design.pages.dev` доступен и отдаёт сайт.
  - Скриншот build-логов сохранён в `docs/ep01-portfolio/log.md` (или ссылкой в `guide-for-svetlana.md`).
- **Acceptance criteria**:
  - [ ] `https://svetik-design.pages.dev/` отдаёт собранный сайт.
  - [ ] `/admin/` доступен.
  - [ ] Форма на `/contact` отправляет в Worker и получает 200 (mock-mode).
  - [ ] TG-виджет показывает посты.
- **Tests required**:
  - [ ] Ручной обход всех 7 маршрутов на превью.
- **Constitution check**: №5 (free tier), №3 (проверить Lighthouse mobile на живом превью).
- **Implementation notes**:
  - CF Pages создаёт уникальный preview URL на каждый push — это нормально, prod-URL `svetik-design.pages.dev` стабилен.

---

### [T28] guide-for-svetlana.md — расширенная версия
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: docs
- **Depends on**: T13, T23, T27
- **Input**: всё работает на превью.
- **Output**:
  - `docs/guide-for-svetlana.md` со всеми разделами из [`plan.md` Step 9](plan.md):
    1. Введение (что такое сайт, где живёт).
    2. Админка: login, CRUD по проектам/услугам/страницам/контактам/SEO. Со скриншотами. Включая снятие галочки `isConcept` и загрузку `authorPhoto` через image-widget.
    3. Ретушь watermark — IOPaint установка, batch, Cleanup.pictures для сложных кадров.
    4. Подготовка фото — разрешение, кроп, имена, ориентация. **Явное предупреждение**: iPhone HEIC не поддерживается, конвертировать в JPEG перед заливкой (инструкция для iOS «Settings → Camera → Formats → Most Compatible» или конвертация через Preview/Photos export).
    5. Копирайт — структура текста о проекте, список запрещённых штампов (из Constitution).
    6. Telegram-бот заявок — @BotFather, chat_id, секреты в CF Pages.
    7. Email-копия — почта Яндекс, пароль приложения SMTP, секреты.
    8. Домен — что такое, рекомендация `golovinadesign.ru`, альтернативы, регистрация в reg.ru.
    9. Миграция на свой домен — CF Pages Custom domains, DNS, проверка из РФ.
    10. Резервный план — переезд на Timeweb Cloud.
    11. Branch protection в GitHub — короткое объяснение, зачем (Lighthouse-гейт), что её настроил бра́т, и куда смотреть, если что-то сломалось.
  - **Отдельный артефакт: `docs/guide-for-svetlana-activation.md`** (или раздел в конце основного гайда с заметным заголовком) — короткий **чек-лист активации перед публичным запуском (ep03)** на одну экранную страницу:
    - [ ] Создан GitHub-аккаунт Светланы, добавлен collaborator'ом к репо.
    - [ ] Прошёл OAuth-логин на `/admin`, отредактирован тестовый проект, изменение видно на превью.
    - [ ] Создан Telegram-бот через @BotFather, получен `TELEGRAM_BOT_TOKEN`.
    - [ ] Получен `OWNER_CHAT_ID` (через @userinfobot или скрипт).
    - [ ] Оба секрета прописаны в CF Pages env (или Worker secrets).
    - [ ] Создана почта `*@yandex.ru` для оператора, получен пароль приложения SMTP, прописаны `SMTP_USER`/`SMTP_PASS`.
    - [ ] Тестовая отправка формы → получена в Telegram + email.
    - [ ] Поле `email` в `contacts.json` заменено с `example@email.com` на боевое.
    - [ ] `PUBLIC_METRIKA_ID` создан в Яндекс.Метрике, прописан в env, на превью видны переходы.
    - [ ] Текст `pages/privacy.md` вычитан юристом (или сестрой) и заменён с заглушки.
    - [ ] Поле `authorPhoto` в `about` заменено на реальный портрет.
    - [ ] Все 4 проекта прошли ретушь watermark; флаги `isConcept` сняты на готовых.
    - [ ] Куплен домен, подключён к CF Pages, DNS работает из РФ ISP.
- **Acceptance criteria**:
  - [ ] Гайд читается нетехническим человеком от начала до конца без «спроси брата».
  - [ ] Каждый шаг имеет конкретные действия (что кликать, куда вставлять).
  - [ ] Ссылки актуальны (IOPaint repo, reg.ru, BotFather).
  - [ ] Activation-чек-лист — отдельный самостоятельный артефакт, не «закопан» в большом гайде; на 1 экран, можно распечатать.
- **Tests required**:
  - [ ] Внутренняя проверка: пройти раздел «Админка» по гайду на чистой машине — получилось ли отредактировать проект.
  - [ ] Внутренняя проверка: пройти activation-чек-лист — каждый пункт реально исполнимый, без отсылок на «спроси брата».
- **Constitution check**: №2 (это и есть зона «нетехнический пользователь»), №1 (стиль гайда — короткие фразы, без воды).
- **Implementation notes**:
  - Объём — ожидаемо 30–50 экранов. Можно разбить на под-файлы и индекс, если становится неудобно читать.
  - Скриншоты — папка `docs/guide-screenshots/`.
  - Activation-чек-лист — главный «контракт передачи» между ep01 (бра́т) и ep03 (сестра); должен быть виден сразу, не похоронен после 40 страниц.

---

### [T29] README.md для разработчика-преемника
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: docs
- **Depends on**: T27
- **Input**: финальный стэк зафиксирован.
- **Output**:
  - `README.md` обновлён: prereqs (Node 22, pnpm 9, wrangler CLI), как поднять локально (`pnpm install`, `pnpm dev`), структура `src/` / `workers/` / `public/admin/`, как работает деплой (push → CF Pages), куда смотреть при поломке (Decap, Worker form, TG-виджет — 3 самые ломкие точки).
  - **Раздел «Branch protection setup»** — пошаговая инструкция (GitHub → Settings → Branches → Add rule → required checks: lint/typecheck/lighthouse/e2e + require PR + disallow direct push), со скриншотами. Это «контракт enforcement Принципа 3».
  - **Раздел «CSP при добавлении нового сервиса»** — короткий гайд для будущего разработчика: если добавляется внешний домен (CDN, аналитика, embed), обновить `public/_headers` в соответствующих директивах CSP.
  - Ссылки на `docs/vision.md`, `docs/ep01-portfolio/plan.md`, `docs/guide-for-svetlana.md`, `CLAUDE.md`.
- **Acceptance criteria**:
  - [ ] Разработчик, не видевший проект, поднимает локально за ≤10 минут по README.
- **Tests required**:
  - [ ] Внутренняя проверка: пройти инструкцию руками на чистом клоне.
- **Constitution check**: №6 (README отражает простоту стэка, не пытается выглядеть «энтерпрайзно»).
- **Implementation notes**:
  - Не дублируем содержимое CLAUDE.md / vision.md — ссылаемся.

---

### [T30] E2E Playwright тесты — все маршруты 200, /admin загружается
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: test
- **Depends on**: T13, T18, T19, T20, T21
- **Input**: все страницы реализованы.
- **Output**:
  - `playwright.config.ts` — baseURL = `http://localhost:4321`, webServer = `pnpm preview`, projects: chromium + mobile (`devices['iPhone 13']`).
  - `tests/e2e/pages.spec.ts` — assertions: GET / /works /works/project-01 /about /services /contact /privacy /404 — все 200, заголовок страницы непустой, Header/Footer присутствуют.
  - `tests/e2e/admin.spec.ts` — GET /admin/ → загружается, видна форма логина Decap (не идём дальше OAuth, потому что в CI без реальных кредов).
  - `tests/e2e/form.spec.ts` — happy path: заполнить ContactForm + чекбокс consent → сабмит → ожидать `{ ok: true }` (mock-mode Worker). Negative path: заполнить без consent → submit blocked, запрос не уходит.
  - `package.json` скрипты `test:e2e`, `test:e2e:ui`.
  - CI workflow расширен — Playwright job.
- **Acceptance criteria**:
  - [ ] `pnpm test:e2e` локально зелёный.
  - [ ] В CI Playwright проходит.
- **Tests required**:
  - [ ] Тесты как самостоятельный артефакт.
- **Constitution check**: №3 (E2E — часть quality gate).
- **Implementation notes**:
  - В `webServer.command` использовать `pnpm build && pnpm preview` — так тесты гоняются по реальному билду.

---

### [T31] Финальная QA-проверка на превью + закрытие ep01
- **Phase**: Phase 4 — SEO, Performance, Deploy, Guide, Polish
- **Type**: test
- **Depends on**: T27, T28, T29, T30
- **Input**: всё на превью, гайд написан, README готов.
- **Output**:
  - Чек-лист «Готово к передаче в ep02» в `docs/ep01-portfolio/log.md`:
    - [ ] Lighthouse mobile на 8 страницах (`/`, `/works`, `/works/project-01..04`, `/about`, `/services`, `/contact`, `/privacy`, `/404`) ≥ 95.
    - [ ] /admin login → edit → save → commit → rebuild → видно изменение.
    - [ ] Форма с превью отдаёт `{ok: true}` (mock-mode); без consent — submit blocked.
    - [ ] TG-виджет рендерит ≥3 постов; payload prosanitised (XSS-тест из T15 зелёный).
    - [ ] Все 4 проекта видны, кликабельны, у каждого видна плашка «концепт-проект».
    - [ ] /privacy отдаёт 200, ссылки из CookieBanner и ContactForm работают.
    - [ ] Cookie banner поведение корректно (показывается раз, после OK не появляется).
    - [ ] `curl -I` главной показывает CSP + X-Content-Type-Options + Referrer-Policy + Permissions-Policy + X-Frame-Options.
    - [ ] Branch protection включён в GitHub Settings: direct push в main отвергнут, PR без зелёных checks нельзя merge.
    - [ ] Activation-чек-лист в `guide-for-svetlana-activation.md` (или соответствующем разделе) присутствует и читается отдельно.
    - [ ] Favicon + apple-touch-icon отдаются (200, без 404 в Network).
  - Закрытие эпика — в `CLAUDE.md` обновить статус `ep01-portfolio: ✅ Done`.
- **Acceptance criteria**:
  - [ ] Все пункты чек-листа отмечены.
  - [ ] Обновлён статус в CLAUDE.md → ep02 готов к старту.
- **Tests required**:
  - [ ] Сам чек-лист.
- **Constitution check**: все 7.
- **Implementation notes**:
  - Если хоть один пункт упал — fix перед закрытием, ep02 не стартует.

---

## Execution Order (Waves)

```
── Wave 1 (no dependencies) ──────────────────────────────
   T01: Bootstrap repo + Astro minimal + TS strict

── Wave 2 (after T01) ────────────────────────────────────
   T02: Astro integrations + Tailwind tokens-placeholder
   T05: ESLint + Prettier + scripts                ║ parallel
   T06: Repo hygiene (gitignore, env.example, nvmrc) ║ parallel
   T12: GitHub OAuth Worker (workers/oauth/)        ║ parallel — независим
   T23: Submit Worker (workers/submit/)             ║ parallel — независим

── Wave 3 (after T02) ────────────────────────────────────
   T03: Fonts self-host                              ║ parallel
   T04: Base Layout.astro skeleton                   ║ parallel
   T07: Zod content collections schemas              ║ parallel

── Wave 4 (after T07) ────────────────────────────────────
   T08: Seed 4 projects + placeholder images          ║ parallel
   T09: Seed 3 services + 4 page docs                 ║ parallel
   T10: Seed contacts.json + seo.json                 ║ parallel

── Wave 5 (after T08, T09, T10) ──────────────────────────
   T11: Decap admin shell + config.yml

── Wave 6 (after T11, T12) ───────────────────────────────
   T13: Wire Decap backend + local smoke-test

── Wave 7 (after T04, T10) ───────────────────────────────
   T14: Header + Footer                              ║ parallel
   T15: telegram-feed.ts + unit-test                 ║ parallel
   T22: SEO components + format.ts + utils           ║ parallel

── Wave 8 (after T14 etc.) ───────────────────────────────
   T16: Home (Hero + Manifesto + TelegramFeed)        ║ parallel — needs T14, T15, T09
   T17: Works listing + ProjectCard                   ║ parallel — needs T14, T08
   T19: About + Services + Contact-no-form            ║ parallel — needs T14, T09, T10
   T21: 404 + CookieBanner                            ║ parallel — needs T14
   T21a: /privacy page (152-ФЗ stub)                  ║ parallel — needs T14, T09

── Wave 9 (after Wave 8) ─────────────────────────────────
   T18: Project detail [slug] + ProjectMeta + Gallery ║ needs T17
   T20: ContactForm + consent + wiring                ║ needs T19, T21a, T23

── Wave 10 (after Wave 9) ────────────────────────────────
   T24: sitemap + robots + OG default                 ║ parallel
   T24a: CSP + security headers (_headers)            ║ parallel — needs T22, T24
   T25: Image pipeline verify                         ║ parallel

── Wave 11 (after T24, T24a, T25) ────────────────────────
   T26: Lighthouse CI workflow + branch protection

── Wave 12 (after T26, T13, T23) ─────────────────────────
   T27: CF Pages project + env vars + prod deploy
   T30: E2E Playwright tests                          ║ parallel

── Wave 13 (after T27) ───────────────────────────────────
   T28: guide-for-svetlana.md + activation checklist  ║ parallel
   T29: README.md (incl. branch protection setup)     ║ parallel

── Wave 14 (after Wave 13) ───────────────────────────────
   T31: Final QA + закрытие ep01
```

---

## Critical Path

Самая длинная цепочка зависимостей (минимальная продолжительность ep01):

🔴 **T01 → T02 → T07 → T08 → T11 → T13 → T14 → T17 → T18 → T26 → T27 → T28 → T31**

(13 задач, любая задержка здесь сдвигает finish ep01.)

### Маркировка

- 🔴 **Critical path**: T01, T02, T07, T08, T11, T13, T14, T17, T18, T26, T27, T28, T31
- 🟡 **Important** (зависят критические, но есть slack): T04, T09, T10, T15, T16, T19, T20, T21, T21a, T22, T23, T24, T24a, T25, T30
- 🟢 **Flexible** (можно сдвинуть): T03, T05, T06, T12, T29

---

## Progress Tracker

### Wave 1
- [x] T01: Bootstrap repo + Astro minimal + TS strict

### Wave 2
- [x] T02: Astro integrations (Tailwind 4 + sitemap + check) и токены-заглушки
- [x] T05: ESLint + Prettier + npm-скрипты
- [x] T06: Repo hygiene — .gitignore, .env.example, README-скелет
- [x] T12: GitHub OAuth Worker (workers/oauth/) + деплой + secrets
- [ ] T23: Submit Worker (`workers/submit/`)

### Wave 3
- [x] T03: Self-host шрифты Inter + Fraunces
- [x] T04: Базовый Layout.astro skeleton
- [x] T07: Zod-схемы контент-коллекций

### Wave 4
- [x] T08: Сидирование 4 проектов + placeholder-фото
- [x] T09: Сидирование 3 услуг + 5 страничных текстов (incl. privacy)
- [x] T10: Сидирование settings (contacts.json + seo.json)

### Wave 5
- [x] T11: Decap admin shell + config.yml

### Wave 6
- [x] T13: Wire Decap backend to OAuth + local smoke-test

### Wave 7
- [ ] T14: Header.astro + Footer.astro
- [ ] T15: telegram-feed.ts + unit-test
- [ ] T22: SEO components + format.ts utils

### Wave 8
- [ ] T16: Home (Hero + ManifestoBlock + TelegramFeed)
- [ ] T17: Works listing + ProjectCard
- [ ] T19: About + Services + Contact (no form)
- [ ] T21: 404 + CookieBanner
- [ ] T21a: /privacy stub page (152-ФЗ)

### Wave 9
- [ ] T18: Project detail + ProjectMeta + ImageGallery
- [ ] T20: ContactForm + ПДн consent + wiring

### Wave 10
- [ ] T24: sitemap + robots + default OG image
- [ ] T24a: CSP + security headers (public/_headers)
- [ ] T25: Image pipeline verify

### Wave 11
- [ ] T26: Lighthouse CI workflow + бюджет 95+ + branch protection

### Wave 12
- [ ] T27: CF Pages project + env vars + первый prod-деплой
- [ ] T30: E2E Playwright тесты

### Wave 13
- [ ] T28: guide-for-svetlana.md + activation checklist
- [ ] T29: README.md (incl. branch protection setup)

### Wave 14
- [ ] T31: Финальная QA + закрытие ep01

---

## First Task Brief — T01

> Готовый промпт для Claude (можно копировать как первое сообщение в новой сессии).

**Контекст**: ep01-portfolio, задача T01 — Bootstrap repo + Astro minimal + TypeScript strict.

**Цель**: создать каркас Astro-проекта в `c:\Proj\Svetik-design\`, подключить к GitHub, запустить `pnpm dev` и убедиться, что заглушка-главная видна.

**Шаги**:

1. **Подтвердить prereqs**:
   - Node 22.x (`node -v`)
   - pnpm 9.x (`pnpm -v`); если нет — `corepack enable && corepack prepare pnpm@latest --activate`.

2. **Создать `.nvmrc`** в корне с содержимым `22`.

3. **Инициализировать Astro проект** (в текущей директории, не создавая подпапку):
   ```powershell
   pnpm create astro@latest . --template minimal --typescript strict --no-install --no-git --skip-houston
   ```
   Если интерактивный prompt спрашивает «directory not empty» — выбрать «Continue» (в репо уже есть `CLAUDE.md`, `docs/`, `Portfolio/`, `Contacts/`, `Diplom/` — это нормально).

4. **`pnpm install`**.

5. **Проверить `tsconfig.json`** — должен `extends: "astro/tsconfigs/strict"`.

6. **Проверить, что `pnpm dev` поднимает Astro**:
   ```powershell
   pnpm dev
   ```
   Открыть `http://localhost:4321` — должна быть видна стартовая заглушка Astro. Закрыть сервер.

7. **Проверить `pnpm build`** — должен создать `dist/` без ошибок.

8. **Создать GitHub repo** (вручную бра́том в Dashboard, private, name `svetik-design`). Затем:
   ```powershell
   git init -b main
   git remote add origin git@github.com:<owner>/svetik-design.git
   ```

9. **Первый commit**:
   - Создать минимальный `.gitignore`: `node_modules/`, `dist/`, `.astro/`, `.env`, `.DS_Store`. (Полный `.gitignore` — задача T06.)
   - `git add -A`
   - `git commit -m "ep01-portfolio T01: bootstrap Astro minimal + TS strict"`
   - `git push -u origin main`

**Проверка успеха**:

- [ ] `pnpm dev` показывает заглушку на `localhost:4321`.
- [ ] `pnpm build` зелёный, `dist/index.html` существует.
- [ ] `pnpm astro --version` показывает Astro 5.x.
- [ ] `git log --oneline` показывает первый commit.
- [ ] `git remote -v` показывает `origin`.

**Замечания**:

- Существующие папки `Portfolio/`, `Contacts/`, `Diplom/`, `docs/`, `CLAUDE.md` НЕ удалять — это исходники проекта.
- Не подключаем Tailwind / sitemap / шрифты / Layout в T01 — это отдельные задачи T02, T03, T04.
- Если `pnpm create astro` не может справиться с непустой папкой — fallback: создать в `_astro-tmp/`, перенести файлы вручную, удалить временную папку.

**Конец брифа.**
