// Quick fix for access gate issue
// Run this in browser console to bypass access gate

console.log('🔧 Flunks Access Fix Script');
console.log('============================');

// Clear all existing access data
sessionStorage.clear();

// Force grant access
sessionStorage.setItem('flunks-access-granted', 'true');
sessionStorage.setItem('flunks-access-level', 'BETA');
sessionStorage.setItem('flunks-access-code', 'DEVELOPMENT-BYPASS');

console.log('✅ Access granted! Reloading page...');

// Reload the page
window.location.reload();
