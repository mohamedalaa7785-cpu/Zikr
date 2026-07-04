'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseLocalStorageReturn<T> {
  value: T | null;
  setValue: (value: T) => void;
  removeValue: () => void;
}

export function useLocalStorage<T>(key: string, initialValue: T | null = null): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T | null>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const updateValue = useCallback((newValue: T) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  const removeValue = useCallback(() => {
    try {
      setValue(null);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return { value, setValue: updateValue, removeValue };
}
