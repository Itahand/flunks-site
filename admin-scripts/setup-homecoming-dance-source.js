const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupHomecomingDanceGumSource() {
  console.log('🕺 Setting up homecoming dance GUM source...');
  
  try {
    // Insert the GUM source
    const { data: insertData, error: insertError } = await supabase
      .from('gum_sources')
      .upsert({
        source: 'chapter4_homecoming_dance',
        gum_amount: 50,
        cooldown_minutes: 525600, // 1 year (one-time reward)
        description: 'Chapter 4 Slacker - Homecoming Dance attendance'
      })
      .select();

    if (insertError) {
      console.error('❌ Error creating GUM source:', insertError);
      return;
    }

    console.log('✅ Homecoming dance GUM source created:', insertData);

    // Verify it exists
    const { data: verifyData, error: verifyError } = await supabase
      .from('gum_sources')
      .select('*')
      .eq('source', 'chapter4_homecoming_dance');

    if (verifyError) {
      console.error('❌ Error verifying source:', verifyError);
      return;
    }

    console.log('✅ Verification - Homecoming dance source:', verifyData);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupHomecomingDanceGumSource();