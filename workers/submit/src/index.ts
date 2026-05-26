// Submit Worker for svetik-design contact form.
//
// POST /api/submit — validates payload, enforces 152-ФЗ consent + honeypot +
// rate-limit, forwards to Telegram Bot. SMTP email copy is reserved for ep03.
//
// Mock-mode: if any of TELEGRAM_BOT_TOKEN / OWNER_CHAT_ID / SMTP_USER / SMTP_PASS
// is missing, returns 200 { ok: true, mock: true } + console.warn — the form
// keeps working on staging without exposing the sister's bot credentials.

interface Env {
  PUBLIC_SITE_URL: string;
  TELEGRAM_BOT_TOKEN?: string;
  OWNER_CHAT_ID?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
}

interface SubmitPayload {
  name: string;
  contact: string;
  message: string;
  consent: true;
  website?: string;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const TG_HANDLE_RE = /^@[a-zA-Z0-9_]{4,32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Per-isolate in-memory counter. Atomic within an isolate (single-threaded JS),
// which is enough for the concurrent-burst acceptance test. Cross-isolate state
// is intentionally not synchronised — a portfolio site has far too little
// traffic to make a multi-POP burst attack worth the engineering of KV/DO.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function _resetRateLimitStoreForTests(): void {
  rateLimitStore.clear();
}

function incrementRateLimit(ip: string, now: number): { allowed: boolean } {
  const entry = rateLimitStore.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false };
  }
  entry.count += 1;
  return { allowed: true };
}

function corsHeaders(origin: string | null, allowed: string): Record<string, string> {
  const matched = origin && origin === allowed;
  return {
    'Access-Control-Allow-Origin': matched ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...cors,
    },
  });
}

type ValidationResult = { ok: true; value: SubmitPayload } | { ok: false; error: string };

function validatePayload(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'invalid_body' };
  const r = raw as Record<string, unknown>;

  // Consent first: 152-ФЗ requires an explicit boolean true. Missing or false
  // is a hard rejection, not a generic invalid_body — the front-end shows a
  // specific message and the server log is unambiguous.
  if (r.consent !== true) return { ok: false, error: 'consent_required' };

  const { name, contact, message } = r;
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return { ok: false, error: 'invalid_name' };
  }
  if (typeof contact !== 'string' || contact.trim().length === 0 || contact.length > 100) {
    return { ok: false, error: 'invalid_contact' };
  }
  const contactTrim = contact.trim();
  if (!(EMAIL_RE.test(contactTrim) || TG_HANDLE_RE.test(contactTrim))) {
    return { ok: false, error: 'invalid_contact_format' };
  }
  if (typeof message !== 'string' || message.trim().length === 0 || message.length > 500) {
    return { ok: false, error: 'invalid_message' };
  }

  const website = typeof r.website === 'string' ? r.website : undefined;

  return {
    ok: true,
    value: {
      name: name.trim(),
      contact: contactTrim,
      message: message.trim(),
      consent: true,
      website,
    },
  };
}

function isMockMode(env: Env): boolean {
  return !env.TELEGRAM_BOT_TOKEN || !env.OWNER_CHAT_ID || !env.SMTP_USER || !env.SMTP_PASS;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sendTelegram(env: Env, payload: SubmitPayload): Promise<void> {
  const text =
    `<b>Новая заявка с сайта</b>\n\n` +
    `<b>Имя:</b> ${escapeHtml(payload.name)}\n` +
    `<b>Контакт:</b> ${escapeHtml(payload.contact)}\n\n` +
    `${escapeHtml(payload.message)}`;
  const resp = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.OWNER_CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!resp.ok) {
    throw new Error(`telegram_http_${resp.status}`);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, env.PUBLIC_SITE_URL);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405, cors);
    }

    if (!origin || origin !== env.PUBLIC_SITE_URL) {
      return jsonResponse({ ok: false, error: 'origin_not_allowed' }, 403, cors);
    }

    const ip =
      request.headers.get('CF-Connecting-IP') ||
      request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
      '0.0.0.0';
    const rl = incrementRateLimit(ip, Date.now());
    if (!rl.allowed) {
      return jsonResponse({ ok: false, error: 'rate_limited' }, 429, cors);
    }

    let parsed: unknown;
    try {
      parsed = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: 'invalid_json' }, 400, cors);
    }

    // Honeypot first — silently succeed even if other fields fail validation.
    // A bot probing for the field name learns nothing from a 400 here.
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof (parsed as Record<string, unknown>).website === 'string' &&
      ((parsed as Record<string, unknown>).website as string).length > 0
    ) {
      console.log('[honeypot-drop]', { ip });
      return jsonResponse({ ok: true }, 200, cors);
    }

    const v = validatePayload(parsed);
    if (!v.ok) {
      return jsonResponse({ ok: false, error: v.error }, 400, cors);
    }

    if (isMockMode(env)) {
      console.warn('[mock] submit accepted without delivery — secrets unset', { ip });
      return jsonResponse({ ok: true, mock: true }, 200, cors);
    }

    try {
      await sendTelegram(env, v.value);
      // Email copy via SMTP is a TODO for ep03 — see workers/submit/README.md.
      return jsonResponse({ ok: true }, 200, cors);
    } catch (err) {
      console.error('[submit-error]', err);
      return jsonResponse({ ok: false, error: 'upstream_error' }, 502, cors);
    }
  },
};
