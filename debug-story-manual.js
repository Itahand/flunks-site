// Story Manual Debug Script
// Run this in the browser console when on localhost:3000

console.log('🔍 Story Manual Debug Check');

// Check if Story Manual is enabled in build mode
const checkBuildMode = () => {
  try {
    const buildMode = window.location.hostname === 'build.flunks.net' ? 'build' : 'public';
    console.log(`📋 Build Mode: ${buildMode}`);
    
    // Check environment variable
    const envBuildMode = process?.env?.NEXT_PUBLIC_BUILD_MODE;
    console.log(`🌍 ENV Build Mode: ${envBuildMode}`);
    
    return buildMode;
  } catch (error) {
    console.log('❌ Error checking build mode:', error);
    return 'unknown';
  }
};

// Check if Story Manual icon is visible
const checkStoryIcon = () => {
  const icons = document.querySelectorAll('[title*="Story"], [title*="story"]');
  console.log(`🎯 Found ${icons.length} story-related icons:`);
  icons.forEach((icon, index) => {
    console.log(`  ${index + 1}. ${icon.title || icon.textContent || 'No title'}`);
  });
  
  const storyModeIcon = document.querySelector('[title="Story Mode"]');
  if (storyModeIcon) {
    console.log('✅ Story Mode icon found!');
    console.log('📍 Icon position:', {
      visible: storyModeIcon.style.display !== 'none',
      opacity: storyModeIcon.style.opacity,
      zIndex: storyModeIcon.style.zIndex
    });
  } else {
    console.log('❌ Story Mode icon NOT found');
  }
};

// Check for Story Manual in DOM
const checkStoryManual = () => {
  const storyElements = document.querySelectorAll('*');
  let storyCount = 0;
  
  storyElements.forEach(el => {
    const text = el.textContent || '';
    if (text.includes('Story') && text.includes('Far')) {
      storyCount++;
      console.log('📖 Found story element:', el.tagName, text.substring(0, 50));
    }
  });
  
  console.log(`📊 Total story elements found: ${storyCount}`);
};

// Check access permissions
const checkAccess = () => {
  try {
    // Try to find wallet info
    const walletElements = document.querySelectorAll('[class*="wallet"], [class*="auth"]');
    console.log(`💳 Found ${walletElements.length} wallet-related elements`);
    
    // Check if user is connected
    const connectButtons = document.querySelectorAll('button');
    let hasConnectButton = false;
    connectButtons.forEach(btn => {
      if (btn.textContent?.toLowerCase().includes('connect')) {
        hasConnectButton = true;
        console.log('🔌 Connect button found:', btn.textContent);
      }
    });
    
    if (!hasConnectButton) {
      console.log('✅ No connect button found - user might be connected');
    }
  } catch (error) {
    console.log('❌ Error checking access:', error);
  }
};

// Run all checks
const runAllChecks = () => {
  console.log('🚀 Running Story Manual diagnostics...\n');
  
  checkBuildMode();
  console.log('');
  
  checkStoryIcon();
  console.log('');
  
  checkStoryManual();
  console.log('');
  
  checkAccess();
  console.log('');
  
  console.log('✅ Diagnostics complete!');
  console.log('\n💡 If Story Mode icon is missing:');
  console.log('   1. Check if wallet is connected');
  console.log('   2. Refresh the page');
  console.log('   3. Check browser console for errors');
};

// Auto-run diagnostics
runAllChecks();

// Export function for manual use
window.debugStoryManual = runAllChecks;
console.log('💡 Run debugStoryManual() to rerun these checks');