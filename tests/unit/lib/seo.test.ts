import { describe, it, expect } from 'vitest';
import { absoluteOgImage, buildCanonical } from '../../../src/lib/seo';

describe('buildCanonical', () => {
  it('joins site URL and path into an absolute URL', () => {
    expect(buildCanonical('https://svetik-design.pages.dev', '/works')).toBe(
      'https://svetik-design.pages.dev/works',
    );
  });

  it('strips trailing slashes from siteUrl', () => {
    expect(buildCanonical('https://svetik-design.pages.dev/', '/about')).toBe(
      'https://svetik-design.pages.dev/about',
    );
  });

  it('prepends a leading slash to bare paths', () => {
    expect(buildCanonical('https://svetik-design.pages.dev', 'works/project-01')).toBe(
      'https://svetik-design.pages.dev/works/project-01',
    );
  });

  it('returns the bare siteUrl with a trailing slash for /', () => {
    expect(buildCanonical('https://svetik-design.pages.dev', '/')).toBe(
      'https://svetik-design.pages.dev/',
    );
  });
});

describe('absoluteOgImage', () => {
  it('returns absolute https URLs unchanged', () => {
    expect(absoluteOgImage('https://example.com', 'https://cdn.example.com/og.png')).toBe(
      'https://cdn.example.com/og.png',
    );
  });

  it('prefixes site URL for relative paths', () => {
    expect(absoluteOgImage('https://example.com', '/images/og/default.png')).toBe(
      'https://example.com/images/og/default.png',
    );
  });

  it('handles bare paths without leading slash', () => {
    expect(absoluteOgImage('https://example.com', 'images/og/default.png')).toBe(
      'https://example.com/images/og/default.png',
    );
  });
});
