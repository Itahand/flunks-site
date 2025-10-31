// Manual Overachiever Objective Sync Fix
// Run this in browser console if your Overachiever objective isn't showing as complete

function forceObjectivesRefresh() {
  console.log('🔄 Forcing objectives refresh...');
  
  // Dispatch the codeAccessed event to trigger refresh
  window.dispatchEvent(new CustomEvent('codeAccessed', { 
    detail: { 
      walletAddress: 'manual-refresh',
      username: 'manual-refresh' 
    } 
  }));
  
  console.log('✅ Refresh event dispatched!');
  console.log('💡 Your objectives should update within 2-3 seconds');
  console.log('🔄 If still not working, try refreshing the page');
}

// Auto-run the refresh
forceObjectivesRefresh();

// Make function available globally for manual use
window.forceObjectivesRefresh = forceObjectivesRefresh;

console.log('💡 Function available as: window.forceObjectivesRefresh()');
