# Execution Progress

## Codebase Patterns

<!-- Reusable patterns discovered during implementation. Keep this section at the top. -->

- **pnpm install on Windows without admin**: `corepack enable` writes shim files into `C:\Program Files\nodejs` and fails with EPERM under a non-elevated shell. Use `npm install -g pnpm@<major>` instead — it writes to `%APPDATA%\npm`, which is user-writable. Refresh `$env:Path` from `Machine` + `User` env vars in the same session before invoking `pnpm`.
- **`pnpm create astro` in a non-empty directory**: the interactive prompt blocks even with `--yes`. Workaround: scaffold into a sibling temp dir (`_astro-tmp/`), move files into the project root, delete the temp dir. Existing tracked source folders (`Portfolio/`, `Contacts/`, `Diplom/`, `docs/`, `CLAUDE.md`) survive intact.
- **Astro CLI version drift vs. plan**: the plan refers to "Astro 5", actual scaffold produces Astro 6.x. Both share the `content collections` + `loader` API; downstream task specs (especially T07 mentioning "Astro 5 — `loader` API") still apply.
- **Tailwind 4 + Astro**: no `tailwind.config.mjs`. Wire-up is (a) `@tailwindcss/vite` plugin in `astro.config.mjs#vite.plugins`, (b) `@import 'tailwindcss';` in a CSS entry file, (c) import that CSS from each page or `Layout.astro`. Theme tokens go inside the CSS file via `@theme { ... }` directives (planned for ep02). No `content` glob — auto-scan via Vite.
- **Astro routing skip rule**: files or directories prefixed with `_` under `src/pages/` are excluded from the route tree (so they are not built). Useful for fragments and partials. For one-off scratch/test pages that need to be built, prefer a non-underscored name (e.g. `temp-foo.astro`) and delete after verification.
- **Sharp as explicit devDep**: even though `sharp` ships transitively with Astro (for image optimization), Node ESM resolution from a sibling script in `scripts/` cannot import it unless it's a top-level dependency. Add `sharp` to `devDependencies` if you need to use it directly in build helpers.
- **Astro 6 + Zod 4 imports for content schemas**: `import { z } from 'astro:content'` is deprecated in Astro 6 (removal flagged for Astro 7) — use `import { z } from 'astro/zod'` together with `import { defineCollection } from 'astro:content'`. In Zod 4 the instance methods `.url()` / `.email()` are deprecated in favour of the top-level constructors `z.url()` / `z.email()`. Both surface as TS hints (severity `hint`, not `warning` or `error`), so `pnpm typecheck` stays green either way — using the new forms keeps the file at 0/0/0.
- **Single-entry settings as a `glob` JSON collection + `z.union`**: when you want `getEntry('settings', 'contacts')` and `getEntry('settings', 'seo')` (one collection, multiple distinct shapes from separate JSON files), use `glob({ pattern: '**/*.json', base: './src/content/settings' })` with `schema: z.union([contactsSchema, seoSchema])`. Each `.json` file becomes one entry whose `id` is its filename without extension. The schemas must have non-overlapping required keys so the union discriminates correctly. Cleaner than per-file `file()` collections — keeps a single collection key and matches Decap's «one file-collection per settings file» layout from plan Step 5.
- **`image()` schema paths are relative to the markdown file, not the project root**: frontmatter like `cover: ../../assets/projects/project-01/01.jpg` resolves when the .md lives at `src/content/projects/project-01.md` and the image at `src/assets/projects/project-01/01.jpg`. Reusing the same path string for `cover` and the first entry of `gallery` does NOT duplicate bytes — Astro+Vite dedupes by resolved path, so `cover === gallery[0]` is a valid pattern for seeding when source has few photos.
- **One-shot placeholder image generators**: `scripts/generate-*-placeholder.mjs` (one per use case) using `sharp(Buffer.from(svg)).jpeg(...).toFile(...)` is the established pattern. Used for apple-touch-icon (T04), `project-01/03.jpg` (T08), and `about/placeholder.jpg` (T09). Idempotent, run once to seed; outputs land under `src/assets/...` and are versioned in git.

## Docs Debt

<!-- Items logged by /my-execute, /my-change, /my-incident. Resolved by /my-sync-docs. -->

## Follow-ups

<!-- Tasks deferred from /my-incident or /my-change that need proper implementation later. -->
