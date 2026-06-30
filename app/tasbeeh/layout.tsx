import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'عداد التسبيح | ZIKR',
  description: 'عداد تسبيح ذكي - احسب أذكارك وتسبيحاتك بسهولة مع تتبع التقدم والحفظ التلقائي',
  keywords: ['تسبيح', 'أذكار', 'عداد', 'إسلام', 'ذكر', 'عبادة', 'صباح', 'مساء'],
  openGraph: {
    title: 'عداد التسبيح',
    description: 'عداد تسبيح ذكي - احسب أذكارك وتسبيحاتك بسهولة',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'عداد التسبيح',
    description: 'عداد تسبيح ذكي - احسب أذكارك وتسبيحاتك بسهولة',
  },
};

export default function TasbeehLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
