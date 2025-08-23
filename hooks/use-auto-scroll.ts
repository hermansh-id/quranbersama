"use client"

import { useEffect, useRef } from "react"

export function useAutoScroll(currentVerse: number | null, isPlaying: boolean) {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (currentVerse && isPlaying) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Delay scroll to allow for animations to start
      scrollTimeoutRef.current = setTimeout(() => {
        const verseElement = document.getElementById(`verse-${currentVerse}`)
        if (verseElement) {
          verseElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          })
        }
      }, 300)
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [currentVerse, isPlaying])
}
