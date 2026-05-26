import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/layout/site-shell';

export const metadata: Metadata = {
  metadataBase: new URL('https://zikr.app'),
  title: { default: 'ZIKR | ذِكرٌ', template: '%s | ZIKR' },
  description: 'منصة روحانية تجمع القرآن والحديث والقصص والعلم في تجربة حديثة.',
  alternates: { canonical: '/' },
  openGraph: { title: 'ZIKR | ذِكرٌ', description: 'منصة روحانية حديثة.', type: 'website', locale: 'ar_SA' },
  twitter: { card: 'summary_large_image', title: 'ZIKR | ذِكرٌ', description: 'منصة روحانية حديثة.' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang='ar' dir='rtl'><body className='font-arabic antialiased'><SiteShell>{children}</SiteShell></body></html>;
}
