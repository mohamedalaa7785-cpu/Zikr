'use client';

import { useCallback, useEffect, useState } from 'react';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
}

interface UsePrayerTimesReturn {
  times: PrayerTimes | null;
  loading: boolean;
  error: Error | null;
  currentPrayer: string | null;
  nextPrayer: string | null;
  getPrayerTimes: (latitude: number, longitude: number) => Promise<void>;
}

export function usePrayerTimes(): UsePrayerTimesReturn {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPrayer] = useState<string | null>(null);
  const [nextPrayer] = useState<string | null>(null);

  const getPrayerTimes = useCallback(async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/prayer/times?lat=${latitude}&lng=${longitude}`);
      if (!response.ok) throw new Error('Failed to fetch prayer times');
      const data = await response.json();
      setTimes(data.timings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        getPrayerTimes(position.coords.latitude, position.coords.longitude);
      });
    }
  }, [getPrayerTimes]);

  return {
    times,
    loading,
    error,
    currentPrayer,
    nextPrayer,
    getPrayerTimes,
  };
}
