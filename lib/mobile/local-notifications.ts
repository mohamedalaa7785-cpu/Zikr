/**
 * Local notification scheduling for prayer times.
 *
 * On native (Capacitor): uses @capacitor/local-notifications which fires even
 * when the app is backgrounded or closed, and can play the bundled adhan.mp3.
 *
 * On web: falls back to the browser Notification API (requires the page to be
 * open or a service worker to be running for background delivery).
 */
import { isNative, getLocalNotifications } from '@/lib/capacitor';

export type PrayerKey = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

const PRAYER_NAMES_AR: Record<PrayerKey, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

// Stable notification IDs — one per prayer, rotated daily via the timestamp
const PRAYER_NOTIFICATION_IDS: Record<PrayerKey, number> = {
  Fajr: 1001,
  Dhuhr: 1002,
  Asr: 1003,
  Maghrib: 1004,
  Isha: 1005,
};

/**
 * Request local notification permission.
 * Returns true if granted.
 */
export async function requestLocalNotificationPermission(): Promise<boolean> {
  if (isNative()) {
    try {
      const LN = await getLocalNotifications();
      const result = await LN.requestPermissions();
      return result.display === 'granted';
    } catch {
      return false;
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  return false;
}

/**
 * Schedule local notifications for all enabled prayer times on a given day.
 *
 * @param timings         - Object mapping prayer keys to "HH:MM" strings
 * @param enabledPrayers  - Which prayers should fire a notification
 * @param scheduleDate    - The date to schedule for (defaults to today)
 */
export async function schedulePrayerNotifications(
  timings: Record<string, string>,
  enabledPrayers: Record<PrayerKey, boolean>,
  scheduleDate: Date = new Date()
): Promise<void> {
  const prayers: PrayerKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  if (isNative()) {
    try {
      const LN = await getLocalNotifications();

      // Cancel any previously scheduled prayer notifications to avoid duplicates
      const pendingIds = prayers.map(p => ({ id: PRAYER_NOTIFICATION_IDS[p] }));
      await LN.cancel({ notifications: pendingIds }).catch(() => {});

      const notifications = prayers
        .filter(prayer => enabledPrayers[prayer] && timings[prayer])
        .map(prayer => {
          const [h, m] = timings[prayer].split(':').map(Number);
          const at = new Date(scheduleDate);
          at.setHours(h, m, 0, 0);

          // Skip times already passed today
          if (at.getTime() <= Date.now()) return null;

          return {
            id: PRAYER_NOTIFICATION_IDS[prayer],
            title: `حان وقت صلاة ${PRAYER_NAMES_AR[prayer]}`,
            body: 'الصلاة خير من النوم — حافظ على صلاتك',
            schedule: { at },
            sound: 'adhan.mp3', // Must be placed in android/app/src/main/res/raw/ and ios/App/App/
            smallIcon: 'ic_stat_icon',
            iconColor: '#C7A252',
            extra: { prayer },
            ongoing: false,
            autoCancel: true,
          };
        })
        .filter(Boolean) as object[];

      if (notifications.length > 0) {
        await LN.schedule({ notifications } as Parameters<typeof LN.schedule>[0]);
      }
    } catch {
      // Local notifications unavailable — fall back to web
    }
    return;
  }

  // Web fallback — browser Notification API (best-effort, requires page open)
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  for (const prayer of prayers) {
    if (!enabledPrayers[prayer] || !timings[prayer]) continue;

    const [h, m] = timings[prayer].split(':').map(Number);
    const at = new Date(scheduleDate);
    at.setHours(h, m, 0, 0);
    const delay = at.getTime() - Date.now();
    if (delay <= 0) continue;

    setTimeout(() => {
      try {
        new Notification(`حان وقت صلاة ${PRAYER_NAMES_AR[prayer]}`, {
          body: 'الصلاة خير من النوم — حافظ على صلاتك',
          icon: '/icons/icon-192.svg',
          tag: `prayer-${prayer}`,
        });
      } catch {
        // Notification API blocked — ignore
      }
    }, delay);
  }
}

/**
 * Cancel all pending prayer notifications.
 */
export async function cancelAllPrayerNotifications(): Promise<void> {
  if (!isNative()) return;
  try {
    const LN = await getLocalNotifications();
    const prayers: PrayerKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    await LN.cancel({
      notifications: prayers.map(p => ({ id: PRAYER_NOTIFICATION_IDS[p] })),
    });
  } catch {
    // ignore
  }
}

export { PRAYER_NAMES_AR, PRAYER_NOTIFICATION_IDS };
