console.log('🚨 EMERGENCY STORY MANUAL ACCESS FIX - RUNNING...');

// Step 1: Force authentication access
sessionStorage.setItem('flunks-access-granted', 'true');
sessionStorage.setItem('flunks-access-level', 'COMMUNITY');
sessionStorage.setItem('flunks-access-code', 'EMERGENCY_STORY_FIX');

// Step 2: Dispatch all possible update events
window.dispatchEvent(new Event('flunks-access-updated'));
window.dispatchEvent(new CustomEvent('auth-updated'));
window.dispatchEvent(new CustomEvent('desktop-refresh'));

console.log('✅ Emergency fix applied! Session storage updated:');
console.log('  Access Granted:', sessionStorage.getItem('flunks-access-granted'));
console.log('  Access Level:', sessionStorage.getItem('flunks-access-level'));
console.log('  Access Code:', sessionStorage.getItem('flunks-access-code'));

console.log('🔄 Refreshing page in 2 seconds...');
setTimeout(() => {
  window.location.reload();
}, 2000);

// Also log current state for debugging
console.log('🔍 Current URL:', window.location.href);
console.log('🔍 Dynamic context:', window.dynamic ? 'Available' : 'Not available');
console.log('🔍 Wallet connected:', window.dynamic?.primaryWallet?.address || 'No wallet');

console.log('📋 INSTRUCTIONS:');
console.log('1. Wait for page to refresh automatically');
console.log('2. Look for Story Manual icon on desktop');
console.log('3. If still not visible, check browser console for errors');
console.log('4. Try connecting/disconnecting wallet if needed');