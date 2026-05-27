# Session plan — ep02-design-and-copy

> Декомпозиция исполнения эпика на 7 сессий. Цель: каждую сессию запускать в чистом окне Claude Code, не упираясь в лимит контекста и не теряя качества.
>
> Источник задач: [`tasks.md`](tasks.md). Каждая сессия покрывает 1–6 задач из waves плана. Внутри сессии используется `/my-execute ep02-design-and-copy` — он сам читает task-спеки, коммитит per task и ведёт `log.md`.
>
> Если внутри сессии что-то идёт не по плану — Claude переходит в ручной режим или останавливается и зовёт тебя.

---

## Карта сессий

| Session | Задачи | Цель (что работает после) | Зависимости (что должно быть до) |
|---|---|---|---|
| **A — Typography foundation + hardening gates** | T01, T02, T26, T27 | PT Serif (cyrillic-only) подключён вместо Fraunces, `tokens.css` заполнен финальной шкалой, Vitest stop-list grep gate зелёный, `.github/pull_request_template.md` подхватывается GitHub | ep01 закрыт, `main` чистый |
| **B — Phase 1 wiring + merge** | T04, T05, T06, T07, T09, T10 | Кириллический subset PT Serif верифицирован, preload-hints добавлены, admin shell подгружает прод-шрифты, Hero калиброван по Schema 1 с CTA, Playwright typography.spec.ts зелёный, Phase 1 PR смёрджен | Session A |
| **C — Pivot: guide update + scope freeze** (was: Asset retouch) | docs only | Phase 2 retouch вынесена в post-launch Светланы; `guide-for-svetlana.md` пополнен секциями «Что считать проектом / Честность и фрейминг / Структура одного проекта»; tasks/plan/CLAUDE.md/log синхронизированы | Session A (не обязательно B) |
| **D — Copy session 1 (one sitting!)** | T12, T13, T14, T15 | Финальные тексты Hero / About / project-04 (summary + concept) — `project-04` пишется с **watermark-кадрами как референсом**, концепт остаётся концептом. Редактура брата пройдена (≤2 итерации), Phase 3 PR смёрджен с меткой «v1, до внешней редактуры» | Sessions B + C; Светлана и брат доступны в одной сессии |
| **E — Copy session 2 (services + contact)** | T16, T17, T18 | services-intro, 3 service bodies, contact-intro написаны и проверены чек-листом 2.3 | Session D |
| **F — Phase 4 verify + merge** | T20, T21, T28, T22 | Визуальный обзор `/works/project-04` пройден (плашка корректно видна — watermark остаётся), smoke project-01/02/03 проверен, Playwright badge assertion зелёный (плашка видна на всех isConcept), Phase 4 PR смёрджен | Session E |
| **G — Closeout** | T23, T24, T25 | CLAUDE.md → ep02 ✅ Done, vision.md Open Questions обновлены, `log.md` финальная запись о долге внешней редактуры, Phase 5 PR смёрджен | Session F |

**Critical path:** A → B → C (pivot, docs only) → D → E → F → G (7 последовательных сессий, но C — короткая docs-only).

> **Pivot 2026-05-27**: Session C перестала быть IOPaint-сессией. Phase 2 retouch вынесена в post-launch зону Светланы (через [guide §3](../guide-for-svetlana.md#3-ретушь-watermark-на-фото-проектов)). Session C теперь — точечный sync документации: tasks.md / plan.md / CLAUDE.md / guide / log. Session D пишет project-04 с watermark-кадрами как референсом, концепт остаётся концептом. Старый блокер C → D (нужны retouched-кадры перед сессией копирайта) — снят.

**Важно про Session D:** research.md R2 явно требует писать Hero + About + project-04 в **одной сидячей сессии**, чтобы регистр не разошёлся. Если Светлана или брат не доступны для одного полного присутствия — лучше отложить Session D, чем разбить её на дни.

---

## Шаблон промпта для каждой сессии

Каждая сессия использует одинаковую структуру. Скопируй промпт под нужной сессией в **новое** окно Claude Code (для гарантии чистого контекста).

```
# Session <ID> — <название>

Эпик: ep02-design-and-copy. Эта сессия покрывает задачи: T##, T##, ...

## Холодный старт — прочитай по порядку
1. CLAUDE.md (constitution — особенно Принцип 1 с уточнением + epics).
2. docs/vision.md (продуктовый и архитектурный обзор).
3. docs/ep02-design-and-copy/research.md — секции, релевантные задачам этой сессии (Step 2.3 чек-лист антипаттернов, Step 4 design-system decisions, Step 5 риски).
4. docs/ep02-design-and-copy/plan.md — Steps релевантные сессии (Phases, Key Decisions, Data Model для контентных задач).
5. docs/ep02-design-and-copy/tasks.md — шапка с Definition of Done + полные брифы задач T##, T## этой сессии + Progress Tracker.
6. docs/ep02-design-and-copy/log.md если существует — что было сделано в предыдущих сессиях.

## Sanity-check состояния
- git log --oneline -15 — последние коммиты предыдущих сессий должны быть видны и соответствовать ожиданию (см. «Pre-flight» ниже).
- pnpm install прошёл? Если нет — выполни.
- pnpm build / pnpm typecheck / pnpm test / pnpm test:e2e — должны быть зелёными на текущем состоянии (если нет — что-то сломалось в предыдущей сессии, остановись и сообщи).

## Pre-flight (что уже должно работать)
<список>

## Цель сессии
<one-liner>

## Что делать
Запусти `/my-execute ep02-design-and-copy` для задач T##, T##, ... в порядке зависимостей по Waves плана.

Каждая задача:
- Сверь acceptance criteria из tasks.md.
- Пройди DoD из шапки tasks.md (включая Lighthouse 95+ для UI-задач и stop-list grep T26 для контентных задач).
- Отдельный commit формата `ep02 T## <короткое описание>`.
- Чекбокс в Progress Tracker отмечен.
- Запись в `docs/ep02-design-and-copy/log.md`.

## Exit-критерии (без них сессия не закрыта)
<список>

## Если что-то не так
- Acceptance не сходится → диагностируй, чини, не закрывай задачу частично.
- Заблокирован внешним шагом (ретушь не готова, редактор недоступен, sister offline) → остановись, сформулируй точный запрос пользователю.
- Контекст превысил ~150k токенов → останови сессию, оформи partial-commit, опиши состояние в log.md, попроси пользователя запустить новую сессию.

## После завершения
- Обнови Progress Tracker.
- Запиши итог сессии в log.md.
- Подскажи пользователю следующую сессию: «Session <X+1> — <название>».
```

---

## Промпты по сессиям

### Session A — Typography foundation + hardening gates

**Pre-flight (должно уже быть):** ep01 закрыт (`main` зелёный, Lighthouse 95+, превью-деплой живой). Локально `pnpm install` прошёл, `pnpm build` зелёный на текущем `main`. Никаких отложенных PR на typography/контент.

```
# Session A — Typography foundation + hardening gates

Эпик: ep02-design-and-copy. Задачи: T01, T02, T26, T27 (Wave 1).

## Холодный старт
1. CLAUDE.md (особое внимание — Принцип 1 + уточнение про placeholder/LLM-черновик; Принцип 3 Lighthouse 95+; Принцип 5 бюджет; Принцип 6 простота).
2. docs/ep02-design-and-copy/research.md — Step 2.2 (таблица кандидатов шрифтов, верификация cyrillic), Step 4 (design system).
3. docs/ep02-design-and-copy/plan.md — Step 3 (Tech Stack, фиксация на PT Serif), Step 10 Key Decisions (особенно decision о Fraunces → PT Serif).
4. docs/ep02-design-and-copy/tasks.md — DoD (шапка) + брифы T01, T02, T26, T27 + First Task Brief в конце для T01.

## Pre-flight
- git log --oneline -10 показывает, что ep01 закрыт; никаких незакоммиченных typography/контент-изменений.
- pnpm install / pnpm build / pnpm test / pnpm test:e2e — всё зелёное на текущем main.
- В package.json присутствует `@fontsource-variable/fraunces` (это то, что мы заменим).
- src/styles/tokens.css — пустой placeholder.

## Цель сессии
PT Serif (cyrillic-only initial) подключён вместо Fraunces; `tokens.css` заполнен финальной шкалой (типографика, leading, tracking, spacing, минимальная палитра); Vitest stop-list grep gate зелёный на текущем содержимом `src/content/`; `.github/pull_request_template.md` подхватывается GitHub. На этом этапе сайт ещё не «выглядит финально» — это foundation, поверх которого Phase 1 wiring (Session B) допилит preload-hints, admin sync, Hero и регрессионный тест.

## Что делать
Создай ветку `feature/ep02-typography-foundation`.

Запусти `/my-execute ep02-design-and-copy` для T01, T02, T26, T27 (параллельны по зависимостям, в одной сессии — последовательно).

Особое внимание:
- **T01 — pre-flight перед коммитом**: после `pnpm add @fontsource/pt-serif` загляни в `node_modules/@fontsource/pt-serif/`, **зафиксируй фактические имена CSS-файлов** в комментарии к коммиту. Только потом правь `src/styles/global.css`. Импортируй ТОЛЬКО cyrillic subset (3 файла: cyrillic-400-normal, cyrillic-700-normal, cyrillic-400-italic). Latin намеренно не подключается на этой стадии.
- **T01 — если subset выбран неверно**: визуально проверь любую страницу с русским заголовком в `pnpm dev` после правки CSS. Если глифы рендерятся системным Georgia вместо PT Serif — что-то с путями импортов; не двигайся дальше, чини T01 на месте.
- **T02 — без чисел «впрок»**: финальная шкала — это то, что реально нужно по Hero/About/project pages в Schema 1. Никаких `--text-3xl, --text-4xl, --text-5xl, --text-6xl, --text-7xl, --text-8xl` «на будущее» — только то, что используется. Modular ratio 1.25 или 1.333 — выбери одно, зафиксируй в комментарии файла.
- **T26 — стоп-лист как массив**: вынеси список штампов из CLAUDE.md Принципа 1 в отдельный массив на верху спека (или в `tests/content/stop-list.ts`), чтобы расширять было одной строкой. Нормализуй non-ASCII пунктуацию (тире — vs дефис -) перед сравнением.
- **T26 — проверь текущее содержимое src/content/**: если placeholder-тексты ep01 уже содержат штамп — это отдельная находка, зафиксируй в log.md, но T26 при этом проходит (мы добавляем gate, а не чиним placeholders — те всё равно перепишутся в Sessions D/E).
- **T27 — один файл**: только `.github/pull_request_template.md`, ничего больше. Не плодить шаблоны на типы PR.

## Exit-критерии
- [ ] git log --oneline показывает 4 коммита вида `ep02 T0X ...` / `ep02 T2X ...`.
- [ ] `pnpm dev` → открыть любую страницу с русским заголовком (например, `/works/project-01`) → `<h1>` рендерится PT Serif (визуально засечковый шрифт, не Georgia). DevTools → Network → Font: видны `pt-serif-cyrillic-*.woff2` запросы.
- [ ] `pnpm test` зелёный, включая `tests/content/stop-list.spec.ts`.
- [ ] Открыть тестовый draft PR на ветке → body содержит copy-debt чек-лист из `.github/pull_request_template.md`.
- [ ] `pnpm build` зелёный.
- [ ] `pnpm typecheck` / `pnpm lint` чистые.
- [ ] Progress Tracker T01, T02, T26, T27 отмечен.
- [ ] log.md создан (если не было), итог сессии записан.

## Следующая сессия
Session B — Phase 1 wiring + merge.

Сразу после A можно стартовать Session C (retouch) параллельно в отдельном окне — это manual user work, не блокирует B.
```

---

### Session B — Phase 1 wiring + merge

**Pre-flight:** Session A завершена. PT Serif подключён, токены живые, stop-list grep работает.

```
# Session B — Phase 1 wiring + merge

Эпик: ep02-design-and-copy. Задачи: T04, T05, T06, T07, T09, T10 (Wave 2 + Wave 3 + Wave 4).

## Холодный старт
1. CLAUDE.md (Принципы 1, 3, 6).
2. docs/ep02-design-and-copy/research.md — Step 4.2 (Hero treatment Schema 1), Step 5 R1 (cyrillic gap mitigation), R5 (admin shell), R7 (Lighthouse под двумя шрифтами).
3. docs/ep02-design-and-copy/plan.md — Step 6 Phase 1 (полный список deliverable), Step 10 Key Decisions (regression test rationale).
4. docs/ep02-design-and-copy/tasks.md — DoD + брифы T04, T05, T06, T07, T09, T10.
5. docs/ep02-design-and-copy/log.md — что было сделано в Session A.

## Pre-flight
- git log -10 показывает завершённую Session A (4 коммита T01, T02, T26, T27).
- `pnpm dev` показывает PT Serif на русских заголовках.
- `tests/content/stop-list.spec.ts` существует и зелёный.
- `.github/pull_request_template.md` существует.
- src/styles/tokens.css заполнен.

## Цель сессии
- Кириллический subset PT Serif верифицирован через wakamai-fondue / fonttools (T04). Если дыра в глифах — fallback на Onest single-sans (план B из research.md) — но это маловероятно.
- Preload-hints для PT Serif cyrillic-400 и Inter 400 добавлены в Layout.astro (T05).
- public/admin/index.html подгружает те же шрифты через CDN — preview Decap не падает в Georgia (T06).
- Hero.astro откалиброван по Schema 1: text-only остаётся, добавлен CTA «Смотреть работы», размеры через токены, max-width на 10–12 слов в строке (T07).
- Playwright typography.spec.ts — резолвит computed font-family русского `<h1>`, утверждает PT Serif, негативный тест проверен (T09).
- Phase 1 PR смёрджен в `main`; Lighthouse CI mobile 95+ на всех 4 метриках; превью-деплой показывает финальную типографику (T10).

## Что делать
Продолжай работу в той же ветке `feature/ep02-typography-foundation` или создай feature-branch `feature/ep02-phase1-wiring` (на твоё усмотрение — но если ветка уже открыта PR'ом из Session A, проще влить туда же).

Запусти `/my-execute ep02-design-and-copy` для T04 → T05 / T06 / T07 параллельно (зависят только от T01) → T09 (зависит от T01+T07) → T10 merge.

Особое внимание:
- **T04 — структурный stop-loss**. Если PT Serif реально окажется с неполной кириллицей в каком-либо весе — НЕ продвигайся к T05+. Останавливайся, переключай план на Variant A (Onest single-sans, см. research.md Step 4.1), переделывай T01 на `@fontsource/onest`, потом возвращайся сюда. Стоимость отката — половина дня, стоимость не-отката — silent bug 2.0.
- **T05 — два preload-link'а, не больше**: PT Serif cyrillic-400-normal + Inter 400. Никаких «на всякий случай» для bold/italic/Inter-500-600 — они подгружаются после first paint, swap-задержка приемлема. Это явно Principle 6.
- **T06 — pre-flight для jsDelivr URL**: открой `https://cdn.jsdelivr.net/npm/@fontsource/pt-serif@<version>/` в браузере, проверь, что отдаёт 200 и видны cyrillic-CSS пути. Если jsDelivr не отдаёт — fallback на Google Fonts CDN (`https://fonts.googleapis.com/css2?family=PT+Serif:...&subset=cyrillic`).
- **T07 — CTA это НОВАЯ разметка**: в ep01-версии Hero.astro CTA не было. Не пытайся «вернуть» — добавь от нуля. Подкласс — тонкая ссылка под основным блоком (не яркая кнопка).
- **T07 — placeholder-сигнал**: текущий текст в `src/content/pages/hero.md` — placeholder ep01, не финал. Финал придёт в Session D (T12). Убедись, что в visual-проверке на `pnpm dev` placeholder не выглядит как финальный текст (можно добавить визуальный sentinel — например, `<!-- TODO: T12 final copy -->` в frontmatter).
- **T09 — негативный тест обязателен**: после того, как тест проходит зелёным, временно сломай импорт в global.css (закомментируй `@import '@fontsource/pt-serif/...'`), убедись, что тест краснеет, восстанови. Это и есть гарантия, что тест не зелёнит ложно.
- **T10 — если Lighthouse Perf падает < 95**: причина почти всегда — preload-hints резолвлены не туда (Astro fingerprint vs hard-coded path), либо CSS-вес шрифтов чрезмерный. Сначала проверь preloads в DevTools → Network → Priority. Если Perf всё ещё низкий — оставь только cyrillic-400 PT Serif (убери 700 и italic), Italic используется редко.

## Exit-критерии
- [ ] git log -15 показывает 6 новых коммитов T04, T05, T06, T07, T09, T10.
- [ ] `pnpm test:e2e` зелёный, включая новый `tests/e2e/typography.spec.ts`.
- [ ] `pnpm dev` → `/admin/` → редактор страницы → preview-pane рендерит русский текст в PT Serif (а не Georgia).
- [ ] `pnpm dev` → `/` → Hero text-only, размеры из токенов, CTA «Смотреть работы» виден и ведёт на `/works`.
- [ ] Lighthouse CI mobile ≥ 95 на 4 метриках в PR (ссылка на CI-ран сохранена в log.md).
- [ ] Phase 1 PR смёрджен в `main`, превью-деплой `*.workers.dev` показывает PT Serif вместо Georgia на русских заголовках.
- [ ] Progress Tracker T04, T05, T06, T07, T09, T10 отмечен.
- [ ] log.md обновлён: зафиксирована точная версия `@fontsource/pt-serif` (для воспроизводимости).

## Следующая сессия
Session D — Copy session 1 (one sitting). **Но только если Session C к этому моменту уже завершена** — иначе у тебя не будет retouched-кадров project-04 как визуального референса для concept-текста (T14). Если C не готова — заверши её сначала.
```

---

### Session C — Pivot: guide update + scope freeze (was: Asset retouch)

> **Pivot 2026-05-27**: фаза ретуши watermark (T03/T08/T11) полностью deferred to Svetlana's post-launch work. Session C перестала быть IOPaint-сессией и стала точечным sync документации. Старый бриф ниже сохранён как комментарий — на случай если потребуется вернуть фазу в скоуп ep02 (маловероятно).

**Pre-flight:** Session A завершена (Session B желательна для полноты документального состояния, но не блокирует). Никаких feature-веток, никакого IOPaint.

```
# Session C — Pivot: guide update + scope freeze

Эпик: ep02-design-and-copy. Pivot 2026-05-27: T03/T08/T11 → DEFERRED (post-launch Свeта), T19 → REMOVED, T28 → REFRAMED.

## Что нужно сделать
1. Обновить tasks.md: T08/T11 → DEFERRED статус, T19 → REMOVED, T28 → reframed (плашка на всех isConcept), Waves diagram и Progress Tracker отражают post-pivot scope.
2. Обновить plan.md: Step 1 MVP scope (pilot — копирайт+типографика, ретушь deferred); Phase 2 deferred; Phase 4 без T19, плюс reframed T28.
3. Обновить session-plan.md: карту сессий + critical path; этот блок Session C переписать; Session D pre-flight без зависимости от ретуши; Session E без T19; Session F с reframed T28.
4. Обновить guide-for-svetlana.md: добавить новую секцию «Что считать проектом / Честность и фрейминг / Структура одного проекта» перед §3 (ретушь) или сразу после §2 (админка) — обоснование честного концепт-фрейминга.
5. Обновить CLAUDE.md `## Epics` row для ep02 — outcome адаптирован под deferred retouch.
6. Обновить log.md: Session C запись «pivot, retouch deferred» (заменяет более ранний «paused»).

## Exit-критерии
- [ ] Все 6 файлов выше синхронизированы.
- [ ] `pnpm test` / `pnpm build` / `pnpm typecheck` / `pnpm lint` — зелёные (изменения только в docs/CLAUDE.md, инвариант проекта не нарушен).
- [ ] Stop-list grep gate (T26) зелёный (в guide могут появиться новые формулировки — убедиться что без штампов из Принципа 1; стоп-лист сканит только `src/content/**/*.md`, не `docs/`, но всё равно перечитать новый текст глазами).
- [ ] Один коммит формата `ep02 Session C pivot — defer retouch + guide update`, либо 2–3 атомарных коммита (docs sync + guide update + log).
- [ ] Progress Tracker отметки: T03/T08/T11 → `[~] DEFERRED`, T19 → `[~] REMOVED`.

## Если что-то не так
- Если возникает соблазн «всё-таки сделать ретушь сейчас» — НЕ делать. Решение зафиксировано: ретушь — work Светы по гайду, не Claude. Принцип 6 (простота) + Принцип 7 (честность плашки) защищают этот выбор.
- Если в guide новый текст случайно содержит штамп из Принципа 1 — убрать конкретной заменой (см. Принцип 1 + stop-list).

## Следующая сессия
Session D — Copy session 1. Pre-flight без ретуши: project-04 пишется с watermark-кадрами как референсом.
```

---

<!--
Старый бриф Session C (до pivot 2026-05-27) — Asset retouch via IOPaint + Phase 2 PR. Оставлен в комментарии на случай если фаза вернётся в скоуп.

**Pre-flight (старый):** Session A завершена (Session B не обязательна — ретушь не зависит от шрифтов). IOPaint установлен на машине автора (T03 — manual). Ветка `feature/ep02-pilot-images` создана от `main`.

T08 — manual работа автора в IOPaint LaMa, маска на watermark. T11 — Claude кладёт 4 retouched JPEG in-place в `src/assets/projects/project-04/01..04.jpg`, открывает PR `feature/ep02-pilot-images`, мерджит. Контракт in-place: имена файлов не меняются. Если файл крупнее оригинала в 2+ раз — sharp -q 82.

Подробности см. в plan.md Phase 2 (deferred) и tasks.md T08/T11 (deferred briefs).
-->


---

### Session D — Copy session 1 (one sitting!)

**Pre-flight:** Sessions B + C завершены. PT Serif живёт на main; **project-04 остаётся с watermark Homestyler** (Phase 2 deferred, см. Session C pivot 2026-05-27) — концепт-текст пишется с этими кадрами как референсом, материальная подача честно описывает то, что есть. **Светлана и брат доступны в одной непрерывной сессии** (см. research.md R2 — критично для register coherence).

```
# Session D — Copy session 1 (Hero + About + project-04, в одной сидячей сессии)

Эпик: ep02-design-and-copy. Задачи: T12, T13, T14, T15 (Wave 5 + Wave 6).

## ⚠️ Главное про эту сессию
Эта сессия — **самая важная и самая хрупкая** в ep02. Здесь рождается голос Светланы как автора. Три текста — Hero, About, project-04 concept — должны быть написаны в одном сидячем подходе, иначе регистр между ними неизбежно разойдётся (research.md R2).

Если Светлана или брат уезжают / болеют / отвлекаются — НЕ продолжай сессию. Останови, дождись окна, в которое оба присутствуют целиком. Лучше отложить ep02 на неделю, чем получить тексты с тремя разными голосами.

## Холодный старт
1. CLAUDE.md (Принцип 1 + уточнение про placeholder/LLM-черновик; Принцип 7 — honest junior подача).
2. docs/ep02-design-and-copy/research.md — Step 2.3 ЦЕЛИКОМ (регистр-ориентиры, антипаттерны, чек-лист 5 пунктов), Step 4.3 (что значит «pilot оформлен»).
3. docs/ep02-design-and-copy/plan.md — Step 6 Phase 3 (структура трёх абзацев About; структура summary + concept project-04), Step 10 Key Decisions (Rule 1 clarification rationale).
4. docs/ep02-design-and-copy/tasks.md — DoD + брифы T12, T13, T14, T15 + implementation notes.
5. docs/ep02-design-and-copy/log.md — что было сделано в B+C.

## Pre-flight
- Sessions B + C завершены. main содержит финальную типографику; project-04 остаётся с watermark Homestyler (Phase 2 deferred — Session C pivot 2026-05-27).
- `/works/project-04` на превью-деплое выглядит как должно с watermark+плашкой (визуально знаком автору перед сессией); концепт-текст будет описывать то, что есть.
- Stop-list grep gate (T26) зелёный на текущем содержимом `src/content/`.
- Светлана и брат сейчас доступны 3–5 часов одним блоком (без длительных пауз).
- Светлана прочитала research.md Step 2.3 перед сессией (минимум — чек-лист 5 пунктов и стоп-лист).

## Цель сессии
Финальные тексты:
- `src/content/pages/hero.md` — 25–60 слов, первое лицо, манифест-фраза + переход.
- `src/content/pages/about.md` — 250–400 слов, три абзаца по жёсткой структуре (подход → диплом одной строкой → отличие в работе с заказчиком).
- `src/content/projects/project-04.md` frontmatter `summary` (≤ 200 символов) + body `concept` (3–5 предложений, конкретный материальный текст).

Все тексты:
- Написаны Светланой как первичный draft (НЕ Claude). Принцип 1 уточнение — Claude не пишет первичный draft.
- Прошли редактуру брата (≤ 2 итерации; если требуется третья — пауза, ретроспектива в log.md).
- Чек-лист 2.3 пройден по каждому артефакту.
- Stop-list grep (T26) зелёный после правок.
- Метка «v1, до внешней редактуры» в PR title или body.
- Phase 3 PR `feature/ep02-copy-core` смёрджен в main.

## Что делать
Создай ветку `feature/ep02-copy-core` от main.

Запусти `/my-execute ep02-design-and-copy` для T12 → T13 → T14 (параллельны по зависимостям, в одной сессии — последовательно в порядке написания) → T15 merge.

**Роль Claude в этой сессии — НЕ автор, НЕ редактор. Claude:**
1. Перед началом — освежает в памяти стоп-лист штампов и чек-лист 2.3, готов цитировать их по запросу.
2. По мере того, как Светлана присылает draft Hero — Claude **только** прогоняет его через чек-лист 2.3 и stop-list grep, фиксирует findings, ничего сам не переписывает. Если Светлана просит «предложи структуру» или «помоги собрать факт в фразу» — это допустимо; «напиши за меня Hero» — нет (нарушение Rule 1 уточнения).
3. Когда брат отдаёт правки — Claude применяет их к файлу как есть. Если правки противоречат чек-листу 2.3 (например, брат вернул штамп) — Claude указывает на это, но решение всё равно за людьми.
4. После того, как Hero / About / project-04 концепт-текст готовы — Claude коммитит каждый отдельно (`ep02 T12 hero copy v1`, `ep02 T13 about copy v1`, `ep02 T14 project-04 summary+concept v1`).
5. Открывает PR `feature/ep02-copy-core` с явной меткой «v1, до внешней редактуры» в title.
6. Проверяет, что CI зелёный (Lighthouse 95+, e2e tests, stop-list grep), мерджит.

Особое внимание:
- **About — диплом одной строкой**: формулировка из plan.md — «диплом о профессиональной переподготовке, ООО „ДИСКИЛЛ", май 2026». Точный месяц/год — подтвердить со Светланой при сессии. Это **факт**, не апология и не бравада. Если Светлана хочет добавить контекст («после 10 лет в смежной области») — это нормально, но это второе предложение того же абзаца, не превращающее факт в самоописание.
- **project-04 concept — структура из tasks.md T14**: «что нашли → что хотели сохранить → центральное материальное решение → как это видно в кадрах». Это **жёсткая** структура, которая потом тиражируется на project-01/02/03 в ep03. Если в этой сессии 3–5 предложений не складываются по этой структуре — это сигнал, что либо концепт project-04 ещё не оформился у автора (тогда — пауза), либо структура нуждается в пересмотре (тогда — обсуждение, не молчаливое нарушение).
- **«Одна-две итерации редактуры»**: если брат делает второй проход и третья итерация всё ещё требуется — НЕ продавливай в коммит. Остановись, оформи запись в log.md (что именно не сошлось), пауза. Возможно, нужна перепланировка (другой текст-структура, другой угол подачи).
- **stop-list grep после редактуры**: запусти `pnpm test -- stop-list` после внесения правок брата. Если краснеет — найди штамп, обсуди с автором замену на конкретный факт.

## Exit-критерии
- [ ] git log показывает 3 коммита: T12 hero, T13 about, T14 project-04 (по одному коммиту на артефакт; T15 — это PR merge, а не отдельный коммит).
- [ ] `pnpm test` зелёный (stop-list).
- [ ] `pnpm test:e2e` зелёный.
- [ ] Lighthouse CI на PR зелёный (≥ 95 mobile все 4 метрики).
- [ ] PR title или body содержит «v1, до внешней редактуры».
- [ ] PR смёрджен; превью main показывает все три текста живыми на сайте.
- [ ] log.md содержит запись: сколько итераций редактуры понадобилось на каждый текст; что было сложно; что вынес автор для себя на следующую сессию.
- [ ] Progress Tracker T12, T13, T14, T15 отмечен.

## Если что-то пошло не так
- Светлана не может написать первичный draft Hero / About за разумное время (~час–два каждый) → НЕ передавай задачу Claude. Остановись, оформи запись в log.md «Phase 3 paused: первичный draft не выходит на сессии XX-XX-XX». Возможно, нужно дополнительное чтение (Strelka, «Проект Россия», ревзинские колонки) для калибровки регистра. Возврат к сессии — когда автор готов.
- Брат не может пройти редактуру в две итерации → ретроспектива в log.md (что именно расходилось — фактура, структура, регистр). Иногда «не сходится» — это сигнал «первичный draft недоделан», не «редактор слишком требователен».
- Stop-list grep краснеет на финальной правке → не маскируй («скроем фразу через юникод»), найди настоящую конкретную замену.

## Следующая сессия
Session E — Copy session 2 (services + contact + badge).
```

---

### Session E — Copy session 2 (services + contact)

**Pre-flight:** Session D завершена. Hero, About, project-04 текст на main. Голос Светланы зафиксирован тремя текстами — это калибровочный referenchik для services/contact, которые более служебны.

> **Pivot 2026-05-27**: T19 (снять плашку «концепт-проект» для project-04) **REMOVED** из этой сессии. Раз ретушь project-04 отложена, плашка корректно остаётся (Принцип 7). Сессия теперь только про копирайт (T16/T17/T18).

```
# Session E — Copy session 2 (services intro + 3 service bodies + contact intro)

Эпик: ep02-design-and-copy. Задачи: T16, T17, T18 (Wave 7). T19 — REMOVED после Session C pivot 2026-05-27.

## Холодный старт
1. CLAUDE.md (Принцип 1 + уточнение; Принцип 7).
2. **docs/ep02-design-and-copy/log.md из Session D — особое внимание**. Прочитай тексты Hero / About / project-04 из текущего main; это твой эталонный регистр для services/contact.
3. docs/ep02-design-and-copy/research.md — Step 2.3 (чек-лист, релевантный и здесь).
4. docs/ep02-design-and-copy/plan.md — Step 6 Phase 4 (структура service bodies; жёсткая единая на все три).
5. docs/ep02-design-and-copy/tasks.md — DoD + брифы T16, T17, T18, T19.

## Pre-flight
- Session D завершена. Hero / About / project-04 текст на main.
- Stop-list grep gate (T26) зелёный.
- Текущий компонент с UI-плашкой «концепт-проект» найден (см. T19 implementation note — grep по строке плашки в `src/components/projects/`).

## Цель сессии
- `src/content/pages/services-intro.md` — 80–150 слов, одно-два предложения о подходе к услугам.
- `src/content/services/full-design.md`, `supervision.md`, `consulting.md` — по 120–180 слов в одинаковой жёсткой структуре (Что входит / Когда подходит / Что на выходе).
- `src/content/pages/contact-intro.md` — 40–80 слов (канал связи + формат первого разговора).
- UI-плашка «концепт-проект» скрыта для project-04, остаётся для project-01/02/03. `isConcept: true` в frontmatter project-04 сохранён как внутренний метаданный.
- Все тексты помечены «v1»; регистр откалиброван под Hero/About из Session D.

## Что делать
Создай ветку `feature/ep02-copy-services-contact` от main.

Запусти `/my-execute ep02-design-and-copy` для T16, T17, T18, T19 (параллельны по зависимостям; T17 — самый объёмный, его пиши в одной session-sub-block, чтобы регистр трёх services не разошёлся).

Особое внимание:
- **Регистр-якорь — Hero/About из Session D**: перед каждым новым текстом перечитывай оба. «Если бы Hero и About писал тот же человек, что и эту услугу — звучит ли в одной тональности?» Это эталон.
- **T17 — жёсткая структура для трёх**: Что входит (3–5 пунктов конкретики этапов) / Когда подходит (1–2 фразы про типичный кейс) / Что на выходе (что заказчик получает в руки). Никаких «также мы предлагаем» / «индивидуальный подход» / «работаем с любовью». Три файла пишутся в одной сидячей сессии, не разносить на отдельные дни.
- **T17 — НЕ Claude пишет первичный draft**. То же правило, что в Session D. Услуги — служебнее, чем About, но Принцип 1 уточнение остаётся в силе.
- **T18 — короткий текст**: 40–80 слов. Каждое слово на месте. Лучше 45 слов точных, чем 75 размытых. Канал связи — конкретный (Telegram / email); формат первого разговора — конкретный (бриф на 30 минут / список вопросов / что взять с собой).
- **T19 — REMOVED после Session C pivot 2026-05-27**: плашка корректно остаётся на project-04 (раз ретушь deferred, концепт остаётся концептом по Принципу 7). UI-логика `isConcept: true → плашка` уже работает правильно; никакой правки компонентов в этой сессии не требуется.

## Exit-критерии
- [ ] git log показывает 3 коммита T16, T17 (или 3 коммита по services-bodies), T18.
- [ ] `pnpm test` зелёный (stop-list grep на новых текстах чистый).
- [ ] `pnpm dev` → `/services` → видны 3 услуги в финальном виде; `/contact` — финальный intro; **концепт-плашка остаётся видна** и на `/works/project-04`, и на `/works/project-01` (оба `isConcept: true`).
- [ ] PR `feature/ep02-copy-services-contact` открыт (НЕ смёрджен в этой сессии — merge в Session F вместе с verification).
- [ ] Все тексты помечены «v1» в PR description.
- [ ] Progress Tracker T16, T17, T18 отмечен.
- [ ] log.md обновлён: сколько итераций редактуры, насколько регистр совпал с Session D.

## Следующая сессия
Session F — Phase 4 verify + merge. Здесь PR из Session E пройдёт визуальную приёмку и финальный merge.
```

---

### Session F — Phase 4 verify + merge

**Pre-flight:** Session E завершена, PR `feature/ep02-copy-services-contact` открыт, но не смёрджен.

```
# Session F — Phase 4 verify (visual review + badge test) + merge

Эпик: ep02-design-and-copy. Задачи: T20, T21, T28, T22 (Wave 8 + Wave 9).

## Холодный старт
1. CLAUDE.md (Принципы 1, 3, 7).
2. docs/ep02-design-and-copy/research.md — Step 4.3 («что значит pilot полностью оформлен»).
3. docs/ep02-design-and-copy/plan.md — Step 6 Phase 4 (deliverable список).
4. docs/ep02-design-and-copy/tasks.md — DoD + брифы T20, T21, T28, T22.
5. docs/ep02-design-and-copy/log.md.

## Pre-flight
- Session E завершена. PR `feature/ep02-copy-services-contact` существует, но не смёрджен.
- Превью-деплой этой ветки живой (Cloudflare Workers Builds автоматически создал preview URL для feature-ветки).

## Цель сессии
- Визуальный обзор `/works/project-04` на превью-деплое пройден: типографика + watermark-кадры (Phase 2 deferred) + финальный текст + плашка «Концепт-проект · фото в обработке» читаются как единое целое (T20).
- Smoke-обход `/works/project-01`, `/02`, `/03` на placeholder-контенте — никаких визуальных регрессий, ImageGallery работает на галереях 3 кадров vs 4 (T21).
- Playwright badge assertion (T28, reframed после Session C pivot) — **плашка видна на ВСЕХ 4 проектах** с `isConcept: true` (project-04 + project-01 в спеке как репрезентативная пара); негативный тест проверен.
- PR `feature/ep02-copy-services-contact` смёрджен; ep02 материально завершён (визуальный слой + копирайт на main, ретушь — open debt Светы).

## Что делать
Запусти `/my-execute ep02-design-and-copy` для T20 / T21 / T28 (параллельны) → T22 merge.

Особое внимание:
- **T20 — визуальный обзор на превью-деплое, не локально**: открой preview URL фичи на mobile (DevTools 375×667) и desktop (1280×800). Проверь по чек-листу из tasks.md T20: заголовок, метаданные, summary, concept body, gallery — читаются как единое целое; никаких quirks от смены шрифтов. **Watermark на кадрах остаётся** (Phase 2 deferred) — это ожидаемо, не баг.
- **T20 — если найден visual quirk** (line-height collapse, baseline-shift, overflow в gallery, неправильный wrap заголовка project-04): правь шаблон в том же PR (`src/pages/works/[slug].astro` или `src/components/projects/ProjectMeta.astro` — что окажется источником). НЕ открывай отдельный PR — это часть Phase 4.
- **T21 — особое внимание ImageGallery**: галереи project-01/02/03 — по 3 кадра; project-04 — 4. Проверь, что обе раскладки работают на mobile и desktop. Регрессия (например, последний кадр уходит за viewport) — править в этом же PR.
- **T28 (reframed) — два шага**: (1) grep по компоненту, найди существующий элемент плашки (после Session C pivot отдельной T19 нет — плашка уже на месте с ep01); добавь `data-testid="concept-badge"` к этому элементу точечной правкой компонента, если ещё не было. (2) Playwright assertion: оба URL (`/works/project-04` и `/works/project-01`) показывают плашку. Negative test — временно поставить `isConcept: false` в frontmatter project-04 → спек краснит → восстановить.
- **T22 — финальный merge**: Lighthouse CI зелёный, `pnpm test:e2e` зелёный (включая `typography.spec.ts` из Session B и новый `concept-badge.spec.ts` из T28), stop-list grep зелёный. PR description перечисляет все артефакты Phase 4 + сохраняет метку «v1, до внешней редактуры» + явно указывает «ретушь project-04 — deferred to Svetlana's post-launch work».

## Exit-критерии
- [ ] git log -10 показывает коммиты T28 (data-testid правка + spec) + T22 merge. T20/T21 коммиты — только если найден visual quirk при обзоре.
- [ ] `/works/project-04` на финальном main — финальный текст + watermark-кадры + новая типографика + плашка «Концепт-проект · фото в обработке» видна.
- [ ] `/works/project-01` — placeholder-текст ep01, плашка концепт-проект видна (как и на project-04 — обе isConcept).
- [ ] `/services`, `/contact` — финальные тексты на main.
- [ ] `pnpm test:e2e` зелёный (typography + concept-badge).
- [ ] `pnpm test` зелёный (stop-list).
- [ ] Lighthouse CI зелёный на финальном PR (mobile ≥ 95).
- [ ] PR смёрджен; ep02 материально завершён (только closeout остаётся в Session G).
- [ ] Progress Tracker T20, T21, T28, T22 отмечен.
- [ ] log.md обновлён.

## Следующая сессия
Session G — Closeout (CLAUDE.md → ep02 ✅ Done, vision.md tweaks, финальный log.md, Phase 5 PR).
```

---

### Session G — Closeout

**Pre-flight:** Session F завершена. ep02 материально на main. Остался только housekeeping: статус, vision tweaks, финальная запись.

```
# Session G — Closeout (CLAUDE.md статус, vision.md правки, log.md финал, Phase 5 PR)

Эпик: ep02-design-and-copy. Задачи: T23, T24, T25 (Wave 10 + Wave 11).

## Холодный старт
1. CLAUDE.md (особенно секция `## Epics` — посмотри текущий статус ep02 и формат строки).
2. docs/vision.md — Open Questions полностью (предмет правок T24).
3. docs/ep02-design-and-copy/research.md — Step 9b (предложения по правкам vision.md).
4. docs/ep02-design-and-copy/plan.md — Step 11 (Save Plan — то, что предписано сейчас).
5. docs/ep02-design-and-copy/tasks.md — DoD + брифы T23, T24, T25.
6. docs/ep02-design-and-copy/log.md — полная история ep02.

## Pre-flight
- Session F завершена. ep02 материально на main. Все 22 предыдущих task завершены, Progress Tracker заполнен.
- CLAUDE.md: статус ep02 = `🔄 Active` (был выставлен при ratification плана).
- Принцип 1 уточнение уже присутствует в CLAUDE.md (был добавлен при ratification плана; T23 acceptance — проверить, что не сломалось).

## Цель сессии
- CLAUDE.md `## Epics` → строка ep02-design-and-copy статус `✅ Done` (T23).
- CLAUDE.md Принцип 1 уточнение — на месте (проверка профилактическая; правок не требует).
- docs/vision.md Open Questions: пункт 1 (эстетика → типографический настрой A/B/C, выбран B) и пункт 2 (Hero — typographic в ep02, photo-decision delegated в ep03) обновлены (T24).
- docs/ep02-design-and-copy/log.md — финальная запись с явно зафиксированным **открытым долгом**: внешняя редактура текстов не пройдена, Constitution Rule 1 формально остаётся открытым до прохождения вычитки (T25).
- Phase 5 PR `feature/ep02-closeout` смёрджен в main; Lighthouse CI зелёный.

## Что делать
Создай ветку `feature/ep02-closeout` от main.

Запусти `/my-execute ep02-design-and-copy` для T23 / T24 (параллельны) → T25 merge.

Особое внимание:
- **T23 — НЕ переключай статус ep03**: в таблице `## Epics` строка ep03-content-and-launch остаётся `📋 Planned`. Activation ep03 — это отдельное событие, не часть закрытия ep02.
- **T24 — точечные правки**: trogai только Open Questions 1 и 2. Остальные части vision.md не трогаем. Если research.md Step 9b предлагает третью правку (Architecture Map — упоминание шрифтов) — это опционально, реши с автором.
- **T25 — log.md финальная запись**: явно перечисли (а) что сделано (4 текста pages + 3 service bodies + project-04 финализирован + типографика PT Serif live + 2 hardening tasks), (б) **открытый долг внешней редактуры** — что не пройдено, что нужно для закрытия Rule 1, кто потенциально будет редактор, когда планируется вычитка. Не маскируй долг — он должен быть видим в `log.md` отдельным заметным абзацем.
- **T25 — финальный PR description**: ссылка на этот PR должен быть в формате «ep02 close-out: CLAUDE.md status + vision.md tweaks + log.md final». Lighthouse CI зелёный — контрольный, не должно ничего регрессировать.

## Exit-критерии
- [ ] git log -5 показывает коммиты T23, T24, T25.
- [ ] CLAUDE.md: ep02-design-and-copy: `✅ Done`. ep03 остаётся `📋 Planned`.
- [ ] CLAUDE.md Принцип 1 уточнение — на месте (визуальный diff между HEAD и pre-ep02 — без неожиданных правок).
- [ ] docs/vision.md Open Questions 1 и 2 обновлены, остальное не тронуто.
- [ ] docs/ep02-design-and-copy/log.md содержит финальный абзац с явным открытым долгом внешней редактуры.
- [ ] PR `feature/ep02-closeout` смёрджен; Lighthouse CI зелёный (контрольный).
- [ ] Progress Tracker полностью заполнен (T01..T28, все 28 чекбоксов).
- [ ] log.md обновлён: «ep02-design-and-copy закрыт <date>. Следующий: ep03-content-and-launch. Открытый долг: внешняя редактура — параллельный поток».

## После
Эпик ep02-design-and-copy формально закрыт. Тексты живут на main как «v1, до внешней редактуры»; внешняя вычитка — параллельный поток, который может закрыться после публичного запуска (ep03).

Следующее действие — `/my-research ep03-content-and-launch` (когда будешь готов начать).
```

---

## Между сессиями

### Что делает пользователь между сессиями

1. **Проверь финальные коммиты** последней сессии: `git log --oneline -10`.
2. **Проверь Progress Tracker** в `docs/ep02-design-and-copy/tasks.md` — чекбоксы на новых задачах отмечены.
3. **Прочитай запись в `log.md`** — что было сделано, нет ли непредвиденных решений (особенно — если ретушь Session C дала артефакты, или копирайт Session D потребовал больше двух итераций редактуры).
4. **Если есть внешние/manual задачи** (установка IOPaint для C; присутствие Светланы+брата для D; ретушь файлов от автора) — выполни их перед стартом следующей сессии.
5. **Закрой текущее окно Claude Code**.
6. **Открой новое окно**, вставь промпт следующей сессии.

### Когда останавливаться и звать пользователя посреди сессии

- Acceptance criteria не сходятся даже после диагностики — не закрывай задачу частично.
- **Session B**: T04 показал реальную дыру в кириллице PT Serif → переключение на fallback план (Onest) — это не «продолжение», это пересмотр Session A. Останови, попроси решения.
- **Session C (post-pivot 2026-05-27)**: возникает соблазн «всё-таки сделать ретушь сейчас» — НЕ делать. Решение зафиксировано — ретушь это work Светы по [guide §3](../guide-for-svetlana.md#3-ретушь-watermark-на-фото-проектов), не Claude.
- **Session D**: первичный draft Hero / About не выходит за разумное время; редактура брата требует третью итерацию — это сигналы планирования, не работы. Останови, оформи ретроспективу в log.md.
- **Session E**: регистр трёх текстов разъезжается с Hero/About из D — пауза, перечитай D, попробуй заново.
- **Session F**: визуальный обзор T20 нашёл quirk, который не правится в шаблоне без архитектурного решения — останови, обсуди.
- Stop-list grep (T26) краснеет на финальном draft → не маскируй, найди конкретную замену штампу.
- Контекст приближается к 150k токенов → лучше закоммить промежуточное и открыть новое окно.

### Файлы для проверки между сессиями

- `docs/ep02-design-and-copy/log.md` — что было сделано.
- `docs/ep02-design-and-copy/tasks.md` — Progress Tracker.
- `CLAUDE.md` — статус эпика, особенно Принцип 1 уточнение.
- `git log --oneline` — коммиты.

---

## Если /my-execute ведёт себя не так

Промпты предполагают, что `/my-execute ep02-design-and-copy` принимает список задач и идёт по ним. Если на практике скилл работает иначе:

- Запускай его без аргументов — он сам подберёт следующую `pending` задачу из Progress Tracker.
- После каждой задачи проверяй коммит и тогда запускай снова на следующую.
- Если скилл не предусматривает фильтр по списку — просто работай в порядке Wave из tasks.md, остановись по достижении границы сессии (последняя задача сессии — указана в шапке промпта).

---

## Особенности ep02 относительно ep01

| Аспект | ep01 | ep02 |
|---|---|---|
| Количество сессий | 13 | 7 (включая C — короткая docs-pivot после 2026-05-27) |
| Доля manual user work | средняя (внешние OAuth/CF dashboard шаги) | копирайт-сессии (D/E); IOPaint-ретушь — вынесена в post-launch зону Светы по [guide §3](../guide-for-svetlana.md#3-ретушь-watermark-на-фото-проектов) |
| Самая хрупкая сессия | Session H (форма + consent) | **Session D** (one-sitting copy — register coherence) |
| Critical path | A → B → C → F → G → H → I → J → K → L → M | A → B → C (docs-only pivot) → D → E → F → G |
| Параллельные ветки | D, E | — (после pivot 2026-05-27 параллельной ретуш-ветки нет) |
| Внешние блокеры | GitHub OAuth App, Yandex.Metrica ID, Cloudflare Pages | автор + редактор в одной сессии D |
| Главный риск | технический (CSP, deploy) | человеческий (голос Светланы не закрепится без правильной сессии D) |
| Открытый долг по выходу | — | (а) внешняя редактура «v1»-текстов; (б) ретушь watermark project-04 (Свeта, через guide) |

Главный практический вывод: **Session D — это ось ep02**. Все остальные сессии — инфраструктура вокруг неё. Если D пройдёт хорошо (Hero / About / project-04 в едином регистре, прошедшем редактуру), ep02 удался. Если D развалится — никакие технические сессии этого не починят. Планируй её отдельно и заранее.
