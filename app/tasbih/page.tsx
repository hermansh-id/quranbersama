"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"

const dhikrList = [
  {
    id: 1,
    arabic: "سُبْحَانَ ٱللَّٰهِ",
    transliteration: "Subhanallah",
    meaning: "Glory be to Allah",
    color: "from-emerald-400 to-teal-500",
    target: 33,
  },
  {
    id: 2,
    arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    transliteration: "Alhamdulillah",
    meaning: "Praise be to Allah",
    color: "from-blue-400 to-cyan-500",
    target: 33,
  },
  {
    id: 3,
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaning: "Allah is the Greatest",
    color: "from-purple-400 to-indigo-500",
    target: 34,
  },
  {
    id: 4,
    arabic: "أَسْتَغْفِرُ ٱللَّٰهَ",
    transliteration: "Astaghfirullah",
    meaning: "I seek forgiveness from Allah",
    color: "from-rose-400 to-pink-500",
    target: 100,
  },
  {
    id: 5,
    arabic: "لَا إِلٰهَ إِلَّا ٱللَّٰهُ",
    transliteration: "La ilaha illa Allah",
    meaning: "There is no god but Allah",
    color: "from-amber-400 to-orange-500",
    target: 100,
  },
]

export default function TasbihPage() {
  const [selectedDhikr, setSelectedDhikr] = useState(dhikrList[0])
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeBeadIndex, setActiveBeadIndex] = useState(0)
  const [pulseBeads, setPulseBeads] = useState<number[]>([])

  const totalBeads = 33
  const beads = Array.from({ length: totalBeads }, (_, i) => i)

  const handleIncrement = () => {
    setCount((prev) => prev + 1)
    setIsAnimating(true)

    const newActiveIndex = count % totalBeads
    setActiveBeadIndex(newActiveIndex)

    // Add pulse effect to current bead
    setPulseBeads((prev) => [...prev, newActiveIndex])
    setTimeout(() => {
      setPulseBeads((prev) => prev.filter((index) => index !== newActiveIndex))
    }, 600)

    // Play sound effect (if enabled)
    if (soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }

    setTimeout(() => setIsAnimating(false), 150)
  }

  const resetCount = () => {
    setCount(0)
    setActiveBeadIndex(0)
    setPulseBeads([])
  }

  const progress = (count / selectedDhikr.target) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Digital Tasbih</h1>
        <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Main Counter Card */}
        <Card className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl mb-6">
          <div className="p-8 text-center">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${selectedDhikr.color} transition-all duration-300 ease-out`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* Counter Display */}
            <div className="relative mb-8">
              <div
                className={`text-6xl font-bold bg-gradient-to-r ${selectedDhikr.color} bg-clip-text text-transparent transition-transform duration-150 ${
                  isAnimating ? "scale-110" : "scale-100"
                }`}
              >
                {count}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Target: {selectedDhikr.target}</div>
            </div>

            <div className="relative w-64 h-64 mx-auto cursor-pointer select-none mb-6" onClick={handleIncrement}>
              {/* Center glow effect */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${selectedDhikr.color} opacity-10 animate-pulse`}
              />

              {/* Tasbih beads arranged in circle */}
              {beads.map((beadIndex) => {
                const angle = (beadIndex / totalBeads) * 2 * Math.PI - Math.PI / 2
                const radius = 110
                const x = Math.cos(angle) * radius + 128
                const y = Math.sin(angle) * radius + 128

                const isActive = beadIndex <= activeBeadIndex
                const isPulsing = pulseBeads.includes(beadIndex)
                const isCurrentBead = beadIndex === activeBeadIndex

                return (
                  <div
                    key={beadIndex}
                    className={`absolute w-4 h-4 rounded-full transition-all duration-300 transform -translate-x-2 -translate-y-2 ${
                      isActive
                        ? `bg-gradient-to-br ${selectedDhikr.color} shadow-lg ${isCurrentBead ? "scale-150 shadow-xl" : "scale-100"}`
                        : "bg-gray-300 dark:bg-gray-600 scale-75"
                    } ${isPulsing ? "animate-ping" : ""}`}
                    style={{
                      left: x,
                      top: y,
                      boxShadow: isActive ? `0 0 ${isCurrentBead ? "20px" : "10px"} rgba(16, 185, 129, 0.4)` : "none",
                    }}
                  />
                )
              })}

              {/* Center tap indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedDhikr.color} opacity-20 flex items-center justify-center transition-transform duration-150 ${
                    isAnimating ? "scale-110" : "scale-100"
                  }`}
                >
                  <div className="text-white text-xs font-medium">TAP</div>
                </div>
              </div>

              {/* Connecting line for completed beads */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {beads.slice(0, activeBeadIndex + 1).map((beadIndex) => {
                  if (beadIndex === 0) return null

                  const prevAngle = ((beadIndex - 1) / totalBeads) * 2 * Math.PI - Math.PI / 2
                  const currAngle = (beadIndex / totalBeads) * 2 * Math.PI - Math.PI / 2
                  const radius = 110

                  const x1 = Math.cos(prevAngle) * radius + 128
                  const y1 = Math.sin(prevAngle) * radius + 128
                  const x2 = Math.cos(currAngle) * radius + 128
                  const y2 = Math.sin(currAngle) * radius + 128

                  return (
                    <line
                      key={beadIndex}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="url(#beadGradient)"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-draw-line"
                    />
                  )
                })}
                <defs>
                  <linearGradient id="beadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(16, 185, 129)" />
                    <stop offset="100%" stopColor="rgb(20, 184, 166)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Reset Button */}
            <Button variant="outline" size="sm" onClick={resetCount} className="gap-2 bg-transparent">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </Card>

        {/* Current Dhikr Display */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg mb-6">
          <div className="p-6 text-center">
            <div className="text-2xl font-arabic mb-2 text-gray-800 dark:text-gray-200">{selectedDhikr.arabic}</div>
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {selectedDhikr.transliteration}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{selectedDhikr.meaning}</div>
          </div>
        </Card>

        {/* Dhikr Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Dhikr</h3>
          {dhikrList.map((dhikr) => (
            <Card
              key={dhikr.id}
              className={`cursor-pointer transition-all duration-200 border-0 ${
                selectedDhikr.id === dhikr.id
                  ? "bg-white dark:bg-gray-800 shadow-lg scale-[1.02]"
                  : "bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80"
              }`}
              onClick={() => setSelectedDhikr(dhikr)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-lg font-arabic text-gray-800 dark:text-gray-200 mb-1">{dhikr.arabic}</div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{dhikr.transliteration}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{dhikr.meaning}</div>
                </div>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${dhikr.color}`} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
