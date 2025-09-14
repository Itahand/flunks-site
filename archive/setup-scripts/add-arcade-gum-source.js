const { createClient } = require('@supabase/supabase-js');

// Add arcade snack gum source via API
async function addArcadeSnackGumSource() {
  console.log('🎮 Adding arcade snack gum source...');
  
  // Use environment variables directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jejycbxxdsrcsobmvbbz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplanljYnh4ZHNyY3NvYm12YmJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA5OTU2OSwiZXhwIjoyMDY1Njc1NTY5fQ.w_s8ZYXrYerg_eV41KUXCyRPya6ToSrSfVkNxvLRafk';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Insert or update the arcade snack gum source
    const { data, error } = await supabase
      .from('gum_sources')
      .upsert({
        source_name: 'arcade_snack',
        base_reward: 20,
        cooldown_minutes: 1440, // 24 hours
        daily_limit: 1,
        description: 'Daily gum reward from visiting the arcade snack section',
        is_active: true
      }, {
        onConflict: 'source_name'
      });
    
    if (error) {
      console.error('❌ Error adding gum source:', error);
    } else {
      console.log('✅ Arcade snack gum source added successfully:', data);
    }
    
    // Verify it was added
    const { data: sources, error: fetchError } = await supabase
      .from('gum_sources')
      .select('*')
      .eq('source_name', 'arcade_snack');
    
    if (fetchError) {
      console.error('❌ Error fetching source:', fetchError);
    } else {
      console.log('🔍 Verification - arcade_snack source:', sources);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Load environment and run
require('dotenv').config({ path: '.env.local' });
addArcadeSnackGumSource();
