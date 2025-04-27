"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/logo"
import { ConnectButton } from "@/components/connect-button"
import { ArrowLeft, Rocket, Clock, Target, AlertCircle, Sparkles } from "lucide-react"
import { useDeployContract, useWaitForTransactionReceipt } from "wagmi"
import { crowdfundingABI } from "@/lib/crowdfunding-abi"
import { crowdfundingBytecode } from "@/lib/crowdfunding-bytecode"
import { parseEther } from "viem"

export function DeployPage() {
  const [goal, setGoal] = useState("")
  const [duration, setDuration] = useState("")

  const { isConnected } = useAccount()
  const { toast } = useToast()
  const router = useRouter()

  const {
    deployContract,                 
    data: deployData,               
    isLoading: isDeploying,         
    isSuccess: isDeployed,          
    isError,                        
    error,                          
  } = useDeployContract({
    abi: crowdfundingABI,
    bytecode: crowdfundingBytecode,
  })

  // wait for the deployment tx to be mined
  const { isLoading: isWaitingForTransaction } = useWaitForTransactionReceipt({
    hash: deployData?.transactionHash,
  })

  const handleDeploy = () => {
    if (!goal || !duration) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      deployContract({
        args: [
          parseEther(goal),
          BigInt(parseInt(duration, 10) * 24 * 60 * 60),
        ],
      })
    } catch (e) {
      console.error("Deployment error:", e)
      toast({
        title: "Deployment failed",
        description: "There was an error deploying your campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  // on successful deployment, navigate to the new campaign page
  useEffect(() => {
    if (isDeployed && deployData?.address) {
      toast({
        title: "Campaign deployed!",
        description: "Your crowdfunding campaign has been successfully deployed.",
      })
      router.push(`/campaign/${deployData.address}`)
    }
  }, [isDeployed, deployData, router, toast])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 py-4">
        <div className="container flex justify-between items-center">
          <Logo />
          <ConnectButton />
        </div>
      </header>

      <div className="container max-w-3xl py-8 px-4 md:px-6 flex-1">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4 text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">Launch a Campaign</h1>
            <Sparkles className="h-5 w-5 text-pump-yellow" />
          </div>
          <p className="text-muted-foreground">
            Create your own crowdfunding campaign on the blockchain
          </p>
        </div>

        <Card className="bg-card border border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-pump-green" />
              <h3 className="font-semibold">Campaign Details</h3>
            </div>
          </div>
          <CardContent className="p-6">
            {!isConnected ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-6">
                  You need to connect your wallet to deploy a campaign
                </p>
                <ConnectButton />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Funding Goal */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-pump-green" />
                    <label htmlFor="goal" className="font-medium">
                      Funding Goal
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      id="goal"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter amount in WND"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="bg-background border-muted pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      WND
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The total amount of WND you want to raise for your campaign
                  </p>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-pump-blue" />
                    <label htmlFor="duration" className="font-medium">
                      Campaign Duration
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="365"
                      placeholder="Enter number of days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-background border-muted pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      Days
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    How long your campaign will be active, in days (1-365)
                  </p>
                </div>

                {/* Deploy Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleDeploy}
                    disabled={!goal || !duration || isDeploying || isWaitingForTransaction}
                    className="w-full bg-pump-green hover:bg-pump-green/90 text-black h-12 text-base"
                  >
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      {isDeploying || isWaitingForTransaction
                        ? "Deploying..."
                        : "Launch Campaign"}
                    </div>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  By deploying a campaign, you’ll become the campaign owner and
                  will be able to withdraw funds if the goal is reached.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <div className="text-muted-foreground text-sm">
              © 2025 crowd.fun | All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
