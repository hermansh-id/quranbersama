import { Search, Sun, Moon, BookOpen, Heart, Bookmark, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const surahs = [
  { number: 1, arabic: "الْفَاتِحَة", name: "Al-Fatihah", meaning: "Pembukaan", verses: 7 },
  { number: 2, arabic: "الْبَقَرَة", name: "Al-Baqarah", meaning: "Sapi", verses: 286 },
  { number: 3, arabic: "آلْ عِمْرَان", name: "Ali 'Imran", meaning: "Keluarga Imran", verses: 200 },
  { number: 4, arabic: "النِّسَاء", name: "An-Nisa'", meaning: "Wanita", verses: 176 },
  { number: 5, arabic: "الْمَائِدَة", name: "Al-Ma'idah", meaning: "Hidangan", verses: 120 },
  { number: 6, arabic: "الْأَنْعَام", name: "Al-An'am", meaning: "Binatang Ternak", verses: 165 },
  { number: 7, arabic: "الْأَعْرَاف", name: "Al-A'raf", meaning: "Tempat Tertinggi", verses: 206 },
  { number: 8, arabic: "الْأَنْفَال", name: "Al-Anfal", meaning: "Rampasan Perang", verses: 75 },
  { number: 9, arabic: "التَّوْبَة", name: "At-Taubah", meaning: "Pengampunan", verses: 129 },
  { number: 10, arabic: "يُونُس", name: "Yunus", meaning: "Yunus", verses: 109 },
  { number: 11, arabic: "هُود", name: "Hud", meaning: "Hud", verses: 123 },
  { number: 12, arabic: "يُوسُف", name: "Yusuf", meaning: "Yusuf", verses: 111 },
  { number: 13, arabic: "الرَّعْد", name: "Ar-Ra'd", meaning: "Guruh", verses: 43 },
  { number: 14, arabic: "إِبْرَاهِيم", name: "Ibrahim", meaning: "Ibrahim", verses: 52 },
  { number: 15, arabic: "الْحِجْر", name: "Al-Hijr", meaning: "Hijr", verses: 99 },
  { number: 16, arabic: "النَّحْل", name: "An-Nahl", meaning: "Lebah", verses: 128 },
  { number: 17, arabic: "الْإِسْرَاء", name: "Al-Isra'", meaning: "Memperjalankan Malam Hari", verses: 111 },
  { number: 18, arabic: "الْكَهْف", name: "Al-Kahf", meaning: "Gua", verses: 110 },
  { number: 19, arabic: "مَرْيَم", name: "Maryam", meaning: "Maryam", verses: 98 },
  { number: 20, arabic: "طه", name: "Thaha", meaning: "Thaha", verses: 135 },
  { number: 21, arabic: "الْأَنْبِيَاء", name: "Al-Anbiya'", meaning: "Para Nabi", verses: 112 },
  { number: 22, arabic: "الْحَج", name: "Al-Hajj", meaning: "Haji", verses: 78 },
  { number: 23, arabic: "الْمُؤْمِنُون", name: "Al-Mu'minun", meaning: "Orang-Orang Mukmin", verses: 118 },
  { number: 24, arabic: "النُّور", name: "An-Nur", meaning: "Cahaya", verses: 64 },
]

const features = [
  {
    icon: BookOpen,
    title: "Al-Quran",
    description: "Read the Holy Quran",
    color: "bg-emerald-100 text-emerald-700",
    href: "/",
  },
  {
    icon: Heart,
    title: "Digital Tasbih",
    description: "Count your dhikr",
    color: "bg-blue-100 text-blue-700",
    href: "/tasbih",
  },
  {
    icon: Bookmark,
    title: "Wirid & Doa",
    description: "Prayers and supplications",
    color: "bg-amber-100 text-amber-700",
    href: "/",
  },
  {
    icon: Star,
    title: "Maulid",
    description: "Prophet's biography",
    color: "bg-purple-100 text-purple-700",
    href: "/",
  },
]

const popularSurahs = ["Yasin", "Al-Waqi'ah", "Al-Mulk", "Al-Kahfi", "Ar-Rahman", "Ayat Kursi"]

export default function QuranPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 bg-clip-text text-transparent">
              QuranOnline
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search surahs..."
                className="pl-10 w-56 h-9 bg-slate-100/80 dark:bg-slate-800/80 border-0 text-sm"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Feature Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="group hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:scale-[1.02]">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">{feature.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Surahs */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {popularSurahs.map((surah, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 cursor-pointer transition-all duration-200 border border-emerald-200/50 dark:border-emerald-800/50 hover:scale-105"
              >
                {surah}
              </Badge>
            ))}
          </div>
        </section>

        {/* Surahs Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {surahs.map((surah) => (
              <Card
                key={surah.number}
                className="group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer border border-slate-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 hover:scale-[1.02]"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                        {surah.number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">
                          {surah.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{surah.meaning}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-lg font-arabic text-slate-700 dark:text-slate-300 leading-tight" dir="rtl">
                        {surah.arabic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{surah.verses} verses</span>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-rose-50 dark:hover:bg-rose-950">
                        <Heart className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
