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

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.requestPermission();
}

export async function saveNotificationPreference(preference: Partial<NotificationPreference>): Promise<NotificationPreference> {
  const merged = { ...DEFAULT_PREFERENCE, ...preference };
  if (typeof window !== 'undefined') {
    localStorage.setItem('zikr_notification_pref', JSON.stringify(merged));
  }
  return merged;
}

export async function schedulePlaceholderReminder(reminderType: keyof NotificationPreference, atIso: string): Promise<boolean> {
  const date = new Date(atIso);
  if (Number.isNaN(date.getTime())) return false;
  // Placeholder: future service-worker push/local notification scheduler.
  return Boolean(reminderType);
}

// Future notifications:
// - Move preference storage to Supabase per authenticated user.
// - Add background sync and push token registration for web/mobile.
