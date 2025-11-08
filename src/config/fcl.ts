import { config } from "@onflow/fcl";
import "@onflow/fcl-wc";

// CRITICAL: Clear any cached testnet configuration from localStorage
// FCL caches config in localStorage, and old testnet settings can persist
if (typeof window !== 'undefined') {
  const fclKeys = Object.keys(localStorage).filter(key => key.startsWith('fcl:'));
  if (fclKeys.length > 0) {
    console.log('🧹 Clearing cached FCL config from localStorage:', fclKeys);
    fclKeys.forEach(key => {
      // Only clear if it contains testnet references
      const value = localStorage.getItem(key);
      if (value && (value.includes('testnet') || value.includes('rest-testnet') || value.includes('access-testnet'))) {
        console.log('⚠️ Removing testnet cache:', key);
        localStorage.removeItem(key);
      }
    });
  }
}

// Configure FCL for Flow mainnet
const FLOW_ACCESS_NODE = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || "https://rest-mainnet.onflow.org";
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "9b70cfa398b2355a5eb9b1cf99f4a981";

// Use current hostname for WalletConnect metadata
const APP_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : "https://flunks.net";

console.log('🌊 Configuring FCL with access node:', FLOW_ACCESS_NODE);
console.log('📱 WalletConnect Project ID:', WALLETCONNECT_PROJECT_ID ? 'Set ✅' : 'Missing ❌');
console.log('🌐 App URL:', APP_URL);

// Simplified FCL configuration following official Flow docs pattern
// The key: use REST mainnet URL and let FCL/wallet handle the rest
config({
  "flow.network": "mainnet",
  "accessNode.api": "https://rest-mainnet.onflow.org",
  
  // Discovery - use the non-versioned endpoints (no /api/mainnet)
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  
  // App details
  "app.detail.title": "Flunks",
  "app.detail.icon": "https://flunks.net/flunks-logo.png",
  "app.detail.url": APP_URL,
  
  // WalletConnect
  "walletconnect.projectId": WALLETCONNECT_PROJECT_ID,
  
  // Contracts
  "0xSemesterZero": "0x807c3d470888cc48",
  "0xFlunks": "0x807c3d470888cc48",
});

// Verify and log the actual configuration that will be used
if (typeof window !== 'undefined') {
  setTimeout(async () => {
    const actualAccessNode = await config().get('accessNode.api');
    const actualNetwork = await config().get('flow.network');
    const actualDiscoveryWallet = await config().get('discovery.wallet');
    const actualDiscoveryAuthn = await config().get('discovery.authn.endpoint');

    console.log('✅ FCL Configuration verified (Bypass Discovery Mode):', {
      accessNode: actualAccessNode,
      network: actualNetwork,
      expectedAccessNode: FLOW_ACCESS_NODE,
      expectedNetwork: 'mainnet',
      walletConnectConfigured: !!WALLETCONNECT_PROJECT_ID,
      discoveryWallet: actualDiscoveryWallet,
      discoveryAuthn: actualDiscoveryAuthn,
      mode: 'DIRECT_DAPPER_BYPASS'
    });

    // Alert if there's a mismatch (testnet detected)
    if (
      (typeof actualAccessNode === 'string' && actualAccessNode.includes('testnet')) || 
      actualNetwork === 'testnet' ||
      (typeof actualDiscoveryWallet === 'string' && actualDiscoveryWallet.includes('testnet')) ||
      (typeof actualDiscoveryAuthn === 'string' && actualDiscoveryAuthn.includes('testnet'))
    ) {
      console.error('❌ TESTNET DETECTED! Configuration override failed. Clearing all FCL cache...');
      Object.keys(localStorage)
        .filter(key => key.startsWith('fcl:'))
        .forEach(key => localStorage.removeItem(key));
      
      // Force reload to apply mainnet config
      alert('Testnet configuration detected. Clearing cache and reloading...');
      window.location.reload();
    }
  }, 100);
}
