/**
 * Capacitor platform detection and lazy-import helpers.
 *
 * All imports are guarded so that SSR (Node.js) and the web browser bundle
 * never execute native plugin code. Import this module only inside client
 * components or `useEffect` callbacks.
 */

/** True when running inside a Capacitor native WebView (Android or iOS). */
export function isNative(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    typeof (window as unknown as Record<string, unknown>).Capacitor !== 'undefined' &&
    !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
      ?.isNativePlatform?.()
  );
}

/** True when running on Android native. */
export function isAndroid(): boolean {
  if (!isNative()) return false;
  const cap = (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor;
  return cap?.getPlatform?.() === 'android';
}

/** True when running on iOS native. */
export function isIos(): boolean {
  if (!isNative()) return false;
  const cap = (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor;
  return cap?.getPlatform?.() === 'ios';
}

/** Lazily import the Capacitor core module (safe to call from the browser). */
export async function getCapacitorCore() {
  const { Capacitor } = await import('@capacitor/core');
  return Capacitor;
}

/** Lazily import the App plugin. */
export async function getApp() {
  const { App } = await import('@capacitor/app');
  return App;
}

/** Lazily import the Browser plugin (used for OAuth). */
export async function getBrowser() {
  const { Browser } = await import('@capacitor/browser');
  return Browser;
}

/** Lazily import LocalNotifications. */
export async function getLocalNotifications() {
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  return LocalNotifications;
}

/** Lazily import PushNotifications. */
export async function getPushNotifications() {
  const { PushNotifications } = await import('@capacitor/push-notifications');
  return PushNotifications;
}

/** Lazily import Haptics. */
export async function getHaptics() {
  const { Haptics } = await import('@capacitor/haptics');
  return Haptics;
}

/** Lazily import Network. */
export async function getNetwork() {
  const { Network } = await import('@capacitor/network');
  return Network;
}

/** Lazily import Share. */
export async function getShare() {
  const { Share } = await import('@capacitor/share');
  return Share;
}

/** Lazily import StatusBar. */
export async function getStatusBar() {
  const { StatusBar } = await import('@capacitor/status-bar');
  return StatusBar;
}

/** Lazily import Preferences (secure key-value). */
export async function getPreferences() {
  const { Preferences } = await import('@capacitor/preferences');
  return Preferences;
}

/** Lazily import Filesystem. */
export async function getFilesystem() {
  const { Filesystem } = await import('@capacitor/filesystem');
  return Filesystem;
}

/** Lazily import Camera. */
export async function getCamera() {
  const { Camera } = await import('@capacitor/camera');
  return Camera;
}

/** Lazily import Device. */
export async function getDevice() {
  const { Device } = await import('@capacitor/device');
  return Device;
}

/** Lazily import Geolocation. */
export async function getGeolocation() {
  const { Geolocation } = await import('@capacitor/geolocation');
  return Geolocation;
}
