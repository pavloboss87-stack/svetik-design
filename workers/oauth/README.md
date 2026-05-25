# OAuth Worker — `svetik-design-oauth`

GitHub OAuth proxy для Decap CMS. Stateless, ~60 строк, без KV/D1/R2.

## Что это и зачем

Decap CMS в админке (`/admin/`) логинит редактора в GitHub и получает access-token, чтобы коммитить изменения контента в репо. GitHub OAuth требует, чтобы Client Secret хранился на сервере (не во фронте). Этот Worker — тот «сервер»: принимает редирект от Decap, обменивает `code` на токен, возвращает токен в окно Decap через `postMessage`.

## Развёртывание (бра́т, один раз)

Все команды — из этой директории (`workers/oauth/`).

### 1. Установи wrangler глобально (если ещё не стоит)

```powershell
npm install -g wrangler@4
wrangler --version    # должно показать ≥4
```

### 2. Логин в Cloudflare

```powershell
wrangler login        # откроет браузер, нужно Allow
wrangler whoami       # подтвердит email и account_id
```

`account_id` в `wrangler.toml` уже прописан — `9b7219916a409f8774e11265b2d069da`. Если у тебя другой аккаунт — поправь.

### 3. Положи Client Secret в Worker secrets

**Никогда** не клади Client Secret в `wrangler.toml`, в `.env`, в чат или в коммит. Только через интерактивный `wrangler secret put`:

```powershell
wrangler secret put OAUTH_CLIENT_SECRET
# wrangler спросит значение → вставь Client Secret из GitHub OAuth App
```

`OAUTH_CLIENT_ID` (`Ov23li2njCS1gRivex1E`) лежит в `wrangler.toml` в `[vars]` — это публичная часть, в коммит можно.

### 4. Деплой

```powershell
wrangler deploy
```

Вывод покажет URL вида:

```
Published svetik-design-oauth (X.XX sec)
  https://svetik-design-oauth.<your-handle>.workers.dev
Current Deployment ID: ...
```

Скопируй этот URL — он понадобится в шагах 5–6.

> Если wrangler пожалуется на «Workers subdomain not set» — открой [CF dashboard → Workers & Pages → Subdomain](https://dash.cloudflare.com/) и выбери имя поддомена (это разовая операция на аккаунт). После — `wrangler deploy` ещё раз.

### 5. Обнови Authorization callback URL в GitHub OAuth App

GitHub → Settings → Developer settings → OAuth Apps → `svetik-design admin` → Edit.

В поле **Authorization callback URL** замени плейсхолдер на:

```
https://svetik-design-oauth.<your-handle>.workers.dev/callback
```

Сохрани.

### 6. Сообщи URL Worker'а Claude

Чтобы T13 закрылся, Claude должен вписать `base_url` в `public/admin/config.yml`. Скажи в чат: «Worker URL = `https://svetik-design-oauth.<your-handle>.workers.dev`».

## Проверка вручную (без Decap)

```powershell
curl -I "https://svetik-design-oauth.<your-handle>.workers.dev/auth?provider=github&scope=repo"
# Ожидаем 302 на github.com/login/oauth/authorize
```

## Обновление кода Worker'а

Любые правки в `src/index.ts` → `wrangler deploy` (без пересборки CF Pages, это отдельный артефакт).

## Что внутри

| Маршрут                                | Назначение                                                        |
| -------------------------------------- | ----------------------------------------------------------------- |
| `GET /auth?provider=github&scope=repo` | редирект на GitHub OAuth authorize                                |
| `GET /callback?code=...`               | обмен code → token, постит токен в окно Decap через `postMessage` |
| `GET /`                                | человекочитаемая заглушка                                         |
| иное                                   | 404                                                               |

Совместимо с Decap CMS 3.x (двухступенчатый handshake `authorizing:github` → `authorization:github:success:{token}`).
