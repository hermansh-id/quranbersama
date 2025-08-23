'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from "@/components/quran/header"
import { SettingsDialog } from "@/components/quran/settings-dialog"
import { SurahNavigation } from "@/components/quran/surah-navigation"
import { SurahHeader } from "@/components/quran/surah-header"
import { VerseCard } from "@/components/quran/verse-card"
import { FullScreenVerse } from "@/components/quran/full-screen-verse"
import { surahs } from "@/data/quran-data"
import type { Verse, PlaybackState, Theme } from "@/types/quran"

export default function QuranApp() {
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0)
  const [fullScreenVerse, setFullScreenVerse] = useState<Verse | null>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>("stopped")
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [theme, setTheme] = useState<Theme>("light")
  const [fontSize, setFontSize] = useState(16)
  const [language, setLanguage] = useState("indonesian")
  const [qori, setQori] = useState("mishary")
  const [settingsOpen, setSettingsOpen] = useState(false)

  const currentSurah = surahs[currentSurahIndex]
  const allVerses = surahs.flatMap((surah) => surah.verses)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const getVerseDuration = (verse: Verse) => {
    const baseLength = verse.arabicText.length
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

  const handlePlayVerse = (verse: Verse) => {
    console.log("[v0] Playing verse:", verse.verseNumber)
    setFullScreenVerse(verse)
    setCurrentVerseIndex(getCurrentVerseInAllVerses())
    setPlaybackState("playing")
    setProgress(0)
  }

  const handlePlaySurah = () => {
    if (currentSurah.verses.length > 0) {
      handlePlayVerse(currentSurah.verses[0])
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

  const handleCopyVerse = (verse: Verse) => {
    const text = `${verse.arabicText}\n\n${verse.indonesianTranslation}`
    navigator.clipboard.writeText(text)
    console.log("[v0] Copied verse:", verse.verseNumber, text)
  }

  const handleBookmarkVerse = (verse: Verse) => {
    console.log("[v0] Bookmarked verse:", verse.verseNumber, verse.arabicText)
  }

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleNextSurah = () => {
    if (currentSurahIndex < surahs.length - 1) {
      setCurrentSurahIndex(currentSurahIndex + 1)
    }
  }

  const handlePrevSurah = () => {
    if (currentSurahIndex > 0) {
      setCurrentSurahIndex(currentSurahIndex - 1)
    }
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
        <SurahNavigation
          currentSurah={currentSurah}
          currentSurahIndex={currentSurahIndex}
          totalSurahs={surahs.length}
          theme={theme}
          onPrevSurah={handlePrevSurah}
          onNextSurah={handleNextSurah}
        />

        <SurahHeader
          surah={currentSurah}
          theme={theme}
          onPlaySurah={handlePlaySurah}
        />

<div className="space-y-8">
          {currentSurah.verses.map((verse) => (
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
          ))}
        </div>
      </div>
    </div>
  )
}
