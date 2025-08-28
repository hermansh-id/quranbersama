import { ChevronLeft, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Surah, Theme } from "@/types/quran"
import { useRouter } from "next/navigation"
import { font_ayat } from '@/components/font';
import clsx from "clsx";

interface SurahNavigationProps {
  currentSurah: Surah
  currentSurahIndex: number
  totalSurahs: number
  theme: Theme
  onPrevSurah: () => void
  onNextSurah: () => void
}

export function SurahNavigation({
  currentSurah,
  currentSurahIndex,
  totalSurahs,
  theme,
  onPrevSurah,
  onNextSurah
}: SurahNavigationProps) {
  const router = useRouter()
  return (
    <div className="flex items-center justify-between py-6">
        <Button variant="ghost" size="sm" onClick={onPrevSurah} disabled={currentSurahIndex === 0} className="pointer">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <div className={clsx(`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, font_ayat.className)}>
            {currentSurah.name_latin}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNextSurah}
          disabled={currentSurahIndex === totalSurahs - 1}
          className="pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
    </div>
  )
}