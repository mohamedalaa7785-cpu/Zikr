'use client';

import { useState, useEffect, useCallback } from 'react';
import { playSalawatClip, unlockAudioContext } from '@/lib/audio/spiritual-tones';
import { showSalawatNotification, isInQuietHours } from '@/lib/services/notifications';

export type SalawatInterval = 15 | 30 | 60 | 0; // 0 = disabled

export interface QuietHours {
  enabled: boolean;
  from: string; // "HH:MM"
  to: string;   // "HH:MM"
}

export interface SalawatSettings {
  enabled: boolean;
  intervalMinutes: SalawatInterval;
  quietHours: QuietHours;
}

const SETTINGS_KEY = 'zikr_salawat_settings';

const DEFAULT_SETTINGS: SalawatSettings = {
  enabled: false,           // opt-in: user must explicitly enable
  intervalMinutes: 30,
  quietHours: { enabled: false, from: '22:00', to: '06:00' },
};

function loadSettings(): SalawatSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed, quietHours: { ...DEFAULT_SETTINGS.quietHours, ...parsed.quietHours } };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: SalawatSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export interface SalawatReminderReturn {
  settings: SalawatSettings;
  setEnabled: (v: boolean) => void;
  setIntervalMinutes: (v: SalawatInterval) => void;
  setQuietHours: (v: Partial<QuietHours>) => void;
  testReminder: () => void;
}

export function useSalawatReminder(): SalawatReminderReturn {
  const [settings, setSettings] = useState<SalawatSettings>(DEFAULT_SETTINGS);

  // Load settings on mount
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // Set up interval whenever settings change
  useEffect(() => {
    if (!settings.enabled || settings.intervalMinutes === 0) return;

    const fire = () => {
      if (settings.quietHours.enabled &&
          isInQuietHours(settings.quietHours.from, settings.quietHours.to)) {
        return; // Respect quiet hours — skip silently
      }
      playSalawatClip();
      showSalawatNotification();
      // Also dispatch via SW for background delivery
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_DHIKR_NOTIFICATION',
          kind: 'salawat',
          text: 'اللهم صلِّ وسلم على نبينا محمد',
        });
      }
    };

    const interval = setInterval(fire, settings.intervalMinutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings]);

  const update = useCallback((partial: Partial<SalawatSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  const setEnabled = useCallback((v: boolean) => update({ enabled: v }), [update]);
  const setIntervalMinutes = useCallback((v: SalawatInterval) => update({ intervalMinutes: v }), [update]);
  const setQuietHours = useCallback(
    (v: Partial<QuietHours>) =>
      update({ quietHours: { ...settings.quietHours, ...v } }),
    [update, settings.quietHours]
  );

  const testReminder = useCallback(() => {
    unlockAudioContext();
    playSalawatClip();
    showSalawatNotification();
  }, []);

  return { settings, setEnabled, setIntervalMinutes, setQuietHours, testReminder };
}
