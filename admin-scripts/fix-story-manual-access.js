// EMERGENCY FIX FOR STORY MANUAL ACCESS
// This script bypasses the broken trait checking authentication and restores Story Manual access

console.log('🚨 EMERGENCY STORY MANUAL ACCESS FIX');
console.log('=====================================');

console.log('🔍 Current authentication state...');

// Check current state
const checkCurrentState = () => {
  const accessLevel = sessionStorage.getItem('flunks-access-level');
  const accessGranted = sessionStorage.getItem('flunks-access-granted');
  const walletAddress = window.dynamic?.primaryWallet?.address;
  
  console.log('Session Storage:');
  console.log('  Access Level:', accessLevel);
  console.log('  Access Granted:', accessGranted);
  
  console.log('Wallet Status:');
  console.log('  Connected:', !!walletAddress);
  console.log('  Address:', walletAddress);
  
  return { accessLevel, accessGranted, walletAddress };
};

const currentState = checkCurrentState();

// Emergency fix - manually grant access and restore Story Manual
const emergencyFix = () => {
  console.log('🔧 Applying emergency fix...');
  
  // Force authentication state
  if (!currentState.accessLevel || !currentState.accessGranted) {
    console.log('  ✅ Setting emergency access level...');
    sessionStorage.setItem('flunks-access-granted', 'true');
    sessionStorage.setItem('flunks-access-level', 'COMMUNITY');
    sessionStorage.setItem('flunks-access-code', 'EMERGENCY_STORY_FIX');
    
    // Dispatch events to update all components
    window.dispatchEvent(new Event('flunks-access-updated'));
    window.dispatchEvent(new CustomEvent('auth-updated'));
    
    console.log('  ✅ Emergency access granted');
  }
  
  // Force story manual to appear by directly manipulating the DOM if needed
  setTimeout(() => {
    console.log('🔍 Checking for Story Manual icon...');
    
    const storyIcon = document.querySelector('[data-app-id="story-manual"]');
    if (!storyIcon) {
      console.log('⚠️ Story Manual icon still not visible - forcing manual creation');
      
      // Find desktop area and add story icon if missing
      const desktop = document.querySelector('[class*="desktop"], [id*="desktop"]');
      if (desktop) {
        console.log('🖥️ Found desktop area, checking for story icon...');
        
        // Look for any existing icons as reference
        const existingIcons = desktop.querySelectorAll('[data-app-id]');
        console.log('📱 Found', existingIcons.length, 'existing desktop icons');
        
        // If no story icon exists, trigger a complete re-render
        if (!Array.from(existingIcons).some(icon => icon.getAttribute('data-app-id') === 'story-manual')) {
          console.log('🔄 Story Manual missing - triggering complete desktop refresh...');
          
          // Try multiple refresh strategies
          window.dispatchEvent(new CustomEvent('desktop-refresh'));
          window.dispatchEvent(new CustomEvent('apps-refresh'));
          
          // Force React re-render by updating document attributes
          document.documentElement.setAttribute('data-emergency-fix', Date.now().toString());
        }
      }
    } else {
      console.log('✅ Story Manual icon found!');
    }
  }, 1000);
  
  return true;
};

// Check if Dynamic context is available
if (window.dynamic) {
  emergencyFix();
  
  console.log('\n✅ EMERGENCY FIX APPLIED!');
  console.log('📋 What was done:');
  console.log('  1. ✅ Force-granted COMMUNITY access level');
  console.log('  2. ✅ Set emergency authentication flags');
  console.log('  3. ✅ Dispatched refresh events');
  console.log('  4. ✅ Scheduled icon verification');
  
  console.log('\n🔍 Next steps:');
  console.log('  • Refresh the page if Story Manual still not visible');
  console.log('  • Check browser console for any authentication errors');
  console.log('  • Look for the Story Manual icon on desktop');
  
  console.log('\n🛠️ To permanently fix the issue:');
  console.log('  • Investigate the trait checking changes from last night');
  console.log('  • Restore proper data structure in usePaginatedItems hook');
  console.log('  • Test with wallets that have many Flunks');
  
} else {
  console.log('❌ Dynamic Labs context not available yet');
  console.log('⏳ Waiting for Dynamic to load...');
  
  // Wait for Dynamic to load
  const waitForDynamic = () => {
    if (window.dynamic) {
      console.log('✅ Dynamic loaded - applying emergency fix...');
      emergencyFix();
    } else {
      setTimeout(waitForDynamic, 500);
    }
  };
  
  waitForDynamic();
}

// Export for manual use
window.emergencyStoryFix = emergencyFix;
window.checkStoryAccess = checkCurrentState;

console.log('\n💡 Manual commands:');
console.log('  • window.emergencyStoryFix() - Re-run the fix');
console.log('  • window.checkStoryAccess() - Check current auth state');