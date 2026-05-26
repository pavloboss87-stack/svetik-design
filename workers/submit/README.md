# Submit Worker — `svetik-design-submit`

Cloudflare Worker под форму заявок с сайта. Принимает `POST /api/submit`,
валидирует payload, проверяет 152-ФЗ consent + honeypot + rate-limit,
переправляет в Telegram. ~200 строк, без KV/D1/R2 — состояние rate-limit
живёт в памяти per-isolate.

## Что делает

| Шаг                      | Поведение                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| OPTIONS preflight        | 204 + CORS-заголовки, если `Origin === PUBLIC_SITE_URL`                                                       |
| Origin mismatch          | 403 `origin_not_allowed`                                                                                      |
| Rate-limit hit           | 429 `rate_limited` после 5 запросов с одного IP за час                                                        |
| Невалидный JSON          | 400 `invalid_json`                                                                                            |
| Honeypot заполнен        | 200 `{ ok: true }`, лог `[honeypot-drop]` — silently drop                                                     |
| Нет `consent: true`      | 400 `consent_required`                                                                                        |
| Другая валидация         | 400 `invalid_name` / `invalid_contact` / `invalid_contact_format` / `invalid_message` / `invalid_body`        |
| Mock-mode (нет секретов) | 200 `{ ok: true, mock: true }` + `console.warn '[mock]'` — формa на сайте показывает «Заявка отправлена»      |
| Боевой режим             | POST в `api.telegram.org/bot<token>/sendMessage`; на 200 — 200 `{ ok: true }`, на сбой — 502 `upstream_error` |

SMTP-копия email — TODO для ep03. В коде секреты `SMTP_USER` / `SMTP_PASS`
учитываются только для определения mock-mode; фактическая отправка не
реализована (Cloudflare Workers не имеют прямого Node SMTP API; решение —
MailChannels или внешний HTTP-сервис — выбирается при активации).

## Развёртывание (бра́т, один раз)

Все команды — из этой директории (`workers/submit/`).

### 1. wrangler

Если ещё не установлен глобально:

```powershell
npm install -g wrangler@4
wrangler --version    # ≥4
wrangler login         # если ещё не залогинен в этом терминале
wrangler whoami        # подтвердит account_id
```

`account_id` в `wrangler.toml` уже прописан — `9b7219916a409f8774e11265b2d069da`. Если у тебя другой аккаунт — поправь.

### 2. Деплой в mock-mode (можно прямо сейчас)

```powershell
wrangler deploy
```

Вывод покажет URL вида:

```
Published svetik-design-submit (X.XX sec)
  https://svetik-design-submit.<your-handle>.workers.dev
```

В этом состоянии все валидные заявки получают 200 `{ ok: true, mock: true }` —
форма на сайте работает «как-будто», бот не нужен. Этого достаточно для
Session H (ContactForm wiring) и Session J (превью-деплой).

### 3. Активация боевого режима (потом, по гайду сестры)

Сестре в `docs/guide-for-svetlana.md` будет инструкция:

1. Создать Telegram-бота через [@BotFather](https://t.me/BotFather), получить
   токен.
2. Узнать свой `chat_id` через [@userinfobot](https://t.me/userinfobot).
3. Создать почту на yandex.ru, получить **пароль приложения** для SMTP
   (https://id.yandex.ru/security/app-passwords).

Затем (из этой же директории):

```powershell
wrangler secret put TELEGRAM_BOT_TOKEN   # вставить токен от BotFather
wrangler secret put OWNER_CHAT_ID        # вставить chat_id (целое число)
wrangler secret put SMTP_USER            # логин yandex (your@yandex.ru)
wrangler secret put SMTP_PASS            # пароль приложения yandex (не логин-пароль!)
wrangler deploy                          # redeploy чтобы Worker увидел секреты
```

После этого Worker автоматически выходит из mock-mode. Никаких изменений в
коде не нужно. Если хоть один из 4-х секретов снова станет недоступен —
Worker возвращается в mock-mode.

### 4. Сообщи URL Worker'а Claude / положи в Pages env

Чтобы фронт знал, куда стучаться, в **Cloudflare Pages → Settings → Environment
variables** (для проекта `svetik-design`) нужно прописать:

```
PUBLIC_SUBMIT_URL = https://svetik-design-submit.<your-handle>.workers.dev/api/submit
```

Эту строку положи в чат — Claude вставит её в Session H (ContactForm) и
Session J (CF Pages env).

## Тесты

Запускаются из корня репозитория:

```powershell
pnpm test
```

> Примечание: бриф T23 ссылается на `cd workers/submit && pnpm test`. По
> факту вся проектная инфраструктура (vitest, eslint, prettier) живёт на
> корне без pnpm-workspace — это проще одного автора и соответствует
> Принципу 6. Тесты воркера всё равно изолированы в `workers/submit/test/` и
> запускаются конкретно через тот же `pnpm test`.

Покрытие (`workers/submit/test/index.test.ts`, 26 кейсов):

- mock-mode (все секреты пусты / частичный набор)
- валидация: consent missing/false/non-boolean; пустое имя; message >500; контакт
  без email/TG-формата; невалидный JSON; null body
- honeypot: 200 silently + лог `[honeypot-drop]` ≠ `[mock]`; не утечёт даже
  при невалидных остальных полях
- rate-limit: 5+1 последовательных от одного IP; honeypot тоже считается;
  per-IP изоляция; **concurrent burst** через `Promise.all(6)` — ровно один 429
- CORS: 403 на чужой Origin / без Origin; 204 на OPTIONS; echo Allow-Origin
  на POST; 405 на GET
- боевой режим: вызов `api.telegram.org/bot<token>/sendMessage` с правильным
  телом; 502 при сбое Telegram; HTML-escape пользовательских полей перед
  отправкой (защита от инъекций в HTML-mode сообщения)

## Проверка вручную (без браузера)

После деплоя в mock-mode:

```powershell
# Mock 200
curl.exe -X POST `
  -H "Origin: https://svetik-design.pages.dev" `
  -H "Content-Type: application/json" `
  -d '{"name":"x","contact":"x@x.x","message":"x","consent":true}' `
  https://svetik-design-submit.<your-handle>.workers.dev/api/submit

# 400 consent_required
curl.exe -X POST `
  -H "Origin: https://svetik-design.pages.dev" `
  -H "Content-Type: application/json" `
  -d '{"name":"x","contact":"x@x.x","message":"x"}' `
  https://svetik-design-submit.<your-handle>.workers.dev/api/submit

# 403 origin_not_allowed
curl.exe -X POST `
  -H "Origin: https://evil.example" `
  -H "Content-Type: application/json" `
  -d '{"name":"x","contact":"x@x.x","message":"x","consent":true}' `
  https://svetik-design-submit.<your-handle>.workers.dev/api/submit
```

## Обновление кода

Любые правки в `src/index.ts` → `wrangler deploy` из `workers/submit/`. CF
Pages не пересобирается (Worker и Pages — независимые артефакты).

## Архитектурные заметки

- **Rate-limit per-isolate.** В CF Workers каждый POP может крутить
  независимый isolate; общий счётчик потребует Durable Object или KV
  (eventually-consistent → race-prone, не атомарно). Для портфолио-сайта с
  десятками заявок в неделю реальная нагрузка близка к нулю; per-isolate
  Map покрывает sequential burst и concurrent burst внутри одного isolate
  — этого достаточно. Если в будущем эпике появится реальная DDoS-атака, мигрируем
  на Durable Object (Принцип 6 — не оптимизируем то, что ещё не болит).
- **Honeypot перед валидацией.** Бот, заполнивший поле `website`, получает
  200 без подсказок про consent или формат — он не узнаёт, что был отброшен.
- **Honeypot считается в rate-limit.** Иначе бот мог бы безлимитно дёргать
  endpoint, узнавая структуру через timing-атаки.
- **HTML-escape пользовательских полей.** Telegram-сообщение посылается
  с `parse_mode: 'HTML'`. Если в `name` или `message` приходит литералный
  `<b>` или `<script>`, escape превращает их в `&lt;b&gt;` — иначе тело
  заявки сломает рендер в Telegram (а в худшем сценарии — приведёт к
  отказу sendMessage с 400).
