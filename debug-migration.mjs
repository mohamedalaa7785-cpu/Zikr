import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const episodesDir = '/home/ubuntu/zikr/content/episodes';
const files = fs.readdirSync(episodesDir).filter(f => f.endsWith('.md') && f !== 'test.md');

console.log(`Found ${files.length} files\n`);

const episodes = {};

files.forEach(file => {
  console.log(`Processing: ${file}`);
  const content = fs.readFileSync(path.join(episodesDir, file), 'utf8');
  const { data, content: markdown } = matter(content);
  
  const match = file.match(/^(.+?)-(en|ar)\.md$/);
  if (match) {
    const [, slug, lang] = match;
    console.log(`  → Slug: ${slug}, Lang: ${lang}`);
    
    if (!episodes[slug]) {
      episodes[slug] = { slug };
    }
    
    episodes[slug][`title${lang.toUpperCase()}`] = data.title || '';
    episodes[slug][`description${lang.toUpperCase()}`] = data.description || '';
  }
});

console.log(`\nFinal episodes object:`, Object.keys(episodes));
Object.entries(episodes).forEach(([slug, ep]) => {
  console.log(`${slug}: titleEn=${!!ep.titleEn}, titleAr=${!!ep.titleAr}`);
});
