'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { getPrayerTimes, getPrayerTimesByCity } from '@/lib/services/prayer-times';
import { offlineDb } from '@/lib/offline-db';
import type { PrayerTimes } from '@/lib/types/prayer';

// ─── Data ─────────────────────────────────────────────────────────────────────
const prayerNames = [
  { key: 'Fajr', label: 'الفجر', icon: '🌙' },
  { key: 'Sunrise', label: 'الشروق', icon: '🌅' },
  { key: 'Dhuhr', label: 'الظهر', icon: '☀️' },
  { key: 'Asr', label: 'العصر', icon: '🌤' },
  { key: 'Maghrib', label: 'المغرب', icon: '🌇' },
  { key: 'Isha', label: 'العشاء', icon: '🌃' },
] as const;

const stats = [
  { label: 'سورة قرآنية', value: '114', sub: 'سور الكتاب الكريم' },
  { label: 'آية كريمة', value: '6,236', sub: 'آيات مباركة' },
  { label: 'جزءًا', value: '30', sub: 'من القرآن الكريم' },
  { label: 'نبيًا ورسولًا', value: '25', sub: 'ذُكروا في القرآن' },
];

const featuredSections = [
  {
    href: '/quran',
    title: 'القرآن الكريم',
    desc: 'اقرأ واستمع إلى القرآن الكريم بأصوات قراء مميزين — 114 سورة كاملة',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    badge: '114 سورة',
    color: 'from-emerald-900/50 to-emerald-950/80',
    border: 'border-emerald-700/30 hover:border-emerald-500/60',
    glow: 'hover:shadow-emerald-900/30',
  },
  {
    href: '/hadith',
    title: 'الحديث الشريف',
    desc: 'مجموعة شاملة من الأحاديث النبوية الصحيحة من صحيح البخاري ومسلم',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    badge: 'صحيح البخاري',
    color: 'from-amber-900/50 to-amber-950/80',
    border: 'border-amber-700/30 hover:border-amber-500/60',
    glow: 'hover:shadow-amber-900/30',
  },
  {
    href: '/adhkar',
    title: 'الأذكار اليومية',
    desc: 'أذكار الصباح والمساء وتسابيح يومية لتقوية الروح وتحصين النفس',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
    badge: 'صباح ومساء',
    color: 'from-violet-900/50 to-violet-950/80',
    border: 'border-violet-700/30 hover:border-violet-500/60',
    glow: 'hover:shadow-violet-900/30',
  },
  {
    href: '/dua',
    title: 'الأدعية المأثورة',
    desc: 'أدعية نبوية شريفة لمختلف المناسبات والأوقات والأحوال',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
    badge: 'أدعية مأثورة',
    color: 'from-teal-900/50 to-teal-950/80',
    border: 'border-teal-700/30 hover:border-teal-500/60',
    glow: 'hover:shadow-teal-900/30',
  },
  {
    href: '/prophets',
    title: 'قصص الأنبياء',
    desc: 'سير وقصص الأنبياء والمرسلين عليهم الصلاة والسلام من آدم إلى محمد ﷺ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
    badge: '25 نبيًا',
    color: 'from-sky-900/50 to-sky-950/80',
    border: 'border-sky-700/30 hover:border-sky-500/60',
    glow: 'hover:shadow-sky-900/30',
  },
  {
    href: '/spiritual-ai',
    title: 'الرفيق الروحاني',
    desc: 'مساعد ذكاء اصطناعي للإجابة على أسئلتك الدينية والروحانية بشكل فوري',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    badge: 'AI مدعوم',
    color: 'from-green-900/50 to-green-950/80',
    border: 'border-green-700/30 hover:border-green-500/60',
    glow: 'hover:shadow-green-900/30',
  },
];

const moreContent = [
  { href: '/companions', label: 'الصحابة الكرام', icon: '👥' },
  { href: '/scholars', label: 'العلماء', icon: '📚' },
  { href: '/kids', label: 'قسم الأطفال', icon: '🌟' },
  { href: '/memorization', label: 'حفظ القرآن', icon: '📿' },
  { href: '/radio', label: 'إذاعة القرآن', icon: '📻' },
  { href: '/tasbeeh', label: 'عداد التسبيح', icon: '📿' },
  { href: '/battles', label: 'الغزوات', icon: '⚔️' },
  { href: '/conquests', label: 'الفتوحات', icon: '🏛️' },
  { href: '/tawasheeh', label: 'المداحون', icon: '🎵' },
  { href: '/reciters', label: 'القراء', icon: '🎙️' },
  { href: '/poetry', label: 'الشعر الإسلامي', icon: '✍️' },
  { href: '/stories', label: 'القصص', icon: '📖' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── Star Canvas ──────────────────────────────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const stars: { x: number; y: number; r: number; a: number; speed: number; twinkle: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      stars.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 5000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.2,
          a: Math.random(),
          speed: Math.random() * 0.005 + 0.001,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.twinkle += s.speed;
        const opacity = (Math.sin(s.twinkle) * 0.4 + 0.6) * s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199,168,107,${opacity * 0.7})`;
        ctx.fill();
        // subtle white core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,230,${opacity * 0.5})`;
        ctx.fill();
      }
      animFrame = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ─── Arabic Ornament ──────────────────────────────────────────────────────────
function ArabicOrnament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 40" className={className} fill="none" aria-hidden="true">
      <path d="M150 20 L140 10 L130 20 L140 30 Z" fill="rgba(199,168,107,0.6)" />
      <path d="M150 20 L160 10 L170 20 L160 30 Z" fill="rgba(199,168,107,0.6)" />
      <line x1="0" y1="20" x2="120" y2="20" stroke="rgba(199,168,107,0.3)" strokeWidth="0.5" />
      <line x1="180" y1="20" x2="300" y2="20" stroke="rgba(199,168,107,0.3)" strokeWidth="0.5" />
      <circle cx="60" cy="20" r="2" fill="rgba(199,168,107,0.4)" />
      <circle cx="100" cy="20" r="1.5" fill="rgba(199,168,107,0.3)" />
      <circle cx="200" cy="20" r="1.5" fill="rgba(199,168,107,0.3)" />
      <circle cx="240" cy="20" r="2" fill="rgba(199,168,107,0.4)" />
      <path d="M120 15 Q125 20 120 25" stroke="rgba(199,168,107,0.5)" strokeWidth="0.8" fill="none" />
      <path d="M180 15 Q175 20 180 25" stroke="rgba(199,168,107,0.5)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ─── Section Divider ──────────────────────────────────────────────────────────
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent" />
      <span className="text-xs font-bold tracking-[0.2em] text-brand-gold/50 uppercase shrink-0">{title}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const prayerTimesRef = useRef<PrayerTimes | null>(null);
  const [prayerCity, setPrayerCity] = useState('Cairo');
  const [cityInput, setCityInput] = useState('');
  const [loadingPrayer, setLoadingPrayer] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date());
    queueMicrotask(updateClock);
    
    // Initialize offline database
    offlineDb.initialize().catch(err => {
      console.error('[HomePage] Failed to initialize offline DB:', err);
    });
    
    const interval = setInterval(updateClock, 1000);

    const checkAuth = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setAuthLoaded(true);
    };
    checkAuth();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    prayerTimesRef.current = prayerTimes;
  }, [prayerTimes]);

  const { active: activePrayer, next: nextPrayer } = useMemo(() => {
    if (!prayerTimes || !currentTime) return { active: '', next: '' };
    return getActivePrayer(prayerTimes, currentTime);
  }, [prayerTimes, currentTime]);

  const fetchPrayerByCity = useCallback(async (city: string, options?: { keepExisting?: boolean }) => {
    if (!options?.keepExisting) setLoadingPrayer(true);
    try {
      const res = await getPrayerTimesByCity(city, 'Egypt');
      if (res?.data?.timings) setPrayerTimes(res.data.timings as PrayerTimes);
    } catch (error) {
      console.error('Prayer fetch error:', error);
    } finally {
      setLoadingPrayer(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const setFetchedPrayerTimes = (timings: PrayerTimes) => {
      if (!cancelled) setPrayerTimes(timings);
    };

    const fallbackToCity = async (keepExisting = Boolean(prayerTimesRef.current)) => {
      if (!cancelled) await fetchPrayerByCity(prayerCity, { keepExisting });
    };

    if (!prayerTimesRef.current) setLoadingPrayer(true);

    if (!('geolocation' in navigator)) {
      void fallbackToCity();
      return () => { cancelled = true; };
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await getPrayerTimes(latitude, longitude);
          if (res?.data?.timings) setFetchedPrayerTimes(res.data.timings as PrayerTimes);
          else await fallbackToCity();
        } catch {
          await fallbackToCity();
        } finally {
          if (!cancelled) setLoadingPrayer(false);
        }
      },
      () => { void fallbackToCity(); },
      { timeout: 6000 },
    );

    return () => { cancelled = true; };
  }, [prayerCity, fetchPrayerByCity]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }, [searchQuery, router]);

  const timeStr = currentTime ? currentTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }) : '';
  const dateStr = currentTime ? currentTime.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  return (
    <div className="min-h-screen bg-brand-emeraldDeep text-brand-cream">

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden border-b border-brand-gold/15"
        aria-label="الصفحة الرئيسية"
        style={{ background: 'linear-gradient(180deg, #050f0a 0%, #0A2A1E 40%, #071f16 100%)' }}
      >
        {/* Animated stars */}
        <StarCanvas />

        {/* Radial glow center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(199,168,107,0.06) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Geometric corner ornaments */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none">
            <path d="M200 0 L200 200 L0 0 Z" fill="rgba(199,168,107,0.3)" />
            <path d="M200 0 L200 120 L80 0 Z" fill="rgba(199,168,107,0.2)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none">
            <path d="M0 200 L0 0 L200 200 Z" fill="rgba(199,168,107,0.3)" />
            <path d="M0 200 L0 80 L120 200 Z" fill="rgba(199,168,107,0.2)" />
          </svg>
        </div>

        <Container className="relative z-10 pt-14 pb-16 space-y-10">

          {/* Bismillah line */}
          <div className="text-center">
            <p className="text-brand-gold/50 text-sm tracking-widest font-arabic" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
          </div>

          {/* Arabic top ornament */}
          <ArabicOrnament className="w-64 mx-auto" />

          {/* Main title + clock */}
          <div className="text-center space-y-3">
            <h1
              className="text-6xl md:text-8xl font-bold text-brand-gold text-balance"
              style={{
                fontFamily: 'var(--font-amiri), var(--font-noto-arabic)',
                textShadow: '0 0 40px rgba(199,168,107,0.35), 0 0 80px rgba(199,168,107,0.12)',
                letterSpacing: '0.05em',
              }}
              dir="rtl"
            >
              ذِكرٌ
            </h1>
            <p
              className="text-brand-cream/55 text-base md:text-xl tracking-widest"
              style={{ fontFamily: 'var(--font-amiri)' }}
            >
              منصتك الروحانية الشاملة
            </p>

            {/* Live clock */}
            {timeStr && (
              <div className="flex flex-col items-center gap-1.5 pt-2">
                <div
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-brand-gold/20 bg-black/30"
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shrink-0" />
                  <span className="text-2xl font-mono font-bold text-brand-gold tabular-nums tracking-wider">{timeStr}</span>
                </div>
                <span className="text-xs text-brand-cream/40 font-arabic" dir="rtl">{dateStr}</span>
              </div>
            )}
          </div>

          {/* Bottom Arabic ornament */}
          <ArabicOrnament className="w-64 mx-auto rotate-180" />

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative" role="search">
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: '0 0 30px rgba(199,168,107,0.08)' }}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="ابحث عن آية، حديث، ذِكر، أو قصة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault();
                }}
                aria-label="البحث في المحتوى"
                className="w-full px-6 py-4 pr-14 rounded-2xl border border-brand-gold/25 bg-black/40 text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold/55 focus:outline-none focus:ring-2 focus:ring-brand-gold/15 text-base"
                style={{ backdropFilter: 'blur(16px)' }}
                dir="rtl"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold hover:bg-brand-gold/25 transition-colors"
                aria-label="بحث"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Quick nav grid */}
          <nav aria-label="أقسام المنصة" className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2">
            {[
              { label: 'القرآن', href: '/quran' },
              { label: 'الأحاديث', href: '/hadith' },
              { label: 'الأنبياء', href: '/prophets' },
              { label: 'الصحابة', href: '/companions' },
              { label: 'الأذكار', href: '/adhkar' },
              { label: 'الأدعية', href: '/dua' },
              { label: 'المقالات', href: '/articles' },
              { label: 'الفيديوهات', href: '/videos' },
              { label: 'الأطفال', href: '/kids' },
              { label: 'الرفيق', href: '/spiritual-ai' },
              { label: 'الشعر', href: '/poetry' },
              { label: 'العلماء', href: '/scholars' },
              { label: 'الحفظ', href: '/memorization' },
              { label: 'الصلاة', href: '/prayer-times' },
              { label: 'القبلة', href: '/qibla' },
              { label: 'الغزوات', href: '/battles' },
              { label: 'الفتوحات', href: '/conquests' },
              { label: 'المداحون', href: '/tawasheeh' },
              { label: 'القراء', href: '/reciters' },
              { label: 'الإذاعة', href: '/radio' },
              { label: 'التسبيح', href: '/tasbeeh' },
              { label: 'يوتيوب', href: '/youtube' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex items-center justify-center p-2.5 rounded-xl border border-brand-gold/12 bg-black/20 hover:border-brand-gold/40 hover:bg-brand-gold/8 transition-all duration-200 min-h-[44px]"
              >
                <span className="text-[11px] text-center text-brand-cream/60 group-hover:text-brand-gold leading-tight transition-colors">{cat.label}</span>
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — PRAYER TIMES
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="border-b border-brand-gold/12 px-4 py-12"
        aria-labelledby="prayer-times-heading"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)' }}
      >
        <Container className="space-y-6">
          <SectionDivider title="مواقيت الصلاة" />

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 id="prayer-times-heading" className="text-2xl font-bold text-brand-gold" dir="rtl">
                أوقات الصلاة اليوم
              </h2>
              <p className="text-sm text-brand-cream/40 mt-0.5" dir="rtl">
                {prayerCity} · {loadingPrayer ? 'يتم التحديث دون إخفاء المواقيت' : 'يتجدد تلقائيًا'}
              </p>
            </div>
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
                placeholder="اسم المدينة..."
                className="px-3 py-2 rounded-lg border border-brand-gold/20 bg-black/30 text-brand-cream text-sm placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-gold/50 w-36"
                aria-label="اسم المدينة"
                dir="rtl"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg border border-brand-gold/30 text-brand-gold text-sm hover:border-brand-gold/60 hover:bg-brand-gold/8 transition-colors"
              >
                تغيير
              </button>
            </form>
          </div>

          {prayerTimes ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {prayerNames.map(({ key, label }) => {
                const isActive = activePrayer === key;
                const isNext = nextPrayer === key;
                return (
                  <div
                    key={key}
                    className={`relative rounded-2xl border p-4 text-center transition-all duration-300 overflow-hidden ${
                      isActive
                        ? 'border-brand-gold bg-brand-gold/12 shadow-lg shadow-brand-gold/10'
                        : isNext
                        ? 'border-brand-gold/35 bg-brand-gold/5'
                        : 'border-brand-gold/10 bg-black/20 hover:border-brand-gold/25'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-brand-gold/5 animate-pulse pointer-events-none" />
                    )}
                    <p className="text-xs text-brand-gold/60 mb-2 font-arabic" dir="rtl">{label}</p>
                    <p className="text-lg font-bold text-brand-cream tabular-nums">
                      {prayerTimes[key]?.replace(/\s*(AM|PM)/i, '') ?? '--:--'}
                    </p>
                    {isActive && (
                      <span className="mt-1.5 inline-block text-[10px] text-brand-gold font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-gold/15">الآن</span>
                    )}
                    {isNext && !isActive && (
                      <span className="mt-1.5 inline-block text-[10px] text-brand-gold/55 font-semibold tracking-widest">التالية</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {prayerNames.map(({ label }) => (
                <div key={label} className="rounded-2xl border border-brand-gold/10 bg-black/20 p-4 text-center animate-pulse">
                  <p className="text-xs text-brand-gold/30 mb-2">{label}</p>
                  <div className="h-6 w-16 bg-brand-gold/10 rounded mx-auto" />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <Link href="/prayer-times" className="rounded-xl border border-brand-gold/25 px-5 py-2.5 text-sm text-brand-cream/70 hover:border-brand-gold hover:text-brand-gold transition-colors">
              مواقيت الصلاة التفصيلية
            </Link>
            <Link href="/qibla" className="rounded-xl border border-brand-gold/15 px-5 py-2.5 text-sm text-brand-cream/45 hover:border-brand-gold/30 hover:text-brand-cream/70 transition-colors">
              اتجاه القبلة
            </Link>
            <Link href="/adhkar" className="rounded-xl border border-brand-gold/15 px-5 py-2.5 text-sm text-brand-cream/45 hover:border-brand-gold/30 hover:text-brand-cream/70 transition-colors">
              أذكار الصباح والمساء
            </Link>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — FEATURED SECTIONS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-brand-gold/12 px-4 py-12" aria-labelledby="featured-heading">
        <Container className="space-y-6">
          <SectionDivider title="الأقسام الرئيسية" />

          <div className="flex items-center justify-between">
            <h2 id="featured-heading" className="text-2xl font-bold text-brand-gold" dir="rtl">اكتشف المنصة</h2>
            <Link href="/quran" className="text-sm text-brand-gold/60 hover:text-brand-gold transition-colors">
              عرض الكل
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSections.map((sec) => (
              <Link
                key={sec.href}
                href={sec.href}
                className={`group block rounded-2xl border ${sec.border} bg-gradient-to-br ${sec.color} p-6 transition-all duration-300 hover:shadow-xl ${sec.glow} hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-black/30 border border-brand-gold/15 flex items-center justify-center text-brand-gold group-hover:border-brand-gold/40 transition-colors">
                    {sec.icon}
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-brand-gold/45 uppercase group-hover:text-brand-gold/70 transition-colors px-2 py-1 rounded-full border border-brand-gold/15">
                    {sec.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-brand-gold mb-2" dir="rtl">{sec.title}</h3>
                <p className="text-sm text-brand-cream/50 leading-relaxed group-hover:text-brand-cream/65 transition-colors" dir="rtl">{sec.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-brand-gold/40 group-hover:text-brand-gold/70 transition-colors">
                  <span>استكشف الآن</span>
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 rotate-180">
                    <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — MORE CONTENT
      ══════════════���═══════════════════════════════════════════════════════ */}
      <section className="border-b border-brand-gold/12 px-4 py-12" aria-labelledby="more-heading">
        <Container className="space-y-6">
          <SectionDivider title="المزيد من المحتوى" />
          <h2 id="more-heading" className="text-2xl font-bold text-brand-gold" dir="rtl">المحتوى الإسلامي الشامل</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {moreContent.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-brand-gold/12 bg-black/20 hover:border-brand-gold/35 hover:bg-brand-gold/6 transition-all duration-200 text-center"
              >
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <span className="text-xs text-brand-cream/60 group-hover:text-brand-gold transition-colors leading-tight" dir="rtl">{item.label}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — QURAN STATS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-brand-gold/12 px-4 py-12" aria-labelledby="stats-heading">
        <Container className="space-y-6">
          <SectionDivider title="أرقام وإحصائيات" />
          <h2 id="stats-heading" className="text-2xl font-bold text-brand-gold" dir="rtl">أرقام من القرآن الكريم</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-2xl border border-brand-gold/15 bg-black/25 p-6 text-center overflow-hidden group hover:border-brand-gold/35 transition-colors"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(199,168,107,0.04), transparent 70%)' }}
                  aria-hidden="true"
                />
                <p
                  className="text-4xl md:text-5xl font-bold text-brand-gold tabular-nums mb-2"
                  style={{ textShadow: '0 0 20px rgba(199,168,107,0.25)' }}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-brand-cream/70 mb-1" dir="rtl">{stat.label}</p>
                <p className="text-xs text-brand-cream/35" dir="rtl">{stat.sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6 — DAILY VERSE + CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-16" aria-label="آية كريمة">
        <Container>
          <div
            className="relative rounded-3xl border border-brand-gold/20 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(10,42,30,0.8) 0%, rgba(0,0,0,0.9) 100%)',
              boxShadow: '0 0 60px rgba(199,168,107,0.06), inset 0 0 60px rgba(199,168,107,0.02)',
            }}
          >
            {/* Background ornament */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none" aria-hidden="true">
              <span className="text-[18rem] font-arabic text-brand-gold/5 leading-none" style={{ fontFamily: 'var(--font-amiri)' }}>ذ</span>
            </div>

            <div className="relative z-10 py-14 px-6 md:px-12 text-center space-y-6">
              {/* Top ornament */}
              <ArabicOrnament className="w-48 mx-auto" />

              <div className="space-y-4">
                <p className="text-[10px] font-bold tracking-[0.3em] text-brand-gold/45 uppercase">آية من كتاب الله</p>
                <p
                  className="text-2xl md:text-3xl lg:text-4xl leading-loose text-brand-cream font-bold max-w-3xl mx-auto"
                  dir="rtl"
                  style={{ fontFamily: 'var(--font-amiri)', textShadow: '0 0 20px rgba(255,255,255,0.05)' }}
                >
                  &quot;إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ&quot;
                </p>
                <p className="text-sm text-brand-gold/60" dir="rtl">سورة الإسراء — الآية 9</p>
              </div>

              {/* Bottom ornament */}
              <ArabicOrnament className="w-48 mx-auto rotate-180" />

              <div className="flex justify-center gap-4 flex-wrap pt-2">
                <Link
                  href="/quran"
                  className="rounded-xl bg-brand-gold px-8 py-3 text-sm font-bold text-brand-emeraldDeep hover:bg-brand-goldSoft transition-colors shadow-lg shadow-brand-gold/20"
                >
                  اقرأ القرآن الكريم
                </Link>
                <Link
                  href="/adhkar"
                  className="rounded-xl border border-brand-gold/30 px-8 py-3 text-sm text-brand-cream/70 hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  أذكار اليوم
                </Link>
                {!user && authLoaded && (
                  <Link
                    href="/auth/register"
                    className="rounded-xl border border-brand-gold/15 px-8 py-3 text-sm text-brand-cream/45 hover:border-brand-gold/30 hover:text-brand-cream/65 transition-colors"
                  >
                    إنشاء حساب مجاني
                  </Link>
                )}
                {user && authLoaded && (
                  <Link
                    href="/profile"
                    className="rounded-xl border border-brand-gold/15 px-8 py-3 text-sm text-brand-cream/45 hover:border-brand-gold/30 hover:text-brand-cream/65 transition-colors"
                  >
                    الملف الشخصي
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
