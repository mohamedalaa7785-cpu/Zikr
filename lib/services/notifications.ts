export type NotificationPermission = 'granted' | 'denied' | 'default' | 'unsupported';

export interface NotificationPreference {
  prayerReminders: boolean;
  adhkarReminders: boolean;
  quranReminders: boolean;
  quietHours?: { from: string; to: string };
}

const DEFAULT_PREFERENCE: NotificationPreference = {
  prayerReminders: true,
  adhkarReminders: true,
  quranReminders: false,
};

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.requestPermission() as Promise<NotificationPermission>;
}

export async function saveNotificationPreference(
  preference: Partial<NotificationPreference>
): Promise<NotificationPreference> {
  const merged = { ...DEFAULT_PREFERENCE, ...preference };
  if (typeof window !== 'undefined') {
    localStorage.setItem('zikr_notification_pref', JSON.stringify(merged));
  }
  return merged;
}

/**
 * Returns true if the current time falls within the quiet-hours window.
 * Handles windows that cross midnight (e.g. 22:00–06:00).
 */
export function isInQuietHours(from: string, to: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const [fh, fm] = from.split(':').map(Number);
    const [th, tm] = to.split(':').map(Number);
    const fromMin = fh * 60 + fm;
    const toMin = th * 60 + tm;

    if (fromMin <= toMin) {
      return nowMin >= fromMin && nowMin < toMin;
    } else {
      // Crosses midnight
      return nowMin >= fromMin || nowMin < toMin;
    }
  } catch {
    return false;
  }
}

/** Show a browser notification for a prayer time. No-ops gracefully if not granted. */
export function showPrayerNotification(prayerNameAr: string): void {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(`حان وقت صلاة ${prayerNameAr}`, {
      body: 'الصلاة خير من النوم — حافظ على صلاتك',
      icon: '/icons/icon-192.svg',
      tag: `prayer-${prayerNameAr}`,
    });
  } catch {
    // Some environments restrict Notification constructor — ignore silently
  }
}

/** Show a browser notification for the Salawat reminder. */
export function showSalawatNotification(): void {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification('اللهم صل على محمد', {
      body: 'صلِّ على النبي ﷺ — اللهم صل وسلم وبارك عليه',
      icon: '/icons/icon-192.svg',
      tag: 'salawat-reminder',
    });
  } catch {
    // ignore
  }
}
