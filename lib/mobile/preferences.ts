/**
 * Cross-platform secure key-value storage.
 * Native: @capacitor/preferences (encrypted on-device store)
 * Web: localStorage (standard browser storage)
 *
 * Use this instead of localStorage directly so native builds get proper
 * encrypted storage and web builds continue to work unchanged.
 */
import { isNative, getPreferences } from '@/lib/capacitor';

export async function setItem(key: string, value: string): Promise<void> {
  if (isNative()) {
    try {
      const Preferences = await getPreferences();
      await Preferences.set({ key, value });
      return;
    } catch {
      // fallthrough
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (isNative()) {
    try {
      const Preferences = await getPreferences();
      const { value } = await Preferences.get({ key });
      return value;
    } catch {
      // fallthrough
    }
  }
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

export async function removeItem(key: string): Promise<void> {
  if (isNative()) {
    try {
      const Preferences = await getPreferences();
      await Preferences.remove({ key });
      return;
    } catch {
      // fallthrough
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

export async function clearAll(): Promise<void> {
  if (isNative()) {
    try {
      const Preferences = await getPreferences();
      await Preferences.clear();
      return;
    } catch {
      // fallthrough
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
}
