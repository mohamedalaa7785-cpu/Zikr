import { redirect } from 'next/navigation';

// /prayer is superseded by /prayer-times which has Cairo fallback,
// city search, and a more complete UI. Redirect permanently.
export default function PrayerPage() {
  redirect('/prayer-times');
}
