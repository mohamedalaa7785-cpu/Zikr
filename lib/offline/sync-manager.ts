/**
 * Offline Sync Manager
 * Handles background sync for favorites, bookmarks, and content updates
 */

import { addToSyncQueue, getSyncQueue, clearSyncQueue } from './indexeddb';

export interface SyncAction {
  type: 'add-favorite' | 'remove-favorite' | 'add-bookmark' | 'remove-bookmark' | 'update-progress';
  store: string;
  data: any;
  timestamp: number;
}

/**
 * Initialize sync manager
 */
export async function initializeSyncManager() {
  // Register for periodic sync
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const syncManager = (registration as any).sync;
      if (syncManager) {
        await syncManager.register('sync-content');
        console.log('[Sync] Periodic sync registered');
      }
    } catch (error) {
      console.error('[Sync] Failed to register periodic sync:', error);
    }
  }

  // Handle online event
  window.addEventListener('online', () => {
    console.log('[Sync] Back online - syncing queued actions');
    syncQueuedActions();
  });
}

/**
 * Queue an action for sync
 */
export async function queueAction(action: SyncAction) {
  try {
    await addToSyncQueue(action);
    console.log('[Sync] Action queued:', action.type);

    // If online, sync immediately
    if (navigator.onLine) {
      syncQueuedActions();
    }
  } catch (error) {
    console.error('[Sync] Failed to queue action:', error);
  }
}

/**
 * Sync all queued actions
 */
export async function syncQueuedActions() {
  if (!navigator.onLine) {
    console.log('[Sync] Offline - cannot sync');
    return;
  }

  try {
    const queue = await getSyncQueue();

    if (queue.length === 0) {
      return;
    }

    console.log(`[Sync] Syncing ${queue.length} queued actions...`);

    // Process each action
    const results: { success: number; failed: number } = { success: 0, failed: 0 };

    for (const action of queue) {
      try {
        await syncAction(action);
        results.success++;
      } catch (error) {
        console.error('[Sync] Failed to sync action:', error);
        results.failed++;
      }
    }

    // Clear queue if all succeeded
    if (results.failed === 0) {
      await clearSyncQueue();
      console.log(`[Sync] All ${results.success} actions synced successfully`);
    } else {
      console.log(
        `[Sync] Sync complete: ${results.success} success, ${results.failed} failed`
      );
    }
  } catch (error) {
    console.error('[Sync] Failed to sync queued actions:', error);
  }
}

/**
 * Sync individual action
 */
async function syncAction(action: SyncAction) {
  const { type, data } = action;

  switch (type) {
    case 'add-favorite':
      return syncFavorite(data, 'add');

    case 'remove-favorite':
      return syncFavorite(data, 'remove');

    case 'add-bookmark':
      return syncBookmark(data, 'add');

    case 'remove-bookmark':
      return syncBookmark(data, 'remove');

    case 'update-progress':
      return syncProgress(data);

    default:
      throw new Error(`Unknown sync action: ${type}`);
  }
}

/**
 * Sync favorite
 */
async function syncFavorite(data: any, action: 'add' | 'remove') {
  const response = await fetch('/api/favorites', {
    method: action === 'add' ? 'POST' : 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${action} favorite`);
  }

  return response.json();
}

/**
 * Sync bookmark
 */
async function syncBookmark(data: any, action: 'add' | 'remove') {
  const response = await fetch('/api/bookmarks', {
    method: action === 'add' ? 'POST' : 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${action} bookmark`);
  }

  return response.json();
}

/**
 * Sync progress
 */
async function syncProgress(data: any) {
  const response = await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to sync progress');
  }

  return response.json();
}

/**
 * Preload critical content
 */
export async function preloadCriticalContent() {
  try {
    console.log('[Sync] Preloading critical content...');

    const criticalRoutes = [
      '/quran',
      '/adhkar',
      '/dua',
      '/hadith',
      '/prayer-times',
    ];

    // Notify service worker to cache these
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const controller = (registration as any).controller || navigator.serviceWorker.controller;
      if (controller) {
        controller.postMessage({
          type: 'CACHE_URLS',
          urls: criticalRoutes,
        });
      }
    }

    console.log('[Sync] Critical content preload initiated');
  } catch (error) {
    console.error('[Sync] Failed to preload content:', error);
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<string> {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;

      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          const bytes = event.data.size || 0;
          const mb = (bytes / 1024 / 1024).toFixed(2);
          resolve(`${mb} MB`);
        };

        const controller = (registration as any).controller || navigator.serviceWorker.controller;
        if (controller) {
          controller.postMessage(
            {
              type: 'GET_CACHE_SIZE',
            },
            [channel.port2]
          );
        }
      });
    }

    return '0 MB';
  } catch (error) {
    console.error('[Sync] Failed to get cache size:', error);
    return 'unknown';
  }
}

/**
 * Clear cache
 */
export async function clearCache() {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const controller = (registration as any).controller || navigator.serviceWorker.controller;
      if (controller) {
        controller.postMessage({
          type: 'CLEAR_CACHE',
        });
        console.log('[Sync] Cache cleared');
      }
    }
  } catch (error) {
    console.error('[Sync] Failed to clear cache:', error);
  }
}
