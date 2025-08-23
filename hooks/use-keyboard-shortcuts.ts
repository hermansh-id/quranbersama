"use client"

import { useEffect } from "react"

interface UseKeyboardShortcutsProps {
  onPlayPause: () => void
  onNextVerse: () => void
  onPreviousVerse: () => void
  isPlaying: boolean
}

export function useKeyboardShortcuts({
  onPlayPause,
  onNextVerse,
  onPreviousVerse,
  isPlaying,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.code) {
        case "Space":
          event.preventDefault()
          onPlayPause()
          break
        case "ArrowRight":
          event.preventDefault()
          onNextVerse()
          break
        case "ArrowLeft":
          event.preventDefault()
          onPreviousVerse()
          break
        case "Escape":
          if (isPlaying) {
            event.preventDefault()
            onPlayPause()
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [onPlayPause, onNextVerse, onPreviousVerse, isPlaying])
}
