'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';

const prayers = [
  { name: 'الفجر', nameEn: 'Fajr', icon: '🌅', rakaat: 2, sunnah: '2 قبلية' },
  { name: 'الظهر', nameEn: 'Dhuhr', icon: '☀️', rakaat: 4, sunnah: '4 قبلية، 2 بعدية' },
  { name: 'العصر', nameEn: 'Asr', icon: '🌤️', rakaat: 4, sunnah: '4 قبلية (مستحب)' },
  { name: 'المغرب', nameEn: 'Maghrib', icon: '🌅', rakaat: 3, sunnah: '2 بعدية' },
  { name: 'العشاء', nameEn: 'Isha', icon: '🌙', rakaat: 4, sunnah: '2 بعدية + الوتر' },
];

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

export default function PrayerPage() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الصلاة</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          الصلاة عماد الدين، تعلم كيفية أدائها وأذكارها ومواقيتها
        </p>
        {currentTime && (
          <div className="text-3xl font-bold text-brand-cream">{currentTime}</div>
        )}
      </section>

      {/* Prayer Times */}
      <section className="space-y-6">
        <SectionHeader 
          title="الصلوات الخمس" 
          subtitle="عدد الركعات والسنن الرواتب"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {prayers.map((prayer) => (
            <Card 
              key={prayer.name}
              className={`text-center space-y-3 cursor-pointer transition-all ${
                selectedPrayer === prayer.name ? 'border-brand-gold bg-brand-gold/10' : 'hover:border-brand-gold/50'
              }`}
              onClick={() => setSelectedPrayer(selectedPrayer === prayer.name ? null : prayer.name)}
            >
              <div className="text-4xl">{prayer.icon}</div>
              <h3 className="text-xl font-bold text-brand-gold">{prayer.name}</h3>
              <p className="text-sm text-brand-cream/60">{prayer.nameEn}</p>
              <Badge variant="secondary">{prayer.rakaat} ركعات</Badge>
              <p className="text-xs arabic-muted">{prayer.sunnah}</p>
            </Card>
          ))}
        </div>
      </section>

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
