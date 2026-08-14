"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  playAzanClip,
  unlockAudioContext,
  isAudioUnlocked,
} from "@/lib/audio/spiritual-tones";
import {
  showPrayerNotification,
  requestNotificationPermission,
} from "@/lib/services/notifications";
import type { NotificationPermission as PermResult } from "@/lib/services/notifications";
import {
  registerPrayerPushSubscription,
  type PushSubscriptionRegistrationResult,
} from "@/lib/push-subscription";

export type PrayerKey = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export interface AzanSettings {
  enabledPrayers: Record<PrayerKey, boolean>;
  audioUnlocked: boolean;
}

const PRAYERS: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_NAMES_AR: Record<PrayerKey, string> = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};
const SETTINGS_KEY = "zikr_azan_settings";
const LOCATION_KEY = "zikr_prayer_location";

const DEFAULT_SETTINGS: AzanSettings = {
  enabledPrayers: {
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  },
  audioUnlocked: false,
};

function loadSettings(): AzanSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: AzanSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function getTimings(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.timings ?? null;
  } catch {
    return null;
  }
}

/** Dedup key: fires once per prayer per calendar day. */
function getAlertKey(prayer: PrayerKey): string {
  const today = new Date().toISOString().slice(0, 10);
  return `zikr_alert_${prayer}_${today}`;
}

function alreadyFired(prayer: PrayerKey): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(getAlertKey(prayer)) === "1";
}

function markFired(prayer: PrayerKey): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(getAlertKey(prayer), "1");
}

function scheduleNativePrayerNotifications(
  settings: AzanSettings,
  timings: Record<string, string>
): void {
  if (typeof window === "undefined") return;
  const native = (
    window as Window & {
      zikrNative?: {
        scheduleLocalNotification?: (notification: {
          id: number;
          title: string;
          body: string;
          scheduleAt: string;
          sound?: string;
        }) => Promise<void>;
      };
    }
  ).zikrNative;
  if (!native?.scheduleLocalNotification) return;

  const now = new Date();
  for (const prayer of PRAYERS) {
    if (!settings.enabledPrayers[prayer]) continue;
    const time = timings[prayer];
    if (!time) continue;
    const [hours, minutes] = time.split(":").map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) continue;
    const scheduled = new Date(now);
    scheduled.setHours(hours, minutes, 0, 0);
    if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);
    void native.scheduleLocalNotification({
      id: 7000 + PRAYERS.indexOf(prayer),
      title: `حان وقت صلاة ${PRAYER_NAMES_AR[prayer]}`,
      body: "الصلاة خير من النوم — حافظ على صلاتك",
      scheduleAt: scheduled.toISOString(),
      sound: "adhan.wav",
    });
  }
}

export interface PrayerAlertReturn {
  settings: AzanSettings;
  notificationPermission: PermResult;
  togglePrayer: (p: PrayerKey) => void;
  unlockAudio: () => void;
  requestPermission: () => Promise<void>;
  enableServerPush: () => Promise<PushSubscriptionRegistrationResult>;
  testAzan: () => void;
  onAlertFired: (cb: (prayer: PrayerKey) => void) => void;
}

export function usePrayerAlert(): PrayerAlertReturn {
  const [settings, setSettings] = useState<AzanSettings>(DEFAULT_SETTINGS);
  const [notificationPermission, setNotificationPermission] =
    useState<PermResult>("default");
  const alertCallbackRef = useRef<((p: PrayerKey) => void) | null>(null);

  // Load settings and check notification permission on mount
  useEffect(() => {
    setSettings(loadSettings());
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission as PermResult);
    }
  }, []);

  // Tick every 30s — compare HH:MM with each enabled prayer time ±1 min
  useEffect(() => {
    const check = () => {
      const timings = getTimings();
      if (!timings) return;

      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      for (const prayer of PRAYERS) {
        if (!settings.enabledPrayers[prayer]) continue;
        const prayerTime = timings[prayer];
        if (!prayerTime) continue;

        // Compare exact HH:MM (the API returns "HH:MM" strings)
        const [ph, pm] = prayerTime.split(":").map(Number);
        const [nh, nm] = hhmm.split(":").map(Number);
        const diff = Math.abs(ph * 60 + pm - (nh * 60 + nm));

        if (diff <= 1 && !alreadyFired(prayer)) {
          markFired(prayer);
          // Fire alert — play the real adhan clip
          playAzanClip();
          showPrayerNotification(PRAYER_NAMES_AR[prayer]);
          alertCallbackRef.current?.(prayer);
          // Also deliver via SW for background notifications
          if (
            "serviceWorker" in navigator &&
            navigator.serviceWorker.controller
          ) {
            navigator.serviceWorker.controller.postMessage({
              type: "SHOW_PRAYER_NOTIFICATION",
              prayerName: PRAYER_NAMES_AR[prayer],
            });
          }
        }
      }
    };

    const timings = getTimings();
    if (timings) scheduleNativePrayerNotifications(settings, timings);
    check(); // run immediately on mount / settings change
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [settings]);

  const togglePrayer = useCallback((p: PrayerKey) => {
    setSettings(prev => {
      const next: AzanSettings = {
        ...prev,
        enabledPrayers: {
          ...prev.enabledPrayers,
          [p]: !prev.enabledPrayers[p],
        },
      };
      saveSettings(next);
      return next;
    });
  }, []);

  const unlockAudio = useCallback(() => {
    unlockAudioContext();
    setSettings(prev => {
      const next = { ...prev, audioUnlocked: isAudioUnlocked() };
      saveSettings(next);
      return next;
    });
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    if (result !== "unsupported") {
      setNotificationPermission(result);
    }
  }, []);

  const enableServerPush =
    useCallback(async (): Promise<PushSubscriptionRegistrationResult> => {
      if (typeof window === "undefined" || !("Notification" in window)) {
        return { status: "unsupported" };
      }

      if (Notification.permission !== "granted") {
        const result = await requestNotificationPermission();
        if (result !== "granted") {
          return {
            status: result === "unsupported" ? "unsupported" : "unavailable",
          };
        }
        setNotificationPermission(result);
      }

      return registerPrayerPushSubscription({
        enabledPrayers: settings.enabledPrayers,
      });
    }, [settings.enabledPrayers]);

  const testAzan = useCallback(() => {
    unlockAudioContext();
    playAzanClip();
  }, []);

  const onAlertFired = useCallback((cb: (prayer: PrayerKey) => void) => {
    alertCallbackRef.current = cb;
  }, []);

  return {
    settings,
    notificationPermission,
    togglePrayer,
    unlockAudio,
    requestPermission,
    enableServerPush,
    testAzan,
    onAlertFired,
  };
}

export { PRAYERS, PRAYER_NAMES_AR };
