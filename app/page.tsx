'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { getPrayerTimesByCoordinates } from '@/lib/services/prayer';
import type { PrayerResponse, PrayerTimes } from '@/lib/types/prayer';

// ─── Navigation categories ────────────────────────────────────────────────────
const categories = [
  { label: 'القرآن الكريم', href: '/quran', icon: '📖', color: 'from-emerald-900/60 to-emerald-800/30' },
  { label: 'الأحاديث', href: '/hadith', icon: '📜', color: 'from-amber-900/60 to-amber-800/30' },
  { label: 'قصص الأنبياء', href: '/prophets', icon: '✨', color: 'from-sky-900/60 to-sky-800/30' },
  { label: 'الصحابة', href: '/companions', icon: '🌟', color: 'from-rose-900/60 to-rose-800/30' },
  { label: 'الأذكار', href: '/adhkar', icon: '🤲', color: 'from-violet-900/60 to-violet-800/30' },
  { label: 'الأدعية', href: '/dua', icon: '🙏', color: 'from-teal-900/60 to-teal-800/30' },
  { label: 'المقالات', href: '/articles', icon: '📰', color: 'from-indigo-900/60 to-indigo-800/30' },
  { label: 'الفيديوهات', href: '/videos', icon: '🎬', color: 'from-red-900/60 to-red-800/30' },
  { label: 'قسم الأطفال', href: '/kids', icon: '🌈', color: 'from-pink-900/60 to-pink-800/30' },
  { label: 'الروحاني', href: '/spiritual-ai', icon: '💚', color: 'from-green-900/60 to-green-800/30' },
  { label: 'الشعر', href: '/poetry', icon: '🪶', color: 'from-orange-900/60 to-orange-800/30' },
  { label: 'العلماء', href: '/scholars', icon: '🎓', color: 'from-cyan-900/60 to-cyan-800/30' },
  { label: 'الحفظ', href: '/memorization', icon: '🏆', color: 'from-yellow-900/60 to-yellow-800/30' },
  { label: 'الصلاة', href: '/prayer', icon: '🕌', color: 'from-lime-900/60 to-lime-800/30' },
  { label: 'القبلة', href: '/qibla', icon: '🧭', color: 'from-fuchsia-900/60 to-fuchsia-800/30' },
  { label: 'الغزوات', href: '/battles', icon: '⚔️', color: 'from-stone-900/60 to-stone-800/30' },
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
  { label: 'سور قرآنية', value: '114' },
  { label: 'أحاديث', value: '10K+' },
  { label: 'قصص', value: '500+' },
  { label: 'مستخدمين', value: '50K+' },
];

// ─── Helper: determine current/next prayer ────────────────────────────────────
function getActivePrayer(timings: PrayerTimes, now: Date) {
  const toMinutes = (t: string) => {
    const [h, m] = t.replace(/\s*(AM|PM)/i, '').split(':').map(Number);
    return h * 60 + m;
  };
  const cur = now.getHours() * 60 + now.getMinutes();
  const keys: Array<'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'> = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  let active: (typeof keys)[number] | '' = '';
  for (let i = keys.length - 1; i >= 0; i--) {
    if (cur >= toMinutes(timings[keys[i]])) {
      active = keys[i];
      break;
    }
  }
  const nextIdx = (keys.indexOf(active as (typeof keys)[number]) + 1) % keys.length;
  return { active, next: keys[nextIdx] };
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerResponse | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activePrayer, setActivePrayer] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');

  // Mount + clock tick — only starts client-side to prevent hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Update active/next prayer whenever time or timings change
  useEffect(() => {
    if (prayerTimes?.timings && currentTime) {
      const { active, next } = getActivePrayer(prayerTimes.timings, currentTime);
      setActivePrayer(active);
      setNextPrayer(next);
    }
  }, [currentTime, prayerTimes]);

  // Fetch prayer times
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          try {
            const times = await getPrayerTimesByCoordinates(latitude, longitude);
            if (times) setPrayerTimes(times);
          } catch {
            // silent fail
          }
        },
        () => {}
      );
    }
  }, []);

  // Use Latin numerals for the clock so it renders correctly in monospace font
  const timeStr = currentTime
    ? currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : null;

  const dateStr = currentTime
    ? currentTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-brand-emeraldDeep text-brand-cream">
      <div className="flex min-h-screen">

        {/* ── Right Sidebar ─────────────────────────────────────────── */}
        <aside className="hidden xl:flex w-56 flex-col gap-6 border-l border-brand-gold/15 bg-black/25 p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-brand-gold/60 uppercase mb-3">الأقسام</p>
            <nav className="flex flex-col gap-0.5">
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
            <p className="text-sm leading-relaxed text-brand-cream/80 font-arabic">
              "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ"
            </p>
            <p className="text-xs text-brand-gold/50">البقرة - 216</p>
          </div>
        </aside>

        {/* ── Main Content ───────────────────────────────────────────── */}
        <main className="flex-1 overflow-x-hidden">

          {/* Hero ─────────────────────────────────────────────────────── */}
          <section className="relative border-b border-brand-gold/15 bg-gradient-to-b from-brand-emeraldDeep via-[#071f16] to-black/40 px-4 pt-10 pb-12">
            <Container className="space-y-8">

              {/* Title + time */}
              <div className="text-center space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold text-brand-gold tracking-tight text-shadow-gold">
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="ابحث عن آية أو حديث أو قصة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`group flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-brand-gold/15 bg-gradient-to-br ${cat.color} hover:border-brand-gold/40 hover:scale-105 transition-all duration-200`}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="text-[10px] text-center text-brand-cream/65 group-hover:text-brand-gold leading-tight">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>

          {/* Prayer Times ────────────────────────────────────────────── */}
          <section className="border-b border-brand-gold/15 px-4 py-10">
            <Container className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-gold">مواقيت الصلاة</h2>
                <Link href="/prayer-times" className="text-xs text-brand-gold/60 hover:text-brand-gold transition-colors">
                  عر�� التفاصيل ←
                </Link>
              </div>

              {prayerTimes ? (
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
                          {prayerTimes.timings[key]?.replace(/\s*(AM|PM)/i, '') ?? '--:--'}
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
                <Button href="/prayer-times" variant="secondary" className="text-sm">
                  مواقيت الصلاة التفصيلية
                </Button>
                <Button href="/qibla" variant="ghost" className="text-sm">
                  اتجاه القبلة
                </Button>
              </div>
            </Container>
          </section>

          {/* Quick-access featured cards ─────────────────────────────── */}
          <section className="border-b border-brand-gold/15 px-4 py-10">
            <Container className="space-y-5">
              <h2 className="text-xl font-bold text-brand-gold">الأقسام الرئيسية</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Quran */}
                <Link href="/quran" className="group block rounded-2xl border border-brand-gold/15 bg-gradient-to-br from-emerald-950/60 to-black/40 p-6 hover:border-brand-gold/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-gold/5">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">📖</span>
                    <span className="text-xs text-brand-gold/40 group-hover:text-brand-gold transition-colors">اقرأ الآن ←</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-gold mb-1">القرآن الكريم</h3>
                  <p className="text-sm text-brand-cream/50 leading-relaxed">اقرأ واستمع إلى القرآن الكريم بأصوات قراء مميزين — 114 سورة</p>
                </Link>

                {/* Hadith */}
                <Link href="/hadith" className="group block rounded-2xl border border-brand-gold/15 bg-gradient-to-br from-amber-950/60 to-black/40 p-6 hover:border-brand-gold/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-gold/5">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">📜</span>
                    <span className="text-xs text-brand-gold/40 group-hover:text-brand-gold transition-colors">تصفح ←</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-gold mb-1">الحديث الشريف</h3>
                  <p className="text-sm text-brand-cream/50 leading-relaxed">مجموعة شاملة من الأحاديث النبوية الصحيحة والموثقة</p>
                </Link>

                {/* Stories */}
                <Link href="/stories" className="group block rounded-2xl border border-brand-gold/15 bg-gradient-to-br from-sky-950/60 to-black/40 p-6 hover:border-brand-gold/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-gold/5">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">🌙</span>
                    <span className="text-xs text-brand-gold/40 group-hover:text-brand-gold transition-colors">اكتشف ←</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-gold mb-1">القصص الإسلامية</h3>
                  <p className="text-sm text-brand-cream/50 leading-relaxed">قصص ملهمة من التاريخ الإسلامي وسير الأنبياء والصحابة</p>
                </Link>

                {/* Adhkar */}
                <Link href="/adhkar" className="group block rounded-2xl border border-brand-gold/15 bg-gradient-to-br from-violet-950/60 to-black/40 p-6 hover:border-brand-gold/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-gold/5">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">🤲</span>
                    <span className="text-xs text-brand-gold/40 group-hover:text-brand-gold transition-colors">ابدأ ←</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-gold mb-1">الأذكار اليومية</h3>
                  <p className="text-sm text-brand-cream/50 leading-relaxed">أذكار الصباح والمساء وتسابيح يومية لتقوية الروح</p>
                </Link>

                {/* Duas */}
                <Link href="/dua" className="group block rounded-2xl border border-brand-gold/15 bg-gradient-to-br from-teal-950/60 to-black/40 p-6 hover:border-brand-gold/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-gold/5">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">🙏</span>
                    <span className="text-xs text-brand-gold/40 group-hover:text-brand-gold transition-colors">تصفح ←</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-gold mb-1">الأدعية المأثورة</h3>
                  <p className="text-sm text-brand-cream/50 leading-relaxed">مجموعة من الأدعية النبوية لمختلف المناسبات والأوقات</p>
                </Link>

                {/* Spiritual AI */}
                <Link href="/spiritual-ai" className="group block rounded-2xl border border-brand-gold/15 bg-gradient-to-br from-green-950/60 to-black/40 p-6 hover:border-brand-gold/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-gold/5">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">💚</span>
                    <span className="text-xs text-brand-gold/40 group-hover:text-brand-gold transition-colors">تحدث ←</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-gold mb-1">الرفيق الروحاني</h3>
                  <p className="text-sm text-brand-cream/50 leading-relaxed">مساعد ذكي للإجابة على أسئلتك الدينية والروحانية</p>
                </Link>
              </div>
            </Container>
          </section>

          {/* More sections row ───────────────────────────────────────── */}
          <section className="border-b border-brand-gold/15 px-4 py-10">
            <Container className="space-y-5">
              <h2 className="text-xl font-bold text-brand-gold">المزيد من المحتوى</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { href: '/prophets', label: 'قصص الأنبياء', icon: '✨' },
                  { href: '/companions', label: 'الصحابة', icon: '🌟' },
                  { href: '/scholars', label: 'العلماء', icon: '🎓' },
                  { href: '/kids', label: 'قسم الأطفال', icon: '🌈' },
                  { href: '/memorization', label: 'حفظ القرآن', icon: '🏆' },
                  { href: '/poetry', label: 'الشعر الإسلامي', icon: '🪶' },
                  { href: '/videos', label: 'الفيديوهات', icon: '🎬' },
                  { href: '/battles', label: 'الغزوات والفتوحات', icon: '⚔️' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-4 rounded-xl border border-brand-gold/10 bg-black/20 hover:border-brand-gold/30 hover:bg-brand-gold/5 transition-all duration-200"
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <span className="text-sm text-brand-cream/70 hover:text-brand-gold">{item.label}</span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>

          {/* Stats bar ──────────────────────────────────────────────── */}
          <section className="border-b border-brand-gold/15 bg-black/30 px-4 py-10">
            <Container>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-3xl md:text-4xl font-bold text-brand-gold">{stat.value}</div>
                    <p className="text-sm text-brand-cream/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* CTA ─────────────────────────────────────────────────────── */}
          <section className="px-4 py-14">
            <Container className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-gold text-balance">
                ابدأ رحلتك الروحانية اليوم
              </h2>
              <p className="text-brand-cream/55 max-w-xl mx-auto text-balance">
                انضم إلى آلاف المستخدمين الذين يستخدمون ذِكر لتعزيز علاقتهم بالله
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href="/auth/register" className="px-8">
                  إنشاء حساب مجاني
                </Button>
                <Button href="/quran" variant="secondary" className="px-8">
                  ابدأ بالقرآن
                </Button>
              </div>
            </Container>
          </section>
        </main>
      </div>
    </div>
  );
}
