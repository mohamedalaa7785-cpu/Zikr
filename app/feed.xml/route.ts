import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

async function generateRssXml(): Promise<string> {
  const supabase = await createClient();

  // Fetch latest articles and stories
  const [articles, stories] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title_en, content_en, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('stories')
      .select('id, title_en, content_en, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const baseUrl = siteConfig.url;
  const items = [
    ...(articles.data || []).map(article => ({
      title: article.title_en,
      description: article.content_en?.substring(0, 500) || '',
      link: `${baseUrl}/articles/${article.id}`,
      pubDate: new Date(article.created_at).toUTCString(),
      guid: `${baseUrl}/articles/${article.id}`,
    })),
    ...(stories.data || []).map(story => ({
      title: story.title_en,
      description: story.content_en?.substring(0, 500) || '',
      link: `${baseUrl}/stories/${story.id}`,
      pubDate: new Date(story.created_at).toUTCString(),
      guid: `${baseUrl}/stories/${story.id}`,
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>ar</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>3600</ttl>
    ${items
      .map(
        item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>
    `
      )
      .join('')}
  </channel>
</rss>`;

  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const xml = await generateRssXml();
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('[feed] Error generating RSS:', error);
    return new Response('Error generating feed', { status: 500 });
  }
}
