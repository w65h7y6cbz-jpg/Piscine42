import sharp from 'sharp';
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const dir = './public/pieces';
const files = readdirSync(dir).filter(f => f.endsWith('.png'));

console.log(`Converting ${files.length} PNG images to WebP...`);

for (const file of files) {
  const input = join(dir, file);
  const output = join(dir, file.replace('.png', '.webp'));

  await sharp(input)
    .webp({ quality: 85 })
    .toFile(output);

  unlinkSync(input);
  console.log(`  ✓ ${file} → ${output.split('/').pop()}`);
}

console.log('Done!');
