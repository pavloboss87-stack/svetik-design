<!--
PR template — единый чек-лист для всех типов PR в svetik-design.
Не плодить тематические шаблоны (feature.md, bugfix.md и т.п.) — Principle 6.
Заполни релевантные блоки, неприменимые — оставь как есть или удали при ревью.
-->

## Что меняет

<!-- 1–3 предложения по существу: что и зачем. Ссылка на task ID и фазу плана. -->

## Чек-лист

### CI (на всех PR)

- [ ] Lighthouse CI mobile ≥ 95 на всех 4 метриках (Performance / A11y / Best Practices / SEO)
- [ ] `pnpm test` (Vitest) зелёный — включая `tests/content/stop-list.spec.ts` (CLAUDE.md Принцип 1)
- [ ] `pnpm test:e2e` (Playwright) зелёный
- [ ] `pnpm lint` чистый
- [ ] `pnpm format:check` чистый
- [ ] `pnpm typecheck` (astro check) чистый
- [ ] `pnpm build` зелёный

### Если PR трогает `src/content/**` (контент)

- [ ] Word count соответствует целевому диапазону задачи (Hero 25–60 / About 250–400 / services-intro 80–150 / service-body 120–180 / contact-intro 40–80 / project summary ≤200 chars)
- [ ] Stop-list grep gate (`tests/content/stop-list.spec.ts`, T26) зелёный
- [ ] Чек-лист антипаттернов из `docs/ep02-design-and-copy/research.md` Step 2.3 пройден
- [ ] Первичный draft написан автором (Светлана), не сгенерирован LLM (CLAUDE.md Принцип 1 уточнение)
- [ ] Редактура брата пройдена (не более двух итераций — если требуется третья, остановка и ретроспектива в `log.md`)
- [ ] Метка **«v1, до внешней редактуры»** присутствует в title или body PR

### Если PR трогает `src/assets/**` или `public/images/**` (ассеты)

- [ ] Side-by-side «до/после» приложен в комментарии PR (скрин или ссылка)
- [ ] Watermark / inpainting-артефакты не видны на retouched-кадрах
- [ ] Размер файлов в пределах разумного (≤500 KB исходник до Astro `<Image>` pipeline)

### Если PR трогает шрифты / tokens.css / Layout.astro (типографика)

- [ ] Кириллический subset выбранного шрифта верифицирован (fonttools-инспекция, T04 шаблон)
- [ ] Preload-hints добавлены только для реально критичных файлов (Principle 6)
- [ ] `public/admin/index.html` синхронизирован с продом (preview Decap = прод)
- [ ] Regression-тест `tests/e2e/typography.spec.ts` зелёный

## Заметки ревьюеру

<!-- На что обратить внимание; что НЕ нужно проверять; известные follow-ups. -->
