import { safeApiFetch } from '@/lib/services/http';
import type { PrayerResponse, QiblaResponse } from '@/lib/types/prayer';

const ALADHAN_BASE = 'https://api.aladhan.com/v1';

interface AladhanResponse<T> {
  code: number;
  status: string;
  data: T;
}

export async function getPrayerTimes(city: string, country: string): Promise<PrayerResponse | null> {
  const cleanCity = city.trim();
  const cleanCountry = country.trim();
  if (!cleanCity || !cleanCountry) return null;

  const url = `${ALADHAN_BASE}/timingsByCity?city=${encodeURIComponent(cleanCity)}&country=${encodeURIComponent(cleanCountry)}`;
  const { data: response } = await safeApiFetch<AladhanResponse<PrayerResponse>>(url);
  return response?.data ?? null;
}

export async function getPrayerTimesByCoordinates(lat: number, lng: number): Promise<PrayerResponse | null> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const url = `${ALADHAN_BASE}/timings?latitude=${lat}&longitude=${lng}`;
  const { data: response } = await safeApiFetch<AladhanResponse<PrayerResponse>>(url);
  return response?.data ?? null;
}

export async function getNextPrayer(prayer: PrayerResponse | null = null): Promise<{ name: string; time: string } | null> {
  if (!prayer) return null;
  const entries: Array<[string, string]> = Object.entries(prayer.timings)
    .filter(([name]) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(name))
    .map(([name, value]) => [name, String(value)]);
  const now = new Date();

  for (const [name, time] of entries) {
    const [hour, minute] = time.split(':').map((part) => Number.parseInt(part, 10));
    if (Number.isNaN(hour) || Number.isNaN(minute)) continue;

    const prayerDate = new Date(now);
    prayerDate.setHours(hour, minute, 0, 0);

    if (prayerDate > now) return { name, time };
  }

  const fajr = prayer.timings.Fajr;
  return fajr ? { name: 'Fajr', time: fajr } : null;
}

export async function getQiblaDirection(lat: number, lng: number): Promise<QiblaResponse | null> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const { data: response } = await safeApiFetch<AladhanResponse<{ direction: number }>>(
    `${ALADHAN_BASE}/qibla/${lat}/${lng}`,
  );

  return {
    latitude: lat,
    longitude: lng,
    direction: response?.data?.direction ?? 0,
  };
}
