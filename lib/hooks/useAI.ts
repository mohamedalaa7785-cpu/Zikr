'use client';

import { useCallback, useState } from 'react';

interface AIResponse {
  id: string;
  content: string;
  type: 'text' | 'image' | 'summary';
  createdAt: string;
}

interface UseAIReturn {
  response: AIResponse | null;
  loading: boolean;
  error: Error | null;
  generateContent: (prompt: string, type: string) => Promise<void>;
  generateSummary: (text: string) => Promise<void>;
  explainTafsir: (surahId: number, ayahNumber: number) => Promise<void>;
}

export function useAI(): UseAIReturn {
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateContent = useCallback(async (prompt: string, type: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSummary = useCallback(async (text: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Summarization failed');
      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const explainTafsir = useCallback(async (surahId: number, ayahNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/ai/tafsir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surahId, ayahNumber }),
      });
      if (!response.ok) throw new Error('Explanation failed');
      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    response,
    loading,
    error,
    generateContent,
    generateSummary,
    explainTafsir,
  };
}
