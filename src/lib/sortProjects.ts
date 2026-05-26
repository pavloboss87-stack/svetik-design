export type ProjectLike = {
  data: {
    year: number;
    order?: number;
    published?: boolean;
  };
};

export function isPublishedProject<T extends ProjectLike>(p: T): boolean {
  return p.data.published !== false;
}

export function compareProjects<T extends ProjectLike>(a: T, b: T): number {
  const ao = a.data.order;
  const bo = b.data.order;
  const aHas = typeof ao === 'number';
  const bHas = typeof bo === 'number';
  if (aHas && bHas) {
    if (ao !== bo) return (bo as number) - (ao as number);
    return b.data.year - a.data.year;
  }
  if (aHas) return -1;
  if (bHas) return 1;
  return b.data.year - a.data.year;
}

export function sortProjects<T extends ProjectLike>(projects: readonly T[]): T[] {
  return [...projects].sort(compareProjects);
}
