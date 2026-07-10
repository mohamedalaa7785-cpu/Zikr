'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePrayerAlert, PRAYER_NAMES_AR, type PrayerKey } from '@/hooks/use-prayer-alert';
import { useSalawatReminder } from '@/hooks/use-salawat-reminder';
import { unlockAudioContext } from '@/lib/audio/spiritual-tones';

interface ActiveAlert {
  prayer: PrayerKey;
  firedAt: number; // timestamp
}

/**
 * PrayerAlertProvider
 * - Mounts both hooks at the app-shell level (single instance).
 * - Listens for prayer alerts and renders a dismissible banner.
 * - Unlocks AudioContext on the first click anywhere in the window.
 */
export function PrayerAlertProvider() {
  const { onAlertFired } = usePrayerAlert();
  useSalawatReminder(); // side-effects only — interval + notifications

  const [activeAlert, setActiveAlert] = useState<ActiveAlert | null>(null);
  const [audioUnlockedOnce, setAudioUnlockedOnce] = useState(false);

  // Register callback to receive prayer match events from the hook
  useEffect(() => {
    onAlertFired((prayer) => {
      setActiveAlert({ prayer, firedAt: Date.now() });
    });
  }, [onAlertFired]);

  // Auto-dismiss banner after 60 sec
  useEffect(() => {
    if (!activeAlert) return;
    const timer = setTimeout(() => setActiveAlert(null), 60_000);
    return () => clearTimeout(timer);
  }, [activeAlert]);

  // Unlock AudioContext on first user interaction
  const handleFirstClick = useCallback(() => {
    if (audioUnlockedOnce) return;
    unlockAudioContext();
    setAudioUnlockedOnce(true);
  }, [audioUnlockedOnce]);

  useEffect(() => {
    window.addEventListener('click', handleFirstClick, { once: true });
    window.addEventListener('touchstart', handleFirstClick, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstClick);
      window.removeEventListener('touchstart', handleFirstClick);
    };
  }, [handleFirstClick]);

  if (!activeAlert) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
    >
      <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-gold/40 bg-brand-emeraldDeep/95 px-5 py-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          {/* Crescent icon via SVG — no emoji */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 shrink-0 text-brand-gold"
            aria-hidden="true"
          >
            <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-.05z" />
          </svg>
          <div className="min-w-0" dir="rtl">
            <p className="text-sm font-bold text-brand-gold truncate">
              حان وقت صلاة {PRAYER_NAMES_AR[activeAlert.prayer]}
            </p>
            <p className="text-xs text-brand-cream/60 truncate">
              الصلاة خير من النوم — حافظ على صلاتك
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveAlert(null)}
          className="shrink-0 rounded-md p-1 text-brand-cream/50 transition-colors hover:text-brand-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          aria-label="إغلاق التنبيه"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
