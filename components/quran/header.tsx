import { Search, Settings, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Theme } from "@/types/quran"
import {ChevronLeft} from "lucide-react"
import { useRouter } from "next/navigation"

interface HeaderProps {
  theme: Theme
  onThemeToggle: () => void
  onSettingsClick: () => void
}

export function Header({ theme, onThemeToggle, onSettingsClick }: HeaderProps) {
  const router = useRouter()
  return (
    <div className={`${theme === "dark" ? "bg-gray-800" : "bg-teal-500"} text-white p-4`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <ChevronLeft className="w-5 h-5 text-gray-400" />
          <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Daftar Surah</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onThemeToggle}>
            {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onSettingsClick}>
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}