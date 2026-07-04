'use client';

import { useCallback, useState } from 'react';

interface SearchResult {
  id: string;
  type: 'quran' | 'hadith' | 'dua' | 'story' | 'article';
  title: string;
  content: string;
  url: string;
}

interface UseSearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
}
