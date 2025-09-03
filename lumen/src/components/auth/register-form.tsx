"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Mail, Lock, User, Sparkles } from "lucide-react"

interface RegisterFormProps {
  onToggleMode: () => void
  onAuth: () => void
}

export function RegisterForm({ onToggleMode, onAuth }: RegisterFormProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast("Welcome to Lumen!", { description: "Your account has been created successfully." })
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
          Create your account to start intelligent conversations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-100">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-12 bg-[#0F172A]/60 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                required
              />
            </div>
          </div>

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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-[#0F172A]/60 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                required
                minLength={8}
              />
            </div>
            <p className="text-xs text-gray-400">At least 8 characters, mix letters and numbers</p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 hover:animate-gradient-x text-white font-semibold shadow-lg active:scale-95 transition-all duration-150"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2 inline-block" /> : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <button onClick={onToggleMode} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
