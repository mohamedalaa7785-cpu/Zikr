import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor configuration for ZIKR — زِكرٌ
 *
 * The app runs as a native shell pointing at the production Vercel deployment
 * (server: { url }). This preserves Next.js SSR, API routes, and edge functions
 * without requiring a static export.
 *
 * For local development, override the server URL via the CAPACITOR_SERVER_URL
 * environment variable or point to your local Next.js dev server.
 */
const config: CapacitorConfig = {
  appId: 'com.zikr.app',
  appName: 'زِكرٌ',
  webDir: 'out',

  // Remote server URL — the native WebView loads the production app directly.
  // Remove the `server` block and run `next build && next export` to ship a
  // fully bundled (offline-capable) native build instead.
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://zikrmediaofficial.vercel.app',
    cleartext: false,
    // Allow the custom deep-link scheme and the production origin
    allowNavigation: [
      'zikrmediaofficial.vercel.app',
      '*.supabase.co',
    ],
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0f',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },

    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0a0a0f',
      overlaysWebView: false,
    },

    // Push Notifications — FCM on Android, APNs on iOS
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    // Local Notifications for prayer times (scheduled client-side)
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#C7A252',
      sound: 'adhan.mp3',
    },

    // Capacitor Browser — used for OAuth (Google sign-in) flows
    // Opens an in-app browser tab that can intercept the deep-link callback.
    Browser: {},

    // Haptics — available on iOS; vibration on Android
    Haptics: {},

    // Network status monitoring
    Network: {},

    // Geolocation for prayer time calculation
    Geolocation: {
      permissions: {
        android: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
        ios: ['NSLocationWhenInUseUsageDescription'],
      },
    },

    // Preferences (replaces localStorage for secure key-value storage)
    Preferences: {},

    // Filesystem for caching Quran audio locally
    Filesystem: {},

    // Camera for avatar upload
    Camera: {
      permissions: {
        android: ['CAMERA', 'READ_EXTERNAL_STORAGE'],
        ios: ['NSCameraUsageDescription', 'NSPhotoLibraryUsageDescription'],
      },
    },

    // Native share sheet
    Share: {},
  },

  android: {
    // Resolved in android/app/build.gradle — keep in sync
    minWebViewVersion: 60,
    // Allow the app:// and zikr:// custom schemes
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // Deep link intent-filter is configured in AndroidManifest.xml
  },

  ios: {
    // Scheme registered in Info.plist CFBundleURLSchemes
    scheme: 'zikr',
    // Universal Links entitlement is in the associated domains entitlement
    contentInset: 'automatic',
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
  },
};

export default config;
