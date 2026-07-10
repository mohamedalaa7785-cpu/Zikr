import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let title = 'مقال';
  let description = 'اقرأ المقال كاملاً في منصة ZIKR للمحتوى الإسلامي.';
  try {
    const data = await supabaseServerAnonRequest<{ title: string; summary?: string }[]>(
      `/rest/v1/articles?select=title,summary&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`
    );
    if (data?.[0]) {
      title = data[0].title;
      if (data[0].summary) description = data[0].summary.slice(0, 160);
    }
  } catch {
    // fall back to generic metadata
  }
  return pageMetadata({ title, description, path: `/articles/${slug}` });
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
