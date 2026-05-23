import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { ArrowLeft, BookMarked, Share2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Hadith {
  id: string;
  number: string;
  textAr: string;
  textEn: string;
  narratorAr: string;
  narratorEn: string;
  gradeAr: string;
  gradeEn: string;
}

const SAMPLE_HADITHS: { [key: string]: { nameAr: string; nameEn: string; hadiths: Hadith[] } } = {
  'sahih-bukhari': {
    nameAr: 'صحيح البخاري',
    nameEn: 'Sahih al-Bukhari',
    hadiths: [
      {
        id: '1',
        number: '1',
        textAr: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى',
        textEn: 'Actions are but by intention, and for every man is but that which he intended',
        narratorAr: 'عمر بن الخطاب',
        narratorEn: 'Umar ibn al-Khattab',
        gradeAr: 'صحيح',
        gradeEn: 'Sahih (Authentic)',
      },
      {
        id: '2',
        number: '2',
        textAr: 'الإسلام أن تشهد أن لا إله إلا الله وأن محمداً رسول الله',
        textEn: 'Islam is that you testify that there is no deity but Allah and that Muhammad is the Messenger of Allah',
        narratorAr: 'عمر بن الخطاب',
        narratorEn: 'Umar ibn al-Khattab',
        gradeAr: 'صحيح',
        gradeEn: 'Sahih (Authentic)',
      },
    ],
  },
  'sahih-muslim': {
    nameAr: 'صحيح مسلم',
    nameEn: 'Sahih Muslim',
    hadiths: [
      {
        id: '1',
        number: '1',
        textAr: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت',
        textEn: 'Whoever believes in Allah and the Last Day should speak good or remain silent',
        narratorAr: 'أبو هريرة',
        narratorEn: 'Abu Hurairah',
        gradeAr: 'صحيح',
        gradeEn: 'Sahih (Authentic)',
      },
    ],
  },
};

export default function HadithDetailPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/hadith/:slug');
  const slug = params?.slug || 'sahih-bukhari';
  const [searchTerm, setSearchTerm] = useState('');

  const book = SAMPLE_HADITHS[slug] || SAMPLE_HADITHS['sahih-bukhari'];
  const filteredHadiths = book.hadiths.filter(
    (h) =>
      h.textAr.includes(searchTerm) ||
      h.textEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.narratorAr.includes(searchTerm) ||
      h.narratorEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/hadith')}
              className="hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-emerald-400">{book.nameAr}</h1>
              <p className="text-slate-400 text-sm">{book.nameEn}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-slate-600 hover:border-emerald-400"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search hadiths... ابحث عن الأحاديث"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Hadiths */}
      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <Tabs defaultValue="arabic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="arabic" className="data-[state=active]:bg-emerald-400/20">
              العربية
            </TabsTrigger>
            <TabsTrigger value="english" className="data-[state=active]:bg-emerald-400/20">
              English
            </TabsTrigger>
            <TabsTrigger value="bilingual" className="data-[state=active]:bg-emerald-400/20">
              Both
            </TabsTrigger>
          </TabsList>

          <TabsContent value="arabic" className="space-y-6 mt-6">
            {filteredHadiths.map((hadith) => (
              <div
                key={hadith.id}
                className="rounded-lg bg-slate-800/30 p-6 border border-slate-700/50 hover:border-emerald-400/30 transition-all duration-300"
              >
                <div className="mb-4">
                  <p className="text-xl leading-relaxed text-white font-arabic text-right mb-3">
                    {hadith.textAr}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400 font-semibold">{hadith.gradeAr}</span>
                    <span className="text-slate-500">Hadith #{hadith.number}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50 space-y-2">
                  <p className="text-slate-400 text-sm">
                    <span className="text-slate-500">Narrator: </span>
                    {hadith.narratorAr}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="english" className="space-y-6 mt-6">
            {filteredHadiths.map((hadith) => (
              <div
                key={hadith.id}
                className="rounded-lg bg-slate-800/30 p-6 border border-slate-700/50 hover:border-emerald-400/30 transition-all duration-300"
              >
                <div className="mb-4">
                  <p className="text-lg leading-relaxed text-white mb-3">
                    {hadith.textEn}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400 font-semibold">{hadith.gradeEn}</span>
                    <span className="text-slate-500">Hadith #{hadith.number}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50 space-y-2">
                  <p className="text-slate-400 text-sm">
                    <span className="text-slate-500">Narrator: </span>
                    {hadith.narratorEn}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="bilingual" className="space-y-6 mt-6">
            {filteredHadiths.map((hadith) => (
              <div
                key={hadith.id}
                className="rounded-lg bg-slate-800/30 p-6 border border-slate-700/50 hover:border-emerald-400/30 transition-all duration-300"
              >
                <div className="mb-4 space-y-3">
                  <p className="text-lg leading-relaxed text-white font-arabic text-right">
                    {hadith.textAr}
                  </p>
                  <p className="text-base leading-relaxed text-slate-300">
                    {hadith.textEn}
                  </p>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700/50">
                    <span className="text-emerald-400 font-semibold">{hadith.gradeEn}</span>
                    <span className="text-slate-500">Hadith #{hadith.number}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50 space-y-2">
                  <p className="text-slate-400 text-sm">
                    <span className="text-slate-500">Narrator: </span>
                    {hadith.narratorAr} ({hadith.narratorEn})
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {filteredHadiths.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No hadiths found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
