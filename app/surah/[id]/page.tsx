'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from "@/components/quran/header";
import { SettingsDialog} from "@/components/quran/settings-dialog";
import type { Qori } from "@/types/qori";
import { SurahNavigation } from "@/components/quran/surah-navigation";
import { SurahHeader } from "@/components/quran/surah-header";
import { VerseCard } from "@/components/quran/verse-card";
import { FullScreenVerse } from "@/components/quran/full-screen-verse";
import { useSurahs, useSurah } from "@/hooks/use-surahs";
import type { Ayah, PlaybackState, Theme } from "@/types/quran";
import { useParams, useRouter } from "next/navigation";

// --- Skeleton Components (Tidak ada perubahan) ---
const SkeletonSurahNavigation = () => ( <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"> <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div> <div className="text-center"> <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2 mx-auto"></div> <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div> </div> <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div> </div> );
const SkeletonSurahHeader = () => ( <div className="text-center mb-8 animate-pulse"> <div className="w-48 h-8 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div> <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-4"></div> <div className="w-24 h-10 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div> </div> );
const SkeletonVerseCard = () => ( <div className="p-6 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 animate-pulse"> <div className="flex items-center justify-between mb-4"> <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div> <div className="flex space-x-2"> <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div> <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div> <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div> </div> </div> <div className="space-y-4"> <div className="space-y-2"><div className="w-full h-6 bg-gray-300 dark:bg-gray-600 rounded"></div><div className="w-4/5 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div><div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div></div> <div className="space-y-2"><div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div><div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div></div> </div> </div> );
// --- End Skeleton Components ---

export default function QuranApp() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // --- State Management ---
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
  const [fullScreenVerse, setFullScreenVerse] = useState<Ayah | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("stopped");
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState("indonesian");
  const [qori, setQori] = useState("AbdulSamad_64kbps_QuranExplorer.Com");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qoris, setQoris] = useState<Qori[]>([]);
  const [isQorisLoading, setIsQorisLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  // --- Refs untuk Audio ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- Data Fetching ---
  const { data: surahs, isLoading: isSurahsLoading } = useSurahs();
  const { data: currentSurah, isLoading: isSurahLoading } = useSurah(id!);
  const allVerses = currentSurah?.ayahs || [];

  // --- Effects ---
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (id) setCurrentSurahIndex(parseInt(id, 10));
  }, [theme, id]);

  useEffect(() => {
    const fetchQoris = async () => {
      setIsQorisLoading(true);
      try {
        const response = await fetch('/data/qori.json');
        const data: Qori[] = await response.json();
        setQoris(data);
      } catch (error) {
        console.error("Gagal memuat daftar Qori:", error);
      } finally {
        setIsQorisLoading(false);
      }
    };
    fetchQoris();
  }, []);

  // --- Audio Logic ---
  const formatNumber = (num: number, length: number) => num.toString().padStart(length, '0');

  const getAudioUrl = useCallback((surahNumber: number, verseNumber: number) => {
    if (!qori) return null;
    const formattedSurah = formatNumber(surahNumber, 3);
    const formattedVerse = formatNumber(verseNumber, 3);
    return `https://everyayah.com/data/${qori}/${formattedSurah}${formattedVerse}.mp3`;
  }, [qori]);

  const handleStop = () => {
    setPlaybackState("stopped");
    setFullScreenVerse(null);
  };
  
  // *** INI PERBAIKANNYA ***
  const handleNextVerseOnEnd = useCallback(() => {
    setIsBuffering(false);
    // Menggunakan functional update untuk memastikan kita selalu dapat state `fullScreenVerse` yang terbaru
    setFullScreenVerse(currentVerse => {
      if (!currentVerse) {
        handleStop();
        return null;
      }
      const currentIndex = allVerses.findIndex((v) => v.id === currentVerse.id);
      if (currentIndex > -1 && currentIndex < allVerses.length - 1) {
        return allVerses[currentIndex + 1]; // Lanjut ke ayat berikutnya
      } else {
        handleStop(); // Surah selesai
        return null; 
      }
    });
  }, [allVerses]); // Sekarang hanya bergantung pada `allVerses`

  // EFEK UTAMA: Mengontrol pemutaran audio
  useEffect(() => {
    // Cleanup audio sebelumnya
    if (audioRef.current) {
      audioRef.current.pause();
      // Penting: Hapus listener lama sebelum menambahkan yang baru
      // Ini mencegah listener dari render sebelumnya tetap aktif
      const oldAudio = audioRef.current;
      const oldCallback = (oldAudio as any)._handleNextVerseOnEnd; // Ambil callback yang tersimpan
      if (oldCallback) {
        oldAudio.removeEventListener('ended', oldCallback);
      }
    }

    if (fullScreenVerse && playbackState === "playing" && currentSurah) {
      setIsBuffering(true);
      const expectedUrl = getAudioUrl(currentSurah.id, fullScreenVerse.ayah_number);

      if (preloadAudioRef.current && preloadAudioRef.current.src === expectedUrl) {
        audioRef.current = preloadAudioRef.current;
        preloadAudioRef.current = null;
      } else {
        if (expectedUrl) audioRef.current = new Audio(expectedUrl);
      }

      if (audioRef.current) {
        const audio = audioRef.current;
        const onCanPlay = () => setIsBuffering(false);
        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => setIsBuffering(false);

        // Simpan callback di elemen audio untuk dihapus dengan benar saat cleanup
        (audio as any)._handleNextVerseOnEnd = handleNextVerseOnEnd;
        audio.addEventListener('ended', handleNextVerseOnEnd);

        audio.addEventListener('canplaythrough', onCanPlay);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('playing', onPlaying);

        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsBuffering(false);
          setPlaybackState("paused");
        });

        return () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('waiting', onWaiting);
          audio.removeEventListener('playing', onPlaying);
        };
      }
    }
  }, [playbackState, fullScreenVerse, currentSurah, getAudioUrl, handleNextVerseOnEnd]);

  // EFEK PRELOADING: Menyiapkan audio berikutnya
  useEffect(() => {
    if (preloadAudioRef.current) {
      preloadAudioRef.current.src = '';
      preloadAudioRef.current = null;
    }

    if (fullScreenVerse && currentSurah) {
      const currentIndex = allVerses.findIndex((v) => v.id === fullScreenVerse.id);
      if (currentIndex > -1 && currentIndex < allVerses.length - 1) {
        const nextVerse = allVerses[currentIndex + 1];
        const nextAudioUrl = getAudioUrl(currentSurah.id, nextVerse.ayah_number);
        if (nextAudioUrl) {
          preloadAudioRef.current = new Audio(nextAudioUrl);
        }
      }
    }
  }, [fullScreenVerse, allVerses, currentSurah, getAudioUrl]);

  // --- Handlers ---
  const handlePlayVerse = (verse: Ayah) => {
    setFullScreenVerse(verse);
    setPlaybackState("playing");
  };

  const handlePlaySurah = () => {
    if (allVerses.length > 0) handlePlayVerse(allVerses[0]);
  };

  const handlePause = () => {
    if (playbackState === "playing") {
      audioRef.current?.pause();
      setPlaybackState("paused");
    } else if (playbackState === "paused") {
      audioRef.current?.play();
      setPlaybackState("playing");
    }
  };

  const handlePrevVerse = () => {
    const currentIndex = allVerses.findIndex((v) => v.id === fullScreenVerse?.id);
    if (currentIndex > 0) setFullScreenVerse(allVerses[currentIndex - 1]);
  };

  const handleNextVerse = () => {
    const currentIndex = allVerses.findIndex((v) => v.id === fullScreenVerse?.id);
    if (currentIndex < allVerses.length - 1) setFullScreenVerse(allVerses[currentIndex + 1]);
  };

  const handleCopyVerse = (verse: Ayah) => {
    const translationText = verse.translations?.[0]?.text || '';
    const text = `${verse.text}\n\n${translationText}`;
    navigator.clipboard.writeText(text).catch(err => console.error("Gagal menyalin ayat:", err));
  };
  
  const handleBookmarkVerse = (verse: Ayah) => console.log("Bookmarked verse:", verse.ayah_number);
  const handleThemeToggle = () => setTheme(theme === "light" ? "dark" : "light");

  const handleNextSurah = () => {
    if (surahs && currentSurahIndex < surahs.length) {
      router.push(`/surah/${currentSurahIndex + 1}`);
      handleStop();
    }
  };

  const handlePrevSurah = () => {
    if (currentSurahIndex > 1) {
      router.push(`/surah/${currentSurahIndex - 1}`);
      handleStop();
    }
  };

  // --- JSX Render ---
  if (fullScreenVerse) {
    const currentIndex = allVerses.findIndex(v => v.id === fullScreenVerse.id);
    return (
      <FullScreenVerse
        verse={fullScreenVerse}
        playbackState={playbackState}
        isBuffering={isBuffering}
        currentIndex={currentIndex}
        totalVerses={allVerses.length}
        theme={theme}
        isFirstVerse={currentIndex === 0}
        isLastVerse={currentIndex === allVerses.length - 1}
        onPrevVerse={handlePrevVerse}
        onNextVerse={handleNextVerse}
        onPause={handlePause}
        onStop={handleStop}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Header theme={theme} onThemeToggle={handleThemeToggle} onSettingsClick={() => setSettingsOpen(true)} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} theme={theme} fontSize={fontSize} language={language} qori={qori} qoris={qoris} isQorisLoading={isQorisLoading} onFontSizeChange={setFontSize} onLanguageChange={setLanguage} onQoriChange={setQori} />
      <main className="max-w-4xl mx-auto p-4">
        {isSurahsLoading || !currentSurah ? <SkeletonSurahNavigation /> : <SurahNavigation currentSurah={currentSurah} currentSurahIndex={currentSurah.id } totalSurahs={surahs?.length || 114} theme={theme} onPrevSurah={handlePrevSurah} onNextSurah={handleNextSurah} />}
        {isSurahLoading || !currentSurah ? <SkeletonSurahHeader /> : <SurahHeader surah={currentSurah} theme={theme} onPlaySurah={handlePlaySurah} />}
        <div className="space-y-8">
          {isSurahLoading ? Array.from({ length: 5 }).map((_, index) => <SkeletonVerseCard key={index} />) : currentSurah?.ayahs ? ( currentSurah.ayahs.map((verse) => ( <VerseCard key={verse.id} verse={verse} currentSurah={currentSurah} theme={theme} fontSize={fontSize} onCopyVerse={handleCopyVerse} onBookmarkVerse={handleBookmarkVerse} onPlayVerse={handlePlayVerse} /> )) ) : ( <div className="text-center py-12"><p className="text-gray-600 dark:text-gray-400">Ayat tidak tersedia.</p></div> )}
        </div>
      </main>
    </div>
  );
}