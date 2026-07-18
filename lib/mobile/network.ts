/**
 * Cross-platform network status wrapper.
 * Native: @capacitor/network  |  Web: navigator.onLine + online/offline events
 */
import { isNative, getNetwork } from '@/lib/capacitor';

export interface NetworkStatus {
  connected: boolean;
  connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
}

/** Get the current network status once. */
export async function getNetworkStatus(): Promise<NetworkStatus> {
  if (isNative()) {
    try {
      const Network = await getNetwork();
      const status = await Network.getStatus();
      return {
        connected: status.connected,
        connectionType: status.connectionType as NetworkStatus['connectionType'],
      };
    } catch {
      // fallthrough to web
    }
  }

  return {
    connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown',
  };
}

/** Subscribe to network status changes. Returns an unsubscribe function. */
export async function onNetworkChange(
  cb: (status: NetworkStatus) => void
): Promise<() => void> {
  if (isNative()) {
    try {
      const Network = await getNetwork();
      const handle = await Network.addListener('networkStatusChange', status => {
        cb({
          connected: status.connected,
          connectionType: status.connectionType as NetworkStatus['connectionType'],
        });
      });
      return () => { handle.remove(); };
    } catch {
      // fallthrough to web
    }
  }

  const onOnline = () => cb({ connected: true, connectionType: 'unknown' });
  const onOffline = () => cb({ connected: false, connectionType: 'none' });
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
