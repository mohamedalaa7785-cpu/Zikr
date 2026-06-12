'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { getPrayerTimes, getPrayerTimesByCity, getNextPrayer, getCurrentPrayer, getPrayerNameAr, formatPrayerTime } from '@/lib/services/prayer-times';
import type { PrayerTimesResponse } from '@/lib/services/prayer-times';

export default function PrayerTimesPage() {
  const [prayerData, setPrayerData] = useState<PrayerTimesResponse | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number; city: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; minutesUntil: number } | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<{ name: string; time: string } | null>(null);

  // Request geolocation
  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude, city: 'موقعك الحالي' });

          try {
            const data = await getPrayerTimes(latitude, longitude);
            if (data) {
              setPrayerData(data);
            } else {
              setError('فشل في جلب مواقيت الصلاة');
            }
          } catch {
            setError('حدث خطأ في جلب البيانات');
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError('يرجى السماح بالوصول إلى موقعك');
          setLoading(false);
        }
      );
    } else {
      setError('المتصفح لا يدعم الموقع الجغرافي');
      setLoading(false);
    }
  }, []);

  // Fetch prayer times by city
  const fetchByCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPrayerTimesByCity(city);
      if (data) {
        setPrayerData(data);
        setCurrentLocation({ lat: data.data.meta.latitude, lon: data.data.meta.longitude, city });
      } else {
        setError('لم يتم العثور على المدينة');
      }
    } catch {
      setError('حدث خطأ في البحث');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update current time and next prayer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (prayerData?.data?.timings) {
        setNextPrayer(getNextPrayer(prayerData.data.timings, now));
        setCurrentPrayer(getCurrentPrayer(prayerData.data.timings, now));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerData]);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const timings = prayerData?.data?.timings;
  const meta = prayerData?.data?.meta;
  const date = prayerData?.data?.date;

  const prayersList = timings ? [
    { name: 'Fajr', nameAr: 'الفجر', time: timings.Fajr, icon: '🌅' },
    { name: 'Dhuhr', nameAr: 'الظهر', time: timings.Dhuhr, icon: '☀️' },
    { name: 'Asr', nameAr: 'العصر', time: timings.Asr, icon: '🌤️' },
    { name: 'Maghrib', nameAr: 'المغرب', time: timings.Maghrib, icon: '🌅' },
    { name: 'Isha', nameAr: 'العشاء', time: timings.Isha, icon: '🌙' },
  ] : [];

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">مواقيت الصلاة</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          احصل على مواقيت الصلاة الدقيقة لموقعك
        </p>
        {currentLocation && (
          <div className="text-lg text-brand-cream">{currentLocation.city}</div>
        )}
      </section>

      {/* Location Controls */}
      <section className="flex gap-4 justify-center flex-wrap">
        <Button onClick={requestLocation} disabled={loading}>
          📍 استخدم موقعي الحالي
        </Button>
        <Button 
          onClick={() => {
            const city = prompt('أدخل اسم المدينة:');
            if (city) fetchByCity(city);
          }}
          variant="secondary"
        >
          🔍 ابحث عن مدينة
        </Button>
      </section>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/50 text-red-200 p-4">
          {error}
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="text-center p-8">
          <p className="text-brand-cream/60">جاري تحميل مواقيت الصلاة...</p>
        </Card>
      )}

      {/* Prayer Times Display */}
      {prayerData && !loading && (
        <>
          {/* Current Prayer Status */}
          {nextPrayer && (
            <Card className="bg-gradient-to-r from-brand-gold/10 to-brand-emerald/10 border-brand-gold/50 p-6 text-center space-y-3">
              <h2 className="text-2xl font-bold text-brand-gold">
                {currentPrayer ? `الصلاة الحالية: ${getPrayerNameAr(currentPrayer.name)}` : 'الصلاة القادمة'}
              </h2>
              <p className="text-3xl font-bold text-brand-cream">
                {getPrayerNameAr(nextPrayer.name)} - {formatPrayerTime(nextPrayer.time)}
              </p>
              <p className="text-lg text-brand-cream/70">
                بعد {Math.floor(nextPrayer.minutesUntil / 60)} ساعة و {nextPrayer.minutesUntil % 60} دقيقة
              </p>
            </Card>
          )}

          {/* Prayer Times Grid */}
          <section className="space-y-6">
            <SectionHeader 
              title="الصلوات الخمس" 
              subtitle={`${date?.hijri.day} ${date?.hijri.month.ar} ${date?.hijri.year} هـ`}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {prayersList.map((prayer) => (
                <Card 
                  key={prayer.name}
                  className={`text-center space-y-3 transition-all ${
                    currentPrayer?.name === prayer.name 
                      ? 'border-brand-gold bg-brand-gold/10' 
                      : nextPrayer?.name === prayer.name
                      ? 'border-brand-gold/50 bg-brand-emerald/5'
                      : 'hover:border-brand-gold/30'
                  }`}
                >
                  <div className="text-4xl">{prayer.icon}</div>
                  <h3 className="text-xl font-bold text-brand-gold">{prayer.nameAr}</h3>
                  <p className="text-sm text-brand-cream/60">{prayer.name}</p>
                  <Badge variant="secondary" className="justify-center">
                    {formatPrayerTime(prayer.time)}
                  </Badge>
                </Card>
              ))}
            </div>
          </section>

          {/* Additional Times */}
          {timings && (
          <section className="space-y-6">
            <SectionHeader title="أوقات إضافية" />

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="text-center space-y-2">
                <p className="text-brand-gold font-semibold">الإمساك</p>
                <p className="text-2xl font-bold text-brand-cream">{formatPrayerTime(timings.Imsak)}</p>
              </Card>
              <Card className="text-center space-y-2">
                <p className="text-brand-gold font-semibold">الشروق</p>
                <p className="text-2xl font-bold text-brand-cream">{formatPrayerTime(timings.Sunrise)}</p>
              </Card>
              <Card className="text-center space-y-2">
                <p className="text-brand-gold font-semibold">منتصف الليل</p>
                <p className="text-2xl font-bold text-brand-cream">{formatPrayerTime(timings.Midnight)}</p>
              </Card>
            </div>
          </section>
          )}

          {/* Location Info */}
          {meta && (
            <Card className="space-y-4">
              <h3 className="text-lg font-bold text-brand-gold">معلومات الموقع</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-brand-cream/60">الموقع الجغرافي</p>
                  <p className="text-brand-cream">{meta.latitude.toFixed(4)}° N, {meta.longitude.toFixed(4)}° E</p>
                </div>
                <div>
                  <p className="text-sm text-brand-cream/60">المنطقة الزمنية</p>
                  <p className="text-brand-cream">{meta.timezone}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-cream/60">طريقة الحساب</p>
                  <p className="text-brand-cream">{meta.method.name}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-cream/60">مذهب الفقه</p>
                  <p className="text-brand-cream">{meta.school === 'Shafi' ? 'الشافعي' : meta.school}</p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Information Section */}
      <section className="space-y-4">
        <SectionHeader title="معلومات مهمة" />
        
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
            <h3 className="text-lg text-brand-gold">نصائح مهمة</h3>
            <ul className="text-sm leading-7 arabic-muted space-y-1">
              <li>- تحقق من دقة موقعك الجغرافي</li>
              <li>- استخدم طريقة حساب معتمدة</li>
              <li>- أضف وقت تنبيه قبل الصلاة</li>
              <li>- حافظ على مواقيت الصلاة</li>
              <li>- لا تؤخر الصلاة عن وقتها</li>
            </ul>
          </Card>
        </div>
      </section>
    </Container>
  );
}
