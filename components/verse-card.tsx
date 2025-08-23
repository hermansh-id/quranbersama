"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Loader2 } from "lucide-react"
import type { Ayah, AudioState } from "@/types/quran"

interface VerseCardProps {
  verse: Ayah
  audioState: AudioState
  isLoading: boolean
  onPlayPause: (verseId: number, audioUrl: string) => void
}

export function VerseCard({ verse, audioState, isLoading, onPlayPause }: VerseCardProps) {
  const isCurrentVerse = audioState.currentVerse === verse.id
  const isPlaying = isCurrentVerse && audioState.isPlaying
  const isLoadingThisVerse = isLoading && isCurrentVerse

  return (
    <Card
      id={`verse-${verse.id}`}
      className={`p-6 transition-all duration-700 ease-out ${
        isPlaying
          ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/60 dark:to-emerald-800/40 border-emerald-300 dark:border-emerald-600 shadow-2xl scale-105 ring-4 ring-emerald-200/50 dark:ring-emerald-700/50"
          : "bg-white/80 dark:bg-gray-900/80 border-emerald-200 dark:border-emerald-800 hover:bg-white/90 dark:hover:bg-gray-900/90"
      } backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transform-gpu`}
    >
      <div className="flex items-start gap-4">
        {/* Play Button */}
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={() => onPlayPause(verse.id, "")}
            variant="outline"
            size="icon"
            disabled={isLoadingThisVerse}
            className={`mt-2 transition-all duration-500 transform ${
              isPlaying
                ? "border-emerald-400 bg-emerald-200 text-emerald-800 hover:bg-emerald-300 dark:border-emerald-500 dark:bg-emerald-800 dark:text-emerald-200 scale-110 shadow-lg"
                : "border-emerald-300 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900"
            }`}
          >
            {isLoadingThisVerse ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Verse Number Badge */}
          <div
            className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-500 ${
              isPlaying
                ? "bg-emerald-300 text-emerald-900 dark:bg-emerald-700 dark:text-emerald-100 shadow-md scale-110"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
            }`}
          >
            {verse.ayah_number}
          </div>

          {isPlaying && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>}
        </div>

        <div className="flex-1 min-w-0">
          {/* Arabic Text */}
          <div className="mb-6">
            <p
              className={`text-right leading-loose transition-all duration-700 ease-out ${
                isPlaying
                  ? "text-4xl md:text-5xl lg:text-6xl text-emerald-900 dark:text-emerald-100 font-semibold drop-shadow-sm"
                  : "text-2xl md:text-3xl lg:text-4xl text-gray-800 dark:text-gray-200"
              }`}
              style={{
                fontFamily: "serif",
                lineHeight: isPlaying ? "1.8" : "1.6",
                textShadow: isPlaying ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
              }}
              dir="rtl"
            >
              {verse.text}
            </p>
          </div>

          {/* Indonesian Translation */}
          <div className="border-t border-emerald-200 dark:border-emerald-800 pt-4">
            <p
              className={`leading-relaxed transition-all duration-700 ease-out ${
                isPlaying
                  ? "text-xl md:text-2xl text-emerald-800 dark:text-emerald-200 font-medium"
                  : "text-base md:text-lg text-gray-600 dark:text-gray-400"
              }`}
            >
              {verse.translations[0].text}
            </p>
          </div>

          {isCurrentVerse && audioState.duration > 0 && (
            <div className="mt-6 pt-4 border-t border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-300">
                <div className="flex-1 bg-emerald-200 dark:bg-emerald-800 rounded-full h-2 shadow-inner">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isPlaying ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-sm" : "bg-emerald-400"
                    }`}
                    style={{
                      width: `${(audioState.currentTime / audioState.duration) * 100}%`,
                    }}
                  />
                </div>
                <span className="min-w-[80px] text-right font-mono text-xs">
                  {Math.floor(audioState.currentTime / 60)}:
                  {Math.floor(audioState.currentTime % 60)
                    .toString()
                    .padStart(2, "0")}{" "}
                  / {Math.floor(audioState.duration / 60)}:
                  {Math.floor(audioState.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isPlaying && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/10 to-teal-400/10 pointer-events-none" />
      )}
    </Card>
  )
}
