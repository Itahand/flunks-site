// MOBILE DATA LOADING DEBUG SCRIPT
// Run this in browser console on mobile to diagnose the data loading issues

console.log('📱 MOBILE DATA LOADING DEBUG');
console.log('============================');

// Check 1: Dynamic Context State
const checkDynamicContext = () => {
  console.log('🔍 Step 1: Dynamic Context Check');
  
  const dynamicState = {
    exists: !!window.dynamic,
    user: !!window.dynamic?.user,
    primaryWallet: !!window.dynamic?.primaryWallet,
    walletAddress: window.dynamic?.primaryWallet?.address,
    userAgent: navigator.userAgent
  };
  
  console.log('Dynamic State:', dynamicState);
  
  if (dynamicState.walletAddress) {
    console.log('✅ Wallet Connected:', dynamicState.walletAddress);
  } else {
    console.log('❌ No wallet detected');
  }
  
  return dynamicState;
};

// Check 2: React Context Data
const checkReactContexts = () => {
  console.log('\n🔍 Step 2: React Context Data Check');
  
  // Try to find React fiber with context data
  try {
    const rootElement = document.querySelector('[data-reactroot]') || document.querySelector('#__next');
    if (!rootElement) {
      console.log('❌ No React root element found');
      return {};
    }
    
    // Find React fiber
    const fiberKey = Object.keys(rootElement).find(key => key.startsWith('__reactFiber') || key.startsWith('__reactInternalFiber'));
    if (!fiberKey) {
      console.log('❌ No React fiber found');
      return {};
    }
    
    const fiber = rootElement[fiberKey];
    console.log('✅ React fiber found, searching for context data...');
    
    // Walk the React tree to find context values
    let current = fiber;
    let contextData = {};
    let attempts = 0;
    
    while (current && attempts < 100) {
      // Look for context providers with relevant data
      if (current.memoizedProps?.value || current.memoizedState) {
        const props = current.memoizedProps?.value || current.memoizedState;
        
        // Check for NFT data
        if (props?.flunksCount !== undefined) {
          contextData.flunksCount = props.flunksCount;
          contextData.backpacksCount = props.backpacksCount;
          console.log('📊 Found NFT counts - Flunks:', props.flunksCount, 'Backpacks:', props.backpacksCount);
        }
        
        // Check for paginated data
        if (props?.displayedItems) {
          contextData.displayedItems = props.displayedItems.length;
          console.log('📄 Found displayed items:', props.displayedItems.length);
        }
        
        // Check for authentication data
        if (props?.isAuthenticated !== undefined) {
          contextData.isAuthenticated = props.isAuthenticated;
          contextData.hasFlunks = props.hasFlunks;
          console.log('🔐 Found auth data - Authenticated:', props.isAuthenticated, 'Has Flunks:', props.hasFlunks);
        }
      }
      
      current = current.child || current.sibling || current.return;
      attempts++;
    }
    
    return contextData;
  } catch (error) {
    console.log('❌ Error reading React context:', error);
    return {};
  }
};

// Check 3: Network Requests
const checkNetworkActivity = () => {
  console.log('\n🔍 Step 3: Network Activity Check');
  
  // Monitor fetch requests for a few seconds
  const originalFetch = window.fetch;
  const networkCalls = [];
  
  window.fetch = async function(...args) {
    const url = args[0];
    networkCalls.push({ url, timestamp: Date.now() });
    console.log('🌐 Network call:', url);
    
    try {
      const response = await originalFetch.apply(this, args);
      console.log('✅ Response:', url, 'Status:', response.status);
      return response;
    } catch (error) {
      console.log('❌ Network error:', url, error);
      throw error;
    }
  };
  
  // Restore original fetch after 10 seconds
  setTimeout(() => {
    window.fetch = originalFetch;
    console.log('📊 Network activity summary:', networkCalls.length, 'calls');
  }, 10000);
  
  return { intercepted: true, calls: networkCalls };
};

// Check 4: Local Storage and Session Data
const checkStorageData = () => {
  console.log('\n🔍 Step 4: Storage Data Check');
  
  const storageData = {
    localStorage: {},
    sessionStorage: {}
  };
  
  // Check localStorage for relevant data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('dynamic') || key.includes('wallet') || key.includes('flunk') || key.includes('auth'))) {
      try {
        const value = localStorage.getItem(key);
        storageData.localStorage[key] = value ? JSON.parse(value) : value;
        console.log('💾 LocalStorage:', key, '→', typeof storageData.localStorage[key]);
      } catch (e) {
        storageData.localStorage[key] = localStorage.getItem(key);
      }
    }
  }
  
  // Check sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes('dynamic') || key.includes('wallet') || key.includes('flunk') || key.includes('auth'))) {
      try {
        const value = sessionStorage.getItem(key);
        storageData.sessionStorage[key] = value ? JSON.parse(value) : value;
        console.log('📂 SessionStorage:', key, '→', typeof storageData.sessionStorage[key]);
      } catch (e) {
        storageData.sessionStorage[key] = sessionStorage.getItem(key);
      }
    }
  }
  
  return storageData;
};

// Check 5: Mobile-specific issues
const checkMobileSpecificIssues = () => {
  console.log('\n🔍 Step 5: Mobile-specific Issues');
  
  const mobileInfo = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent),
    touchSupport: 'ontouchstart' in window,
    screenWidth: window.innerWidth,
    userAgent: navigator.userAgent,
    connectionType: navigator.connection?.effectiveType || 'unknown',
    serviceWorker: 'serviceWorker' in navigator
  };
  
  console.log('📱 Mobile Info:', mobileInfo);
  
  // Check for mobile-specific flags
  const mobileFlags = {
    FORCE_SHOW_ALL_WALLETS: window.FORCE_SHOW_ALL_WALLETS,
    MOBILE_WALLET_OVERRIDE: window.MOBILE_WALLET_OVERRIDE,
    DYNAMIC_MOBILE_MODE: window.DYNAMIC_MOBILE_MODE
  };
  
  console.log('🚩 Mobile Flags:', mobileFlags);
  
  return { mobileInfo, mobileFlags };
};

// Main diagnostic function
const runFullDiagnostic = async () => {
  console.log('🚀 Starting full mobile data loading diagnostic...\n');
  
  const results = {
    dynamic: checkDynamicContext(),
    reactContexts: checkReactContexts(),
    network: checkNetworkActivity(),
    storage: checkStorageData(),
    mobile: checkMobileSpecificIssues()
  };
  
  console.log('\n📋 DIAGNOSTIC SUMMARY');
  console.log('=====================');
  
  // Wallet connection
  if (results.dynamic.walletAddress) {
    console.log('✅ Wallet: Connected (' + results.dynamic.walletAddress + ')');
  } else {
    console.log('❌ Wallet: Not connected');
  }
  
  // NFT data
  if (results.reactContexts.flunksCount !== undefined) {
    console.log(`✅ NFT Data: ${results.reactContexts.flunksCount} Flunks, ${results.reactContexts.backpacksCount} Backpacks`);
  } else {
    console.log('❌ NFT Data: Not found in React context');
  }
  
  // Authentication
  if (results.reactContexts.isAuthenticated !== undefined) {
    console.log(`✅ Auth: Authenticated=${results.reactContexts.isAuthenticated}, Has Flunks=${results.reactContexts.hasFlunks}`);
  } else {
    console.log('❌ Auth: No authentication context found');
  }
  
  console.log('\n🎯 RECOMMENDED ACTIONS:');
  
  if (!results.dynamic.walletAddress) {
    console.log('1. ❌ Connect your wallet first');
  } else if (results.reactContexts.flunksCount === undefined) {
    console.log('1. ❌ NFT data not loading - check network requests');
    console.log('2. 🔄 Try refreshing the page');
  } else if (results.reactContexts.flunksCount === 0) {
    console.log('1. ❌ NFT count is 0 - wallet may not have Flunks');
    console.log('2. 🔄 Try manual refresh: window.location.reload()');
  } else {
    console.log('1. ✅ Everything looks normal - issue may be elsewhere');
  }
  
  return results;
};

// Auto-run the diagnostic
window.runMobileDiagnostic = runFullDiagnostic;
runFullDiagnostic();
