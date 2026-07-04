'use client';

import { useEffect, useState } from 'react';

interface UseDebouncedReturn {
  debouncedValue: string;
}

export function useDebounce(value: string, delay: number = 500): UseDebouncedReturn {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return { debouncedValue };
}
