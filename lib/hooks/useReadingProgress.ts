'use client';

import { useCallback, useState } from 'react';

interface Progress {
  id: string;
  userId: string;
  scope: 'quran' | 'hadith' | 'stories';
  ref: string;
  progressJson: Record<string, any>;
  updatedAt: string;
}

interface UseReadingProgressReturn {
  progress: Progress | null;
  loading: boolean;
  error: Error | null;
  saveProgress: (scope: Progress['scope'], ref: string, data: Record<string, any>) => Promise<void>;
  getProgress: (scope: Progress['scope'], ref: string) => Promise<void>;
}

export function useReadingProgress(): UseReadingProgressReturn {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getProgress = useCallback(async (scope: Progress['scope'], ref: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/user/progress/${scope}/${ref}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProgress = useCallback(async (scope: Progress['scope'], ref: string, data: Record<string, any>) => {
    try {
      setError(null);
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, ref, progressJson: data }),
      });
      if (!response.ok) throw new Error('Failed to save progress');
      const result = await response.json();
      setProgress(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  return {
    progress,
    loading,
    error,
    saveProgress,
    getProgress,
  };
}
