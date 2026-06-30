'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateQibla, getQiblaFromGeolocation, getDistanceToMecca, formatBearing } from '@/lib/services/qibla';

interface QiblaState {
  direction: number | null;
  directionName: string | null;
  distance: number | null;
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export default function QiblaPage() {
  const [qibla, setQibla] = useState<QiblaState>({
    direction: null,
    directionName: null,
    distance: null,
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const handleGetQibla = async () => {
    setQibla((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const qiblaDir = await getQiblaFromGeolocation();
      if (qiblaDir) {
        const distance = getDistanceToMecca({
          latitude: qiblaDir.meccaLatitude,
          longitude: qiblaDir.meccaLongitude,
        });
        setQibla({
          direction: qiblaDir.direction,
          directionName: qiblaDir.directionName,
          distance,
          latitude: qiblaDir.meccaLatitude,
          longitude: qiblaDir.meccaLongitude,
          loading: false,
          error: null,
        });
      } else {
        setQibla((prev) => ({
          ...prev,
          loading: false,
          error: 'تعذر الوصول إلى موقعك الجغرافي. تأكد من تفعيل خدمات الموقع.',
        }));
      }
    } catch (err) {
      setQibla((prev) => ({
        ...prev,
        loading: false,
        error: 'حدث خطأ أثناء حساب اتجاه القبلة',
      }));
    }
  };

  useEffect(() => {
    handleGetQibla();
  }, []);

  return (
    <Container className="py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">🕌 محدد القبلة</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto">
          احصل على اتجاه القبلة بدقة من موقعك الحالي
        </p>
      </div>

      {/* Qibla Compass */}
      {qibla.direction !== null && (
        <div className="flex justify-center">
          <div className="relative w-64 h-64 rounded-full border-4 border-brand-gold bg-black/40 flex items-center justify-center">
            {/* Compass Circle */}
            <svg className="absolute w-full h-full" viewBox="0 0 200 200">
              {/* Cardinal Directions */}
              <text x="100" y="20" textAnchor="middle" className="fill-brand-gold text-sm font-bold">
                شمال
              </text>
              <text x="180" y="105" textAnchor="middle" className="fill-brand-gold text-sm font-bold">
                شرق
              </text>
              <text x="100" y="190" textAnchor="middle" className="fill-brand-gold text-sm font-bold">
                جنوب
              </text>
              <text x="20" y="105" textAnchor="middle" className="fill-brand-gold text-sm font-bold">
                غرب
              </text>

              {/* Degree markers */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree) => {
                const rad = (degree * Math.PI) / 180;
                const x1 = 100 + 85 * Math.cos(rad - Math.PI / 2);
                const y1 = 100 + 85 * Math.sin(rad - Math.PI / 2);
                const x2 = 100 + 95 * Math.cos(rad - Math.PI / 2);
                const y2 = 100 + 95 * Math.sin(rad - Math.PI / 2);
                return (
                  <line key={degree} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4AF37" strokeWidth="1" />
                );
              })}

              {/* Qibla Direction Needle */}
              <g transform={`rotate(${qibla.direction} 100 100)`}>
                <polygon points="100,20 95,80 100,100 105,80" fill="#D4AF37" opacity="0.9" />
              </g>
            </svg>

            {/* Center Circle */}
            <div className="absolute w-12 h-12 rounded-full bg-brand-gold/20 border-2 border-brand-gold flex items-center justify-center">
              <span className="text-2xl">🕌</span>
            </div>
          </div>
        </div>
      )}

      {/* Qibla Information */}
      {qibla.direction !== null && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 text-center space-y-3 bg-black/30 border-brand-gold/30">
            <h3 className="text-sm text-brand-cream/70">اتجاه القبلة</h3>
            <p className="text-4xl font-bold text-brand-gold">{qibla.direction}°</p>
            <p className="text-brand-cream">{qibla.directionName}</p>
          </Card>

          <Card className="p-6 text-center space-y-3 bg-black/30 border-brand-gold/30">
            <h3 className="text-sm text-brand-cream/70">الاتجاه المختصر</h3>
            <p className="text-4xl font-bold text-brand-gold">{formatBearing(qibla.direction)}</p>
            <p className="text-brand-cream">بوصلة</p>
          </Card>

          <Card className="p-6 text-center space-y-3 bg-black/30 border-brand-gold/30">
            <h3 className="text-sm text-brand-cream/70">المسافة إلى مكة</h3>
            <p className="text-4xl font-bold text-brand-gold">{qibla.distance}</p>
            <p className="text-brand-cream">كيلومتر</p>
          </Card>
        </div>
      )}

      {/* Error State */}
      {qibla.error && (
        <Card className="p-6 bg-red-500/10 border-red-500/30 space-y-4">
          <p className="text-red-400">{qibla.error}</p>
          <Button onClick={handleGetQibla} variant="primary" className="w-full">
            حاول مرة أخرى
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {qibla.loading && (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">جاري تحديد موقعك...</p>
        </div>
      )}

      {/* Instructions */}
      <Card className="p-8 space-y-6 bg-black/30 border-brand-gold/30">
        <h2 className="text-2xl font-bold text-brand-gold">كيفية الاستخدام</h2>
        <div className="space-y-4 text-brand-cream/80">
          <div className="flex gap-4">
            <span className="text-2xl">1️⃣</span>
            <div>
              <h3 className="font-bold text-brand-gold">فعّل خدمات الموقع</h3>
              <p>تأكد من أن متصفحك لديه إذن بالوصول إلى موقعك الجغرافي</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl">2️⃣</span>
            <div>
              <h3 className="font-bold text-brand-gold">اسمح للموقع بالوصول</h3>
              <p>انقر على "السماح" عندما يطلب المتصفح إذن الموقع</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl">3️⃣</span>
            <div>
              <h3 className="font-bold text-brand-gold">اتجه نحو الإبرة الذهبية</h3>
              <p>الإبرة تشير إلى اتجاه مكة المكرمة (القبلة)</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl">4️⃣</span>
            <div>
              <h3 className="font-bold text-brand-gold">تحقق من الدقة</h3>
              <p>استخدم البوصلة المدمجة للتحقق من الاتجاه الصحيح</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Information Section */}
      <Card className="p-8 space-y-4 bg-brand-gold/10 border-brand-gold/30">
        <h3 className="text-xl font-bold text-brand-gold">معلومات مهمة</h3>
        <ul className="space-y-2 text-brand-cream/80 text-sm">
          <li>• مكة المكرمة تقع على إحداثيات: 21.4225° شمالاً، 39.8262° شرقاً</li>
          <li>• الاتجاه يتم حسابه بناءً على موقعك الحالي</li>
          <li>• الدقة تعتمد على دقة نظام تحديد الموقع في جهازك</li>
          <li>• استخدم البوصلة للتحقق من الاتجاه في الأماكن المغلقة</li>
        </ul>
      </Card>
    </Container>
  );
}
