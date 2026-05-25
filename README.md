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
```

## Документация

- [docs/vision.md](docs/vision.md) — продуктовый и архитектурный обзор.
- [docs/ep01-portfolio/plan.md](docs/ep01-portfolio/plan.md) — план эпика, decisions.
- [docs/ep01-portfolio/tasks.md](docs/ep01-portfolio/tasks.md) — task list + DoD.
- [CLAUDE.md](CLAUDE.md) — Constitution (immutable principles) + Epics.
- `docs/guide-for-svetlana.md` — гайд по админке (создаётся в T28).
