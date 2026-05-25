// One-shot helper: generates a neutral gray placeholder for project-01/03.jpg
// where source folder Portfolio/1/ only has 2 watermarked exports. Сестра
// заменяет файл через админку, когда появится третий рендер для project-01.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const out = 'src/assets/projects/project-01/03.jpg';
await mkdir(dirname(out), { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#e7e5e4"/>
  <text x="600" y="450" font-family="Inter, sans-serif" font-size="42" fill="#78716c" text-anchor="middle" dominant-baseline="middle">фото в обработке</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
console.log(`wrote ${out}`);
