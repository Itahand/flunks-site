// Test script to manually set and check favorite flunk in localStorage
// Run this in browser console to test the favorites system

console.log('🔧 Testing Favorites System...');

// Test data for a sample favorite flunk
const testFavorite = {
  tokenId: "123",
  serialNumber: "456",
  name: "Test Geek Flunk",
  imageUrl: "https://images.flunks.xyz/flunks/123.png",
  pixelUrl: "https://images.flunks.xyz/pixels/123.png",
  clique: "GEEK",
  walletAddress: "0x123abc..." // Use your actual wallet address
};

// Function to manually set a favorite
function setTestFavorite() {
  try {
    localStorage.setItem('flunks_favorite', JSON.stringify(testFavorite));
    console.log('✅ Test favorite set in localStorage:', testFavorite);
    return true;
  } catch (error) {
    console.error('❌ Failed to set test favorite:', error);
    return false;
  }
}

// Function to check current favorite
function checkCurrentFavorite() {
  try {
    const stored = localStorage.getItem('flunks_favorite');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📱 Current favorite in localStorage:', parsed);
      return parsed;
    } else {
      console.log('📭 No favorite found in localStorage');
      return null;
    }
  } catch (error) {
    console.error('❌ Error reading favorite:', error);
    return null;
  }
}

// Function to clear favorites
function clearFavorites() {
  localStorage.removeItem('flunks_favorite');
  console.log('🗑️ Cleared favorites from localStorage');
}

// Run the test
console.log('1. Checking current favorite...');
checkCurrentFavorite();

console.log('2. Setting test favorite...');
setTestFavorite();

console.log('3. Verifying test favorite was set...');
checkCurrentFavorite();

console.log('🎯 Test complete! You can now refresh the page and check if the favorite appears in My Locker');
console.log('💡 To clear test data, run: clearFavorites()');

// Make functions available globally for manual testing
window.setTestFavorite = setTestFavorite;
window.checkCurrentFavorite = checkCurrentFavorite;
window.clearFavorites = clearFavorites;
