'use client';

import { useCallback, useState, useEffect } from 'react';

interface DuaCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

interface Dua {
  id: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn?: string;
  occasionAr?: string;
  categoryId?: string;
}

interface UseDuaReturn {
  categories: DuaCategory[];
  duas: Dua[];
  loading: boolean;
  error: Error | null;
  getCategories: () => Promise<void>;
  getDuas: (categoryId?: string) => Promise<void>;
  searchDuas: (query: string) => Promise<Dua[]>;
}

export function useDua(): UseDuaReturn {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/duas/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getDuas = useCallback(async (categoryId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = categoryId ? `/api/duas?category=${categoryId}` : '/api/duas';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch duas');
      const data = await response.json();
      setDuas(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchDuas = useCallback(async (query: string): Promise<Dua[]> => {
    try {
      const response = await fetch(`/api/duas/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return {
    categories,
    duas,
    loading,
    error,
    getCategories,
    getDuas,
    searchDuas,
  };
}
