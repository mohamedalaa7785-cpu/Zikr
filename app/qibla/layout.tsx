import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'محدد القبلة | ZIKR',
  description: 'احصل على اتجاه القبلة بدقة من موقعك الجغرافي - أداة إسلامية مفيدة لتحديد اتجاه مكة المكرمة',
  keywords: ['قبلة', 'اتجاه', 'مكة', 'صلاة', 'إسلام', 'بوصلة', 'موقع جغرافي'],
  openGraph: {
    title: 'محدد القبلة',
    description: 'احصل على اتجاه القبلة بدقة من موقعك الجغرافي',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'محدد القبلة',
    description: 'احصل على اتجاه القبلة بدقة من موقعك الجغرافي',
  },
};

export default function QiblaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
