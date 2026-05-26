/**
 * Стоп-лист штампов копирайта.
 *
 * Источник истины — CLAUDE.md → Принцип 1. Этот файл — машиночитаемая копия,
 * с которой работает `stop-list.spec.ts` (T26). Пополнять — одной строкой;
 * если новая фраза появляется в Принципе 1, дублируем её сюда.
 *
 * Сравнение — case-insensitive, после нормализации пунктуации (см.
 * normalizePunct). em/en-dash и nbsp нормализуются к ASCII-аналогам, поэтому
 * фразы в массиве можно писать обычными пробелами и дефисами.
 */

export const STOP_LIST_PHRASES: readonly string[] = [
  'уют и функциональность',
  'создаём пространства, в которых хочется жить',
  'стиль и комфорт',
  'ваш дом мечты',
  'индивидуальный подход',
  'превращаем в произведение искусства',
  'это больше чем дизайн',
] as const;

// Регекс для шаблона «не просто X, а Y» собираем строкой с unicode-escape'ами,
// чтобы исходник оставался ASCII-чистым и не пугал no-irregular-whitespace.
// Пунктуация-разделитель: запятая, em-dash U+2014, en-dash U+2013, ASCII hyphen.
const NE_PROSTO_RE = new RegExp(
  'не\\s+просто\\s+\\S[^.!?\\n]*?\\s+(?:[,\\u2014\\u2013-]\\s*)?а\\s+\\S',
  'iu',
);

/**
 * Шаблонные конструкции, которые не сводятся к точной фразе. Регексы матчатся
 * против оригинального текста (без нормализации) — внутри сами учитывают
 * варианты пунктуации.
 */
export const STOP_LIST_PATTERNS: readonly { name: string; pattern: RegExp }[] = [
  { name: 'не просто X, а Y', pattern: NE_PROSTO_RE },
];

// Все нестандартные пробелы и тире сводим к ASCII перед фразовым сравнением.
// Через new RegExp(string, flags) — чтобы исходник был ASCII-чист и линтер
// не ругался на literal-irregular-whitespace.
//   U+2014 em-dash, U+2013 en-dash, U+2212 minus → -
//   U+00A0 nbsp, U+2009 thin, U+200A hair, U+200B zero-width, U+202F narrow nbsp → ' '
const DASH_VARIANTS = new RegExp('[\\u2014\\u2013\\u2212]', 'g');
const SPACE_VARIANTS = new RegExp('[\\u00A0\\u2009\\u200A\\u200B\\u202F]', 'g');

/**
 * Нормализация пунктуации перед фразовым сравнением.
 *
 * Кавычки не нормализуем — штампы из текущего списка от них не зависят.
 */
export function normalizePunct(s: string): string {
  return s
    .replace(DASH_VARIANTS, '-')
    .replace(SPACE_VARIANTS, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}
