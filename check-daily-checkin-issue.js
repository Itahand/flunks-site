require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnose() {
  console.log('🔍 DAILY CHECK-IN DIAGNOSTIC\n');
  console.log('='.repeat(60));
  
  const testWallet = '0xTEST_' + Date.now();
  
  // Step 1: Check if daily_checkin source exists
  console.log('\n1️⃣ Checking if daily_checkin source exists...');
  const { data: sources, error: sourcesError } = await supabase
    .from('gum_sources')
    .select('*')
    .eq('source_name', 'daily_checkin');
  
  if (sourcesError) {
    console.error('❌ Error checking sources:', sourcesError);
    return;
  }
  
  if (!sources || sources.length === 0) {
    console.log('❌ daily_checkin source NOT FOUND in database!');
    console.log('\n🔧 FIX: Run this SQL in Supabase:');
    console.log(`
INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description, is_active) 
VALUES ('daily_checkin', 15, 1440, 15, 'Manual daily check-in button in locker', true)
ON CONFLICT (source_name) DO NOTHING;
    `);
    return;
  }
  
  console.log('✅ daily_checkin source exists:', sources[0]);
  
  // Step 2: Test the award_gum function
  console.log('\n2️⃣ Testing award_gum function...');
  const { data: awardResult, error: awardError } = await supabase.rpc('award_gum', {
    p_wallet_address: testWallet,
    p_source: 'daily_checkin',
    p_metadata: { test: true, timestamp: new Date().toISOString() }
  });
  
  if (awardError) {
    console.error('❌ award_gum function error:', awardError);
    console.log('\n🔧 FIX: The award_gum function may need to be updated.');
    console.log('Run the SQL from: sql-migrations/fix-award-gum-function.sql');
    return;
  }
  
  console.log('📋 award_gum result:', awardResult);
  
  // RPC returns an array, get first element
  const result = Array.isArray(awardResult) ? awardResult[0] : awardResult;
  
  if (!result || !result.success) {
    console.log('❌ Function returned success=false');
    console.log('Error:', result?.error);
    return;
  }
  
  console.log('✅ Function worked! Earned:', result.earned, 'GUM');
  
  // Step 3: Check if transaction was recorded
  console.log('\n3️⃣ Checking if transaction was recorded...');
  const { data: transactions, error: txError } = await supabase
    .from('gum_transactions')
    .select('*')
    .eq('wallet_address', testWallet)
    .eq('source', 'daily_checkin');
  
  if (txError) {
    console.error('❌ Error checking transactions:', txError);
    return;
  }
  
  if (!transactions || transactions.length === 0) {
    console.log('❌ No transaction recorded in gum_transactions!');
    console.log('🔧 The award_gum function may not be inserting into gum_transactions correctly.');
    return;
  }
  
  console.log('✅ Transaction recorded:', transactions[0]);
  
  // Step 4: Check if balance was updated
  console.log('\n4️⃣ Checking if balance was updated...');
  const { data: balance, error: balanceError } = await supabase
    .from('user_gum_balances')
    .select('*')
    .eq('wallet_address', testWallet);
  
  if (balanceError) {
    console.error('❌ Error checking balance:', balanceError);
    return;
  }
  
  if (!balance || balance.length === 0) {
    console.log('❌ No balance record created!');
    console.log('🔧 The award_gum function may not be updating user_gum_balances correctly.');
    return;
  }
  
  console.log('✅ Balance updated:', balance[0]);
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ALL CHECKS PASSED!');
  console.log('\nThe daily check-in system is working correctly in the database.');
  console.log('If users still can\'t claim, the issue might be:');
  console.log('1. Frontend not calling the API correctly');
  console.log('2. Users already claimed today (check cooldown)');
  console.log('3. Browser cache issue');
  
  // Cleanup test data
  console.log('\n🧹 Cleaning up test data...');
  await supabase.from('gum_transactions').delete().eq('wallet_address', testWallet);
  await supabase.from('user_gum_balances').delete().eq('wallet_address', testWallet);
  console.log('✅ Test data cleaned up');
}

diagnose().catch(console.error);
