"use client"

import type React from "react"
import { WagmiProvider as Provider, createConfig, http } from "wagmi"
import { westendAssetHub } from "wagmi/chains"
import { metaMask } from "wagmi/connectors"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

// Create a simpler config that works in Next.js
const config = createConfig({
  chains: [westendAssetHub],
  transports: {
    [westendAssetHub.id]: http("https://westend-asset-hub-eth-rpc.polkadot.io"),
  },
  connectors: [
    metaMask({ chains: [westendAssetHub] }),
  ],
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}
