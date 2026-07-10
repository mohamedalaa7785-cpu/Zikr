import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: 'مقال',
    description: 'اقرأ المقال كاملاً في منصة ZIKR للمحتوى الإسلامي.',
    path: `/articles/${slug}`,
  });
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
