import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Type, Globe, Volume2 } from "lucide-react"
import { Theme } from "@/types/quran"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  theme: Theme
  fontSize: number
  language: string
  qori: string
  onFontSizeChange: (size: number) => void
  onLanguageChange: (language: string) => void
  onQoriChange: (qori: string) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  theme,
  fontSize,
  language,
  qori,
  onFontSizeChange,
  onLanguageChange,
  onQoriChange
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}>
        <DialogHeader>
          <DialogTitle>Pengaturan</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Type className="w-4 h-4" />
              Ukuran Font
            </label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => onFontSizeChange(value[0])}
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{fontSize}px</div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Bahasa Terjemahan
            </label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indonesian">Bahasa Indonesia</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="arabic">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Qori
            </label>
            <Select value={qori} onValueChange={onQoriChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mishary">Mishary Rashid Alafasy</SelectItem>
                <SelectItem value="sudais">Abdul Rahman Al-Sudais</SelectItem>
                <SelectItem value="husary">Mahmoud Khalil Al-Husary</SelectItem>
                <SelectItem value="minshawi">Mohamed Siddiq El-Minshawi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}