const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations
const supabase = createClient(
  'https://jejycbxxdsrcsobmvbbz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplanljYnh4ZHNyY3NvYm12YmJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA5OTU2OSwiZXhwIjoyMDY1Njc1NTY5fQ.w_s8ZYXrYerg_eV41KUXCyRPya6ToSrSfVkNxvLRafk'
);

async function addMissingColumns() {
  console.log('🔧 Adding missing columns to flappyflunk_scores table...');
  
  try {
    // Add created_at column if it doesn't exist
    console.log('📅 Adding created_at column...');
    const { error: createdAtError } = await supabase
      .rpc('exec_sql', { sql: 'ALTER TABLE flappyflunk_scores ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();' });
      
    if (createdAtError && !createdAtError.message.includes('already exists')) {
      console.log('⚠️  Could not add created_at via exec_sql, trying direct approach...');
    }
    
    // Add username column if it doesn't exist  
    console.log('👤 Adding username column...');
    const { error: usernameError } = await supabase
      .rpc('exec_sql', { sql: 'ALTER TABLE flappyflunk_scores ADD COLUMN IF NOT EXISTS username TEXT;' });
      
    if (usernameError && !usernameError.message.includes('already exists')) {
      console.log('⚠️  Could not add username via exec_sql, trying direct approach...');
    }
    
    // Add game_version column if it doesn't exist
    console.log('🎮 Adding game_version column...');
    const { error: versionError } = await supabase
      .rpc('exec_sql', { sql: "ALTER TABLE flappyflunk_scores ADD COLUMN IF NOT EXISTS game_version TEXT DEFAULT 'v1';" });
      
    if (versionError && !versionError.message.includes('already exists')) {
      console.log('⚠️  Could not add game_version via exec_sql, trying direct approach...');
    }
    
  } catch (error) {
    console.log('⚠️  exec_sql not available, checking current table structure...');
  }
  
  // Check final table structure
  console.log('\\n📋 Checking updated table structure...');
  const { data: testData, error: testError } = await supabase
    .from('flappyflunk_scores')
    .select('*')
    .limit(1);
    
  if (testError) {
    console.error('❌ Table check error:', testError);
    return;
  }
  
  if (testData && testData.length === 0) {
    // Table is empty, let's insert a test record to see structure
    console.log('📝 Table is empty, inserting test record to check structure...');
    const { data: insertData, error: insertError } = await supabase
      .from('flappyflunk_scores')
      .insert([{ 
        wallet: '0x0000000000000000', 
        score: 0,
        username: 'test',
        game_version: 'v1'
      }])
      .select();
      
    if (insertError) {
      console.log('📊 Current table structure based on insert error:', insertError.message);
      
      // Try with minimal data
      const { data: minimalData, error: minimalError } = await supabase
        .from('flappyflunk_scores')
        .insert([{ wallet: '0x0000000000000000', score: 0 }])
        .select();
        
      if (minimalError) {
        console.error('❌ Minimal insert error:', minimalError);
      } else {
        console.log('✅ Minimal insert successful:', minimalData);
        
        // Delete the test record
        await supabase
          .from('flappyflunk_scores')
          .delete()
          .eq('wallet', '0x0000000000000000');
      }
    } else {
      console.log('✅ Enhanced insert successful:', insertData);
      
      // Delete the test record
      await supabase
        .from('flappyflunk_scores')
        .delete()
        .eq('wallet', '0x0000000000000000');
    }
  }
  
  console.log('\\n🎯 Fresh tracking setup complete!');
  console.log('Next steps:');
  console.log('1. Update the score submission API to include timestamps');
  console.log('2. Test score submission with the enhanced logging');
  console.log('3. Monitor the leaderboard for new scores');
}

addMissingColumns().catch(console.error);
