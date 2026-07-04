'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMemo } from 'react';

interface Surah {
  id: number;
  nameAr: string;
  nameEn: string;
  ayahsCount: number;
  slug: string;
}

interface Ayah {
  id: string;
  surahId: number;
  ayahNumber: number;
  textAr: string;
  textEn?: string;
  page?: number;
  juz?: number;
}

interface UseQuranReturn {
  surahs: Surah[];
  ayahs: Ayah[];
  currentSurah: Surah | null;
  loading: boolean;
  error: Error | null;
  getSurah: (surahId: number) => Promise<void>;
  getAyahs: (surahId: number) => Promise<void>;
  searchAyahs: (query: string) => Promise<Ayah[]>;
}

export function useQuran(): UseQuranReturn {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getSurah = useCallback(async (surahId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/quran/surahs/${surahId}`);
      if (!response.ok) throw new Error('Failed to fetch surah');
      
      const data = await response.json();
      setCurrentSurah(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getAyahs = useCallback(async (surahId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/quran/surahs/${surahId}/ayahs`);
      if (!response.ok) throw new Error('Failed to fetch ayahs');
      
      const data = await response.json();
      setAyahs(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAyahs = useCallback(async (query: string): Promise<Ayah[]> => {
    try {
      const response = await fetch(`/api/quran/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search');
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  }, []);

  // Fetch all surahs on mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/quran/surahs');
        if (!response.ok) throw new Error('Failed to fetch surahs');
        
        const data = await response.json();
        setSurahs(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  return {
    surahs,
    ayahs,
    currentSurah,
    loading,
    error,
    getSurah,
    getAyahs,
    searchAyahs,
  };
}
