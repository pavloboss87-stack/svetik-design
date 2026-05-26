import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  fetchTelegramFeed,
  parseFeedHtml,
  sanitizeText,
  safeHttpsUrl,
} from '../../../src/lib/telegram-feed';

const FIXTURE_HTML = `<!doctype html>
<html><body>
<section>
  <div class="tgme_widget_message" data-post="test_channel/1">
    <a class="tgme_widget_message_date" href="https://t.me/test_channel/1">
      <time datetime="2026-01-01T10:00:00+00:00"></time>
    </a>
    <div class="tgme_widget_message_photo_wrap"
         style="background-image:url('https://cdn4.cdn-telegram.org/file/photo-1.jpg')"></div>
    <div class="tgme_widget_message_text">Первый пост — короткий текст.</div>
  </div>
  <div class="tgme_widget_message" data-post="test_channel/2">
    <a class="tgme_widget_message_date" href="https://t.me/test_channel/2">
      <time datetime="2026-01-02T10:00:00+00:00"></time>
    </a>
    <div class="tgme_widget_message_text">Второй пост, без картинки.</div>
  </div>
  <div class="tgme_widget_message" data-post="test_channel/3">
    <a class="tgme_widget_message_date" href="https://t.me/test_channel/3">
      <time datetime="2026-01-03T10:00:00+00:00"></time>
    </a>
    <div class="tgme_widget_message_text">Третий пост<script>alert("xss")</script> с инъекцией.</div>
  </div>
</section>
</body></html>`;

const FIXTURE_NO_TIME = `<!doctype html><html><body>
<div class="tgme_widget_message">
  <a class="tgme_widget_message_date" href="https://t.me/test_channel/9"></a>
  <div class="tgme_widget_message_text">Пост без datetime</div>
</div>
</body></html>`;

const FIXTURE_JS_HREF = `<!doctype html><html><body>
<div class="tgme_widget_message">
  <a class="tgme_widget_message_date" href="javascript:alert(1)">
    <time datetime="2026-02-01T00:00:00+00:00"></time>
  </a>
  <div class="tgme_widget_message_text">Опасная ссылка</div>
</div>
</body></html>`;

const FIXTURE_HTTP_PICTURE = `<!doctype html><html><body>
<div class="tgme_widget_message">
  <a class="tgme_widget_message_date" href="https://t.me/test_channel/5">
    <time datetime="2026-02-02T00:00:00+00:00"></time>
  </a>
  <div class="tgme_widget_message_photo_wrap" style="background-image:url('http://insecure-cdn/photo.jpg')"></div>
  <div class="tgme_widget_message_text">С http-картинкой</div>
</div>
</body></html>`;

const FIXTURE_IMG_ONERROR = `<!doctype html><html><body>
<div class="tgme_widget_message">
  <a class="tgme_widget_message_date" href="https://t.me/test_channel/7">
    <time datetime="2026-03-01T00:00:00+00:00"></time>
  </a>
  <div class="tgme_widget_message_text">Текст с <img src=x onerror="alert(1)"> картинкой</div>
</div>
</body></html>`;

describe('sanitizeText', () => {
  it('strips ASCII control characters except newline and tab', () => {
    const input = 'a\x00b\x07c\x0Bd\x1Fe\x7Ff';
    expect(sanitizeText(input)).toBe('abcdef');
  });

  it('preserves newlines and collapses inline whitespace', () => {
    expect(sanitizeText('  hello   world\n\nsecond  line  ')).toBe('hello world\n\nsecond line');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(sanitizeText('   \t\n  ')).toBe('');
  });
});

describe('safeHttpsUrl', () => {
  it('accepts https URLs', () => {
    expect(safeHttpsUrl('https://example.com/a')).toBe('https://example.com/a');
  });

  it('rejects http, javascript and data URLs', () => {
    expect(safeHttpsUrl('http://example.com')).toBeNull();
    expect(safeHttpsUrl('javascript:alert(1)')).toBeNull();
    expect(safeHttpsUrl('data:text/html,<script>')).toBeNull();
  });

  it('rejects null/empty/garbage', () => {
    expect(safeHttpsUrl(null)).toBeNull();
    expect(safeHttpsUrl(undefined)).toBeNull();
    expect(safeHttpsUrl('')).toBeNull();
    expect(safeHttpsUrl('not-a-url')).toBeNull();
  });
});

describe('parseFeedHtml', () => {
  it('parses three posts from fixture HTML newest first', () => {
    const posts = parseFeedHtml(FIXTURE_HTML, 5);
    expect(posts).toHaveLength(3);
    expect(posts[0].date).toBe('2026-01-03T10:00:00+00:00');
    expect(posts[1].date).toBe('2026-01-02T10:00:00+00:00');
    expect(posts[2].date).toBe('2026-01-01T10:00:00+00:00');
    expect(posts[2].picture).toBe('https://cdn4.cdn-telegram.org/file/photo-1.jpg');
    expect(posts[1].picture).toBeNull();
    expect(posts[0].permalink).toBe('https://t.me/test_channel/3');
  });

  it('respects the limit argument', () => {
    const posts = parseFeedHtml(FIXTURE_HTML, 2);
    expect(posts).toHaveLength(2);
    expect(posts[0].date).toBe('2026-01-03T10:00:00+00:00');
  });

  it('strips raw <script> tags from post text (XSS payload)', () => {
    const posts = parseFeedHtml(FIXTURE_HTML, 5);
    const third = posts.find((p) => p.date === '2026-01-03T10:00:00+00:00')!;
    expect(third.text).not.toContain('<script>');
    expect(third.text).not.toContain('</script>');
    expect(third.text).toContain('Третий пост');
    expect(third.text).toContain('с инъекцией');
  });

  it('strips raw <img onerror> attributes from post text', () => {
    const posts = parseFeedHtml(FIXTURE_IMG_ONERROR, 5);
    expect(posts).toHaveLength(1);
    expect(posts[0].text).not.toContain('<img');
    expect(posts[0].text).not.toContain('onerror');
    expect(posts[0].text).toContain('Текст с');
    expect(posts[0].text).toContain('картинкой');
  });

  it('drops a post whose permalink href is a javascript: URL', () => {
    const posts = parseFeedHtml(FIXTURE_JS_HREF, 5);
    expect(posts).toEqual([]);
  });

  it('drops a post whose picture URL is non-https', () => {
    const posts = parseFeedHtml(FIXTURE_HTTP_PICTURE, 5);
    expect(posts).toEqual([]);
  });

  it('drops a post that lacks a <time datetime> attribute', () => {
    const posts = parseFeedHtml(FIXTURE_NO_TIME, 5);
    expect(posts).toEqual([]);
  });

  it('returns [] for empty input', () => {
    expect(parseFeedHtml('', 5)).toEqual([]);
  });

  it('returns [] for HTML without any messages', () => {
    expect(parseFeedHtml('<html><body><p>nothing</p></body></html>', 5)).toEqual([]);
  });
});

describe('fetchTelegramFeed', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed posts when fetcher succeeds', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => FIXTURE_HTML,
    } as unknown as Response);
    const posts = await fetchTelegramFeed('test_channel', 5, fetcher as typeof fetch);
    expect(fetcher).toHaveBeenCalledWith(
      'https://t.me/s/test_channel',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(posts).toHaveLength(3);
  });

  it('returns [] when fetcher throws (graceful fail)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetcher = vi.fn().mockRejectedValue(new Error('network down'));
    const posts = await fetchTelegramFeed('test_channel', 5, fetcher as typeof fetch);
    expect(posts).toEqual([]);
    expect(warn).toHaveBeenCalled();
  });

  it('returns [] when response is non-OK', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => '',
    } as unknown as Response);
    const posts = await fetchTelegramFeed('test_channel', 5, fetcher as typeof fetch);
    expect(posts).toEqual([]);
  });

  it('returns [] for an empty channel', async () => {
    const fetcher = vi.fn();
    const posts = await fetchTelegramFeed('', 5, fetcher as typeof fetch);
    expect(posts).toEqual([]);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
