'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from "@/components/quran/header"
import { SettingsDialog } from "@/components/quran/settings-dialog"
import { SurahNavigation } from "@/components/quran/surah-navigation"
import { SurahHeader } from "@/components/quran/surah-header"
import { VerseCard } from "@/components/quran/verse-card"
import { FullScreenVerse } from "@/components/quran/full-screen-verse"
import { useSurahs, useSurah } from "@/hooks/use-surahs"
import type { Ayah, PlaybackState, Theme, SurahDetail } from "@/types/quran"
import { useParams, useRouter } from "next/navigation"

// Skeleton Components
const SkeletonSurahNavigation = () => (
  <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">
    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
    <div className="text-center">
      <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2 mx-auto"></div>
      <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
    </div>
    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
  </div>
)

const SkeletonSurahHeader = () => (
  <div className="text-center mb-8 animate-pulse">
    <div className="w-48 h-8 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
    <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-4"></div>
    <div className="w-24 h-10 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
  </div>
)

const SkeletonVerseCard = () => (
  <div className="p-6 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="flex space-x-2">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="w-full h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-4/5 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
)

export default function QuranApp() {
  const { id } = useParams<{ id: string }>()
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0)
  const [fullScreenVerse, setFullScreenVerse] = useState<Ayah | null>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>("stopped")
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [theme, setTheme] = useState<Theme>("light")
  const [fontSize, setFontSize] = useState(16)
  const [language, setLanguage] = useState("indonesian")
  const [qori, setQori] = useState("mishary")
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Use the custom hooks
  const { data: surahs, isLoading: isSurahsLoading, error: surahsError } = useSurahs()
  const currentSurahId = id
  const { data: currentSurah, isLoading: isSurahLoading, error: surahError } = useSurah(currentSurahId!)
  const router = useRouter()
  // Get all verses directly from the current surah data
  const allVerses = currentSurah?.ayahs || []

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    setCurrentSurahIndex(parseInt(id))
  }, [theme])

  const getVerseDuration = (verse: Ayah) => {
    const baseLength = verse.text.length
    return Math.max(3, Math.min(15, baseLength / 10))
  }

  const getCurrentVerseInAllVerses = useCallback(() => {
    if (!fullScreenVerse) return -1
    return allVerses.findIndex((v) => v.id === fullScreenVerse.id)
  }, [fullScreenVerse, allVerses])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (playbackState === "playing" && fullScreenVerse) {
      const duration = getVerseDuration(fullScreenVerse) * 1000
      const updateInterval = 100

      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (updateInterval / duration) * 100

          if (newProgress >= 100) {
            const currentIndex = getCurrentVerseInAllVerses()
            if (currentIndex < allVerses.length - 1) {
              const nextVerse = allVerses[currentIndex + 1]
              setFullScreenVerse(nextVerse)
              setCurrentVerseIndex(currentIndex + 1)
              return 0
            } else {
              setPlaybackState("stopped")
              setFullScreenVerse(null)
              return 0
            }
          }

          return newProgress
        })
      }, updateInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [playbackState, fullScreenVerse, getCurrentVerseInAllVerses, allVerses])

  const handlePlayVerse = (verse: Ayah) => {
    console.log("[QuranApp] Playing verse:", verse.ayah_number)
    setFullScreenVerse(verse)
    const verseIndex = allVerses.findIndex((v) => v.id === verse.id)
    setCurrentVerseIndex(verseIndex)
    setPlaybackState("playing")
    setProgress(0)
  }

  const handlePlaySurah = () => {
    if (currentSurah?.ayahs && currentSurah.ayahs.length > 0) {
      handlePlayVerse(currentSurah.ayahs[0])
    }
  }

  const handlePause = () => {
    setPlaybackState(playbackState === "playing" ? "paused" : "playing")
  }

  const handleStop = () => {
    setPlaybackState("stopped")
    setProgress(0)
    setFullScreenVerse(null)
  }

  const handlePrevVerse = () => {
    const currentIndex = getCurrentVerseInAllVerses()
    if (currentIndex > 0) {
      const prevVerse = allVerses[currentIndex - 1]
      setFullScreenVerse(prevVerse)
      setCurrentVerseIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  const handleNextVerse = () => {
    const currentIndex = getCurrentVerseInAllVerses()
    if (currentIndex < allVerses.length - 1) {
      const nextVerse = allVerses[currentIndex + 1]
      setFullScreenVerse(nextVerse)
      setCurrentVerseIndex(currentIndex + 1)
      setProgress(0)
    }
  }

  const handleCopyVerse = (verse: Ayah) => {
    // Use the first translation if available, otherwise just the Arabic text
    const translationText = verse.translations?.[0]?.text || ''
    const text = translationText ? `${verse.text}\n\n${translationText}` : verse.text
    
    navigator.clipboard.writeText(text).then(() => {
      console.log("[QuranApp] Copied verse:", verse.ayah_number, text)
    }).catch(err => {
      console.error("[QuranApp] Failed to copy verse:", err)
    })
  }

  const handleBookmarkVerse = (verse: Ayah) => {
    console.log("[QuranApp] Bookmarked verse:", verse.ayah_number, verse.text)
    // Here you would implement actual bookmarking logic
    // For example, save to localStorage or send to API
  }

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleNextSurah = () => {
    console.log(currentSurahIndex)
    if (surahs && currentSurahIndex < surahs.length - 1) {
      router.push(`/surah/${currentSurahIndex + 1}`)
      setFullScreenVerse(null)
      setPlaybackState("stopped")
      setProgress(0)
    }
  }

  const handlePrevSurah = () => {
    if (currentSurahIndex > 0) {
      router.push(`/surah/${currentSurahIndex - 1}`)
      setFullScreenVerse(null)
      setPlaybackState("stopped")
      setProgress(0)
    }
  }

  // Error handling
  if (surahsError) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <Header
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onSettingsClick={() => setSettingsOpen(true)}
        />
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load Quran data</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please check your connection and try again.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (surahError) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <Header
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onSettingsClick={() => setSettingsOpen(true)}
        />
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load Surah data</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try selecting a different surah or check your connection.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (fullScreenVerse) {
    const currentIndex = getCurrentVerseInAllVerses()
    const isFirstVerse = currentIndex === 0
    const isLastVerse = currentIndex === allVerses.length - 1

    return (
      <FullScreenVerse
        verse={fullScreenVerse}
        playbackState={playbackState}
        progress={progress}
        currentIndex={currentIndex}
        totalVerses={allVerses.length}
        theme={theme}
        isFirstVerse={isFirstVerse}
        isLastVerse={isLastVerse}
        onPrevVerse={handlePrevVerse}
        onNextVerse={handleNextVerse}
        onPause={handlePause}
        onStop={handleStop}
      />
    )
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Header
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        theme={theme}
        fontSize={fontSize}
        language={language}
        qori={qori}
        onFontSizeChange={setFontSize}
        onLanguageChange={setLanguage}
        onQoriChange={setQori}
      />

      <div className="max-w-4xl mx-auto p-4">
        {isSurahsLoading ? (
          <SkeletonSurahNavigation />
        ) : surahs && currentSurah ? (
          <SurahNavigation
            currentSurah={currentSurah}
            currentSurahIndex={currentSurahIndex}
            totalSurahs={surahs.length}
            theme={theme}
            onPrevSurah={handlePrevSurah}
            onNextSurah={handleNextSurah}
          />
        ) : null}

        {isSurahLoading ? (
          <SkeletonSurahHeader />
        ) : currentSurah ? (
          <SurahHeader
            surah={currentSurah}
            theme={theme}
            onPlaySurah={handlePlaySurah}
          />
        ) : null}

        <div className="space-y-8">
          {isSurahLoading ? (
            // Show skeleton verses while loading
            Array.from({ length: 5 }).map((_, index) => (
              <SkeletonVerseCard key={index} />
            ))
          ) : currentSurah?.ayahs ? (
            currentSurah.ayahs.map((verse) => (
              <VerseCard
                key={verse.id}
                verse={verse}
                currentSurah={currentSurah}
                theme={theme}
                fontSize={fontSize}
                onCopyVerse={handleCopyVerse}
                onBookmarkVerse={handleBookmarkVerse}
                onPlayVerse={handlePlayVerse}
              />
            ))
          ) : (
            // Show message when no verses are available
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No verses available for this surah.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}