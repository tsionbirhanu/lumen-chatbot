"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth")
    }, 1500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-[#0F172A] via-[#1E293B]/80 to-[#0A1B2D]">
      <div className="text-center space-y-6 animate-fadeIn scale-100 md:scale-105">
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 flex items-center justify-center shadow-xl animate-pulse glow-effect">
            <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
            Lumen
          </h1>
        </div>
        <div className="flex items-center justify-center gap-3 text-gray-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-lg">Loading your AI assistant...</p>
        </div>
      </div>
    </div>
  )
}
