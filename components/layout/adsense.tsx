import Script from 'next/script';

// Publisher ID confirmed: ca-pub-2457467624248791
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-2457467624248791';

/**
 * Google AdSense loader.
 * Loads the AdSense script on every page for site verification and ad delivery.
 * The publisher ID defaults to the hardcoded value but can be overridden via
 * the NEXT_PUBLIC_ADSENSE_CLIENT environment variable.
 */
export function AdSense() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
