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

