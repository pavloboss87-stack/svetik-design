// T04 fonttools-инспекция PT Serif. Запуск разовый:
//   pnpm dlx fontkit-cli ... (не нужен — этот скрипт сам использует fontkit как deps)
// Здесь — проверка покрытия кириллицы по фактическим woff2-файлам пакета @fontsource/pt-serif.
//
// Не нужно как часть build/test pipeline — структурный stop-loss в виде one-shot script.
// Результат журналируется в docs/ep02-design-and-copy/log.md T04.

import * as fontkit from 'fontkit';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, '..', 'node_modules', '@fontsource', 'pt-serif', 'files');

const targets = [
  ['pt-serif-cyrillic-400-normal.woff2', '400/normal'],
  ['pt-serif-cyrillic-700-normal.woff2', '700/normal'],
  ['pt-serif-cyrillic-400-italic.woff2', '400/italic'],
];

// Глифы из T04 acceptance criteria + чуть шире для полноты.
const required = [
  ['А', 0x0410],
  ['я', 0x044f],
  ['ё', 0x0451],
  ['Ё', 0x0401],
  ['ъ', 0x044a],
  ['ь', 0x044c],
  ['й', 0x0439],
  ['Й', 0x0419],
  // диапазонная sanity-проверка
  ['Щ', 0x0429],
  ['щ', 0x0449],
];

let anyMissing = false;
for (const [file, label] of targets) {
  const fontPath = join(fontsDir, file);
  const font = fontkit.openSync(fontPath);
  const missing = [];
  for (const [glyph, cp] of required) {
    const g = font.glyphForCodePoint(cp);
    // glyphForCodePoint всегда возвращает glyph; .id===0 => .notdef => нет в шрифте
    if (!g || g.id === 0) missing.push(`${glyph} (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`);
  }
  if (missing.length === 0) {
    process.stdout.write(`OK ${label.padEnd(12)} ${file} — все ${required.length} required глифов присутствуют\n`);
  } else {
    anyMissing = true;
    process.stdout.write(`FAIL ${label.padEnd(12)} ${file} — отсутствуют: ${missing.join(', ')}\n`);
  }
}

process.exit(anyMissing ? 1 : 0);
