#!/usr/bin/env node

/**
 * Clear Testnet Cache Utility
 * 
 * This script helps clear any testnet configuration that might be cached
 * in localStorage by FCL. Run this in your browser console if you're 
 * experiencing testnet connection issues.
 */

console.log('🧹 Clearing FCL Testnet Cache...\n');

// Function to run in browser console
const clearFCLCache = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    console.error('❌ This script must be run in a browser console');
    return;
  }

  let cleared = 0;
  let total = 0;

  // Get all FCL-related keys
  const fclKeys = Object.keys(localStorage).filter(key => key.startsWith('fcl:'));
  total = fclKeys.length;

  console.log(`Found ${total} FCL cache entries\n`);

  fclKeys.forEach(key => {
    const value = localStorage.getItem(key);
    
    // Check if it contains testnet references
    if (value && (
      value.includes('testnet') || 
      value.includes('rest-testnet') || 
      value.includes('access-testnet') ||
      value.includes('access.devnet')
    )) {
      console.log(`🗑️  Removing: ${key}`);
      console.log(`   Value: ${value.substring(0, 100)}...`);
      localStorage.removeItem(key);
      cleared++;
    }
  });

  console.log(`\n✅ Cleared ${cleared} testnet cache entries`);
  console.log(`📊 ${total - cleared} mainnet entries preserved`);
  
  if (cleared > 0) {
    console.log('\n🔄 Please reload the page for changes to take effect');
    console.log('You can reload with: window.location.reload()');
  } else {
    console.log('\n✨ No testnet cache found - you\'re all set!');
  }
};

// Instructions for browser console
console.log('📋 BROWSER CONSOLE INSTRUCTIONS:');
console.log('================================\n');
console.log('Copy and paste the following function into your browser console:\n');
console.log(clearFCLCache.toString());
console.log('\nThen run it with:');
console.log('clearFCLCache()\n');
console.log('================================\n');

// If running in Node.js, just show instructions
if (typeof window === 'undefined') {
  console.log('💡 TIP: This is a browser script. Run it in your browser console at:');
  console.log('   https://flunks.net (or localhost:3000)\n');
  console.log('Alternatively, you can clear ALL browser data for the site:');
  console.log('   1. Open DevTools (F12)');
  console.log('   2. Go to Application tab');
  console.log('   3. Select "Clear storage" or "Local Storage"');
  console.log('   4. Click "Clear site data"\n');
}
