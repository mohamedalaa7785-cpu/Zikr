import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: 'قارئ القرآن',
    description: 'سيرة القارئ وتلاواته الصوتية للقرآن الكريم.',
    path: `/reciters/${slug}`,
  });
}

export default function ReciterSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
