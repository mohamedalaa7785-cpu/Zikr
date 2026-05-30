'use client';

import { useState, useCallback } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const islamicPoems = [
  {
    id: 1,
    title: 'البردة',
    poet: 'الإمام البوصيري',
    verses: [
      { first: 'أَمِنْ تَذَكُّرِ جِيرَانٍ بِذِي سَلَمِ', second: 'مَزَجْتَ دَمْعاً جَرَى مِنْ مُقْلَةٍ بِدَمِ' },
      { first: 'أَمْ هَبَّتِ الرِّيحُ مِنْ تِلْقَاءِ كَاظِمَةٍ', second: 'وَأَوْمَضَ البَرْقُ فِي الظَّلْمَاءِ مِنْ إِضَمِ' },
      { first: 'مُحَمَّدٌ سَيِّدُ الكَوْنَيْنِ وَالثَّقَلَيْنِ', second: 'وَالفَرِيقَيْنِ مِنْ عُرْبٍ وَمِنْ عَجَمِ' },
    ],
    category: 'مدائح نبوية',
  },
  {
    id: 2,
    title: 'نهج البردة',
    poet: 'أحمد شوقي',
    verses: [
      { first: 'رِيمٌ عَلى القاعِ بَينَ البانِ وَالعَلَمِ', second: 'أَحَلَّ سَفكَ دَمي في الأَشهُرِ الحُرُمِ' },
      { first: 'لَمّا رَنا حَدَّثَتني النَفسُ قائِلَةً', second: 'يا وَيحَ جَنبِكَ بِالسَهمِ المُصيبِ رُمي' },
    ],
    category: 'مدائح نبوية',
  },
  {
    id: 3,
    title: 'يا رب',
    poet: 'الإمام الشافعي',
    verses: [
      { first: 'يَا رَبِّ إِنْ عَظُمَتْ ذُنُوبِي كَثْرَةً', second: 'فَلَقَدْ عَلِمْتُ بِأَنَّ عَفْوَكَ أَعْظَمُ' },
      { first: 'إِنْ كَانَ لاَ يَرْجُوكَ إِلاَّ مُحْسِنٌ', second: 'فَبِمَنْ يَلُوذُ وَيَسْتَجِيرُ الْمُجْرِمُ' },
      { first: 'أَدْعُوكَ رَبِّ كَمَا أَمَرْتَ تَضَرُّعاً', second: 'فَإِذَا رَدَدْتَ يَدِي فَمَنْ ذَا يَرْحَمُ' },
    ],
    category: 'مناجاة',
  },
  {
    id: 4,
    title: 'دع الأيام',
    poet: 'الإمام الشافعي',
    verses: [
      { first: 'دَعِ الأَيَّامَ تَفْعَل مَا تَشَاءُ', second: 'وَطِبْ نَفْساً إِذَا حَكَمَ القَضَاءُ' },
      { first: 'وَلاَ تَجْزَعْ لِنَازِلَةِ اللَّيَالِي', second: 'فَمَا لِحَوَادِثِ الدُّنْيَا بَقَاءُ' },
      { first: 'وَكُنْ رَجُلاً عَلَى الأَهْوَالِ جَلْداً', second: 'وَشِيمَتُكَ السَّمَاحَةُ وَالوَفَاءُ' },
    ],
    category: 'حكمة',
  },
  {
    id: 5,
    title: 'إلهي',
    poet: 'رابعة العدوية',
    verses: [
      { first: 'إِلَهِي أَنَا مَنْ يَطْمَعُ فِي فَضْلِكَ', second: 'وَأَنْتَ الَّذِي أَوْلَيْتَهُ كُلَّ نِعْمَةٍ' },
      { first: 'أُحِبُّكَ حُبَّيْنِ حُبَّ الهَوَى', second: 'وَحُبّاً لِأَنَّكَ أَهْلٌ لِذَاكَا' },
    ],
    category: 'تصوف',
  },
];

const categories = ['الكل', 'مدائح نبوية', 'مناجاة', 'حكمة', 'تصوف'];

interface UserPoem {
  id: string;
  title: string;
  content: string;
  aiInsight?: string;
}

export default function PoetryPage() {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [userPoem, setUserPoem] = useState('');
  const [userPoemTitle, setUserPoemTitle] = useState('');
  const [savedPoems, setSavedPoems] = useState<UserPoem[]>([]);
  const [showWriteSection, setShowWriteSection] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const filteredPoems = selectedCategory === 'الكل'
    ? islamicPoems
    : islamicPoems.filter(p => p.category === selectedCategory);

  const handleSavePoem = async () => {
    if (userPoem.trim() && userPoemTitle.trim()) {
      const newPoem: UserPoem = {
        id: Date.now().toString(),
        title: userPoemTitle,
        content: userPoem,
      };

      // Get AI insight using Gemini
      try {
        setAiLoading(true);
        setAiError('');
        
        const response = await fetch('/api/poetry-insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ poem: userPoem, title: userPoemTitle }),
        });

        if (response.ok) {
          const { insight } = await response.json();
          newPoem.aiInsight = insight;
        }
      } catch (err) {
        console.error('Failed to get AI insight:', err);
        setAiError('لم نتمكن من الحصول على الرؤية، لكن تم حفظ القصيدة.');
      } finally {
        setAiLoading(false);
      }

      setSavedPoems([newPoem, ...savedPoems]);
      setUserPoem('');
      setUserPoemTitle('');
      setShowWriteSection(false);
    }
  };

  return (
    <Container className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الشعر الإسلامي</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto">
          استمتع بأجمل قصائد الشعر الإسلامي من أعظم الشعراء، واكتب قصائدك الخاصة مع رؤى من الذكاء الاصطناعي
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
        <Button
          variant="secondary"
          onClick={() => setShowWriteSection(!showWriteSection)}
        >
          {showWriteSection ? 'إخفاء الكتابة' : 'اكتب قصيدتك'}
        </Button>
      </div>

      {showWriteSection && (
        <Card className="p-6 space-y-4 border-brand-gold/40">
          <h2 className="text-2xl font-bold text-brand-gold text-center">اكتب قصيدتك</h2>
          <p className="text-sm text-center arabic-muted">ستحصل على رؤية من الذكاء الاصطناعي عند الحفظ</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 font-medium">عنوان القصيدة</label>
              <input
                type="text"
                value={userPoemTitle}
                onChange={(e) => setUserPoemTitle(e.target.value)}
                placeholder="أدخل عنوان قصيدتك..."
                className="w-full rounded-lg border border-brand-gold/20 bg-black/20 p-3 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2 font-medium">نص القصيدة</label>
              <textarea
                value={userPoem}
                onChange={(e) => setUserPoem(e.target.value)}
                placeholder="اكتب أبياتك هنا..."
                rows={8}
                className="w-full rounded-lg border border-brand-gold/20 bg-black/20 p-4 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none resize-none font-arabic text-lg leading-relaxed"
                dir="rtl"
              />
              <p className="text-xs text-brand-cream/50 mt-2">{userPoem.length}/500 حرف</p>
            </div>

            {aiError && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <p className="text-sm text-amber-300">{aiError}</p>
              </div>
            )}

            <Button 
              onClick={handleSavePoem} 
              className="w-full"
              disabled={aiLoading || !userPoem.trim() || !userPoemTitle.trim()}
            >
              {aiLoading ? 'جاري التحليل بـ AI...' : 'حفظ القصيدة والحصول على رؤية'}
            </Button>
          </div>
        </Card>
      )}

      {savedPoems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-gold text-center">قصائدي المحفوظة</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {savedPoems.map((poem) => (
              <Card key={poem.id} className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-brand-gold">{poem.title}</h3>
                <p className="whitespace-pre-wrap text-brand-cream/90 font-arabic leading-relaxed">
                  {poem.content}
                </p>
                
                {poem.aiInsight && (
                  <div className="pt-4 border-t border-brand-gold/20 space-y-2">
                    <p className="text-sm font-semibold text-brand-gold">رؤية الذكاء الاصطناعي:</p>
                    <p className="text-sm text-brand-cream/80 leading-relaxed">
                      {poem.aiInsight}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-gold text-center">من روائع الشعر الإسلامي</h2>

        {filteredPoems.map((poem) => (
          <Card key={poem.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-brand-gold">{poem.title}</h3>
                <p className="text-sm text-brand-cream/60">{poem.poet}</p>
              </div>
              <span className="text-xs bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full">
                {poem.category}
              </span>
            </div>

            <div className="space-y-3 border-t border-brand-gold/20 pt-4">
              {poem.verses.map((verse, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 text-center font-arabic text-lg leading-relaxed">
                  <p className="text-brand-cream">{verse.first}</p>
                  <p className="text-brand-cream/80">{verse.second}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
