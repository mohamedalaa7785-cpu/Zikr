export type ReminderType = "prayer" | "adhkar" | "quran";

export interface NotificationPreference {
  enabled: boolean;
  reminderTypes: ReminderType[];
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.requestPermission();
}

export async function saveNotificationPreference(preference: NotificationPreference): Promise<{ ok: boolean }> {
  if (typeof window !== "undefined") {
    localStorage.setItem("zikr:notification-preference", JSON.stringify(preference));
  }
  return { ok: true };
}

export async function schedulePlaceholderReminder(type: ReminderType, atISO: string): Promise<{ ok: boolean; message: string }> {
  return {
    ok: true,
    message: `Placeholder scheduled for ${type} at ${atISO}.`,
  };
}
// Future: wire to push subscriptions, service worker sync, and prayer-time scheduler.
