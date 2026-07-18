/**
 * ZIKR — App Icon & Splash Screen Generator
 *
 * Prerequisites:
 *   npm install -g sharp
 *   OR: pnpm add -D sharp
 *
 * Usage:
 *   node scripts/generate-icons.mjs
 *
 * Input:  public/icons/icon-source.png  (1024x1024, transparent or solid bg)
 * Output: All required Android mipmap PNGs + iOS appiconset PNGs + splash PNGs
 */

import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SOURCE_ICON = path.join(root, 'public/icons/icon-source.png');
const SOURCE_SPLASH = path.join(root, 'public/icons/splash-source.png');

// ─── Android ───────────────────────────────────────────────────────────────
const ANDROID_MIPMAP_SIZES = [
  { density: 'mipmap-mdpi',    size: 48  },
  { density: 'mipmap-hdpi',    size: 72  },
  { density: 'mipmap-xhdpi',   size: 96  },
  { density: 'mipmap-xxhdpi',  size: 144 },
  { density: 'mipmap-xxxhdpi', size: 192 },
];

const ANDROID_ADAPTIVE_SIZES = [
  { density: 'mipmap-mdpi',    size: 108 },
  { density: 'mipmap-hdpi',    size: 162 },
  { density: 'mipmap-xhdpi',   size: 216 },
  { density: 'mipmap-xxhdpi',  size: 324 },
  { density: 'mipmap-xxxhdpi', size: 432 },
];

// ─── iOS ────────────────────────────────────────────────────────────────────
const IOS_ICON_SIZES = [
  20, 29, 38, 40, 58, 60, 76, 80, 87, 114, 120, 152, 167, 180, 1024
];

async function generateAndroidIcons() {
  for (const { density, size } of ANDROID_MIPMAP_SIZES) {
    const outDir = path.join(root, 'android/app/src/main/res', density);
    fs.mkdirSync(outDir, { recursive: true });
    await sharp(SOURCE_ICON)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, 'ic_launcher.png'));
    await sharp(SOURCE_ICON)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, 'ic_launcher_round.png'));
    console.log(`  Android ${density}: ${size}x${size}`);
  }

  // Adaptive icon foreground layer (108dp baseline)
  for (const { density, size } of ANDROID_ADAPTIVE_SIZES) {
    const outDir = path.join(root, 'android/app/src/main/res', density);
    await sharp(SOURCE_ICON)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, 'ic_launcher_foreground.png'));
    console.log(`  Android adaptive ${density}: ${size}x${size}`);
  }
}

async function generateIOSIcons() {
  for (const size of IOS_ICON_SIZES) {
    const outPath = path.join(
      root,
      'ios/App/App/Assets.xcassets/AppIcon.appiconset',
      `icon-${size}.png`
    );
    await sharp(SOURCE_ICON)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`  iOS icon-${size}.png`);
  }
}

async function generateSplash() {
  if (!fs.existsSync(SOURCE_SPLASH)) {
    console.warn('  No splash-source.png found, skipping splash generation');
    return;
  }

  // iOS splash sizes
  const iosSizes = [
    { scale: '1x', size: 1242 },
    { scale: '2x', size: 2484 },
    { scale: '3x', size: 3726 },
  ];
  const splashDir = path.join(root, 'ios/App/App/Assets.xcassets/Splash.imageset');
  const names = ['splash.png', 'splash@2x.png', 'splash@3x.png'];
  for (let i = 0; i < iosSizes.length; i++) {
    const { size } = iosSizes[i];
    await sharp(SOURCE_SPLASH)
      .resize(size, size, { fit: 'contain', background: { r: 13, g: 43, b: 31, alpha: 1 } })
      .png()
      .toFile(path.join(splashDir, names[i]));
    console.log(`  iOS splash ${names[i]}`);
  }

  // Android splash (drawable)
  const androidSplashDir = path.join(root, 'android/app/src/main/res/drawable');
  await sharp(SOURCE_SPLASH)
    .resize(1242, 1242, { fit: 'contain', background: { r: 13, g: 43, b: 31, alpha: 1 } })
    .png()
    .toFile(path.join(androidSplashDir, 'splash.png'));
  console.log('  Android splash.png');
}

console.log('Generating ZIKR app icons...');
if (!fs.existsSync(SOURCE_ICON)) {
  console.error(`ERROR: Source icon not found at ${SOURCE_ICON}`);
  console.error('Place a 1024x1024 PNG at public/icons/icon-source.png and re-run.');
  process.exit(1);
}

generateAndroidIcons()
  .then(generateIOSIcons)
  .then(generateSplash)
  .then(() => console.log('Done. All icons generated.'))
  .catch(err => { console.error(err); process.exit(1); });
