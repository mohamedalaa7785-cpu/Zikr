/**
 * Cross-platform haptic feedback wrapper.
 * On native (iOS / Android) delegates to @capacitor/haptics.
 * On web, uses the Vibration API as a graceful fallback.
 */
import { isNative, getHaptics } from '@/lib/capacitor';

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Trigger haptic feedback.
 * @param style  - Intensity / semantic type of feedback.
 */
export async function triggerHaptic(style: HapticStyle = 'medium'): Promise<void> {
  if (isNative()) {
    try {
      const Haptics = await getHaptics();
      const { ImpactStyle, NotificationType } = await import('@capacitor/haptics');

      if (style === 'success' || style === 'warning' || style === 'error') {
        const typeMap = {
          success: NotificationType.Success,
          warning: NotificationType.Warning,
          error: NotificationType.Error,
        } as const;
        await Haptics.notification({ type: typeMap[style] });
      } else {
        const impactMap = {
          light: ImpactStyle.Light,
          medium: ImpactStyle.Medium,
          heavy: ImpactStyle.Heavy,
        } as const;
        await Haptics.impact({ style: impactMap[style] });
      }
    } catch {
      // Haptics not available on this device — ignore silently
    }
    return;
  }

  // Web fallback via Vibration API
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const durationMap: Record<HapticStyle, number | number[]> = {
      light: 10,
      medium: 25,
      heavy: 50,
      success: [10, 50, 10],
      warning: [50, 100],
      error: [100, 50, 100],
    };
    navigator.vibrate(durationMap[style]);
  }
}
