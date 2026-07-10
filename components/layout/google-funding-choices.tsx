import Script from 'next/script';

/**
 * Google Funding Choices consent management platform.
 * Displays user consent banner for ad choices and privacy preferences.
 * 
 * Must be placed in body (after AdSense script) and allows CSP for fundingchoicesmessages.google.com.
 */
export function GoogleFundingChoices() {
  return (
    <Script
      async
      src="https://fundingchoicesmessages.google.com/i/fundingchoicesmessages.js"
      strategy="lazyOnload"
    />
  );
}
