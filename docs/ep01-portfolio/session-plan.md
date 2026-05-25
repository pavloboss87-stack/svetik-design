# Session plan — ep01-portfolio

> Декомпозиция исполнения эпика на 13 сессий. Цель: каждую сессию запускать в чистом окне Claude Code, не упираясь в лимит контекста и не теряя качества.
>
> Источник задач: [`tasks.md`](tasks.md). Каждая сессия покрывает 1–6 задач из waves плана. Внутри сессии используется `/my-execute ep01-portfolio` — он сам читает task-спеки, коммитит per task и ведёт `log.md`.
>
> Если внутри сессии что-то идёт не по плану — Claude переходит в ручной режим или останавливается и зовёт тебя.

---

## Карта сессий

| Session | Задачи | Цель (что работает после) | Зависимости (что должно быть до) |
|---|---|---|---|
| **A — Foundation** | T01, T02, T03, T04, T05, T06 | `pnpm dev` показывает заглушку с Layout, Tailwind, шрифтами, favicon. Lint/typecheck зелёные. | GitHub repo создан вручную (бра́т) |
| **B — Content schema + seeds** | T07, T08, T09, T10 | `pnpm build` зелёный, 4 проекта + 3 услуги + 5 страниц + settings засеяны и валидируются Zod | Session A |
| **C — Decap admin + OAuth + smoke-test** | T11, T12, T13 | `/admin` локально открывается, login через GitHub OAuth работает, edit→save→commit→rebuild цепочка проверена | Session B, GitHub OAuth App создан бра́том вручную |
| **D — Submit Worker** | T23 | Worker `/api/submit` задеплоен, отвечает 200 в mock-mode, все unit-тесты зелёные | Session A |
| **E — Layout components + TG feed + SEO utils** | T14, T15, T22 | Header/Footer на всех заглушка-страницах, `fetchTelegramFeed` работает с тестами, MetaTags/SchemaPerson/YandexMetrica/format готовы | Session B |
| **F — Three main pages** | T16, T17, T19 | `/`, `/works`, `/about`, `/services`, `/contact` (без формы) — все 200, рендерят контент | Session E |
| **G — Detail + 404 + Cookie + Privacy** | T18, T21, T21a | `/works/{slug}` отдают 200 с галереей, `/404`, CookieBanner, `/privacy` готовы | Session F |
| **H — Contact form + consent** | T20 | Форма на `/contact` с consent-чекбоксом отправляет в Worker и получает 200 (mock) | Session G, Session D |
| **I — SEO assets + CSP + image verify** | T24, T24a, T25 | sitemap.xml, robots.txt, OG-картинка по умолчанию, `public/_headers` с CSP, image pipeline подтверждён | Session H |
| **J — CI + CF Pages deploy** | T26, T27 | GitHub Actions workflow зелёный (lint/typecheck/lighthouse), branch protection включён, превью на `*.pages.dev` живой | Session I |
| **K — E2E Playwright** | T30 | `pnpm test:e2e` зелёный локально и в CI; все маршруты + форма покрыты | Session H, Session J |
| **L — Documentation** | T28, T29 | `guide-for-svetlana.md` + activation checklist + полный `README.md` готовы | Session J |
| **M — Final QA + close ep01** | T31 | Чек-лист передачи в ep02 заполнен, CLAUDE.md статус обновлён | Все предыдущие |

**Critical path:** A → B → C → F → G → H → I → J → K → L → M (11 последовательных сессий). D и E можно сделать параллельно с критическим путём в отдельных окнах при желании.

---

## Шаблон промпта для каждой сессии

Каждая сессия использует одинаковую структуру. Скопируй промпт под нужной сессией в **новое** окно Claude Code (для гарантии чистого контекста).

```
# Session <ID> — <название>

Эпик: ep01-portfolio. Эта сессия покрывает задачи: T##, T##, ...

## Холодный старт — прочитай по порядку
1. CLAUDE.md (constitution + epics).
2. docs/vision.md (продуктовый и архитектурный обзор).
3. docs/ep01-portfolio/plan.md — секции, релевантные задачам этой сессии (project structure, data model, key decisions).
4. docs/ep01-portfolio/tasks.md — шапка с Definition of Done + полные брифы задач T##, T## этой сессии + Progress Tracker.
5. docs/ep01-portfolio/log.md если существует — что было сделано в предыдущих сессиях.

## Sanity-check состояния
- git log --oneline -15 — последние коммиты предыдущих сессий должны быть видны и соответствовать ожиданию (см. «Pre-flight» ниже).
- pnpm install прошёл? Если нет — выполни.
- pnpm build / pnpm typecheck — должны быть зелёными на текущем состоянии (если нет — что-то сломалось в предыдущей сессии, остановись и сообщи).

## Pre-flight (что уже должно работать)
<список>

## Цель сессии
<one-liner>

## Что делать
Запусти `/my-execute ep01-portfolio` для задач T##, T##, ... в порядке зависимостей по Waves плана.

Каждая задача:
- Сверь acceptance criteria из tasks.md.
- Пройди DoD из шапки tasks.md.
- Отдельный commit формата `ep01 T## <короткое описание>`.
- Чекбокс в Progress Tracker отмечен.
- Запись в `docs/ep01-portfolio/log.md`.

## Exit-критерии (без них сессия не закрыта)
<список>

## Если что-то не так
- Acceptance не сходится → диагностируй, чини, не закрывай задачу частично.
- Заблокирован внешним шагом (создание OAuth App, регистрация CF Worker и т.п.) → остановись, сформулируй точный запрос пользователю.
- Контекст превысил ~150k токенов → останови сессию, оформи partial-commit, опиши состояние в log.md, попроси пользователя запустить новую сессию.

## После завершения
- Обнови Progress Tracker.
- Запиши итог сессии в log.md.
- Подскажи пользователю следующую сессию: «Session <X+1> — <название>».
```

---

## Промпты по сессиям

### Session A — Foundation

**Pre-flight (должно уже быть):** GitHub repo `svetik-design` создан вручную бра́том (private), `git remote add origin` ещё **не** сделан в локальной папке. В `c:\Proj\Svetik-design\` есть `CLAUDE.md`, `docs/`, `Portfolio/`, `Contacts/`, `Diplom/`. Node 22 + pnpm 9 установлены.

```
# Session A — Foundation

Эпик: ep01-portfolio. Задачи: T01, T02, T03, T04, T05, T06 (Wave 1–3).

## Холодный старт
1. Прочитай CLAUDE.md, docs/vision.md, docs/ep01-portfolio/plan.md (Steps 1, 3, 4), docs/ep01-portfolio/tasks.md (шапка DoD + брифы T01..T06 + Progress Tracker + First Task Brief в конце для T01).
2. Проверь node -v (≥22) и pnpm -v (≥9); если нет — corepack enable; corepack prepare pnpm@latest --activate.

## Pre-flight
- В корне есть только исходники (CLAUDE.md, docs/, Portfolio/, Contacts/, Diplom/) — нет node_modules, package.json и т.п.
- GitHub repo `svetik-design` создан бра́том (узнай URL у пользователя, если ещё не задал).

## Цель сессии
`pnpm dev` поднимает Astro на localhost:4321, видна заглушка с подключёнными Layout/Tailwind/шрифтами/favicon. `pnpm lint`, `pnpm typecheck`, `pnpm build` — все зелёные. Первые 6 коммитов в main.

## Что делать
Запусти `/my-execute ep01-portfolio` строго в порядке: T01 → T02 (параллельно с T05, T06) → T03 (параллельно с T04, T07 — но T07 НЕ в этой сессии).

В этой сессии порядок:
1. T01: bootstrap Astro minimal + TS strict + первый push в origin.
2. T02: интеграции (Tailwind 4 + sitemap + check) + tokens-placeholder.
3. T05: ESLint + Prettier + npm-скрипты.
4. T06: .gitignore + .env.example + README-скелет.
5. T03: self-host шрифтов Inter + Fraunces.
6. T04: базовый Layout.astro + favicon + apple-touch-icon.

## Exit-критерии
- [ ] git log --oneline показывает 6 коммитов вида `ep01 T0X ...`.
- [ ] pnpm dev → localhost:4321 → видна заглушка с Inter/Fraunces подгруженными локально (DevTools Network: ноль запросов к fonts.googleapis.com).
- [ ] curl -I http://localhost:4321/favicon.svg → 200; то же для favicon.ico, apple-touch-icon.png.
- [ ] pnpm build, pnpm typecheck, pnpm lint — все зелёные.
- [ ] Progress Tracker для T01..T06 отмечен.
- [ ] log.md создан, итог сессии записан.

## Следующая сессия
Session B — Content schema + seeds.
```

---

### Session B — Content schema + seeds

**Pre-flight:** Session A завершена. Astro+Tailwind+шрифты+Layout работают. `pnpm build` зелёный.

```
# Session B — Content schema + seeds

Эпик: ep01-portfolio. Задачи: T07, T08, T09, T10 (Wave 3–4).

## Холодный старт
1. CLAUDE.md, docs/vision.md, docs/ep01-portfolio/plan.md (Step 5 Data Model полностью), docs/ep01-portfolio/tasks.md (DoD + брифы T07..T10), docs/ep01-portfolio/log.md.
2. Просмотри Portfolio/1, Portfolio/2, Portfolio/3, Portfolio/4 (что там за исходники), Contacts/Cont.txt, Diplom/.

## Pre-flight
- git log -10 показывает завершённую Session A (6 коммитов T01..T06).
- pnpm dev / pnpm build зелёные на чистом скелете.

## Цель сессии
`src/content.config.ts` описан, 4 проекта + 3 услуги + 5 страничных текстов (включая privacy) + contacts.json + seo.json засеяны. `pnpm build` зелёный. `getCollection('projects')` возвращает 4 записи, `getCollection('services')` — 3, `getEntry('pages', 'about')` отдаёт запись с непустым authorPhoto.

## Что делать
`/my-execute ep01-portfolio` для T07 → T08, T09, T10 (последние три параллельны, но в одной сессии — последовательно).

Особое внимание:
- T07 — поле `isConcept: boolean default(true)` и поле `authorPhoto?: image()` на pages — это критично для последующих задач.
- T08 — все 4 проекта seed с `isConcept: true, published: true`. Watermark не убираем.
- T09 — privacy.md с заметной шапкой «⚠️ ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ». authorPhoto на about.md — placeholder из src/assets/about/.
- T10 — точные handle'ы из Contacts/Cont.txt; email = example@email.com (заглушка).
- На всех заглушка-текстах — никаких штампов из Constitution Принципа 1. Сделай `grep -ri` после сидирования.

## Exit-критерии
- [ ] git log -10 показывает 4 новых коммита T07..T10.
- [ ] pnpm build зелёный.
- [ ] getCollection('projects').length === 4, getCollection('services').length === 3.
- [ ] grep по словарю штампов в src/content/ — пусто.
- [ ] Попытка положить тестовый .md без title — pnpm build падает с понятной ошибкой (после теста — удалить).
- [ ] Progress Tracker для T07..T10 отмечен.
- [ ] log.md обновлён.

## Следующая сессия
Session C — Decap admin + OAuth + smoke-test.
```

---

### Session C — Decap admin + OAuth + smoke-test

**Pre-flight:** Session B завершена. Контент засеян, схемы валидируются. **Внешнее:** бра́т должен создать GitHub OAuth App перед этой сессией (или Claude остановится и попросит).

```
# Session C — Decap admin + OAuth + smoke-test

Эпик: ep01-portfolio. Задачи: T11, T12, T13 (Wave 5–6).

## Холодный старт
1. CLAUDE.md, docs/vision.md, docs/ep01-portfolio/plan.md (Step 4 Architecture, Step 5 Decap map, Step 7), docs/ep01-portfolio/tasks.md (DoD + брифы T11, T12, T13), docs/ep01-portfolio/log.md.
2. Прочитай документацию Decap CMS config.yml для актуальных widget-имён (если есть локальный context7 MCP — используй).

## Pre-flight
- git log показывает завершённые Session A+B (10 коммитов).
- GitHub OAuth App создан бра́том вручную в GitHub Settings → Developer settings → OAuth Apps:
  - Application name: svetik-design admin
  - Homepage URL: https://svetik-design.pages.dev (заглушка ок)
  - Authorization callback URL: <будет URL Worker'а — заполнить после деплоя T12, или временно localhost>
  - Client ID + Client Secret получены и переданы тебе или сохранены безопасно
- Если не сделано — остановись на T12 и попроси пользователя.

## Цель сессии
- `/admin/` локально открывается, показывает Decap UI с 9 коллекциями на русском.
- OAuth Worker задеплоен на `*.workers.dev`.
- Smoke-test: login → edit project-01.md (например, summary) → save → commit появляется в репо → pnpm dev пересобирает → видно.

## Что делать
`/my-execute ep01-portfolio` для T11 → T12 → T13.

T11: public/admin/index.html + config.yml (все коллекции, русские лейблы, isConcept widget, authorPhoto widget, privacy page).
T12: workers/oauth/ — OAuth proxy, wrangler deploy на CF, secrets через wrangler secret put. Если GitHub OAuth App ещё не создан — остановись и попроси пользователя.
T13: связать backend в config.yml, локальный smoke-test.

## Exit-критерии
- [ ] git log показывает 3 новых коммита T11..T13.
- [ ] localhost:4321/admin/ → Decap UI, 9 коллекций, лейблы на русском, виден чекбокс isConcept и image-widget authorPhoto.
- [ ] OAuth Worker URL получен (запиши в log.md).
- [ ] Smoke-test пройден: при изменении проекта через admin в репо появился commit, pnpm build зелёный.
- [ ] Progress Tracker T11..T13 отмечен.

## Следующая сессия
Session D — Submit Worker (можно параллельно с E, F или после C — на твоё усмотрение). Critical path — Session F.
```

---

### Session D — Submit Worker

**Pre-flight:** Session A завершена (нужен только репо и Node-environment). Не зависит от B/C.

```
# Session D — Submit Worker

Эпик: ep01-portfolio. Задача: T23 (Wave 2, но в этой сессии отдельно для фокуса).

## Холодный старт
1. CLAUDE.md (Принципы 3, 5, 6), docs/ep01-portfolio/plan.md (Step 7 API design — POST /api/submit), docs/ep01-portfolio/tasks.md (DoD + бриф T23), docs/ep01-portfolio/log.md.
2. Документация Cloudflare Workers (wrangler.toml format, Cache API для rate-limit, secrets).

## Pre-flight
- Session A завершена.
- Бра́т имеет аккаунт Cloudflare с правами создавать Workers.

## Цель сессии
- workers/submit/ — Worker с валидацией (включая consent === true), rate-limit 5/час, mock-mode, CORS, honeypot.
- Unit-тесты покрывают: happy path, validation failures (consent missing, message > 500), honeypot, rate-limit (включая concurrent burst), CORS, mock-mode.
- Worker задеплоен на submit.svetik-design.workers.dev (или аналог); URL сохранён.

## Что делать
`/my-execute ep01-portfolio` для T23.

Особое внимание:
- mock-mode — если любой из TELEGRAM_BOT_TOKEN / OWNER_CHAT_ID / SMTP_USER / SMTP_PASS отсутствует, return 200 {ok:true, mock:true} + console.warn.
- consent === true в payload обязателен; иначе 400 с кодом consent_required.
- Honeypot заполнен → 200 silently, console.log маркер `[honeypot-drop]` отличный от `[mock]`.
- Rate-limit: concurrent-burst test обязателен (Promise.all 6 запросов от одного IP).

## Exit-критерии
- [ ] git log показывает коммит ep01 T23 ...
- [ ] cd workers/submit && pnpm test зелёный, все ветки покрыты.
- [ ] curl -X POST <worker-url> -d '{"name":"x","contact":"x@x.x","message":"x","consent":true}' → 200 mock.
- [ ] curl без consent → 400 consent_required.
- [ ] URL Worker'а записан в log.md (для использования в Session H — Form wiring).
- [ ] Progress Tracker T23 отмечен.

## Следующая сессия
Если Session C не сделана — делай её сейчас. Иначе Session E — Layout components + TG feed + SEO utils.
```

---

### Session E — Layout components + TG feed + SEO utils

**Pre-flight:** Sessions A + B завершены (нужны контент-коллекции и Layout skeleton).

```
# Session E — Layout components + TG feed + SEO utils

Эпик: ep01-portfolio. Задачи: T14, T15, T22 (Wave 7).

## Холодный старт
1. CLAUDE.md (Принципы 1, 3, 7), docs/ep01-portfolio/plan.md (Step 4 архитектура, Step 5 contacts schema, Step 10 Key Decisions про TG-виджет), docs/ep01-portfolio/tasks.md (DoD + брифы T14, T15, T22), docs/ep01-portfolio/log.md.

## Pre-flight
- Sessions A, B завершены. T04 Layout skeleton существует. T10 contacts.json засеян.

## Цель сессии
- Header.astro + Footer.astro работают, читают из contacts.json.
- `src/lib/telegram-feed.ts` парсит t.me/s/Golovina_design_ambersoftloft, санитизирует текст, юнит-тесты покрывают XSS-payload и graceful-fail.
- MetaTags + SchemaPerson + YandexMetrica + src/lib/seo.ts + src/lib/format.ts готовы и подключены в Layout.

## Что делать
`/my-execute ep01-portfolio` для T14, T15, T22 (параллельны по зависимостям, но в одной сессии — последовательно).

Особое внимание:
- T15 — санитизация. Используй textContent, не innerHTML. URL валидируй через new URL() с проверкой https. Тест с `<script>alert(1)</script>` в теле поста — обязателен.
- T14 — никаких штампов в текстах футера. «Самозанятая. Налог на профессиональный доход» — допустимо как факт.
- T22 — YandexMetrica загружается только после consent (читает localStorage из будущего T21).

## Exit-критерии
- [ ] git log показывает 3 новых коммита T14, T15, T22.
- [ ] pnpm test зелёный (включая XSS-тест в telegram-feed).
- [ ] На главной (заглушка) виден Header (даже если ссылки 404) и Footer с 4 каналами.
- [ ] При живом запуске fetchTelegramFeed возвращает >=3 поста (или [] с warn, если Telegram временно недоступен — это допустимо).
- [ ] view-source главной показывает SchemaPerson JSON-LD.
- [ ] Progress Tracker T14, T15, T22 отмечен.

## Следующая сессия
Session F — Three main pages.
```

---

### Session F — Three main pages

**Pre-flight:** Sessions A + B + E завершены. Layout + Header/Footer + TG-feed + SEO работают.

```
# Session F — Three main pages (Home + Works listing + About/Services/Contact-no-form)

Эпик: ep01-portfolio. Задачи: T16, T17, T19 (Wave 8 partial).

## Холодный старт
1. CLAUDE.md (Принципы 1, 3, 7), docs/ep01-portfolio/plan.md (Step 4, Step 7 routing), docs/ep01-portfolio/tasks.md (DoD + брифы T16, T17, T19), log.md.

## Pre-flight
- Sessions A, B, E завершены. Header/Footer/SEO готовы. Контент засеян. fetchTelegramFeed работает.

## Цель сессии
- / отдаёт 200, Hero (заглушка) + Manifesto (заглушка) + ссылка на /works + TelegramFeed (3-5 постов).
- /works отдаёт 200, сетка из 4 ProjectCard с плашкой «концепт-проект» на каждой.
- /about, /services, /contact (без формы) отдают 200, рендерят контент. authorPhoto на about виден.
- src/lib/sortProjects.ts выделен и покрыт unit-тестами (T17 sort/filter test).

## Что делать
`/my-execute ep01-portfolio` для T16, T17, T19 (параллельны по зависимостям).

Особое внимание:
- T17 — выделить sortProjects.ts отдельным файлом для тестируемости (не inline в .astro).
- T19 — services фильтруются по published; пустой список → fallback «Услуги в разработке».
- T19 — authorPhoto рендерится через Astro `<Image />` с fallback на серый блок если поле undefined.

## Exit-критерии
- [ ] git log показывает 3 новых коммита T16, T17, T19.
- [ ] curl http://localhost:4321/ /works /about /services /contact — все 200.
- [ ] DevTools Network на /works — фото отдаются как .avif/.webp.
- [ ] pnpm test зелёный (sortProjects.test.ts).
- [ ] Lighthouse mobile на / и /works ≥ 95 по 4 метрикам (локальный preview).
- [ ] Progress Tracker T16, T17, T19 отмечен.

## Следующая сессия
Session G — Detail + 404 + Cookie + Privacy.
```

---

### Session G — Detail + 404 + CookieBanner + Privacy

**Pre-flight:** Session F завершена.

```
# Session G — Project detail + 404 + CookieBanner + /privacy

Эпик: ep01-portfolio. Задачи: T18, T21, T21a (Wave 8 + Wave 9 partial).

## Холодный старт
1. CLAUDE.md, docs/ep01-portfolio/plan.md (Step 4, Step 7), docs/ep01-portfolio/tasks.md (DoD + брифы T18, T21, T21a), log.md.

## Pre-flight
- Session F завершена. Three main pages работают.

## Цель сессии
- /works/project-01..04 отдают 200, рендерят meta + concept body + gallery. Плашка isConcept видна.
- /404 рендерится при заходе на несуществующий URL.
- CookieBanner появляется на первом заходе, исчезает после OK, не появляется при reload.
- /privacy отдаёт 200 с заметной шапкой «⚠️ ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ».

## Что делать
`/my-execute ep01-portfolio` для T18, T21, T21a (параллельны).

Особое внимание:
- T18 — getStaticPaths фильтрует по published. Тест: временно поставить published: false на тестовом файле → пересобрать → /works/test/ не существует → вернуть как было.
- T21a — /privacy НЕ попадает в Header navigation, только в Footer + CookieBanner-ссылка.
- T21 — ссылка из CookieBanner на /privacy теперь резолвится (после T21a).

## Exit-критерии
- [ ] git log показывает 3 новых коммита T18, T21, T21a.
- [ ] curl /works/project-01..04 — все 200, видны фото в gallery.
- [ ] curl /404 — 404 status, рендерится Layout.
- [ ] curl /privacy — 200, ссылка из CookieBanner ведёт сюда.
- [ ] DevTools: cleared storage → CookieBanner виден → OK → ушёл → reload → не виден.
- [ ] Lighthouse mobile на /privacy и /works/project-01 ≥ 95.
- [ ] Progress Tracker T18, T21, T21a отмечен.

## Следующая сессия
Session H — Contact form. Перед запуском убедись, что Session D (Worker) тоже завершена.
```

---

### Session H — Contact Form + consent

**Pre-flight:** Sessions G + D завершены. Worker URL в log.md.

```
# Session H — ContactForm + ПДн consent + Worker wiring

Эпик: ep01-portfolio. Задача: T20 (Wave 9).

## Холодный старт
1. CLAUDE.md (Принцип 2 — 152-ФЗ контекст), docs/ep01-portfolio/plan.md (Step 7 POST /api/submit), docs/ep01-portfolio/tasks.md (DoD + бриф T20 + бриф T23 для API контракта), log.md.

## Pre-flight
- Session G завершена. /contact с ContactChannels работает.
- Session D завершена. Worker URL зафиксирован в log.md.
- /privacy (T21a) работает.

## Цель сессии
- ContactForm на /contact: поля + honeypot + обязательный consent-чекбокс с ссылкой на /privacy + maxLength 500 на message.
- Submit без consent блокируется на фронте.
- Submit с consent → POST в Worker → 200 mock → UI «Заявка отправлена».
- Сетевая ошибка → UI ошибки с возможностью повторить.

## Что делать
`/my-execute ep01-portfolio` для T20.

Особое внимание:
- Чекбокс consent НЕ pre-checked (152-ФЗ требует активное действие).
- payload включает consent: true.
- Vanilla JS, никаких React/Vue.
- PUBLIC_SUBMIT_URL читается из import.meta.env.

## Exit-критерии
- [ ] git log показывает коммит ep01 T20.
- [ ] Ручная проверка: без галочки — submit заблокирован, запрос не уходит.
- [ ] Ручная проверка: с галочкой — POST в Worker, body содержит consent: true, ответ 200, UI «Заявка отправлена».
- [ ] Message 501 символ — submit блокируется на фронте.
- [ ] Ссылка «политика обработки персональных данных» из формы ведёт на /privacy 200.
- [ ] Lighthouse mobile на /contact ≥ 95.
- [ ] Progress Tracker T20 отмечен.

## Следующая сессия
Session I — SEO assets + CSP + image verify.
```

---

### Session I — SEO assets + CSP + image verify

**Pre-flight:** Session H завершена.

```
# Session I — sitemap + robots + OG + CSP headers + image pipeline verify

Эпик: ep01-portfolio. Задачи: T24, T24a, T25 (Wave 10).

## Холодный старт
1. CLAUDE.md (Принцип 3), docs/ep01-portfolio/plan.md (Step 4 architecture), docs/ep01-portfolio/tasks.md (DoD + брифы T24, T24a, T25), log.md.

## Pre-flight
- Session H завершена. Все страницы и формы работают. URL Submit Worker'а и OAuth Worker'а зафиксированы в log.md.

## Цель сессии
- dist/sitemap-index.xml содержит все public страницы, /admin исключён.
- public/robots.txt с allow + sitemap ссылкой + disallow /admin.
- OG-картинка default.png 1200×630 на месте.
- public/_headers с CSP (для main и для /admin отдельно) + X-Content-Type-Options + Referrer-Policy + Permissions-Policy + X-Frame-Options.
- Подтверждено: оригиналы фото не отдаются, рендерятся AVIF/WebP responsive variants.

## Что делать
`/my-execute ep01-portfolio` для T24, T24a, T25 (параллельны).

Особое внимание:
- T24a — CSP для /admin/* отдельная (Decap нужен unpkg.com + api.github.com + OAuth Worker URL + возможно unsafe-eval). Для остальных путей строгая CSP. Включи Submit Worker URL в connect-src и form-action.
- T24a — комментарий в _headers объясняет каждый разрешённый источник.
- T25 — пройди руками /, /works, /works/project-01 в DevTools Network: для cover карточек ≤800px, для gallery ≤1200px.

## Exit-критерии
- [ ] git log показывает 3 новых коммита T24, T24a, T25.
- [ ] pnpm build → dist/sitemap-index.xml, dist/robots.txt, dist/_headers существуют.
- [ ] /admin отсутствует в sitemap.
- [ ] Документ-чеклист image widths записан в код-комменты или в log.md.
- [ ] Lighthouse mobile на всех страницах ≥ 95 (Best Practices не должно ухудшиться от CSP).
- [ ] Progress Tracker T24, T24a, T25 отмечен.

## Следующая сессия
Session J — CI workflow + CF Pages deploy.
```

---

### Session J — CI workflow + CF Pages deploy

**Pre-flight:** Session I завершена. **Внешнее:** аккаунт Cloudflare у бра́та с правами создавать Pages-проекты.

```
# Session J — Lighthouse CI + branch protection + CF Pages prod deploy

Эпик: ep01-portfolio. Задачи: T26, T27 (Wave 11–12).

## Холодный старт
1. CLAUDE.md (Принцип 3), docs/ep01-portfolio/plan.md (Step 6 Phase 4), docs/ep01-portfolio/tasks.md (DoD + брифы T26, T27), log.md.
2. Документация treosh/lighthouse-ci-action v12 (актуальные опции).

## Pre-flight
- Session I завершена. Все security headers и assets готовы.
- У бра́та доступ к Cloudflare Pages dashboard и к GitHub Settings → Branches.

## Цель сессии
- .github/workflows/ci.yml: lint, typecheck, lighthouse jobs. Все зелёные на свежем PR.
- Lighthouse бюджет в .lighthouserc.json: 0.95 на 4 метриках mobile.
- Branch protection включён бра́том вручную в GitHub: required checks (lint, typecheck, lighthouse), require PR before merge, disallow direct push. Шаги задокументированы.
- CF Pages проект svetik-design создан, привязан к репо, env vars прописаны (PUBLIC_SITE_URL, PUBLIC_METRIKA_ID, PUBLIC_SUBMIT_URL).
- https://svetik-design.pages.dev/ отдаёт собранный сайт.

## Что делать
`/my-execute ep01-portfolio` для T26 → T27.

Особое внимание:
- T26 — после workflow готов, попроси пользователя включить branch protection через GitHub UI (Settings → Branches → Add rule). Без этого Принцип 3 enforcement не работает.
- T27 — manual шаги в CF Pages dashboard: проект, build settings (pnpm install --frozen-lockfile && pnpm build), output dist/, Node 22. После первого деплоя — проверь URL руками.
- Yandex.Metrica counter ID — пользователь должен его выдать. Если нет — оставь PUBLIC_METRIKA_ID пустым (T22 graceful-no-op), отметь в activation checklist (Session L).

## Exit-критерии
- [ ] git log показывает 2 коммита T26, T27.
- [ ] PR с CI запущен; lint, typecheck, lighthouse — все green.
- [ ] Попытка direct push в main отвергнута GitHub'ом (branch protection).
- [ ] https://svetik-design.pages.dev/ → 200, виден сайт.
- [ ] https://svetik-design.pages.dev/admin/ → Decap login page (не падает).
- [ ] https://svetik-design.pages.dev/contact → форма → submit → 200 mock.
- [ ] Скриншот build-логов CF Pages сохранён в log.md или docs/guide-screenshots/.
- [ ] Progress Tracker T26, T27 отмечен.

## Следующая сессия
Session K — E2E Playwright тесты.
```

---

### Session K — E2E Playwright

**Pre-flight:** Session J завершена. Превью URL живой.

```
# Session K — E2E Playwright (все маршруты + form happy/negative + admin)

Эпик: ep01-portfolio. Задача: T30 (Wave 12).

## Холодный старт
1. CLAUDE.md (Принцип 3), docs/ep01-portfolio/tasks.md (DoD + бриф T30), log.md.

## Pre-flight
- Session J завершена. Сайт на превью, CI зелёный.

## Цель сессии
- playwright.config.ts с chromium + iPhone 13 проектами.
- tests/e2e/pages.spec.ts: GET /, /works, /works/project-01, /about, /services, /contact, /privacy, /404 — все 200, Header/Footer присутствуют.
- tests/e2e/admin.spec.ts: /admin/ загружается, виден Decap login.
- tests/e2e/form.spec.ts: happy path (с consent → 200 mock), negative path (без consent → submit blocked).
- CI workflow расширен — добавлен e2e job, проходит зелёным.

## Что делать
`/my-execute ep01-portfolio` для T30.

Особое внимание:
- webServer.command — pnpm build && pnpm preview (тесты идут по реальному билду, не dev-серверу).
- В CI Playwright требует apt-получения зависимостей браузера — учти в workflow (`pnpm exec playwright install --with-deps`).

## Exit-критерии
- [ ] git log показывает коммит ep01 T30.
- [ ] pnpm test:e2e локально зелёный (оба браузера-проекта).
- [ ] CI workflow в GitHub Actions показывает e2e job зелёный.
- [ ] Branch protection обновлён: e2e check добавлен в required (попроси пользователя).
- [ ] Progress Tracker T30 отмечен.

## Следующая сессия
Session L — Documentation.
```

---

### Session L — Documentation (heavy writing)

**Pre-flight:** Session J завершена. Превью URL живой, активация секретов задокументирована.

```
# Session L — guide-for-svetlana.md + activation checklist + README

Эпик: ep01-portfolio. Задачи: T28, T29 (Wave 13).

## Холодный старт
1. CLAUDE.md (Принципы 1, 2, 6, 7), docs/vision.md, docs/ep01-portfolio/plan.md (Step 9 — состав гайда), docs/ep01-portfolio/tasks.md (DoD + брифы T28, T29), log.md.
2. Освежи в памяти все принятые решения: какие имена ботов/чатов, какой OAuth flow, как настраивается Метрика и т.д. (см. log.md).

## Pre-flight
- Session J завершена. Превью URL и Worker URLs зафиксированы в log.md.

## Цель сессии
- docs/guide-for-svetlana.md (расширенная версия, 10–11 разделов) — нетехнический пользователь читает от начала до конца, каждая инструкция кликабельна.
- docs/guide-for-svetlana-activation.md (или отдельный раздел в конце основного гайда с заметным заголовком) — на 1 экран, 13 пунктов чек-листа активации перед запуском.
- README.md (для разработчика-преемника): prereqs, как поднять, структура, точки поломки, раздел «Branch protection setup», раздел «CSP при добавлении нового сервиса».

## Что делать
`/my-execute ep01-portfolio` для T28 → T29.

Особое внимание:
- T28 — стиль гайда: короткие фразы, никаких штампов (Принцип 1 применяется и к гайду тоже). Скриншоты в docs/guide-screenshots/.
- Activation-чек-лист — главный «контракт передачи». Должен читаться как чек-лист, не как параграф.
- HEIC-предупреждение для iPhone — явный отдельный пункт.
- README — лаконичный, не дублируй CLAUDE.md/vision.md, ссылайся.
- Сессия может разрастись по контексту (много текста). Если приближаешься к 150k токенов — закоммить промежуточное, открой следующую под-сессию.

## Exit-критерии
- [ ] git log показывает коммиты T28, T29.
- [ ] docs/guide-for-svetlana.md существует, содержит 10+ разделов, скриншоты приложены.
- [ ] Activation-чек-лист — отдельный артефакт или явный раздел, 13+ пунктов, читается за минуту.
- [ ] README.md обновлён, содержит Branch protection setup и CSP-гайдлайн.
- [ ] Внутренняя проверка: пройди раздел «Админка» по гайду на чистой машине — получилось?
- [ ] Progress Tracker T28, T29 отмечен.

## Следующая сессия
Session M — Final QA + закрытие ep01.
```

---

### Session M — Final QA + закрытие ep01

**Pre-flight:** Все предыдущие 12 сессий завершены.

```
# Session M — Финальная QA-проверка + закрытие ep01

Эпик: ep01-portfolio. Задача: T31 (Wave 14).

## Холодный старт
1. CLAUDE.md (все 7 Принципов — финальный проход), docs/ep01-portfolio/plan.md, docs/ep01-portfolio/tasks.md (DoD + бриф T31 + полный Progress Tracker), log.md (полная история).

## Pre-flight
- Sessions A–L все завершены. Progress Tracker заполнен на 100%.

## Цель сессии
- Чек-лист «Готово к передаче в ep02» в docs/ep01-portfolio/log.md заполнен (12 пунктов из T31).
- Каждый пункт проверен руками или ссылкой на CI-ран.
- CLAUDE.md обновлён: статус ep01-portfolio → ✅ Done.
- Эпик готов к старту ep02.

## Что делать
`/my-execute ep01-portfolio` для T31.

Особое внимание:
- Lighthouse mobile проверяется на 8 страницах: /, /works, /works/project-01..04 (выборочно 1 проект), /about, /services, /contact, /privacy, /404. Все ≥ 95 по 4 метрикам.
- /admin login → edit → save → commit → rebuild → видно изменение — пройди вручную на превью.
- curl -I главной показывает 5 security headers (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options).
- Branch protection: попытка direct push в main отвергается.
- Если хоть один пункт упал — НЕ закрывай эпик. Чини, потом возвращайся.

## Exit-критерии
- [ ] Все 12 пунктов чек-листа T31 отмечены.
- [ ] git log показывает коммит ep01 T31.
- [ ] CLAUDE.md: ep01-portfolio: ✅ Done.
- [ ] Финальная запись в log.md: «ep01-portfolio закрыт <date>. Следующий: ep02-design-and-copy».

## После
Эпик ep01-portfolio закрыт. Можно запускать `/my-research ep02-design-and-copy` для следующего эпика.
```

---

## Между сессиями

### Что делает пользователь между сессиями

1. **Проверь финальные коммиты** последней сессии: `git log --oneline -10`.
2. **Проверь Progress Tracker** в `docs/ep01-portfolio/tasks.md` — чекбоксы на новых задачах отмечены.
3. **Прочитай запись в `log.md`** — что было сделано, нет ли непредвиденных решений.
4. **Если есть внешние задачи** (создать OAuth App, выдать Yandex.Metrica ID, включить branch protection) — выполни их перед стартом следующей сессии.
5. **Закрой текущее окно Claude Code**.
6. **Открой новое окно**, вставь промпт следующей сессии.

### Когда останавливаться и звать пользователя посреди сессии

- Acceptance criteria не сходятся даже после диагностики — не закрывай задачу частично.
- Нужен внешний доступ (Cloudflare dashboard, GitHub OAuth App, секреты), которого нет у Claude.
- Контекст приближается к 150k токенов — лучше закоммить промежуточное и открыть новое окно.
- Решение требует продуктового выбора, не зафиксированного в plan.md (например, какой именно текст privacy-заглушки писать).

### Файлы для проверки между сессиями

- `docs/ep01-portfolio/log.md` — что было сделано.
- `docs/ep01-portfolio/tasks.md` — Progress Tracker.
- `CLAUDE.md` — статус эпика.
- `git log --oneline` — коммиты.

---

## Если /my-execute ведёт себя не так

Промпты предполагают, что `/my-execute ep01-portfolio` принимает список задач и идёт по ним. Если на практике скилл работает иначе:

- Запускай его без аргументов — он сам подберёт следующую `pending` задачу из Progress Tracker.
- После каждой задачи проверяй коммит и тогда запускай снова на следующую.
- Если скилл не предусматривает фильтр по списку — просто работай в порядке Wave из tasks.md, остановись по достижении границы сессии.
