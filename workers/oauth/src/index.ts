// GitHub OAuth proxy for Decap CMS, deployed as a Cloudflare Worker.
//
// Decap CMS popup flow:
//   1) /auth?provider=github&site_id=...&scope=repo
//      → redirect to https://github.com/login/oauth/authorize
//   2) GitHub → /callback?code=...
//      → exchange code for access_token, return HTML page that does the
//        Decap-compatible postMessage handshake with the opener window.
//
// Stateless: client_secret comes from a Worker secret. No KV/D1/R2 bindings.

interface Env {
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
}

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const DEFAULT_SCOPE = 'repo,user';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const scope = url.searchParams.get('scope') || DEFAULT_SCOPE;
      const authUrl = new URL(GITHUB_AUTHORIZE_URL);
      authUrl.searchParams.set('client_id', env.OAUTH_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      authUrl.searchParams.set('scope', scope);
      authUrl.searchParams.set('state', crypto.randomUUID());
      return Response.redirect(authUrl.toString(), 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return renderPopup({ error: 'missing_code' });
      }

      const tokenResp = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'svetik-design-oauth-worker',
        },
        body: JSON.stringify({
          client_id: env.OAUTH_CLIENT_ID,
          client_secret: env.OAUTH_CLIENT_SECRET,
          code,
        }),
      });

      if (!tokenResp.ok) {
        return renderPopup({ error: `token_http_${tokenResp.status}` });
      }

      const tokenData = (await tokenResp.json()) as {
        access_token?: string;
        error?: string;
      };

      if (!tokenData.access_token) {
        return renderPopup({ error: tokenData.error ?? 'no_token' });
      }

      return renderPopup({ token: tokenData.access_token });
    }

    if (url.pathname === '/' || url.pathname === '') {
      return new Response('svetik-design OAuth proxy. See /auth.', {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

function renderPopup(result: { token?: string; error?: string }): Response {
  const status = result.error ? 'error' : 'success';
  const payload = result.error
    ? JSON.stringify(result.error)
    : JSON.stringify({ token: result.token, provider: 'github' });
  const body = `authorization:github:${status}:${payload}`;

  // Two-step handshake matching decap-cms-lib-auth: popup announces
  // "authorizing:github" → opener echoes the SAME string back → popup
  // posts the final "authorization:github:(success|error):<json>" message.
  // (The echo uses the same literal "authorizing:github", not a renamed
  // "authorization:github". One missing 'i' breaks the whole flow.)
  const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Авторизация</title>
<meta name="robots" content="noindex,nofollow">
</head>
<body>
<p>Авторизация завершена. Это окно можно закрыть.</p>
<script>
(function () {
  var payload = ${JSON.stringify(body)};
  var sent = false;
  function send(target, origin) {
    if (sent) return;
    sent = true;
    target.postMessage(payload, origin);
    setTimeout(function () { try { window.close(); } catch (_) {} }, 500);
  }
  function receive(e) {
    if (e.data !== 'authorizing:github' || !e.source) return;
    send(e.source, e.origin || '*');
    window.removeEventListener('message', receive);
  }
  window.addEventListener('message', receive, false);
  if (window.opener) {
    window.opener.postMessage('authorizing:github', '*');
  }
})();
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
