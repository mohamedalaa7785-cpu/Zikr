import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: 'دعاء',
    description: 'دعاء مأثور من الكتاب والسنة مع النص الكامل وفضل الدعاء.',
    path: `/dua/${slug}`,
  });
}

export default function DuaSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
