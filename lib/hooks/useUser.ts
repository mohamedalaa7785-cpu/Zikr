'use client';

import { useEffect, useState } from 'react';
import { useCallback } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return;
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    isAdmin: user?.role === 'admin' || false,
    isAuthenticated: !!user,
    refetch: fetchUser,
  };
}
