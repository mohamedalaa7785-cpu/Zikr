'use client';

import { useEffect } from 'react';

type CapacitorPlugin = Record<string, (...args: unknown[]) => Promise<unknown> | unknown>;
type CapacitorWindow = Window & {
  Capacitor?: {
    isNativePlatform?: () => boolean;
    Plugins?: Record<string, CapacitorPlugin | undefined>;
  };
  zikrNative?: {
    isNative: boolean;
    share: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
    haptic: (style?: 'LIGHT' | 'MEDIUM' | 'HEAVY') => Promise<void>;
    pickImage: () => Promise<unknown>;
    writeFile: (path: string, data: string) => Promise<unknown>;
    getNetworkStatus: () => Promise<unknown>;
  };
};

function getNativePlugins() {
  const capacitor = (window as CapacitorWindow).Capacitor;
  if (!capacitor?.isNativePlatform?.()) return null;
  return capacitor.Plugins ?? null;
}

function installNativeFacade(plugins: Record<string, CapacitorPlugin | undefined>) {
  const nativeWindow = window as CapacitorWindow;

  nativeWindow.zikrNative = {
    isNative: true,
    async share(data) {
      if (plugins.Share?.share) {
        await plugins.Share.share(data);
        return;
      }
      if (navigator.share) await navigator.share(data);
    },
    async haptic(style = 'LIGHT') {
      await plugins.Haptics?.impact?.({ style });
    },
    async pickImage() {
      return plugins.Camera?.getPhoto?.({
        quality: 88,
        allowEditing: false,
        resultType: 'uri',
        source: 'PROMPT',
      });
    },
    async writeFile(path, data) {
      return plugins.Filesystem?.writeFile?.({
        path,
        data,
        directory: 'DATA',
        recursive: true,
      });
    },
    async getNetworkStatus() {
      return plugins.Network?.getStatus?.();
    },
  };
}

export function NativeCapacitorBridge() {
  useEffect(() => {
    const plugins = getNativePlugins();
    if (!plugins) return;

    installNativeFacade(plugins);
    document.documentElement.classList.add('capacitor-native');

    void plugins.StatusBar?.setStyle?.({ style: 'DARK' });
    void plugins.StatusBar?.setBackgroundColor?.({ color: '#000000' });
    void plugins.SplashScreen?.hide?.();

    const app = plugins.App;
    const network = plugins.Network;
    const localNotifications = plugins.LocalNotifications;

    void localNotifications?.requestPermissions?.();
    void plugins.PushNotifications?.requestPermissions?.();

    const syncNetworkState = async () => {
      const status = (await network?.getStatus?.()) as { connected?: boolean } | undefined;
      document.documentElement.dataset.network = status?.connected === false ? 'offline' : 'online';
      window.dispatchEvent(new CustomEvent('zikr:native-network', { detail: status }));
    };

    void syncNetworkState();
    void network?.addListener?.('networkStatusChange', (status: unknown) => {
      document.documentElement.dataset.network =
        (status as { connected?: boolean })?.connected === false ? 'offline' : 'online';
      window.dispatchEvent(new CustomEvent('zikr:native-network', { detail: status }));
    });

    void app?.addListener?.('appUrlOpen', (event: unknown) => {
      const url = (event as { url?: string })?.url;
      if (!url) return;

      const parsed = new URL(url);
      const next = parsed.searchParams.get('next');
      const isCustomAuthCallback =
        parsed.protocol === 'com.zikr.app:' &&
        parsed.hostname === 'auth' &&
        parsed.pathname.startsWith('/callback');
      const target = parsed.protocol === 'com.zikr.app:' && next
        ? next
        : isCustomAuthCallback
          ? `/auth/callback${parsed.search}${parsed.hash}`
          : `${parsed.pathname || '/'}${parsed.search}${parsed.hash}`;
      window.location.assign(target.startsWith('/') ? target : '/');
    });

    void app?.addListener?.('appStateChange', (state: unknown) => {
      window.dispatchEvent(new CustomEvent('zikr:native-app-state', { detail: state }));
    });
  }, []);

  return null;
}
