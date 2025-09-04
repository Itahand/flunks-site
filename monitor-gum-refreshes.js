// 🔍 GUM REFRESH MONITOR
// Run this in browser console to monitor gum balance refresh frequency

console.log('🔍 Starting GUM refresh monitoring...');
console.log('This will track how often your GUM balance is being fetched');
console.log('='.repeat(60));

let refreshCount = 0;
let startTime = Date.now();
let lastRefreshTime = 0;

// Monitor API calls to gum-balance endpoint
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && url.includes('/api/gum-balance')) {
    refreshCount++;
    const now = Date.now();
    const timeSinceStart = ((now - startTime) / 1000).toFixed(1);
    const timeSinceLastRefresh = lastRefreshTime ? ((now - lastRefreshTime) / 1000).toFixed(1) : 'N/A';
    
    console.log(`📊 GUM Balance Refresh #${refreshCount}`);
    console.log(`   ⏱️  Time since start: ${timeSinceStart}s`);
    console.log(`   ⏱️  Time since last: ${timeSinceLastRefresh}s`);
    console.log(`   📈 Average frequency: ${(refreshCount / (now - startTime) * 1000 * 60).toFixed(1)} refreshes/minute`);
    console.log('');
    
    lastRefreshTime = now;
  }
  return originalFetch.apply(this, args);
};

// Also monitor console logs from GumProvider
const originalLog = console.log;
console.log = function(...args) {
  const message = args.join(' ');
  if (message.includes('🍬 GumProvider: Fetching balance for wallet:')) {
    console.log('🔄 GumProvider refresh detected');
  }
  return originalLog.apply(this, args);
};

// Summary every 60 seconds
setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000;
  const rate = (refreshCount / elapsed * 60).toFixed(1);
  console.log(`📈 Summary: ${refreshCount} refreshes in ${elapsed.toFixed(1)}s (${rate} per minute)`);
}, 60000);

console.log('✅ Monitor active! Check console for refresh tracking.');
console.log('💡 With optimizations, you should see refreshes every 2-5 minutes max');
