import type { Metadata } from 'next';
import { Noto_Naskh_Arabic, Amiri } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/layout/site-shell';
import { defaultOgImage, siteConfig } from '@/lib/site';
import { Analytics } from '@/components/layout/analytics';
import { ServiceWorkerRegister } from '@/components/layout/service-worker-register';
import { AdSense } from '@/components/layout/adsense';
import { GoogleFundingChoices } from '@/components/layout/google-funding-choices';
import { SpeedInsights } from '@vercel/speed-insights/next';

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-arabic',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  verification: {
    google: 'yge0N_uefs8BynVrT_mhn_mBPNycS_rG_vN6fMVjJmw',
  },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: 'ar',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteConfig.url}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.shortName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/branding/logo-gold.png`,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang='ar' dir={siteConfig.dir} data-scroll-behavior='smooth' className={`${notoNaskhArabic.variable} ${amiri.variable} bg-black`}>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        <AdSense />
        <GoogleFundingChoices />
        <SpeedInsights />
      </body>
    </html>
  );
}
