import { useState } from 'react';
import { Search as SearchIcon, BookOpen, BookMarked, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'quran' | 'hadith' | 'scholar';
  url: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setHasSearched(true);

    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Surah Al-Fatiha',
        description: 'The Opening - The first chapter of the Quran',
        type: 'quran',
        url: '/quran/1',
      },
      {
        id: '2',
        title: 'Sahih al-Bukhari',
        description: 'The most authentic collection of Hadith',
        type: 'hadith',
        url: '/hadith/sahih-bukhari',
      },
      {
        id: '3',
        title: 'Muhammad al-Ghazali',
        description: 'A renowned Islamic scholar',
        type: 'scholar',
        url: '/scholars/muhammad-ghazali',
      },
    ];

    const filtered = mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResults(filtered);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'quran':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'hadith':
        return <BookMarked className="w-5 h-5 text-emerald-400" />;
      case 'scholar':
        return <Users className="w-5 h-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getResultBadge = (type: string) => {
    const badges: { [key: string]: { label: string; color: string } } = {
      quran: { label: 'Quran', color: 'bg-amber-500/20 text-amber-300' },
      hadith: { label: 'Hadith', color: 'bg-emerald-500/20 text-emerald-300' },
      scholar: { label: 'Scholar', color: 'bg-blue-500/20 text-blue-300' },
    };
    const badge = badges[type] || badges.quran;
    return badge;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-700/50 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-emerald-500/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              البحث الشامل
            </h1>
          </div>
          <p className="text-slate-300 text-lg">Search across Quran, Hadith, and Scholars</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search Quran, Hadith, Scholars... ابحث"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 text-lg py-6"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-amber-600 hover:bg-amber-700 px-8"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        {hasSearched ? (
          <>
            {results.length > 0 ? (
              <div>
                <p className="text-slate-400 mb-6">
                  Found <span className="text-amber-400 font-semibold">{results.length}</span> results
                </p>

                <div className="space-y-4">
                  {results.map((result) => {
                    const badge = getResultBadge(result.type);
                    return (
                      <a
                        key={result.id}
                        href={result.url}
                        className="block group relative overflow-hidden rounded-lg bg-slate-800/30 p-6 border border-slate-700/50 hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                        <div className="relative flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getResultIcon(result.type)}
                              <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                                {result.title}
                              </h3>
                            </div>
                            <p className="text-slate-400 text-sm">{result.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No results found for "{searchTerm}"</p>
                <p className="text-slate-500 text-sm mt-2">Try searching with different keywords</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Enter a search term to get started</p>
            <p className="text-slate-500 text-sm mt-2">Search across Quran, Hadith, and Islamic Scholars</p>
          </div>
        )}
      </div>
    </div>
  );
}
