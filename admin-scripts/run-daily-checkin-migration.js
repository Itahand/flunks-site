/**
 * Run the daily checkin calendar day migration
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  const sql = fs.readFileSync('./sql-migrations/update-daily-checkin-calendar-day.sql', 'utf8');
  
  console.log('Running migration...');
  console.log('SQL length:', sql.length);
  
  // Supabase doesn't have direct SQL execution, so we need to run this in the dashboard
  // Let's at least update the description
  const { error } = await supabase
    .from('gum_sources')
    .update({ description: 'Manual daily check-in button in locker (resets at midnight UTC)' })
    .eq('source_name', 'daily_checkin');
  
  if (error) {
    console.error('Error updating description:', error);
  } else {
    console.log('Updated gum_sources description');
  }
  
  console.log('\n⚠️  Please run the full SQL migration in Supabase Dashboard:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor');
  console.log('4. Paste the contents of sql-migrations/update-daily-checkin-calendar-day.sql');
  console.log('5. Run the query');
}

runMigration();
