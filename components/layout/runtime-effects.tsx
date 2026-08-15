'use client';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { AdSense } from './adsense';
import { Analytics } from './analytics';
import { GoogleFundingChoices } from './google-funding-choices';
import { NativeCapacitorBridge } from './native-capacitor-bridge';
import { PrayerAlertProvider } from './prayer-alert-provider';
import { ServiceWorkerRegister } from './service-worker-register';

export function RuntimeEffects() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <ServiceWorkerRegister />
      <NativeCapacitorBridge />
      <PrayerAlertProvider />
      {isProduction && (
        <>
          <AdSense />
          <GoogleFundingChoices />
        </>
      )}
    </>
  );
}
