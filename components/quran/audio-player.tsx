'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { reciters } from '@/lib/data/content';
import { Button } from '@/components/ui/button';

export function QuranAudioPlayer({ surahId }: { surahId: number }) {
  const [reciter, setReciter] = useState(reciters[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const src = useMemo(
    () => `${reciter.baseUrlTemplate}/${surahId}.mp3`,
    [reciter, surahId]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset state when source changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setError('تعذر تحميل المقطع الصوتي. جرب قارئ آخر.');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Playback failed:", err);
        setError('تعذر تشغيل الصوت. قد يكون هناك قيود من المتصفح.');
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newReciter = reciters.find(r => r.id === e.target.value) ?? reciters[0];
    setReciter(newReciter);
    setIsPlaying(false);
    setCurrentTime(0);
    setError(null);
  };

  return (
    <div className='space-y-4 rounded-xl border border-brand-gold/30 bg-black/20 p-4'>
      <div className='flex items-center justify-between gap-4'>
        <label className='text-sm font-medium text-brand-cream'>القارئ</label>
        <select
          className='flex-1 rounded-lg border border-brand-gold/20 bg-black/30 p-2 text-brand-cream focus:border-brand-gold focus:outline-none'
          value={reciter.id}
          onChange={handleReciterChange}
        >
          {reciters.map(r => (
            <option key={r.id} value={r.id} className='bg-brand-emeraldDeep'>
              {r.nameAr}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className='rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center'>
          <p className='text-sm text-red-300'>{error}</p>
        </div>
      )}

      <div className='space-y-3'>
        <div className='flex items-center gap-4'>
          <Button
            onClick={togglePlay}
            disabled={isLoading}
            variant='primary'
            className='w-24'
          >
            {isLoading ? 'جاري التحميل...' : isPlaying ? 'إيقاف' : 'تشغيل'}
          </Button>
          
          <div className='flex-1'>
            <input
              type='range'
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className='w-full h-2 rounded-full appearance-none bg-brand-gold/20 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-brand-gold
                [&::-webkit-slider-thumb]:cursor-pointer'
            />
          </div>
        </div>

        <div className='flex justify-between text-sm arabic-muted'>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio ref={audioRef} preload='metadata' src={src} className='hidden' />

      <p className='text-xs text-center arabic-muted'>
        استمع للسورة كاملة بصوت القارئ {reciter.nameAr}
      </p>
    </div>
  );
}
