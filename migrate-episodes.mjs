import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read all episode files from old repo
const episodesDir = '/home/ubuntu/zikr/content/episodes';
const files = fs.readdirSync(episodesDir).filter(f => f.endsWith('.md') && f !== 'test.md');

console.log(`Found ${files.length} episode files to migrate\n`);

// Group episodes by slug (en/ar pairs)
const episodes = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(episodesDir, file), 'utf8');
  const { data, content: markdown } = matter(content);
  
  // Extract language and slug
  const match = file.match(/^(.+?)-(en|ar)\.md$/);
  if (!match) {
    console.warn(`Skipping file with unexpected format: ${file}`);
    return;
  }
  
  const [, slug, lang] = match;
  
  if (!episodes[slug]) {
    episodes[slug] = { slug };
  }
  
  // Use consistent casing: titleEn, titleAr, etc.
  if (lang === 'en') {
    episodes[slug].titleEn = data.title || '';
    episodes[slug].descriptionEn = data.description || '';
    episodes[slug].contentEn = markdown;
    episodes[slug].keywordsEn = data.keywords || '';
  } else if (lang === 'ar') {
    episodes[slug].titleAr = data.title || '';
    episodes[slug].descriptionAr = data.description || '';
    episodes[slug].contentAr = markdown;
    episodes[slug].keywordsAr = data.keywords || '';
  }
  
  episodes[slug].category = data.category || 'History';
  episodes[slug].publishedAt = new Date().toISOString();
});

// Output migration data - filter for complete episodes
const migrationData = Object.values(episodes).filter(ep => {
  const hasEn = ep.titleEn && ep.titleEn.trim().length > 0;
  const hasAr = ep.titleAr && ep.titleAr.trim().length > 0;
  return hasEn && hasAr;
});

console.log(`Migrating ${migrationData.length} complete episodes (with both EN and AR):\n`);
migrationData.forEach(ep => {
  console.log(`  ✓ ${ep.slug}`);
});

// Save to file for later use
fs.writeFileSync(
  path.join(__dirname, 'migration-data.json'),
  JSON.stringify(migrationData, null, 2)
);

console.log(`\n✓ Migration data saved to migration-data.json`);
