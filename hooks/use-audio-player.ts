"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { AudioState } from "@/types/quran"

interface UseAudioPlayerProps {
  onVerseChange?: (verseId: number) => void
  onPlaybackEnd?: () => void
}

export function useAudioPlayer({ onVerseChange, onPlaybackEnd }: UseAudioPlayerProps = {}) {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentVerse: null,
    currentTime: 0,
    duration: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentAudioUrl = useRef<string | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    const audio = audioRef.current

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleLoadedMetadata = () => {
      setAudioState((prev) => ({
        ...prev,
        duration: audio.duration || 0,
      }))
    }

    const handleTimeUpdate = () => {
      setAudioState((prev) => ({
        ...prev,
        currentTime: audio.currentTime || 0,
      }))
    }

    const handleEnded = () => {
      setAudioState((prev) => ({
        ...prev,
        isPlaying: false,
      }))
      onPlaybackEnd?.()
    }

    const handleError = () => {
      setError("Failed to load audio")
      setIsLoading(false)
      setAudioState((prev) => ({
        ...prev,
        isPlaying: false,
      }))
    }

    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.pause()
    }
  }, [onPlaybackEnd])

  const playVerse = useCallback(
    async (verseId: number, audioUrl: string) => {
      if (!audioRef.current) return

      const audio = audioRef.current
      setError(null)

      try {
        // If it's a different audio file, load it
        if (currentAudioUrl.current !== audioUrl) {
          audio.pause()
          audio.src = audioUrl
          currentAudioUrl.current = audioUrl
          await audio.load()
        }

        // If it's the same verse and already playing, pause it
        if (audioState.currentVerse === verseId && audioState.isPlaying) {
          audio.pause()
          setAudioState((prev) => ({
            ...prev,
            isPlaying: false,
          }))
          return
        }

        // Play the audio
        await audio.play()
        setAudioState((prev) => ({
          ...prev,
          isPlaying: true,
          currentVerse: verseId,
        }))

        onVerseChange?.(verseId)
      } catch (err) {
        console.error("Audio playback error:", err)
        setError("Failed to play audio")
        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
        }))
      }
    },
    [audioState.currentVerse, audioState.isPlaying, onVerseChange],
  )

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setAudioState((prev) => ({
        ...prev,
        isPlaying: false,
      }))
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume))
    }
  }, [])

  return {
    audioState,
    isLoading,
    error,
    playVerse,
    pauseAudio,
    seekTo,
    setVolume,
  }
}
