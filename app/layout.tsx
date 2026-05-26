import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://zikr-platform.vercel.app'),
  title: 'ZIKR | ذِكرٌ',
  description:
    'Cinematic Islamic platform foundation for Quran, Hadith, Stories, AI, Community, and PWA.',
  openGraph: {
    title: 'ZIKR | ذِكرٌ',
    description: 'Calm, spiritual, cinematic Islamic experience.',
    url: 'https://zikr-platform.vercel.app',
    siteName: 'ZIKR | ذِكرٌ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZIKR | ذِكرٌ',
    description: 'Calm, spiritual, cinematic Islamic experience.',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
