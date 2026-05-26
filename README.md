# svetik-design

Сайт-портфолио дизайнера интерьеров. Astro + Tailwind 4, контент в Markdown
через Decap CMS, прод-деплой — Cloudflare Pages.

> Полная версия README — задача T29 (после стабилизации стека). Сейчас этого
> достаточно, чтобы поднять проект локально.

## Что нужно

- Node 22 или 24 LTS (на `.nvmrc` зафиксирована активная LTS).
- pnpm 9.

```powershell
winget install OpenJS.NodeJS.LTS
npm install -g pnpm@9
```

## Локальный запуск

```powershell
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # сборка в dist/
pnpm preview  # просмотр сборки
```

## Quality gates

```powershell
pnpm lint       # ESLint flat config + plugin-astro
pnpm format     # Prettier (+ prettier-plugin-astro)
pnpm typecheck  # astro check
pnpm test       # vitest (src/lib + workers/*/test)
```

## CI

GitHub Actions workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
запускается на каждый PR и push в `main`. Четыре job'а — каждый отдельный
status-check в GitHub UI:

- `lint` — `pnpm lint` + `pnpm format:check`.
- `typecheck` — `pnpm typecheck` (`astro check`).
- `test` — `pnpm test` (vitest по `src/lib/` и `workers/*/test/`).
- `lighthouse` — `pnpm build` + `treosh/lighthouse-ci-action@v12` против
  `dist/` через встроенный static-сервер. Бюджет — `categories:{performance,
accessibility, best-practices, seo} ≥ 0.95` (mobile preset по умолчанию)
  на 7 публичных маршрутах. Конфиг — [`.lighthouserc.json`](.lighthouserc.json).

E2E (Playwright) добавляется отдельным job'ом в T30 (Session K).

## Branch protection setup (Принцип 3 enforcement)

Lighthouse-бюджет 95+ работает как информационный, пока GitHub не запрещает
прямой push в `main` и merge PR с красными checks. Включается руками владельца
репозитория один раз через GitHub UI:

1. Откройте репозиторий → **Settings → Branches → Add branch protection rule**.
2. **Branch name pattern**: `main`.
3. Поставьте галочки:
   - **Require a pull request before merging** → внутри: **Require approvals = 0**
     (один автор работает в проекте — review-обязательность только мешает; merge
     остаётся за владельцем).
   - **Require status checks to pass before merging** → **Require branches to be
     up to date before merging**.
   - В поле **Status checks that are required** добавьте: `lint`, `typecheck`,
     `test`, `lighthouse`. (Имена должны совпадать с `name:` job'ов из
     [`ci.yml`](.github/workflows/ci.yml). После добавления `e2e` job в T30 —
     дополните список.)
   - **Do not allow bypassing the above settings** (включая admins) — оставьте
     включённым, иначе любой `git push origin main --force` от админа обнуляет
     enforcement.
4. **Create** / **Save changes**.
5. Проверка: `git push origin main` напрямую (без PR) должен отвергаться
   GitHub'ом с сообщением `Protected branch update failed`.

Если защиту нужно временно снять (миграции, ручные исправления) — выключайте
только конкретное правило, не удаляйте всю rule. После — включите обратно.

## Документация

- [docs/vision.md](docs/vision.md) — продуктовый и архитектурный обзор.
- [docs/ep01-portfolio/plan.md](docs/ep01-portfolio/plan.md) — план эпика, decisions.
- [docs/ep01-portfolio/tasks.md](docs/ep01-portfolio/tasks.md) — task list + DoD.
- [CLAUDE.md](CLAUDE.md) — Constitution (immutable principles) + Epics.
- `docs/guide-for-svetlana.md` — гайд по админке (создаётся в T28).
