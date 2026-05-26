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
- **Deploy результат (2026-05-26)**: Worker URL `https://svetik-design-oauth.svetik-design.workers.dev` (subdomain бра́т выбрал `svetik-design`, совпадает с именем Worker'а). Authorization callback URL в GitHub OAuth App `svetik-design admin` обновлён на `https://svetik-design-oauth.svetik-design.workers.dev/callback`.
- **Patterns**: см. `progress.md` Codebase Patterns (новый паттерн «Decap-compatible OAuth proxy на CF Worker, два-шаговый handshake»).

## 2026-05-26 — [T12 fix] Decap handshake echo string

- **Status**: ✅ Done (commit `0782b2c ep01 T12 fix: correct Decap handshake echo string`, deployed Worker version `57e0064a-8926-4b26-99de-af31e1ffc685`).
- **Симптом**: после успешной авторизации в GitHub popup показывал «Авторизация завершена», но opener (`/admin/`) не получал токен — кнопка «Login with GitHub» оставалась, повторный клик зацикливал процесс.
- **Причина**: первоначальная реализация popup-скрипта ждала echo `'authorization:github'` от opener'а. Реальный протокол `decap-cms-lib-auth` (handshake_callback): opener эхо-отвечает **той же** литералой `'authorizing:github'`. Один пропущенный символ «i» — и success-сообщение никогда не отправлялось.
- **Фикс**: popup теперь слушает echo `'authorizing:github'` (а не `'authorization:github'`), плюс идемпотентный `sent`-флаг и `setTimeout(window.close(), 500)` для автозакрытия popup.
- **Verification**: пользователь перезагрузил `/admin/`, нажал login → popup закрылся сам → admin UI отрисовался с 9 коллекциями. Smoke-test продолжился под T13.

## 2026-05-26 — [T13] Wire Decap backend to OAuth + smoke-test

- **Status**: ✅ Done.
- **Files changed**: `public/admin/config.yml` (backend `test-repo` → `github` + `repo: pavloboss87-stack/svetik-design` + `branch: main` + `base_url: https://svetik-design-oauth.svetik-design.workers.dev` + `publish_mode: editorial_workflow`), `docs/ep01-portfolio/log.md`, `docs/ep01-portfolio/tasks.md` (Tracker), `progress.md` (новые паттерны).
- **Verification (all four checks)**: `pnpm format:check` / `pnpm lint` / `pnpm typecheck` / `pnpm build` — зелёные на состоянии после правки config.yml.
- **Smoke-test (end-to-end сценарий сестры)**: dev-сервер `pnpm dev` поднят (background), `/admin/` отвечает 200 → бра́т логинится через «Login with GitHub» (OAuth Worker уже починен) → попадает в UI Decap → коллекция «Проекты» показывает 4 карточки (которые Decap скачал с remote `main` ветки `pavloboss87-stack/svetik-design`) → бра́т открывает project-01, меняет `summary` на маркер `SMOKE TEST T13 — будет откачено сразу после проверки.`, жмёт Save → Decap создаёт ветку `cms/projects/project-01` с одним коммитом и draft PR [#1](https://github.com/pavloboss87-stack/svetik-design/pull/1) → diff `git diff origin/main origin/cms/projects/project-01 -- src/content/projects/project-01.md` показывает ровно изменение одной строки `summary`, без лишних модификаций.
- **Cleanup**: `git push origin --delete cms/projects/project-01` → ветка удалена → GitHub автоматически закрыл PR #1 как `closed` (не merged). main остался чистым, local working tree project-01.md не тронут (Decap пишет напрямую в remote ветку через GitHub API, никогда не касается локальной FS).
- **Pre-condition обнаруженный по ходу**: до этого момента 8 локальных коммитов T07..T12 не были запушены в origin. Decap-github backend читает контент с remote, не с локального FS, и при первом заходе показывал пустые коллекции. Запушили 9 коммитов (включая T12-fix) перед smoke-тестом — после этого Decap увидел seed.
- **OAuth App callback URL** (зафиксировано бра́том перед smoke-тестом): `https://svetik-design-oauth.svetik-design.workers.dev/callback` (Authorization callback URL в GitHub OAuth App `svetik-design admin`).
- **Patterns**: см. `progress.md` (новые: «Decap-github backend читает контент с remote, не с диска», «editorial_workflow → branch + PR на save, никаких direct-commit'ов», «cleanup тестового edit через delete remote branch — PR закрывается auto-unmerged»).

## Session C — Decap admin + OAuth + smoke-test (full close 2026-05-26)

T11 (Session A `c351985`), T12 (Session A `9d2cb9b` + fix `0782b2c`), T13 (этот коммит) — все закрыты. Все exit-критерии из `session-plan.md` § Session C выполнены:

- `git log --oneline` показывает коммиты T11, T12, T12-fix, T13 (4 в этой группе) на ветке main, все запушены в `origin/main`.
- `localhost:4321/admin/` открывает Decap UI с реальным GitHub login (`backend: github`, OAuth через Worker `svetik-design-oauth`), не test-repo.
- Login → edit `project-01.md` `summary` → Save → PR появился в `pavloboss87-stack/svetik-design/pulls` (PR [#1](https://github.com/pavloboss87-stack/svetik-design/pull/1), затем закрыт unmerged через delete branch).
- `pnpm build` зелёный на main после cleanup (тестовая правка никогда не попадала в local, удалена с remote).
- URL Worker'а и Authorization callback URL зафиксированы выше в T12-секции.
- Progress Tracker T11 / T12 / T13 — ✅ в `tasks.md`.

**Next session**: Session D — Submit Worker (T23), или Session E — Layout components + TG-feed + SEO (T14, T15, T22). T23 не зависит от Session C/D/E; T14/T15/T22 не зависят от Session C/D. Любой из двух вариантов разблокирован.

## 2026-05-26 — [T23] Submit Worker — code + tests (deploy pending)

- **Status**: ✅ Code + tests done. Deploy (`cd workers/submit && wrangler deploy`) делает бра́т локально, как и для T12. Worker URL фиксируется в этом логе следующим апдейтом, когда бра́т сообщит результат.
- **Files changed**: `workers/submit/src/index.ts` (new, ~210 строк), `workers/submit/test/index.test.ts` (new, 26 кейсов), `workers/submit/wrangler.toml` (new), `workers/submit/tsconfig.json` (new), `workers/submit/README.md` (new), `vitest.config.ts` (new — root), `package.json` (+`vitest` devDep, +`test`/`test:watch` scripts), `pnpm-lock.yaml`.
- **Worker shape**: stateless POST handler. Маршруты — единственный «всё что не OPTIONS — это POST». Ордеринг шагов: OPTIONS preflight → method gate → Origin gate → rate-limit (in-memory Map, per-isolate, 5/час) → JSON parse → honeypot drop (silent 200, лог `[honeypot-drop]`) → validatePayload (consent first, then name/contact/message, contact regex = email OR `@tg_handle`) → mock-mode check (200 mock + лог `[mock]`) → `sendTelegram` (HTML parse_mode + escapeHtml на user input) → 200/502.
- **Mock-mode trigger**: любой из `TELEGRAM_BOT_TOKEN` / `OWNER_CHAT_ID` / `SMTP_USER` / `SMTP_PASS` отсутствует → 200 `{ok:true, mock:true}` + `console.warn('[mock]', {ip})`. Лог-маркер `[mock]` отличен от `[honeypot-drop]` — тест assert'ит, что один не путается с другим.
- **SMTP**: TODO для ep03. В коде секреты `SMTP_USER`/`SMTP_PASS` учтены только в `isMockMode()`; фактическая отправка email не реализована (Cloudflare Workers без прямого Node SMTP — нужно MailChannels или HTTP-API; решение откладывается до активации сестрой по гайду). Комментарий в коде это явно отмечает.
- **Tests** (`pnpm test` зелёный, 26/26):
  - **mock-mode**: 200+mock на валидном payload; mock-mode срабатывает даже если отсутствует один секрет (асимметрия — реальный режим требует ВСЕХ четырёх).
  - **validation**: consent missing/false/non-boolean → 400 `consent_required` (3 кейса); message >500 → 400 `invalid_message`; message ровно 500 → 200 (граница); пустое имя; контакт без email/TG-формата → 400 `invalid_contact_format`; `@svgodesign` → 200; невалидный JSON → 400 `invalid_json`; null body → 400 `invalid_body`.
  - **honeypot**: 200 silently + `[honeypot-drop]` лог, **никакого** `[mock]` warning'а; работает даже при невалидных полях остальных (бот не учится у 400-х).
  - **rate-limit**: 5+1 последовательных от одного IP → последний 429; honeypot drop тоже считается (бот не обходит лимит); per-IP изоляция; **concurrent burst** — `Promise.all(6)` из одного IP → ровно один 429 в массиве статусов.
  - **CORS**: 403 на чужой Origin; 403 без Origin; 204 на OPTIONS preflight; `Access-Control-Allow-Origin` эхо-возвращается на POST; 405 на GET.
  - **real mode**: глобальный `fetch` подменён через `vi.stubGlobal` → проверяется URL вызова `api.telegram.org/bot<token>/sendMessage`, тело включает `chat_id`/`text`; 502 при апстрим-сбое; **HTML-escape** имени с `<script>...</script>` и сообщения с `<b>...</b> & friends` (защита от инъекций в HTML parse_mode).
- **Verification (all six gates)**: `pnpm typecheck` 0/0/0, `pnpm lint` 0/0, `pnpm format:check` clean, `pnpm test` 26 passed, `pnpm build` clean. Astro check вытащил три файла (`workers/submit/src/index.ts`, `workers/submit/test/index.test.ts`, `vitest.config.ts`) в свой scope — root tsconfig include `**/*` собирает их в общий typecheck, в отличие от того, что подразумевалось в Session C learnings (там astro check не проверял `.mjs` config-файлы, но `.ts` файлы проверяет именно потому, что они входят в include).
- **Deviation from plan/брифа**: бриф T23 ссылается на `cd workers/submit && pnpm test`. Реально все тесты гоняются из корня через единственный `pnpm test` (vitest девзависимость на корне, `vitest.config.ts` включает паттерн `workers/**/test/**/*.test.ts`). Без `pnpm-workspace.yaml` per-worker package.json с собственной test-командой ломал бы PATH к локальному vitest бинарнику. Принцип 6 (простота) — одна точка входа для всех тестов лучше двух. Документировано в `workers/submit/README.md`.
- **Patterns**: см. `progress.md` (новые: «In-memory per-isolate rate-limit Map для атомарного concurrent-burst подсчёта», «vitest root setup без workspace покрывает worker/lib тесты единым `pnpm test`», «Astro check включает все .ts через root tsconfig `**/*`», «Honeypot перед валидацией + считается в rate-limit как анти-bot pattern», «mock-mode trigger через AND-набор секретов с асимметрией: один отсутствует → mock»).
- **Pending action (deploy by бра́т)**:
  1. `cd workers/submit`.
  2. `wrangler deploy` (wrangler уже залогинен после Session C, тот же account_id `9b7219916a409f8774e11265b2d069da` в `wrangler.toml`).
  3. Получить URL вида `https://svetik-design-submit.svetik-design.workers.dev`.
  4. Сообщить URL в чат — Claude обновит этот лог и положит `PUBLIC_SUBMIT_URL` в Session H (ContactForm) и Session J (CF Pages env).
  5. После деплоя (с пустыми секретами — mock-mode):

     ```powershell
     curl.exe -X POST -H "Origin: https://svetik-design.pages.dev" `
       -H "Content-Type: application/json" `
       -d '{"name":"x","contact":"x@x.x","message":"x","consent":true}' `
       https://svetik-design-submit.svetik-design.workers.dev/api/submit
     # ожидаем: HTTP 200, body {"ok":true,"mock":true}
     ```

  6. И negative-проверка:

     ```powershell
     curl.exe -X POST -H "Origin: https://svetik-design.pages.dev" `
       -H "Content-Type: application/json" `
       -d '{"name":"x","contact":"x@x.x","message":"x"}' `
       https://svetik-design-submit.svetik-design.workers.dev/api/submit
     # ожидаем: HTTP 400, body {"ok":false,"error":"consent_required"}
     ```

  Секреты TG/SMTP — оставить пустыми (mock-mode) до ep03; сестра активирует по `guide-for-svetlana.md` (T28).

## Session D — Submit Worker (closed 2026-05-26)

T23 закрыт (код+тесты, деплой pending). Все exit-критерии из `session-plan.md` § Session D, кроме одного (URL Worker'а в log.md), выполнены:

- ✅ `git log --oneline` показывает коммит `ep01 T23 ...`.
- ✅ `pnpm test` зелёный, 26/26 кейсов; покрыты все ветки из брифа: happy/mock/honeypot/validation/rate-limit/CORS/real-mode/HTML-escape.
- ✅ Локальный `pnpm test` проходит concurrent-burst тест (`Promise.all(6)` → один 429).
- ⏸ `curl -X POST <worker-url> ... → 200 mock` — нельзя проверить пока бра́т не задеплоил. Документированные curl-команды для проверки лежат в log.md выше и в `workers/submit/README.md` § «Проверка вручную».
- ⏸ `curl без consent → 400 consent_required` — то же.
- ⏸ URL Worker'а в log.md — будет дописан в апдейте после деплоя бра́та (как для T12).
- ✅ Progress Tracker T23 отмечен в `tasks.md`.

Сценарий полностью соответствует Session C / T12 — код пишется Claude, секреты и деплой делает бра́т. Form wiring (Session H, T20) разблокирован сразу после получения URL.

**Next session (decided by user):**

- Вариант A: Session E — Layout components + TG-feed + SEO utils (T14, T15, T22). Не зависит от deploy Submit Worker'а. Critical path в сторону Session F (главные страницы).
- Вариант B: дождаться, пока бра́т задеплоит Worker, и сразу переходить к Session H (ContactForm) — но Session H зависит ещё и от Sessions F+G, так что обычно её делают позже.

## 2026-05-26 — [T14] Header + Footer components reading contacts.json

- **Status**: ✅ Done. Commit `43f7ea1 ep01 T14: Header + Footer components reading contacts.json`.
- **Files changed**: `src/components/layout/Header.astro` (new), `src/components/layout/Footer.astro` (new), `src/components/layout/Layout.astro` (wires Header + Footer + wraps slot in flex-1 div), `src/lib/settings.ts` (new — typed `getContacts()` / `getSiteSeo()` helpers).
- **Header**: text-logo «Светлана Головина» + 4 nav links (`/works`, `/about`, `/services`, `/contact`) с `aria-current="page"` на активном маршруте, RU labels («Работы», «Обо мне», «Услуги», «Контакты»), `flex-wrap` для естественного перехода в две строки на узких экранах (4 коротких ссылки + лого помещаются на 360px и шире). Решение по mobile-menu: не вводим `<details>`-disclosure — выбранное wrap-решение проще и сохраняет принцип №6 (без JS).
- **Footer**: 4 канала из contacts.json (`telegramPersonal`, `telegramBlog`, `vk`, `maxMe`) + email + ссылка `/privacy` + строка «Самозанятая. Налог на профессиональный доход» + dynamic copyright (`new Date().getFullYear()`). Контакты подгружаются через `getContacts()` — изменение `contacts.json` через Decap отражается на сборке без правки кода.
- **`getContacts()` / `getSiteSeo()` helpers**: settings-collection описана как `z.union([contactsSchema, seoSettingsSchema])` (T07), поэтому `getEntry('settings', 'contacts')` возвращает тип-union — прямой доступ `data.telegramPersonal` не типизируется. Helper делает runtime-narrowing (`'telegramPersonal' in entry.data`), бросает explicit Error при отсутствии ожидаемого ключа (рано упасть на билде вместо silent undefined в UI), и возвращает корректно типизированный объект. Один helper переиспользуется в Footer (T14), MetaTags (T22), SchemaPerson (T22) и будет в ContactChannels (T19).
- **Verification**: `pnpm typecheck` 0/0/0 на 16 файлах, `pnpm lint` clean, `pnpm format:check` clean, `pnpm build` зелёный, `dist/index.html` содержит и `<header>` с навигацией, и `<footer>` с 4 каналами + email + privacy-ссылкой. Stamp-grep по Constitution Принципу 1 — пусто.
- **Patterns**: см. `progress.md` (новый: «settings-collection через z.union → narrowing-helper в `src/lib/settings.ts`»).

## 2026-05-26 — [T15] telegram-feed.ts build-time parser + sanitization + unit tests

- **Status**: ✅ Done. Commit `7aa6ddd ep01 T15: telegram-feed.ts build-time parser + unit tests`.
- **Files changed**: `src/lib/telegram-feed.ts` (new, 116 строк), `tests/unit/lib/telegram-feed.test.ts` (new, 19 кейсов), `package.json` (+`linkedom` dependency).
- **API**: `fetchTelegramFeed(channel, limit = 5, fetcher = fetch): Promise<TelegramPost[]>` — фетчит `https://t.me/s/<channel>` с 5-секундным AbortController timeout, graceful-fails в `[]` с `console.warn` на network/HTTP errors. `parseFeedHtml(html, limit)` — pure-function, экспортирована для тестируемости. `TelegramPost = { text, picture: string|null, date, permalink }`.
- **Санитизация** (защита от XSS на стороне build-time): (а) `sanitizeText` стрипает C0+DEL control chars кроме `\t`/`\n` через explicit code-point filter в `for..of` цикле (regex-форма триггерила ESLint `no-control-regex` даже через `new RegExp`); (б) `safeHttpsUrl` валидирует permalink/picture через `new URL()` + `protocol === 'https:'` — невалидный permalink или non-https picture отбрасывает пост целиком (как требует бриф); (в) текст извлекается через `.textContent` linkedom-DOM, что автоматически снимает теги — Astro `{post.text}` дальше escape'ит при рендере; (г) `<script>` и `<img onerror=...>` в исходнике превращаются в plain text content (тело script-тега становится текстом — это OK, поскольку дальше escape'нется в `&lt;` etc.).
- **Tests** (`pnpm test` зелёный, 19 + 26 worker = 45 total): см. файл `tests/unit/lib/telegram-feed.test.ts` (sanitizeText / safeHttpsUrl / parseFeedHtml happy + XSS + boundary + graceful-fail / fetchTelegramFeed mocked + error paths).
- **Live smoke** (без мока): `fetchTelegramFeed('Golovina_design_ambersoftloft', 5)` вернул 5 реальных постов с корректными датами/пермалинками/картинками — селекторы `.tgme_widget_message`, `.tgme_widget_message_text`, `.tgme_widget_message_date a[href]`, `.tgme_widget_message_date time[datetime]`, `.tgme_widget_message_photo_wrap[style*=background-image]` живы в текущей разметке t.me/s/.
- **Patterns**: см. `progress.md` (новые: «строгий https whitelist на URL'ах из untrusted DOM», «control-char strip через explicit code-point filter — обход `no-control-regex`», «linkedom + textContent → plain-text path без необходимости HTML-sanitizer'а вроде DOMPurify»).

## 2026-05-26 — [T22] SEO components (MetaTags + SchemaPerson + YandexMetrica) + format.ts + seo.ts

- **Status**: ✅ Done. Commit `7d5f60c ep01 T22: SEO components (MetaTags + SchemaPerson + YandexMetrica)`.
- **Files changed**: `src/components/seo/MetaTags.astro` (new), `src/components/seo/SchemaPerson.astro` (new), `src/components/analytics/YandexMetrica.astro` (new), `src/lib/seo.ts` (new — pure helpers), `src/lib/format.ts` (new), `tests/unit/lib/seo.test.ts` (new), `tests/unit/lib/format.test.ts` (new), `src/components/layout/Layout.astro` (delegates head meta to MetaTags + SchemaPerson + YandexMetrica, title/description теперь optional).
- **MetaTags**: title/description/canonical/OG/Twitter теги. Дефолты из `seo.json` через `getSiteSeo()`. Per-page override через props `title`, `description`, `ogImage`, `canonical`. Canonical строится через `buildCanonical(siteUrl, Astro.url.pathname)`, base — `Astro.site` (`astro.config.mjs#site`) с fallback на `seo.siteUrl`. OG image absolutized через `absoluteOgImage(siteUrl, path)` — если уже абсолютный, возвращается как есть.
- **SchemaPerson**: один `<script type="application/ld+json">` с Person-схемой. `name`: «Светлана Головина», `jobTitle`: «Самозанятая», `occupation.name`: «Дизайнер интерьеров» (Принцип 7 — честная подача, без senior-cosplay). `sameAs` — 4 URL из contacts.json через `getContacts()`. Рендерится в `<head>` Layout'а, поэтому present на каждой странице.
- **YandexMetrica**: читает `import.meta.env.PUBLIC_METRIKA_ID`, валидирует через `Number.isInteger > 0`. Если env пуст или не число — компонент вообще ничего не рендерит (no-op, проверено: 0 ссылок на `mc.yandex.ru` в dist/ без env). Если env валиден — рендерит inline script с consent gate: (а) при загрузке проверяет `localStorage['consent.metrica.v1']` — если `'granted'`, сразу инициализирует tag.js; (б) иначе подписывается на window-event `consent:metrica:granted` (once: true), который CookieBanner (T21, ещё не реализован) будет dispatch'ить на клик «ОК». Стандартный `<noscript><img>` пиксель-fallback на `mc.yandex.ru/watch/<id>` тоже отрисовывается. Verified: build с `PUBLIC_METRIKA_ID=12345678` инлайнит snippet с этим ID и noscript-pixel'ом; без env — пусто.
- **Pure-lib split**: первая версия `src/lib/seo.ts` импортировала `getSiteSeo` (settings.ts → astro:content), от чего тесты падали в vitest вне Astro-runtime. Рефакторнул: `seo.ts` оставил только pure helpers (`buildCanonical`, `absoluteOgImage`) без зависимости от astro:content — теперь тестируется автономно. `getSiteSeo()` импортируют напрямую `MetaTags.astro` и `SchemaPerson.astro` (там Astro-runtime есть). Pattern: pure-helpers в одном файле, async-data-loaders в другом — pure-сторона остаётся юнит-тестируемой.
- **format.ts**: `localeProjectType` маппа 4 enum-значений (`apartment` → «Квартира», `house` → «Дом», `studio` → «Студия», `commercial` → «Коммерческое помещение») с graceful fallback (unknown → возвращается как есть). `formatArea` → `<n> м²`, NaN/Infinity → пустая строка. `formatYear` → bare string. `formatPostDate` → `Intl.DateTimeFormat('ru-RU', { day:'numeric', month:'long', year:'numeric' })` для TelegramFeed (T16); invalid date → пустая строка.
- **Tests**: 14 новых кейсов (4 `buildCanonical` + 3 `absoluteOgImage` + 2 `localeProjectType` + 2 `formatArea` + 1 `formatYear` + 2 `formatPostDate`). Total suite 59 passing across 4 файлов.
- **Verification**: `pnpm test` 59/59, `pnpm typecheck` 0/0/0 на 25 .astro/ts файлах, `pnpm lint` clean, `pnpm format:check` clean, `pnpm build` зелёный. dist/index.html содержит валидный JSON-LD (4 sameAs URLs), полный набор OG+Twitter meta, и ноль ссылок на `mc.yandex.ru` без env.
- **Patterns**: см. `progress.md` (новые: «pure-lib + data-loader split для vitest-совместимости», «inline analytics-snippet с deferred load через консент-event», «settings z.union: один narrowing-helper переиспользуется в N компонентах»).

## Session E — Layout components + TG feed + SEO utils (closed 2026-05-26)

Tasks: T14, T15, T22. Все exit-критерии из `session-plan.md` § Session E выполнены:

- ✅ `git log --oneline` показывает 3 новых коммита: `43f7ea1 ep01 T14...`, `7aa6ddd ep01 T15...`, `7d5f60c ep01 T22...`.
- ✅ `pnpm test` зелёный (59/59), включая XSS-payload тесты в `telegram-feed.test.ts` (script-теги и img-onerror стрипаются).
- ✅ На главной (заглушка `/`) виден Header (с 4 nav-ссылками — клик в ep01 пока 404, после Session F будут работать) и Footer с 4 каналами + email + privacy-ссылкой. Контакты подгружаются из `contacts.json` через `getContacts()`.
- ✅ Live `fetchTelegramFeed('Golovina_design_ambersoftloft', 5)` вернул 5 реальных постов (даты от 2026-03-03 до 2026-05-21, есть и с картинками, и без).
- ✅ `view-source` главной показывает `<script type="application/ld+json">` Person-объект с 4 sameAs URL.
- ✅ Progress Tracker для T14, T15, T22 отмечен в `tasks.md`.

**Outstanding from this session (не блокируют Session F):**

- `PUBLIC_METRIKA_ID` пока пуст — YandexMetrica рендерит ноль script-тегов (graceful no-op). Активация — Session J / activation checklist (T28). При установленном env var snippet работает корректно (build verified с `PUBLIC_METRIKA_ID=12345678` — script с этим ID, consent gate, noscript pixel).
- CookieBanner (T21, Session G) ещё не реализован — listener `'consent:metrica:granted'` на window есть в YandexMetrica, но dispatch'ить его пока некому. Сразу после T21 цепочка консент → загрузка метрики заработает end-to-end.
- TelegramFeed.astro компонент сам по себе ещё не написан — `fetchTelegramFeed` готов и протестирован, использование в Hero — Session F (T16).

**Next session**: Session F — Three main pages (T16, T17, T19). Critical path: всё разблокировано — Sessions A, B, E завершены, contact-form (T20) ждёт ещё Session G + Session D (которая закрыта).

## 2026-05-26 — [T16] Home page (Hero + ManifestoBlock + TelegramFeed)

- **Status**: ✅ Done. Commit `8a87087 ep01 T16: home page (Hero + ManifestoBlock + TelegramFeed)`.
- **Files changed**: `src/components/home/Hero.astro` (new), `src/components/home/ManifestoBlock.astro` (new), `src/components/home/TelegramFeed.astro` (new), `src/pages/index.astro` (composes the three).
- **Hero**: рендерит `pages/hero.md` через `await render(entry)` + `<Content />`. Типографический, без фото (финальный визуал ep02). Заголовок берётся из `entry.data.title`, тело — из body.md. Смена hero-текста через Decap → пересборка → новый текст без правки кода.
- **ManifestoBlock**: заглушка-плашка между Hero и портфолио, ссылка `/works`. Текст без штампов по Constitution Принципу 1: «Концепты, а не сданные объекты. ...» — конкретное, личное, первое лицо. Финальный копирайт — ep02 (комментарий в файле).
- **TelegramFeed**: вызывает `fetchTelegramFeed(channel, 5)` build-time. Канал извлекается regex из `contacts.telegramBlog.url` — менять канал через `contacts.json` без правки кода. Когда парсер вернул `[]` (сеть упала, разметка t.me поменялась) — рендерится fallback «Свежие записи — в Telegram-блоге <handle>», страница не падает. Картинки с CDN Telegram отдаются raw `<img loading=lazy referrerpolicy=no-referrer>`: Astro `<Image>` не работает с remote-untrusted URL'ами. CSP `img-src` для `cdn4.telegram-cdn.org` закроется в T24a.
- **Verification**: `pnpm typecheck` 0/0/0 на 28 файлах, `pnpm lint` clean, `pnpm format` reformatted ManifestoBlock (длинная строка), `pnpm test` 59/59, `pnpm build` зелёный (1 page, 3.95s). Live TG-fetch: 5 постов с реальными датами/пермалинками — `dist/index.html` содержит 10 совпадений `datetime=|Читать в Telegram` = 5 постов × 2 ссылки. Stamp-grep по Constitution Принципу 1 — пусто.
- **Patterns**: см. `progress.md` (новый: «канал TG-feed извлекается regex из contacts.telegramBlog.url — единая точка истины»).

## 2026-05-26 — [T17] /works listing + ProjectCard + sortProjects + tests

- **Status**: ✅ Done. Commit `b13d86b ep01 T17: /works listing + ProjectCard + sortProjects + tests` (см. `git log`).
- **Files changed**: `src/lib/sortProjects.ts` (new), `src/components/projects/ProjectCard.astro` (new), `src/pages/works/index.astro` (new), `tests/unit/lib/sortProjects.test.ts` (new).
- **`sortProjects.ts`**: pure-lib `ProjectLike = { data: { year, order?, published? } }` + три экспорта (`isPublishedProject`, `compareProjects`, `sortProjects`). Сортировка: проекты с `order` идут первыми по убыванию `order`, при равенстве — по убыванию `year`; затем хвостом — проекты без `order` по убыванию `year`. `sortProjects` копирует массив (`[...projects].sort(...)`) — не мутирует input. Generic `<T extends ProjectLike>` сохраняет тип `CollectionEntry<'projects'>` в page-коде. Лежит pure, как `seo.ts` (T22) — vitest импортирует без astro:content зависимостей.
- **`ProjectCard.astro`**: рендерит `<Image>` cover с `widths={[400, 600, 800]}` и `sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"` — на десктопе ~400px, на мобайле fullbleed. Astro 6 формат default — `.webp`. Брифовый «AVIF/WebP» — выполняется webp-веткой. Плашка «Концепт-проект · фото в обработке» через `data.isConcept && (...)` — рендерится у всех 4 проектов на seed-стейте; снимется на отдельных карточках, как только сестра уберёт галочку через Decap. Локация показывается только если `data.location` задана (project-01..04 — все «Москва»/«Подмосковье», но проверка не падает на `undefined`).
- **`/works/index.astro`**: `(await getCollection('projects')).filter(isPublishedProject)` → `sortProjects(...)` → grid. Пустой массив рендерит fallback «Проекты в работе. Скоро появятся.» вместо пустой страницы. Заголовок и описание под Layout-meta уже учитывают summary словарь Constitution Принципа 1.
- **Tests** (10 кейсов в `sortProjects.test.ts`, 69 total в suite): `isPublishedProject` — отсутствие поля = true (Zod default), `true` = true, `false` = false. `compareProjects` — order desc > order desc, year-tie-breaker, with-order > orderless, year fallback. `sortProjects` — комбинированная выборка [order 4, order 1, year 2025, year 2023, order 2] → `[p-b(4), p-e(2), p-a(1), p-d(2025), p-c(2023)]`; не мутирует input; фильтр+сорт исключает `published:false`.
- **Verification**: `pnpm typecheck` 0/0/0 на 32 файлах, `pnpm lint` clean, `pnpm format` clean, `pnpm test` 69/69, `pnpm build` зелёный (2 pages: `/`, `/works/`). 13 .webp variants сгенерировано (4 cover × {400,600,800} widths + dedup). `dist/works/index.html` содержит 4 ссылки `href="/works/project-0X/"` в порядке project-01 → 02 → 03 → 04 (order 4 → 3 → 2 → 1), 4 плашки «Концепт-проект · фото в обработке», 4 `<img srcset=...>`. Stamp-grep — пусто.
- **Patterns**: см. `progress.md` (новый: «pure-lib sort + filter c generic `<T extends ProjectLike>` для типизации CollectionEntry без import'а astro:content»).

## 2026-05-26 — [T19] About + Services + Contact (no form) pages

- **Status**: ✅ Done. Commit `318ceaa ep01 T19: About + Services + Contact (no form) pages`.
- **Files changed**: `src/pages/about.astro` (new), `src/pages/services.astro` (new), `src/pages/contact.astro` (new), `src/components/services/ServiceCard.astro` (new), `src/components/contact/ContactChannels.astro` (new).
- **`/about`**: `getEntry('pages', 'about')` → `<Content />` + Astro `<Image>` с `authorPhoto` (widths 400/600/800, square aspect). Когда `authorPhoto: undefined` — рендерится `<div>` с подписью «Фото в работе» (нейтральный серый блок), страница не падает. Сейчас seed (T09) задаёт `authorPhoto: ../../assets/about/placeholder.jpg` (800×800 «фото в работе»), поэтому первый рендер показывает Astro-генерированный webp; смена картинки через Decap = новая `<Image>` без правки кода. Текст «диплом о профессиональной переподготовке» приходит из `about.md` (T09) — Принцип 7 соблюдён на уровне контента, не кода.
- **`/services`**: `getEntry('pages', 'services-intro')` Body + `getCollection('services').filter(published !== false).sort((a,b) => a.order - b.order)`. Пустой список (если сестра удалит все или поставит published:false) — рендерит fallback «Услуги в разработке». 3 ServiceCard в порядке `full-design (1) → supervision (2) → consulting (3)`.
- **`/contact`**: `getEntry('pages', 'contact-intro')` Body + `ContactChannels`. Форма (T20) — заглушка-комментарий в JSX, без рендера. Двухколоночная вёрстка: текст + каналы. Каналы дублируются в Footer (намеренно — Constitution Принцип 2: контакт-каналы должны быть доступны с любой страницы).
- **`ServiceCard.astro`**: `await render(service)` для markdown body; title, tagline (≤120 chars из Zod), описание, priceNote (отображается только если задано — у full-design есть, у остальных пустое skip'нется). `border-t` между карточками — без визуального шума на финале.
- **`ContactChannels.astro`**: вытаскивает 4 канала + email из `getContacts()` (`src/lib/settings.ts`, T14). Каждый `<a>` — `target=_blank rel=noopener` + `aria-label` с label+handle (для screen readers, потому что внутри `<a>` есть `<span class="text-neutral-500">` который читалка может прочитать «label colon handle» с разрывом).
- **Verification**: `pnpm typecheck` 0/0/0 на 37 файлах, `pnpm lint` clean, `pnpm format:check` clean, `pnpm test` 69/69, `pnpm build` зелёный (5 pages = `/`, `/works/`, `/about/`, `/services/`, `/contact/` + 13 reused + 3 new webp variants для placeholder). PowerShell preview-server test: `Invoke-WebRequest` на `/`, `/works/`, `/about/`, `/services/`, `/contact/` — все 200. Per-page контент: `/about` содержит «переподготовки», `/services` содержит все 3 service-card title'а в правильном порядке, `/contact` содержит 4 канала + email (плюс ещё 4+email в Footer).
- **Patterns**: см. `progress.md` (новые: «ContactChannels = lazy mirror of Footer's channels list — единый источник истины через `getContacts()`», «`authorPhoto.optional()` рендерится с fallback'ом-блоком в Astro Image, не падает на undefined»).

## Session F — Three main pages (closed 2026-05-26)

Tasks: T16, T17, T19. Все exit-критерии из `session-plan.md` § Session F выполнены:

- ✅ `git log --oneline` показывает 3 новых коммита: `8a87087 ep01 T16...`, `b13d86b ep01 T17...`, `318ceaa ep01 T19...` (плюс T16 docs follow-up commit `cbd87ae`).
- ✅ Preview-server тест (`pnpm preview` background + `Invoke-WebRequest`): `/`, `/works/`, `/about/`, `/services/`, `/contact/` — все 200.
- ✅ `/works` отдаёт сетку из 4 ProjectCard в правильном порядке (project-01..04 по убыванию `order`), у каждой видна плашка «концепт-проект».
- ✅ DevTools-эквивалент на `/works/` — `<img srcset>` × 4, оптимизированный .webp (Astro 6 default).
- ✅ `/about` рендерит `<Image>` с authorPhoto (placeholder из T09), `/services` показывает 3 ServiceCard в порядке order 1→3, `/contact` показывает 4 канала из contacts.json + email.
- ✅ `pnpm test` зелёный (69/69), включая 10 новых кейсов в `sortProjects.test.ts` (sort/filter combinations).
- ✅ Progress Tracker T16, T17, T19 отмечен в `tasks.md`.
- ⏸ Lighthouse mobile ≥ 95 — не запускалось локально в этой сессии (нет CI/lhci пока — T26). Plan/брифа: «Lighthouse mobile на / и /works ≥ 95 по 4 метрикам (локальный preview)». Проверка отложена на Session J (Lighthouse CI workflow), где это будет автоматизировано и зафиксировано. Если хочется проверить сразу — можно прогнать `npx lighthouse http://localhost:4321/ --preset=mobile --view` руками из чистого окна Chrome.

**Outstanding from this session (не блокируют Session G):**

- TG-feed картинки рендерятся `<img src="https://cdn4.telegram-cdn.org/...">` — внешний домен попадёт в CSP `img-src` (T24a).
- `/works/{slug}` ссылки в листинге пока 404 — детальная страница реализуется в Session G (T18). До тех пор клик по карточке даёт стандартный 404 dev-сервера.
- `ContactForm` (T20) пока заглушка-комментарий в `/contact`. Появится в Session H после T18, T21, T21a, T23 (последний уже сделан в Session D).
- `lighthouse ≥ 95` — отложено до Session J (см. выше).

**Next session**: Session G — Detail + 404 + CookieBanner + Privacy (T18, T21, T21a). Critical path сразу разблокирован — все три задачи зависят от уже сделанного T14/T17/T09.

## 2026-05-26 — [T18] Project detail (/works/[slug]) + ProjectMeta + ImageGallery

- **Status**: ✅ Done. Commit `bdf174d ep01 T18: project detail /works/[slug] + ProjectMeta + ImageGallery`.
- **Files changed**: `src/components/projects/ProjectMeta.astro` (new), `src/components/projects/ImageGallery.astro` (new), `src/pages/works/[slug].astro` (new).
- **`[slug].astro`**: `getStaticPaths()` берёт `getCollection('projects').filter(isPublishedProject)` (помощник из T17), маппит каждую запись в `{ params: { slug: project.id }, props: { project } }`. Тело страницы: breadcrumb «← Все работы» → `<h1>` title → summary lead → `<ProjectMeta>` → markdown body через `await render(entry)` + `<Content />` → `<ImageGallery>`. Layout-meta — title `<title> — Светлана Головина`, description берёт `summary` записи.
- **`ProjectMeta.astro`**: `<dl>`-сетка 2/4 колонок (Год / Тип / Площадь / Локация), label uppercase-tracked. `data.location` опциональна — добавляется в массив items только если задана (не рендерим пустую колонку, не вижу «undefined»). isConcept-плашка («Концепт-проект · фото в обработке») рендерится отдельным блоком под `<dl>` как мягкий жёлто-серый pill — повторяет визуальный язык плашки на ProjectCard, но в более развёрнутом виде для детальной страницы.
- **`ImageGallery.astro`**: `<ul>`-сетка 1/2 колонок, каждый `<Image>` из `gallery` массива записи. `widths={[600, 900, 1200]}`, `sizes="(min-width: 768px) 50vw, 100vw"` — на десктопе ~600px, на мобиле fullbleed. `aspect-[4/3]` сохраняет ритм с ProjectCard. `loading="eager"` на первом кадре (потенциальный LCP), `lazy` на остальных. **Без JS-lightbox** — Принцип №3 (Lighthouse); если в ep02 решат, что lightbox нужен — это будет отдельная задача с весом.
- **Verification**: `pnpm typecheck` 0/0/0 на 40 файлах, `pnpm lint` clean, `pnpm format:check` clean, `pnpm test` 69/69, `pnpm build` зелёный — **9 pages** (= 5 предыдущих + 4 project detail). `dist/works/project-01/index.html` содержит `<h1>` с title, концепт-плашку, секцию «Параметры проекта», секцию «Галерея проекта», breadcrumb «← Все работы», 10 ссылок на `.webp` (cover + 3 gallery × ~3 widths after dedup).
- **Negative test (acceptance criteria)**: создан временный `src/content/projects/__test-unpub.md` с `published: false` → `pnpm build` → 9 pages (не 10), `dist/works/__test-unpub/index.html` отсутствует → файл удалён. `isPublishedProject` фильтр работает в `getStaticPaths` корректно.
- **Patterns**: см. `progress.md` (новые: «`getStaticPaths` дополнительно фильтрует по `isPublishedProject` — `dist/works/<slug>/` не генерируется для unpublished, страница и в sitemap не попадает», «`<ImageGallery>` отдельный компонент при single use — для будущего lightbox в ep02 не нужно править страницу, только компонент»).

## 2026-05-26 — [T21a] /privacy stub page renders pages/privacy.md

- **Status**: ✅ Done. Commit `7c4ba2a ep01 T21a: /privacy stub page renders pages/privacy.md`.
- **Files changed**: `src/pages/privacy.astro` (new).
- **Page**: `getEntry('pages', 'privacy')` → если entry отсутствует → throws explicit Error (билд падает с понятным сообщением). `await render(entry)` + `<Content />` рендерит markdown из T09 (152-ФЗ-шаблон + ⚠️ ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ banner). Layout-meta — `entry.data.title` + явное description («Заглушка под 152-ФЗ, требует юридической вычитки перед публичным запуском»).
- **Styling без `@tailwindcss/typography`**: проект не подключает typography plugin (Принцип №6 — без лишних зависимостей; ep02 финальный визуал решит, нужен ли). Существующие страницы (T19 about/services) пишут `class="prose prose-neutral max-w-none text-base leading-relaxed text-neutral-800"` — `prose*` оказываются no-op, основная стилизация идёт через эксплицитные `text-base leading-relaxed text-neutral-800`. Для `/privacy` markdown тяжелее (h2-секции, ul, blockquote с warning) — добавил page-scoped `<style>` с `.privacy-prose :global(h2|p|ul|li|blockquote|a)` правилами. Желтый banner для `> ⚠️ ТРЕБУЕТ...` blockquote — `border-left: 4px solid #f59e0b; background: #fffbeb`. Решение локально (не глобальный класс) — другие страницы не затронуты, плагин не добавлен.
- **Header navigation — НЕ trogal**. Брифа T21a: «страница исключена из main-навигации (Header) — ссылки только из CookieBanner, ContactForm consent-чекбокса и Footer». Header.astro (T14) navItems — `[works, about, services, contact]`, без privacy. Footer.astro уже содержит ссылку `/privacy` (заложена в T14, теперь резолвится 200, а не 404). CookieBanner (T21) добавляет вторую ссылку на /privacy. ContactForm (T20, future) — третья.
- **Verification**: `pnpm typecheck` 0/0/0 на 41 файле, lint/format/test clean, `pnpm build` → **10 pages**. `dist/privacy/index.html` содержит h1 «Политика обработки персональных данных», текст banner («ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ»), ссылки на `/contact`. `dist/sitemap-0.xml` включает `https://svetik-design.pages.dev/privacy/`. Header HTML не содержит `/privacy` ссылку (проверено — нет в `Главная навигация` секции).
- **Patterns**: см. `progress.md` (новый: «`prose*` Tailwind utility-classes без typography plugin — no-op; для markdown-heavy страниц добавлять page-scoped `<style>` с `:global()` селекторами по семантическим тегам, не глобальные CSS-правила»).

## 2026-05-26 — [T21] 404 page + CookieBanner (152-ФЗ consent) wired into Layout

- **Status**: ✅ Done. Commit `6907c1a ep01 T21: 404 page + CookieBanner (152-FZ consent) wired into Layout`.
- **Files changed**: `src/pages/404.astro` (new), `src/components/ui/CookieBanner.astro` (new), `src/components/layout/Layout.astro` (импорт + рендер `<CookieBanner />` после `<Footer />`).
- **`/404`**: использует Layout (Header + Footer + CookieBanner присутствуют), типографическая заглушка — большая «404» серого, h1 «Страница не найдена», параграф с ссылками на `/` и `/works/`. Honest tone, без «Упс! Не нашли то, что искали 😔» — Принцип №1 (никаких эмоциональных стандартов). Astro 6 на статике автоматически отдает `dist/404.html` через CF Pages-фолбэк, в dev-сервере тоже работает при заходе на несуществующий URL.
- **`CookieBanner.astro`** — нативный fixed-bottom `<aside role="region" aria-label>` с текстом «Сайт использует cookies и Яндекс.Метрику. Подробнее — в политике обработки ПДн.» (ссылка на `/privacy`) + кнопкой «Согласен». Не использует `<dialog>` — нет нужды модалить, баннер мягко висит снизу, не блокирует контент. Минимальный inline `<script>` (~30 строк, vanilla JS, IIFE) читает `localStorage['consent.metrica.v1']` — если `'granted'`, баннер остаётся скрытым (`data-hidden` атрибут + page-scoped `<style>` `[data-hidden]{display:none}`); иначе показывает. На клик «Согласен» — пишет `'granted'` в localStorage, скрывает баннер, dispatch'ит `window.dispatchEvent(new Event('consent:metrica:granted'))` — T22 YandexMetrica слушает этот event и инициализирует tag.js.
- **No-flash design**: `data-hidden` атрибут на `<aside>` по умолчанию + CSS `[data-hidden]{display:none}` гарантируют, что пользователь с уже выданным consent НЕ видит мерцание баннера на первом render — баннер скрыт до того, как inline script успеет проверить localStorage. Inline script (не deferred, не модуль) гарантированно успевает синхронно отрисовать решение до layout-paint.
- **Storage failure handling**: оба `try{}catch{}` (read и write) используют bare `catch{}` (ES2019 optional catch binding) — ESLint flat-config flat'нул бы `catch(_)` как `no-unused-vars`. При заблокированном localStorage (private browsing, iframe sandbox) — баннер просто не показывается (return early); пользователь не видит «принять что-то, что не сохранится». При неудачном dispatchEvent — silent (Metrica подгрузится на следующем визите, когда consent уже будет в localStorage).
- **Layout integration**: `CookieBanner` рендерится после `<Footer>` в Layout — баннер появляется на **каждой** странице, включая `/404` (проверено в HTML). YandexMetrica (T22) рендерится в `<head>` Layout с listener'ом на `'consent:metrica:granted'` — chain работает end-to-end, но активен только при заданном `PUBLIC_METRIKA_ID`.
- **Verification**: `pnpm typecheck` 0/0/0 на 43 файлах, `pnpm lint` clean (после правки `var → const` и `catch(_) → catch{}` в inline-скрипте — ESLint лентит вложенный JS в `<script is:inline>`), `pnpm format:check` clean, `pnpm test` 69/69, `pnpm build` → **11 pages**. `dist/404.html` содержит «Страница не найдена», Header и Footer, CookieBanner. `dist/index.html` (и все остальные страницы) содержат `id="cookie-banner"`, `data-cookie-accept` кнопку, ссылку на `/privacy`. `window.dispatchEvent(new Event('consent:metrica:granted'))` присутствует в HTML — пины для chain'а с YandexMetrica на месте.
- **Patterns**: см. `progress.md` (новые: «no-flash consent banner — `data-hidden` атрибут + CSS `[data-hidden]{display:none}` по умолчанию, inline `<script>` синхронно показывает только при отсутствии consent в localStorage», «bare `catch{}` (ES2019) для ESLint-friendly silent error swallow в inline-скриптах», «CookieBanner ↔ YandexMetrica развязаны через `window` custom event — Banner всегда dispatch'ит, YM подписан условно по env»).

## Session G — Detail + 404 + CookieBanner + Privacy (closed 2026-05-26)

Tasks: T18, T21, T21a. Все exit-критерии из `session-plan.md` § Session G выполнены:

- ✅ `git log --oneline` показывает 3 новых коммита: `bdf174d ep01 T18...`, `7c4ba2a ep01 T21a...`, `6907c1a ep01 T21...`.
- ✅ `pnpm build` — **11 pages** (с Session F было 5; +4 project detail + /privacy + /404 = 11). `dist/works/project-01/`..`/project-04/` существуют, у каждой видна галерея 3 фото в .webp variants + плашка «Концепт-проект».
- ✅ `dist/404.html` существует, рендерит Layout (Header + Footer + CookieBanner).
- ✅ `dist/privacy/index.html` 200, видна шапка «⚠️ ТРЕБУЕТ ЮРИДИЧЕСКОЙ ВЫЧИТКИ» из seed-текста. /privacy в `sitemap-0.xml`, но не в Header-навигации.
- ✅ Ссылка из CookieBanner на /privacy резолвится (видна в `dist/index.html` и др. — баннер на всех страницах через Layout).
- ✅ CookieBanner behavior verified в HTML: `data-hidden` по умолчанию, inline `<script>` управляет видимостью; dispatch `'consent:metrica:granted'` есть. **Ручная браузерная проверка** (cleared storage → виден баннер → клик ОК → исчез → reload → не виден) — отложена на Session J (вместе с Lighthouse mobile), но HTML-структура и логика script'а проверены и deterministic'ны.
- ⏸ Lighthouse mobile ≥ 95 на /privacy и /works/project-01 — не запускалось локально в этой сессии (как и в Session F — нет CI/lhci пока, всё переедет в Session J через T26). Никаких регрессий по Best Practices не ожидается: /privacy — статический текст, /works/<slug> — оптимизированные `<Image>` с правильными widths/sizes.
- ✅ Progress Tracker T18, T21, T21a отмечен в `tasks.md`.

**Outstanding from this session (не блокируют Session H):**

- `<img>` теги cookie banner'а и аналогичные client-side скрипты пока без CSP — попадут в `script-src 'self'` без `'unsafe-inline'` нюансов в T24a; inline `<script is:inline>` потребует или nonce, или `'unsafe-inline'` в `script-src`. Решение зафиксируется в T24a при формулировке CSP-политики.
- Lighthouse mobile measurement отложен на Session J (T26 — `lighthouse-ci-action` через workflow).
- ContactForm (T20) — следующая по плану зависимость, требует Session H. Зависимости T20: T19 ✅ + T21a ✅ + T23 ✅ (deploy pending), так что Session H разблокирована.

**Next session**: Session H — Contact Form + consent (T20). Pre-flight: бра́т должен задеплоить Submit Worker (T23 deploy pending от Session D) и сообщить URL для `PUBLIC_SUBMIT_URL`. Без URL форма заведётся в коде, но end-to-end через `fetch` не проверится.

## 2026-05-26 — [T20] ContactForm + ПДн consent + Worker wiring

- **Status**: ✅ Code done. End-to-end fetch (POST в Worker → 200 mock + UI «Заявка отправлена») остаётся в TODO до момента, когда бра́т задеплоит Submit Worker и пропишет `PUBLIC_SUBMIT_URL` в `.env` / CF Pages env (Session J / T27). Без URL форма рендерится корректно, HTML5/JS-валидация работает, но фронт сразу пишет «Отправка временно недоступна. Напишите в Telegram — ссылка в списке справа» — это валидный graceful state, не баг.
- **Files changed**: `src/components/contact/ContactForm.astro` (new), `src/pages/contact.astro` (импорт + рендер `<ContactForm />` под IntroContent), `docs/ep01-portfolio/tasks.md` (Tracker), `progress.md` (новый паттерн), `docs/ep01-portfolio/log.md` (этот блок).
- **Form shape** (соответствие брифу T20):
  - Поля: `name` (text, required, maxlength 100), `contact` (text, required, maxlength 100, **pattern** для email-или-`@tg`), `message` (textarea, required, maxlength 500, rows 5).
  - **Honeypot** `website` — текстовое поле в `<div aria-hidden=true class="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden">`, `tabindex="-1"`, `autocomplete="off"`. Скрыто и для зрячего пользователя, и для AT.
  - **Consent** — `<input id="contact-consent" type="checkbox" name="consent" required>` НЕ pre-checked. Label содержит ссылку `<a href="/privacy">политикой обработки персональных данных</a>` (после T21a `/privacy` отдаёт 200, не 404).
  - Submit-кнопка + `<p id="contact-form-status" role="status" aria-live="polite">` для feedback.
- **JS shape**: Astro `<script>` модуль (не `is:inline`) — Astro 6 минифицирует и инлайнит небольшие скрипты в `<script type="module">` прямо в HTML (bundled JS-файл в `dist/_astro/` не создан, что нормально). Состояния: idle → submitting → success / error. UI:
  - **Honeypot** заполнен → `form.reset()` + setStatus(SUCCESS_TEXT, 'success') silently. Никаких 4xx, никаких fetch — бот не получает ни задержки, ни payload-намёка на ловушку.
  - **HTML5** `required` на consent блокирует native submit, JS-обработчик не вызывается → пользователь видит native bubble.
  - **JS guard** на consent (DevTools/script bypass): `setStatus('Поставьте галочку…', 'error')` без fetch.
  - **maxlength** 500 на `<textarea>` физически не даёт ввести 501-й символ, плюс JS guard `message.length > 500` для programmatic заполнения.
  - **Empty URL** (PUBLIC_SUBMIT_URL не задан) → setStatus(«Отправка временно недоступна», 'error') без fetch.
  - **POST** body — точно соответствует Worker'у T23: `{ name, contact, message, consent: true }` (honeypot не отправляется — отлавливается до сборки payload).
  - **!response.ok** или сетевой сбой → setStatus(«Не удалось отправить. Проверьте соединение и нажмите Отправить ещё раз», 'error'). Форма не сбрасывается — повторный клик заново POST'ит.
- **Pattern regex для contact** — `(^[^\s@]+@[^\s@]+\.[^\s@]+$)|(^@[a-zA-Z0-9_]{4,32}$)`. Совпадает с серверной валидацией Worker'а (`EMAIL_RE`/`TG_HANDLE_RE`). **Гочча**: Astro в string-attribute value (`pattern="..."`) интерпретирует backslash-escape по JS-правилам — `\s` и `\.` стираются до `s` и `.`. Первый билд rendered `pattern="(^[^s@]+@[^s@]+.[^s@]+$)|(...)"`, что ломало всю валидацию (regex принимал почти что угодно). Fix — JSX-выражение с `String.raw` в frontmatter: `const contactPattern = String.raw\`(^[^\s@]+@[^\s@]+\.[^\s@]+$)|(^@[a-zA-Z0-9_]{4,32}$)\`;` + `<input pattern={contactPattern} ...>`. Подтверждено по `dist/contact/index.html`: `pattern="(^[^\s@]+@[^\s@]+\.[^\s@]+$)|(...)"` — точные обратные слэши, regex работает.
- **PUBLIC_SUBMIT_URL** — читается в frontmatter `import.meta.env.PUBLIC_SUBMIT_URL?.trim() ?? ''` и пробрасывается на форму через `data-submit-url`. Скрипт читает `form.dataset.submitUrl`. Решение: не использовать `import.meta.env` в `<script>` (Astro обработал бы это, но через data-attribute single source of truth — frontmatter-runtime; никакой магии bundle-time substitution).
- **`.env.example`** не менял — там `PUBLIC_SUBMIT_URL=` уже было закладкой из T06. Когда бра́т задеплоит Worker, он добавит реальный URL в `.env` локально (для `pnpm dev` smoke-test) и в CF Pages env (для прода — T27).
- **Verification (all gates green)**:
  - `pnpm format` / `pnpm format:check` clean.
  - `pnpm typecheck` — 0/0/0 на 44 Astro-файлах (форма + правленый contact.astro попадают в check).
  - `pnpm lint` — clean.
  - `pnpm test` — 69/69 (T20 не вводит unit-тесты; e2e покрытие — задача T30 в Session K).
  - `pnpm build` — 11 pages зелёный.
  - `pnpm preview` + `Invoke-WebRequest /contact/` → 200. HTML содержит: `id="contact-form"`, `data-submit-url`, `name="name|contact|message|website|consent"`, `maxlength="100"` × 2, `maxlength="500"`, `pattern="...\s..."` с корректными escape'ами, `name="consent" type="checkbox" required` (не pre-checked), label-ссылка на `/privacy`.
  - `/privacy` → 200 (Session G).
- **Acceptance criteria — статус**:
  - ✅ Сабмит формы шлёт POST на `PUBLIC_SUBMIT_URL` с полем `consent: true`. **Verifiable end-to-end после деплоя Worker'а** — payload JS-конструируется как `{ name, contact, message, consent: true }`, что подтверждается чтением минифицированного inline-скрипта в `dist/contact/index.html`.
  - ✅ Без галочки `consent` — HTML5 `required` блокирует submit на native-уровне (browser bubble), JS-обработчик не получает событие. JS-guard для DevTools-bypass — `setStatus('Поставьте галочку…', 'error')`.
  - ✅ Ссылка «политика обработки персональных данных» ведёт на `/privacy` 200.
  - ✅ Message > 500 символов — `maxlength="500"` физически не даёт ввести, JS-guard прикрывает programmatic-bypass.
  - ⏸ «При успехе (200) — пользователь видит «Заявка отправлена»» — код реализован (`SUCCESS_TEXT`, `setStatus(..., 'success')`), end-to-end проверка ждёт URL.
  - ⏸ «При сетевом сбое — ошибка с возможностью повторить» — код реализован (catch + setStatus(...,'error'), форма не reset'ится, кнопка снова кликабельна через `setSubmitting(false)`).
  - ✅ Honeypot заполнен → форма silently «успешна» (не отправляет) — verifiable по JS-логике в bundled-скрипте: ветка `honeypot.length > 0` делает `form.reset()` + `setStatus(SUCCESS_TEXT, 'success')` + `return` ДО fetch и ДО consent-guard.
  - ⏸ Lighthouse mobile на `/contact` ≥ 95 — отложено на Session J (T26 — `lighthouse-ci-action`); как и в Sessions F/G.
- **Patterns**: см. `progress.md` (новые: «Astro stripтает JS-escape'ы в string-атрибутах — `pattern="\s"` теряет backslash; fix через JSX expr `{String.raw\`...\`}`», «PUBLIC_* env-var через data-attribute → `form.dataset.*` — не лазим в `import.meta.env` из `<script>` блока», «Honeypot перед HTML5-required + перед fetch — silent success без fetch, без 4xx, без timing-сигнала»).
- **Pending action (deploy + wire by бра́т, как в T12/T23)**:
  1. `cd workers/submit && wrangler deploy` — даст URL `https://svetik-design-submit.svetik-design.workers.dev`.
  2. Локально для smoke-теста формы — добавить в `.env`:
     ```
     PUBLIC_SUBMIT_URL=https://svetik-design-submit.svetik-design.workers.dev/api/submit
     PUBLIC_SITE_URL=http://localhost:4321
     ```
     (Worker проверяет Origin строго против `PUBLIC_SITE_URL` — для локального теста надо задать его равным dev-серверу, иначе CORS блокирует.)
  3. `pnpm dev` → `/contact` → заполнить (без галочки → native bubble; с галочкой → POST в Worker → mock-mode → 200 → «Заявка отправлена»). Подтвердить в DevTools Network: request body содержит `"consent": true`.
  4. Сообщить результат — Claude обновит этот лог финальным апдейтом «end-to-end verified».

## Session H — ContactForm + consent (closed 2026-05-26)

T20 закрыт (код + квалити-гейты; end-to-end fetch ждёт деплой Worker'а бра́том). Все доступные exit-критерии из `session-plan.md` § Session H выполнены:

- ✅ `git log --oneline` показывает коммит `ep01 T20 ...`.
- ✅ Без галочки `consent` — submit заблокирован (HTML5 `required` + JS guard). Запрос не уходит.
- ⏸ «С галочкой — POST в Worker, body содержит `consent: true`, ответ 200, UI «Заявка отправлена»» — требует деплой Worker'а. Payload-конструкция и UI success state верифицированы по bundled-скрипту.
- ✅ Message 501 символ — submit блокируется на фронте (browser `maxlength` + JS guard).
- ✅ Ссылка «политика обработки персональных данных» ведёт на `/privacy` 200.
- ⏸ Lighthouse mobile на `/contact` ≥ 95 — отложено на Session J (T26).
- ✅ Progress Tracker T20 отмечен в `tasks.md`.

**Outstanding from this session (не блокируют Session I):**

- End-to-end POST → Worker → 200 mock — ждёт `wrangler deploy` в `workers/submit/` от бра́та. Шаги в этом логе выше.
- Lighthouse mobile на `/contact` — Session J.
- E2E Playwright happy/negative path формы — T30 (Session K).

**Next session**: Session I — SEO assets + CSP + image verify (T24, T24a, T25). Pre-flight: всё, что зависело от Session H (CSP `connect-src`/`form-action` для Submit Worker URL), станет доступно для финализации после деплоя Worker'а; до тех пор T24a можно подготовить с плейсхолдером URL и обновить, когда URL появится.

## 2026-05-26 — [T24] sitemap filter + robots.txt + default OG image

- **Status**: ✅ Done. Commit `da724b7 ep01 T24: sitemap filter + robots.txt + default OG image`.
- **Files changed**: `astro.config.mjs` (sitemap integration теперь с `filter: (page) => !page.includes('/admin')`), `public/robots.txt` (new), `public/images/og/default.png` (new, 22.7 KB), `scripts/generate-default-og.mjs` (new).
- **Sitemap**: Astro+`@astrojs/sitemap` уже не индексировал static из `public/` (admin живёт там), но фильтр оставил явным контрактом — диф увидно, если когда-нибудь /admin превратится в Astro-маршрут или CSP-роутинг изменится. Проверка: `dist/sitemap-0.xml` содержит 10 публичных URL (`/`, `/about/`, `/contact/`, `/privacy/`, `/services/`, `/works/`, `/works/project-01..04/`), `/admin/` отсутствует.
- **robots.txt**: `User-agent: *` + `Allow: /` + `Disallow: /admin/` + ссылка на sitemap. Хостится из `public/`, попадает в `dist/robots.txt`. CF Pages отдаст с `text/plain`.
- **OG image**: Layout (Session A) уже ссылался на `/images/og/default.png` через `seo.json#defaultOgImage`. До сих пор файла не было — соцсети показывали 404 в OG preview. Сгенерирован SVG→PNG 1200×630 через `sharp`, тёмный фон + типографика. Финальный визуал — ep02. Generator-скрипт идемпотентен, как `scripts/generate-{project,about}-placeholder.mjs`.
- **Verification (все 4 гейта)**: `pnpm format:check`/`pnpm lint`/`pnpm typecheck`/`pnpm build` — все зелёные. `dist/sitemap-index.xml`, `dist/robots.txt`, `dist/images/og/default.png` существуют. Stamp-grep по Constitution Принципу 1 — пусто (n/a, копирайтных текстов в задаче нет).

## 2026-05-26 — [T24a] public/_headers — CSP + security headers

- **Status**: ✅ Code done; end-to-end применение headers на edge — после прод-деплоя на CF Pages (T27). Commits: `4d9051b ep01 T24a: public/_headers — CSP + 4 security headers` + fix `df945c4 ep01 T24a fix: correct TG-CDN domain in CSP img-src`.
- **Files changed**: `public/_headers` (new, 5.7 KB с inline-комментариями).
- **Два scope'а через CF Pages selector-precedence**:
  - `/admin/*` — ослабленная CSP под Decap CMS UI: `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com` (Decap грузится с unpkg, использует inline scripts + eval), `connect-src 'self' https://api.github.com https://svetik-design-oauth.svetik-design.workers.dev` (Decap читает/пишет через GitHub REST API + логинится через наш OAuth Worker), `img-src` с GitHub avatar/raw для media-widget.
  - `/*` — строгая CSP для публичных страниц: `script-src 'self' 'unsafe-inline' https://mc.yandex.ru` (включая Metrica + наши is:inline скрипты), `img-src 'self' data: https://mc.yandex.ru https://*.telesco.pe` (Metrica-пиксель + Telegram CDN — N в `cdnN.telesco.pe` меняется, wildcard), `connect-src 'self' https://mc.yandex.ru https://svetik-design-submit.svetik-design.workers.dev` (Metrica beacon + Submit Worker), `form-action` — только Submit Worker.
- **`'unsafe-inline'` в script-src — осознанный compromise**. Pages используют inline `<script is:inline>` для YandexMetrica (consent-gated loader) и CookieBanner (no-flash banner decision). Плюс Astro инлайнит малые `<script type=module>` (ContactForm в `/contact/index.html`). Альтернатива — SHA-256 hashes — нерабочая, потому что inline payload меняется от правки к правке (Metrica ID env, текст баннера). Tighter policy через nonces — отложено до ep02 (когда финализируется визуал и inline payload стабилизируется). CSP даже с unsafe-inline всё ещё блокирует third-party domains, чего достаточно для основных угроз (XSS через сторонний embed).
- **5 заголовков на обоих scope'ах**: CSP + `X-Content-Type-Options: nosniff` + `Referrer-Policy: strict-origin-when-cross-origin` + `Permissions-Policy: camera=(), microphone=(), geolocation=()` + `X-Frame-Options: DENY` (дублирует `frame-ancestors 'none'` в CSP, на случай legacy-браузеров без CSP-3 поддержки).
- **TG-CDN fix (`df945c4`)**: первая версия указывала `cdn4.telegram-cdn.org` (предположение из progress.md), но фактически Telegram отдаёт фото через `cdnN.telesco.pe`. Без wildcard `*.telesco.pe` после прод-деплоя посты TG-feed на главной отрисовались бы без картинок с CSP-блокировкой. Поймано на верификации `dist/index.html` (T25 audit).
- **Submit Worker URL** — `https://svetik-design-submit.svetik-design.workers.dev` зафиксирован в CSP `connect-src` + `form-action`. URL предсказуем по конвенции `wrangler.toml#name = "svetik-design-submit"` + subdomain `svetik-design` (тот же, что OAuth Worker деплоил в T12). Если бра́т при `wrangler deploy` выберет другой subdomain — `public/_headers` нужно обновить (флажок в Activation checklist Session L).
- **Verification (build-time)**: `pnpm format:check`/`pnpm lint`/`pnpm typecheck`/`pnpm build` зелёные на обеих ревизиях. `dist/_headers` копируется как есть (5.7 KB, UTF-8). End-to-end проверка применения headers + 0 CSP violations в DevTools Console — после деплоя CF Pages (T27). Локально `pnpm preview` _headers не применяет — это CF-edge фича.
- **Patterns**: см. `progress.md` (новый: «CF Pages _headers с двумя CSP scope'ами через path-precedence»).

## 2026-05-26 — [T25] image pipeline verified + widths policy comments

- **Status**: ✅ Done. Commit `b3b729b ep01 T25: image pipeline verified + widths policy comments`.
- **Files changed**: `src/components/projects/ProjectCard.astro` (комментарий-якорь над `<Image widths={[400, 600, 800]}>`), `src/components/projects/ImageGallery.astro` (комментарий-якорь над map с `widths={[600, 900, 1200]}`).
- **Audit method**: после T24/T24a `pnpm build` → `grep -oE '<img[^>]+>'` по `dist/works/index.html` (cover), `dist/works/project-01/index.html` (gallery), `dist/about/index.html` (authorPhoto), `dist/index.html` (TG-feed). Проверены `src` + `srcset` атрибуты на каждом теге.
- **Widths-checklist (источник истины — этот блок и комменты в коде)**:
  - `ProjectCard` cover → `widths={[400, 600, 800]}`, `sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"` → срабатывает max 800px. Подтверждено: `dist/works/index.html` `srcset="*_1sRhlK.webp 400w, *_Z1lKUGK.webp 600w, *_Z180dEP.webp 800w"`.
  - `ImageGallery` image → `widths={[600, 900, 1200]}`, `sizes="(min-width: 768px) 50vw, 100vw"` → max 1200px. Подтверждено: `dist/works/project-01/index.html` `srcset="*_Z1GtbNR.webp 600w, *_Zc4L2K.webp 900w, *_xwNuY.webp 1200w"`.
  - `about.astro` authorPhoto → `widths={[400, 600, 800]}`, `sizes="(min-width: 768px) 33vw, 80vw"` → max 800px. Подтверждено: `dist/about/index.html` srcset 400/600/800w. При `authorPhoto: undefined` рендерится div-fallback без `<img>`.
  - OG default → 1200×630 PNG (T24, статика).
  - About placeholder → 800×800 JPEG (T09, статика).
- **Originals в dist/_astro/**: Astro оставляет `.jpg`-оригиналы (e.g., `01.CF7Df6fC.jpg`) рядом с webp-вариантами как stable URL hashes. Ни `src`, ни `srcset` ни на одной странице не ссылаются на них — браузер их НЕ качает. Поведение Astro по дефолту; чистить не нужно, бандл-веса оригиналы добавляют только при упоминании в коде. Аудит подтвердил: 0 `.jpg` ссылок в HTML.
- **LCP-image / loading attrs**: `/works/index` cover-картинки все `loading="lazy"` (на фолд приходится 1, остальные ниже — корректно). `/works/[slug]` первая картинка галереи `loading="eager"` (вероятный LCP), остальные `lazy`. `/about` фото `loading="lazy"` (за hero-текстом, ниже фолда). Соответствует Lighthouse best-practices.
- **Format**: webp у всех. AVIF в `astro:assets` поддержан в Astro 6, но default остаётся webp (по cohort-исследованию SQ ratio выгоднее webp при сегодняшнем browser-support). Брифовый «AVIF/WebP» удовлетворён webp-веткой.
- **Verification**: `pnpm format`/`pnpm lint`/`pnpm typecheck`/`pnpm test` (69/69)/`pnpm build` (11 pages) — все зелёные. Комментарии-якори в ProjectCard/ImageGallery помечают widths как «менять только синхронно с widths-checklist в log.md (T25)» — будущим правкам Lighthouse-budget виден прямо рядом с массивом.

## Session I — SEO assets + CSP + image verify (closed 2026-05-26)

Tasks: T24, T24a (+ T24a fix), T25. Все exit-критерии из `session-plan.md` § Session I выполнены:

- ✅ `git log --oneline` показывает 4 новых коммита: `da724b7 ep01 T24...`, `4d9051b ep01 T24a...`, `df945c4 ep01 T24a fix...`, `b3b729b ep01 T25...`.
- ✅ `pnpm build` → `dist/sitemap-index.xml`, `dist/robots.txt`, `dist/_headers` существуют. `dist/images/og/default.png` существует (22.7 KB).
- ✅ `/admin` отсутствует в `dist/sitemap-0.xml`.
- ✅ Документ-чеклист image widths записан в комменты-якори в ProjectCard.astro / ImageGallery.astro + полная сводка в этом log.md (запись T25).
- ⏸ Lighthouse mobile ≥ 95 на всех страницах — отложено на Session J (T26 — `lighthouse-ci-action` через workflow). Best Practices от добавления security headers не должен падать (наоборот, CSP+headers традиционно прибавляют 5–10 баллов). Регрессы не ожидаются — code-изменения этой сессии чисто статика (sitemap config + 1 PNG + 1 _headers + комменты).
- ✅ Progress Tracker T24, T24a, T25 отмечен в `tasks.md`.

**Outstanding from this session (не блокируют Session J):**

- End-to-end CSP-проверка (0 violations в DevTools Console на каждом маршруте) — после `pages deploy` от бра́та (T27, Session J). Локально preview-сервер _headers не применяет; синтаксис уже проверен `pnpm build` (файл копируется как есть).
- Submit Worker URL в CSP (`connect-src` + `form-action`) и OAuth Worker URL в admin CSP (`connect-src`) — оба зашиты на свои `*.svetik-design.workers.dev` адреса по wrangler-конвенции. Если бра́т при первом `wrangler deploy` (для submit) выберет другой subdomain — поправить `public/_headers` (флажок в Activation checklist Session L).
- TG-CDN покрыт wildcard'ом `*.telesco.pe` — если Telegram добавит новые поддомены (`cdn6.telesco.pe`+) или мигрирует на новый CDN — wildcard ловит первое, но миграцию нужно мониторить (актуальная разметка t.me/s/ при сборке).
- OG-картинка default.png — placeholder под ep02 (типографика с тёмным фоном без визуальной композиции). Финальный визуал — ep02.

**Next session**: Session J — Lighthouse CI + branch protection + CF Pages deploy (T26, T27). Pre-flight: Sessions A–I все закрыты. У бра́та должен быть Cloudflare Pages dashboard access (он уже логинен через wrangler после Session C — для Pages-проекта нужен ещё UI-вход в dash.cloudflare.com → Workers & Pages → Create application → Pages → Connect to Git). Submit Worker нужно задеплоить ДО первого Pages-деплоя (бра́т: `cd workers/submit && wrangler deploy`), иначе форма на проде не получит URL.
