'use client';
import { useMemo, useRef, useState } from 'react';
import { reciters } from '@/lib/data/content';

export function QuranAudioPlayer({ surahId }: { surahId: number }) {
  const [reciter, setReciter] = useState(reciters[0]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const src = useMemo(() => `${reciter.baseUrlTemplate}/${String(surahId).padStart(3, '0')}.mp3`, [reciter, surahId]);
  return <div className='space-y-2 rounded-xl border border-brand-gold/30 p-3'><label className='text-sm'>القارئ</label><select className='w-full rounded-lg bg-black/20 p-2' value={reciter.id} onChange={(e)=>setReciter(reciters.find(r=>r.id===e.target.value) ?? reciters[0])}>{reciters.map(r=><option key={r.id} value={r.id}>{r.nameAr}</option>)}</select><audio ref={audioRef} controls preload='none' className='w-full' src={src} /></div>;
}
