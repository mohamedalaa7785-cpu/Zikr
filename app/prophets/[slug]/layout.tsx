import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: 'قصة نبي',
    description: 'قصة من قصص الأنبياء عليهم السلام كما وردت في القرآن الكريم والسنة النبوية.',
    path: `/prophets/${slug}`,
  });
}

export default function ProphetSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
