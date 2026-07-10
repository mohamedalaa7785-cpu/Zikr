import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: 'محتوى الأطفال',
    description: 'قصص وأنشطة إسلامية تعليمية ممتعة للأطفال.',
    path: `/kids/${slug}`,
  });
}

export default function KidsSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
