# Execution Progress

## Codebase Patterns

<!-- Reusable patterns discovered during implementation. Keep this section at the top. -->

- **pnpm install on Windows without admin**: `corepack enable` writes shim files into `C:\Program Files\nodejs` and fails with EPERM under a non-elevated shell. Use `npm install -g pnpm@<major>` instead — it writes to `%APPDATA%\npm`, which is user-writable. Refresh `$env:Path` from `Machine` + `User` env vars in the same session before invoking `pnpm`.
- **`pnpm create astro` in a non-empty directory**: the interactive prompt blocks even with `--yes`. Workaround: scaffold into a sibling temp dir (`_astro-tmp/`), move files into the project root, delete the temp dir. Existing tracked source folders (`Portfolio/`, `Contacts/`, `Diplom/`, `docs/`, `CLAUDE.md`) survive intact.
- **Astro CLI version drift vs. plan**: the plan refers to "Astro 5", actual scaffold produces Astro 6.x. Both share the `content collections` + `loader` API; downstream task specs (especially T07 mentioning "Astro 5 — `loader` API") still apply.
- **Tailwind 4 + Astro**: no `tailwind.config.mjs`. Wire-up is (a) `@tailwindcss/vite` plugin in `astro.config.mjs#vite.plugins`, (b) `@import 'tailwindcss';` in a CSS entry file, (c) import that CSS from each page or `Layout.astro`. Theme tokens go inside the CSS file via `@theme { ... }` directives (planned for ep02). No `content` glob — auto-scan via Vite.
- **Astro routing skip rule**: files or directories prefixed with `_` under `src/pages/` are excluded from the route tree (so they are not built). Useful for fragments and partials. For one-off scratch/test pages that need to be built, prefer a non-underscored name (e.g. `temp-foo.astro`) and delete after verification.
- **Sharp as explicit devDep**: even though `sharp` ships transitively with Astro (for image optimization), Node ESM resolution from a sibling script in `scripts/` cannot import it unless it's a top-level dependency. Add `sharp` to `devDependencies` if you need to use it directly in build helpers.

## Docs Debt

<!-- Items logged by /my-execute, /my-change, /my-incident. Resolved by /my-sync-docs. -->

## Follow-ups

<!-- Tasks deferred from /my-incident or /my-change that need proper implementation later. -->
