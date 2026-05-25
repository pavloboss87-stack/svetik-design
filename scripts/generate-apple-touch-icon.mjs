import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const svgPath = path.join(root, 'public', 'favicon.svg');
const outPath = path.join(root, 'public', 'apple-touch-icon.png');

const svg = await readFile(svgPath);

const png = await sharp(svg, { density: 720 })
  .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toBuffer();

await writeFile(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
