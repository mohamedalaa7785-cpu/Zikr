'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { getPrayerTimesByCoordinates, getNextPrayer, getQiblaDirection } from '@/lib/services/prayer';
import type { PrayerResponse, QiblaResponse } from '@/lib/types/prayer';

const prayerGuide = [
  {
    title: 'التوجه للقبلة',
    description: 'استقبل الكعبة المشرفة بوجهك وصدرك',
  },
  {
    title: 'النية',
    description: 'انوِ الصلاة التي تريد أداءها في قلبك',
  },
  {
    title: 'تكبيرة الإحرام',
    description: 'ارفع يديك حذو أذنيك وقل: الله أكبر',
  },
  {
    title: 'دعاء الاستفتاح',
    description: 'سبحانك اللهم وبحمدك، وتبارك اسمك، وتعالى جدك، ولا إله غيرك',
  },
  {
    title: 'قراءة الفاتحة',
    description: 'اقرأ سورة الفاتحة كاملة، ثم ما تيسر من القرآن',
  },
  {
    title: 'الركوع',
    description: 'انحنِ واضعاً يديك على ركبتيك، وقل: سبحان ربي العظيم',
  },
  {
    title: 'الرفع من الركوع',
    description: 'ارفع قائلاً: سمع الله لمن حمده، ربنا ولك الحمد',
  },
  {
    title: 'السجود',
    description: 'اسجد على الأعضاء السبعة وقل: سبحان ربي الأعلى',
  },
  {
    title: 'الجلوس بين السجدتين',
    description: 'اجلس وقل: رب اغفر لي، ثم اسجد السجدة الثانية',
  },
  {
    title: 'التشهد والسلام',
    description: 'في الركعة الأخيرة اقرأ التشهد والصلاة الإبراهيمية، ثم سلّم',
  },
];

const adhkarAfterPrayer = [
  { text: 'أستغفر الله', count: 3 },
  { text: 'اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام', count: 1 },
  { text: 'سبحان الله', count: 33 },
  { text: 'الحمد لله', count: 33 },
  { text: 'الله أكبر', count: 33 },
  { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', count: 1 },
];

const prayerNames = [
  { key: 'Fajr', name: 'الفجر', icon: '🌅' },
  { key: 'Sunrise', name: 'الشروق', icon: '🌄' },
  { key: 'Dhuhr', name: 'الظهر', icon: '☀️' },
  { key: 'Asr', name: 'العصر', icon: '🌤️' },
  { key: 'Maghrib', name: 'المغرب', icon: '🌅' },
  { key: 'Isha', name: 'العشاء', icon: '🌙' },
];

export default function PrayerPage() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerResponse | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [qibla, setQibla] = useState<QiblaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; city?: string } | null>(null);
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user location and fetch prayer times
  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get user's geolocation
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lng: longitude });

              // Fetch prayer times
              const times = await getPrayerTimesByCoordinates(latitude, longitude);
              if (times) {
                setPrayerTimes(times);
                const next = await getNextPrayer(times);
                setNextPrayer(next);
              }

              // Fetch qibla direction
              const qiblaData = await getQiblaDirection(latitude, longitude);
              if (qiblaData) {
                setQibla(qiblaData);
              }
            },
            (err) => {
              console.warn('Geolocation error:', err);
              setError('تعذر الحصول على موقعك. يرجى تفعيل خدمة الموقع.');
              setLoading(false);
            }
          );
        } else {
          setError('متصفحك لا يدعم خدمة تحديد الموقع.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Prayer data fetch error:', err);
        setError('حدث خطأ في جلب مواقيت الصلاة.');
        setLoading(false);
      }
    };

    fetchPrayerData();
  }, []);

  // Update next prayer every minute
  useEffect(() => {
    if (!prayerTimes) return;

    const updateNextPrayer = async () => {
      const next = await getNextPrayer(prayerTimes);
      setNextPrayer(next);
    };

    const interval = setInterval(updateNextPrayer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [prayerTimes]);

  // Mark loading as complete once we have prayer times or error
  useEffect(() => {
    if (prayerTimes || error) {
      setLoading(false);
    }
  }, [prayerTimes, error]);

  const getPrayerTime = (prayerKey: string): string => {
    if (!prayerTimes?.timings) return '--:--';
    const time = prayerTimes.timings[prayerKey as keyof typeof prayerTimes.timings];
    return typeof time === 'string' ? time : '--:--';
  };

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">مواقيت الصلاة</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          الصلاة عماد الدين، تعرف على مواقيت الصلاة في موقعك وأذكار الصلاة
        </p>
        {currentTime && (
          <div className="text-3xl font-bold text-brand-cream">{currentTime}</div>
        )}
        {location && (
          <p className="text-sm text-brand-gold">
            الموقع: {location.city || `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°`}
          </p>
        )}
      </section>

      {/* Error Message */}
      {error && (
        <Card className="border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-300">{error}</p>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-8">
          <p className="text-brand-gold">جاري تحميل مواقيت الصلاة...</p>
        </Card>
      )}

      {/* Next Prayer */}
      {nextPrayer && !loading && (
        <Card className="bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 p-6 text-center space-y-2">
          <p className="text-sm arabic-muted">الصلاة القادمة</p>
          <h2 className="text-3xl font-bold text-brand-gold">{nextPrayer.name}</h2>
          <p className="text-2xl text-brand-cream">{nextPrayer.time}</p>
        </Card>
      )}

      {/* Prayer Times Grid */}
      {prayerTimes && !loading && (
        <section className="space-y-6">
          <SectionHeader 
            title="مواقيت الصلاة" 
            subtitle="أوقات الصلوات الخمس في موقعك"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prayerNames.map((prayer) => (
              <Card 
                key={prayer.key}
                className={`text-center space-y-3 cursor-pointer transition-all ${
                  selectedPrayer === prayer.key ? 'border-brand-gold bg-brand-gold/10' : 'hover:border-brand-gold/50'
                }`}
                onClick={() => setSelectedPrayer(selectedPrayer === prayer.key ? null : prayer.key)}
              >
                <div className="text-4xl">{prayer.icon}</div>
                <h3 className="text-xl font-bold text-brand-gold">{prayer.name}</h3>
                <p className="text-2xl font-bold text-brand-cream">{getPrayerTime(prayer.key)}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Qibla Direction */}
      {qibla && !loading && (
        <section className="space-y-6">
          <SectionHeader 
            title="اتجاه القبلة" 
            subtitle="الاتجاه الصحيح نحو الكعبة المشرفة"
          />

          <Card className="text-center space-y-4 p-8">
            <div className="text-6xl">🧭</div>
            <p className="text-lg text-brand-cream">
              اتجاه القبلة: <span className="text-brand-gold font-bold">{Math.round(qibla.direction)}°</span>
            </p>
            <p className="text-sm arabic-muted">
              من الشمال في اتجاه عقارب الساعة
            </p>
          </Card>
        </section>
      )}

      {/* How to Pray */}
      <section className="space-y-6">
        <SectionHeader 
          title="كيفية الصلاة" 
          subtitle="خطوات أداء الصلاة بالترتيب"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {prayerGuide.map((step, idx) => (
            <Card key={idx} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold shrink-0">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-brand-cream">{step.title}</h3>
                <p className="text-sm leading-6 arabic-muted">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Adhkar After Prayer */}
      <section className="space-y-6">
        <SectionHeader 
          title="أذكار بعد الصلاة" 
          subtitle="أذكار مسنونة بعد كل صلاة مكتوبة"
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adhkarAfterPrayer.map((dhikr, idx) => (
            <Card key={idx} className="text-center space-y-2">
              <p className="text-lg font-arabic leading-relaxed text-brand-cream">
                {dhikr.text}
              </p>
              <Badge variant="outline">{dhikr.count === 1 ? 'مرة واحدة' : `${dhikr.count} مرة`}</Badge>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button href="/adhkar" variant="secondary">
            جميع الأذكار
          </Button>
        </div>
      </section>

      {/* Important Notes */}
      <section className="space-y-4">
        <SectionHeader title="ملاحظات مهمة" />
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-2">
            <h3 className="text-lg text-brand-gold">شروط الصلاة</h3>
            <ul className="text-sm leading-7 arabic-muted space-y-1">
              <li>- الإسلام والعقل والتمييز</li>
              <li>- الطهارة من الحدث الأصغر والأكبر</li>
              <li>- طهارة البدن والثوب والمكان</li>
              <li>- ستر العورة</li>
              <li>- دخول الوقت</li>
              <li>- استقبال القبلة</li>
              <li>- النية</li>
            </ul>
          </Card>

          <Card className="space-y-2">
            <h3 className="text-lg text-brand-gold">أركان الصلاة</h3>
            <ul className="text-sm leading-7 arabic-muted space-y-1">
              <li>- القيام مع القدرة</li>
              <li>- تكبيرة الإحرام</li>
              <li>- قراءة الفاتحة</li>
              <li>- الركوع والاعتدال منه</li>
              <li>- السجود والجلوس بين السجدتين</li>
              <li>- التشهد الأخير والجلوس له</li>
              <li>- الصلاة على النبي والتسليم</li>
              <li>- الطمأنينة والترتيب</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <Card className="text-center py-8 space-y-4 bg-brand-gold/5">
        <h2 className="text-2xl text-brand-gold">حافظ على صلاتك</h2>
        <p className="arabic-muted max-w-xl mx-auto leading-7">
          قال رسول الله صلى الله عليه وسلم: &quot;أول ما يحاسب عليه العبد يوم القيامة الصلاة&quot;
        </p>
        <Button href="/quran">اقرأ القرآن</Button>
      </Card>
    </Container>
  );
}
