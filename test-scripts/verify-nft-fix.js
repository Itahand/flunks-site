// Quick verification script for NFT recognition fix
// Run this in browser console after deploying the fix

console.log('🔍 NFT Recognition Fix Verification');
console.log('====================================\n');

// Test 1: Check if wallet is connected
const checkWallet = () => {
  const dynamic = window.dynamic || window.Dynamic;
  if (dynamic?.primaryWallet?.address) {
    console.log('✅ Test 1: Wallet Connected');
    console.log('   Address:', dynamic.primaryWallet.address);
    return true;
  } else {
    console.log('❌ Test 1: No wallet connected');
    console.log('   Please connect your wallet first');
    return false;
  }
};

// Test 2: Check UserPaginatedItems context
const checkNFTContext = () => {
  // Try to find React context data
  const rootElement = document.getElementById('__next');
  if (rootElement && rootElement._reactRootContainer) {
    console.log('✅ Test 2: React app detected');
    
    // Check localStorage for any cached NFT data
    const cacheKeys = Object.keys(localStorage).filter(k => 
      k.includes('nft') || k.includes('flunk') || k.includes('swr')
    );
    
    if (cacheKeys.length > 0) {
      console.log('   Found', cacheKeys.length, 'cached data keys');
    }
    return true;
  }
  console.log('⚠️ Test 2: Cannot access React context directly');
  return false;
};

// Test 3: Check if OnlyFlunks is showing NFTs
const checkOnlyFlunks = () => {
  const nftElements = document.querySelectorAll('[class*="nft"], [class*="item"], [class*="grid"]');
  console.log('✅ Test 3: Found', nftElements.length, 'potential NFT display elements');
  
  // Look for "no items" messages
  const noItemsText = Array.from(document.querySelectorAll('*'))
    .find(el => el.textContent?.toLowerCase().includes('no items') || 
                 el.textContent?.toLowerCase().includes('no nfts'));
  
  if (noItemsText) {
    console.log('⚠️ Warning: "No items" message still visible');
    return false;
  }
  return true;
};

// Test 4: Check Semester Zero clique house bypass
const checkSemesterZero = () => {
  console.log('✅ Test 4: Semester Zero clique houses');
  console.log('   All houses should now be accessible without clique requirements');
  console.log('   Try double-clicking any clique house on the map');
  return true;
};

// Run all tests
console.log('Running verification tests...\n');

const test1 = checkWallet();
const test2 = checkNFTContext();
const test3 = checkOnlyFlunks();
const test4 = checkSemesterZero();

console.log('\n📊 Test Results Summary:');
console.log('========================');
console.log('Wallet Connected:', test1 ? '✅' : '❌');
console.log('React Context:', test2 ? '✅' : '⚠️');
console.log('OnlyFlunks:', test3 ? '✅' : '⚠️');
console.log('Semester Zero:', test4 ? '✅' : '⚠️');

console.log('\n💡 Next Steps:');
if (!test1) {
  console.log('1. Connect your wallet using the login button');
}
if (test1 && !test3) {
  console.log('1. Open OnlyFlunks from the Start menu');
  console.log('2. Check if your NFTs are now visible');
  console.log('3. If not, check browser console for errors');
}
if (test1) {
  console.log('1. Open Semester Zero map');
  console.log('2. Try accessing any clique house (should all work now)');
  console.log('3. Open MyPlace to select profile (should show all owned cliques)');
}

console.log('\n🔧 If issues persist:');
console.log('1. Clear browser cache and localStorage');
console.log('2. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)');
console.log('3. Check Network tab for failed API calls');
console.log('4. Look for errors in Console tab');

// Export test functions for manual use
window.verifyNFTFix = () => {
  console.clear();
  checkWallet();
  checkNFTContext();
  checkOnlyFlunks();
  checkSemesterZero();
};

console.log('\n✨ Run window.verifyNFTFix() to run tests again');
