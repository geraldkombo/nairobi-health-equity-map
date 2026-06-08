import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, '..', 'public', 'icon.svg');
const svgBuffer = readFileSync(svgPath);

async function generateIcons() {
  console.log('Generating PWA icons...');

  try {
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(join(__dirname, '..', 'public', 'icons', 'icon-192.png'));
    console.log('Created icon-192.png (192x192)');

    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(join(__dirname, '..', 'public', 'icons', 'icon-512.png'));
    console.log('Created icon-512.png (512x512)');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
