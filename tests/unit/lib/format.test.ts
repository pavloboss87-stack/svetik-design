import { describe, it, expect } from 'vitest';
import { formatArea, formatYear, formatPostDate, localeProjectType } from '../../../src/lib/format';

describe('localeProjectType', () => {
  it('maps each known type to a Russian label', () => {
    expect(localeProjectType('apartment')).toBe('Квартира');
    expect(localeProjectType('house')).toBe('Дом');
    expect(localeProjectType('studio')).toBe('Студия');
    expect(localeProjectType('commercial')).toBe('Коммерческое помещение');
  });

  it('returns unknown types unchanged (graceful fallback)', () => {
    expect(localeProjectType('warehouse')).toBe('warehouse');
  });
});

describe('formatArea', () => {
  it('renders integer square meters with a thin space + м²', () => {
    expect(formatArea(65)).toBe('65 м²');
    expect(formatArea(120.5)).toBe('120.5 м²');
  });

  it('returns empty string for non-finite values', () => {
    expect(formatArea(Number.NaN)).toBe('');
    expect(formatArea(Number.POSITIVE_INFINITY)).toBe('');
  });
});

describe('formatYear', () => {
  it('renders years as bare strings', () => {
    expect(formatYear(2026)).toBe('2026');
  });
});

describe('formatPostDate', () => {
  it('returns Russian-localised long date', () => {
    expect(formatPostDate('2026-01-03T10:00:00+00:00')).toMatch(/3 января 2026/);
  });

  it('returns empty string for an invalid date', () => {
    expect(formatPostDate('not-a-date')).toBe('');
  });
});
