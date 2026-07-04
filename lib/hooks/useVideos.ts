'use client';

import { useCallback, useState, useEffect } from 'react';

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration: number;
  youtubeUrl?: string;
  category?: string;
  createdAt: string;
}

interface UseVideosReturn {
  videos: Video[];
  loading: boolean;
  error: Error | null;
  getVideos: (category?: string) => Promise<void>;
  getVideoById: (id: string) => Promise<Video | null>;
}

export function useVideos(): UseVideosReturn {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getVideos = useCallback(async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = category ? `/api/videos?category=${category}` : '/api/videos';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getVideoById = useCallback(async (id: string): Promise<Video | null> => {
    try {
      setError(null);
      const response = await fetch(`/api/videos/${id}`);
      if (!response.ok) throw new Error('Failed to fetch video');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    }
  }, []);

  return {
    videos,
    loading,
    error,
    getVideos,
    getVideoById,
  };
}
