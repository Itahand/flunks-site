const { createClient } = require('@supabase/supabase-js');

// Test script to check flappyflunk_scores table
async function testFlappyFlunkTable() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('🔍 Testing Flappy Flunk table...');
  
  try {
    // Test 1: Check if table exists by querying it
    console.log('📋 Testing table read access...');
    const { data: existingScores, error: readError } = await supabase
      .from('flappyflunk_scores')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.error('❌ Table read error:', readError);
      return;
    }
    
    console.log('✅ Table exists! Current scores:', existingScores);
    
    // Test 2: Try to insert a test score
    console.log('📝 Testing score insertion...');
    const testScore = {
      wallet: '0x1234567890abcdef',
      score: 17
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('flappyflunk_scores')
      .insert([testScore])
      .select();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
    } else {
      console.log('✅ Score inserted successfully:', insertData);
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('flappyflunk_scores')
        .delete()
        .eq('wallet', '0x1234567890abcdef');
      
      if (deleteError) {
        console.warn('⚠️ Cleanup warning:', deleteError);
      } else {
        console.log('🧹 Test data cleaned up');
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testFlappyFlunkTable();
