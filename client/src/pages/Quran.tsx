import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { BookOpen, Volume2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Surah {
  id: number;
  nameAr: string;
  nameEn: string;
  ayahsCount: number;
  revelationPlace: string;
}

const SURAHS: Surah[] = [
  { id: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatiha', ayahsCount: 7, revelationPlace: 'Makkah' },
  { id: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', ayahsCount: 286, revelationPlace: 'Madinah' },
  { id: 3, nameAr: 'آل عمران', nameEn: 'Aal-Imran', ayahsCount: 200, revelationPlace: 'Madinah' },
  { id: 4, nameAr: 'النساء', nameEn: 'An-Nisa', ayahsCount: 176, revelationPlace: 'Madinah' },
  { id: 5, nameAr: 'المائدة', nameEn: 'Al-Maidah', ayahsCount: 120, revelationPlace: 'Madinah' },
  { id: 6, nameAr: 'الأنعام', nameEn: 'Al-Anam', ayahsCount: 165, revelationPlace: 'Makkah' },
  { id: 7, nameAr: 'الأعراف', nameEn: 'Al-Araf', ayahsCount: 206, revelationPlace: 'Makkah' },
  { id: 8, nameAr: 'الأنفال', nameEn: 'Al-Anfal', ayahsCount: 75, revelationPlace: 'Madinah' },
  { id: 9, nameAr: 'التوبة', nameEn: 'At-Tawbah', ayahsCount: 129, revelationPlace: 'Madinah' },
  { id: 10, nameAr: 'يونس', nameEn: 'Yunus', ayahsCount: 109, revelationPlace: 'Makkah' },
];

export default function QuranPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>(SURAHS);

  useEffect(() => {
    const filtered = SURAHS.filter(
      (surah) =>
        surah.nameAr.includes(searchTerm) ||
        surah.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSurahs(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-700/50 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-emerald-500/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              القرآن الكريم
            </h1>
          </div>
          <p className="text-slate-300 text-lg">The Noble Quran - Read and Reflect</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search Surahs... ابحث عن السور"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Surahs Grid */}
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.id}
              onClick={() => navigate(`/quran/${surah.id}`)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50 transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-1">{surah.nameAr}</h3>
                    <p className="text-amber-400 font-semibold">{surah.nameEn}</p>
                  </div>
                  <div className="text-right text-slate-400 text-sm">
                    <p>Surah {surah.id}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>{surah.ayahsCount} Ayahs</span>
                  </div>
                  <div className="text-slate-500 text-xs">
                    {surah.revelationPlace}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 hover:border-amber-400 hover:text-amber-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/quran/${surah.id}`);
                    }}
                  >
                    Read
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 hover:border-emerald-400 hover:text-emerald-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Audio playback will be implemented in Phase 6
                    }}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No Surahs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
