"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { ArrowRight, Rocket, Users, Target, Sparkles, Plus } from "lucide-react"
import { ConnectButton } from "@/components/connect-button"

export function LandingPage() {
  const [contractAddress, setContractAddress] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contractAddress.trim()) {
      router.push(`/campaign/${contractAddress}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 py-4">
        <div className="container flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-pump-green text-pump-green hover:bg-pump-green/10"
              onClick={() => router.push("/deploy")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1 rounded-full bg-muted/50 border border-border/60">
            <span className="text-pump-green mr-2">🚀</span>
            <span className="text-muted-foreground">Decentralized Crowdfunding on the Blockchain</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-text">
            Launch Your Campaign <br /> on crowd.fun
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Fair-launch crowdfunding. No middlemen, no fees, just pure blockchain-powered funding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => router.push("/deploy")}
              size="lg"
              className="h-12 px-8 bg-pump-green hover:bg-pump-green/90 text-black"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Campaign
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 border-pump-blue text-pump-blue hover:bg-pump-blue/10"
              onClick={() => {
                const inputElement = document.getElementById("campaign-address")
                if (inputElement) {
                  inputElement.scrollIntoView({ behavior: "smooth" })
                  inputElement.focus()
                }
              }}
            >
              <Rocket className="mr-2 h-5 w-5" />
              View Campaign
            </Button>
          </div>

          <div className="max-w-xl mx-auto mb-16 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pump-green to-pump-blue rounded-lg blur opacity-30 animate-pulse-glow"></div>
            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-4 p-1 rounded-lg">
              <Input
                id="campaign-address"
                type="text"
                placeholder="Enter campaign contract address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="flex-1 h-12 text-base bg-background border-muted"
              />
              <Button type="submit" size="lg" className="h-12 px-8 bg-pump-green hover:bg-pump-green/90 text-black">
                <span>View Campaign</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 inline-flex items-center">
              how it works
              <Sparkles className="ml-2 h-5 w-5 text-pump-yellow" />
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              crowd.fun allows anyone to create campaigns, all campaigns created are fair-launch, meaning everyone has
              equal access to support when the campaign is first created.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step="1"
              icon={<Target className="h-10 w-10 text-pump-green" />}
              title="pick a campaign"
              description="Browse campaigns or enter a contract address to find one you like"
            />
            <StepCard
              step="2"
              icon={<Rocket className="h-10 w-10 text-pump-blue" />}
              title="contribute ETH"
              description="Support the campaign by contributing any amount of ETH"
            />
            <StepCard
              step="3"
              icon={<Users className="h-10 w-10 text-pump-purple" />}
              title="track progress"
              description="Watch as the campaign reaches its funding goal"
            />
          </div>
        </div>
      </section>

      {/* Trending Campaigns Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">now trending</h2>
            <Button variant="outline" className="text-muted-foreground">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CampaignCard
                key={i}
                title={`Campaign #${i}`}
                goal={i * 5}
                progress={Math.floor(Math.random() * 100)}
                timeLeft={`${i + 1} days`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <div className="text-muted-foreground text-sm">© 2025 crowd.fun | All rights reserved</div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Terms
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Privacy
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border/60 hover:border-pump-green/50 transition-colors">
      <div className="mb-4 relative">
        {icon}
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background border border-border/60 flex items-center justify-center text-xs font-bold">
          {step}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function CampaignCard({
  title,
  goal,
  progress,
  timeLeft,
}: {
  title: string
  goal: number
  progress: number
  timeLeft: string
}) {
  return (
    <div className="rounded-lg bg-card border border-border/60 overflow-hidden hover:border-pump-green/50 transition-colors">
      <div className="h-40 bg-muted/30 flex items-center justify-center">
        <Rocket className="h-16 w-16 text-muted-foreground/30" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pump-green to-pump-blue"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Goal:</span>
            <span className="ml-1 font-medium">{goal} ETH</span>
          </div>
          <div>
            <span className="text-muted-foreground">Time left:</span>
            <span className="ml-1 font-medium">{timeLeft}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
