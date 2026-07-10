import Script from 'next/script';

/**
 * Google AdSense loader.
 * Renders only when NEXT_PUBLIC_ADSENSE_CLIENT is set (e.g. "ca-pub-1234567890123456").
 * Add your publisher ID in project env vars after AdSense approval.
 */
export function AdSense() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
