'use client';

import { useState, useEffect, useCallback } from 'react';
import { playSalawatClip, unlockAudioContext } from '@/lib/audio/spiritual-tones';
import { showSalawatNotification, isInQuietHours } from '@/lib/services/notifications';

export type SalawatInterval = 15 | 30 | 60 | 120 | 0; // 0 = disabled

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
  intervalMinutes: 60,
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

  // Load local settings immediately, then reconcile with the authenticated
  // server preference so the background worker uses the same configuration.
  useEffect(() => {
    setSettings(loadSettings());
    void fetch('/api/reminders/background', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data) return;
        const next: SalawatSettings = {
          enabled: Boolean(data.salawat_enabled),
          intervalMinutes: data.salawat_interval_minutes ?? 60,
          quietHours: {
            enabled: Boolean(data.quiet_hours_start && data.quiet_hours_end),
            from: data.quiet_hours_start?.slice(0, 5) ?? '22:00',
            to: data.quiet_hours_end?.slice(0, 5) ?? '06:00',
          },
        };
        saveSettings(next);
        setSettings(next);
      })
      .catch(() => undefined);
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
      void fetch('/api/reminders/background', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salawat_enabled: next.enabled,
          salawat_interval_minutes: next.intervalMinutes,
          quiet_hours_start: next.quietHours.enabled ? next.quietHours.from : null,
          quiet_hours_end: next.quietHours.enabled ? next.quietHours.to : null,
        }),
      }).catch(() => undefined);
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
