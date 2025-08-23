"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Loader2 } from "lucide-react"
import type { AudioState } from "@/types/quran"

interface AudioControlsProps {
  audioState: AudioState
  isLoading: boolean
  onPlayPause: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  className?: string
}

export function AudioControls({
  audioState,
  isLoading,
  onPlayPause,
  onSeek,
  onVolumeChange,
  className = "",
}: AudioControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Play/Pause Button */}
      <Button
        onClick={onPlayPause}
        variant="outline"
        size="icon"
        disabled={isLoading}
        className="border-emerald-300 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900 bg-transparent"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : audioState.isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {/* Progress Bar */}
      {audioState.duration > 0 && (
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 min-w-[35px]">
            {formatTime(audioState.currentTime)}
          </span>
          <Slider
            value={[audioState.currentTime]}
            max={audioState.duration}
            step={1}
            onValueChange={([value]) => onSeek(value)}
            className="flex-1"
          />
          <span className="text-xs text-emerald-600 dark:text-emerald-400 min-w-[35px]">
            {formatTime(audioState.duration)}
          </span>
        </div>
      )}

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <Slider
          defaultValue={[1]}
          max={1}
          step={0.1}
          onValueChange={([value]) => onVolumeChange(value)}
          className="w-20"
        />
      </div>
    </div>
  )
}
