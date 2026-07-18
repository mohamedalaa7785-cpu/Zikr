/**
 * Cross-platform share wrapper.
 * Native: @capacitor/share  |  Web: Web Share API (navigator.share)
 */
import { isNative, getShare } from '@/lib/capacitor';

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}

/**
 * Open the native share sheet or the Web Share API.
 * Returns true if the share was initiated successfully.
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  if (isNative()) {
    try {
      const Share = await getShare();
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle,
      });
      return true;
    } catch {
      return false;
    }
  }

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return true;
    } catch {
      return false;
    }
  }

  // Last-resort clipboard fallback
  if (options.url && typeof navigator?.clipboard?.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(options.url);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/** Check if any sharing mechanism is available. */
export function canShare(): boolean {
  if (isNative()) return true;
  if (typeof navigator === 'undefined') return false;
  return typeof navigator.share === 'function' || typeof navigator.clipboard?.writeText === 'function';
}
