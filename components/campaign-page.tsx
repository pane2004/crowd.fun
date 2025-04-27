"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatEther, parseEther } from "viem"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/logo"
import { ConnectButton } from "@/components/connect-button"
import { ArrowLeft, Clock, Users, Target, AlertCircle, Rocket, Sparkles, TrendingUp } from "lucide-react"
import { crowdfundingABI } from "@/lib/crowdfunding-abi"

export function CampaignPage({ contractAddress }: { contractAddress: string }) {
  const [contributionAmount, setContributionAmount] = useState("")
  const { address } = useAccount()
  const { toast } = useToast()
  const router = useRouter()

  // Read contract data
  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: crowdfundingABI,
    functionName: "owner",
  })

  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: crowdfundingABI,
    functionName: "goal",
  })

  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: crowdfundingABI,
    functionName: "deadline",
  })

  const { data: totalContributed, isLoading: isLoadingTotal } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: crowdfundingABI,
    functionName: "totalContributed",
  })

  const { data: timeLeft, isLoading: isLoadingTimeLeft } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: crowdfundingABI,
    functionName: "timeLeft",
  })

  const { data: goalReached, isLoading: isLoadingGoalReached } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: crowdfundingABI,
    functionName: "goalReached",
  })

  const { data: fundsWithdrawn, isLoading: isLoadingFundsWithdrawn } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: crowdfundingABI,
    functionName: "fundsWithdrawn",
  })

  const { data: userContribution, isLoading: isLoadingUserContribution } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: crowdfundingABI,
    functionName: "contributions",
    args: [address || "0x0000000000000000000000000000000000000000"],
  })

  // Write contract functions
  const { data: contributeHash, writeContract: contribute, isPending: isContributePending } = useWriteContract()
  const { data: withdrawHash, writeContract: withdraw, isPending: isWithdrawPending } = useWriteContract()
  const { data: refundHash, writeContract: refund, isPending: isRefundPending } = useWriteContract()

  // Wait for transaction receipts
  const { isLoading: isConfirmingContribute } = useWaitForTransactionReceipt({
    hash: contributeHash,
  })

  const { isLoading: isConfirmingWithdraw } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  })

  const { isLoading: isConfirmingRefund } = useWaitForTransactionReceipt({
    hash: refundHash,
  })

  // Handle contributions
  const handleContribute = () => {
    if (!contributionAmount) return

    try {
      const amount = parseEther(contributionAmount)

      contribute({
        address: contractAddress as `0x${string}`,
        abi: crowdfundingABI,
        functionName: "contribute",
        value: amount,
      })

      toast({
        title: "Contribution submitted",
        description: "Your transaction is being processed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit contribution.",
        variant: "destructive",
      })
    }
  }

  // Handle owner withdrawal
  const handleWithdraw = () => {
    withdraw({
      address: contractAddress as `0x${string}`,
      abi: crowdfundingABI,
      functionName: "withdraw",
    })

    toast({
      title: "Withdrawal submitted",
      description: "Your transaction is being processed.",
    })
  }

  // Handle refund
  const handleRefund = () => {
    refund({
      address: contractAddress as `0x${string}`,
      abi: crowdfundingABI,
      functionName: "refund",
    })

    toast({
      title: "Refund requested",
      description: "Your transaction is being processed.",
    })
  }

  // Calculate progress percentage
  const progressPercentage = goal && totalContributed ? (Number(totalContributed) * 100) / Number(goal) : 0

  // Format deadline
  const formatDeadline = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Format time left
  const formatTimeLeft = (seconds: bigint) => {
    const days = Number(seconds) / 86400
    const hours = (Number(seconds) % 86400) / 3600
    const minutes = (Number(seconds) % 3600) / 60

    if (days >= 1) {
      return `${Math.floor(days)} days, ${Math.floor(hours)} hours`
    } else if (hours >= 1) {
      return `${Math.floor(hours)} hours, ${Math.floor(minutes)} minutes`
    } else {
      return `${Math.floor(minutes)} minutes`
    }
  }

  // Check if campaign is active
  const isCampaignActive = timeLeft ? Number(timeLeft) > 0 && !goalReached : false

  // Check if user can get refund
  const canGetRefund =
    userContribution && Number(userContribution) > 0 && timeLeft && Number(timeLeft) === 0 && goalReached === false

  // Check if owner can withdraw
  const canWithdraw =
    address &&
    owner &&
    address.toLowerCase() === owner.toLowerCase() &&
    goalReached === true &&
    fundsWithdrawn === false

  const isLoading =
    isLoadingOwner ||
    isLoadingGoal ||
    isLoadingDeadline ||
    isLoadingTotal ||
    isLoadingTimeLeft ||
    isLoadingGoalReached ||
    isLoadingFundsWithdrawn ||
    isLoadingUserContribution

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 py-4">
        <div className="container flex justify-between items-center">
          <Logo />
          <ConnectButton />
        </div>
      </header>

      <div className="container max-w-5xl py-8 px-4 md:px-6 flex-1">
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
            <h1 className="text-3xl font-bold">Campaign Details</h1>
            <Sparkles className="h-5 w-5 text-pump-yellow" />
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">Contract</div>
            <p className="text-muted-foreground text-sm break-all">{contractAddress}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
            </div>
          </div>
        ) : (
          <>
            <Card className="mb-8 bg-card border border-border/60">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  {goalReached ? (
                    <div className="px-3 py-1 rounded-full bg-pump-green/20 text-pump-green text-sm font-medium flex items-center">
                      <span className="mr-1">🎉</span> Goal reached!
                    </div>
                  ) : Number(timeLeft) > 0 ? (
                    <div className="px-3 py-1 rounded-full bg-pump-blue/20 text-pump-blue text-sm font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> Campaign active
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-sm font-medium flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" /> Campaign ended
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {goal && totalContributed
                        ? `${formatEther(totalContributed)} / ${formatEther(goal)} ETH`
                        : "0 / 0 ETH"}
                    </span>
                  </div>
                  <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pump-green to-pump-blue"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoCard
                    icon={<Clock className="h-5 w-5 text-pump-blue" />}
                    title="Time Remaining"
                    value={timeLeft && Number(timeLeft) > 0 ? formatTimeLeft(timeLeft) : "Campaign ended"}
                  />
                  <InfoCard
                    icon={<Target className="h-5 w-5 text-pump-green" />}
                    title="Funding Goal"
                    value={goal ? `${formatEther(goal)} ETH` : "0 ETH"}
                  />
                  <InfoCard
                    icon={<Users className="h-5 w-5 text-pump-purple" />}
                    title="Your Contribution"
                    value={userContribution ? `${formatEther(userContribution)} ETH` : "0 ETH"}
                  />
                </div>

                {deadline && (
                  <div className="text-sm text-muted-foreground">
                    <span>Deadline: {formatDeadline(deadline)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contribute Section */}
              <Card className="bg-card border border-border/60 overflow-hidden">
                <div className="p-4 border-b border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-pump-green" />
                    <h3 className="font-semibold">Contribute to Campaign</h3>
                  </div>
                  <TrendingUp className="h-4 w-4 text-pump-green" />
                </div>
                <CardContent className="p-6">
                  {!address ? (
                    <div className="text-center py-4">
                      <p className="mb-4 text-muted-foreground">Connect your wallet to contribute</p>
                      <ConnectButton />
                    </div>
                  ) : isCampaignActive ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pump-green to-pump-blue rounded-lg blur opacity-30"></div>
                        <div className="relative flex items-center space-x-2 p-0.5 rounded-lg">
                          <Input
                            type="number"
                            placeholder="Amount in ETH"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            disabled={isContributePending || isConfirmingContribute}
                            className="bg-background border-muted"
                          />
                          <Button
                            onClick={handleContribute}
                            disabled={!contributionAmount || isContributePending || isConfirmingContribute}
                            className="bg-pump-green hover:bg-pump-green/90 text-black"
                          >
                            {isContributePending || isConfirmingContribute ? "Processing..." : "Contribute"}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Contribute ETH to support this campaign. Your funds will be held in the smart contract.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-6">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mr-2" />
                      <p className="text-muted-foreground">Campaign is no longer active</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions Section */}
              <Card className="bg-card border border-border/60 overflow-hidden">
                <div className="p-4 border-b border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-pump-blue" />
                    <h3 className="font-semibold">Campaign Actions</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  {!address ? (
                    <div className="text-center py-4">
                      <p className="mb-4 text-muted-foreground">Connect your wallet to perform actions</p>
                      <ConnectButton />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {canWithdraw && (
                        <div>
                          <p className="mb-2 text-sm text-muted-foreground">
                            As the campaign owner, you can withdraw the funds now.
                          </p>
                          <Button
                            onClick={handleWithdraw}
                            disabled={isWithdrawPending || isConfirmingWithdraw}
                            className="w-full bg-pump-green hover:bg-pump-green/90 text-black"
                          >
                            {isWithdrawPending || isConfirmingWithdraw ? "Processing..." : "Withdraw Funds"}
                          </Button>
                        </div>
                      )}

                      {canGetRefund && (
                        <div>
                          <p className="mb-2 text-sm text-muted-foreground">
                            The campaign didn't reach its goal. You can request a refund.
                          </p>
                          <Button
                            onClick={handleRefund}
                            disabled={isRefundPending || isConfirmingRefund}
                            className="w-full bg-pump-blue hover:bg-pump-blue/90 text-black"
                          >
                            {isRefundPending || isConfirmingRefund ? "Processing..." : "Request Refund"}
                          </Button>
                        </div>
                      )}

                      {!canWithdraw && !canGetRefund && (
                        <div className="flex items-center justify-center py-6">
                          <p className="text-muted-foreground">No actions available</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <div className="text-muted-foreground text-sm">© 2025 crowd.fun | All rights reserved</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/60 bg-muted/20">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}
