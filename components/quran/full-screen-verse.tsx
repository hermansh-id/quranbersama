import { ChevronLeft, ChevronRight, Play, Pause, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Verse, PlaybackState, Theme } from "@/types/quran"
import clsx from "clsx";
import { amiriQuran } from '@/app/layout';

interface FullScreenVerseProps {
  verse: Verse
  playbackState: PlaybackState
  progress: number
  currentIndex: number
  totalVerses: number
  theme: Theme
  isFirstVerse: boolean
  isLastVerse: boolean
  onPrevVerse: () => void
  onNextVerse: () => void
  onPause: () => void
  onStop: () => void
}

const toArabicIndic = (num: number) => {
  return num.toString().replace(/\d/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
}

export function FullScreenVerse({
  verse,
  playbackState,
  progress,
  currentIndex,
  totalVerses,
  theme,
  isFirstVerse,
  isLastVerse,
  onPrevVerse,
  onNextVerse,
  onPause,
  onStop
}: FullScreenVerseProps) {
  return (
    <div
      className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      <div className="flex-1 flex flex-col items-end justify-center p-8 text-right">
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div
            className={clsx(amiriQuran.className, `text-6xl md:text-7xl lg:text-8xl font-bold leading-relaxed mb-12 text-right animate-in slide-in-from-right-6 duration-700 ${theme === "dark" ? "text-white" : "text-gray-900"}`)}
          >
            {verse.arabicText} ۝{toArabicIndic(verse.verseNumber)}
          </div>

          <div
            className={`text-lg md:text-xl leading-relaxed text-right animate-in slide-in-from-right-8 duration-900 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            {verse.indonesianTranslation}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div
          className={`flex items-center gap-4 px-6 py-4 rounded-full shadow-lg backdrop-blur-sm border animate-in slide-in-from-bottom-4 duration-500 ${
            theme === "dark" ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevVerse}
            disabled={isFirstVerse}
            className="rounded-full w-12 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onPause}
            className="rounded-full w-14 h-14 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900 dark:hover:bg-teal-800"
          >
            {playbackState === "playing" ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onStop}
            className="rounded-full w-12 h-12 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
          >
            <Square className="w-4 h-4" />
          </Button>

          <div className={`text-sm font-medium px-3 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {currentIndex + 1} / {totalVerses}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNextVerse}
            disabled={isLastVerse}
            className="rounded-full w-12 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className={`mt-3 w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-full h-1`}>
          <div
            className="bg-teal-500 h-1 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}