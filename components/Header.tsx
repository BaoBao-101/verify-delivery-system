"use client"
import { WalletConnect } from "./WalletConnect"
import { Heading } from "@radix-ui/themes"

export function Header() {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      padding: "1rem 2rem",
      background: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <Heading size="6">📦 Delivery System</Heading>
      <WalletConnect />
    </div>
  )
}
