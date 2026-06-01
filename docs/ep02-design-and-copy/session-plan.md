# Session plan — ep02-design-and-copy

> Декомпозиция исполнения эпика на сессии. Цель: каждую сессию запускать в чистом окне Claude Code, не упираясь в лимит контекста и не теряя качества.
>
> Источник задач: [`tasks.md`](tasks.md). Каждая сессия покрывает 1–6 задач из waves плана. Внутри сессии используется `/my-execute ep02-design-and-copy` — он сам читает task-спеки, коммитит per task и ведёт `log.md`.
>
> Если внутри сессии что-то идёт не по плану — Claude переходит в ручной режим или останавливается и зовёт тебя.

<!--
RE-PLAN 2026-05-31 (mid-epic). Этот файл перегенерирован в re-plan-режиме (skill my-sessions Step 5).
Что изменилось относительно прошлой версии session-plan.md:
1. Sessions A, B завершены и смёрджены (PR #9, main 7094eb3). История сохранена ниже как ✅ Done.
2. Session C прошла как PIVOT (не IOPaint-ретушь): T08/T11 → DEFERRED, T19 → REMOVED, T28 → REFRAMED.
   PR #11, main f3bc764. История сохранена ниже как ✅ Done.
3. НЕЗАПЛАНИРОВАННАЯ визуальная сессия (PR #13, main 59f1ee5, 2026-05-28) — НЕ была в прошлой карте.
   Привязана к отдельному плану «ep02-design-and-copy-linked-deer». Внесла: warm paper-палитра в
   tokens.css, Hero конфигурация B (eyebrow + marginalia), новый FeaturedWorks 2×2 на главной,
   унификация /works на X3-WorkCard, удаление ManifestoBlock и старого ProjectCard, новый
   featured-works.spec.ts. Эта работа НЕ отражена в log.md эпика — закрытие этого долга вынесено
   в первый шаг следующей живой сессии (см. Session D pre-flight).
4. Остаток эпика (копирайт + verify + closeout) пере-сгруппирован против текущего tasks.md ниже.
   Покрытие задач не изменилось (T12..T18, T20..T25, T28), но pre-flight каждой сессии переписан
   под фактическое состояние main (другой Hero, другая палитра, FeaturedWorks на главной, /works
   без фото-карточек). Старые блоки не выкидываю — переношу как историю и помечаю Done.
-->

---

## Что даёт этот эпик (прочитай перед запуском)

- **Что будет работать после эпика:** на сайте появляется финальная типографика (PT Serif для заголовков + Inter для текста, кириллица проверена) — это **уже на main**. Появляются написанные тобой и отредактированные братом тексты: главная (Hero), «Обо мне», три услуги, «Контакты» и один полностью оформленный проект-образец (project-04). Главная и раздел «Работы» получают новый editorial-вид (warm paper-палитра, крупный Hero, плитка проектов 2×2) — **тоже уже на main**.
- **Чего этот эпик НЕ делает:** не убирает watermark с фото project-04 (ретушь — твоя работа после запуска, по [гайду §3/§4](../guide-for-svetlana.md)); до ретуши на проекте корректно остаётся плашка «Концепт-проект · фото в обработке» — это честно, не баг. Не пишет тексты остальных трёх проектов (это ep03). Не подключает домен и не делает публичный запуск (ep03). Не проводит внешнюю редактуру текстов — тексты выходят с пометкой «v1, до внешней редактуры», это сознательный открытый долг, не блокирует ep03.
- **Где и когда увидишь результат:** типографику и новый вид главной/работ уже видно на превью-деплое `*.workers.dev` (после Sessions A/B и визуальной сессии). Тексты увидишь после Session D (главная + «Обо мне» + project-04) и Session E (услуги + контакты) — на превью-деплое соответствующих веток, затем на main.
- **Что потребуется от тебя лично:** **Session D — критична.** Тебе (Светлане) нужно написать первичные черновики Hero / About / project-04, а брату — отредактировать их, **в одном непрерывном подходе на 3–5 часов** (чтобы голос не разъехался). Claude не пишет эти тексты за тебя — он проверяет их по чек-листу и стоп-листу и коммитит. То же в Session E для услуг/контактов.

> Если хоть один пункт расходится с тем, что ты ожидал от эпика — останови здесь и обсуди, прежде чем запускать сессии. Дешевле поправить план сейчас, чем после трёх потраченных окон.

---

## Карта сессий

| Session | Задачи | Цель (что работает после) | Зависимости (что должно быть до) | Статус |
|---|---|---|---|---|
| **A — Typography foundation + hardening gates** | T01, T02, T26, T27 | PT Serif (cyrillic-only) вместо Fraunces, `tokens.css` с финальной шкалой, Vitest stop-list grep gate, `.github/pull_request_template.md` | ep01 закрыт, `main` чистый | ✅ Done (PR #9) |
| **B — Phase 1 wiring + merge** | T04, T05, T06, T07, T09, T10 | Кириллица PT Serif верифицирована, preload-hints, admin-шрифты, Hero Schema 1 + CTA, typography.spec.ts, Phase 1 PR смёрджен | Session A | ✅ Done (PR #9) |
| **C — Pivot: scope-freeze + guide update** (было: Asset retouch) | docs only (T03/T08/T11 → DEFERRED, T19 → REMOVED, T28 → REFRAMED) | Ретушь watermark вынесена в post-launch зону Светланы; guide пополнен; tasks/plan/CLAUDE.md/log синхронизированы | Session A | ✅ Done (PR #11) |
| **Visual — editorial-доводка** (НЕЗАПЛАНИРОВАННАЯ) | вне tasks.md (отд. план «linked-deer») | warm paper-палитра, Hero конфигурация B (eyebrow + marginalia), FeaturedWorks 2×2 на главной, /works унифицирован на X3-WorkCard, ManifestoBlock и ProjectCard удалены | Session B | ✅ Done (PR #13) — **нет записи в log.md** |
| **D — Copy session 1 (one sitting!)** | T12, T13, T14, T15 | Финальные тексты Hero / About / project-04 (summary + concept), редактура брата (≤2 итерации), Phase 3 PR смёрджен с меткой «v1, до внешней редактуры» | Sessions B + C + Visual; Светлана и брат доступны в одной сессии | 📋 Next |
| **E — Copy session 2 (services + contact)** | T16, T17, T18 | services-intro, 3 service bodies, contact-intro написаны и проверены чек-листом 2.3 | Session D | 📋 |
| **F — Phase 4 verify + merge** | T20, T21, T28, T22 | Визуальный обзор `/works/project-04`, smoke project-01/02/03, Playwright badge assertion (плашка на всех isConcept), Phase 4 PR смёрджен | Session E | 📋 |
| **G — Closeout** | T23, T24, T25 | CLAUDE.md → ep02 ✅ Done, vision.md Open Questions, финальный log.md (долг внешней редактуры + долг ретуши), Phase 5 PR | Session F | 📋 |

**Critical path (остаток):** D → E → F → G — четыре строго последовательные сессии. Всё, что было до D (A, B, C, Visual), уже на `main`.

**Самая хрупкая сессия — D.** Это one-sitting copy-сессия: research.md R2 требует писать Hero + About + project-04 в одном непрерывном подходе, иначе регистр разойдётся. Планируй её отдельно, когда Светлана и брат доступны целиком на 3–5 часов. Параллелить остаток нечего — после pivot 2026-05-27 параллельной ретуш-ветки нет.

> **Re-plan 2026-05-31.** Этот план перегенерирован в середине эпика. Sessions A/B/C завершены и смёрджены; между B и D прошла **незапланированная визуальная сессия** (PR #13) — она поменяла Hero, палитру и раздел «Работы», но не тронула копирайт. Поэтому pre-flight Session D переписан под новое состояние main. **Первый шаг Session D — дописать пропущенное session-резюме визуальной сессии в `log.md`** (см. ниже), иначе кусок истории эпика теряется.

---

## Шаблон промпта для каждой сессии

Скопируй промпт под нужной сессией в **новое** окно Claude Code (для гарантии чистого контекста).

```
# Session <ID> — <название>

Эпик: ep02-design-and-copy. Эта сессия покрывает задачи: T##, T##, ...

## Холодный старт — прочитай по порядку
1. CLAUDE.md (constitution — особенно Принцип 1 с уточнением + epics).
2. docs/vision.md (если релевантно задачам сессии).
3. docs/ep02-design-and-copy/research.md — секции, релевантные задачам сессии.
4. docs/ep02-design-and-copy/plan.md — Steps/Phases, релевантные задачам сессии, + Key Decisions.
5. docs/ep02-design-and-copy/tasks.md — шапка (Definition of Done) + полные брифы задач T## этой сессии + Progress Tracker.
6. docs/ep02-design-and-copy/log.md — что было сделано в предыдущих сессиях.

## Sanity-check состояния
- git log --oneline -15 — последние коммиты предыдущих сессий видны и соответствуют ожиданию (см. «Pre-flight»).
- pnpm install прошёл? Если нет — выполни.
- pnpm build / pnpm typecheck / pnpm test / pnpm test:e2e — зелёные на текущем состоянии. Если нет — что-то сломалось в предыдущей сессии, остановись и сообщи.

## Pre-flight (что уже должно работать)
<список>

## Цель сессии
<one-liner>

## Что делать
Запусти `/my-execute ep02-design-and-copy` для задач T##, T##, ... в порядке зависимостей по Waves.
Каждая задача:
- Сверь acceptance criteria из tasks.md.
- Пройди DoD из шапки tasks.md (Lighthouse 95+ для UI-задач, stop-list grep T26 для контентных).
- Отдельный commit формата `ep02 T## <короткое описание>`.
- Чекбокс в Progress Tracker отмечен.
- Запись в docs/ep02-design-and-copy/log.md.

## Exit-критерии (без них сессия не закрыта)
<список проверяемых пунктов>

## Если что-то не так
- Acceptance не сходится → диагностируй, чини, не закрывай задачу частично.
- Заблокирован внешним шагом → остановись, сформулируй точный запрос пользователю.
- Контекст превысил ~150k токенов → останови сессию, оформи partial-commit, опиши состояние в log.md, попроси открыть новое окно.

## После завершения
- Обнови Progress Tracker.
- Запиши итог сессии в log.md (см. правило про session-резюме ниже).
- Подскажи пользователю следующую сессию: «Session <X+1> — <название>».
```

> **Про commit-формат.** Из `git log` репозитория установлен формат `ep02 T## <описание>` (например, `ep02 T07: Hero.astro Schema 1 calibration + CTA`); merge-коммиты PR-веток — `ep02 <Phase/Session> <описание> (#PR)`. Используй этот формат, НЕ `feat(T##): ...`.

---

## Промпты по сессиям

> Sessions A, B, C, Visual — **уже выполнены** и смёрджены в `main`. Их блоки сохранены ниже как история (свёрнуты в краткое резюме). Живые промпты — начиная с **Session D**.

### ✅ Session A — Typography foundation + hardening gates (Done, PR #9)

Покрыла T01, T02, T26, T27. PT Serif (cyrillic-only, `@fontsource/pt-serif@5.2.8`) заменил Fraunces; `tokens.css` заполнен (modular 1.25, палитра ink/paper/accent-neutral — позже расширена визуальной сессией); Vitest stop-list grep gate живёт; PR template создан. Детали — `log.md` (Session A резюме).

### ✅ Session B — Phase 1 wiring + merge (Done, PR #9)

Покрыла T04, T05, T06, T07, T09, T10. Кириллица PT Serif верифицирована fontkit'ом (10/10 глифов, fallback Onest не понадобился); 2 preload-hint'а; admin-шрифты через jsDelivr; Hero Schema 1 + CTA; typography.spec.ts с negative-test; Phase 1 PR смёрджен (Lighthouse median ×3 ≥95). Детали — `log.md` (Session B резюме).

### ✅ Session C — Pivot: scope-freeze + guide update (Done, PR #11)

**Не была IOPaint-ретушью.** Phase 2 (T03/T08/T11) вынесена в post-launch зону Светланы; T19 удалён; T28 переформулирован (плашка видна на всех `isConcept` проектах). Синхронизированы tasks.md / plan.md / CLAUDE.md / guide / log.md. Детали — `log.md` (Session C запись о pivot).

### ✅ Session Visual — editorial-доводка (Done, PR #13) — НЕЗАПЛАНИРОВАННАЯ

> Эта сессия **не была в карте**. Привязана к отдельному плану «ep02-design-and-copy-linked-deer», прошла 2026-05-28. Внесла визуальный слой поверх Phase 1: warm paper-палитра (`--paper` → `#f5f0e6` + tan/stone/deeper + hairline), Hero конфигурация B (eyebrow «Дизайн интерьеров» + «№ 01 · 2026», marginalia «Москва · Подмосковье», увеличенный display clamp до 5.5rem), новый `FeaturedWorks.astro` (2×2 X3-карточки на главной), унификация `/works` на `WorkCard.astro`, удаление `ManifestoBlock.astro` (хардкод-текст вне content collection — Принцип 2) и `ProjectCard.astro`. Новый `featured-works.spec.ts` (32/32 e2e). **Долг: session-резюме этой работы в `log.md` отсутствует** — закрывается первым шагом Session D.

---

### Session D — Copy session 1 (one sitting!)

**Pre-flight:** Sessions B + C + **визуальная сессия** завершены и на `main`. Это значит: PT Serif живёт; главная имеет Hero конфигурацию B (eyebrow + marginalia + крупный display) и блок FeaturedWorks 2×2; `/works` отрисован X3-карточками без фото; warm paper-палитра глобально. **project-04 остаётся с watermark Homestyler** (Phase 2 deferred) — концепт-текст пишется с этими кадрами как референсом. **Светлана и брат доступны в одной непрерывной сессии** (research.md R2 — критично для register coherence).

```
# Session D — Copy session 1 (Hero + About + project-04, в одной сидячей сессии)

Эпик: ep02-design-and-copy. Задачи: T12, T13, T14, T15 (Wave 5 + Wave 6).

## ⚠️ Главное про эту сессию
Эта сессия — самая важная и самая хрупкая в ep02. Здесь рождается голос Светланы как автора.
Три текста — Hero, About, project-04 concept — пишутся в одном сидячем подходе, иначе регистр
между ними разойдётся (research.md R2). Если Светлана или брат отвлекаются / уезжают / болеют —
НЕ продолжай. Останови, дождись окна, в котором оба присутствуют целиком 3–5 часов. Лучше
отложить ep02 на неделю, чем получить тексты с тремя разными голосами.

## ШАГ 0 (до /my-execute) — закрыть долг истории визуальной сессии
В log.md НЕТ session-резюме незапланированной визуальной сессии (PR #13, main 59f1ee5, 2026-05-28:
warm paper-палитра, Hero конфигурация B, FeaturedWorks 2×2, унификация /works, удаление
ManifestoBlock + ProjectCard). Перед копирайтом:
1. Прочитай `git show 59f1ee5 --stat` и тело коммита.
2. Допиши в log.md session-резюме с пометкой «НЕЗАПЛАНИРОВАННАЯ визуальная сессия» — что сделано,
   quality-gates (на момент PR: build ✅, test 82/82, e2e 32/32, typecheck/lint ✅), открытые
   наблюдения (плашка project-page в ProjectMeta.astro ещё без data-testid — это работа T28).
Это отдельный docs-коммит `ep02 log: backfill résumé незапланированной визуальной сессии (PR #13)`.

## Холодный старт — прочитай по порядку
1. CLAUDE.md (Принцип 1 + уточнение про placeholder/LLM-черновик; Принцип 7 — honest junior подача).
2. docs/ep02-design-and-copy/research.md — Step 2.3 ЦЕЛИКОМ (регистр-ориентиры, антипаттерны,
   чек-лист), Step 4.3 (что значит «pilot оформлен»).
3. docs/ep02-design-and-copy/plan.md — Step 6 Phase 3 (структура трёх абзацев About; структура
   summary + concept project-04), Step 10 Key Decisions (Rule 1 clarification rationale).
4. docs/ep02-design-and-copy/tasks.md — DoD (шапка) + брифы T12, T13, T14, T15 + implementation notes.
5. docs/ep02-design-and-copy/log.md — что сделано в B/C/Visual (после ШАГА 0 — там уже будет
   резюме визуальной сессии).

## Sanity-check состояния
- git log --oneline -15 — видны 7094eb3 (Phase 1), f3bc764 (Session C pivot), 59f1ee5 (visual).
- pnpm install / pnpm build / pnpm typecheck / pnpm test / pnpm test:e2e — зелёные на main.

## Pre-flight
- Главная: Hero конфигурация B + FeaturedWorks 2×2; /works — X3-карточки. Это финальный визуальный
  контекст, в который ляжет текст. ВАЖНО: Hero на главной берёт body из src/content/pages/hero.md —
  убедись, что финальный Hero-copy (T12) ложится в существующую разметку Hero конфигурации B
  (eyebrow и marginalia — статичные, body — из hero.md).
- project-04 остаётся с watermark Homestyler (Phase 2 deferred — Session C pivot). Концепт-текст
  описывает то, что есть, а не «как будет после ретуши».
- Stop-list grep gate (T26) зелёный на текущем содержимом src/content/.
- Светлана и брат доступны 3–5 часов одним блоком; Светлана прочитала research.md Step 2.3 заранее.

## Цель сессии
Финальные тексты:
- src/content/pages/hero.md — 25–60 слов, первое лицо, манифест-фраза.
- src/content/pages/about.md — 250–400 слов, три абзаца (подход → диплом одной строкой → отличие
  в работе с заказчиком).
- src/content/projects/project-04.md frontmatter `summary` (≤200 символов) + body `concept`
  (3–5 предложений, конкретный материальный текст).
Все: первичный draft Светланы (НЕ Claude); редактура брата ≤2 итерации; чек-лист 2.3 пройден;
stop-list grep зелёный; метка «v1, до внешней редактуры»; Phase 3 PR `feature/ep02-copy-core` смёрджен.

## Что делать
Создай ветку feature/ep02-copy-core от main.
Запусти `/my-execute ep02-design-and-copy` для T12 → T13 → T14 (в одной сессии последовательно в
порядке написания) → T15 (PR merge).

Роль Claude — НЕ автор, НЕ редактор:
1. Освежи стоп-лист штампов и чек-лист 2.3, будь готов цитировать.
2. Драфт Светланы прогоняй через чек-лист 2.3 + stop-list grep, фиксируй findings, НЕ переписывай.
   «Предложи структуру» / «помоги собрать факт во фразу» — можно; «напиши за меня Hero» — нельзя
   (нарушение Rule 1 уточнения).
3. Правки брата применяй к файлу как есть; если правка вернула штамп — укажи, но решение за людьми.
4. Коммить каждый текст отдельно: `ep02 T12 hero copy v1`, `ep02 T13 about copy v1`,
   `ep02 T14 project-04 summary+concept v1`.
5. Открой PR feature/ep02-copy-core с меткой «v1, до внешней редактуры» в title.
6. Проверь CI зелёный (Lighthouse 95+, e2e, stop-list grep), мерджи (T15).

Особое внимание:
- About — диплом одной строкой: «диплом о профессиональной переподготовке, ООО „ДИСКИЛЛ", май 2026»
  (точный месяц/год подтвердить со Светланой). Это факт, не апология и не бравада.
- project-04 concept — ЖЁСТКАЯ структура из tasks.md T14: «что нашли → что хотели сохранить →
  центральное материальное решение → как это видно в кадрах». Эта структура тиражируется на
  project-01/02/03 в ep03 — качество здесь критично. Кадры с watermark — это и есть «как видно».
- «≤2 итерации редактуры»: если нужна третья — НЕ продавливай, останови, ретроспектива в log.md.
- stop-list grep после правок брата: `pnpm test -- stop-list`. Краснеет → найди конкретную замену
  штампу, не маскируй.
- Hero конфигурации B: eyebrow «Дизайн интерьеров» и marginalia — это разметка Hero.astro, НЕ
  контент hero.md. Финальный Hero-copy (T12) — это body hero.md. Не дублируй eyebrow в тексте.

## Exit-критерии
- [ ] git log: ШАГ-0 backfill-коммит + 3 коммита T12/T13/T14 (T15 — это merge, не отдельный коммит).
- [ ] pnpm test зелёный (stop-list). pnpm test:e2e зелёный.
- [ ] Lighthouse CI на PR зелёный (≥95 mobile, все 4 метрики).
- [ ] PR title/body содержит «v1, до внешней редактуры».
- [ ] PR смёрджен; превью main показывает три текста живыми (Hero на главной в конфигурации B,
      About на /about, summary+concept на /works/project-04 — поверх watermark-кадров).
- [ ] log.md: (а) резюме визуальной сессии (ШАГ 0); (б) запись Session D — сколько итераций
      редактуры на каждый текст, что было сложно.
- [ ] Progress Tracker T12, T13, T14, T15 отмечены.

## Если что-то не так
- Светлана не может написать первичный draft за разумное время → НЕ передавай Claude. Останови,
  запись в log.md «Phase 3 paused: первичный draft не выходит на сессии XX-XX-XX».
- Брат не укладывается в 2 итерации → ретроспектива в log.md (фактура / структура / регистр).
- Stop-list краснит на финале → конкретная замена, не маскировка.
- Контекст >150k → partial-commit, состояние в log.md, новое окно.

## После завершения
- Обнови Progress Tracker.
- Запиши резюме Session D в log.md.
- Следующая сессия: Session E — Copy session 2 (services + contact).
```

---

### Session E — Copy session 2 (services + contact)

**Pre-flight:** Session D завершена. Hero, About, project-04 текст на `main` — это калибровочный эталон регистра для services/contact, которые более служебны.

> **Pivot 2026-05-27:** T19 (снять плашку «концепт-проект») **REMOVED**. Раз ретушь deferred — плашка корректно остаётся (Принцип 7). Сессия только про копирайт (T16/T17/T18), правок компонентов не требует.

```
# Session E — Copy session 2 (services intro + 3 service bodies + contact intro)

Эпик: ep02-design-and-copy. Задачи: T16, T17, T18 (Wave 7). T19 — REMOVED (Session C pivot).

## Холодный старт
1. CLAUDE.md (Принцип 1 + уточнение; Принцип 7).
2. ОСОБОЕ ВНИМАНИЕ — тексты Hero / About / project-04 из текущего main (написаны в Session D):
   прочитай их, это твой эталонный регистр для services/contact.
3. docs/ep02-design-and-copy/research.md — Step 2.3 (чек-лист, релевантен и здесь).
4. docs/ep02-design-and-copy/plan.md — Step 6 Phase 4 (жёсткая единая структура service bodies).
5. docs/ep02-design-and-copy/tasks.md — DoD + брифы T16, T17, T18.
6. docs/ep02-design-and-copy/log.md — резюме Session D.

## Sanity-check состояния
- git log --oneline -15 — видна завершённая Session D (T12/T13/T14 + merge Phase 3 PR).
- pnpm build / pnpm test / pnpm test:e2e — зелёные на main.

## Pre-flight
- Session D завершена; Hero / About / project-04 текст на main.
- Stop-list grep gate (T26) зелёный.

## Цель сессии
- src/content/pages/services-intro.md — 80–150 слов, подход к услугам в целом.
- src/content/services/full-design.md, supervision.md, consulting.md — по 120–180 слов в единой
  жёсткой структуре (Что входит / Когда подходит / Что на выходе).
- src/content/pages/contact-intro.md — 40–80 слов (канал связи + формат первого разговора).
- Все «v1»; регистр откалиброван под Hero/About из Session D.

## Что делать
Создай ветку feature/ep02-copy-services-contact от main.
Запусти `/my-execute ep02-design-and-copy` для T16, T17, T18 (T17 — самый объёмный, три файла
пиши в одном непрерывном подходе, чтобы регистр трёх услуг не разошёлся).

Особое внимание:
- Регистр-якорь — Hero/About из Session D: перед каждым новым текстом перечитывай оба. «Если бы
  Hero и About писал тот же человек — звучит ли услуга в той же тональности?»
- T17 — жёсткая структура для трёх: Что входит (3–5 пунктов конкретики этапов) / Когда подходит
  (1–2 фразы про типичный кейс) / Что на выходе (что заказчик получает в руки). Без «также мы
  предлагаем» / «индивидуальный подход» / «с любовью». Три файла — одна сидячая сессия.
- T16/T17/T18 — первичный draft НЕ Claude (то же правило, что в Session D; Принцип 1 уточнение
  в силе и для служебных текстов).
- T18 — короткий: 40–80 слов, каждое слово на месте. Канал связи конкретный (Telegram / email);
  формат первого разговора конкретный (бриф на 30 минут / список вопросов / что взять с собой).

## Exit-критерии
- [ ] git log: коммиты T16, T17 (или 3 коммита по service-bodies), T18.
- [ ] pnpm test зелёный (stop-list на новых текстах чистый).
- [ ] pnpm dev → /services показывает 3 услуги в финальном виде; /contact — финальный intro.
- [ ] Плашка «концепт» по-прежнему видна на /works/project-04 и /works/project-01 (правок не было,
      проверка профилактическая).
- [ ] PR feature/ep02-copy-services-contact ОТКРЫТ (НЕ смёрджен здесь — merge в Session F).
- [ ] Все тексты «v1» в PR description.
- [ ] Progress Tracker T16, T17, T18 отмечены.
- [ ] log.md: сколько итераций редактуры, насколько регистр совпал с Session D.

## Если что-то не так
- Регистр трёх текстов разъезжается с Hero/About из D → пауза, перечитай D, попробуй заново.
- Stop-list краснит → конкретная замена.

## После завершения
- Обнови Progress Tracker, запиши резюме Session E в log.md.
- Следующая сессия: Session F — Phase 4 verify + merge.
```

---

### Session F — Phase 4 verify + merge

**Pre-flight:** Session E завершена, PR `feature/ep02-copy-services-contact` открыт, но не смёрджен. Превью-деплой этой ветки живой.

```
# Session F — Phase 4 verify (visual review + badge test) + merge

Эпик: ep02-design-and-copy. Задачи: T20, T21, T28, T22 (Wave 8 + Wave 9).

## Холодный старт
1. CLAUDE.md (Принципы 1, 3, 7).
2. docs/ep02-design-and-copy/research.md — Step 4.3 («что значит pilot полностью оформлен»).
3. docs/ep02-design-and-copy/plan.md — Step 6 Phase 4 (deliverable список).
4. docs/ep02-design-and-copy/tasks.md — DoD + брифы T20, T21, T28, T22.
5. docs/ep02-design-and-copy/log.md.

## Sanity-check состояния
- git log --oneline -15 — видна завершённая Session E (PR открыт, не смёрджен).
- pnpm build / pnpm test / pnpm test:e2e — зелёные.

## Pre-flight
- Session E завершена; PR feature/ep02-copy-services-contact существует, не смёрджен.
- Превью-деплой ветки живой (Cloudflare Workers Builds создал preview URL).
- На главной — FeaturedWorks 2×2; /works — X3 WorkCard (после визуальной сессии). Визуальный обзор
  Phase 4 проверяет финальный вид и проекта, и этих новых блоков.

## Цель сессии
- T20: визуальный обзор /works/project-04 на превью — типографика + watermark-кадры (deferred) +
  финальный текст + плашка «Концепт-проект · фото в обработке» читаются как единое целое.
- T21: smoke /works/project-01,02,03 — нет регрессий, ImageGallery / X3-карточки работают.
- T28 (reframed): Playwright badge assertion — плашка видна на проектах с isConcept: true.
- T22: PR смёрджен; ep02 материально завершён (визуальный слой + копирайт на main).

## Что делать
Запусти `/my-execute ep02-design-and-copy` для T20 / T21 / T28 (параллельны) → T22 (merge).

Особое внимание:
- T28 — ВАЖНО, состояние после визуальной сессии: плашка на КАРТОЧКАХ уже имеет data-testid
  (`featured-badge` в FeaturedWorks.astro, `work-card-badge` в WorkCard.astro). Но плашка на
  СТРАНИЦЕ проекта (src/components/projects/ProjectMeta.astro, строка ~34–36, текст
  «Концепт-проект · фото в обработке») data-testid ещё НЕ имеет. T28 acceptance требует
  `data-testid="concept-badge"` на странице проекта — добавь его точечной правкой ProjectMeta.astro
  в этой же ветке, затем напиши spec (новый tests/e2e/concept-badge.spec.ts), который утверждает
  плашку на /works/project-04 И /works/project-01. Negative test: временно isConcept: false в
  project-04.md → спек краснит → восстановить.
- T20 — обзор на ПРЕВЬЮ-деплое, не локально: mobile (375×667) + desktop (1280×800). Watermark на
  кадрах остаётся (Phase 2 deferred) — это ожидаемо, не баг. Если visual quirk (line-height
  collapse, baseline-shift, overflow gallery, неверный wrap заголовка) — правь шаблон в ЭТОМ ЖЕ PR
  (src/pages/works/[slug].astro или ProjectMeta.astro), не отдельным.
- T21 — особое внимание ImageGallery и X3-WorkCard: галереи project-01/02/03 (3 кадра) vs
  project-04 (4); /works 2×2-сетка после визуальной сессии. Проверь обе раскладки mobile + desktop.
- T22 — финальный merge: Lighthouse CI зелёный; pnpm test:e2e зелёный (typography.spec.ts из B,
  featured-works.spec.ts из визуальной сессии, новый concept-badge.spec.ts из T28); stop-list grep
  зелёный. PR description перечисляет артефакты Phase 4 + метка «v1, до внешней редактуры» + явно
  «ретушь project-04 — deferred to Svetlana's post-launch work».

## Exit-критерии
- [ ] git log: коммит T28 (data-testid правка ProjectMeta + spec) + T22 merge. T20/T21 коммиты —
      только если найден visual quirk.
- [ ] /works/project-04 на main: финальный текст + watermark-кадры + новая типографика + плашка видна.
- [ ] /works/project-01: placeholder-текст ep01, плашка видна (обе isConcept).
- [ ] /services, /contact — финальные тексты на main.
- [ ] pnpm test:e2e зелёный (typography + featured-works + concept-badge).
- [ ] pnpm test зелёный (stop-list).
- [ ] Lighthouse CI зелёный на финальном PR (mobile ≥95).
- [ ] PR смёрджен; ep02 материально завершён (остаётся только closeout — Session G).
- [ ] Progress Tracker T20, T21, T28, T22 отмечены.
- [ ] log.md обновлён.

## Если что-то не так
- T20 нашёл quirk, не правящийся без архитектурного решения → останови, обсуди.
- Контекст >150k → partial-commit, состояние в log.md, новое окно.

## После завершения
- Обнови Progress Tracker, запиши резюме Session F в log.md.
- Следующая сессия: Session G — Closeout.
```

---

### Session G — Closeout

**Pre-flight:** Session F завершена. ep02 материально на `main`. Остался только housekeeping: статус, vision tweaks, финальная запись.

```
# Session G — Closeout (CLAUDE.md статус, vision.md правки, log.md финал, Phase 5 PR)

Эпик: ep02-design-and-copy. Задачи: T23, T24, T25 (Wave 10 + Wave 11).

## Холодный старт
1. CLAUDE.md (особенно секция ## Epics — текущий статус ep02 и формат строки).
2. docs/vision.md — Open Questions полностью (предмет правок T24).
3. docs/ep02-design-and-copy/research.md — Step 9b (предложения по правкам vision.md).
4. docs/ep02-design-and-copy/plan.md — Step 11 (Save Plan).
5. docs/ep02-design-and-copy/tasks.md — DoD + брифы T23, T24, T25.
6. docs/ep02-design-and-copy/log.md — полная история ep02 (включая backfill визуальной сессии и
   pivot-запись).

## Sanity-check состояния
- git log --oneline -15 — видна завершённая Session F (Phase 4 merge).
- pnpm build / pnpm test / pnpm test:e2e — зелёные.

## Pre-flight
- Session F завершена; ep02 материально на main. Все предыдущие задачи отмечены в Progress Tracker.
- CLAUDE.md: статус ep02 = 🔄 Active (с ratification плана).
- Принцип 1 уточнение уже в CLAUDE.md (T23 acceptance — проверить, что не сломалось).

## Цель сессии
- T23: CLAUDE.md ## Epics → строка ep02-design-and-copy статус ✅ Done. ep03 остаётся 📋 Planned.
- T24: docs/vision.md Open Questions — пункт 1 (эстетика → выбран B, PT Serif + Inter) и пункт 2
  (Hero — typographic в ep02, photo-decision delegated в ep03) обновлены.
- T25: docs/ep02-design-and-copy/log.md — финальная запись с явно зафиксированными ДВУМЯ открытыми
  долгами: (а) внешняя редактура текстов не пройдена (Rule 1 формально открыт), (б) ретушь watermark
  project-04 — work Светланы по guide §4. Phase 5 PR feature/ep02-closeout смёрджен; Lighthouse CI зелёный.

## Что делать
Создай ветку feature/ep02-closeout от main.
Запусти `/my-execute ep02-design-and-copy` для T23 / T24 (параллельны) → T25 (merge).

Особое внимание:
- T23 — НЕ переключай статус ep03: строка ep03 остаётся 📋 Planned. Activation ep03 — отдельное событие.
- T24 — точечные правки: только Open Questions 1 и 2. Остальное в vision.md не трогаем. (Третья
  правка — упоминание шрифтов в Architecture Map из research.md Step 9b — опциональна, реши с автором.)
- T25 — log.md финальная запись: явно перечисли (а) что сделано (4 текста pages + 3 service bodies +
  project-04 финализирован копирайтом + типографика PT Serif live + warm paper-палитра + Hero конф. B
  + FeaturedWorks + 2 hardening tasks); (б) ДВА открытых долга (внешняя редактура; ретушь watermark
  Светланой). Не маскируй долги — отдельным заметным абзацем.
- T25 — финальный PR description: «ep02 close-out: CLAUDE.md status + vision.md tweaks + log.md final».

## Exit-критерии
- [ ] git log: коммиты T23, T24, T25.
- [ ] CLAUDE.md: ep02-design-and-copy ✅ Done; ep03 остаётся 📋 Planned.
- [ ] CLAUDE.md Принцип 1 уточнение на месте (визуальный diff — без неожиданных правок).
- [ ] docs/vision.md Open Questions 1 и 2 обновлены, остальное не тронуто.
- [ ] log.md содержит финальный абзац с ДВУМЯ открытыми долгами.
- [ ] PR feature/ep02-closeout смёрджен; Lighthouse CI зелёный (контрольный).
- [ ] Progress Tracker заполнен полностью (с учётом [~] на deferred/removed T03/T08/T11/T19).
- [ ] log.md: «ep02-design-and-copy закрыт <date>. Следующий: ep03. Открытые долги: внешняя
      редактура + ретушь watermark».

## После
Эпик ep02-design-and-copy формально закрыт. Тексты живут на main как «v1, до внешней редактуры».
Следующее действие — /my-research ep03-content-and-launch (когда будешь готов).
```

---

## Между сессиями

### Что делает пользователь между сессиями

1. Проверь финальные коммиты последней сессии: `git log --oneline -10`.
2. Проверь Progress Tracker в `docs/ep02-design-and-copy/tasks.md` — чекбоксы новых задач отмечены.
3. Прочитай запись в `log.md` — что сделано, нет ли непредвиденных решений (особенно — если копирайт Session D потребовал больше двух итераций редактуры).
4. Выполни внешние/manual задачи перед стартом следующей сессии (для D — присутствие Светланы + брата одним блоком 3–5 часов; ретушь watermark в скоуп ep02 НЕ входит).
5. Закрой текущее окно Claude Code. Открой новое, вставь промпт следующей сессии.

### Правило session-резюме (важно)

В конце КАЖДОЙ сессии в `log.md` появляется резюме сессии — что сделано, quality-gates, открытые наблюдения, следующая сессия. Это касается и **ручных / незапланированных** сессий, не только тех, что шли строго по `/my-execute`. Сессия без резюме — это потерянный кусок истории эпика: позже невозможно понять, что и почему менялось. Если сессия отклонилась от карты (импровизированная визуальная доводка, внеплановый фикс) — резюме обязательно, с пометкой, что это была незапланированная сессия.

> **Конкретный долг этого эпика:** визуальная сессия PR #13 (2026-05-28) прошла БЕЗ session-резюме в `log.md`. Это ровно тот случай, который правило выше запрещает. Долг закрывается ШАГОМ 0 Session D (backfill-резюме). На будущее: любая визуальная/импровизированная доводка завершается записью в `log.md` в той же сессии, не «потом».

### Когда останавливаться и звать пользователя посреди сессии

- Acceptance criteria не сходятся даже после диагностики — не закрывай задачу частично.
- **Session D:** первичный draft Hero / About не выходит за разумное время; редактура брата требует третью итерацию — это сигналы планирования, не работы. Останови, ретроспектива в `log.md`.
- **Session E:** регистр трёх текстов разъезжается с Hero/About из D — пауза, перечитай D.
- **Session F:** визуальный обзор T20 нашёл quirk, не правящийся в шаблоне без архитектурного решения — останови, обсуди.
- Stop-list grep (T26) краснит на финальном draft → не маскируй, найди конкретную замену штампу.
- Решение требует продуктового выбора, не зафиксированного в `plan.md` — останови, спроси.
- Контекст приближается к ~150k токенов → закоммить промежуточное, опиши состояние в `log.md`, открой новое окно.

### Файлы для проверки между сессиями

- `docs/ep02-design-and-copy/log.md` — что было сделано.
- `docs/ep02-design-and-copy/tasks.md` — Progress Tracker.
- `CLAUDE.md` — статус эпика, особенно Принцип 1 уточнение.
- `git log --oneline` — коммиты.

---

## Особенности ep02 относительно ep01

| Аспект | ep01 | ep02 |
|---|---|---|
| Количество сессий | 13 | 7 фактических: A, B, C, **Visual (незапланированная)**, D, E, F, G — из них A/B/C/Visual уже закрыты |
| Доля manual user work | средняя (внешние OAuth/CF dashboard шаги) | копирайт-сессии (D/E); IOPaint-ретушь — вынесена в post-launch зону Светланы по [guide §4](../guide-for-svetlana.md#4-ретушь-watermark-на-фото-проектов) |
| Самая хрупкая сессия | Session H (форма + consent) | **Session D** (one-sitting copy — register coherence) |
| Critical path (остаток) | — | D → E → F → G |
| Параллельные ветки | D, E | — (после pivot 2026-05-27 параллельной ретуш-ветки нет) |
| Внешние блокеры | GitHub OAuth App, Yandex.Metrica ID, Cloudflare Pages | автор + редактор в одной сессии D |
| Главный риск | технический (CSP, deploy) | человеческий (голос Светланы не закрепится без правильной сессии D) |
| Открытый долг по выходу | — | (а) внешняя редактура «v1»-текстов; (б) ретушь watermark project-04 (Светлана, через guide) |

Главный практический вывод: **Session D — это ось ep02**. Всё, что было до неё (типографика, hardening-гейты, pivot, визуальная доводка), уже на `main` — это инфраструктура вокруг текста. Если D пройдёт хорошо (Hero / About / project-04 в едином регистре, прошедшем редактуру), ep02 удался. Если D развалится — никакие технические сессии этого не починят. Планируй её отдельно и заранее.

---

## Если /my-execute ведёт себя не так

Промпты предполагают, что `/my-execute ep02-design-and-copy` принимает список задач и идёт по ним. Если на практике скилл работает иначе:

- Запускай его без аргументов — он сам подберёт следующую `pending` задачу из Progress Tracker.
- После каждой задачи проверяй коммит, затем запускай снова на следующую.
- Если скилл не предусматривает фильтр по списку — работай в порядке Wave из tasks.md, остановись по достижении границы сессии (последняя задача сессии указана в шапке промпта).
