// One-shot helper: generates a neutral square placeholder for the author
// portrait used on about.md. Сестра загружает реальное фото через админку.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const out = 'src/assets/about/placeholder.jpg';
await mkdir(dirname(out), { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#e7e5e4"/>
  <text x="400" y="400" font-family="Inter, sans-serif" font-size="36" fill="#78716c" text-anchor="middle" dominant-baseline="middle">фото в работе</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
console.log(`wrote ${out}`);
