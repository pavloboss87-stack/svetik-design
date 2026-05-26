// One-shot helper: generates a 1200x630 default OG image used by MetaTags when
// a page doesn't pass its own ogImage. Финальная картинка — ep02 (визуальный код).
// Сейчас цель — закрыть техническую дыру: Layout уже ссылается на /images/og/default.png
// с Session A, и без файла соцсети показывают 404 в OG превью.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const out = 'public/images/og/default.png';
await mkdir(dirname(out), { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#1c1917"/>
  <text x="80" y="280" font-family="Georgia, serif" font-size="72" font-weight="400" fill="#fafaf9">Светлана Головина</text>
  <text x="80" y="360" font-family="Inter, sans-serif" font-size="36" font-weight="400" fill="#a8a29e">Дизайн интерьеров</text>
  <text x="80" y="550" font-family="Inter, sans-serif" font-size="22" fill="#78716c">svetik-design.pages.dev</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log(`wrote ${out}`);
