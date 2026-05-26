import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { STOP_LIST_PHRASES, STOP_LIST_PATTERNS, normalizePunct } from './stop-list';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const CONTENT_DIR = resolve(REPO_ROOT, 'src', 'content');

function findMarkdownFiles(root: string): string[] {
  const out: string[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
    }
  }
  walk(root);
  return out;
}

function stripFrontmatter(content: string): string {
  // YAML frontmatter: --- ... ---. Снимаем, чтобы не ловить штампы в технических
  // полях (title / summary тоже проверяет ревью копирайта вручную — см. T12-T18).
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[1] : content;
}

const files = findMarkdownFiles(CONTENT_DIR);

describe('stop-list grep gate (CLAUDE.md Принцип 1)', () => {
  it('finds markdown files under src/content/', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const filepath of files) {
    const rel = relative(REPO_ROOT, filepath).replace(/\\/g, '/');

    it(`${rel} contains no stop-list clichés`, () => {
      const raw = readFileSync(filepath, 'utf8');
      const body = stripFrontmatter(raw);
      const normalized = normalizePunct(body);

      const phraseHits = STOP_LIST_PHRASES.filter((p) => normalized.includes(normalizePunct(p)));
      const patternHits = STOP_LIST_PATTERNS.filter(({ pattern }) => pattern.test(body)).map(
        (h) => h.name,
      );

      const hits = [...phraseHits, ...patternHits];
      expect(hits, `Stop-list match(es) in ${rel}: ${hits.join(' | ')}`).toEqual([]);
    });
  }
});
