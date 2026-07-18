/**
 * Status bar management for iOS and Android.
 * No-ops gracefully on web.
 */
import { isNative, getStatusBar } from '@/lib/capacitor';

/** Set the status bar style. Call from a client component after mount. */
export async function setStatusBarStyle(
  style: 'dark' | 'light' = 'dark',
  backgroundColor = '#0a0a0f'
): Promise<void> {
  if (!isNative()) return;

  try {
    const StatusBar = await getStatusBar();
    const { Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: style === 'dark' ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({ color: backgroundColor });
  } catch {
    // Status bar plugin unavailable — ignore
  }
}

/** Hide the status bar (e.g. for full-screen splash or video). */
export async function hideStatusBar(): Promise<void> {
  if (!isNative()) return;
  try {
    const StatusBar = await getStatusBar();
    await StatusBar.hide();
  } catch {
    // ignore
  }
}

/** Show the status bar after hiding it. */
export async function showStatusBar(): Promise<void> {
  if (!isNative()) return;
  try {
    const StatusBar = await getStatusBar();
    await StatusBar.show();
  } catch {
    // ignore
  }
}
