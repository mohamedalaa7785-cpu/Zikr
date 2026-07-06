'use client';

import { useState, useRef } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { tawasheeh } from '@/lib/data/content';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function TawasheehPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const filtered = tawasheeh.filter(
    (t) =>
      t.titleAr.includes(searchQuery) ||
      t.artistAr.includes(searchQuery) ||
      t.titleEn.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const featured = tawasheeh.filter((t) => t.featured);
  const currentTrack = tawasheeh.find((t) => t.id === currentId) ?? null;

  const handlePlay = (id: string) => {
    if (currentId === id) {
      audioRef.current?.pause();
      setCurrentId(null);
    } else {
      setCurrentId(id);
    }
  };

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">التواشيح الدينية</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          استمع لأجمل التواشيح والأناشيد الدينية الإسلامية
        </p>
      </section>

      {/* Now playing bar */}
      {currentTrack && (
        <Card className="border-brand-gold/40 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm arabic-muted">يُشغّل الآن</p>
              <p className="font-bold text-brand-gold">{currentTrack.titleAr}</p>
              <p className="text-xs text-brand-cream/60">{currentTrack.artistAr}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setCurrentId(null)}
              aria-label="إيقاف التشغيل"
            >
              إيقاف
            </Button>
          </div>
          <audio
            ref={audioRef}
            key={currentTrack.audioUrl}
            controls
            autoPlay
            className="w-full"
            aria-label={`تشغيل ${currentTrack.titleAr}`}
            onError={() => setCurrentId(null)}
          >
            <source src={currentTrack.audioUrl} type="audio/mpeg" />
            المتصفح لا يدعم تشغيل الصوت.
          </audio>
        </Card>
      )}

      {/* Featured */}
      {featured.length > 0 && !searchQuery && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-gold">المميزة</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((track) => (
              <Card
                key={track.id}
                className={`space-y-3 transition-all hover:border-brand-gold/50 ${
                  currentId === track.id ? 'border-brand-gold/60 bg-brand-gold/5' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-gold truncate">{track.titleAr}</h3>
                    <p className="text-sm text-brand-cream/60 truncate">{track.artistAr}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0 mr-2">
                    {formatDuration(track.duration)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs arabic-muted">
                  <span>{track.views.toLocaleString('ar-EG')} مشاهدة</span>
                </div>
                <Button
                  variant={currentId === track.id ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => handlePlay(track.id)}
                >
                  {currentId === track.id ? 'جاري التشغيل...' : 'استمع'}
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Search */}
      <section className="flex gap-2">
        <Input
          type="text"
          placeholder="ابحث عن تشيح أو منشد..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          dir="rtl"
        />
      </section>

      {/* All / filtered results */}
      <section className="space-y-4">
        {searchQuery && (
          <p className="text-sm arabic-muted">
            {filtered.length} نتيجة للبحث عن &quot;{searchQuery}&quot;
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((track) => (
            <Card
              key={track.id}
              className={`flex items-center gap-4 transition-all hover:border-brand-gold/50 ${
                currentId === track.id ? 'border-brand-gold/60 bg-brand-gold/5' : ''
              }`}
            >
              <button
                onClick={() => handlePlay(track.id)}
                className="w-10 h-10 shrink-0 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold/10 transition-colors"
                aria-label={currentId === track.id ? 'إيقاف' : `تشغيل ${track.titleAr}`}
              >
                {currentId === track.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-cream truncate">{track.titleAr}</p>
                <p className="text-xs text-brand-cream/50 truncate">{track.artistAr} · {formatDuration(track.duration)}</p>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-8 arabic-muted">
              لم يتم العثور على نتائج للبحث.
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
