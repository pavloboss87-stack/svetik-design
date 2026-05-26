import { describe, expect, it } from 'vitest';
import {
  compareProjects,
  isPublishedProject,
  sortProjects,
  type ProjectLike,
} from '../../../src/lib/sortProjects';

function mk(
  id: string,
  year: number,
  order?: number,
  published?: boolean,
): ProjectLike & { id: string } {
  return { id, data: { year, order, published } };
}

describe('isPublishedProject', () => {
  it('treats missing published as published (schema default true)', () => {
    expect(isPublishedProject(mk('a', 2024))).toBe(true);
  });
  it('treats published:true as published', () => {
    expect(isPublishedProject(mk('a', 2024, undefined, true))).toBe(true);
  });
  it('excludes published:false', () => {
    expect(isPublishedProject(mk('a', 2024, undefined, false))).toBe(false);
  });
});

describe('compareProjects', () => {
  it('higher order wins over lower order', () => {
    expect(compareProjects(mk('a', 2020, 5), mk('b', 2025, 2))).toBeLessThan(0);
  });
  it('equal orders break ties by newer year', () => {
    expect(compareProjects(mk('a', 2025, 3), mk('b', 2020, 3))).toBeLessThan(0);
  });
  it('project with order beats project without order', () => {
    expect(compareProjects(mk('a', 2020, 1), mk('b', 2025))).toBeLessThan(0);
  });
  it('when neither has order, newer year wins', () => {
    expect(compareProjects(mk('a', 2025), mk('b', 2020))).toBeLessThan(0);
  });
});

describe('sortProjects', () => {
  it('orders by order desc, then year desc; orderless tail by year desc', () => {
    const input = [
      mk('p-a', 2024, 1),
      mk('p-b', 2025, 4),
      mk('p-c', 2023),
      mk('p-d', 2025),
      mk('p-e', 2024, 2),
    ];
    const sorted = sortProjects(input).map((p) => p.id);
    expect(sorted).toEqual(['p-b', 'p-e', 'p-a', 'p-d', 'p-c']);
  });

  it('does not mutate the input array', () => {
    const input = [mk('a', 2024, 1), mk('b', 2025, 2)];
    const before = input.map((p) => p.id).join(',');
    sortProjects(input);
    expect(input.map((p) => p.id).join(',')).toBe(before);
  });

  it('filter then sort: excludes published:false and orders the rest', () => {
    const all = [mk('keep-a', 2025, 1), mk('drop', 2030, 99, false), mk('keep-b', 2024, 2)];
    const result = sortProjects(all.filter(isPublishedProject)).map((p) => p.id);
    expect(result).toEqual(['keep-b', 'keep-a']);
  });
});
