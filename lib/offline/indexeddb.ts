/**
 * IndexedDB Utilities for Offline Content Storage
 * Stores Quran, Adhkar, Hadith, and other content locally for offline access
 */

const DB_NAME = 'zikr-offline-db';
const DB_VERSION = 2;

// Object stores
export const STORES = {
  QURAN: 'quran-content',
  ADHKAR: 'adhkar-content',
  HADITH: 'hadith-content',
  DUAS: 'duas-content',
  TAFSIR: 'tafsir-content',
  CONTENT_INDEX: 'content-index',
  SYNC_QUEUE: 'sync-queue',
  FAVORITES: 'favorites',
  BOOKMARKS: 'bookmarks',
} as const;

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB with schema
 */
export async function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[IndexedDB] Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('[IndexedDB] Database initialized successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!database.objectStoreNames.contains(STORES.QURAN)) {
        const quranStore = database.createObjectStore(STORES.QURAN, { keyPath: 'id' });
        quranStore.createIndex('surah', 'surah', { unique: false });
        quranStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.ADHKAR)) {
        const adhkarStore = database.createObjectStore(STORES.ADHKAR, { keyPath: 'id' });
        adhkarStore.createIndex('category', 'category', { unique: false });
        adhkarStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.HADITH)) {
        const hadithStore = database.createObjectStore(STORES.HADITH, { keyPath: 'id' });
        hadithStore.createIndex('book', 'book', { unique: false });
        hadithStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.DUAS)) {
        const duasStore = database.createObjectStore(STORES.DUAS, { keyPath: 'id' });
        duasStore.createIndex('category', 'category', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.TAFSIR)) {
        const tafsirStore = database.createObjectStore(STORES.TAFSIR, { keyPath: 'id' });
        tafsirStore.createIndex('surah', 'surah', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.CONTENT_INDEX)) {
        database.createObjectStore(STORES.CONTENT_INDEX, { keyPath: 'type' });
      }

      if (!database.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        database.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
      }

      if (!database.objectStoreNames.contains(STORES.FAVORITES)) {
        database.createObjectStore(STORES.FAVORITES, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.BOOKMARKS)) {
        database.createObjectStore(STORES.BOOKMARKS, { keyPath: 'id' });
      }

      console.log('[IndexedDB] Database schema created');
    };
  });
}

/**
 * Get database instance
 */
async function getDB(): Promise<IDBDatabase> {
  if (!db) {
    db = await initializeDB();
  }
  return db;
}

/**
 * Store content in IndexedDB
 */
export async function storeContent(
  store: (typeof STORES)[keyof typeof STORES],
  data: any
): Promise<IDBValidKey> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.add(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Batch store multiple items
 */
export async function batchStoreContent(
  store: (typeof STORES)[keyof typeof STORES],
  items: any[]
): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], 'readwrite');
    const objectStore = transaction.objectStore(store);

    items.forEach((item) => {
      objectStore.put(item);
    });

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => {
      console.log(`[IndexedDB] Stored ${items.length} items in ${store}`);
      resolve();
    };
  });
}

/**
 * Get content from IndexedDB
 */
export async function getContent(
  store: (typeof STORES)[keyof typeof STORES],
  key: IDBValidKey
): Promise<any> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], 'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Get all content from a store
 */
export async function getAllContent(
  store: (typeof STORES)[keyof typeof STORES]
): Promise<any[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], 'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Query content by index
 */
export async function queryContent(
  store: (typeof STORES)[keyof typeof STORES],
  indexName: string,
  value: IDBValidKey
): Promise<any[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], 'readonly');
    const objectStore = transaction.objectStore(store);
    const index = objectStore.index(indexName);
    const request = index.getAll(value);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Delete content
 */
export async function deleteContent(
  store: (typeof STORES)[keyof typeof STORES],
  key: IDBValidKey
): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Clear entire store
 */
export async function clearStore(
  store: (typeof STORES)[keyof typeof STORES]
): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      console.log(`[IndexedDB] Cleared ${store}`);
      resolve();
    };
  });
}

/**
 * Get total storage size
 */
export async function getStorageSize(): Promise<{ used: number; quota: number }> {
  if (!navigator.storage?.estimate) {
    return { used: 0, quota: 0 };
  }

  const estimate = await navigator.storage.estimate();
  return {
    used: estimate.usage || 0,
    quota: estimate.quota || 0,
  };
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) {
    return false;
  }

  try {
    const persistent = await navigator.storage.persist();
    console.log(`[Storage] Persistent storage granted: ${persistent}`);
    return persistent;
  } catch (error) {
    console.error('[Storage] Failed to request persistent storage:', error);
    return false;
  }
}

/**
 * Add to sync queue for later synchronization
 */
export async function addToSyncQueue(action: {
  type: string;
  store: string;
  data: any;
  timestamp: number;
}): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const objectStore = transaction.objectStore(STORES.SYNC_QUEUE);
    const request = objectStore.add(action);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get all sync queue items
 */
export async function getSyncQueue(): Promise<any[]> {
  return getAllContent(STORES.SYNC_QUEUE);
}

/**
 * Clear sync queue
 */
export async function clearSyncQueue(): Promise<void> {
  return clearStore(STORES.SYNC_QUEUE);
}

/**
 * Add favorite
 */
export async function addFavorite(favorite: {
  id: string;
  type: string;
  title: string;
  url: string;
  data: any;
  timestamp: number;
}): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.FAVORITES], 'readwrite');
    const objectStore = transaction.objectStore(STORES.FAVORITES);
    const request = objectStore.put(favorite);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get all favorites
 */
export async function getFavorites(): Promise<any[]> {
  return getAllContent(STORES.FAVORITES);
}

/**
 * Remove favorite
 */
export async function removeFavorite(id: string): Promise<void> {
  return deleteContent(STORES.FAVORITES, id);
}
