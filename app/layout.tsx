import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WagmiProvider } from "@/components/wagmi-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "crowd.fun | Decentralized Crowdfunding",
  description: "A decentralized crowdfunding platform inspired by pump.fun",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WagmiProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
            {children}
            <Toaster />
          </ThemeProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
