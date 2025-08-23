"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Keyboard, X } from "lucide-react"
import { useState } from "react"

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { key: "Space", action: "Play/Pause audio" },
    { key: "→", action: "Next verse" },
    { key: "←", action: "Previous verse" },
    { key: "Esc", action: "Stop playback" },
  ]

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Shortcuts
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <Card className="bg-white dark:bg-gray-900 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">Keyboard Shortcuts</h3>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-emerald-600 dark:text-emerald-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded text-xs font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
