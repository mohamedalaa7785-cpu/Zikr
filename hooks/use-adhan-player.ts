'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

export type AdhanVoice = 'makkah' | 'madinah';

interface UseAdhanPlayerReturn {
  isPlaying: boolean;
  currentVoice: AdhanVoice;
  volume: number;
  play: (voice?: AdhanVoice) => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  setVoice: (voice: AdhanVoice) => void;
  duration: number;
  currentTime: number;
}

export function useAdhanPlayer(): UseAdhanPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoice, setCurrentVoiceState] = useState<AdhanVoice>('makkah');
  const [volume, setVolumeState] = useState(70);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;
    }

    const audio = audioRef.current;

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

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const play = useCallback(async (voice: AdhanVoice = currentVoice) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const audioPath = `/audio/adhan/${voice}.mp3`;

    try {
      // If different voice, load new audio
      if (audio.src !== audioPath) {
        audio.src = audioPath;
        audio.load();
      }

      // Play the audio
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('[useAdhanPlayer] Failed to play audio:', error);
      setIsPlaying(false);
    }
  }, [currentVoice]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume / 100;
    }
  }, []);

  const setVoice = useCallback((voice: AdhanVoice) => {
    setCurrentVoiceState(voice);
    // If currently playing, switch to new voice
    if (isPlaying && audioRef.current) {
      const wasPlaying = true;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = `/audio/adhan/${voice}.mp3`;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('[useAdhanPlayer] Failed to play new voice:', error);
        });
      }
    }
  }, [isPlaying]);

  return {
    isPlaying,
    currentVoice,
    volume,
    play,
    pause,
    stop,
    setVolume,
    setVoice,
    duration,
    currentTime,
  };
}
