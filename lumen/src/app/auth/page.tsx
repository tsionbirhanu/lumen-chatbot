"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/chat")
    }, 1200)
  }

  const handleGoogleAuth = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/chat")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <Card className="w-full max-w-md backdrop-blur-md bg-[#1E293B]/80 border border-[#3B82F6]/20 shadow-2xl rounded-xl animate-fadeIn">
        <CardHeader className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white">Lumen</h1>
          <CardDescription className="text-gray-300">
            {isLogin ? "Sign in to access your AI assistant" : "Create your account and start chatting with AI"}
          </CardDescription>
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            <Button
              variant={isLogin ? "default" : "ghost"}
              className={`flex-1 font-medium ${isLogin ? "bg-blue-600 hover:bg-blue-500 text-white" : "text-gray-300"}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </Button>
            <Button
              variant={!isLogin ? "default" : "ghost"}
              className={`flex-1 font-medium ${!isLogin ? "bg-cyan-500 hover:bg-cyan-400 text-white" : "text-gray-300"}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="name" placeholder="Enter your full name" className="pl-10 h-12 bg-[#0F172A]/60 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 bg-[#0F172A]/60 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 bg-[#0F172A]/60 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600/40" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 uppercase">
              <span className="bg-[#1E293B]/80 px-2">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border border-gray-600/40 hover:bg-gray-700 text-white flex items-center justify-center gap-2"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <FcGoogle className="w-5 h-5" /> Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
