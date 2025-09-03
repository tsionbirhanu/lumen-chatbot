import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Lumen AI - Advanced Chatbot Assistant",
  description:
    "Experience the future of AI conversation with Lumen - a sophisticated chatbot powered by advanced AI technology.",
  generator: "v0.app",
  keywords: ["AI", "chatbot", "assistant", "artificial intelligence", "conversation"],
  authors: [{ name: "Lumen AI Team" }],
  openGraph: {
    title: "Lumen AI - Advanced Chatbot Assistant",
    description: "Experience the future of AI conversation with Lumen",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
