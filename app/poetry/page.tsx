'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';

const islamicPoems = [
  {
    id: 1,
    title: 'البردة',
    poet: 'الإمام البوصيري',
    verses: [
      { first: 'أَمِنْ تَذَكُّرِ جِيرَانٍ بِذِي سَلَمِ', second: 'مَزَجْتَ دَمْعاً جَرَى مِنْ مُقْلَةٍ بِدَمِ' },
      { first: 'أَمْ هَبَّتِ الرِّيحُ مِنْ تِلْقَاءِ كَاظِمَةٍ', second: 'وَأَوْمَضَ البَرْقُ فِي الظَّلْمَاءِ مِنْ إِضَمِ' },
      { first: 'مُحَمَّدٌ سَيِّدُ الكَوْنَيْنِ وَالثَّقَلَيْنِ', second: 'وَالفَرِيقَيْنِ مِنْ عُرْبٍ وَمِنْ عَجَمِ' },
      { first: 'نَبِيُّنَا الآمِرُ النَّاهِي فَلاَ أَحَدٌ', second: 'أَبَرَّ فِي قَوْلِ لاَ مِنْهُ وَلاَ نَعَمِ' },
    ],
    category: 'مدائح نبوية',
    year: '696 هـ',
  },
  {
    id: 2,
    title: 'نهج البردة',
    poet: 'أحمد شوقي',
    verses: [
      { first: 'رِيمٌ عَلى القاعِ بَينَ البانِ وَالعَلَمِ', second: 'أَحَلَّ سَفكَ دَمي في الأَشهُرِ الحُرُمِ' },
      { first: 'لَمّا رَنا حَدَّثَتني النَفسُ قائِلَةً', second: 'يا وَيحَ جَنبِكَ بِالسَهمِ المُصيبِ رُمي' },
      { first: 'جَحَدتُها وَكَتَمتُ السَهمَ في كَبِدي', second: 'جُرحُ الأَحِبَّةِ عِندي غَيرُ ذي أَلَمِ' },
    ],
    category: 'مدائح نبوية',
    year: '1912 م',
  },
  {
    id: 3,
    title: 'يا رب',
    poet: 'الإمام الشافعي',
    verses: [
      { first: 'يَا رَبِّ إِنْ عَظُمَتْ ذُنُوبِي كَثْرَةً', second: 'فَلَقَدْ عَلِمْتُ بِأَنَّ عَفْوَكَ أَعْظَمُ' },
      { first: 'إِنْ كَانَ لاَ يَرْجُوكَ إِلاَّ مُحْسِنٌ', second: 'فَبِمَنْ يَلُوذُ وَيَسْتَجِيرُ الْمُجْرِمُ' },
      { first: 'أَدْعُوكَ رَبِّ كَمَا أَمَرْتَ تَضَرُّعاً', second: 'فَإِذَا رَدَدْتَ يَدِي فَمَنْ ذَا يَرْحَمُ' },
      { first: 'مَا لِي إِلَيْكَ وَسِيلَةٌ إِلاَّ الرَّجَا', second: 'وَجَمِيلُ عَفْوِكَ ثُمَّ أَنِّي مُسْلِمُ' },
    ],
    category: 'مناجاة',
    year: '204 هـ',
  },
  {
    id: 4,
    title: 'دع الأيام',
    poet: 'الإمام الشافعي',
    verses: [
      { first: 'دَعِ الأَيَّامَ تَفْعَل مَا تَشَاءُ', second: 'وَطِبْ نَفْساً إِذَا حَكَمَ القَضَاءُ' },
      { first: 'وَلاَ تَجْزَعْ لِنَازِلَةِ اللَّيَالِي', second: 'فَمَا لِحَوَادِثِ الدُّنْيَا بَقَاءُ' },
      { first: 'وَكُنْ رَجُلاً عَلَى الأَهْوَالِ جَلْداً', second: 'وَشِيمَتُكَ السَّمَاحَةُ وَالوَفَاءُ' },
      { first: 'وَإِنْ كَثُرَتْ عُيُوبُكَ فِي البَرَايَا', second: 'وَسَرَّكَ أَنْ يَكُونَ لَهَا غِطَاءُ' },
      { first: 'تَسَتَّرْ بِالسَّخَاءِ فَكُلُّ عَيْبٍ', second: 'يُغَطِّيهِ كَمَا قِيلَ السَّخَاءُ' },
    ],
    category: 'حكمة',
    year: '204 هـ',
  },
  {
    id: 5,
    title: 'إلهي',
    poet: 'رابعة العدوية',
    verses: [
      { first: 'إِلَهِي أَنَا مَنْ يَطْمَعُ فِي فَضْلِكَ', second: 'وَأَنْتَ الَّذِي أَوْلَيْتَهُ كُلَّ نِعْمَةٍ' },
      { first: 'أُحِبُّكَ حُبَّيْنِ حُبَّ الهَوَى', second: 'وَحُبّاً لِأَنَّكَ أَهْلٌ لِذَاكَا' },
      { first: 'فَأَمَّا الَّذِي هُوَ حُبُّ الهَوَى', second: 'فَشُغْلِي بِذِكْرِكَ عَمَّنْ سِوَاكَا' },
    ],
    category: 'تصوف',
    year: '185 هـ',
  },
  {
    id: 6,
    title: 'همزية البوصيري',
    poet: 'الإمام البوصيري',
    verses: [
      { first: 'كَيْفَ تَرْقَى رُقِيَّكَ الأَنْبِيَاءُ', second: 'يَا سَمَاءً مَا طَاوَلَتْهَا سَمَاءُ' },
      { first: 'لَمْ يُسَاوُوكَ فِي عُلاَكَ وَقَدْ حَا', second: 'لَ سَنَاً مِنْكَ دُونَهُمْ وَسَنَاءُ' },
      { first: 'إِنَّمَا مَثَّلُوا صِفَاتِكَ لِلنَّا', second: 'سِ كَمَا مَثَّلَ النُّجُومَ المَاءُ' },
    ],
    category: 'مدائح نبوية',
    year: '696 هـ',
  },
  {
    id: 7,
    title: 'طلع البدر علينا',
    poet: 'أنشودة الأنصار',
    verses: [
      { first: 'طَلَعَ البَدْرُ عَلَيْنَا', second: 'مِنْ ثَنِيَّاتِ الوَدَاعِ' },
      { first: 'وَجَبَ الشُّكْرُ عَلَيْنَا', second: 'مَا دَعَا لِلَّهِ دَاعِ' },
      { first: 'أَيُّهَا المَبْعُوثُ فِينَا', second: 'جِئْتَ بِالأَمْرِ المُطَاعِ' },
      { first: 'جِئْتَ شَرَّفْتَ المَدِينَة', second: 'مَرْحَباً يَا خَيْرَ دَاعِ' },
    ],
    category: 'مدائح نبوية',
    year: '1 هـ',
  },
  {
    id: 8,
    title: 'إذا المرء لم يدنس',
    poet: 'السموأل بن عادياء',
    verses: [
      { first: 'إِذَا المَرْءُ لَمْ يَدْنَسْ مِنَ اللُّؤْمِ عِرْضُهُ', second: 'فَكُلُّ رِدَاءٍ يَرْتَدِيهِ جَمِيلُ' },
      { first: 'وَإِنْ هُوَ لَمْ يَحْمِلْ عَلَى النَّفْسِ ضَيْمَهَا', second: 'فَلَيْسَ إِلَى حُسْنِ الثَّنَاءِ سَبِيلُ' },
      { first: 'تُعَيِّرُنَا أَنَّا قَلِيلٌ عَدِيدُنَا', second: 'فَقُلْتُ لَهَا إِنَّ الكِرَامَ قَلِيلُ' },
    ],
    category: 'حكمة',
    year: '560 م',
  },
];

const categories = ['الكل', 'مدائح نبوية', 'مناجاة', 'حكمة', 'تصوف'];

interface UserPoem {
  id: string;
  title: string;
  content: string;
  aiInsight?: string;
  createdAt: Date;
}

export default function PoetryPage() {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [userPoem, setUserPoem] = useState('');
  const [userPoemTitle, setUserPoemTitle] = useState('');
  const [savedPoems, setSavedPoems] = useState<UserPoem[]>([]);
  const [showWriteSection, setShowWriteSection] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [expandedPoem, setExpandedPoem] = useState<number | null>(null);

  const filteredPoems = selectedCategory === 'الكل'
    ? islamicPoems
    : islamicPoems.filter(p => p.category === selectedCategory);

  const handleSavePoem = async () => {
    if (userPoem.trim() && userPoemTitle.trim()) {
      const newPoem: UserPoem = {
        id: Date.now().toString(),
        title: userPoemTitle,
        content: userPoem,
        createdAt: new Date(),
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

  const handleDeletePoem = (id: string) => {
    setSavedPoems(savedPoems.filter(p => p.id !== id));
  };

  return (
    <Container className="py-12 space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الشعر الإسلامي</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto leading-relaxed">
          استمتع بأجمل قصائد الشعر الإسلامي من أعظم الشعراء عبر التاريخ،
          واكتب قصائدك الخاصة واحصل على رؤى وتحليلات من الذكاء الاصطناعي
        </p>
      </section>

      {/* Categories and Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
            {cat !== 'الكل' && (
              <Badge variant="secondary" className="mr-2 text-xs">
                {islamicPoems.filter(p => p.category === cat).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="secondary"
          onClick={() => setShowWriteSection(!showWriteSection)}
          className="px-8"
        >
          {showWriteSection ? 'إخفاء محرر الشعر' : 'اكتب قصيدتك الخاصة'}
        </Button>
      </div>

      {/* Write Section */}
      {showWriteSection && (
        <Card className="p-6 space-y-4 border-brand-gold/40">
          <SectionHeader
            title="اكتب قصيدتك"
            subtitle="عبّر عن مشاعرك بالشعر واحصل على تحليل من الذكاء الاصطناعي"
          />
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 font-medium">عنوان القصيدة</label>
              <input
                type="text"
                value={userPoemTitle}
                onChange={(e) => setUserPoemTitle(e.target.value)}
                placeholder="أدخل عنوان قصيدتك..."
                maxLength={100}
                className="w-full rounded-lg border border-brand-gold/20 bg-black/20 p-3 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2 font-medium">نص القصيدة</label>
              <textarea
                value={userPoem}
                onChange={(e) => setUserPoem(e.target.value.slice(0, 1000))}
                placeholder={'اكتب أبياتك هنا...\nيمكنك كتابة الشعر الحر أو الموزون'}
                rows={10}
                className="w-full rounded-lg border border-brand-gold/20 bg-black/20 p-4 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none resize-none font-arabic text-lg leading-loose"
                dir="rtl"
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-brand-cream/50">{userPoem.length}/1000 حرف</p>
                <p className="text-xs text-brand-cream/50">
                  {userPoem.split('\n').filter(l => l.trim()).length} سطر
                </p>
              </div>
            </div>

            {aiError && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <p className="text-sm text-amber-300">{aiError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={handleSavePoem} 
                className="flex-1"
                disabled={aiLoading || !userPoem.trim() || !userPoemTitle.trim()}
              >
                {aiLoading ? 'جاري التحليل...' : 'حفظ والحصول على رؤية'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setUserPoem('');
                  setUserPoemTitle('');
                }}
                disabled={!userPoem && !userPoemTitle}
              >
                مسح
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* User's Saved Poems */}
      {savedPoems.length > 0 && (
        <section className="space-y-6">
          <SectionHeader
            title="قصائدي المحفوظة"
            subtitle={`${savedPoems.length} قصيدة محفوظة`}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {savedPoems.map((poem) => (
              <Card key={poem.id} className="p-6 space-y-4 relative">
                <button
                  onClick={() => handleDeletePoem(poem.id)}
                  className="absolute top-4 left-4 text-red-400 hover:text-red-300 text-sm"
                  title="حذف القصيدة"
                >
                  حذف
                </button>
                <div>
                  <h3 className="text-xl font-bold text-brand-gold">{poem.title}</h3>
                  <p className="text-xs arabic-muted mt-1">
                    {poem.createdAt.toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <p className="whitespace-pre-wrap text-brand-cream/90 font-arabic leading-loose">
                  {poem.content}
                </p>
                
                {poem.aiInsight && (
                  <div className="pt-4 border-t border-brand-gold/20 space-y-2">
                    <p className="text-sm font-semibold text-brand-gold">تحليل الذكاء الاصطناعي:</p>
                    <p className="text-sm text-brand-cream/80 leading-relaxed">
                      {poem.aiInsight}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Classic Islamic Poetry */}
      <section className="space-y-6">
        <SectionHeader
          title="من روائع الشعر الإسلامي"
          subtitle={`${filteredPoems.length} قصيدة من أجمل ما قيل`}
        />

        <div className="space-y-4">
          {filteredPoems.map((poem) => {
            const isExpanded = expandedPoem === poem.id;
            const displayVerses = isExpanded ? poem.verses : poem.verses.slice(0, 3);
            
            return (
              <Card key={poem.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-brand-gold">{poem.title}</h3>
                    <p className="text-sm text-brand-cream/60 mt-1">{poem.poet}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline" className="text-xs">
                      {poem.year}
                    </Badge>
                    <Badge className="bg-brand-gold/20 text-brand-gold text-xs">
                      {poem.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 border-t border-brand-gold/20 pt-4">
                  {displayVerses.map((verse, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center font-arabic text-lg leading-loose">
                      <p className="text-brand-cream">{verse.first}</p>
                      <p className="text-brand-cream/80">{verse.second}</p>
                    </div>
                  ))}
                  
                  {poem.verses.length > 3 && (
                    <button
                      onClick={() => setExpandedPoem(isExpanded ? null : poem.id)}
                      className="w-full text-center text-sm text-brand-gold hover:underline pt-2"
                    >
                      {isExpanded ? 'عرض أقل' : `عرض المزيد (${poem.verses.length - 3} أبيات)`}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Info Section */}
      <section className="text-center space-y-4">
        <Card className="py-8 space-y-4 bg-brand-gold/5 border-brand-gold/30">
          <h2 className="text-2xl font-bold text-brand-gold">شارك إبداعك</h2>
          <p className="arabic-muted max-w-xl mx-auto leading-7">
            الشعر هو لغة الروح وصدى المشاعر. شاركنا قصائدك واستمتع بتحليلات الذكاء الاصطناعي
            التي تساعدك على فهم جماليات شعرك وتطوير أسلوبك.
          </p>
          {!showWriteSection && (
            <Button onClick={() => setShowWriteSection(true)} variant="secondary">
              ابدأ الكتابة الآن
            </Button>
          )}
        </Card>
      </section>
    </Container>
  );
}
