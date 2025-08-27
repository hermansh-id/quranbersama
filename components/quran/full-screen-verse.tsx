'use client';

import { useState, useEffect, useRef, RefObject } from "react"; // Tambahkan hook baru
import { ChevronLeft, ChevronRight, Play, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Ayah, PlaybackState, Theme } from "@/types/quran";
import clsx from "clsx";
import { amiriQuran } from '@/components/font';

interface FullScreenVerseProps {
  verse: Ayah;
  playbackState: PlaybackState;
  isBuffering: boolean;
  currentIndex: number;
  totalVerses: number;
  theme: Theme;
  isFirstVerse: boolean;
  isLastVerse: boolean;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  onPause: () => void;
  onStop: () => void;
  audioRef: RefObject<HTMLAudioElement | null>; // BARU: Terima ref audio
}

const toArabicIndic = (num: number) => {
  return num.toString().replace(/\d/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
};

export function FullScreenVerse({
  verse,
  playbackState,
  isBuffering,
  currentIndex,
  totalVerses,
  theme,
  isFirstVerse,
  isLastVerse,
  onPrevVerse,
  onNextVerse,
  onPause,
  onStop,
  audioRef // BARU
}: FullScreenVerseProps) {
  const isDark = theme === "dark";
  // BARU: State untuk menyimpan progres highlight (0-100)
  const [highlightProgress, setHighlightProgress] = useState(0);

  // BARU: Efek untuk memantau waktu audio dan memperbarui progres
  useEffect(() => {
    // Reset progres saat ayat berganti
    setHighlightProgress(0);

    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setHighlightProgress(progress);
      }
    };

    // Mulai memantau saat audio bisa diputar
    audio.addEventListener("canplay", handleTimeUpdate);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    // Cleanup listener saat komponen unmount atau audio berubah
    return () => {
      audio.removeEventListener("canplay", handleTimeUpdate);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [verse, audioRef]); // Jalankan efek ini saat ayat atau audioRef berubah

  return (
    <div
      className={clsx(
        "min-h-screen flex flex-col relative transition-colors duration-300",
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      )}
    >
      <div className="absolute top-6 right-6 z-20">
        <Button variant="ghost" size="icon" onClick={onStop} className="rounded-full w-12 h-12 bg-gray-500/10 hover:bg-gray-500/20">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
          
          {/* BARU: Wrapper untuk efek highlight */}
          <div className="relative" dir="rtl">
            {/* Lapisan 1: Teks dasar (abu-abu) */}
            <div
              className={clsx(
                amiriQuran.className,
                "text-5xl md:text-7xl lg:text-8xl font-bold leading-relaxed text-right",
                isDark ? "text-gray-600" : "text-gray-300" // Warna dasar yang redup
              )}
            >
              {verse.text}
              <span className="text-4xl md:text-6xl mx-2">۝</span>
              <span className="text-4xl md:text-6xl">{toArabicIndic(verse.ayah_number)}</span>
            </div>

            {/* Lapisan 2: Teks highlight (di atas lapisan 1) */}
            <div
              className="absolute top-0 right-0 h-full overflow-hidden transition-width duration-100 ease-linear"
              style={{ width: `${highlightProgress}%` }} // Lebar diatur oleh progres audio
            >
              <div
                className={clsx(
                  amiriQuran.className,
                  "text-5xl md:text-7xl lg:text-8xl font-bold leading-relaxed text-right whitespace-nowrap",
                  isDark ? "text-white" : "text-gray-900" // Warna highlight yang cerah
                )}
              >
                {verse.text}
                <span className="text-teal-500 text-4xl md:text-6xl mx-2">۝</span>
                <span className="text-teal-500 text-4xl md:text-6xl">{toArabicIndic(verse.ayah_number)}</span>
              </div>
            </div>
          </div>
          
          <div
            className={clsx(
              "text-base md:text-xl leading-relaxed max-w-3xl",
              isDark ? "text-gray-300" : "text-gray-600"
            )}
          >
            {verse.translations?.[0]?.text}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-full px-4">
        <div className="flex flex-col items-center animate-in slide-in-from-bottom-5 duration-500">
          <div className={clsx("text-sm mb-4", isDark ? "text-gray-400" : "text-gray-500")}>
            {currentIndex + 1} / {totalVerses}
          </div>
          <div
            className={clsx(
              "flex items-center justify-center gap-6 px-6 py-3 rounded-full shadow-lg backdrop-blur-md border",
              isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
            )}
          >
            <Button variant="ghost" size="icon" onClick={onPrevVerse} disabled={isFirstVerse} className="rounded-full w-12 h-12 disabled:opacity-30">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button variant="default" size="icon" onClick={onPause} className="rounded-full w-16 h-16 bg-teal-500 hover:bg-teal-600 text-white shadow-lg">
              {playbackState === "playing" ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onNextVerse} disabled={isLastVerse} className="rounded-full w-12 h-12 disabled:opacity-30">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {isBuffering && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30 transition-opacity duration-300 animate-in fade-in">
          <div className="w-12 h-12 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}