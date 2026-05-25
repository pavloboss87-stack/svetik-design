# Execution Log — ep01-portfolio

<!-- Task completion entries appended by /my-execute -->

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

