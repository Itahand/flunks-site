// Add footballer_flunk_bonus gum source to database
// Run this to fix the "invalid or inactive gum source" error

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addFootballerGumSource() {
  console.log('🏈 Adding footballer_flunk_bonus gum source...');
  
  try {
    // Add the missing gum source
    const { data, error } = await supabase
      .from('gum_sources')
      .upsert({
        source_name: 'footballer_flunk_bonus',
        base_reward: 100,
        cooldown_minutes: 0, // No cooldown - it's a one-time claim
        daily_limit: 1, // Only once per day (but tracked separately in footballer_gum_claims)
        description: 'One-time 100 GUM bonus for owning Footballer Flunk NFT (Home or Away)',
        is_active: true
      }, {
        onConflict: 'source_name'
      });

    if (error) {
      console.error('❌ Error adding footballer gum source:', error);
      return;
    }

    console.log('✅ Footballer gum source added successfully!');

    // Verify all gum sources
    const { data: allSources, error: listError } = await supabase
      .from('gum_sources')
      .select('*')
      .order('source_name');

    if (listError) {
      console.error('Error listing sources:', listError);
      return;
    }

    console.log('\n📋 All available gum sources:');
    allSources.forEach(source => {
      console.log(`  - ${source.source_name}: ${source.base_reward} gum, ${source.cooldown_minutes}min cooldown, limit: ${source.daily_limit}`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

addFootballerGumSource();
