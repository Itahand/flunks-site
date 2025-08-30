// Check for weekly objectives completion table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    // Try to query a few known tables to see what exists
    const tables = [
      'weekly_objectives_completed',
      'semester_zero_completed', 
      'objectives_completed',
      'user_achievements',
      'cafeteria_button_clicks',
      'digital_lock_attempts'
    ];

    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (!error) {
          console.log(`✅ Table "${tableName}" exists`);
          if (data && data.length > 0) {
            console.log(`   Sample columns:`, Object.keys(data[0]));
          }
        } else if (error.code === '42P01') {
          console.log(`❌ Table "${tableName}" does not exist`);
        } else {
          console.log(`⚠️ Table "${tableName}" - Error:`, error.message);
        }
      } catch (err) {
        console.log(`⚠️ Table "${tableName}" - Exception:`, err.message);
      }
    }
  } catch (error) {
    console.error('General error:', error);
  }
}

checkTables();
