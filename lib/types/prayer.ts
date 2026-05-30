export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
}

export interface PrayerMeta {
  timezone: string;
  method: string;
  date: string;
}

export interface PrayerResponse {
  timings: PrayerTimes;
  meta: PrayerMeta;
}

export interface QiblaResponse {
  latitude: number;
  longitude: number;
  direction: number;
}

export interface NextPrayerResult {
  name: keyof PrayerTimes | null;
  time: string | null;
  minutesRemaining: number | null;
}
