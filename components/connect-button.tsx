"use client"

import type React from "react"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  // Use the first available connector (which should be injected/MetaMask)
  const connector = connectors[0]

  if (isConnected) {
    return (
      <Button
        variant="outline"
        onClick={() => disconnect()}
        className="border-pump-blue text-pump-blue hover:bg-pump-blue/10"
      >
        <LogOut className="h-4 w-4 mr-2" />
        {formatAddress(address || "")}
      </Button>
    )
  }

  return (
    <Button
      onClick={() => connect({ connector })}
      disabled={isPending}
      className="bg-pump-green hover:bg-pump-green/90 text-black flex items-center gap-2"
    >
      {isPending ? "Connecting..." : "Connect MetaMask"}
    </Button>
  )
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
