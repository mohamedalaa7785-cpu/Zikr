import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { ArrowLeft, BookOpen, Volume2, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Ayah {
  number: number;
  textAr: string;
  textEn: string;
}

const QURAN_DATA: { [key: number]: { nameAr: string; nameEn: string; ayahs: Ayah[] } } = {
  1: {
    nameAr: 'الفاتحة',
    nameEn: 'Al-Fatiha',
    ayahs: [
      {
        number: 1,
        textAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        textEn: 'In the name of Allah, the Most Gracious, the Most Merciful',
      },
      {
        number: 2,
        textAr: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        textEn: 'All praise is due to Allah, Lord of the worlds',
      },
      {
        number: 3,
        textAr: 'الرَّحْمَٰنِ الرَّحِيمِ',
        textEn: 'The Most Gracious, the Most Merciful',
      },
      {
        number: 4,
        textAr: 'مَالِكِ يَوْمِ الدِّينِ',
        textEn: 'Master of the Day of Judgment',
      },
      {
        number: 5,
        textAr: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        textEn: 'You alone we worship, and You alone we ask for help',
      },
      {
        number: 6,
        textAr: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        textEn: 'Guide us to the straight path',
      },
      {
        number: 7,
        textAr: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        textEn: 'The path of those upon whom You have bestowed favor, not of those who have earned Your anger, nor of those who are astray',
      },
    ],
  },
};

export default function QuranDetailPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/quran/:id');
  const surahId = params?.id ? parseInt(params.id) : 1;
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const surah = QURAN_DATA[surahId] || QURAN_DATA[1];

  useEffect(() => {
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('quran_bookmarks');
    if (saved) {
      setBookmarked(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (ayahNumber: number) => {
    const updated = bookmarked.includes(ayahNumber)
      ? bookmarked.filter((n) => n !== ayahNumber)
      : [...bookmarked, ayahNumber];
    setBookmarked(updated);
    localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-emerald-500/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/quran')}
              className="hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-amber-400">{surah.nameAr}</h1>
              <p className="text-slate-400 text-sm">{surah.nameEn}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="border-slate-600 hover:border-emerald-400">
              <Volume2 className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="border-slate-600 hover:border-amber-400">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="arabic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="arabic" className="data-[state=active]:bg-amber-400/20">
              العربية
            </TabsTrigger>
            <TabsTrigger value="english" className="data-[state=active]:bg-amber-400/20">
              English
            </TabsTrigger>
            <TabsTrigger value="bilingual" className="data-[state=active]:bg-amber-400/20">
              Both
            </TabsTrigger>
          </TabsList>

          <TabsContent value="arabic" className="space-y-6 mt-6">
            {surah.ayahs.map((ayah) => (
              <div
                key={ayah.number}
                className="group relative rounded-lg bg-slate-800/30 p-6 border border-slate-700/50 hover:border-amber-400/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 text-right">
                    <p className="text-xl leading-relaxed text-white font-arabic mb-2">
                      {ayah.textAr}
                    </p>
                    <p className="text-sm text-slate-500">Ayah {ayah.number}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(ayah.number)}
                      className={
                        bookmarked.includes(ayah.number)
                          ? 'text-amber-400'
                          : 'text-slate-500 hover:text-amber-400'
                      }
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={bookmarked.includes(ayah.number) ? 'currentColor' : 'none'}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-emerald-400"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="english" className="space-y-6 mt-6">
            {surah.ayahs.map((ayah) => (
              <div
                key={ayah.number}
                className="group relative rounded-lg bg-slate-800/30 p-6 border border-slate-700/50 hover:border-emerald-400/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-white mb-2">
                      {ayah.textEn}
                    </p>
                    <p className="text-sm text-slate-500">Ayah {ayah.number}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(ayah.number)}
                      className={
                        bookmarked.includes(ayah.number)
                          ? 'text-amber-400'
                          : 'text-slate-500 hover:text-amber-400'
                      }
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={bookmarked.includes(ayah.number) ? 'currentColor' : 'none'}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-emerald-400"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="bilingual" className="space-y-6 mt-6">
            {surah.ayahs.map((ayah) => (
              <div
                key={ayah.number}
                className="group relative rounded-lg bg-slate-800/30 p-6 border border-slate-700/50 hover:border-amber-400/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <p className="text-lg leading-relaxed text-white font-arabic text-right">
                      {ayah.textAr}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {ayah.textEn}
                    </p>
                    <p className="text-xs text-slate-500">Ayah {ayah.number}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(ayah.number)}
                      className={
                        bookmarked.includes(ayah.number)
                          ? 'text-amber-400'
                          : 'text-slate-500 hover:text-amber-400'
                      }
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={bookmarked.includes(ayah.number) ? 'currentColor' : 'none'}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-emerald-400"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
