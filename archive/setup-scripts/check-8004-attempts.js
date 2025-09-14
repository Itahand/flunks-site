const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDigitalLockAttempts() {
  console.log('🔍 Checking digital_lock_attempts table...');
  
  const { data, error } = await supabase
    .from('digital_lock_attempts')
    .select('wallet_address, username, code_entered, success, created_at')
    .eq('code_entered', '8004')
    .eq('success', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('✅ Successful 8004 entries:', data?.length || 0);
  data?.forEach((attempt, i) => {
    console.log(`${i+1}. ${attempt.username || 'No username'} - ${attempt.wallet_address?.slice(0,8)}... - ${new Date(attempt.created_at).toLocaleString()}`);
  });
  
  // Also check all attempts to see if there are failed ones
  const { data: allAttempts, error: allError } = await supabase
    .from('digital_lock_attempts')
    .select('wallet_address, username, code_entered, success, created_at')
    .eq('code_entered', '8004')
    .order('created_at', { ascending: false });
    
  if (!allError) {
    console.log('\n📊 All 8004 attempts (success + failed):', allAttempts?.length || 0);
    const successful = allAttempts?.filter(a => a.success).length || 0;
    const failed = allAttempts?.filter(a => !a.success).length || 0;
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
  }
}

checkDigitalLockAttempts().catch(console.error);
