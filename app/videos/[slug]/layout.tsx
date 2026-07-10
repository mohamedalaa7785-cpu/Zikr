import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: 'فيديو',
    description: 'شاهد الفيديو في مكتبة المحتوى المرئي الإسلامي بمنصة ZIKR.',
    path: `/videos/${slug}`,
  });
}

export default function VideoSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
