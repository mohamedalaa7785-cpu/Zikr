'use client';

import { useCallback, useState, useEffect } from 'react';

interface Favorite {
  id: string;
  userId: string;
  itemType: 'quran' | 'hadith' | 'story' | 'scholar' | 'dua';
  itemRef: string;
  createdAt: string;
}

interface UseFavoritesReturn {
  favorites: Favorite[];
  loading: boolean;
  error: Error | null;
  addFavorite: (itemType: Favorite['itemType'], itemRef: string) => Promise<void>;
  removeFavorite: (favoriteId: string) => Promise<void>;
  isFavorited: (itemType: Favorite['itemType'], itemRef: string) => boolean;
  refetch: () => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/favorites');
      if (!response.ok) throw new Error('Failed to fetch favorites');
      
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addFavorite = useCallback(async (itemType: Favorite['itemType'], itemRef: string) => {
    try {
      setError(null);
      
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemRef }),
      });
      
      if (!response.ok) throw new Error('Failed to add favorite');
      
      const data = await response.json();
      setFavorites((prev) => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  const removeFavorite = useCallback(async (favoriteId: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/user/favorites/${favoriteId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove favorite');
      
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  const isFavorited = useCallback((itemType: Favorite['itemType'], itemRef: string) => {
    return favorites.some((f) => f.itemType === itemType && f.itemRef === itemRef);
  }, [favorites]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorited,
    refetch,
  };
}
