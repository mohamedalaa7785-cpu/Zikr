import fs from 'fs';
import matter from 'gray-matter';

const file = '/home/ubuntu/zikr/content/episodes/deep-power-ancient-egypt-en.md';
const content = fs.readFileSync(file, 'utf8');
const { data, content: markdown } = matter(content);

console.log('Frontmatter data:', JSON.stringify(data, null, 2));
console.log('\nContent length:', markdown.length);
