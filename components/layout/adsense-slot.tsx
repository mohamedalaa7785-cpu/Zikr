'use client';

import { useEffect, useRef } from 'react';

interface AdSenseSlotProps {
  /** AdSense ad slot ID (numeric string from your AdSense account) */
  slot: string;
  /** Ad format — defaults to 'auto' */
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  /** Full-width responsive — defaults to true */
  responsive?: boolean;
  className?: string;
}

/**
 * Renders a single Google AdSense ad unit.
 *
 * Requirements:
 *   1. Set NEXT_PUBLIC_ADSENSE_CLIENT in your env vars (e.g. "ca-pub-XXXXXXXXXXXXXXXX").
 *   2. The global AdSense script is loaded in layout.tsx via <AdSense />.
 *   3. Drop <AdSenseSlot slot="XXXXXXXXXX" /> anywhere in your pages.
 *
 * The slot renders nothing (invisible div) when NEXT_PUBLIC_ADSENSE_CLIENT is not set,
 * so development environments are unaffected.
 */
export function AdSenseSlot({ slot, format = 'auto', responsive = true, className }: AdSenseSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || pushed.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet — silently ignore
    }
  }, [client]);

  if (!client) return <div className={className} aria-hidden />;

  return (
    <div className={className}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
