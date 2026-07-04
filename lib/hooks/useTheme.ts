'use client';

import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(savedTheme === 'dark' || (savedTheme === 'system' && prefersDark));
  }, []);

  const updateTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const shouldBeDark = newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggle = useCallback(() => {
    const newTheme: Theme = isDark ? 'light' : 'dark';
    updateTheme(newTheme);
  }, [isDark, updateTheme]);

  return {
    theme,
    isDark,
    setTheme: updateTheme,
    toggle,
  };
}
