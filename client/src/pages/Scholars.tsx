import { useState } from 'react';
import { useLocation } from 'wouter';
import { Users, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Scholar {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  bioAr: string;
  bioEn: string;
  thumbnailUrl: string;
  websiteUrl?: string;
  youtubeUrl?: string;
}

const SCHOLARS: Scholar[] = [
  {
    id: '1',
    nameAr: 'عبد الحميد كشك',
    nameEn: 'Abd al-Hamid Kishk',
    slug: 'abd-hamid-kishk',
    bioAr: 'عالم إسلامي مصري معروف بخطبه القوية وتفسيره للقرآن الكريم',
    bioEn: 'A renowned Egyptian Islamic scholar known for his powerful sermons and Quranic interpretation',
    thumbnailUrl: '/scholars/kishk.jpg',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: '2',
    nameAr: 'محمد الغزالي',
    nameEn: 'Muhammad al-Ghazali',
    slug: 'muhammad-ghazali',
    bioAr: 'عالم إسلامي مصري متخصص في الفقه والعقيدة والدعوة الإسلامية',
    bioEn: 'An Egyptian Islamic scholar specializing in jurisprudence, creed, and Islamic preaching',
    thumbnailUrl: '/scholars/ghazali.jpg',
    websiteUrl: 'https://example.com',
  },
  {
    id: '3',
    nameAr: 'يوسف القرضاوي',
    nameEn: 'Yusuf al-Qaradawi',
    slug: 'yusuf-qaradawi',
    bioAr: 'عالم إسلامي قطري معروف بآرائه الفقهية المعاصرة والمتوازنة',
    bioEn: 'A Qatari Islamic scholar renowned for his contemporary and balanced jurisprudential views',
    thumbnailUrl: '/scholars/qaradawi.jpg',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: '4',
    nameAr: 'محمود شلتوت',
    nameEn: 'Mahmoud Shaltout',
    slug: 'mahmoud-shaltout',
    bioAr: 'عالم إسلامي مصري وشيخ الأزهر السابق',
    bioEn: 'An Egyptian Islamic scholar and former Grand Imam of Al-Azhar',
    thumbnailUrl: '/scholars/shaltout.jpg',
  },
  {
    id: '5',
    nameAr: 'محمد متولي الشعراوي',
    nameEn: 'Muhammad Metwalli al-Shaarawi',
    slug: 'muhammad-shaarawi',
    bioAr: 'عالم إسلامي مصري مشهور بتفسيره الشامل للقرآن الكريم',
    bioEn: 'A famous Egyptian Islamic scholar renowned for his comprehensive Quranic interpretation',
    thumbnailUrl: '/scholars/shaarawi.jpg',
    youtubeUrl: 'https://youtube.com',
  },
];

export default function ScholarsPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScholars = SCHOLARS.filter(
    (scholar) =>
      scholar.nameAr.includes(searchTerm) ||
      scholar.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.bioAr.includes(searchTerm) ||
      scholar.bioEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-700/50 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              العلماء الأفاضل
            </h1>
          </div>
          <p className="text-slate-300 text-lg">Learn from Renowned Islamic Scholars - Wisdom and Knowledge</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search scholars... ابحث عن العلماء"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Scholars Grid */}
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredScholars.map((scholar) => (
            <div
              key={scholar.id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-amber-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

              {/* Placeholder Avatar */}
              <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-b border-slate-700/50">
                <Users className="w-16 h-16 text-slate-600" />
              </div>

              <div className="relative p-6">
                <h3 className="text-xl font-bold text-white mb-1">{scholar.nameAr}</h3>
                <p className="text-emerald-400 font-semibold mb-3">{scholar.nameEn}</p>

                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{scholar.bioEn}</p>

                <div className="flex gap-2 mb-4">
                  {scholar.youtubeUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 hover:border-emerald-400 hover:text-emerald-400"
                      onClick={() => window.open(scholar.youtubeUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      YouTube
                    </Button>
                  )}
                  {scholar.websiteUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 hover:border-amber-400 hover:text-amber-400"
                      onClick={() => window.open(scholar.websiteUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Website
                    </Button>
                  )}
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => navigate(`/scholars/${scholar.slug}`)}
                >
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredScholars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No scholars found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
