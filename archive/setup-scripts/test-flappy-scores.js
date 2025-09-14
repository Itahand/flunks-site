// Test Flappy Flunk Score Submission
// This script will test if the score submission system is working

const testFlappyScore = async () => {
  console.log('🧪 Testing Flappy Flunk Score Submission...');
  
  // Test data
  const testWallet = '0x1234567890abcdef'; // Mock wallet address
  const testScore = 17;
  
  try {
    const response = await fetch('/api/flappyflunk-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: testWallet,
        score: testScore
      })
    });
    
    const responseText = await response.text();
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('📊 Response Body:', responseText);
    
    if (response.ok) {
      console.log('✅ Score submission successful!');
      
      // Now test the leaderboard
      const leaderboardResponse = await fetch('/api/flappyflunk-leaderboard');
      const leaderboardData = await leaderboardResponse.json();
      console.log('🏆 Leaderboard data:', leaderboardData);
      
    } else {
      console.error('❌ Score submission failed:', response.status, responseText);
    }
    
  } catch (error) {
    console.error('💥 Error during score submission:', error);
  }
};

// Also test the table structure
const testTableStructure = async () => {
  console.log('🔍 Testing table structure...');
  
  try {
    const response = await fetch('/api/flappyflunk-leaderboard');
    const data = await response.json();
    console.log('📋 Table structure test via leaderboard:', {
      status: response.status,
      dataType: typeof data,
      isArray: Array.isArray(data),
      sampleData: data?.slice?.(0, 3) || data
    });
  } catch (error) {
    console.error('💥 Error testing table structure:', error);
  }
};

// Run tests
testTableStructure();
setTimeout(() => testFlappyScore(), 1000);
