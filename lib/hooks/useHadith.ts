'use client';

import { useCallback, useState } from 'react';

interface HadithBook {
  id: string;
  nameAr: string;
  nameEn: string;
  hadithCount?: number;
}

interface Hadith {
  id: string;
  bookId: string;
  hadithNumber: string;
  textAr: string;
  textEn?: string;
  gradeAr?: string;
  gradeEn?: string;
}

interface UseHadithReturn {
  books: HadithBook[];
  hadiths: Hadith[];
  loading: boolean;
  error: Error | null;
  getBooks: () => Promise<void>;
  getHadiths: (bookId: string) => Promise<void>;
  searchHadiths: (query: string) => Promise<Hadith[]>;
}

export function useHadith(): UseHadithReturn {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/hadith/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getHadiths = useCallback(async (bookId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/hadith/books/${bookId}/hadiths`);
      if (!response.ok) throw new Error('Failed to fetch hadiths');
      const data = await response.json();
      setHadiths(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchHadiths = useCallback(async (query: string): Promise<Hadith[]> => {
    try {
      const response = await fetch(`/api/hadith/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  }, []);

  return {
    books,
    hadiths,
    loading,
    error,
    getBooks,
    getHadiths,
    searchHadiths,
  };
}
