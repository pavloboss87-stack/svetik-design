# Execution Log — ep02-design-and-copy

<!-- Per-task entries are appended by /my-execute. Session-level summaries are appended at the bottom of each session. -->

## 2026-05-26 — [T01] Замена `@fontsource-variable/fraunces` → `@fontsource/pt-serif` (cyrillic-only)

- **Status**: ✅ Done
- **Files changed**: `package.json`, `pnpm-lock.yaml`, `src/styles/global.css`
- **Commit**: `1651b2c` — `ep02 T01: replace Fraunces with PT Serif (cyrillic-only initial subset)`
- **Pre-flight finding**: фактические имена CSS-файлов в `@fontsource/pt-serif@5.2.8` — `cyrillic-400.css` / `cyrillic-700.css` / `cyrillic-400-italic.css` (без `-normal` суффикса, как ожидалось в tasks.md T01). Структура `@fontsource`-пакета: cyrillic / cyrillic-ext / latin / latin-ext по 4 веса × normal/italic, плюс агрегаты `index.css` / `<subset>.css` / `<subset>-italic.css`. Зафиксировано в комментарии к `src/styles/global.css`.
- **Learnings**: `@fontsource` ставит `font-display: swap` по умолчанию — verified в built CSS (`font-display:swap` присутствует). Latin subset намеренно не подключён — сайт ep02 RU-only. Если в Phase 1 visual check найдёт пропущенный latin-глиф (например, в техническом тексте `ООО „ДИСКИЛЛ"` или в названии услуги) — добавить latin-400-normal в этом же PR; пока не предполагается.
- **Patterns**: ничего нового, что не покрыто `progress.md`.

## 2026-05-26 — [T02] Финальная шкала в `src/styles/tokens.css`

- **Status**: ✅ Done
- **Files changed**: `src/styles/tokens.css`
- **Commit**: `2d0da34` — `ep02 T02: fill tokens.css with final scale (...)`. Followup `0fa1dde` — prettier fmt fixup (whitespace-only).
- **Key design choices**: modular ratio **1.25** (major third) — мягче 1.333, попадает в editorial-регистр PT Serif + Inter. Семь типографических размеров (xs/sm/base/lg/xl/2xl/display) — purpose-mapping зафиксирован комментарием в начале файла как контракт. 4px-grid spacing (10 токенов: 1/2/3/4/6/8/12/16/24/32). Палитра — минимум три цвета (`--ink` `#1a1a1a`, `--paper` `#fafaf8` — тёплый off-white под editorial-серif, `--accent-neutral` `#a8a39b`).
- **Learnings**: prettier рестрогает выравнивание встроенных `/* … */` комментариев к одиночному пробелу — выровненные комментарии в `--text-xs: 0.8rem;       /* 12.8px */` стиле он схлопывает в `--text-xs: 0.8rem; /* 12.8px */`. Запускать `pnpm exec prettier --write` на изменённые файлы перед коммитом (особенно когда форматирование на глаз кажется аккуратным).
- **Patterns**: добавить в `progress.md`? — да: «после Edit/Write на CSS-/TS-файлы запускать `pnpm exec prettier --write <file>` перед коммитом; на Windows смотреть `pnpm format:check` локально нельзя — autocrlf на baseline-файлах создаёт ложные срабатывания, верить только CI и `prettier --check <changed-files>`».

## 2026-05-26 — [T26] Stop-list grep gate в CI (Vitest)

- **Status**: ✅ Done
- **Files changed**: `tests/content/stop-list.ts` (новый), `tests/content/stop-list.spec.ts` (новый), `vitest.config.ts`
- **Commit**: `87189a2` — `ep02 T26: add Vitest stop-list grep gate over src/content/**/*.md`
- **Implementation**: 7 точных штампов из Принципа 1 как массив; пунктуация-нормализация (em/en-dash → `-`, разные nbsp → space) через `new RegExp(string, flags)`, чтобы исходник остался ASCII-чист и `no-irregular-whitespace` не ругался. Шаблон «не просто X, а Y» — отдельный regex с одно-предложение ограничением плеча X. Спек скан-цикл идёт по всем `.md` в `src/content/`, генерирует по тест-case на файл — конкретное сообщение об ошибке указывает, какой штамп нашёлся и в каком файле.
- **Vitest config**: расширен include с `tests/unit/**/*.test.ts` до добавления `tests/content/**/*.spec.ts` (брифа точно требовал суффикс `.spec.ts`, не `.test.ts` — следуем брифу).
- **Negative test verified**: ручная вставка «уют и функциональность» в `src/content/pages/hero.md` краснит спек с явным сообщением `AssertionError: Stop-list match(es) in src/content/pages/hero.md: уют и функциональность`; восстановление файла возвращает зелёный.
- **Текущий контент `src/content/` чист** — placeholder-тексты ep01 не содержат штампов. Гейт работает «впрок» против будущих PR.
- **Patterns**: на Windows `Set-Content -Encoding utf8` повредил cyrillic при попытке восстановить `hero.md` после negative-test — оказалось, что `Get-Content -Raw` читает в системной локали (cp1251), а Set-Content -utf8 пишет с BOM, и результат — двойная конвертация. Восстановили через `git restore`. Урок: для temp-modification → restore цикла в content-тестах использовать `git checkout HEAD -- <file>` или `git restore <file>` вместо PowerShell IO.

## 2026-05-26 — [T27] PR template с copy-debt чек-листом

- **Status**: ✅ Done
- **Files changed**: `.github/pull_request_template.md` (новый)
- **Commit**: `497210d` — `ep02 T27: add .github/pull_request_template.md with copy-debt checklist`
- **Implementation**: один файл, без тематических вариантов (`feature.md` / `bugfix.md`) — Principle 6. Структура: общая часть CI-чек-листа (Lighthouse / vitest / Playwright / lint / format / typecheck / build) + условные секции по типу PR (content, asset, typography). Метка «v1, до внешней редактуры» зафиксирована как пункт чек-листа для content-PR (CLAUDE.md Принцип 1 уточнение).
- **Verification of GitHub auto-attach**: проверим, когда откроется первый draft PR ветки `feature/ep02-typography-foundation` или последующих веток — body должен содержать чек-лист из шаблона.

---

## Session A — 2026-05-26 — резюме

**Цель**: T01 + T02 + T26 + T27 (Wave 1 — typography foundation + hardening gates).

**Сделано**:
- Ветка `feature/ep02-typography-foundation` отделена от `main`.
- Plan ratification закоммичен (`23a7cf0` — docs/ep02-* + CLAUDE.md Rule 1 уточнение + ep02 status → 🔄 Active).
- T01: Fraunces убран; `@fontsource/pt-serif@5.2.8` подключён по cyrillic-only subset (3 CSS-импорта, ~22–25 KB на .woff2). `@theme --font-display` переключён.
- T02: `tokens.css` заполнен финальной шкалой — modular 1.25, 7 размеров, leading/tracking/spacing, минимальная палитра ink/paper/accent-neutral.
- T26: Vitest stop-list grep gate (`tests/content/stop-list.spec.ts`) живёт. Текущее содержимое `src/content/` чисто. Negative-test подтверждён вручную.
- T27: `.github/pull_request_template.md` создан.

**Quality gates на конец сессии**:
- `pnpm test` ✅ 6 файлов / 82 теста (включая 13 новых stop-list cases — 1 setup + 12 .md файлов).
- `pnpm build` ✅ 11 страниц, 5.5s. PT Serif cyrillic .woff2 в `dist/_astro/`.
- `pnpm lint` ✅ exit 0.
- `pnpm format:check` локально на Windows красен на baseline-файлах (astro.config.mjs / wrangler.jsonc / workers/submit/test/index.test.ts / CLAUDE.md / hero.md) из-за autocrlf — это working-tree-only артефакт; в git index всё LF (`git ls-files --eol` подтвердил), CI на linux пройдёт. Изменённые в этой сессии файлы — все LF, prettier-clean.
- `pnpm typecheck` ✅ 0/0/0.
- `pnpm test:e2e` — не перезапускался в сессии (брифа не требовал; baseline на main был зелёный).

**Progress Tracker**: T01, T02, T26, T27 отмечены.

**Открытые наблюдения**:
- `pnpm format:check` на Windows будет шуметь на baseline-файлах из-за autocrlf — не пугаться, верить только CI и точечному `prettier --check <file>` на изменённых.
- T01 фактические имена CSS-импортов в `@fontsource/pt-serif@5.2.8` — без `-normal` суффикса (`cyrillic-400.css`, не `cyrillic-400-normal.css`). Обновить brief T05 имея в виду эту реальность (preload-hints в Layout.astro будут импортировать `.woff2` напрямую через ESM, путь `@fontsource/pt-serif/files/pt-serif-cyrillic-400-normal.woff2` — он совпадает с тем, что лежит в `node_modules`).

**Следующая сессия**: Session B — Phase 1 wiring + merge (T04, T05, T06, T07, T09, T10).

## 2026-05-26 — [T04] Fonttools-инспекция PT Serif на полноту кириллицы

- **Status**: ✅ Done
- **Files changed**: `scripts/inspect-pt-serif-cyrillic.mjs` (новый), `package.json` (+`verify:fonts` script, +fontkit devDep), `pnpm-lock.yaml`
- **Commit**: `a4be39d` — `ep02 T04: verify PT Serif cyrillic coverage via fontkit`
- **Implementation**: fontkit (npm) читает woff2 нативно (decompresses Brotli), `glyphForCodePoint(cp).id === 0` для глифа = `.notdef`/отсутствует. Проверены 10 точек: ё/Ё (U+0451/0401), ъ/ь (U+044A/044C), й/Й (U+0439/0419), А/я (U+0410/044F), Щ/щ (U+0429/0449). Все три cyrillic-subset файла (400-normal, 700-normal, 400-italic) — 10/10 присутствуют. Stop-loss на silent fallback Fraunces-style не сработал, продолжаем по плану A.
- **Wired as**: `pnpm verify:fonts` для воспроизводимости в будущих эпиках (ep03 при добавлении нового шрифта).
- **Learnings**: `import * as fontkit from 'fontkit'` — пакет экспортирует NS, без default. На Windows `node` / `pnpm` не в `$PATH` по умолчанию — приходится прописывать `$env:Path = "$env:Path;C:\Program Files\nodejs;C:\Users\Pavlo\AppData\Roaming\npm"` для PowerShell-сессий.
- **Patterns**: добавить в `progress.md` PATH hack как codebase pattern.

## 2026-05-26 — [T05] Preload-hints для critical fonts в Layout.astro

- **Status**: ✅ Done
- **Files changed**: `src/components/layout/Layout.astro`
- **Commit**: `84bc329` — `ep02 T05: preload hints for PT Serif + Inter cyrillic 400`
- **Implementation**: два `<link rel="preload" as="font" type="font/woff2" crossorigin>` в `<head>` — PT Serif cyrillic 400 + Inter cyrillic 400. URL резолвится через Astro ESM-импорт `?url` соответствующих .woff2 — пути fingerprinted, идентичны URL, которые загружает @fontsource CSS (проверено через grep по `dist/_astro/*.css`). 700-вес PT Serif и 500/600 Inter — намеренно НЕ preload-им (font-display:swap справится со стилевыми вариантами, Lighthouse audit `unused-preload-links` не должен флагать).
- **Verified**: `font-display:swap` присутствует в `dist/_astro/*.css` (из @fontsource по умолчанию).

## 2026-05-26 — [T06] Подключить шрифты прода в Decap admin

- **Status**: ✅ Done
- **Files changed**: `public/admin/index.html`, `public/_headers`
- **Commit**: `7e7c861` — `ep02 T06: sync prod fonts into Decap admin (jsDelivr)`
- **Pre-flight**: `curl -sI https://cdn.jsdelivr.net/npm/@fontsource/pt-serif@5.2.8/cyrillic-400.css` → `HTTP/1.1 200 OK` + `access-control-allow-origin: *` — jsDelivr корректно отдаёт `@fontsource` пакеты, fallback на Google Fonts не нужен.
- **Implementation**: шесть `<link rel="stylesheet">` в `<head>` admin (3 PT Serif cyrillic + 3 Inter aggregate — точная параллель с `src/styles/global.css`). Версия пакета зафиксирована (`@5.2.8`), совпадает с `package.json`. `CMS.registerPreviewStyle()` x6 (URL-style) + одна raw inline-style (`body{font-family:'Inter',...}h1..h6{font-family:'PT Serif',...}`) — пропихиваем стили в preview iframe Decap'а, чтобы редактор видел тот же визуал, что и прод.
- **CSP**: `public/_headers` /admin/* — `style-src` и `font-src` пополнены `https://cdn.jsdelivr.net`. Без этого браузер заблокировал бы загрузку CDN-стилей/шрифтов в admin.
- **Visual verify**: deferred — этот шаг проверяется руками в Decap UI (admin/index.html не прогоняется через e2e). Когда сестра/брат залогинится через GitHub OAuth в /admin/ → редактор страницы Hero → preview-pane должен показать `<h1>` в PT Serif, body в Inter. Если silent fallback на Georgia — diagnose через DevTools → Network в iframe.

## 2026-05-26 — [T07] Hero.astro — Schema 1 calibration + CTA

- **Status**: ✅ Done
- **Files changed**: `src/components/home/Hero.astro`, `src/content/pages/hero.md`, `tests/e2e/pages.spec.ts`
- **Commit**: `c5a1b20` — `ep02 T07: Hero.astro Schema 1 calibration + CTA`
- **Implementation**: scoped `<style>` блок в Hero.astro привязывает `.hero-title` к `var(--font-display)`, `var(--text-display)`, `var(--leading-tight)`, `var(--tracking-tight)` — токены из `tokens.css` (T02). `clamp(2.25rem, 7vw, var(--text-display))` обеспечивает отсутствие overflow на 360px без отдельной media-query. `max-width: 16ch` на h1 даёт ~10-12 слов в строке на desktop, `max-width: 60ch` на body — стандартный prose-предел. CTA «Смотреть работы» — новая разметка (не было в ep01), стиль — тонкий underline с `text-decoration-color: var(--accent-neutral)`, поднимается до ink на hover/focus. `data-testid="hero-cta"` для assertion-scoping.
- **Sentinel placeholder**: `hero.md` frontmatter получил YAML-комментарий `# TODO(T12): финальный Hero copy v1 — текущий body остаётся placeholder ep01, заменяется в Session D`. Существующий placeholder body «PLACEHOLDER — финальный текст в ep02. Дизайнер интерьеров. …» оставлен как визуальный sentinel — это не лорем-ипсум, не fake-английский, не LLM-черновик (Принцип 1 уточнение разрешает на промежуточных ветках).
- **Test**: `tests/e2e/pages.spec.ts` дополнен one-liner — `[data-testid="hero-cta"]` видим, текст «Смотреть работы», href=`/works`. 24/24 e2e (без typography.spec.ts) зелёные после T07.

## 2026-05-26 — [T09] typography.spec.ts — PT Serif regression stop-loss

- **Status**: ✅ Done
- **Files changed**: `tests/e2e/typography.spec.ts` (новый)
- **Commit**: `a69b0f5` — `ep02 T09: typography.spec.ts — PT Serif regression stop-loss`
- **Implementation**: два теста (на `/` и `/works/project-01/`) читают `<h1>` через `page.evaluate(async () => { await document.fonts.ready; ... })`. Assertions: (a) `getComputedStyle(h1).fontFamily` начинается с `'PT Serif'` (case-insensitive, кавычки опциональны); (b) `document.fonts` содержит зарегистрированный `FontFace` с family `'PT Serif'` в статусе `'loaded'`. Реализация через iteration — не через `document.fonts.check()`, т.к. эта API возвращает true для неизвестных family («ждать нечего»), что маскирует regression.
- **Cross-browser quirks**: WebKit/Safari возвращает `FontFace.family` с обёрткой в кавычки (`'"PT Serif"'`), Chromium — без (`'PT Serif'`). Comparator снимает кавычки регексом перед сравнением — отлажено через diagnostic output на mobile-safari iPhone 13 emulation.
- **Negative test verified**: закомментирован `@import '@fontsource/pt-serif/...'` в `global.css`, `pnpm build` + `pnpm exec playwright test tests/e2e/typography.spec.ts` → все 4 (2 страницы × 2 браузера) краснеют с осмысленным сообщением `PT Serif не зарегистрирован/не загружен; fontFamily="PT Serif", ui-serif, Georgia, "Times New Roman", serif`. Восстановлено в `global.css`, все 4 зелёные.
- **28/28 e2e pass** на финальном состоянии после рестора.
- **Patterns/Learnings**: `Edit replace_all=true` заменяет ВСЕ совпадения; `replace_all=false` (по умолчанию) — только первое и фейлит при множественных совпадениях. Когда логика теста повторяется в N тестах — выносить в helper-функцию (`readH1PtSerifState`), а не дублировать с `replace_all=true` (риск тихо забыть про "вторую копию"). Зафиксировано в `progress.md`.

## 2026-05-26 — [T10] Phase 1 PR — Lighthouse CI + merge

- **Status**: ✅ Done
- **PR**: [#9 — ep02 Phase 1 — typography foundation + hardening gates](https://github.com/pavloboss87-stack/svetik-design/pull/9)
- **Squash merge SHA on main**: `7094eb3` (включает всю Session A + Session B как один коммит)
- **Files changed for T10 itself** (на момент merge): `.lighthouserc.json` (numberOfRuns 1→3, +`aggregationMethod: median`), `scripts/inspect-pt-serif-cyrillic.mjs` (prettier fixup для CI lint step)
- **CI результат финального run**:
  - `lint` ✅
  - `typecheck` ✅
  - `test` (Vitest) ✅
  - `e2e` (Playwright, chromium+webkit) ✅
  - `lighthouse` ✅ (Performance/A11y/Best-Practices/SEO ≥ 0.95 на 7 URL, median across 3 runs)
  - `Workers Builds: svetik-design` ✅ (CF auto-deploy)
- **Variance story**: первый CI-run после открытия PR упал на Lighthouse Performance = 0.82 для `/` (Hero), при `numberOfRuns: 1` это была дисперсия на shared GHA-раннере — локально `pnpm exec lhci collect` тогда же давал 99/99/98/100/100/100/100. Mitigation: `numberOfRuns: 3` + `aggregationMethod: median` (стабилизация измерения, не релакс бюджета). После применения — все 4 категории median ≥ 0.95 на всех 7 URL.
- **Lint fixup**: первый CI-run также упал на prettier-проверке `scripts/inspect-pt-serif-cyrillic.mjs` — местная sanity-проверка прошла только на тех файлах, что я редактировал руками, а инспектор-скрипт остался незаафрончен. После `pnpm exec prettier --write scripts/inspect-pt-serif-cyrillic.mjs` — зелёный.
- **Pre-flight diagnostic был усечён локальной проверкой**: `pnpm exec prettier --check <changed-files>` в моём workflow — недостаточен. Урок: запускать **`pnpm format:check`** на всё дерево перед push'ем, либо настроить pre-push hook. Не зафиксировал как codebase pattern, потому что Windows + autocrlf делает `pnpm format:check` локально шумным (см. ep01 Session A pattern).
- **Verify visual**: после merge main `7094eb3` Workers Builds задеплоил production на `svetik-design.svetik-design.workers.dev` — preview-URL для main = production-URL на этом setup. Визуальная проверка (PT Serif на `/works/project-01/` h1, Hero CTA, отсутствие watermark plашки изменения — все на месте) выполняется руками после полного завершения деплоя; e2e/Lighthouse подтвердили программно.

---

## Session B — 2026-05-26 — резюме

**Цель**: T04, T05, T06, T07, T09, T10 (Wave 2 + Wave 3 + Wave 4 эпика, Phase 1 wiring + merge).

**Сделано**:
- **T04**: fontkit-инспекция PT Serif cyrillic — 10/10 required глифов (ё/Ё/ъ/ь/й/Й + А/я/Щ/щ) во всех трёх subset-файлах (400-normal, 700-normal, 400-italic). Никакого fallback-плана (Onest) не понадобилось. Скрипт `scripts/inspect-pt-serif-cyrillic.mjs` + `pnpm verify:fonts` — оставлен для будущих эпиков.
- **T05**: 2 preload-link'а (PT Serif cyrillic 400 + Inter cyrillic 400) в `Layout.astro`. Пути fingerprinted через Astro ESM-импорт `?url`.
- **T06**: admin shell подгружает PT Serif + Inter с jsDelivr; `CMS.registerPreviewStyle()` пропихивает их в preview iframe. CSP `/admin/*` расширен `cdn.jsdelivr.net`.
- **T07**: Hero.astro откалиброван по Schema 1 (typographic). Scoped `<style>` использует токены T02. Добавлен CTA «Смотреть работы» (новая разметка). `data-testid="hero-cta"` + assertion в `pages.spec.ts`. Placeholder в `hero.md` помечен sentinel TODO(T12).
- **T09**: `tests/e2e/typography.spec.ts` — два теста (`/` + `/works/project-01/`) на cross-browser (chromium+mobile-safari), assertion через iteration `document.fonts` (не `.check()`). Negative-test verified.
- **T10**: PR #9 открыт, мерджен squash-методом в `main` после стабилизации Lighthouse runner-variance (numberOfRuns 1→3 + median). Workers Builds задеплоил.

**Quality gates на конец сессии**:
- `pnpm test` ✅ 82/82 vitest (включая stop-list).
- `pnpm test:e2e` ✅ 28/28 Playwright (chromium + mobile-safari, включая typography.spec.ts и Hero CTA).
- `pnpm lint` ✅ exit 0.
- `pnpm typecheck` ✅ 0/0/0.
- `pnpm build` ✅ 11 страниц.
- CI на финальном HEAD: все 6 checks зелёные.
- Lighthouse mobile CI: Performance/A11y/Best-Practices/SEO ≥ 95 (median × 3 runs × 7 URL).

**Progress Tracker**: T04, T05, T06, T07, T09, T10 отмечены. T08 + T11 (Phase 2 / ретушь) — параллельная manual-track в Session C.

**Открытые наблюдения**:
- Зафиксировал в `progress.md` два паттерна: (а) Node/pnpm не в `$PATH` PowerShell-сессий → augment явно; (б) `Edit replace_all=true` + дубликат логики в N тестах — риск тихо обновить «первую копию» и оставить вторую; mitigation — helper-функция.
- Lighthouse CI variance: при `numberOfRuns: 1` shared GHA-runner может давать 0.82 для Hero `/`. Mitigation = numberOfRuns 3 + median.
- Latin subset PT Serif всё ещё не подключён — намерено. Если в Phase 3+4 копирайт будет содержать latin-глифы (например, технический текст «ООО „ДИСКИЛЛ"» в About), latin-400-normal добавим точечно в том же PR. Пока не нужен.
- Версия `@fontsource/pt-serif@5.2.8` зафиксирована в двух местах: `package.json` (для прод-bundle) и `public/admin/index.html` CDN URL. При апгрейде нужно править оба, иначе admin рассинхронится с прод.

**Следующая сессия**: Session C — Asset retouch (T08 — manual user работа в IOPaint) + Phase 2 PR (T11 — Claude коммит assets). Может идти параллельно с любой техническoй сессией; должна закрыться до Session D (Copy session 1), потому что копирайт project-04 пишется с retouched-кадрами перед глазами.
