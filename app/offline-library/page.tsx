'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchOfflineManifest, hydrateOfflineContent } from '@/lib/offline-pack';

type Manifest = Awaited<ReturnType<typeof fetchOfflineManifest>>;

export default function OfflineLibraryPage() {
  const [manifest, setManifest] = useState<Manifest>(null);
  const [status, setStatus] = useState('جاري فحص الحزمة الأوفلاين…');
  const [isHydrating, setIsHydrating] = useState(false);

  useEffect(() => {
    void fetchOfflineManifest().then((next) => {
      setManifest(next);
      setStatus(next ? 'الحزمة متاحة للتصفح دون اتصال بعد اكتمال التنزيل.' : 'لم يتم العثور على manifest محلي حتى الآن.');
    });
  }, []);

  const hydrate = async () => {
    setIsHydrating(true);
    setStatus('جاري تنزيل المحتوى إلى ذاكرة الجهاز…');
    const next = await hydrateOfflineContent({ force: true });
    setManifest(next);
    setStatus(next ? 'تم تنزيل الحزمة إلى IndexedDB بنجاح.' : 'تعذر تنزيل الحزمة؛ تحقق من الاتصال ثم أعد المحاولة.');
    setIsHydrating(false);
  };

  const datasets = manifest ? Object.entries(manifest.datasets) : [];
  const total = datasets.reduce((sum, [, item]) => sum + item.count, 0);

  return (
    <Container className="space-y-8 py-10 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-gold">PWA · IndexedDB</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">مكتبة ذِكر الأوفلاين</h1>
          <p className="mt-3 max-w-3xl leading-8 text-muted-foreground">هذه الصفحة تعرض ما تم تجهيزه للتصفح دون شبكة. تُحفظ البيانات العامة محليًا، ولا تُحفظ بيانات الحساب أو العمليات الإدارية.</p>
        </div>
        <Button onClick={hydrate} disabled={isHydrating}>{isHydrating ? 'جاري التنزيل…' : 'تحديث الحزمة'}</Button>
      </div>

      <Card className="space-y-3 border-brand-gold/20">
        <p className="text-sm text-brand-gold">الحالة</p>
        <p className="leading-8 text-foreground">{status}</p>
        {manifest && <p className="text-xs text-muted-foreground">الإصدار: {manifest.version} · المسارات الأوفلاين: {manifest.routes.length} · إجمالي السجلات: {total.toLocaleString('ar-EG')}</p>}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {datasets.map(([name, item]) => (
          <Card key={name} className="space-y-2 border-brand-gold/10">
            <h2 className="font-semibold text-brand-gold">{name}</h2>
            <p className="text-2xl font-bold text-foreground">{item.count.toLocaleString('ar-EG')}</p>
            <p className="text-xs text-muted-foreground">سجل محفوظ في الحزمة</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/mushaf" className="text-sm text-brand-gold underline-offset-4 hover:underline">فتح المصحف</Link>
        <Link href="/prophets" className="text-sm text-brand-gold underline-offset-4 hover:underline">قصص الأنبياء</Link>
        <Link href="/battles" className="text-sm text-brand-gold underline-offset-4 hover:underline">الغزوات</Link>
        <Link href="/conquests" className="text-sm text-brand-gold underline-offset-4 hover:underline">الفتوحات</Link>
      </div>
    </Container>
  );
}
