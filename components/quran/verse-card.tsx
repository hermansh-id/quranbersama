import { MoreVertical, Copy, Bookmark, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Verse, Surah, Theme } from "@/types/quran"
import clsx from "clsx";
import { amiriQuran } from '@/components/font';

interface VerseCardProps {
  verse: Verse
  currentSurah: Surah
  theme: Theme
  fontSize: number
  onCopyVerse: (verse: Verse) => void
  onBookmarkVerse: (verse: Verse) => void
  onPlayVerse: (verse: Verse) => void
}

const getTransliteration = (verse: Verse, surah: Surah) => {
  if (verse.verseNumber === 1 && surah.number === 1) return "bismillāhir-raḥmānir-raḥīm"
  if (verse.verseNumber === 2 && surah.number === 1) return "al-ḥamdu lillāhi rabbil-'ālamīn"
  if (verse.verseNumber === 3 && surah.number === 1) return "ar-raḥmānir-raḥīm"
  if (verse.verseNumber === 1 && surah.number === 112) return "qul huwallāhu aḥad"
  if (verse.verseNumber === 2 && surah.number === 112) return "allāhuṣ-ṣamad"
  if (verse.verseNumber === 3 && surah.number === 112) return "lam yalid wa lam yūlad"
  if (verse.verseNumber === 4 && surah.number === 112) return "wa lam yakun lahū kufuwan aḥad"
  return "transliteration"
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
        amiriQuran.className
      )}
    >
      {verse.arabicText}  ۝{toArabicIndic(verse.verseNumber)}
    </div>

    {/* Transliteration */}
    <div className="text-teal-600 text-sm">
      {getTransliteration(verse, currentSurah)}
    </div>

    {/* Translation */}
    <div className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
      {verse.indonesianTranslation}
    </div>
  </div>
</div>

  )
}