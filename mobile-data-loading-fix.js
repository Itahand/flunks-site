// MOBILE DATA LOADING FIX
// Comprehensive fix for mobile NFT data loading issues

console.log('🔧 MOBILE DATA LOADING FIX');
console.log('==========================');

// Step 1: Force refresh all data contexts
const forceDataRefresh = async () => {
  console.log('🔄 Step 1: Force refreshing all data contexts...');
  
  // Clear any cached data that might be stale
  try {
    // Clear SWR cache if available
    if (window.SWRConfig) {
      const { mutate } = window.SWRConfig;
      if (mutate) {
        mutate(() => true, undefined, { revalidate: true });
        console.log('  ✅ SWR cache cleared');
      }
    }
  } catch (e) {
    console.log('  ⚠️ SWR cache clear failed:', e);
  }
  
  // Force React context refresh
  window.dispatchEvent(new CustomEvent('forceDataRefresh'));
  
  console.log('  ✅ Data refresh triggered');
};

// Step 2: Check and fix blockchain connection
const checkBlockchainConnection = async () => {
  console.log('🔗 Step 2: Checking blockchain connection...');
  
  const walletAddress = window.dynamic?.primaryWallet?.address;
  if (!walletAddress) {
    console.log('  ❌ No wallet connected');
    return { connected: false };
  }
  
  console.log('  ✅ Wallet connected:', walletAddress);
  
  // Test blockchain connection with a simple query
  try {
    const fcl = window.fcl || require('@onflow/fcl');
    
    // Simple test query to check blockchain connectivity
    const testScript = `
      access(all) fun main(): String {
        return "connected"
      }
    `;
    
    const result = await fcl.send([fcl.script(testScript)]).then(fcl.decode);
    
    if (result === "connected") {
      console.log('  ✅ Blockchain connection working');
      return { connected: true, walletAddress };
    } else {
      console.log('  ❌ Blockchain connection issue');
      return { connected: false, walletAddress };
    }
  } catch (error) {
    console.log('  ❌ Blockchain connection error:', error);
    return { connected: false, walletAddress, error: error.message };
  }
};

// Step 3: Manual NFT data fetch
const manualNFTFetch = async (walletAddress) => {
  console.log('📊 Step 3: Manual NFT data fetch...');
  
  if (!walletAddress) {
    console.log('  ❌ No wallet address provided');
    return null;
  }
  
  try {
    const fcl = window.fcl || require('@onflow/fcl');
    
    // Use the same script as UserPaginatedItems context
    const nftScript = `
      import HybridCustodyHelper from 0x807c3d470888cc48

      access(all) fun main(address: Address): {String: [UInt64]} {
        let flunksTokenIds = HybridCustodyHelper.getFlunksTokenIDsFromAllLinkedAccounts(ownerAddress: address)
        let backpackTokenIds = HybridCustodyHelper.getBackpackTokenIDsFromAllLinkedAccounts(ownerAddress: address)

        return {
          "flunks": flunksTokenIds,
          "backpack": backpackTokenIds
        }
      }
    `;
    
    const result = await fcl.send([
      fcl.script(nftScript),
      fcl.args([fcl.arg(walletAddress, fcl.t.Address)])
    ]).then(fcl.decode);
    
    console.log('  ✅ NFT data fetched:', result);
    
    const flunksCount = result?.flunks?.length || 0;
    const backpacksCount = result?.backpack?.length || 0;
    
    console.log(`  📊 Found: ${flunksCount} Flunks, ${backpacksCount} Backpacks`);
    
    return {
      flunks: result?.flunks || [],
      backpack: result?.backpack || [],
      flunksCount,
      backpacksCount
    };
    
  } catch (error) {
    console.log('  ❌ NFT fetch error:', error);
    return null;
  }
};

// Step 4: Override React contexts with correct data
const overrideReactContexts = (nftData) => {
  console.log('⚛️ Step 4: Overriding React contexts with correct data...');
  
  if (!nftData) {
    console.log('  ❌ No NFT data to override with');
    return false;
  }
  
  // Set global flags with correct data
  window.MANUAL_NFT_DATA = nftData;
  window.FORCE_NFT_COUNT = nftData.flunksCount;
  window.FORCE_HAS_FLUNKS = nftData.flunksCount > 0;
  
  // Dispatch events that contexts might listen to
  window.dispatchEvent(new CustomEvent('nftDataOverride', {
    detail: nftData
  }));
  
  window.dispatchEvent(new CustomEvent('authStateChange', {
    detail: {
      hasFlunks: nftData.flunksCount > 0,
      flunksCount: nftData.flunksCount,
      backpacksCount: nftData.backpacksCount
    }
  }));
  
  console.log('  ✅ React context overrides set');
  return true;
};

// Step 5: Force UI re-render
const forceUIRerender = () => {
  console.log('🎨 Step 5: Forcing UI re-render...');
  
  // Multiple approaches to force React re-renders
  const methods = [
    () => window.dispatchEvent(new CustomEvent('resize')),
    () => window.dispatchEvent(new CustomEvent('orientationchange')),
    () => window.dispatchEvent(new CustomEvent('forceUpdate')),
    () => window.dispatchEvent(new CustomEvent('walletChanged')),
    () => {
      const event = new PopStateEvent('popstate', { state: {} });
      window.dispatchEvent(event);
    }
  ];
  
  methods.forEach((method, index) => {
    try {
      method();
      console.log(`  ✅ Re-render method ${index + 1} executed`);
    } catch (e) {
      console.log(`  ⚠️ Re-render method ${index + 1} failed:`, e);
    }
  });
  
  // Force React to re-evaluate components after a short delay
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('mobileDataFixed'));
  }, 100);
};

// Main fix function
const runMobileDataFix = async () => {
  console.log('🚀 Running complete mobile data loading fix...\n');
  
  // Step 1
  await forceDataRefresh();
  console.log('');
  
  // Step 2
  const blockchainStatus = await checkBlockchainConnection();
  console.log('');
  
  if (!blockchainStatus.connected) {
    console.log('❌ Cannot proceed - blockchain connection failed');
    return { success: false, reason: 'blockchain_connection_failed' };
  }
  
  // Step 3
  const nftData = await manualNFTFetch(blockchainStatus.walletAddress);
  console.log('');
  
  if (!nftData) {
    console.log('❌ Cannot proceed - NFT data fetch failed');
    return { success: false, reason: 'nft_fetch_failed' };
  }
  
  // Step 4
  const contextOverride = overrideReactContexts(nftData);
  console.log('');
  
  // Step 5
  forceUIRerender();
  console.log('');
  
  // Final summary
  console.log('📋 MOBILE DATA FIX COMPLETE');
  console.log('===========================');
  console.log('🔗 Blockchain Connected:', blockchainStatus.connected);
  console.log('🏠 Wallet Address:', blockchainStatus.walletAddress);
  console.log(`🎒 NFT Counts: ${nftData.flunksCount} Flunks, ${nftData.backpacksCount} Backpacks`);
  console.log('⚛️ Context Override:', contextOverride);
  
  if (nftData.flunksCount > 0) {
    console.log('\n✅ SUCCESS! You should now see:');
    console.log('  - Correct NFT count in OnlyFlunks');
    console.log('  - Access to Semester Zero map');
    console.log('  - Proper authentication recognition');
  } else {
    console.log('\n⚠️ WALLET HAS NO FLUNKS');
    console.log('  - The wallet is connected but has 0 Flunks');
    console.log('  - Semester Zero access requires at least 1 Flunk');
  }
  
  console.log('\n🔄 If issues persist, try:');
  console.log('1. Refresh the page (Cmd/Ctrl + R)');
  console.log('2. Run this script again: window.runMobileDataFix()');
  
  return {
    success: true,
    walletAddress: blockchainStatus.walletAddress,
    nftData,
    timestamp: new Date().toISOString()
  };
};

// Export for manual use
window.runMobileDataFix = runMobileDataFix;
window.forceDataRefresh = forceDataRefresh;

// Auto-run the fix
console.log('🎯 Auto-running mobile data fix in 2 seconds...');
setTimeout(runMobileDataFix, 2000);
