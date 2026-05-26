import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const episodesDir = '/home/ubuntu/zikr/content/episodes';
const files = fs.readdirSync(episodesDir).filter(f => f.endsWith('.md') && f !== 'test.md');

const episodes = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(episodesDir, file), 'utf8');
  const { data, content: markdown } = matter(content);
  
  const match = file.match(/^(.+?)-(en|ar)\.md$/);
  if (!match) return;
  
  const [, slug, lang] = match;
  
  if (!episodes[slug]) {
    episodes[slug] = { slug };
  }
  
  const langUpper = lang.toUpperCase();
  episodes[slug][`title${langUpper}`] = data.title || '';
  
  console.log(`Set title${langUpper} for ${slug}: "${episodes[slug][`title${langUpper}`]}"`);
});

console.log('\n\nFinal state:');
Object.entries(episodes).forEach(([slug, ep]) => {
  console.log(`${slug}:`);
  console.log(`  titleEn: "${ep.titleEn}"`);
  console.log(`  titleAr: "${ep.titleAr}"`);
  console.log(`  hasEn: ${ep.titleEn && ep.titleEn.trim().length > 0}`);
  console.log(`  hasAr: ${ep.titleAr && ep.titleAr.trim().length > 0}`);
});
