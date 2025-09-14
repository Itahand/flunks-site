const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jejycbxxdsrcsobmvbbz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplanljYnh4ZHNyY3NvYm12YmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTk1NjksImV4cCI6MjA2NTY3NTU2OX0.J14zg5h4W_d7SjTN97RbDqCmdAYS9q7x7ZoSxLz0dkE'
);

async function testAPIEndpoint() {
  console.log('🧪 Testing the enhanced Flappy Flunk score API...');
  
  // Test the API endpoint directly
  const testPayload = {
    wallet: '0xTESTWALLET123',
    score: 17,
    username: 'TestPlayer'
  };
  
  console.log('📤 Testing API submission...');
  
  try {
    const response = await fetch('https://flunks-public-npfdt32pc-flunks-projects.vercel.app/api/flappyflunk-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API submission successful:', result);
      
      // Check if it appears in the database
      console.log('\\n📖 Checking database for the submitted score...');
      const { data: checkData, error: checkError } = await supabase
        .from('flappyflunk_scores')
        .select('*')
        .eq('wallet', '0xTESTWALLET123');
        
      if (checkError) {
        console.error('❌ Database check error:', checkError);
      } else if (checkData && checkData.length > 0) {
        console.log('✅ Score found in database:', checkData[0]);
      } else {
        console.log('❌ Score not found in database');
      }
      
      // Test leaderboard API
      console.log('\\n🏆 Testing leaderboard API...');
      const leaderboardResponse = await fetch('https://flunks-public-npfdt32pc-flunks-projects.vercel.app/api/flappyflunk-leaderboard');
      const leaderboardData = await leaderboardResponse.json();
      
      if (leaderboardResponse.ok) {
        console.log('✅ Leaderboard API working:', leaderboardData.slice(0, 3));
      } else {
        console.error('❌ Leaderboard API error:', leaderboardData);
      }
      
      // Clean up test data
      console.log('\\n🧹 Cleaning up test data...');
      await supabase
        .from('flappyflunk_scores')
        .delete()
        .eq('wallet', '0xTESTWALLET123');
        
      console.log('✅ Test completed successfully!');
      
    } else {
      console.error('❌ API submission failed:', result);
    }
    
  } catch (error) {
    console.error('❌ API test error:', error);
  }
}

testAPIEndpoint().catch(console.error);
