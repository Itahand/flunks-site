// Check Flappy Flunk table status
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkFlappyTables() {
  console.log('🕹️ CHECKING FLAPPY FLUNK TABLES');
  console.log('=' .repeat(50));
  
  const tables = ['flappy_scores', 'flappyflunk_scores', 'flappy_flunk_scores', 'game_scores'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (!error) {
        console.log(`✅ ${table}: EXISTS`);
        console.log(`   Records: ${data?.length || 0}`);
      } else {
        console.log(`❌ ${table}: ${error.message}`);
      }
    } catch (err) {
      console.log(`💥 ${table}: ${err.message}`);
    }
  }
}

checkFlappyTables().catch(console.error);
