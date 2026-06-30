'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type RuqyahItem = {
  title: string;
  text: string;
  source: string;
  count: number;
};

const ruqyahData: Record<string, { title: string; icon: string; intro: string; items: RuqyahItem[] }> = {
  quran: {
    title: 'آيات الرقية',
    icon: '📖',
    intro: 'آيات الرقية الشرعية الثابتة من القرآن الكريم، تُقرأ بنية الشفاء والتحصين.',
    items: [
      {
        title: 'سورة الفاتحة',
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        source: 'الفاتحة 1-7 — وهي الشافية وأم القرآن',
        count: 3,
      },
      {
        title: 'آية الكرسي',
        text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        source: 'البقرة 255 — من قرأها لم يزل عليه من الله حافظ',
        count: 1,
      },
      {
        title: 'خواتيم سورة البقرة',
        text: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا',
        source: 'البقرة 285-286 — من قرأهما في ليلة كفتاه',
        count: 1,
      },
      {
        title: 'سورة الإخلاص',
        text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        source: 'الإخلاص 1-4 — تعدل ثلث القرآن',
        count: 3,
      },
      {
        title: 'سورة الفلق',
        text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        source: 'الفلق 1-5 — من المعوذتين للتحصين',
        count: 3,
      },
      {
        title: 'سورة الناس',
        text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
        source: 'الناس 1-6 — من المعوذتين للتحصين',
        count: 3,
      },
    ],
  },
  duas: {
    title: 'أدعية الرقية النبوية',
    icon: '🤲',
    intro: 'أدعية ثابتة عن النبي ﷺ في الرقية والشفاء والتحصين.',
    items: [
      {
        title: 'دعاء المريض',
        text: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
        source: 'متفق عليه',
        count: 3,
      },
      {
        title: 'الرقية بوضع اليد',
        text: 'أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
        source: 'رواه مسلم — تُقال سبعاً مع وضع اليد على موضع الألم',
        count: 7,
      },
      {
        title: 'تعويذ النبي ﷺ',
        text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
        source: 'رواه البخاري — كان يُعوِّذ بها الحسن والحسين',
        count: 3,
      },
      {
        title: 'دعاء الكرب',
        text: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
        source: 'متفق عليه — دعاء الكرب',
        count: 1,
      },
      {
        title: 'التحصين بكلمات الله',
        text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        source: 'رواه مسلم — من قالها لم يضره شيء',
        count: 3,
      },
      {
        title: 'دعاء دفع الهم',
        text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        source: 'رواه أبو داود — من قالها سبعاً كفاه الله ما أهمه',
        count: 7,
      },
    ],
  },
};

type RuqyahCategory = keyof typeof ruqyahData;

export default function RuqyahPage() {
  const [selectedCategory, setSelectedCategory] = useState<RuqyahCategory>('quran');
  const [counters, setCounters] = useState<Record<string, number>>({});

  const current = ruqyahData[selectedCategory];

  const handleCount = (index: number, maxCount: number) => {
    const key = `${selectedCategory}-${index}`;
    const value = counters[key] || 0;
    if (value < maxCount) {
      setCounters({ ...counters, [key]: value + 1 });
    }
  };

  const resetCounters = () => {
    const next = { ...counters };
    current.items.forEach((_, idx) => {
      delete next[`${selectedCategory}-${idx}`];
    });
    setCounters(next);
  };

  return (
    <Container className="py-12 space-y-8 text-right">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الرقية الشرعية</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto leading-relaxed">
          تحصّن واستشفِ بكلام الله وأدعية النبي ﷺ الثابتة. اقرأ بنية صادقة وتوكل على الله وحده الشافي.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {(Object.keys(ruqyahData) as RuqyahCategory[]).map((key) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory(key)}
            className="flex items-center gap-2"
          >
            <span>{ruqyahData[key].icon}</span>
            <span>{ruqyahData[key].title}</span>
          </Button>
        ))}
      </div>

      <Card className="p-5 text-center bg-brand-gold/10">
        <p className="text-brand-cream/90 leading-relaxed">{current.intro}</p>
      </Card>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={resetCounters}>
          إعادة تعيين العدادات
        </Button>
      </div>

      <div className="space-y-4">
        {current.items.map((item, idx) => {
          const key = `${selectedCategory}-${idx}`;
          const value = counters[key] || 0;
          const isCompleted = value >= item.count;
          const progress = (value / item.count) * 100;

          return (
            <Card
              key={idx}
              className={`p-6 space-y-4 transition-all cursor-pointer ${isCompleted ? 'opacity-70 bg-green-900/20' : 'hover:border-brand-gold/50'}`}
              onClick={() => handleCount(idx, item.count)}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-brand-gold">{item.title}</h3>
                <span className="text-xs text-brand-cream/50 whitespace-nowrap">×{item.count}</span>
              </div>

              <p className="text-xl font-arabic leading-loose text-brand-cream text-center" dir="rtl">
                {item.text}
              </p>

              <p className="text-sm text-brand-gold/80 text-center border-t border-brand-gold/20 pt-3">
                {item.source}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-brand-gold">{value}</span>
                  <span className="text-brand-cream/60">/ {item.count}</span>
                </div>
                <div className="w-32 h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gold transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                {isCompleted && <span className="text-green-400 text-sm">تم بحمد الله</span>}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 text-center space-y-3 bg-brand-gold/10">
        <h3 className="text-xl font-bold text-brand-gold">آداب الرقية</h3>
        <ul className="text-brand-cream/90 leading-loose space-y-1 inline-block text-right">
          <li>• أن تكون بكلام الله أو بأسمائه وصفاته أو بالأدعية الثابتة.</li>
          <li>• أن تكون باللسان العربي المفهوم.</li>
          <li>• أن يعتقد الراقي أن الرقية لا تؤثر بذاتها بل بتقدير الله.</li>
          <li>• الإخلاص والتوكل على الله وحده الشافي.</li>
        </ul>
      </Card>
    </Container>
  );
}
