const PROJECT_TYPE_LABELS = {
  apartment: 'Квартира',
  house: 'Дом',
  studio: 'Студия',
  commercial: 'Коммерческое помещение',
} as const;

export type ProjectType = keyof typeof PROJECT_TYPE_LABELS;

export function localeProjectType(type: string): string {
  if (type in PROJECT_TYPE_LABELS) {
    return PROJECT_TYPE_LABELS[type as ProjectType];
  }
  return type;
}

export function formatArea(n: number): string {
  if (!Number.isFinite(n)) return '';
  return `${n} м²`;
}

export function formatYear(n: number): string {
  return String(n);
}

const POST_DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return POST_DATE_FORMATTER.format(d);
}
