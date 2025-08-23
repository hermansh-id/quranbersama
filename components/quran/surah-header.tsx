import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Surah, Theme } from "@/types/quran"
import clsx from "clsx";
import { amiriQuran } from '@/app/layout';

interface SurahHeaderProps {
  surah: Surah
  theme: Theme
  onPlaySurah: () => void
}

export function SurahHeader({ surah, theme, onPlaySurah }: SurahHeaderProps) {
  return (
    <div className="text-center py-8">

      <div className={clsx(`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`, amiriQuran.className)}>
        {surah.arabicName}
      </div>
      <div className={`text-2xl font-semibold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
        {surah.name}
      </div>
      <div className="text-teal-600 mb-4">Makkiyah • {surah.verses.length}</div>
      <Button
        onClick={onPlaySurah}
        className="rounded-full bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 flex items-center gap-2 mx-auto"
      >
        <Play className="w-5 h-5" />
        Putar Surah
      </Button>
    </div>
  )
}