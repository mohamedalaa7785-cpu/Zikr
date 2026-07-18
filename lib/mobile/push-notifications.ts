/**
 * Push notification registration and token management.
 * Registers the device with FCM (Android) or APNs (iOS) via
 * @capacitor/push-notifications and stores the token on the Supabase profile.
 *
 * Only runs on native platforms — is a no-op on web.
 */
import { isNative, getPushNotifications } from '@/lib/capacitor';
import { isAndroid, isIos } from '@/lib/capacitor';

export interface PushRegistrationResult {
  token: string;
  platform: 'android' | 'ios';
}

/**
 * Request push permission and register for remote notifications.
 * Returns the device token, or null if permission was denied or unavailable.
 */
export async function registerPushNotifications(): Promise<PushRegistrationResult | null> {
  if (!isNative()) return null;

  try {
    const PushNotifications = await getPushNotifications();

    // Request permission
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') return null;

    // Register with the push service
    await PushNotifications.register();

    // Wait for the token via a one-time listener
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 15_000);

      PushNotifications.addListener('registration', token => {
        clearTimeout(timeout);
        resolve({
          token: token.value,
          platform: isAndroid() ? 'android' : 'ios',
        });
      });

      PushNotifications.addListener('registrationError', () => {
        clearTimeout(timeout);
        resolve(null);
      });
    });
  } catch {
    return null;
  }
}

/**
 * Save the push token to the user's Supabase profile row.
 * Requires an authenticated Supabase client.
 */
export async function savePushTokenToProfile(
  supabaseClient: { from: (table: string) => unknown },
  userId: string,
  token: string,
  platform: 'android' | 'ios'
): Promise<void> {
  try {
    await (supabaseClient.from('profiles') as {
      update: (data: object) => { eq: (col: string, val: string) => Promise<void> };
    })
      .update({ push_token: token, push_platform: platform })
      .eq('id', userId);
  } catch {
    // Non-critical — push will still work via FCM/APNs direct delivery
  }
}

/**
 * Listen for foreground push notification events.
 * Returns an unsubscribe function.
 */
export async function onPushNotificationReceived(
  cb: (title: string, body: string) => void
): Promise<() => void> {
  if (!isNative()) return () => {};

  try {
    const PushNotifications = await getPushNotifications();
    const handle = await PushNotifications.addListener(
      'pushNotificationReceived',
      notification => {
        cb(notification.title ?? '', notification.body ?? '');
      }
    );
    return () => { handle.remove(); };
  } catch {
    return () => {};
  }
}

// Re-export platform helpers for convenience
export { isAndroid, isIos };
