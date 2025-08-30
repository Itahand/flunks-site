// Flappy Flunk Score Debugging Script
// Run this in browser console when playing Flappy Flunk

console.log('🎮 Flappy Flunk Score Debug Mode');

// Check if user is authenticated
import * as fcl from '@onflow/fcl';
fcl.currentUser().snapshot().then(user => {
  console.log('👤 User Auth Status:', {
    isLoggedIn: !!user?.addr,
    walletAddress: user?.addr,
    services: user?.services
  });
});

// Listen for score messages
window.addEventListener('message', (event) => {
  if (event.data?.type === 'FLAPPY_SCORE') {
    console.log('🏆 Score Message Received:', {
      score: event.data.score,
      timestamp: new Date().toISOString(),
      origin: event.origin
    });

    // Test API call
    fcl.currentUser().snapshot().then((user) => {
      const wallet = user?.addr;
      console.log('📮 Attempting to submit score:', {
        wallet,
        score: event.data.score,
        hasWallet: !!wallet
      });

      if (!wallet) {
        console.warn('⚠️ No wallet found - score will not be submitted');
        return;
      }

      fetch('/api/flappyflunk-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, score: event.data.score }),
      })
      .then(response => {
        console.log('✅ API Response Status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('✅ API Response Data:', data);
      })
      .catch(error => {
        console.error('❌ API Error:', error);
      });
    });
  }
});

console.log('Debug listener attached. Play the game to see score submission logs!');
