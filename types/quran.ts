export interface Verse {
  id: number
  surahNumber: number
  verseNumber: number
  arabicText: string
  indonesianTranslation: string
  audioUrl?: string
}

export interface Surah {
  number: number
  name: string
  arabicName: string
  verses: Verse[]
}

export interface AudioState {
  isPlaying: boolean
  currentVerse: number | null
  currentTime: number
  duration: number
}

export type PlaybackState = "stopped" | "playing" | "paused"
export type Theme = "light" | "dark"