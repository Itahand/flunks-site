// Debug script to check favorites system
console.log('🔍 Debugging Favorites System...');

// Check localStorage
const storedFavorite = localStorage.getItem('flunks_favorite');
console.log('📱 localStorage flunks_favorite:', storedFavorite);

// Check all localStorage keys that might contain favorite data
const allKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('favorite')) {
    allKeys.push(key);
  }
}
console.log('🔑 All favorite-related localStorage keys:', allKeys);

// Check if FavoritesContext is working
if (typeof window !== 'undefined' && window.React) {
  console.log('⚛️ React is available');
} else {
  console.log('❌ React not available in global scope');
}

// Simple API test
async function testAPI() {
  try {
    const response = await fetch('/api/favorite-flunk?wallet_address=test123');
    const data = await response.json();
    console.log('🌐 API test response:', data);
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testAPI();
