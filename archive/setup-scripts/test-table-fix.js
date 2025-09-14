// Test the table mismatch fix - check crack_the_code table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testTableFix() {
  console.log('🔧 TESTING TABLE MISMATCH FIX');
  console.log('=' .repeat(50));
  
  // Check crack_the_code table (correct table)
  console.log('\n📝 CRACK_THE_CODE TABLE (where completions are actually saved):');
  const { data: correctData, error: correctError } = await supabase
    .from('crack_the_code')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (correctError) {
    console.log('❌ Error:', correctError.message);
  } else {
    const uniqueUsers = new Set(correctData?.map(d => d.wallet_address) || []).size;
    console.log(`✅ Total completions: ${correctData?.length || 0}`);
    console.log(`👤 Unique users: ${uniqueUsers}`);
    
    if (correctData?.length > 0) {
      console.log('\nRecent completions:');
      correctData.slice(0, 10).forEach((entry, i) => {
        console.log(`  ${i+1}. ${entry.wallet_address?.slice(0,12)}... on ${new Date(entry.created_at).toLocaleDateString()}`);
      });
    }
  }
  
  // Now check cafeteria overlaps with the CORRECT table
  console.log('\n🎯 RECALCULATING BOTH OBJECTIVES COMPLETE:');
  
  const { data: cafeteriaData } = await supabase
    .from('cafeteria_button_clicks')
    .select('wallet_address');
    
  if (correctData && cafeteriaData) {
    const crackWallets = new Set(correctData.map(d => d.wallet_address));
    const cafeteriaWallets = new Set(cafeteriaData.map(d => d.wallet_address));
    
    const bothComplete = [...crackWallets].filter(wallet => cafeteriaWallets.has(wallet));
    const onlyCode = [...crackWallets].filter(wallet => !cafeteriaWallets.has(wallet));
    const onlyCafeteria = [...cafeteriaWallets].filter(wallet => !crackWallets.has(wallet));
    
    console.log(`\n📊 CORRECTED COMPLETION STATS:`);
    console.log(`✅ Both Complete: ${bothComplete.length} users`);
    console.log(`🧠 Only Code (need cafeteria): ${onlyCode.length} users`);
    console.log(`👆 Only Cafeteria (need code): ${onlyCafeteria.length} users`);
    
    console.log(`\n👑 Users who should see completion (corrected):`)
    bothComplete.forEach((wallet, i) => {
      console.log(`  ${i+1}. ${wallet.slice(0,12)}...`);
    });
    
    if (onlyCode.length > 0) {
      console.log(`\n🧠 Code crackers who need to click cafeteria:`);
      onlyCode.slice(0, 5).forEach((wallet, i) => {
        console.log(`  ${i+1}. ${wallet.slice(0,12)}...`);
      });
    }
  }
}

testTableFix().catch(console.error);
