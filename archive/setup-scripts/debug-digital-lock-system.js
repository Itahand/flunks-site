const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDigitalLockSystem() {
  console.log('🔍 Checking digital lock system...');
  
  // Try to access the table directly
  try {
    const { data, error } = await supabase
      .from('digital_lock_attempts')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ digital_lock_attempts table error:', error.message);
      
      // Check if the table exists in a different way
      console.log('\n🔧 Checking if table needs to be created...');
      
      // Let's see what tables do exist
      const { data: tables, error: tablesError } = await supabase
        .rpc('exec', { 
          sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%lock%' OR table_name LIKE '%crack%' OR table_name LIKE '%attempt%';" 
        });
        
      if (!tablesError) {
        console.log('📋 Related tables found:', tables);
      }
      
    } else {
      console.log('✅ digital_lock_attempts table exists!');
      console.log('📊 Sample data:', data);
      
      // Get all 8004 attempts
      const { data: attempts8004, error: error8004 } = await supabase
        .from('digital_lock_attempts')
        .select('wallet_address, username, code_entered, success, created_at')
        .eq('code_entered', '8004')
        .order('created_at', { ascending: false });
        
      if (!error8004) {
        console.log('\n🎯 8004 Attempts:', attempts8004?.length || 0);
        if (attempts8004 && attempts8004.length > 0) {
          attempts8004.forEach((attempt, i) => {
            console.log(`${i+1}. ${attempt.username || 'No username'} - ${attempt.wallet_address?.slice(0,10)}... - Success: ${attempt.success} - ${new Date(attempt.created_at).toLocaleString()}`);
          });
        }
      }
    }
  } catch (err) {
    console.error('❌ System error:', err);
  }
}

checkDigitalLockSystem().catch(console.error);
