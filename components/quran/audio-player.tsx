"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { reciters, type Reciter } from "@/lib/data/content";
import { Button } from "@/components/ui/button";

// Audio URL generation function (client-safe)
function getAudioUrl(surahId: number, reciter: Reciter) {
  const surahNumber = String(surahId).padStart(3, "0");

  // Primary: use reciter's baseUrlTemplate (mp3quran.net verified working)
  const primary = `${reciter.baseUrlTemplate}/${surahNumber}.mp3`;

  // Fallback: quranicaudio.com
  const quranicAudioMap: Record<string, string> = {
    alafasy: "mishaari_raashid_al_3afaasee",
    minshawi: "muhammad_siddeeq_al-minshaawee",
    abdulbasit: "abdulbasit_murattal_new",
    sudais: "abdurrahmaan_as-sudays",
    shuraim: "saood_ash-shuraym",
    mahermuaiqly: "maher_al_muaiqly",
    ghamdi: "sa3d_al-ghaamidi",
  };
  const quranicPath = quranicAudioMap[reciter.id];
  const fallback = quranicPath
    ? [`https://download.quranicaudio.com/quran/${quranicPath}/${surahNumber}.mp3`]
    : [];

  return { primary, fallback };
}

export function QuranAudioPlayer({ surahId }: { surahId: number }) {
  const [isClient, setIsClient] = useState(false);
  const [reciter, setReciter] = useState(reciters[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hydration guard - ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [audioSourceIndex, setAudioSourceIndex] = useState(0);
  const audioSources = useMemo(() => {
    if (!isClient) return [];
    if (!reciter.code) return [];

    const { primary, fallback } = getAudioUrl(surahId, reciter);
    return [primary, ...fallback];
  }, [reciter, surahId, isClient]);

  const src = audioSources[audioSourceIndex] || audioSources[0];

  useEffect(() => {
    if (!isClient) return;
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
      console.debug(
        `[audio] Successfully loaded from source ${audioSourceIndex + 1}`
      );
    };

    const handleError = (event: Event) => {
      const audioError = (event.target as HTMLAudioElement).error;
      const errorMsg = audioError?.message || "Unknown error";

      if (audioSourceIndex < audioSources.length - 1) {
        console.warn(
          `[audio] Failed to load from source ${audioSourceIndex + 1}/${audioSources.length}: ${errorMsg}. Trying next...`
        );
        setAudioSourceIndex(prev => prev + 1);
      } else {
        setIsLoading(false);
        setError(
          "تعذر تحميل المقطع الصوتي من جميع المصادر المتاحة. تأكد من اتصالك بالإنترنت وحاول مرة أخرى."
        );
        console.error("[audio] All audio sources failed:", {
          surahId,
          reciter: reciter.id,
          sources: audioSources,
        });
      }
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

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError as EventListener);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError as EventListener);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src, isClient]);

  const togglePlay = () => {
    if (!isClient) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.debug("[audio] Playback started successfully");
          })
          .catch((err: unknown) => {
            console.error("[audio] Playback failed:", err);
            const errorName =
              err instanceof DOMException || err instanceof Error
                ? err.name
                : "UnknownError";
            if (errorName === "NotAllowedError") {
              setError("يتطلب تفاعل المستخدم. انقر على الزر مرة أخرى.");
            } else if (errorName === "NotSupportedError") {
              setError("صيغة الصوت غير مدعومة على هذا الجهاز.");
            } else {
              setError("تعذر تشغيل الصوت. حاول مرة أخرى.");
            }
            setIsPlaying(false);
          });
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClient) return;
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newReciter =
      reciters.find(r => r.id === e.target.value) ?? reciters[0];
    if (!isClient) return;

    console.debug("[audio] Changing reciter to:", newReciter.id);
    setReciter(newReciter);
    setAudioSourceIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setError(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-brand-gold/30 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-brand-cream">القارئ</label>
        <select
          className="flex-1 rounded-lg border border-brand-gold/20 bg-black/30 p-2 text-brand-cream focus:border-brand-gold focus:outline-none"
          value={reciter.id}
          onChange={handleReciterChange}
        >
          {reciters.map(r => (
            <option key={r.id} value={r.id} className="bg-brand-emeraldDeep">
              {r.nameAr}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlay}
            disabled={isLoading}
            variant="primary"
            className="w-24"
          >
            {isLoading ? "جاري التحميل..." : isPlaying ? "إيقاف" : "تشغيل"}
          </Button>

          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-full appearance-none bg-brand-gold/20 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-brand-gold
                [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-between text-sm arabic-muted">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        src={src}
        className="hidden"
        controlsList="nodownload"
      />

      <p className="text-xs text-center arabic-muted">
        استمع للسورة كاملة بصوت القارئ {reciter.nameAr}
      </p>
    </div>
  );
}
