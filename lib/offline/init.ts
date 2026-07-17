/**
 * Initialize Offline Support
 * Run this on app startup to enable full offline functionality
 */

import { initializeDB, requestPersistentStorage } from './indexeddb';
import { initializeSyncManager, preloadCriticalContent } from './sync-manager';

let initialized = false;

export async function initializeOfflineSupport() {
  if (initialized) {
    return;
  }

  try {
    console.log('[Offline] Initializing offline support...');

    // Initialize IndexedDB
    await initializeDB();
    console.log('[Offline] IndexedDB initialized');

    // Request persistent storage
    const persistent = await requestPersistentStorage();
    if (persistent) {
      console.log('[Offline] Persistent storage granted');
    }

    // Initialize sync manager
    await initializeSyncManager();
    console.log('[Offline] Sync manager initialized');

    // Preload critical content
    await preloadCriticalContent();
    console.log('[Offline] Critical content preload started');

    initialized = true;
    console.log('[Offline] Offline support fully initialized');
  } catch (error) {
    console.error('[Offline] Failed to initialize offline support:', error);
    // Don't throw - offline support is optional
  }
}
