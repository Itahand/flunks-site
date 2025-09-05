import { config } from "@onflow/fcl";

// Use environment variable for Flow network configuration
config({
  "accessNode.api": process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE,
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn", // Flow wallet discovery
  "app.detail.title": "Flunks", // App name for wallet approval
  "app.detail.icon": "https://flunks.net/flunks-logo.png", // App icon
  "challenge.handshake": "https://fcl-discovery.onflow.org/authn", // Wallet handshake endpoint
})

// Configure specific wallets for better mobile support
.put("discovery.wallet.method", "IFRAME/RPC")
.put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/api/authn")
.put("discovery.authn.include", [
  "0x82ec283f88a62e65", // Dapper Wallet
  "0x18eb4ee6b3c026d2", // Blocto
  "0x33f75ff0b830dcec", // Ledger  
  "0x33f75ff0b830dcec", // Flow Wallet (Lilico)
  "0xf086a545ce3c552d", // Finoa
  "0xf086a545ce3c552d", // NuFi
]);
