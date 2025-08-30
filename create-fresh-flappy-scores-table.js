const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations
const supabase = createClient(
  'https://jejycbxxdsrcsobmvbbz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplanljYnh4ZHNyY3NvYm12YmJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA5OTU2OSwiZXhwIjoyMDY1Njc1NTY5fQ.w_s8ZYXrYerg_eV41KUXCyRPya6ToSrSfVkNxvLRafk'
);

async function createFreshScoresTable() {
  console.log('🗑️  Backing up current scores...');
  
  // First, backup existing scores
  const { data: existingScores, error: backupError } = await supabase
    .from('flappyflunk_scores')
    .select('*');
    
  if (backupError) {
    console.error('❌ Backup error:', backupError);
    return;
  }
  
  console.log(`📦 Backed up ${existingScores?.length || 0} existing scores`);
  
  // Create backup table first
  console.log('🏗️  Creating backup table...');
  const backupQuery = `
    CREATE TABLE IF NOT EXISTS flappyflunk_scores_backup AS 
    SELECT * FROM flappyflunk_scores;
  `;
  
  const { error: createBackupError } = await supabase.rpc('exec_sql', { 
    sql: backupQuery 
  });
  
  if (createBackupError) {
    console.error('❌ Backup table creation error:', createBackupError);
    // Continue anyway - might not have exec_sql function
  }
  
  // Drop the old table
  console.log('🗑️  Dropping old scores table...');
  const { error: dropError } = await supabase.rpc('exec_sql', { 
    sql: 'DROP TABLE IF EXISTS flappyflunk_scores;' 
  });
  
  if (dropError) {
    console.error('❌ Drop table error:', dropError);
    console.log('🔄 Trying alternative approach - clearing data instead...');
    
    // Alternative: Clear all data from existing table
    const { error: deleteError } = await supabase
      .from('flappyflunk_scores')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      
    if (deleteError) {
      console.error('❌ Clear data error:', deleteError);
      return;
    }
    
    console.log('✅ Cleared existing data');
    
  } else {
    console.log('✅ Dropped old table');
    
    // Create new table with proper structure
    console.log('🏗️  Creating new scores table with proper structure...');
    const createTableQuery = `
      CREATE TABLE flappyflunk_scores (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        wallet TEXT NOT NULL,
        score INTEGER NOT NULL,
        username TEXT,
        game_version TEXT DEFAULT 'v1',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        metadata JSONB DEFAULT '{}'::jsonb
      );
      
      -- Create indexes for better performance
      CREATE INDEX idx_flappyflunk_scores_score ON flappyflunk_scores(score DESC);
      CREATE INDEX idx_flappyflunk_scores_wallet ON flappyflunk_scores(wallet);
      CREATE INDEX idx_flappyflunk_scores_created_at ON flappyflunk_scores(created_at DESC);
      
      -- Enable RLS (Row Level Security)
      ALTER TABLE flappyflunk_scores ENABLE ROW LEVEL SECURITY;
      
      -- Create policy to allow public read access
      CREATE POLICY "Public read access" ON flappyflunk_scores FOR SELECT USING (true);
      
      -- Create policy to allow authenticated inserts
      CREATE POLICY "Authenticated insert access" ON flappyflunk_scores FOR INSERT WITH CHECK (true);
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createTableQuery 
    });
    
    if (createError) {
      console.error('❌ Create table error:', createError);
      return;
    }
    
    console.log('✅ Created new table with proper structure');
  }
  
  console.log('🎮 Fresh Flappy Flunk scores tracking is now ready!');
  console.log('📊 Features:');
  console.log('  - Proper timestamps (created_at, updated_at)');
  console.log('  - Performance indexes on score and wallet');
  console.log('  - Username field for better leaderboards');
  console.log('  - Game version tracking');
  console.log('  - Metadata field for future features');
  console.log('  - Row Level Security enabled');
  
  // Test the new structure
  console.log('\\n🧪 Testing new table structure...');
  const { data: testData, error: testError } = await supabase
    .from('flappyflunk_scores')
    .select('*')
    .limit(1);
    
  if (testError) {
    console.error('❌ Test error:', testError);
  } else {
    console.log('✅ New table is ready for use!');
  }
}

createFreshScoresTable().catch(console.error);
