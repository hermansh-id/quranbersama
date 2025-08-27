import { MoreVertical, Copy, Bookmark, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ayah, Surah, Theme } from "@/types/quran"
import clsx from "clsx";
import { font_ayat } from '@/components/font';

interface VerseCardProps {
  verse: Ayah
  currentSurah: Surah
  theme: Theme
  fontSize: number
  onCopyVerse: (verse: Ayah) => void
  onBookmarkVerse: (verse: Ayah) => void
  onPlayVerse: (verse: Ayah) => void
}

const toArabicIndic = (num: number) => {
    return num.toString().replace(/\d/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
  }

export function VerseCard({
  verse,
  currentSurah,
  theme,
  fontSize,
  onCopyVerse,
  onBookmarkVerse,
  onPlayVerse
}: VerseCardProps) {
  return (
<div className="flex items-start gap-4 py-4">
  {/* Dropdown menu */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 mt-2">
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem onClick={() => onPlayVerse(verse)}>
        <Play className="w-4 h-4 mr-2" />
        Mainkan
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onCopyVerse(verse)}>
        <Copy className="w-4 h-4 mr-2" />
        Salin Ayat
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onBookmarkVerse(verse)}>
        <Bookmark className="w-4 h-4 mr-2" />
        Tandai
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  {/* Isi konten ayat */}
  <div className="flex-1 space-y-3">

    {/* Teks Arab */}
    <div
      className={clsx(
        `text-2xl md:text-3xl font-bold leading-relaxed mb-2 text-right`,
        theme === "dark" ? "text-white" : "text-gray-900",
        font_ayat.className
      )}
    >
      {verse.text} <span className="mr-2"> ۝{toArabicIndic(verse.ayah_number)} </span>
    </div>

    {/* Transliteration */}
    {/* <div className="text-teal-600 text-sm">
      {verse.translations[0].text}
    </div> */}

    {/* Translation */}
    <div className={`mt-2 leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
      {verse.translations[0].text}
    </div>
  </div>
</div>

  )
}