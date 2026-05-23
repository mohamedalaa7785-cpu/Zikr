import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { BookMarked, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HadithBook {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  authorAr: string;
  authorEn: string;
  hadithCount: number;
}

const HADITH_BOOKS: HadithBook[] = [
  {
    id: '1',
    nameAr: 'صحيح البخاري',
    nameEn: 'Sahih al-Bukhari',
    slug: 'sahih-bukhari',
    authorAr: 'محمد بن إسماعيل البخاري',
    authorEn: 'Muhammad ibn Ismail al-Bukhari',
    hadithCount: 7563,
  },
  {
    id: '2',
    nameAr: 'صحيح مسلم',
    nameEn: 'Sahih Muslim',
    slug: 'sahih-muslim',
    authorAr: 'مسلم بن الحجاج',
    authorEn: 'Muslim ibn al-Hajjaj',
    hadithCount: 7275,
  },
  {
    id: '3',
    nameAr: 'سنن الترمذي',
    nameEn: 'Jami at-Tirmidhi',
    slug: 'jami-tirmidhi',
    authorAr: 'محمد بن عيسى الترمذي',
    authorEn: 'Muhammad ibn Isa at-Tirmidhi',
    hadithCount: 3956,
  },
  {
    id: '4',
    nameAr: 'سنن أبي داود',
    nameEn: 'Sunan Abu Dawud',
    slug: 'sunan-abu-dawud',
    authorAr: 'سليمان بن الأشعث السجستاني',
    authorEn: 'Sulaiman ibn al-Ash\'ath as-Sijistani',
    hadithCount: 5274,
  },
  {
    id: '5',
    nameAr: 'سنن النسائي',
    nameEn: 'Sunan an-Nasai',
    slug: 'sunan-nasai',
    authorAr: 'أحمد بن شعيب النسائي',
    authorEn: 'Ahmad ibn Shuayb an-Nasai',
    hadithCount: 5761,
  },
  {
    id: '6',
    nameAr: 'سنن ابن ماجه',
    nameEn: 'Sunan Ibn Majah',
    slug: 'sunan-ibn-majah',
    authorAr: 'محمد بن يزيد ابن ماجه',
    authorEn: 'Muhammad ibn Yazid Ibn Majah',
    hadithCount: 4341,
  },
];

export default function HadithPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<HadithBook[]>(HADITH_BOOKS);

  useEffect(() => {
    const filtered = HADITH_BOOKS.filter(
      (book) =>
        book.nameAr.includes(searchTerm) ||
        book.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorAr.includes(searchTerm) ||
        book.authorEn.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-700/50 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookMarked className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              الأحاديث الشريفة
            </h1>
          </div>
          <p className="text-slate-300 text-lg">Authentic Hadith Collections - Learn from Prophetic Traditions</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search Hadith Books... ابحث عن الأحاديث"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <button
              key={book.id}
              onClick={() => navigate(`/hadith/${book.slug}`)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-400/20 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-amber-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
              
              <div className="relative">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{book.nameAr}</h3>
                  <p className="text-emerald-400 font-semibold">{book.nameEn}</p>
                </div>

                <div className="mb-4 pb-4 border-b border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{book.authorAr}</p>
                  <p className="text-slate-500 text-xs">{book.authorEn}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-slate-400 text-sm">
                    <p className="font-semibold">{book.hadithCount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Hadiths</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/hadith/${book.slug}`);
                    }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No Hadith books found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
