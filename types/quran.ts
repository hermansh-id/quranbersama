
export interface SurahDetail {
  id: number
  name: string
  name_latin: string
  number_of_ayah: number
  ayahs: Ayah[]
}

export interface Ayah {
    id: number
    surah_id: number
    ayah_number: number
    text: string
    translations: Translation[]
    tafsirs: Tafsir[]
}

export interface Translation {
    language: string
    text: string
}

export interface Tafsir {
    source: string
    text: string
}

export interface Surah {
  id: number
  name: string
  name_latin: string
  number_of_ayah: number
}
export interface AudioState {
  isPlaying: boolean
  currentVerse: number | null
  currentTime: number
  duration: number
}

export type PlaybackState = "stopped" | "playing" | "paused"
export type Theme = "light" | "dark"