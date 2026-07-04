'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQiblaDirection(lat: number, lng: number): number {
  const phiK = (KAABA_LAT * Math.PI) / 180;
  const lambdaK = (KAABA_LNG * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;

  const y = Math.sin(lambdaK - lambda);
  const x =
    Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360;
}

function calculateDistance(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function QiblaPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

  const requestLocation = () => {
    setPermission('requesting');
    setError(null);
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع');
      setPermission('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setPermission('granted');
      },
      (err) => {
        setError(
          err.code === 1
            ? 'تم رفض إذن الموقع. فعّله من إعدادات المتصفح.'
            : 'تعذر تحديد الموقع. حاول مرة أخرى.'
        );
        setPermission('denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!coords) return;
    const handler = (e: DeviceOrientationEvent) => {
      const h = e.alpha != null ? 360 - e.alpha : null;
      if (h != null) setHeading(h);
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [coords]);

  const qiblaDirection = coords ? calculateQiblaDirection(coords.lat, coords.lng) : null;
  const distance = coords ? calculateDistance(coords.lat, coords.lng) : null;
  const compassRotation = heading != null && qiblaDirection != null ? qiblaDirection - heading : qiblaDirection;

  return (
    <Container className='space-y-8 py-10 text-right'>
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>اتجاه القبلة</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          حدد موقعك لمعرفة اتجاه القبلة بدقة. استخدم البوصلة وقم بتوجيه هاتفك نحو السهم.
        </p>
      </section>

      {!coords && (
        <Card className='flex flex-col items-center gap-4 py-12'>
          <div className='text-6xl'>🧭</div>
          <p className='arabic-muted'>اضغط الزر أدناه للسماح بتحديد موقعك</p>
          <Button onClick={requestLocation} disabled={permission === 'requesting'}>
            {permission === 'requesting' ? 'جارٍ تحديد الموقع...' : 'تحديد موقعي'}
          </Button>
          {error && <p className='text-sm text-red-300'>{error}</p>}
        </Card>
      )}

      {coords && qiblaDirection != null && (
        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='flex flex-col items-center gap-6 py-10'>
            <div className='relative h-64 w-64'>
              <div className='absolute inset-0 rounded-full border-4 border-brand-gold/30' />
              <div className='absolute left-1/2 top-2 -translate-x-1/2 text-xs text-brand-gold'>N</div>
              <div className='absolute bottom-2 left-1/2 -translate-x-1/2 text-xs arabic-muted'>S</div>
              <div className='absolute left-2 top-1/2 -translate-y-1/2 text-xs arabic-muted'>W</div>
              <div className='absolute right-2 top-1/2 -translate-y-1/2 text-xs arabic-muted'>E</div>
              <div
                className='absolute left-1/2 top-1/2 h-28 w-1 -translate-x-1/2 origin-bottom rounded-full bg-brand-gold transition-transform duration-300'
                style={{ transform: `translateX(-50%) rotate(${compassRotation}deg)` }}
              >
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 text-2xl'>🕋</div>
              </div>
            </div>
            <p className='text-lg text-brand-gold'>اتجاه القبلة: {Math.round(qiblaDirection)}°</p>
            {heading != null ? (
              <p className='text-sm arabic-muted'>اتجاه الهاتف: {Math.round(heading)}°</p>
            ) : (
              <p className='text-sm arabic-muted'>حرّك هاتفك لتفعيل البوصلة</p>
            )}
          </Card>

          <Card className='space-y-4 py-8'>
            <h2 className='text-xl text-brand-gold'>معلومات الموقع</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex justify-between border-b border-brand-gold/10 pb-2'>
                <span className='arabic-muted'>خط العرض</span>
                <span>{coords.lat.toFixed(4)}°</span>
              </div>
              <div className='flex justify-between border-b border-brand-gold/10 pb-2'>
                <span className='arabic-muted'>خط الطول</span>
                <span>{coords.lng.toFixed(4)}°</span>
              </div>
              {distance != null && (
                <div className='flex justify-between border-b border-brand-gold/10 pb-2'>
                  <span className='arabic-muted'>المسافة إلى الكعبة</span>
                  <span>{distance.toLocaleString('ar-EG')} كم</span>
                </div>
              )}
              <div className='flex justify-between'>
                <span className='arabic-muted'>اتجاه القبلة</span>
                <span className='text-brand-gold'>{Math.round(qiblaDirection)}° من الشمال</span>
              </div>
            </div>
            <Button onClick={requestLocation} variant='ghost' className='w-full'>
              تحديث الموقع
            </Button>
          </Card>
        </div>
      )}
    </Container>
  );
}
