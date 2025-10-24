import * as fcl from "@onflow/fcl";

// Configure FCL for Flow mainnet
export const configureFlow = () => {
  fcl.config({
    "accessNode.api": "https://rest-mainnet.onflow.org", // Flow mainnet access node
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn", // Wallet discovery
    "0xFlowToken": "0x1654653399040a61", // Flow Token contract address on mainnet
    "app.detail.title": "Flunks",
    "app.detail.icon": "https://flunks.net/flunks-logo.png",
    "app.detail.url": "https://flunks.net",
    "flow.network": "mainnet", // Required for mobile wallet detection
    "walletconnect.projectId": process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "9b70cfa398b2355a5eb9b1cf99f4a981", // CRITICAL for mobile WalletConnect
  });

  console.log('🌊 FCL configured with WalletConnect support for mobile wallets');
};

// Initialize Flow configuration
configureFlow();

export { fcl };