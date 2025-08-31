const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Import the same function that the WeeklyObjectives component uses
async function checkCrackCodeObjective(walletAddress) {
  try {
    console.log('🔍 Checking crack code objective for wallet:', walletAddress);
    const { data, error } = await supabase
      .from('digital_lock_attempts')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('code_entered', '8004')
      .eq('success', true)
      .limit(1);

    if (error) {
      console.error('Error checking crack code objective:', error);
      return false;
    }

    console.log('📊 Crack code data found (8004 success):', data);
    const hasCracked = data && data.length > 0;
    console.log('✅ Crack code objective completed:', hasCracked);
    return hasCracked;
  } catch (err) {
    console.error('Failed to check crack code objective:', err);
    return false;
  }
}

async function testSpecificWallets() {
  console.log('🧪 Testing overachiever objective for specific wallets...\n');
  
  // Get all wallets that successfully entered 8004
  const { data: successfulAttempts, error } = await supabase
    .from('digital_lock_attempts')
    .select('wallet_address, username, created_at')
    .eq('code_entered', '8004')
    .eq('success', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`🎯 Found ${successfulAttempts?.length || 0} successful 8004 entries\n`);
  
  // Test each wallet individually
  for (const attempt of successfulAttempts || []) {
    console.log(`\n🔍 Testing wallet: ${attempt.wallet_address?.slice(0,10)}... (${attempt.username || 'No username'})`);
    
    const isCompleted = await checkCrackCodeObjective(attempt.wallet_address);
    
    if (isCompleted) {
      console.log('   ✅ Overachiever objective should show as COMPLETED');
    } else {
      console.log('   ❌ Overachiever objective showing as NOT COMPLETED - SYNC ISSUE!');
    }
  }
}

testSpecificWallets().catch(console.error);
