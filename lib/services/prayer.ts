import { safeFetchJson } from "@/lib/services/_http";
import type { ServiceResult } from "@/lib/types/common";
import type { NextPrayerResult, PrayerResponse, PrayerTimes, QiblaResponse } from "@/lib/types/prayer";

const PRAYER_BASE_URL = "https://api.aladhan.com/v1";

async function fetchPrayer<T>(path: string): Promise<ServiceResult<{ code: number; data: T }>> {
  return safeFetchJson<{ code: number; data: T }>(`${PRAYER_BASE_URL}${path}`, undefined, {
    revalidate: 900,
    tags: ["prayer"],
  });
}

function normalizePrayer(data: { timings: PrayerTimes; meta: { timezone: string; method: { name: string } }; date: { gregorian: { date: string } } }): PrayerResponse {
  return {
    timings: data.timings,
    meta: {
      timezone: data.meta.timezone,
      method: data.meta.method.name,
      date: data.date.gregorian.date,
    },
  };
}

export async function getPrayerTimes(city: string, country: string): Promise<ServiceResult<PrayerResponse>> {
  const response = await fetchPrayer(`/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
  return { ...response, data: response.data ? normalizePrayer(response.data.data as any) : null };
}

export async function getPrayerTimesByCoordinates(lat: number, lng: number): Promise<ServiceResult<PrayerResponse>> {
  const response = await fetchPrayer(`/timings?latitude=${lat}&longitude=${lng}`);
  return { ...response, data: response.data ? normalizePrayer(response.data.data as any) : null };
}

export function getNextPrayer(timings?: PrayerTimes): NextPrayerResult {
  if (!timings) return { name: null, time: null, minutesRemaining: null };
  const now = new Date();

  for (const [name, time] of Object.entries(timings)) {
    if (!time || !time.includes(":")) continue;
    const [hour, minute] = time.split(":").map(Number);
    const prayer = new Date(now);
    prayer.setHours(hour, minute, 0, 0);
    const diff = Math.round((prayer.getTime() - now.getTime()) / 60_000);
    if (diff >= 0) return { name: name as keyof PrayerTimes, time, minutesRemaining: diff };
  }

  return { name: null, time: null, minutesRemaining: null };
}

export async function getQiblaDirection(lat: number, lng: number): Promise<ServiceResult<QiblaResponse>> {
  const response = await fetchPrayer<{ latitude: number; longitude: number; direction: number }>(`/qibla/${lat}/${lng}`);
  return { ...response, data: response.data?.data ?? null };
}
