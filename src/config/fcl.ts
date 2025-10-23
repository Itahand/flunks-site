import { config } from "@onflow/fcl";

// Configure FCL for Flow mainnet
const FLOW_ACCESS_NODE = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || "https://rest-mainnet.onflow.org";
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "9b70cfa398b2355a5eb9b1cf99f4a981";

console.log('🌊 Configuring FCL with access node:', FLOW_ACCESS_NODE);
console.log('📱 WalletConnect Project ID:', WALLETCONNECT_PROJECT_ID ? 'Set ✅' : 'Missing ❌');

config({
  "accessNode.api": FLOW_ACCESS_NODE,
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn", // Mainnet wallet discovery
  "app.detail.title": "Flunks", // App name for wallet approval
  "app.detail.icon": "https://flunks.net/flunks-logo.png", // App icon
  "app.detail.url": "https://flunks.net",
  "challenge.handshake": "https://fcl-discovery.onflow.org/authn", // Mainnet wallet handshake
  "flow.network": "mainnet", // Important for mobile wallet detection
  "walletconnect.projectId": WALLETCONNECT_PROJECT_ID, // CRITICAL for mobile WalletConnect
  
  // MOBILE SPECIFIC: Force WalletConnect on mobile devices
  "discovery.wallet.method": "POP/RPC", // Use popup method which triggers WalletConnect on mobile
  
  // Enable ALL wallets from discovery service (don't filter)
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/authn",
  
  // TestPumpkinDrop420 contract (mainnet test deployment)
  "0xTestPumpkinDrop420": "0x807c3d470888cc48",
});

// Log final configuration
console.log('✅ FCL Configuration complete:', {
  accessNode: FLOW_ACCESS_NODE,
  network: 'mainnet',
  walletConnectConfigured: !!WALLETCONNECT_PROJECT_ID
});
