import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/layout/site-shell';
import { defaultOgImage, siteConfig } from '@/lib/site';
import { Analytics } from '@/components/layout/analytics';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ar' dir={siteConfig.dir}>
      <body className='font-arabic antialiased'>
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
