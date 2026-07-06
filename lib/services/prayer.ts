/**
 * prayer.ts — Thin re-export layer for backwards compatibility.
 *
 * All active prayer-time logic now lives in prayer-times.ts which has:
 *  - Cairo fallback when geolocation is denied
 *  - City search via timingsByCity / timingsByAddress
 *  - getCurrentPrayer / getNextPrayer helpers
 *
 * Code that still imports from here continues to work without changes.
 */

export {
  getPrayerTimes,
  getPrayerTimesByCity,
  getPrayerTimesByCoordinates,
  getNextPrayer,
  getCurrentPrayer,
  getPrayerNameAr,
  formatPrayerTime,
} from './prayer-times';

// Legacy type re-export for any code using PrayerResponse from this module
export type { PrayerTimesResponse as PrayerResponse } from './prayer-times';
