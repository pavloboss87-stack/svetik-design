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
