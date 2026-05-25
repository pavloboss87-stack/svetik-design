# Execution Log — ep01-portfolio

<!-- Task completion entries appended by /my-execute -->

## Session A — Foundation (closed 2026-05-25)

Tasks: T01, T02, T03, T04, T05, T06. All exit-criteria from `session-plan.md` met:

- `git log --oneline` shows the six expected commits.
- `pnpm dev` serves `localhost:4321` with the Layout skeleton (Inter/Fraunces self-hosted, zero requests to `fonts.googleapis.com`/`fonts.gstatic.com`).
- Preview server returns 200 on `/`, `/favicon.svg`, `/favicon.ico`, `/apple-touch-icon.png`.
- `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check` — all green.
- Progress Tracker for T01..T06 ticked.

**Outstanding from this session (not blocking Session B):**
- Final favicon/monogram «СГ» — placeholder Astro template asset still in `public/`. Replaced in ep02 (визуальный код).
- Default OG image `public/images/og/default.png` — does not yet exist. Layout defaults the URL but a 404 will occur until T24 creates the asset.

**Next session**: Session B — Content schema + seeds (T07, T08, T09, T10).

## 2026-05-25 — [T01] Bootstrap Astro minimal + TS strict
- **Status**: ✅ Done
- **Commit**: `277d264 ep01 T01: bootstrap Astro minimal + TS strict`
- **Files changed**: `.gitignore`, `.nvmrc`, `.vscode/`, `astro.config.mjs`, `package.json`, `pnpm-lock.yaml`, `public/favicon.ico`, `public/favicon.svg`, `src/pages/index.astro`, `tsconfig.json`. Existing `CLAUDE.md`, `docs/`, `Portfolio/`, `Contacts/`, `Diplom/` committed in the same initial snapshot.
- **Deviation from plan**: `.nvmrc` is `24`, not `22`. Reason: `winget install OpenJS.NodeJS.LTS` resolved to Node 24.16.0 (current LTS as of 2026-05). Node 22 line is still maintained but no longer the active LTS; Astro 6.3.7 supports Node 22 and 24. CF Pages supports both. Filed as a low-risk deviation; revisit if CF Pages build pins Node 22.
- **Versions pinned**: Astro 6.3.7 (note: plan referenced "Astro 5", actual is 6 — newer major appeared in the meantime), pnpm 9.15.9, Node 24.16.0.
- **Verification**: `pnpm install` clean. `pnpm build` clean (`dist/index.html` 316 bytes). `pnpm dev` returned `200` on `localhost:4321` with the default Astro stub. `git remote -v` shows `origin = https://github.com/pavloboss87-stack/svetik-design.git`. First push succeeded.
- **Learnings**: pnpm bootstrap on Windows without admin: `corepack enable` fails (needs write to `C:\Program Files\nodejs`). Workaround used: `npm install -g pnpm@9` — writes to `%APPDATA%\npm` which is user-writable.
- **Patterns**: see `progress.md` Codebase Patterns.

## 2026-05-25 — [T02] Astro integrations + tokens placeholder
- **Status**: ✅ Done
- **Files changed**: `astro.config.mjs`, `package.json`, `pnpm-lock.yaml`, `src/pages/index.astro`, `src/styles/global.css` (new), `src/styles/tokens.css` (new).
- **Deviation from plan**: no `tailwind.config.mjs` created. Tailwind 4 is CSS-first — config lives inside the imported `.css` via `@theme` blocks. The plan's instruction to add `tailwind.config.mjs` predates Tailwind 4 finalization; the Vite plugin auto-scans Astro files for class names. ep02 will add `@theme` directives inside `tokens.css` (font families, color palette, spacing scale). Filed as a low-risk plan-vs-reality drift.
- **Versions pinned**: `@tailwindcss/vite` 4.3.0, `tailwindcss` 4.3.0, `@astrojs/sitemap` 3.7.2, `@astrojs/check` 0.9.9, `typescript` 6.0.3.
- **Verification**: `pnpm astro check` → 0 errors / 0 warnings / 0 hints across 3 files. `pnpm build` → `dist/sitemap-index.xml` + `dist/sitemap-0.xml` generated; Tailwind utility (`text-2xl`) reaches `dist/index.html` and the CSS bundle (`dist/_astro/index.*.css`, 5.7 KB).
- **Learnings**: Tailwind 4 + Astro 6 wiring requires only (a) `@tailwindcss/vite` plugin in `astro.config.mjs#vite.plugins`, (b) `@import 'tailwindcss';` in a CSS entry, (c) importing that CSS from at least one page/layout. No PostCSS config, no `content` glob.
- **Patterns**: see `progress.md` Codebase Patterns.

## 2026-05-25 — [T05] ESLint + Prettier + npm scripts
- **Status**: ✅ Done
- **Files changed**: `eslint.config.js` (new), `.prettierrc.json` (new), `.prettierignore` (new), `package.json` (scripts), `pnpm-lock.yaml`, plus Prettier auto-reformat of `CLAUDE.md`, `progress.md`, `package.json` on first run.
- **Versions pinned**: `eslint` 10.4.0, `@eslint/js` 10.0.1, `typescript-eslint` 8.60.0, `eslint-plugin-astro` 1.7.0, `globals` 17.6.0, `prettier` 3.8.3, `prettier-plugin-astro` 0.14.1.
- **Scripts added**: `lint`, `lint:fix`, `format`, `format:check`, `typecheck`.
- **Verification**: `pnpm lint` → 0 warnings/errors. `pnpm format` → reformatted 3 files, idempotent on re-run. `pnpm typecheck` → 0/0/0. Negative case: temporary `src/pages/__broken-temp.astro` with `const x: string = 123;` caused `pnpm typecheck` to exit 1 with `ts(2322)`; file deleted after verification.
- **Learnings**: ESLint 10 + flat config + `eslint-plugin-astro` 1.x + `typescript-eslint` 8.x all stack cleanly via `...tseslint.configs.recommended` and `...astro.configs.recommended` spread into the default-exported array. No need for `parserOptions` overrides — the Astro plugin wires its own parser for `.astro` files.
- **Patterns**: see `progress.md`.

## 2026-05-25 — [T06] Repo hygiene
- **Status**: ✅ Done
- **Files changed**: `.gitignore` (expanded), `.env.example` (new), `README.md` (new skeleton).
- **Verification**: `git check-ignore` confirms `node_modules`, `dist`, `.astro`, `.env`, `coverage` are ignored. No real `.env` present in working tree. `pnpm format:check` and `pnpm lint` both green after adding files.
- **Notes**: README is intentionally minimal — full version is T29 (after stack stabilization). Constitution Принцип 1 (no LLM stamps) applies to README too: kept terse, no marketing voice.

## 2026-05-25 — [T03] Self-host fonts Inter + Fraunces
- **Status**: ✅ Done
- **Files changed**: `package.json`, `pnpm-lock.yaml`, `src/styles/global.css`, `src/pages/index.astro`.
- **Deviation from plan**: no `tailwind.config.mjs` (see T02 deviation). Font families wired through Tailwind 4 `@theme` directives in `global.css` (`--font-sans`, `--font-display`) — produces `font-sans` and `font-display` utility classes automatically.
- **Versions pinned**: `@fontsource/inter` 5.2.8, `@fontsource-variable/fraunces` 5.2.9.
- **Verification**: `pnpm build` produces 45 self-hosted font files in `dist/_astro/` (Inter weights 400/500/600 in latin + latin-ext, Fraunces variable in latin + latin-ext, both `.woff` and `.woff2`). `dist/index.html` has zero references to `fonts.googleapis.com` or `fonts.gstatic.com`. Generated CSS contains `.font-display{font-family:var(--font-display)}` and `.font-sans{font-family:var(--font-sans)}`. `pnpm typecheck`, `pnpm lint`, `pnpm format:check` — all green.
- **Notes**: фамилии Inter/Fraunces — заглушка под ep02 (там визуальный код финализируется). Сейчас важна фиксация **паттерна** self-host через `@fontsource*` — менять семейство в ep02 будет правкой одной строки.

## 2026-05-25 — [T04] Base Layout.astro skeleton + favicons
- **Status**: ✅ Done
- **Files changed**: `src/components/layout/Layout.astro` (new), `src/pages/index.astro` (uses Layout), `public/apple-touch-icon.png` (new, 2.5 KB, 180×180), `scripts/generate-apple-touch-icon.mjs` (new, build helper), `package.json` (sharp devDep), `pnpm-lock.yaml`.
- **Layout API**: `<Layout title description ogImage? canonical?>` — accepts overrides; falls back to `${siteUrl}/images/og/default.png` for OG image and `${siteUrl}${pathname}` for canonical. Renders charset, viewport, theme-color, title, description, canonical, three favicon links (svg/ico/apple-touch-icon), full OG (type, locale ru_RU, title, description, url, image), Twitter card.
- **Versions pinned**: `sharp` 0.34.5 (added as devDep for the icon generator script — sharp was already a transitive dep of Astro, but needs to be an explicit dep to be importable from a non-Astro script).
- **Verification**: `pnpm build` clean. Built HTML contains all expected meta tags. Preview server returned 200 on `/`, `/favicon.svg`, `/favicon.ico`, `/apple-touch-icon.png`. Override test: temporary page `temp-og-test.astro` with explicit `ogImage` and `canonical` props produced the expected `og:image` and `canonical` values; file removed after verification. `pnpm typecheck`, `pnpm lint`, `pnpm format:check` — all green.
- **Notes**: favicon assets remain the Astro template's default monogram (placeholder per plan — final монограмма «СГ» в ep02). Skipped Astro's `_underscore-prefix` convention which excludes pages from routing; renamed test file to `temp-og-test.astro` for the override check.
- **Learnings**: see `progress.md`.

## Session B — Content schema + seeds (closed 2026-05-25)

Tasks: T07, T08, T09, T10. All exit-criteria from `session-plan.md` Session B met:

- `git log --oneline -10` shows four new commits `ep01 T07..T10` after the Session A block.
- `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check` — all green on the final state.
- `getCollection('projects').length === 4`, `getCollection('services').length === 3`, `getCollection('pages').length === 5`, `settings` collection contains entries `contacts` and `seo`. Verified through a temporary `src/pages/temp-collection-check.astro` (removed after each task).
- `getEntry('pages', 'about').data.authorPhoto` resolves to the generated 800×800 «фото в работе» placeholder.
- `getEntry('pages', 'privacy')` returns the seeded stub with the «⚠️ ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ» banner.
- Negative tests passed:
  - **Schema field**: temp `services/__broken-temp.md` without `title` triggers `InvalidContentEntryDataError: title: Required` on build (T07 verification — file removed).
  - **URL validation**: temp swap of `telegramPersonal.url` to `not-a-valid-url` triggers `InvalidContentEntryDataError: telegramPersonal.url: Invalid URL` on build (T10 verification — restored from backup).
- `grep -RinE` over `src/content/` for the Constitution Принцип 1 stamp dictionary returns empty (`уют и функциональн`, `стиль и комфорт`, `дом мечты`, `создаём пространств`, `превращаем в произведение`, `больше чем дизайн`, `не просто X а Y`, `индивидуальный подход`, `delivering excellenc`).
- Progress Tracker for T07..T10 ticked in `tasks.md`.

**Plan-vs-reality deltas captured in patterns:** Astro 6 deprecates `z` from `astro:content` (use `astro/zod`); Zod 4 deprecates `.url()`/`.email()` instance methods (use `z.url()`/`z.email()`). Both are TS hints only.

**Outstanding from this session (not blocking Session C):**

- `Portfolio/1/` only has 2 source photos, so `project-01/03.jpg` is a generated «фото в обработке» placeholder. Сестра заменяет файл через image-widget Decap, когда появится третий рендер.
- `seo.json#defaultOgImage` points at `/images/og/default.png`, which does not yet exist. Created in T24. Layout already defaults to the same path (Session A note) — planned forward reference.
- Decap admin (T11) needs a `media_folder`/`public_folder` decision that bridges Decap-uploaded photos (target `public/`) with the seed pattern of `image()`-resolved `src/assets/` paths. Two options: (a) point Decap at `src/assets/projects/`, or (b) accept a hybrid where seeded paths stay relative while new uploads land in `public/`. Flagged here so T11 does not get surprised.

**Next session**: Session C — Decap admin + OAuth + smoke-test (T11, T12, T13). Before launching, бра́т должен создать GitHub OAuth App вручную (Application name `svetik-design admin`, callback URL фиксируется после деплоя Worker в T12).

## 2026-05-25 — [T07] Zod schemas for content collections
- **Status**: ✅ Done
- **Commit**: `ep01 T07: Zod content collections (projects, services, pages, settings)`
- **Files changed**: `src/content.config.ts` (new), `src/content/{projects,services,pages,settings}/.gitkeep` (new — placeholders for empty dirs, superseded by seeds in T08–T10).
- **Schema decisions**:
  - `projects` — `image()` for cover / gallery / seo.ogImage via schema-callback `({ image }) => ...`. `gallery: z.array(image()).min(3)`. `published`/`isConcept` default to `true`.
  - `services` — text + order only, no image fields.
  - `pages` — `authorPhoto: image().optional()` (only consumed on about.md; ignored elsewhere).
  - `settings` — single `glob` JSON collection with `z.union([contactsSchema, seoSchema])`. Alternative (two `file()` collections) would yield `getEntry('contacts', 'telegramPersonal')` instead of plan-mandated `getEntry('settings', 'contacts')`. Glob + union picks the shape via non-overlapping required keys.
- **Deviation from plan**: imports `z` from `astro/zod` (not `astro:content`) — Astro 6 deprecated the latter. Zod 4 likewise deprecated `.url()` / `.email()` instance methods in favour of `z.url()` / `z.email()` top-level constructors. Cosmetic (TS hints only), but keeps typecheck at 0/0/0.
- **Verification**: `pnpm typecheck` → 0/0/0. `pnpm lint`/`pnpm format:check` green. `pnpm build` green on empty collections. Negative-test: `src/content/services/__broken-temp.md` without `title` → build fails with `InvalidContentEntryDataError: title: Required`. File removed.
- **Patterns**: see `progress.md` (Astro 6 / Zod 4 import migration; settings via glob+union).

## 2026-05-25 — [T08] Seed 4 projects + placeholder photos
- **Status**: ✅ Done
- **Commit**: `ep01 T08: seed 4 projects + placeholder photos`
- **Files changed**: `src/content/projects/project-{01..04}.md` (new), `src/assets/projects/project-{01..04}/*.jpg` (12 source photos copied + renamed from `Portfolio/{1..4}/`, plus 1 generated placeholder for `project-01/03.jpg`), `scripts/generate-project-placeholder.mjs` (new).
- **Seed shape**: 4 concept projects, all `published: true, isConcept: true`. Метражи 62 / 28 / 38 / 84 м²; types cover 3 of 4 enum values (`apartment`, `studio`, `house` — `commercial` reserved for future). `order` 4→1 sorts «свежие сверху» for T17 listing. Each body is an explicit `PLACEHOLDER` marker plus 1–2 neutral sentences, no stamps (Принцип 1).
- **Photo seeding**: `cover` reuses the same relative-path string as `gallery[0]`. Astro+Vite dedupes by resolved path — one physical file, one optimized output. Lets us satisfy `gallery.min(3)` without duplicate bytes.
- **`Portfolio/1` edge case**: only 2 source photos → `gallery.min(3)` needs a third. `scripts/generate-project-placeholder.mjs` emits a 1200×900 «фото в обработке» JPEG via `sharp(Buffer.from(svg)).jpeg(...).toFile(...)`. Honest placeholder, not a file duplicate, signals «нужно заменить». Сестра uploads the real 3rd render through the image-widget in Decap (T11) — frontmatter path stays the same.
- **Verification**: build/typecheck/lint/format green. Temp `src/pages/temp-collection-check.astro` (removed) confirmed `getCollection('projects').length === 4`, titles readable. Stamp-grep over `src/content/` empty.

## 2026-05-25 — [T09] Seed 3 services + 5 page docs (incl. privacy stub)
- **Status**: ✅ Done
- **Commit**: `ep01 T09: seed 3 services + 5 page docs (incl. privacy stub)`
- **Files changed**: `src/content/services/{full-design,supervision,consulting}.md`, `src/content/pages/{hero,about,services-intro,contact-intro,privacy}.md`, `src/assets/about/placeholder.jpg`, `scripts/generate-about-placeholder.mjs`.
- **Services**: `order: 1/2/3` gives expected ordering on /services (T19). `tagline` ≤120 chars, `priceNote` only on full-design. Body lists «что входит» dryly — no «уникальный авторский подход» voice.
- **Pages**:
  - `hero.md` — single-paragraph stub for the homepage. Final hero copy in ep02.
  - `about.md` — explicit «программа профессиональной переподготовки» instead of vague «прошла обучение» (Принцип 7 — junior speaks as junior, no senior cosplay). `authorPhoto: ../../assets/about/placeholder.jpg`.
  - `services-intro.md`, `contact-intro.md` — short lead paragraphs for T19 page wiring.
  - `privacy.md` — 152-ФЗ-shaped stub with prominent «⚠️ ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ ПЕРЕД ПУБЛИЧНЫМ ЗАПУСКОМ» banner. Sections: оператор / категории ПДн / цели / основание (consent checkbox from T20) / срок хранения / получатели (TG/SMTP) / права субъекта / контакт / трансграничка / изменения. ep01 goal — close the technical gap for CookieBanner (T21) and ContactForm consent (T20), not write a production legal text. Final edit in ep03 after legal review.
- **Author photo placeholder**: `scripts/generate-about-placeholder.mjs` mirrors the project-placeholder script — separate file, separate output, same shape. Sister replaces via Decap image-widget.
- **Verification**: build/typecheck/lint/format green. Temp page confirmed `services.length === 3` in order `full-design=1, supervision=2, consulting=3`; `pages.length === 5`; `about.authorPhoto present: true`; `privacy present: true`. Stamp-grep over `src/content/` empty.

## 2026-05-25 — [T10] Seed settings (contacts.json + seo.json)
- **Status**: ✅ Done
- **Commit**: `ep01 T10: seed settings (contacts.json + seo.json)`
- **Files changed**: `src/content/settings/contacts.json`, `src/content/settings/seo.json`.
- **Contacts**: 4 каналов из `Contacts/Cont.txt` + email-заглушка. `telegramPersonal: @svgodesign, primary: true`. `maxMe.url` — реальный max.ru deeplink (research упоминал «max.me», но Cont.txt — max.ru; используем фактический). Handle для max — «Профиль в Max» (читаемо, без копирования невменяемого ID). `email: example@email.com` — заглушка, попадает в activation checklist (T28). `telegramBlogRssUrl: https://t.me/s/Golovina_design_ambersoftloft` — публичный preview-канал для build-time парсера в T15 (не RSSHub).
- **SEO**: `siteName`, `siteUrl=https://svetik-design.pages.dev` (превью-домен до миграции ep03), `defaultOgImage=/images/og/default.png` (файл создаётся в T24, Layout уже ссылается из Session A — единая точка истины), `description` — короткое RU-описание для главной.
- **Schema validation**: все URL через `z.url()`, email через `z.email()`. Negative-test: подмена `telegramPersonal.url` на `not-a-valid-url` → `InvalidContentEntryDataError: telegramPersonal.url: Invalid URL`. Восстановлено.
- **Verification**: build/typecheck/lint/format green. Temp page подтвердил: `settings` содержит 2 entry (ids `contacts`, `seo`); `getEntry('settings','contacts').data.email === 'example@email.com'`; `getEntry('settings','seo').data.siteName` корректное. `z.union` discriminates correctly on non-overlapping required keys (`telegramPersonal` vs `siteName`).

## Session C — Decap admin + OAuth + smoke-test (partial close 2026-05-25)

Tasks attempted: T11, T12, T13. **Closed: T11 only.** T12 and T13 остановлены ровно по сценарию `session-plan.md` § Session C («Если не сделано — остановись на T12 и попроси пользователя»): на момент сессии у бра́та не созданы GitHub OAuth App и не подключён аккаунт Cloudflare с авторизованным wrangler.

**T11 exit-criteria (выполнено):**

- `git log --oneline` показывает новый коммит `c351985 ep01 T11: Decap admin shell + config.yml (9 collections, test-repo backend)`.
- `pnpm dev` (после рестарта с изменённым `astro.config.mjs`): curl `/admin/`, `/admin`, `/admin/index.html`, `/admin/config.yml` все 200; тело `/admin/` содержит тег `<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js">`.
- `pnpm preview` (production-like static): то же, плюс `/admin/` нативно резолвит trailing-slash без dev-плагина — подтверждает, что в CF Pages ничего дополнительно подкручивать не надо.
- `public/admin/config.yml` распарсен через `yaml@2.9.0` в Node, assertions: 9 коллекций (`projects, services, page_home, page_about, page_services_intro, page_contact_intro, page_privacy, settings_contacts, settings_seo`); русские лейблы; `type` — select с 4 опциями (`apartment/house/studio/commercial`); `isConcept` — boolean widget, default true; `gallery` — list widget, min 3; `about.authorPhoto` — image widget, required false; `media_folder` per-collection: `../../assets/projects/{{slug}}` для проектов и `../../assets/about` для about.
- `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check` — все зелёные.
- Progress Tracker T11 отмечен в `tasks.md`.

**Что НЕ сделано в этой сессии и почему:**

- **T12 (OAuth Worker)** — требует трёх внешних шагов, недоступных Claude:
  1. Бра́т вручную создаёт GitHub OAuth App: Settings → Developer settings → OAuth Apps → New OAuth App. Application name: `svetik-design admin`. Homepage URL: `https://svetik-design.pages.dev` (превью-заглушка ок). Authorization callback URL: временно `http://localhost:8788/callback` для wrangler dev; финальный URL — после первого деплоя Worker'а (см. ниже), нужно вернуться в OAuth App и заменить. Получить Client ID и Client Secret.
  2. Бра́т авторизует wrangler в Cloudflare: `wrangler login` (откроет браузер, нужно залогиниться в аккаунт CF, у которого есть права создавать Workers).
  3. После того, как Claude напишет код `workers/oauth/` и `wrangler.toml`, бра́т выполняет: `cd workers/oauth && wrangler secret put OAUTH_CLIENT_ID` (вводит Client ID), `wrangler secret put OAUTH_CLIENT_SECRET` (вводит Client Secret), `wrangler deploy`. Деплой даёт URL вида `https://svetik-design-oauth.<account-handle>.workers.dev`. Этот URL надо вернуть в GitHub OAuth App как Authorization callback URL и зафиксировать в log.md для T13.
- **T13 (Wire Decap backend)** — блокирован на T12: нужен URL OAuth Worker'а, чтобы прописать в `public/admin/config.yml`: `backend: { name: github, repo: <owner>/svetik-design, branch: main, base_url: <oauth-worker-url>, publish_mode: editorial_workflow }`. Без T12 — некуда указывать base_url. Smoke-test (login → edit → save → commit → rebuild) физически невозможен без работающего OAuth-флоу.

**Brother-checklist для разблокировки следующей сессии (Session C продолжение):**

| Шаг | Действие | Что получится |
|---|---|---|
| 1 | GitHub → Settings → Developer settings → OAuth Apps → New OAuth App. Name: `svetik-design admin`. Homepage URL: `https://svetik-design.pages.dev`. Authorization callback URL: `http://localhost:8788/callback` (на время dev; будет заменено на шаг 4). | Client ID + Client Secret. **Запиши их в защищённом месте — никогда не клади в репо/чат.** |
| 2 | Установи wrangler глобально: `pnpm add -g wrangler` (или `npm i -g wrangler`). | `wrangler --version` показывает версию ≥4. |
| 3 | `wrangler login` в PowerShell. Браузер откроется на странице аккаунта Cloudflare. Логин → Allow. | wrangler привязан к твоему CF-аккаунту. `wrangler whoami` показывает email. |
| 4 | Открой новую сессию Claude по той же ссылке Session C (см. session-plan.md). Скажи Claude «У меня готовы OAuth App и Cloudflare. Client ID = ..., Client Secret передам через wrangler secret put сам.» Claude напишет `workers/oauth/src/index.ts`, `wrangler.toml`, `workers/oauth/README.md`. После того, как код готов, ты выполняешь: `cd workers/oauth`, `wrangler secret put OAUTH_CLIENT_ID` (вводишь Client ID), `wrangler secret put OAUTH_CLIENT_SECRET` (вводишь Client Secret), `wrangler deploy`. Деплой выдаст URL вида `https://svetik-design-oauth.<your-handle>.workers.dev`. | Worker задеплоен. URL записан в log.md. |
| 5 | Вернись в GitHub OAuth App (шаг 1) → Edit → замени Authorization callback URL на `https://svetik-design-oauth.<your-handle>.workers.dev/callback` (точный путь Claude скажет, когда покажет код Worker'а). | OAuth App знает реальный production callback. |
| 6 | Claude в той же сессии переходит к T13: обновит `public/admin/config.yml` (backend → github, base_url → URL Worker'а), запустит `pnpm dev`, попросит тебя зайти на `localhost:4321/admin/`, кликнуть «Login with GitHub», авторизоваться, изменить summary в `project-01.md`, сохранить. Проверим вместе, что commit появился в репо. | Smoke-test пройден. T13 отмечен в Progress Tracker. Session C закрыта. |

**Pre-flight для следующей сессии (Session C continuation или Session D, на выбор бра́та):**

- Если хочется идти строго по plan'у — выполни шаги 1–3 выше и открой новую сессию Claude с теми же инструкциями Session C, но теперь у Claude будут все внешние ресурсы и он доведёт T12 + T13 до конца.
- Если внешние ресурсы пока не готовы и не до них — Session C не блокирует Session D (Submit Worker, T23): D зависит только от Session A. Можно открыть отдельную сессию по Session D, она тоже требует CF-аккаунта (для submit-worker деплоя), но не требует GitHub OAuth App. Так что если у бра́та есть только CF-аккаунт, можно делать D, а C продолжить позже.

**Notable decisions / learnings из этой сессии:**

- **Backend test-repo для T11 — правильный выбор для UI-render теста.** Альтернатива `name: github` с заглушка-base_url выдаёт login-экран, который красиво смотрится, но при попытке клика по коллекции уходит в ошибку OAuth. test-repo рендерит UI и даёт открыть форму коллекции с реальными полями (включая isConcept checkbox и authorPhoto image-widget) — это нужно, чтобы убедиться, что схема корректна.
- **Astro/Vite dev не отдаёт `public/<dir>/index.html` по URL `/<dir>/`.** Подтверждённый quirk: `/admin/` и `/admin` оба 404, `/admin/index.html` 200. Решение — крошечный dev-only Vite-плагин `serveAdminIndexInDev` в `astro.config.mjs` (6 строк, JSDoc-typing inline без `vite` в deps). `pnpm preview` и CF Pages не страдают этой проблемой — поэтому плагин ровно в dev-блоке через `configureServer`. См. progress.md Codebase Patterns.
- **Decap config.yml ≠ Zod-схема, синхронизация ручная** — подтверждение Key Decision plan.md Step 10. Сложилось чуть сложнее, чем выглядит в плане: для каждого folder-collection (projects) Decap требует `media_folder`/`public_folder` относительно `folder:` (т.е. `../../assets/projects/{{slug}}` от `src/content/projects/`), а для file-collection (`page_about`) — относительно директории файла (тоже `../../assets/about` от `src/content/pages/`). Без этого Decap при сохранении нового image-upload запишет в frontmatter абсолютный путь вроде `/src/assets/...`, и Astro `image()` schema упадёт. После T13 надо будет вручную залить тестовое фото через admin UI и подтвердить, что frontmatter получает форму `../../assets/projects/<slug>/<file>` — это входит в smoke-test T13.
- **Astro check (`pnpm typecheck`) проверяет только .astro файлы, не `.mjs`.** Опытным путём: ошибки TS-7006 (implicit any) в `astro.config.mjs` показывает IDE через VS Code language server, но `pnpm typecheck` их пропускает. Поэтому добавление inline JSDoc-типов в config — это вопрос IDE-UX, не CI-гейта. Учтём при будущих правках конфига.

**Next session (decided by user):**

- Вариант A (рекомендованный по plan'у): Session C продолжение — после выполнения шагов 1–3 brother-checklist выше открыть новое окно Claude с инструкциями Session C (тот же текст), Claude увидит T11 ✅ и пойдёт сразу с T12.
- Вариант B (параллельный): Session D — Submit Worker (T23). Не зависит от Session C. Требует только CF-аккаунта.
- Вариант C (нелинейный): Session E — Layout components + TG-feed + SEO utils (T14, T15, T22). Не зависит от Session C/D. Требует только Sessions A + B (✅). Полезно, потому что разблокирует Session F (три main страницы) — самую визуально-понятную сестре часть.

## 2026-05-25 — [T12] GitHub OAuth Worker source (workers/oauth/)

- **Status**: ✅ Code done. Deploy выполняет бра́т локально из `workers/oauth/` (`wrangler secret put OAUTH_CLIENT_SECRET` + `wrangler deploy`). Worker URL фиксируется в этом логе следующим апдейтом, когда бра́т сообщит результат.
- **Files changed**: `workers/oauth/src/index.ts` (new, ~110 строк), `workers/oauth/wrangler.toml` (new), `workers/oauth/tsconfig.json` (new), `workers/oauth/README.md` (new, инструкция бра́ту), `package.json` (+`@cloudflare/workers-types` devDep), `pnpm-lock.yaml`.
- **OAuth App reference**: Client ID `Ov23li2njCS1gRivex1E` (публичная часть, в `wrangler.toml` под `[vars]`). Client Secret хранится только в Cloudflare через `wrangler secret put` — никогда не попадает в git/чат. Worker name `svetik-design-oauth`, account_id `9b7219916a409f8774e11265b2d069da`.
- **Protocol details**: маршрут `/auth?provider=github&scope=repo` → 302 на `github.com/login/oauth/authorize` с `redirect_uri=<worker-origin>/callback`. `/callback?code=…` обменивает code на access_token (POST `github.com/login/oauth/access_token` с Accept: application/json), возвращает HTML-страницу, которая делает Decap CMS handshake: ждёт `authorization:github` от opener, отвечает `authorization:github:success:{"token","provider":"github"}`. На любую ошибку — тот же постмесседж-канал с `:error:` и человекочитаемым кодом. Кэширование `no-store` на callback.
- **Verification (без деплоя)**: `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm build` — все зелёные (Astro check игнорирует `workers/`, ESLint покрывает TS файл, Prettier переформатировал таблицу в README — ожидаемо).
- **Outstanding (blocks T13)**:
  1. Бра́т: `cd workers/oauth && wrangler secret put OAUTH_CLIENT_SECRET` (вводит секрет интерактивно).
  2. Бра́т: `wrangler deploy` → получает URL `https://svetik-design-oauth.<handle>.workers.dev`.
  3. Бра́т: GitHub OAuth App `svetik-design admin` → Edit → Authorization callback URL ← `<worker-url>/callback`.
  4. Бра́т: сообщает Worker URL в чат. После этого Claude переходит к T13.
- **Patterns**: см. `progress.md` Codebase Patterns (новый паттерн «Decap-compatible OAuth proxy на CF Worker, два-шаговый handshake»).

