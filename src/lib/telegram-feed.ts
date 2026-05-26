import { parseHTML } from 'linkedom';

export type TelegramPost = {
  text: string;
  picture: string | null;
  date: string;
  permalink: string;
};

const FETCH_TIMEOUT_MS = 5000;

function isStrippableControl(cp: number): boolean {
  // Strip C0 control chars and DEL, but preserve \t (0x09) and \n (0x0A).
  if (cp <= 0x08) return true;
  if (cp === 0x0b || cp === 0x0c) return true;
  if (cp >= 0x0e && cp <= 0x1f) return true;
  if (cp === 0x7f) return true;
  return false;
}

export function sanitizeText(raw: string): string {
  let cleaned = '';
  for (const ch of raw) {
    const cp = ch.codePointAt(0);
    if (cp !== undefined && isStrippableControl(cp)) continue;
    cleaned += ch;
  }
  return cleaned
    .replace(/[ \t]+/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

export function safeHttpsUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

function extractBackgroundImageUrl(styleAttr: string | null | undefined): string | null {
  if (!styleAttr) return null;
  const m = /background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i.exec(styleAttr);
  return m ? m[1] : null;
}

type DomNode = {
  querySelector(sel: string): DomNode | null;
  querySelectorAll(sel: string): ArrayLike<DomNode>;
  getAttribute(name: string): string | null;
  textContent: string | null;
};

function parsePost(node: DomNode): TelegramPost | null {
  const dateAnchor = node.querySelector('.tgme_widget_message_date');
  if (!dateAnchor) return null;

  const permalink = safeHttpsUrl(dateAnchor.getAttribute('href'));
  if (!permalink) return null;

  const timeEl = dateAnchor.querySelector('time');
  const date = timeEl?.getAttribute('datetime');
  if (!date) return null;

  const textEl = node.querySelector('.tgme_widget_message_text');
  const text = sanitizeText(textEl?.textContent ?? '');

  const photoEl = node.querySelector('.tgme_widget_message_photo_wrap');
  const rawPicture = extractBackgroundImageUrl(photoEl?.getAttribute('style'));
  const picture = rawPicture ? safeHttpsUrl(rawPicture) : null;
  if (rawPicture && !picture) return null;

  if (!text && !picture) return null;

  return { text, picture, date, permalink };
}

export function parseFeedHtml(html: string, limit = 5): TelegramPost[] {
  if (!html || typeof html !== 'string') return [];
  let document;
  try {
    document = parseHTML(html).document;
  } catch (err) {
    console.warn('[telegram-feed] parse failed:', err);
    return [];
  }
  const nodes = document.querySelectorAll('.tgme_widget_message');
  const collected: TelegramPost[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const post = parsePost(nodes[i] as unknown as DomNode);
    if (post) collected.push(post);
  }
  return collected.reverse().slice(0, limit);
}

export async function fetchTelegramFeed(
  channel: string,
  limit = 5,
  fetcher: typeof fetch = fetch,
): Promise<TelegramPost[]> {
  if (!channel) return [];
  const url = `https://t.me/s/${encodeURIComponent(channel)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let html: string;
  try {
    const res = await fetcher(url, { signal: controller.signal });
    if (!res.ok) {
      console.warn(`[telegram-feed] non-OK response from ${url}: ${res.status}`);
      return [];
    }
    html = await res.text();
  } catch (err) {
    console.warn(`[telegram-feed] fetch failed for ${url}:`, err);
    return [];
  } finally {
    clearTimeout(timer);
  }
  return parseFeedHtml(html, limit);
}
