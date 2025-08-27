import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Type, Globe, Volume2 } from "lucide-react"
import type { Theme } from "@/types/quran"
import type { Qori } from "@/types/qori" // NEW: Import tipe Qori

// MODIFIED: Perbarui props interface
interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  theme: Theme
  fontSize: number
  language: string
  qori: string
  qoris: Qori[] // NEW: Terima array Qori
  isQorisLoading: boolean // NEW: Terima status loading
  onFontSizeChange: (size: number) => void
  onLanguageChange: (language: string) => void
  onQoriChange: (qoriId: string) => void // Perjelas bahwa ini adalah ID
}

export function SettingsDialog({
  open,
  onOpenChange,
  theme,
  fontSize,
  language,
  qori,
  qoris, // NEW
  isQorisLoading, // NEW
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
          {/* Bagian Font Size dan Bahasa (Tidak ada perubahan) */}
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
              </SelectContent>
            </Select>
          </div>

          {/* MODIFIED: Bagian Qori sekarang dinamis */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Qori
            </label>
            <Select value={qori} onValueChange={onQoriChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Qori..." />
              </SelectTrigger>
              <SelectContent>
                {isQorisLoading ? (
                  <SelectItem value="loading" disabled>
                    Memuat data Qori...
                  </SelectItem>
                ) : (
                  qoris.map((qoriItem) => (
                    <SelectItem key={qoriItem.id} value={qoriItem.id}>
                      {qoriItem.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}