'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { getPrayerTimes, getPrayerTimesByCity } from '@/lib/services/prayer-times';
import type { PrayerTimes } from '@/lib/types/prayer';

// ─── Navigation categories ────────────────────────────────────────────────────
const categories = [
  { label: 'القرآن الكريم', href: '/quran', color: 'from-emerald-900/60 to-emerald-800/30' },
  { label: 'الأحاديث', href: '/hadith', color: 'from-amber-900/60 to-amber-800/30' },
  { label: 'قصص الأنبياء', href: '/prophets', color: 'from-sky-900/60 to-sky-800/30' },
  { label: 'الصحابة', href: '/companions', color: 'from-rose-900/60 to-rose-800/30' },
  { label: 'الأذكار', href: '/adhkar', color: 'from-violet-900/60 to-violet-800/30' },
  { label: 'الأدعية', href: '/dua', color: 'from-teal-900/60 to-teal-800/30' },
  { label: 'المقالات', href: '/articles', color: 'from-indigo-900/60 to-indigo-800/30' },
  { label: 'الفيديوهات', href: '/videos', color: 'from-red-900/60 to-red-800/30' },
  { label: 'قسم الأطفال', href: '/kids', color: 'from-pink-900/60 to-pink-800/30' },
  { label: 'الرفيق الروحاني', href: '/spiritual-ai', color: 'from-green-900/60 to-green-800/30' },
  { label: 'الشعر', href: '/poetry', color: 'from-orange-900/60 to-orange-800/30' },
  { label: 'العلماء', href: '/scholars', color: 'from-cyan-900/60 to-cyan-800/30' },
  { label: 'الحفظ', href: '/memorization', color: 'from-yellow-900/60 to-yellow-800/30' },
  { label: 'مواقيت الصلاة', href: '/prayer-times', color: 'from-lime-900/60 to-lime-800/30' },
  { label: 'القبلة', href: '/qibla', color: 'from-fuchsia-900/60 to-fuchsia-800/30' },
  { label: 'الغزوات', href: '/battles', color: 'from-stone-900/60 to-stone-800/30' },
  { label: 'الفتوحات', href: '/conquests', color: 'from-amber-900/60 to-amber-800/30' },
  { label: 'المداحون', href: '/tawasheeh', color: 'from-purple-900/60 to-purple-800/30' },
  { label: 'القراء', href: '/reciters', color: 'from-emerald-800/60 to-emerald-700/30' },
  { label: 'إذاعة القرآن', href: '/radio', color: 'from-blue-900/60 to-blue-800/30' },
  { label: 'عداد التسبيح', href: '/tasbeeh', color: 'from-rose-900/60 to-rose-800/30' },
  { label: 'قناة يوتيوب', href: '/youtube', color: 'from-neutral-900/60 to-neutral-800/30' },
];

const sidebarLinks = [
  { href: '/quran', label: 'القرآن الكريم' },
  { href: '/hadith', label: 'الأحاديث' },
  { href: '/prophets', label: 'قصص الأنبياء' },
  { href: '/companions', label: 'الصحابة' },
  { href: '/adhkar', label: 'الأذكار' },
  { href: '/dua', label: 'الأدعية' },
  { href: '/prayer-times', label: 'مواقيت الصلاة' },
  { href: '/qibla', label: 'القبلة' },
  { href: '/articles', label: 'المقالات' },
  { href: '/videos', label: 'الفيديوهات' },
  { href: '/kids', label: 'قسم الأطفال' },
  { href: '/scholars', label: 'العلماء' },
  { href: '/memorization', label: 'الحفظ' },
  { href: '/spiritual-ai', label: 'الرفيق الروحاني' },
  { href: '/poetry', label: 'الشعر' },
  { href: '/battles', label: 'الغزوات' },
  { href: '/conquests', label: 'الفتوحات' },
  { href: '/tawasheeh', label: 'المداحون' },
  { href: '/reciters', label: 'القراء' },
  { href: '/radio', label: 'إذاعة القرآن' },
  { href: '/tasbeeh', label: 'عداد التسبيح' },
  { href: '/youtube', label: 'قناة يوتيوب' },
  { href: '/search', label: 'البحث' },
];

const prayerNames = [
  { key: 'Fajr', label: 'الفجر' },
  { key: 'Sunrise', label: 'الشروق' },
  { key: 'Dhuhr', label: 'الظهر' },
  { key: 'Asr', label: 'العصر' },
  { key: 'Maghrib', label: 'المغرب' },
  { key: 'Isha', label: 'العشاء' },
] as const;

const stats = [
  { label: 'سورة قرآنية', value: '114' },
  { label: 'آية كريمة', value: '6236' },
  { label: 'جزءًا', value: '30' },
  { label: 'نبيًا ورسولًا في القرآن', value: '25' },
];

const featuredSections = [
  { href: '/quran', title: 'القرآن الكريم', desc: 'اقرأ واستمع إلى القرآن الكريم بأصوات قراء مميزين — 114 سورة', color: 'from-emerald-950/60' },
  { href: '/hadith', title: 'الحديث الشريف', desc: 'مجموعة شاملة من الأحاديث النبوية الصحيحة والموثقة', color: 'from-amber-950/60' },
  { href: '/stories', title: 'القصص الإسلامية', desc: 'قصص ملهمة من التاريخ الإسلامي وسير الأنبياء والصحابة', color: 'from-sky-950/60' },
  { href: '/adhkar', title: 'الأذكار اليومية', desc: 'أذكار الصباح والمساء وتسابيح يومية لتقوية الروح', color: 'from-violet-950/60' },
  { href: '/dua', title: 'الأدعية المأثورة', desc: 'مجموعة من الأدعية النبوية لمختلف المناسبات والأوقات', color: 'from-teal-950/60' },
  { href: '/spiritual-ai', title: 'الرفيق الروحاني', desc: 'مساعد ذكي للإجابة على أسئلتك الدينية والروحانية', color: 'from-green-950/60' },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
function getActivePrayer(timings: PrayerTimes, now: Date) {
  const toMinutes = (t: string) => {
    const [h, m] = t.replace(/\s*(AM|PM)/i, '').split(':').map(Number);
    return h * 60 + m;
  };
  const cur = now.getHours() * 60 + now.getMinutes();
  const keys: Array<'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'> = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  let active: (typeof keys)[number] | '' = '';
  for (let i = keys.length - 1; i >= 0; i--) {
    if (cur >= toMinutes(timings[keys[i]])) { active = keys[i]; break; }
  }
  const nextIdx = (keys.indexOf(active as (typeof keys)[number]) + 1) % keys.length;
  return { active, next: keys[nextIdx] };
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerCity, setPrayerCity] = useState('Cairo');
  const [cityInput, setCityInput] = useState('');
  const [loadingPrayer, setLoadingPrayer] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activePrayer, setActivePrayer] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (prayerTimes && currentTime) {
      const { active, next } = getActivePrayer(prayerTimes, currentTime);
      setActivePrayer(active);
      setNextPrayer(next);
    }
  }, [currentTime, prayerTimes]);

  // Fetch prayer times: try geolocation first, fall back to city name
  const fetchPrayerByCity = useCallback(async (city: string) => {
    setLoadingPrayer(true);
    try {
      const res = await getPrayerTimesByCity(city, 'Egypt');
      if (res?.data?.timings) {
        setPrayerTimes(res.data.timings as PrayerTimes);
      }
    } catch { /* silent */ } finally {
      setLoadingPrayer(false);
    }
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      fetchPrayerByCity(prayerCity);
      return;
    }
    setLoadingPrayer(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await getPrayerTimes(latitude, longitude);
          if (res?.data?.timings) {
            setPrayerTimes(res.data.timings as PrayerTimes);
          } else {
            await fetchPrayerByCity(prayerCity);
          }
        } catch {
          await fetchPrayerByCity(prayerCity);
        } finally {
          setLoadingPrayer(false);
        }
      },
      async () => {
        // Permission denied or unavailable — use city fallback
        await fetchPrayerByCity(prayerCity);
      },
      { timeout: 6000 }
    );
  }, [prayerCity, fetchPrayerByCity]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, router]);

  const timeStr = currentTime
    ? currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : null;

  const dateStr = currentTime
    ? currentTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-brand-emeraldDeep text-brand-cream">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden xl:flex w-56 flex-col gap-6 border-l border-brand-gold/15 bg-black/25 p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-brand-gold/60 uppercase mb-3">الأقسام</p>
            <nav className="flex flex-col gap-0.5" aria-label="روابط الأقسام">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm text-brand-cream/70 hover:text-brand-gold hover:bg-brand-gold/8 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Daily verse widget */}
          <div className="rounded-xl border border-brand-gold/20 bg-black/30 p-4 space-y-2">
            <p className="text-[10px] font-bold tracking-widest text-brand-gold/60 uppercase">الآية اليومية</p>
            <p className="text-sm leading-relaxed text-brand-cream/80 font-arabic" dir="rtl">
              &quot;وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ&quot;
            </p>
            <p className="text-xs text-brand-gold/50">البقرة - 216</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">

          {/* Hero */}
          <section className="relative border-b border-brand-gold/15 bg-gradient-to-b from-brand-emeraldDeep via-[#071f16] to-black/40 px-4 pt-10 pb-12">
            <Container className="space-y-8">

              {/* Title + time */}
              <div className="text-center space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold text-brand-gold tracking-tight text-shadow-gold text-balance">
                  ذِكرٌ
                </h1>
                <p className="text-brand-cream/60 text-base md:text-lg">منصتك الروحانية الشاملة</p>
                {timeStr && (
                  <div className="flex flex-col items-center gap-1 mt-3">
                    <span className="text-3xl font-mono font-bold text-brand-gold tabular-nums">{timeStr}</span>
                    <span className="text-sm text-brand-cream/50">{dateStr}</span>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="max-w-xl mx-auto">
                <form onSubmit={handleSearch} className="relative" role="search">
                  <input
                    type="search"
                    placeholder="ابحث عن آية أو حديث أو قصة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault();
                    }}
                    aria-label="البحث في المحتوى"
                    className="w-full px-5 py-3.5 pr-12 rounded-xl border border-brand-gold/25 bg-black/30 text-brand-cream placeholder:text-brand-cream/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/15 text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold/70 hover:text-brand-gold transition-colors"
                    aria-label="بحث"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Category bento grid */}
              <nav className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5" aria-label="أقسام المنصة">
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`group flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border border-brand-gold/15 bg-gradient-to-br ${cat.color} hover:border-brand-gold/40 hover:scale-105 transition-all duration-200 min-h-[64px]`}
                  >
                    <span className="text-[10px] text-center text-brand-cream/65 group-hover:text-brand-gold leading-tight">{cat.label}</span>
                  </Link>
                ))}
              </nav>
            </Container>
          </section>

          {/* Prayer Times */}
          <section className="border-b border-brand-gold/15 px-4 py-10" aria-labelledby="prayer-times-heading">
            <Container className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 id="prayer-times-heading" className="text-xl font-bold text-brand-gold">مواقيت الصلاة</h2>
                  <p className="text-xs text-brand-cream/40 mt-0.5">{prayerCity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = cityInput.trim();
                      if (val) { setPrayerCity(val); setCityInput(''); }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="غيّر المدينة..."
                      className="px-3 py-1.5 rounded-lg border border-brand-gold/20 bg-black/30 text-brand-cream text-xs placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-gold/50 w-32"
                      aria-label="اسم المدينة"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg border border-brand-gold/30 text-brand-gold text-xs hover:border-brand-gold/60 transition-colors"
                    >
                      بحث
                    </button>
                  </form>
                  <Link href="/prayer-times" className="text-xs text-brand-gold/60 hover:text-brand-gold transition-colors whitespace-nowrap">
                    التفاصيل
                  </Link>
                </div>
              </div>

              {prayerTimes && !loadingPrayer ? (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {prayerNames.map(({ key, label }) => {
                    const isActive = activePrayer === key;
                    const isNext = nextPrayer === key;
                    return (
                      <div
                        key={key}
                        className={`rounded-xl border p-3 text-center transition-all duration-300 ${
                          isActive
                            ? 'border-brand-gold bg-brand-gold/15 shadow-lg shadow-brand-gold/10'
                            : isNext
                            ? 'border-brand-gold/40 bg-brand-gold/5'
                            : 'border-brand-gold/10 bg-black/20 hover:border-brand-gold/25'
                        }`}
                      >
                        <p className="text-[10px] text-brand-gold/60 mb-1.5">{label}</p>
                        <p className="text-base font-bold text-brand-cream tabular-nums">
                          {prayerTimes[key]?.replace(/\s*(AM|PM)/i, '') ?? '--:--'}
                        </p>
                        {isActive && (
                          <span className="mt-1 inline-block text-[9px] text-brand-gold font-semibold tracking-wider uppercase">الآن</span>
                        )}
                        {isNext && !isActive && (
                          <span className="mt-1 inline-block text-[9px] text-brand-gold/60 font-semibold tracking-wider uppercase">القادمة</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {prayerNames.map(({ label }) => (
                    <div key={label} className="rounded-xl border border-brand-gold/10 bg-black/20 p-3 text-center animate-pulse">
                      <p className="text-[10px] text-brand-gold/40 mb-1.5">{label}</p>
                      <div className="h-5 w-14 bg-brand-gold/10 rounded mx-auto" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Link
                  href="/prayer-times"
                  className="rounded-lg border border-brand-gold/30 px-4 py-2 text-sm text-brand-cream/70 hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  مواقيت الصلاة التفصيلية
                </Link>
                <Link
                  href="/qibla"
                  className="rounded-lg border border-brand-gold/15 px-4 py-2 text-sm text-brand-cream/50 hover:border-brand-gold/30 hover:text-brand-cream/70 transition-colors"
                >
                  اتجاه القبلة
                </Link>
              </div>
            </Container>
          </section>

          {/* Featured sections */}
          <section className="border-b border-brand-gold/15 px-4 py-10" aria-labelledby="featured-heading">
            <Container className="space-y-5">
              <h2 id="featured-heading" className="text-xl font-bold text-brand-gold">الأقسام الرئيسية</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredSections.map((sec) => (
                  <Link
                    key={sec.href}
                    href={sec.href}
                    className={`group block rounded-2xl border border-brand-gold/15 bg-gradient-to-br ${sec.color} to-black/40 p-6 hover:border-brand-gold/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-gold/5`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-gold/15 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-brand-gold/60" />
                      </div>
                      <span className="text-xs text-brand-gold/40 group-hover:text-brand-gold transition-colors">تصفح</span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-gold mb-1">{sec.title}</h3>
                    <p className="text-sm text-brand-cream/50 leading-relaxed">{sec.desc}</p>
                  </Link>
                ))}
              </div>
            </Container>
          </section>

          {/* More content row */}
          <section className="border-b border-brand-gold/15 px-4 py-10" aria-labelledby="more-content-heading">
            <Container className="space-y-5">
              <h2 id="more-content-heading" className="text-xl font-bold text-brand-gold">المزيد من المحتوى</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { href: '/prophets', label: 'قصص الأنبياء' },
                  { href: '/companions', label: 'الصحابة' },
                  { href: '/scholars', label: 'العلماء' },
                  { href: '/kids', label: 'قسم الأطفال' },
                  { href: '/radio', label: 'إذاعة القرآن' },
                  { href: '/tasbeeh', label: 'عداد التسبيح' },
                  { href: '/youtube', label: 'قناة يوتيوب' },
                  { href: '/battles', label: 'الغزوات الإسلامية' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between px-4 py-3 rounded-xl border border-brand-gold/12 bg-black/20 hover:border-brand-gold/35 hover:bg-black/30 transition-all"
                  >
                    <span className="text-sm text-brand-cream/65 group-hover:text-brand-gold transition-colors">{item.label}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-brand-gold/30 group-hover:text-brand-gold/60 transition-colors rotate-180">
                      <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </Link>
                ))}
              </div>
            </Container>
          </section>

          {/* Stats */}
          <section className="border-b border-brand-gold/15 px-4 py-10" aria-labelledby="stats-heading">
            <Container className="space-y-5">
              <h2 id="stats-heading" className="text-xl font-bold text-brand-gold">أرقام من القرآن الكريم</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card
                    key={stat.label}
                    className="text-center py-6 px-4 space-y-2 bg-black/20 border-brand-gold/10 hover:border-brand-gold/30 transition-colors"
                  >
                    <p className="text-4xl font-bold text-brand-gold tabular-nums">{stat.value}</p>
                    <p className="text-xs text-brand-cream/50">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </Container>
          </section>

          {/* Quran verse CTA */}
          <section className="px-4 py-16">
            <Container>
              <Card className="text-center py-12 space-y-5 bg-gradient-to-br from-brand-emeraldDeep to-black/60 border-brand-gold/20">
                <p className="text-2xl md:text-3xl font-arabic leading-loose text-brand-cream font-bold" dir="rtl">
                  &quot;إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ&quot;
                </p>
                <p className="text-brand-gold/70 text-sm">سورة الإسراء - الآية 9</p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href="/quran"
                    className="rounded-lg bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-emeraldDeep hover:bg-brand-goldSoft transition-colors"
                  >
                    اقرأ القرآن الكريم
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-lg border border-brand-gold/30 px-6 py-2.5 text-sm text-brand-cream/70 hover:border-brand-gold hover:text-brand-gold transition-colors"
                  >
                    إنشاء حساب مجاني
                  </Link>
                </div>
              </Card>
            </Container>
          </section>

        </main>
      </div>
    </div>
  );
}
