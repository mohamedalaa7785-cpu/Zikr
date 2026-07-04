'use client';

import { useCallback, useState } from 'react';

interface Profile {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  getProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    try {
      setError(null);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload avatar');
      const data = await response.json();
      setProfile((prev) => prev ? { ...prev, avatarUrl: data.avatarUrl } : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  return {
    profile,
    loading,
    error,
    getProfile,
    updateProfile,
    uploadAvatar,
  };
}
