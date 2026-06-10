import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/layout/site-shell';
import { defaultOgImage, siteConfig } from '@/lib/site';
import { Analytics } from '@/components/layout/analytics';
import { ServiceWorkerRegister } from '@/components/layout/service-worker-register';

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
      <head>
        <meta name='theme-color' content='#0A2A1E' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
        <meta name='apple-mobile-web-app-title' content={siteConfig.shortName} />
        <link rel='apple-touch-icon' href='/icons/icon-192.svg' />
        <link rel='manifest' href='/manifest.webmanifest' />
      </head>
      <body className='font-arabic antialiased'>
        <SiteShell>{children}</SiteShell>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
