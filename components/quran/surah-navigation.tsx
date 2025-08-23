import { ChevronLeft, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Surah, Theme } from "@/types/quran"
import { useRouter } from "next/navigation"
import { amiriQuran } from '@/components/font';
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
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
        <ChevronLeft className="w-5 h-5 text-gray-400" />
        <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Daftar Surah</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onPrevSurah} disabled={currentSurahIndex === 0}>
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <div className={clsx(`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, amiriQuran.className)}>
            {currentSurah.name}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNextSurah}
          disabled={currentSurahIndex === totalSurahs - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-gray-400" />
        <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Pengaturan</span>
      </div>
    </div>
  )
}