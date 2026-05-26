# Tasks — ep02-design-and-copy

> Декомпозиция [`plan.md`](plan.md) в атомарные задачи. Дата: 2026-05-26. Эпик ratified, статус 🔄 Active. Каждая задача — ≤ 60 минут работы Claude / редактора, с конкретным acceptance criteria и проверкой по Constitution. Phase 1 → Phase 5 — порядок жёсткий между фазами; внутри фазы задачи параллелятся согласно Waves.

---

## Step 3 — Task List

### [T01] Замена `@fontsource-variable/fraunces` → `@fontsource/pt-serif` (cyrillic-only initial)

- **Phase**: 1 — Типографика и токены
- **Type**: setup
- **Depends on**: none
- **Input**: [package.json](../../package.json), [src/styles/global.css](../../src/styles/global.css)
- **Output**: `package.json` без `@fontsource-variable/fraunces`, с `@fontsource/pt-serif`; `global.css` с импортами **только cyrillic-subset** (3 файла: 400/700/400-italic) и `@theme { --font-display: 'PT Serif', ... }`; `pnpm-lock.yaml` обновлён.
- **Acceptance criteria**:
  - [ ] **Pre-flight**: после `pnpm add @fontsource/pt-serif` проверить фактическое содержимое `node_modules/@fontsource/pt-serif/` и зафиксировать в комментарии к коммиту точные имена файлов CSS-импортов (структура `@fontsource`-пакета может отличаться от ожидаемой)
  - [ ] `@fontsource-variable/fraunces` отсутствует в `package.json` и в `pnpm-lock.yaml`
  - [ ] `@fontsource/pt-serif` присутствует в `dependencies`
  - [ ] `global.css` импортирует **только cyrillic subset** PT Serif: cyrillic-400-normal, cyrillic-700-normal, cyrillic-400-italic (точные имена файлов — по результату pre-flight). Latin subset намеренно не подключается на этой стадии (сайт RU-only в ep02)
  - [ ] `@theme` блок: `--font-display: 'PT Serif', ui-serif, Georgia, 'Times New Roman', serif;`
  - [ ] `pnpm install` отрабатывает без ошибок, `pnpm build` собирает проект
- **Tests required**:
  - [ ] `pnpm build` зелёный (smoke-сборка)
  - [ ] Если в Phase 1 визуально обнаружится отсутствующий latin-глиф (например, в техническом тексте `ООО „ДИСКИЛЛ"`, в названии услуги или в `<code>`) — latin-400-normal добавляется в этом же PR. Без обнаружения — не добавлять.
- **Constitution check**: Rule 6 (минимум новых зависимостей — одна замена, одна добавка; и минимум CSS-импортов — только то, что используется), Rule 5 (free `@fontsource`, бюджет не растёт), Rule 3 (Lighthouse Perf — проактивная экономия CSS-веса)
- **Implementation notes**: cyrillic-only-first — это проактивная стратегия под Rule 3. 3 импорта вместо 6 = ~50% экономия CSS-веса шрифтового слоя. Latin добавляется только если визуально нужен, не «на всякий случай». PT Serif от Paratype в `@fontsource` обычно поставляет subsets отдельными CSS-файлами (`cyrillic-400-normal.css`, `latin-400-normal.css` и т.д.) — это и есть гипотеза, которую проверяет pre-flight. Для preload — отдельный шаг T05.

---

### [T02] Финальная шкала в `src/styles/tokens.css`

- **Phase**: 1 — Типографика и токены
- **Type**: ui
- **Depends on**: none (можно параллельно с T01)
- **Input**: [src/styles/tokens.css](../../src/styles/tokens.css) (текущий placeholder из ep01)
- **Output**: финальные CSS custom properties — типографическая шкала, leading, tracking, spacing, минимальная палитра
- **Acceptance criteria**:
  - [ ] Типографическая шкала `--text-xs` ... `--text-display` определена через modular ratio (1.25 или 1.333 — design call в комментарии к коммиту)
  - [ ] Leading: `--leading-tight` / `--leading-normal` / `--leading-relaxed`
  - [ ] Tracking: `--tracking-tight` / `--tracking-normal` / `--tracking-wide`
  - [ ] Spacing: `--space-1` ... `--space-32` на едином grid (4px или 8px)
  - [ ] Палитра: `--ink`, `--paper`, `--accent-neutral` (минимум, без лишних оттенков)
  - [ ] Все имена токенов — стандартные, повторно используются в `global.css @theme`
- **Tests required**:
  - [ ] `pnpm build` зелёный — токены валидны
  - [ ] Визуальная сверка: открыть `/` и `/works/project-01` после T01+T02 — типографика рендерится в PT Serif/Inter без визуальных дефектов
- **Constitution check**: Rule 6 (минимум токенов, никаких «на будущее»); Rule 1 (визуальный язык поддерживает копирайт)
- **Implementation notes**: tokens.css — single source of truth для масштабов; Tailwind 4 `@theme` использует те же значения через `var(--...)`. Точные числа — итеративная калибровка автора; в этой задаче допустимо зафиксировать v1, точечно корректировать в T07.

---

### [T03] Установка IOPaint локально (prerequisite Phase 2)

- **Phase**: 2 — Ретушь watermark pilot
- **Type**: setup (manual user)
- **Depends on**: none
- **Input**: [docs/guide-for-svetlana.md](../guide-for-svetlana.md) — раздел про IOPaint
- **Output**: рабочий IOPaint на машине автора с предзагруженной моделью LaMa
- **Acceptance criteria**:
  - [ ] `iopaint start --model=lama --device=cpu` запускается без ошибок
  - [ ] Локальный веб-UI открывается в браузере
  - [ ] Можно загрузить тестовое изображение и применить mask-стирание
- **Tests required**:
  - [ ] Manual: на одном кадре `Portfolio/4/01.jpg` пройти полный цикл «загрузка → mask → inpaint → export» (без сохранения в репо)
- **Constitution check**: Rule 5 (IOPaint open-source, бесплатно)
- **Implementation notes**: эта задача — для автора (Светлана/брат), не для Claude. Если IOPaint уже стоит с ep01 — задача отмечается выполненной.

---

### [T04] Fonttools-инспекция PT Serif на полноту кириллицы

- **Phase**: 1 — Типографика и токены
- **Type**: test
- **Depends on**: T01
- **Input**: установленный `node_modules/@fontsource/pt-serif/files/*.woff2`
- **Output**: подтверждение (запись в PR description или log.md), что все нужные глифы присутствуют во всех весах; либо триггер fallback-плана (Onest single-sans).
- **Acceptance criteria**:
  - [ ] В файлах `pt-serif-cyrillic-400-normal.woff2`, `-700-normal.woff2`, `-400-italic.woff2` через wakamai-fondue.netlify.app или `fc-query` подтверждено: `ё` (U+0451), `Ё` (U+0401), `ъ`, `ь`, `й` (U+0439), `Й` (U+0419) присутствуют
  - [ ] Курсивный `й` рендерится корректно (визуальная проверка в браузере на тестовой странице)
  - [ ] Если хотя бы один глиф/вес отсутствует — задача выходит в **fallback**: оформить отдельный issue, переключить план на Вариант A (Onest single-sans); T01 переделать с `@fontsource/onest`
- **Tests required**:
  - [ ] Визуальная проверка курсивного `й` на тестовой HTML-странице (или прямо в `/works/project-01` после T01+T05)
- **Constitution check**: Rule 1 (русский текст обязан рендериться правильным шрифтом — silent fallback на Georgia запрещён)
- **Implementation notes**: это структурный stop-loss от silent bug ep01. Если PT Serif прошёл — двигаемся дальше; если нет — переключаем шрифт до того, как написан копирайт.

---

### [T05] Preload-hints для critical fonts в `Layout.astro`

- **Phase**: 1 — Типографика и токены
- **Type**: ui
- **Depends on**: T01
- **Input**: [src/components/layout/Layout.astro](../../src/components/layout/Layout.astro) — на сегодня в `<head>` нет ни одного `<link rel="preload">` для шрифтов (проверено в ep01 коде), только favicon и meta-теги
- **Output**: добавить `<link rel="preload" as="font" type="font/woff2" crossorigin>` для двух наиболее критичных файлов: PT Serif cyrillic-400-normal (для display) и Inter 400 latin (для body — большая часть UI). 700-вес PT Serif и 500/600 Inter не preload-ить — они нужны выборочно, swap-задержка приемлема.
- **Acceptance criteria**:
  - [ ] В `<head>` Layout.astro добавлены ровно два `<link rel="preload" as="font" type="font/woff2" crossorigin>`: PT Serif `cyrillic-400-normal.woff2` и Inter 400 (latin)
  - [ ] Никаких preload-hints для Fraunces не остаётся (на сегодня их и нет — проверка профилактическая)
  - [ ] `font-display: swap` подтверждён в сгенерированном CSS (`@fontsource` ставит по умолчанию, но `pnpm build` → grep `font-display:swap` в `dist/_astro/*.css`)
  - [ ] DevTools → Network → Font: оба preload-файла качаются с приоритетом High на старте загрузки страницы; PT Serif 700 и остальные веса Inter — Low/medium (загружаются по факту использования)
- **Tests required**:
  - [ ] Lighthouse mobile локально → `unused-preload-links` audit не флагует (только реально используемые preloads); `font-display` audit зелёный
- **Constitution check**: Rule 3 (Lighthouse 95+; preload-hints критичны для LCP); Rule 6 (минимум preload-hints — только то, что реально критично для первого экрана, не «на всякий случай»)
- **Implementation notes**: путь к `.woff2` файлам внутри `@fontsource/pt-serif/files/` и `@fontsource/inter/files/`; точное имя файла лучше резолвить через Astro-импорт (`import ptSerifReg from '@fontsource/pt-serif/files/pt-serif-cyrillic-400-normal.woff2'`), чтобы Astro-fingerprint работал. Если PT Serif 700 cyrillic визуально критичен на Hero (зависит от итогового размера/веса заголовка в Hero после T07) — добавить третий preload-link, но только по факту, не «впрок».

---

### [T06] Подключить шрифты прода в `public/admin/index.html`

- **Phase**: 1 — Типографика и токены
- **Type**: ui
- **Depends on**: T01
- **Input**: [public/admin/index.html](../../public/admin/index.html) — на сегодня файл содержит только Decap bootstrap `<script>` и не подключает никаких шрифтов (проверено); preview-pane сейчас рендерит русский текст системным шрифтом браузера
- **Output**: добавить в `<head>` подключение PT Serif (cyrillic subset) и Inter через CDN — preview-pane Decap визуально совпадает с публичной страницей
- **Acceptance criteria**:
  - [ ] **Pre-flight**: проверить рабочий CDN-URL для `@fontsource/pt-serif` через jsDelivr (`https://cdn.jsdelivr.net/npm/@fontsource/pt-serif@<actual-version>/`) — открыть `index.css` пакета и убедиться, что он отдаётся 200 OK. Если jsDelivr не отдаёт `@fontsource/` пакеты под нужным путём (известный edge case для некоторых пакетов) — fallback на Google Fonts CDN с явным cyrillic-subset для PT Serif
  - [ ] В `<head>` admin/index.html добавлены CDN-ссылки на PT Serif (cyrillic) и Inter (точные URL — по pre-flight)
  - [ ] Открыть `/admin/`, зайти в редактор страницы → preview-pane рендерит русский текст в PT Serif (не системным Georgia)
- **Tests required**:
  - [ ] Manual: запустить `pnpm dev`, открыть `/admin/`, проверить preview pane на странице (Hero/About) — заголовки в PT Serif
- **Constitution check**: Rule 2 (админка показывает то же, что прод; редактор не должен «удивиться» после publish)
- **Implementation notes**: Decap CMS не использует наш Astro bundler — нужен прямой CDN-импорт. Не self-host: добавлять `.woff2` в `public/` ради admin'а — overkill, CDN-задержка для admin-страницы приемлема (Rule 6).

---

### [T07] Hero.astro — типографическая калибровка Schema 1

- **Phase**: 1 — Типографика и токены
- **Type**: ui
- **Depends on**: T02
- **Input**: [src/components/home/Hero.astro](../../src/components/home/Hero.astro) — ep01 версия уже text-only (без `<img>` / `<picture>` / фона; проверено). Текст подтягивается из `src/content/pages/hero.md`. CTA на сегодня **отсутствует**.
- **Output**: типографическая калибровка существующего text-only Hero по Schema 1 из research.md → Step 4.2 (размер заголовка, ритм, max-width, использование токенов из T02); добавление CTA «Смотреть работы»; место под финальный copy из T12
- **Acceptance criteria**:
  - [ ] Hero остаётся text-only (без `<img>` / `<picture>` / фонового изображения — проверка профилактическая)
  - [ ] Используются токены из T02: `--font-display`, шкала размеров, leading-tight для display-заголовка
  - [ ] **Добавлен CTA «Смотреть работы»** (новая разметка, не было в ep01), ведёт на `/works`; стиль — тонкая ссылка/кнопка под основным блоком, без визуального шума
  - [ ] Mobile-first: на 360px ширине заголовок не переполняет, читается без горизонтального скролла
  - [ ] Desktop ≥1024px — заголовок не растягивается на всю ширину (max-width на читаемость 10–12 слов в строке)
  - [ ] Существующий placeholder-текст из `src/content/pages/hero.md` визуально читается как «временный» в новой типографике (финал в T12) — например, явный комментарий в frontmatter или sentinel-строка, не выдающая себя за финал
- **Tests required**:
  - [ ] Визуальная проверка в `pnpm dev` на mobile (DevTools 360×640) и desktop (1280×800)
  - [ ] `pnpm test:e2e -- pages.spec.ts` зелёный (существующий e2e на наличие Hero не сломан); если в pages.spec.ts нет проверки CTA — добавить one-liner на наличие `<a href="/works">` в Hero
- **Constitution check**: Rule 7 (Hero без stock-фото и без обещаний); Rule 6 (минимум разметки — крупный заголовок + sub-line + один CTA, ничего больше)
- **Implementation notes**: Schema 1 = крупный display-заголовок, тонкая разделительная линия (опционально), sub-line с указанием на услугу через body-шрифт, одинарный CTA. Никаких каруселей/анимаций. CTA — это новая разметка, в ep01 её нет; не пытаться «вернуть» — добавить от нуля. Поле под текст ~25–60 слов из T12.

---

### [T08] Batch-ретушь watermark на 4 кадрах project-04

- **Phase**: 2 — Ретушь watermark pilot
- **Type**: data (manual)
- **Depends on**: T03
- **Input**: оригиналы 4 кадров project-04 (`Portfolio/4/*.jpg` или текущие `src/assets/projects/project-04/01..04.jpg` с watermark Homestyler)
- **Output**: 4 retouched JPEG без видимого watermark, временно хранятся вне репо до приёмки
- **Acceptance criteria**:
  - [ ] Watermark Homestyler не виден ни на одном из 4 кадров
  - [ ] Нет видимых артефактов inpainting на месте watermark (текстура/градиент совпадает с окружением)
  - [ ] Цвет и геометрия неизмененных областей совпадают с оригиналами
  - [ ] Размер файлов в пределах разумного (≤ 500KB после JPEG-оптимизации)
  - [ ] Если 1–2 кадра вышли с артефактами → пройти их через Cleanup.pictures (fallback из guide-for-svetlana.md)
- **Tests required**:
  - [ ] Manual side-by-side сравнение «до/после» на всех 4 кадрах
- **Constitution check**: Rule 7 (honest presentation — watermark уход не превращает концепт в «реальный объект»; концепт-флаг остаётся)
- **Implementation notes**: задача для автора, не для Claude. LaMa в IOPaint обычно отрабатывает однородный фон с одного прохода; сложные участки — догнать вторым прогоном с более узкой маской. Сохранить EXIF исходников для трассировки.

---

### [T09] Playwright regression test — typography.spec.ts

- **Phase**: 1 — Типографика и токены
- **Type**: test
- **Depends on**: T01, T07
- **Input**: [tests/e2e/](../../tests/e2e/) (существующие admin/form/pages spec'ы)
- **Output**: новый файл `tests/e2e/typography.spec.ts` — проверка resolved `font-family` на русском display-заголовке
- **Acceptance criteria**:
  - [ ] Создан `tests/e2e/typography.spec.ts`
  - [ ] Тест открывает `/works/project-01` (страница с русским `<h1>`)
  - [ ] Считывает `window.getComputedStyle(h1).fontFamily` через `page.evaluate`
  - [ ] Утверждает, что строка содержит `PT Serif` (case-insensitive); ассертит **отсутствие** падения на `Georgia`/`Times`/`serif` без префикса PT Serif
  - [ ] Тест локально проходит после T01+T07
  - [ ] `pnpm test:e2e` — все existing specs + новый зелёные
- **Tests required**:
  - [ ] Сам по себе test
  - [ ] Edge cases — что произойдёт, если PT Serif не загрузится: тест должен **падать**, не зелёнить ложно (проверить: временно сломать импорт в `global.css`, убедиться, что test красный, восстановить)
- **Constitution check**: Rule 1 (защита от silent fallback на не-кириллический шрифт — stop-loss от Fraunces 2.0); Rule 3 (Lighthouse не ловит resolved font-family, нужен явный e2e)
- **Implementation notes**: Playwright `page.evaluate` + `getComputedStyle`. Дождаться `document.fonts.ready` перед чтением, иначе race condition.

---

### [T10] Phase 1 PR — Lighthouse CI + merge

- **Phase**: 1 — Типографика и токены
- **Type**: deploy
- **Depends on**: T01, T02, T04, T05, T06, T07, T09, T26, T27
- **Input**: ветка `feature/ep02-typography` со всеми коммитами T01..T09
- **Output**: PR с зелёным CI (Lighthouse mobile 95+ на всех 4 метриках, e2e tests зелёные), смёрджен в `main`
- **Acceptance criteria**:
  - [ ] PR открыт против `main`
  - [ ] Lighthouse CI на preview-деплое: Performance ≥ 95, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile)
  - [ ] Если какая-либо метрика < 95 — оптимизация в той же ветке (unicode-range subset, font-display tuning, удаление unused weights) до merge
  - [ ] `pnpm test:e2e` зелёный на CI
  - [ ] PR description ссылается на `docs/ep02-design-and-copy/plan.md` Phase 1
  - [ ] Merge → preview-деплой `*.workers.dev` показывает PT Serif на русских заголовках
- **Tests required**:
  - [ ] Полный CI gate (Lighthouse + Playwright)
- **Constitution check**: Rule 3 (порог 95+ — блокирующий); Rule 6 (никаких новых зависимостей сверх PT Serif)
- **Implementation notes**: если Lighthouse Performance падает из-за PT Serif веса — попробовать оставить только regular+bold cyrillic+latin subset, italic — оставить только latin (русский italic используется редко).

---

### [T11] Phase 2 PR — replace project-04 assets, merge

- **Phase**: 2 — Ретушь watermark pilot
- **Type**: data
- **Depends on**: T08
- **Input**: 4 retouched JPEG из T08; текущий `src/content/projects/project-04.md` с путями `cover` и `gallery`
- **Output**: in-place замена файлов в `src/assets/projects/project-04/01..04.jpg`; PR `feature/ep02-pilot-images` смёрджен в `main`
- **Acceptance criteria**:
  - [ ] 4 JPEG в `src/assets/projects/project-04/` физически заменены retouched-версиями
  - [ ] Имена файлов совпадают со старыми (`cover` и `gallery` пути в `project-04.md` не меняются)
  - [ ] Astro `<Image />` pipeline собирает новые ассеты (`pnpm build` зелёный)
  - [ ] Preview-деплой: `/works/project-04` показывает кадры без watermark
  - [ ] Lighthouse CI зелёный (новые JPEG не утяжелили страницу > порога)
- **Tests required**:
  - [ ] `pnpm build` зелёный
  - [ ] Visual on preview deploy
- **Constitution check**: Rule 7 (honest — концепт остаётся концептом, watermark уход не выдаёт за реальный объект); Rule 3 (LCP не должен ухудшиться)
- **Implementation notes**: имена `01.jpg ... 04.jpg` сохранить. Если retouched исходники крупнее — прогнать через `sharp` (`pnpm sharp --quality 82` или встроенный astro-pipeline сделает это автоматически).

---

### [T12] Hero copy — `src/content/pages/hero.md`

- **Phase**: 3 — Копирайт-сессия 1
- **Type**: docs (content)
- **Depends on**: T10, T11
- **Input**: [src/content/pages/hero.md](../../src/content/pages/hero.md) (placeholder ep01); research.md → Step 2.3 (чек-лист); CLAUDE.md Rule 1 + уточнение
- **Output**: финальный Hero-текст 25–60 слов от первого лица, без штампов; PR помечен «v1, до внешней редактуры»
- **Acceptance criteria**:
  - [ ] 25–60 слов в body (frontmatter не считается)
  - [ ] Первое лицо единственного числа («я», «работаю», не «мы»)
  - [ ] Ноль штампов из стоп-листа Constitution Rule 1 («уют», «функциональность», «пространства, в которых хочется жить», «индивидуальный подход», «не просто X, а Y», и т.д.)
  - [ ] Конкретные существительные/материалы/процесс — не общие апелляции
  - [ ] Текст написан Светланой как первичный draft; не сгенерирован Claude напрямую (Constitution Rule 1 уточнение)
  - [ ] Внутри файла или в PR description явная метка «v1, до внешней редактуры»
- **Tests required**:
  - [ ] Чек-лист антипаттернов research.md Step 2.3 пройден (вручную)
- **Constitution check**: **Rule 1 (центральный для этой задачи)**; Rule 7 (honest tone, junior)
- **Implementation notes**: Claude НЕ пишет первичный draft — это нарушение уточнения Rule 1. Claude может предложить структуру (что должно быть в Hero), но текст — рука автора. Если автор присылает draft на правку — Claude редактирует, не переписывает.

---

### [T13] About copy — `src/content/pages/about.md`

- **Phase**: 3 — Копирайт-сессия 1
- **Type**: docs (content)
- **Depends on**: T10, T11
- **Input**: [src/content/pages/about.md](../../src/content/pages/about.md); plan.md Phase 3 (структура трёх абзацев)
- **Output**: 250–400 слов; три абзаца по жёсткой структуре (подход → диплом одной строкой → отличие в работе с заказчиком); PR «v1, до внешней редактуры»
- **Acceptance criteria**:
  - [ ] 250–400 слов
  - [ ] Абзац 1: конкретный факт о подходе (с чего начинается проект, что для меня материал/масштаб/свет)
  - [ ] Абзац 2: диплом одной строкой, без апологии («диплом о профессиональной переподготовке, ООО „ДИСКИЛЛ", май 2026»)
  - [ ] Абзац 3: отличие в работе с заказчиком, через конкретные существительные
  - [ ] Ноль штампов; ноль фраз «я молодой дизайнер, который…», «my mission», «делаю с любовью»
  - [ ] Первичный draft автора (не Claude); внутренний review брата пройден
  - [ ] Метка «v1, до внешней редактуры»
- **Tests required**:
  - [ ] Чек-лист 2.3 пройден
- **Constitution check**: Rule 1; Rule 7 (junior подача без имитации senior)
- **Implementation notes**: тот же гайд про инструмент Claude, что и T12 — редактирует, не пишет.

---

### [T14] project-04 — summary + concept

- **Phase**: 3 — Копирайт-сессия 1
- **Type**: docs (content)
- **Depends on**: T10, T11
- **Input**: [src/content/projects/project-04.md](../../src/content/projects/project-04.md) (placeholder); 4 retouched-кадра из T11 как визуальный референс
- **Output**: финальный `summary` (≤200 символов) в frontmatter; финальный `concept` body 3–5 предложений; внутренний review брата
- **Acceptance criteria**:
  - [ ] `summary` ≤ 200 символов, одно ёмкое предложение про материал/типологию/отношение к участку
  - [ ] `concept` body — 3–5 предложений; структура: «что нашли (исходное состояние) → что хотели сохранить → центральное материальное решение → как это видно в кадрах»
  - [ ] Каждый абзац начинается с конкретного существительного, не с прилагательного-усилителя
  - [ ] Первое лицо; ноль штампов
  - [ ] `title` подтверждён с автором (например, «Дом в Подмосковье, 84 м²»)
  - [ ] `year` — год работы над концептом (подтверждён); `area`, `location` — без изменений
  - [ ] Метка «v1, до внешней редактуры»
- **Tests required**:
  - [ ] Astro Content Collections + Zod валидация зелёная (`pnpm build` пройдёт)
  - [ ] Чек-лист 2.3 пройден
- **Constitution check**: Rule 1 (центральный); Rule 7 (концепт-проект называется концепт-проектом — `isConcept: true` остаётся; визуальная плашка — снимается отдельно в T20)
- **Implementation notes**: pilot-текст становится шаблоном для project-01/02/03 в ep03; качество здесь критично. Если в процессе обнаружится, что 200 символов мало — обсудить с автором изменение поля схемы в ep03, **не расширять здесь**.

---

### [T15] Editorial review pass (Phase 3) + merge

- **Phase**: 3 — Копирайт-сессия 1
- **Type**: test (review)
- **Depends on**: T12, T13, T14
- **Input**: 3 артефакта Phase 3 (hero.md, about.md, project-04.md)
- **Output**: PR `feature/ep02-copy-core` смёрджен в `main`; редактура брата задокументирована как «до двух итераций, не больше»
- **Acceptance criteria**:
  - [ ] Брат-редактор прошёл чек-лист 2.3 research.md по всем 4 артефактам (Hero / About / summary / concept)
  - [ ] Правки внесены не более чем за две итерации редактуры. Если требуется третья итерация — это сигнал планирования: либо первичный draft не прошёл pre-review гейт, либо требования к тексту были недозафиксированы. В таком случае — пауза, ретроспектива (отдельная запись в `log.md`), затем продолжение
  - [ ] PR title или body содержит «v1, до внешней редактуры»
  - [ ] Lighthouse CI зелёный
  - [ ] Все existing e2e зелёные
  - [ ] Merge → preview deploy показывает финальные тексты
- **Tests required**:
  - [ ] CI gate
- **Constitution check**: Rule 1 (уточнение — человеческая редактура — обязательное условие выхода на main)
- **Implementation notes**: брат-редактор работает синхронно с автором в одной сессии (см. R2 research.md — регистр Hero/About/concept не должен разойтись). Не делать review асинхронным с большим лагом.

---

### [T16] Services intro — `src/content/pages/services-intro.md`

- **Phase**: 4 — Копирайт-сессия 2
- **Type**: docs (content)
- **Depends on**: T15
- **Input**: [src/content/pages/services-intro.md](../../src/content/pages/services-intro.md)
- **Output**: 80–150 слов; одно-два предложения о подходе к услугам в целом; регистр совпадает с Hero/About из Phase 3
- **Acceptance criteria**:
  - [ ] 80–150 слов
  - [ ] Передан подход (например, «работаю в трёх форматах в зависимости от объёма участия»)
  - [ ] Ноль штампов; первое лицо
  - [ ] Регистр откалиброван под Hero/About (читается как одна рука)
  - [ ] Метка «v1»
- **Tests required**:
  - [ ] Чек-лист 2.3
- **Constitution check**: Rule 1
- **Implementation notes**: служебный текст, но не «сухой» — голос Phase 3 должен присутствовать.

---

### [T17] 3 service bodies — full-design / supervision / consulting

- **Phase**: 4 — Копирайт-сессия 2
- **Type**: docs (content)
- **Depends on**: T15
- **Input**: [src/content/services/full-design.md](../../src/content/services/full-design.md), [supervision.md](../../src/content/services/supervision.md), [consulting.md](../../src/content/services/consulting.md)
- **Output**: 3 финальных body 120–180 слов каждое; жёсткая единая структура
- **Acceptance criteria**:
  - [ ] Каждый из 3 файлов: 120–180 слов
  - [ ] Жёсткая структура для всех трёх: (а) Что входит — 3–5 пунктов с конкретикой этапов; (б) Когда подходит — 1–2 фразы про типичный кейс; (в) Что на выходе — что заказчик получает «в руки»
  - [ ] Ноль штампов
  - [ ] Регистр совпадает с T16 + Phase 3
  - [ ] Метка «v1»
- **Tests required**:
  - [ ] Чек-лист 2.3 на каждом из 3
  - [ ] `pnpm build` зелёный (Zod schema services)
- **Constitution check**: Rule 1; Rule 6 (жёсткая единая структура — это явная простота, никаких отдельных шаблонов на каждую услугу)
- **Implementation notes**: писать в одной сессии, чтобы единый регистр держался. Не разбивать на 3 PR.

---

### [T18] Contact intro — `src/content/pages/contact-intro.md`

- **Phase**: 4 — Копирайт-сессия 2
- **Type**: docs (content)
- **Depends on**: T15
- **Input**: [src/content/pages/contact-intro.md](../../src/content/pages/contact-intro.md)
- **Output**: 40–80 слов; одна фраза о предпочитаемом канале связи + одна про формат первого разговора
- **Acceptance criteria**:
  - [ ] 40–80 слов
  - [ ] Указан предпочитаемый канал (Telegram/email — точно по предпочтению автора)
  - [ ] Указан формат первого разговора (бриф, что взять с собой, длительность — конкретно)
  - [ ] Ноль фраз «свяжитесь со мной, и я с радостью…», «жду ваших сообщений»
  - [ ] Метка «v1»
- **Tests required**:
  - [ ] Чек-лист 2.3
- **Constitution check**: Rule 1
- **Implementation notes**: короткий текст — высокая концентрация смысла. Лучше 45 слов точных, чем 75 общих.

---

### [T19] Снять UI-плашку «концепт-проект, фото в обработке» для project-04

- **Phase**: 4 — Копирайт-сессия 2
- **Type**: ui
- **Depends on**: T15
- **Input**: компонент UI, отображающий плашку (предположительно `src/components/projects/ProjectMeta.astro` или `ProjectCard.astro` — уточнить grep'ом по строке плашки в коде)
- **Output**: плашка скрыта для `project-04`; флаг `isConcept: true` в `project-04.md` остаётся как внутренний метаданный
- **Acceptance criteria**:
  - [ ] Plашка не отображается на `/works/project-04` (mobile + desktop)
  - [ ] Плашка по-прежнему отображается на project-01/02/03 (они остаются в pre-retouch состоянии)
  - [ ] Frontmatter `isConcept: true` в `project-04.md` сохранён
  - [ ] Логика отображения — точечная (например, доп. поле `showConceptBadge` или условие на наличие watermark-метки), не глобальный кейс «всех `isConcept` скрыть»
- **Tests required**:
  - [ ] Visual check `/works/project-04` (нет плашки) и `/works/project-01` (есть плашка)
  - [ ] `pnpm build` зелёный
- **Constitution check**: Rule 7 (продолжаем называть концепт концептом, но не вешаем «фото в обработке» на проект, где они уже не в обработке)
- **Implementation notes**: первым делом grep по существующему коду на строку плашки — найти компонент, понять текущую логику. Не вводить новое поле в схему контента без необходимости — можно решить через условие на наличие retouched-метки в gallery или через явный флаг `retouched: true` в frontmatter (опциональный).

---

### [T20] Визуальный обзор `/works/project-04` (finalized)

- **Phase**: 4 — Копирайт-сессия 2
- **Type**: test (manual visual)
- **Depends on**: T11, T14, T19, T17 (template применяется к проектам тоже)
- **Input**: preview-деплой ветки `feature/ep02-copy-services-contact`
- **Output**: чек-лист визуального обзора пройден, никаких quirks; правки шаблона (если найдены) — в том же PR
- **Acceptance criteria**:
  - [ ] Заголовок (title), metadata (year/type/area/location), summary, concept body, gallery — читаются как единое целое
  - [ ] Mobile (375px): нет горизонтального скролла, типографика читаема, gallery собирается в столбик
  - [ ] Desktop (1280px): пропорции gallery адекватны, нет «дырок» в layout
  - [ ] Шрифт всех элементов — PT Serif (display) / Inter (body); fallback'ов нет
  - [ ] Никаких visual quirks от смены шрифтов (line-height collapse, overflow, baseline-shift)
  - [ ] Плашки «концепт» нет
- **Tests required**:
  - [ ] Manual visual review, mobile + desktop
- **Constitution check**: Rule 1 (визуальный фрейминг копирайта); Rule 3 (не должно ронять Lighthouse)
- **Implementation notes**: если найден visual quirk — править шаблон в том же PR, не отдельным.

---

### [T21] Smoke-обход project-01/02/03 на placeholder-контенте

- **Phase**: 4 — Копирайт-сессия 2
- **Type**: test (manual visual)
- **Depends on**: T10, T11
- **Input**: preview-деплой
- **Output**: подтверждение, что шаблон не регрессировал на трёх остальных проектах
- **Acceptance criteria**:
  - [ ] `/works/project-01` рендерится без ошибок, типографика PT Serif/Inter, gallery работает
  - [ ] `/works/project-02` — то же
  - [ ] `/works/project-03` — то же
  - [ ] Все три — на placeholder-тексте (тексты для них будут в ep03), но визуально не сломаны
  - [ ] Особое внимание ImageGallery: галереи 3 кадров (project-01/02/03) vs. 4 кадра (project-04) — оба варианта работают
- **Tests required**:
  - [ ] Manual visual on preview deploy
- **Constitution check**: Rule 2 (то, что увидит сестра в админке, не должно сломаться)
- **Implementation notes**: эта задача может идти параллельно с T20. Если найдена регрессия в шаблоне — править в общем PR Phase 4.

---

### [T22] Phase 4 PR — merge

- **Phase**: 4 — Копирайт-сессия 2
- **Type**: deploy
- **Depends on**: T16, T17, T18, T19, T20, T21, T28
- **Input**: ветка `feature/ep02-copy-services-contact`
- **Output**: PR смёрджен в `main`; ep02 деплой-материально завершён (визуальный слой + копирайт on main)
- **Acceptance criteria**:
  - [ ] PR содержит все коммиты T16..T21
  - [ ] Lighthouse CI зелёный (95+ mobile все 4 метрики)
  - [ ] Все e2e тесты зелёные (включая typography.spec.ts из T09)
  - [ ] PR description перечисляет: 4 готовых текста, 3 service bodies, 1 UI правку плашки, smoke-обход
  - [ ] Метка «v1, до внешней редактуры» сохранена в PR
- **Tests required**:
  - [ ] CI gate
- **Constitution check**: Rule 3; Rule 1
- **Implementation notes**: после этого merge ep02 материально готов; остаются только close-out задачи Phase 5.

---

### [T23] Обновить `CLAUDE.md` — ep02 статус → ✅ Done

- **Phase**: 5 — Constitution update + close-out
- **Type**: docs
- **Depends on**: T22
- **Input**: [CLAUDE.md](../../CLAUDE.md) (Rule 1 уточнение уже добавлено при ratification плана; статус ep02 — 🔄 Active)
- **Output**: статус ep02 в таблице `## Epics` → ✅ Done
- **Acceptance criteria**:
  - [ ] В таблице `## Epics` строка ep02-design-and-copy → Status `✅ Done`
  - [ ] Rule 1 уточнение про placeholder/LLM-черновик — на месте (проверить, не сломалось ли при предыдущих коммитах)
  - [ ] Никаких других правок в CLAUDE.md (не добавлять новых принципов, не расширять описания)
- **Tests required**:
  - [ ] Visual diff CLAUDE.md — изменение точечное
- **Constitution check**: Rule 6 (минимум правок)
- **Implementation notes**: критически: ep03 в таблице остаётся `📋 Planned` — не переключать на Active в этом коммите. Activation ep03 — отдельное событие после /my-plan на ep03.

---

### [T24] Обновить `docs/vision.md` — Open Questions

- **Phase**: 5 — Constitution update + close-out
- **Type**: docs
- **Depends on**: T22 (можно параллельно с T23)
- **Input**: [docs/vision.md](../vision.md); research.md → Step 9b предложения по правкам
- **Output**: точечные правки в Open Questions: пункт 1 (эстетика → типографический настрой A/B/C, выбран B); пункт 2 (Hero — typographic в ep02, photo-decision в ep03)
- **Acceptance criteria**:
  - [ ] Open Question об эстетике обновлён: указан выбранный вариант B (PT Serif + Inter), ссылка на ep02 plan.md Key Decisions
  - [ ] Open Question об Hero обновлён: Schema 1 typographic в ep02; Schema 3 (photo-crop) — delegated decision для ep03
  - [ ] Прочие части vision.md — не трогаем
- **Tests required**:
  - [ ] Manual diff review — изменения точечные
- **Constitution check**: Rule 4 (контент в Git — vision.md в Git, обновление через PR, не SaaS)
- **Implementation notes**: эту задачу пользователь делает руками (плановое примечание Step 11 plan.md: «vision.md правки — отдельный пользовательский шаг»). Claude — только если попросят черновик.

---

### [T25] Записать финальную запись в `docs/ep02-design-and-copy/log.md` + Phase 5 PR

- **Phase**: 5 — Constitution update + close-out
- **Type**: docs / deploy
- **Depends on**: T23, T24
- **Input**: текущий `docs/ep02-design-and-copy/log.md` (создаётся `/my-execute` или вручную, если отсутствует)
- **Output**: финальная запись о статусе ep02 (что сделано, тексты «v1, до внешней редактуры», когда запланирована внешняя вычитка); PR Phase 5 смёрджен
- **Acceptance criteria**:
  - [ ] `log.md` существует (создан, если не было) и содержит запись с датой 2026-05-26 (или фактической датой close-out)
  - [ ] Запись фиксирует: 4 готовых текста (Hero/About/services-intro/contact-intro), 3 service bodies, project-04 финализирован (pilot), типографика PT Serif live
  - [ ] Запись фиксирует **открытый долг**: внешняя редактура текстов не пройдена (Constitution Rule 1 формально не закрыт); вычитка запланирована как параллельный поток
  - [ ] PR Phase 5 (`feature/ep02-closeout`) смёрджен в `main`
  - [ ] Lighthouse CI зелёный (контрольный)
- **Tests required**:
  - [ ] CI gate
- **Constitution check**: Rule 4 (история эпика — в Git); Rule 1 (открытый долг внешней редактуры явно зафиксирован, не замаскирован)
- **Implementation notes**: с этого merge ep02 — формально ✅ Done. Запуск ep03 — отдельным событием.

---

### [T26] Stop-list grep gate в CI

- **Phase**: 1 — Типографика и токены (можно идти параллельно с T01..T07)
- **Type**: test
- **Depends on**: none (нужен только Vitest, уже стоит в `devDependencies`)
- **Input**: список штампов из [CLAUDE.md](../../CLAUDE.md) → Принцип 1 (например, «уют и функциональность», «создаём пространства, в которых хочется жить», «стиль и комфорт», «ваш дом мечты», «индивидуальный подход», «превращаем в произведение искусства», «не просто X, а Y», «это больше чем дизайн»); все Markdown-файлы под `src/content/**`
- **Output**: новый Vitest-спек `tests/content/stop-list.spec.ts` (создать директорию, если её нет), который сканирует body всех `.md` в `src/content/` против стоп-листа и падает при любом совпадении (case-insensitive, с учётом возможных пунктуационных вариантов вроде «не просто — а»)
- **Acceptance criteria**:
  - [ ] Спек существует, запускается через `pnpm test`
  - [ ] Тест проходит на текущем содержимом `src/content/` (placeholder-тексты ep01 — проверить, что они уже не содержат штампов; если содержат — это отдельная находка, фиксируется как issue, не блокирует merge T26)
  - [ ] Намеренно временно вставленная штамп-фраза (например, «уют и функциональность») в любой `.md` под `src/content/` краснит тест — проверено локально, фраза удалена
  - [ ] Стоп-лист вынесен в массив на верх спека или в отдельный `tests/content/stop-list.ts` — чтобы пополнять было одной строкой
  - [ ] `pnpm test` встроен в CI workflow (проверить — если ещё нет в `.github/workflows/`, добавить шаг или зафиксировать как отдельную issue ep03)
- **Tests required**:
  - [ ] Сам по себе test
  - [ ] Negative test (см. acceptance) — что произойдёт, если штамп попадёт в коммит: CI красный
- **Constitution check**: Rule 1 — автоматизирует механическую половину уточнения Принципа 1 (детекцию запрещённых штампов). LLM-generated текст без штампов всё ещё проходит — это закрывается процессом (T12 implementation note), не автоматикой
- **Implementation notes**: Vitest подходит лучше Playwright (это unit-уровень, не нужен браузер). Парсинг Markdown — простой `fs.readFileSync` + поиск подстрок; не подключать `remark`/`unified` ради этого (Rule 6). Если стоп-фраза содержит non-ASCII пунктуацию (тире — vs дефис -) — нормализовать перед сравнением.

---

### [T27] PR template с copy-debt чек-листом

- **Phase**: 1 — Типографика и токены (one-time setup)
- **Type**: setup
- **Depends on**: none
- **Input**: ничего (новый файл)
- **Output**: `.github/pull_request_template.md` с чек-листом, который GitHub автоматически вставляет в body нового PR
- **Acceptance criteria**:
  - [ ] Файл `.github/pull_request_template.md` создан
  - [ ] Чек-лист содержит как минимум:
    - [ ] Lighthouse CI mobile ≥ 95 на всех 4 метриках
    - [ ] `pnpm test` + `pnpm test:e2e` зелёные
    - [ ] `pnpm lint` + `pnpm format:check` чистые
    - [ ] **Для content-PR** (содержит изменения в `src/content/**`): word count в указанном диапазоне; stop-list grep (T26) зелёный; явная метка «v1, до внешней редактуры» в title или body
    - [ ] **Для asset-PR** (содержит изменения в `src/assets/**` или `public/images/**`): side-by-side «до/после» приложен в комментарии
  - [ ] При открытии нового PR на GitHub UI шаблон виден в body
- **Tests required**:
  - [ ] Manual: открыть тестовый draft PR на отдельной ветке, убедиться, что body содержит чек-лист
- **Constitution check**: Rule 1 (видимое напоминание о метке «v1, до внешней редактуры»); Rule 3 (видимое напоминание о Lighthouse 95+)
- **Implementation notes**: один файл, ничего больше. Не плодить тематические шаблоны (`feature.md`, `bugfix.md`) — Rule 6.

---

### [T28] Playwright assertion — концепт-плашка на project-04 vs остальные

- **Phase**: 4 — Копирайт-сессия 2
- **Type**: test
- **Depends on**: T19
- **Input**: [tests/e2e/pages.spec.ts](../../tests/e2e/pages.spec.ts) (расширить) или новый файл `tests/e2e/concept-badge.spec.ts`
- **Output**: Playwright-спек, утверждающий, что плашка «концепт-проект, фото в обработке» **отсутствует** на `/works/project-04` и **присутствует** на `/works/project-01`
- **Acceptance criteria**:
  - [ ] Спек открывает `/works/project-04`, читает DOM, утверждает отсутствие строки плашки (точная строка — взять из текущего шаблона компонента, найденного при T19)
  - [ ] Тот же спек открывает `/works/project-01`, утверждает наличие той же строки плашки
  - [ ] Спек проходит после T19; временно откатив изменение T19 (например, убрав условие на retouched-метку) — спек краснеет на `/works/project-04`
  - [ ] `pnpm test:e2e` зелёный
- **Tests required**:
  - [ ] Сам по себе test
  - [ ] Negative regression (см. acceptance)
- **Constitution check**: Rule 7 (автоматическая защита от случайного возврата плашки на retouched-pilot или случайного снятия плашки со всех проектов сразу)
- **Implementation notes**: ~15 строк spec'а. Селектор для плашки — лучше через `data-testid="concept-badge"` (добавить в компонент при T19), чем по тексту — текст может измениться при редактуре.

---

## Step 4 — Execution Order (Waves)

```
── Wave 1 (no dependencies) ──────────────────────────────────────
   T01: Замена Fraunces → PT Serif (cyrillic-only)
   T02: tokens.css финальная шкала
   T03: IOPaint local setup (manual user)
   T26: Stop-list grep gate в CI           (hardening)
   T27: PR template с copy-debt checklist  (hardening)

── Wave 2 (← Wave 1) ─────────────────────────────────────────────
   T04: Fonttools cyrillic check       ← T01
   T05: Layout.astro preload-hints     ← T01
   T06: admin/index.html font sync     ← T01
   T07: Hero.astro Schema 1            ← T02
   T08: Batch retouch project-04       ← T03  (parallel manual)

── Wave 3 (← Wave 2 partial) ─────────────────────────────────────
   T09: typography.spec.ts             ← T01, T07

── Wave 4 (← Waves 2+3) ──────────────────────────────────────────
   T10: Phase 1 PR + Lighthouse + merge  ← T01,T02,T04,T05,T06,T07,T09,T26,T27
   T11: Phase 2 PR + retouched assets    ← T08

── Wave 5 (← Wave 4 — Phase 3 copy session, in one sitting) ─────
   T12: Hero copy                       ← T10, T11
   T13: About copy                      ← T10, T11
   T14: project-04 summary + concept    ← T10, T11

── Wave 6 (← Wave 5) ─────────────────────────────────────────────
   T15: Editorial review + Phase 3 PR merge   ← T12, T13, T14

── Wave 7 (← Wave 6 — Phase 4 copy session 2) ───────────────────
   T16: Services intro                  ← T15
   T17: 3 service bodies                ← T15
   T18: Contact intro                   ← T15
   T19: Remove "концепт-проект" badge   ← T15

── Wave 8 (← Wave 7) ─────────────────────────────────────────────
   T20: Visual review /works/project-04 ← T11, T14, T17, T19
   T21: Smoke obhod project-01/02/03    ← T10, T11 (parallel with T20)
   T28: Playwright badge assertion      ← T19 (hardening, parallel with T20/T21)

── Wave 9 (← Wave 8) ─────────────────────────────────────────────
   T22: Phase 4 PR — merge              ← T16, T17, T18, T19, T20, T21, T28

── Wave 10 (← Wave 9 — Phase 5 close-out) ───────────────────────
   T23: CLAUDE.md status → Done         ← T22
   T24: vision.md Open Questions        ← T22 (parallel with T23)

── Wave 11 (← Wave 10) ───────────────────────────────────────────
   T25: log.md final + Phase 5 PR merge  ← T23, T24
```

---

## Step 5 — Critical Path

🔴 **Critical path** (longest dependent chain, defines minimum duration):

```
T01 → T07 → T09 → T10 → T12 → T15 → T17 → T20 → T22 → T23 → T25
(install fonts) → (Hero layout) → (regression test) → (Phase 1 merge) →
(Hero copy) → (Phase 3 review) → (3 service bodies — biggest copy task) →
(visual review) → (Phase 4 merge) → (CLAUDE.md status) → (close-out merge)
```

11 sequential tasks на критическом пути. Любая задержка любой из них = задержка всего ep02.

Параллельные ветки, которые могут смягчить нагрузку:
- **T03 → T08 → T11** (Phase 2 ретушь) идёт параллельно с T01..T07; должна закрыться до T12, иначе Phase 3 копирайт-сессия не получит визуальный референс.
- **T26, T27** в Wave 1 — параллельны T01/T02/T03 (hardening, не зависят от шрифтов; должны быть смёрджены до T15 — Editorial review должна иметь рабочий stop-list grep и PR template).
- **T13, T14** в Wave 5 — параллельны T12 (одна сессия копирайта; не critical, но в одной сидячей пишутся синхронно).
- **T16, T18, T19** в Wave 7 — параллельны T17.
- **T21, T28** в Wave 8 — параллельны T20.
- **T24** в Wave 10 — параллельна T23.

🟡 **Important** (имеет dependents, но slack есть): T02 (tokens), T04 (cyrillic check), T11 (Phase 2 merge), T19 (badge removal), T26 (stop-list grep — должен сработать на T15).

🟢 **Flexible** (можно переставить или отложить): T06 (admin sync — можно отложить до Phase 4, но логичнее в Phase 1), T21 (smoke может уехать в Phase 5), T27 (PR template — желательно к T15, но не блокирует).

---

## Step 6 — Progress Tracker

```markdown
## Progress Tracker — ep02-design-and-copy

### Wave 1
- [x] T01: Замена Fraunces → PT Serif (cyrillic-only)
- [x] T02: tokens.css финальная шкала
- [ ] T03: IOPaint local setup (manual)
- [x] T26: Stop-list grep gate в CI (hardening)
- [x] T27: PR template с copy-debt checklist (hardening)

### Wave 2
- [x] T04: Fonttools cyrillic check
- [x] T05: Layout.astro preload-hints
- [x] T06: admin/index.html font sync
- [x] T07: Hero.astro Schema 1 typographic
- [ ] T08: Batch retouch project-04 (manual)

### Wave 3
- [x] T09: typography.spec.ts regression test

### Wave 4
- [x] T10: Phase 1 PR — Lighthouse + merge
- [ ] T11: Phase 2 PR — retouched assets + merge

### Wave 5 (Phase 3 copy session — one sitting)
- [ ] T12: Hero copy
- [ ] T13: About copy
- [ ] T14: project-04 summary + concept

### Wave 6
- [ ] T15: Editorial review + Phase 3 PR merge

### Wave 7 (Phase 4 copy session 2)
- [ ] T16: Services intro
- [ ] T17: 3 service bodies
- [ ] T18: Contact intro
- [ ] T19: Снять «концепт-проект» плашку для project-04

### Wave 8
- [ ] T20: Визуальный обзор /works/project-04
- [ ] T21: Smoke project-01/02/03
- [ ] T28: Playwright badge assertion (hardening)

### Wave 9
- [ ] T22: Phase 4 PR — merge

### Wave 10
- [ ] T23: CLAUDE.md → ep02 ✅ Done
- [ ] T24: vision.md Open Questions

### Wave 11
- [ ] T25: log.md final + Phase 5 merge
```

---

## Step 7 — First Task Brief (T01)

### T01 — Замена `@fontsource-variable/fraunces` → `@fontsource/pt-serif`

**Context**: ep01 подключил Fraunces как нейтральную заглушку. По upstream-проверке METADATA.pb 2026-05-26 — он без cyrillic subset. Заголовки на русском молча падают на системный Georgia/Times. ep02 заменяет на PT Serif (Paratype), у которого cyrillic + cyrillic-ext гарантированы.

**Working directory**: `c:\Proj\Svetik-design`

**Branch**: создать `feature/ep02-typography` от `main`.

**Files to modify**:

1. **`package.json`** — в `dependencies`:
   - убрать: `"@fontsource-variable/fraunces": "^5.2.9"`
   - добавить: `"@fontsource/pt-serif": "<latest>"` (зафиксировать ту версию, что подтянет pnpm; обновить вручную после `pnpm add`)

2. **`src/styles/global.css`** — заменить шапку:

   _было_:

   ```css
   @import '@fontsource-variable/fraunces';
   @import '@fontsource/inter/400.css';
   @import '@fontsource/inter/500.css';
   @import '@fontsource/inter/600.css';

   @import 'tailwindcss';
   @import './tokens.css';

   @theme {
     --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
     --font-display: 'Fraunces Variable', ui-serif, Georgia, 'Times New Roman', serif;
   }
   ```

   _станет_ (cyrillic-only initial, см. acceptance criteria T01):

   ```css
   @import '@fontsource/pt-serif/cyrillic-400-normal.css';
   @import '@fontsource/pt-serif/cyrillic-700-normal.css';
   @import '@fontsource/pt-serif/cyrillic-400-italic.css';
   @import '@fontsource/inter/400.css';
   @import '@fontsource/inter/500.css';
   @import '@fontsource/inter/600.css';

   @import 'tailwindcss';
   @import './tokens.css';

   @theme {
     --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
     --font-display: 'PT Serif', ui-serif, Georgia, 'Times New Roman', serif;
   }
   ```

   _(Pre-flight: точные имена файлов внутри `@fontsource/pt-serif` могут отличаться — после `pnpm add` проверить `node_modules/@fontsource/pt-serif/` и поправить пути импортов под фактическое содержимое пакета. Если визуально обнаружится отсутствие latin-глифа на странице — добавить `@import '@fontsource/pt-serif/latin-400-normal.css';` в этом же PR. Не предполагается на ep02 — сайт RU-only.)_

**Commands to run**:

```powershell
git checkout -b feature/ep02-typography
pnpm remove "@fontsource-variable/fraunces"
pnpm add "@fontsource/pt-serif"
# затем правка global.css
pnpm install
pnpm build
pnpm dev
```

**Expected result**:

- `pnpm build` зелёный.
- `pnpm dev` запускается, открыть `http://localhost:4321/works/project-01` — заголовок `<h1>` рендерится в PT Serif (визуально засечковый шрифт, не курсив Georgia).
- DevTools → Elements → выбрать `<h1>` → Computed → `font-family: 'PT Serif', ui-serif, Georgia, ...` (а в Rendered Fonts должен быть `PT Serif`, не Georgia).

**How to verify it worked**:

1. `pnpm build` без ошибок.
2. В браузере на `/works/project-01` русский заголовок выглядит как PT Serif (мягкие засечки, характерный «Paratype» рисунок), не как стандартный Georgia.
3. В DevTools Network → Font: при загрузке страницы запрашивается `pt-serif-cyrillic-400-normal.woff2`, не Georgia (Georgia системный и в Network не видна — это и есть подтверждение).
4. `pnpm test:e2e` зелёный (existing specs).

**Когда задача готова**:
- Закоммитить с сообщением вроде `chore(typography): replace Fraunces with PT Serif for cyrillic coverage`.
- Сразу запустить T04 (fonttools-инспекция) перед другими задачами Wave 2 — это блокирующая проверка качества шрифта. Если T04 покажет дыру в кириллице — откатиться на план B (Onest) до того, как делать T05/T06/T07.

**Constitution checklist for this task**:
- ✅ Rule 5 — бюджет не растёт (одна `@fontsource` замена на другую)
- ✅ Rule 6 — минимум зависимостей, никаких build-инструментов сверху
- ✅ Rule 1 — отдалённо: гарантия, что русские заголовки рендерятся читаемой типографикой (silent fallback на Georgia больше невозможен)
