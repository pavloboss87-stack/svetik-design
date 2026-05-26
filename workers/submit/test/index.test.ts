import { beforeEach, describe, expect, it, vi } from 'vitest';

import worker, { _resetRateLimitStoreForTests } from '../src/index.ts';

const SITE_URL = 'https://svetik-design.svetik-design.workers.dev';
const baseEnv = { PUBLIC_SITE_URL: SITE_URL };
const validPayload = {
  name: 'Анна',
  contact: 'anna@example.com',
  message: 'Здравствуйте, хочу обсудить проект.',
  consent: true,
};

interface BuildRequestOptions {
  body?: unknown;
  raw?: string;
  origin?: string | null;
  ip?: string;
  method?: string;
}

function buildRequest(opts: BuildRequestOptions = {}): Request {
  const headers = new Headers();
  if (opts.origin !== null) headers.set('Origin', opts.origin ?? SITE_URL);
  headers.set('CF-Connecting-IP', opts.ip ?? '203.0.113.42');
  const hasBody = opts.raw !== undefined || opts.body !== undefined;
  if (hasBody) headers.set('Content-Type', 'application/json');
  return new Request('https://submit.example.com/api/submit', {
    method: opts.method ?? 'POST',
    headers,
    body: opts.raw ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
  });
}

describe('Submit Worker', () => {
  beforeEach(() => {
    _resetRateLimitStoreForTests();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('mock mode (no secrets)', () => {
    it('returns 200 { ok: true, mock: true } for a valid payload', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const res = await worker.fetch(buildRequest({ body: validPayload }), baseEnv);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true, mock: true });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[mock]'), expect.any(Object));
    });

    it('still enters mock-mode if exactly one secret is missing', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const env = {
        ...baseEnv,
        TELEGRAM_BOT_TOKEN: 'tok',
        OWNER_CHAT_ID: '123',
        SMTP_USER: 'u',
        // SMTP_PASS intentionally missing
      };
      const res = await worker.fetch(buildRequest({ body: validPayload }), env);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true, mock: true });
    });
  });

  describe('validation', () => {
    it('returns 400 consent_required when consent is false', async () => {
      const res = await worker.fetch(
        buildRequest({ body: { ...validPayload, consent: false } }),
        baseEnv,
      );
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: 'consent_required' });
    });

    it('returns 400 consent_required when consent is missing', async () => {
      const withoutConsent: Record<string, unknown> = { ...validPayload };
      delete withoutConsent.consent;
      const res = await worker.fetch(buildRequest({ body: withoutConsent }), baseEnv);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: 'consent_required' });
    });

    it('returns 400 consent_required when consent is a truthy non-boolean', async () => {
      const res = await worker.fetch(
        buildRequest({ body: { ...validPayload, consent: 'yes' } }),
        baseEnv,
      );
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: 'consent_required' });
    });

    it('returns 400 invalid_message when message exceeds 500 chars', async () => {
      const res = await worker.fetch(
        buildRequest({ body: { ...validPayload, message: 'x'.repeat(501) } }),
        baseEnv,
      );
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: 'invalid_message' });
    });

    it('accepts message at exactly 500 chars (boundary)', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const res = await worker.fetch(
        buildRequest({ body: { ...validPayload, message: 'x'.repeat(500) } }),
        baseEnv,
      );
      expect(res.status).toBe(200);
    });

    it('rejects empty name', async () => {
      const res = await worker.fetch(
        buildRequest({ body: { ...validPayload, name: '   ' } }),
        baseEnv,
      );
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe('invalid_name');
    });

    it('rejects contact that is neither email nor @TG handle', async () => {
      const res = await worker.fetch(
        buildRequest({ body: { ...validPayload, contact: 'not-an-email' } }),
        baseEnv,
      );
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe('invalid_contact_format');
    });

    it('accepts @telegram-handle in contact field', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const res = await worker.fetch(
        buildRequest({ body: { ...validPayload, contact: '@svgodesign' } }),
        baseEnv,
      );
      expect(res.status).toBe(200);
    });

    it('returns 400 invalid_json for unparseable body', async () => {
      const res = await worker.fetch(buildRequest({ raw: 'not json at all' }), baseEnv);
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe('invalid_json');
    });

    it('returns 400 invalid_body for null body', async () => {
      const res = await worker.fetch(buildRequest({ body: null }), baseEnv);
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe('invalid_body');
    });
  });

  describe('honeypot', () => {
    it('returns 200 silently when honeypot is filled, with a [honeypot-drop] log distinct from [mock]', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const res = await worker.fetch(
        buildRequest({ body: { ...validPayload, website: 'http://spam.example' } }),
        baseEnv,
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
      expect(logSpy).toHaveBeenCalledWith('[honeypot-drop]', expect.any(Object));
      // crucially: no [mock] warning — the request didn't reach mock-mode logic.
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('drops honeypot before validating consent (no leakage of field rules to bots)', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const res = await worker.fetch(
        buildRequest({
          body: {
            name: '',
            contact: 'bogus',
            message: '',
            consent: false,
            website: 'http://spam.example',
          },
        }),
        baseEnv,
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
      expect(logSpy).toHaveBeenCalledWith('[honeypot-drop]', expect.any(Object));
    });
  });

  describe('rate limit (5/hour per IP)', () => {
    it('allows 5 requests then blocks the 6th from the same IP with 429', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const ip = '198.51.100.7';
      for (let i = 0; i < 5; i++) {
        const res = await worker.fetch(buildRequest({ body: validPayload, ip }), baseEnv);
        expect(res.status).toBe(200);
      }
      const blocked = await worker.fetch(buildRequest({ body: validPayload, ip }), baseEnv);
      expect(blocked.status).toBe(429);
      expect((await blocked.json()).error).toBe('rate_limited');
    });

    it('counts honeypot drops toward the limit (bots cannot bypass via honeypot)', async () => {
      vi.spyOn(console, 'log').mockImplementation(() => {});
      const ip = '198.51.100.8';
      for (let i = 0; i < 5; i++) {
        const res = await worker.fetch(
          buildRequest({ body: { ...validPayload, website: 'spam' }, ip }),
          baseEnv,
        );
        expect(res.status).toBe(200);
      }
      const blocked = await worker.fetch(buildRequest({ body: validPayload, ip }), baseEnv);
      expect(blocked.status).toBe(429);
    });

    it('isolates rate limit per IP', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      for (let i = 0; i < 5; i++) {
        await worker.fetch(buildRequest({ body: validPayload, ip: '198.51.100.9' }), baseEnv);
      }
      const otherIp = await worker.fetch(
        buildRequest({ body: validPayload, ip: '198.51.100.10' }),
        baseEnv,
      );
      expect(otherIp.status).toBe(200);
    });

    it('serialises a concurrent Promise.all burst — exactly one 429 in 6 requests', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const ip = '198.51.100.11';
      const requests = Array.from({ length: 6 }, () =>
        worker.fetch(buildRequest({ body: validPayload, ip }), baseEnv),
      );
      const responses = await Promise.all(requests);
      const statuses = responses.map((r) => r.status).sort();
      expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    });
  });

  describe('CORS', () => {
    it('returns 403 origin_not_allowed when Origin does not match PUBLIC_SITE_URL', async () => {
      const res = await worker.fetch(
        buildRequest({ body: validPayload, origin: 'https://evil.example' }),
        baseEnv,
      );
      expect(res.status).toBe(403);
      expect((await res.json()).error).toBe('origin_not_allowed');
    });

    it('returns 403 when Origin header is absent', async () => {
      const res = await worker.fetch(buildRequest({ body: validPayload, origin: null }), baseEnv);
      expect(res.status).toBe(403);
    });

    it('responds 204 with Allow-Origin to OPTIONS preflight from allowed origin', async () => {
      const res = await worker.fetch(buildRequest({ method: 'OPTIONS' }), baseEnv);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(SITE_URL);
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });

    it('echoes Allow-Origin on POST when origin matches', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const res = await worker.fetch(buildRequest({ body: validPayload }), baseEnv);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(SITE_URL);
    });

    it('rejects non-POST methods with 405', async () => {
      const res = await worker.fetch(buildRequest({ method: 'GET' }), baseEnv);
      expect(res.status).toBe(405);
    });
  });

  describe('real mode (secrets present)', () => {
    const fullEnv = {
      ...baseEnv,
      TELEGRAM_BOT_TOKEN: 'tok',
      OWNER_CHAT_ID: '123',
      SMTP_USER: 'u',
      SMTP_PASS: 'p',
    };

    type FetchArgs = [input: string | URL | Request, init?: RequestInit];

    function stubFetch(impl: (...args: FetchArgs) => Promise<Response>) {
      const mock = vi.fn(impl);
      vi.stubGlobal('fetch', mock);
      return mock;
    }

    it('calls Telegram sendMessage and returns 200 { ok: true }', async () => {
      const fetchMock = stubFetch(
        async () =>
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
      );

      const res = await worker.fetch(buildRequest({ body: validPayload }), fullEnv);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [tgUrl, init] = fetchMock.mock.calls[0];
      expect(tgUrl).toBe('https://api.telegram.org/bottok/sendMessage');
      expect(init?.method).toBe('POST');
      const tgBody = JSON.parse(init?.body as string);
      expect(tgBody.chat_id).toBe('123');
      expect(tgBody.text).toContain('Анна');
      expect(tgBody.text).toContain('anna@example.com');
    });

    it('returns 502 upstream_error when Telegram fails', async () => {
      stubFetch(async () => new Response('fail', { status: 500 }));
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const res = await worker.fetch(buildRequest({ body: validPayload }), fullEnv);
      expect(res.status).toBe(502);
      expect((await res.json()).error).toBe('upstream_error');
    });

    it('HTML-escapes user input before sending to Telegram', async () => {
      const fetchMock = stubFetch(
        async () =>
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
      );

      await worker.fetch(
        buildRequest({
          body: {
            ...validPayload,
            name: '<script>alert(1)</script>',
            message: '<b>injected</b> & friends',
          },
        }),
        fullEnv,
      );

      const [, init] = fetchMock.mock.calls[0];
      const tgBody = JSON.parse(init?.body as string);
      expect(tgBody.text).not.toContain('<script>');
      expect(tgBody.text).toContain('&lt;script&gt;');
      expect(tgBody.text).toContain('&amp; friends');
    });
  });
});
