"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Mail, Lock, Sparkles } from "lucide-react"

interface LoginFormProps {
  onToggleMode: () => void
  onAuth: () => void
}

export function LoginForm({ onToggleMode, onAuth }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast("Welcome back!", { description: "Successfully logged in to Lumen." })
      onAuth()
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl shadow-cyan-500/20 border border-gray-700 rounded-xl backdrop-blur-lg bg-[#1E293B]/80 animate-fadeIn hover:scale-[1.02] transition-transform duration-300">
      <CardHeader className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 flex items-center justify-center shadow-lg glow-effect">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Lumen
          </CardTitle>
        </div>
        <CardDescription className="text-gray-100">
          Welcome back! Sign in to continue your AI conversations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-100">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-[#0F172A]/60 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-100">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-[#0F172A]/60 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 hover:animate-gradient-x text-white font-semibold shadow-lg active:scale-95 transition-all duration-150"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2 inline-block" /> : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <button onClick={onToggleMode} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign up
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
