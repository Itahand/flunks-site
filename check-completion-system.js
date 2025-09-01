// Comprehensive check of both objectives completion system
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCompletionSystem() {
  console.log('🎯 WEEKLY OBJECTIVES COMPLETION SYSTEM ANALYSIS');
  console.log('=' .repeat(70));
  
  // 1. Check who has completed Slacker objective
  console.log('\n1️⃣ SLACKER OBJECTIVE (Cafeteria Button Click):');
  const { data: cafeteriaData, error: cafeteriaError } = await supabase
    .from('cafeteria_button_clicks')
    .select('wallet_address, created_at')
    .order('created_at', { ascending: false });
  
  if (cafeteriaError) {
    console.log('❌ Error:', cafeteriaError.message);
  } else {
    console.log(`✅ Total users who clicked cafeteria: ${cafeteriaData?.length || 0}`);
    if (cafeteriaData?.length > 0) {
      console.log('Recent clicks:', cafeteriaData.slice(0, 5).map(d => ({
        wallet: d.wallet_address?.slice(0, 10) + '...',
        date: new Date(d.created_at).toLocaleDateString()
      })));
    }
  }

  // 2. Check who has completed Overachiever objective
  console.log('\n2️⃣ OVERACHIEVER OBJECTIVE (8004 Code Success):');
  const { data: codeData, error: codeError } = await supabase
    .from('digital_lock_attempts')
    .select('wallet_address, code_entered, success, created_at')
    .eq('code_entered', '8004')
    .eq('success', true)
    .order('created_at', { ascending: false });
  
  if (codeError) {
    console.log('❌ Error:', codeError.message);
  } else {
    console.log(`✅ Total users who cracked 8004: ${codeData?.length || 0}`);
    if (codeData?.length > 0) {
      console.log('Recent successes:', codeData.slice(0, 5).map(d => ({
        wallet: d.wallet_address?.slice(0, 10) + '...',
        date: new Date(d.created_at).toLocaleDateString()
      })));
    }
  }

  // 3. Find users who completed BOTH objectives
  console.log('\n🎉 USERS WHO COMPLETED BOTH OBJECTIVES:');
  if (cafeteriaData && codeData) {
    const cafeteriaWallets = new Set(cafeteriaData.map(d => d.wallet_address));
    const codeWallets = new Set(codeData.map(d => d.wallet_address));
    
    const bothCompleted = [...cafeteriaWallets].filter(wallet => codeWallets.has(wallet));
    
    console.log(`👑 Total users with BOTH objectives complete: ${bothCompleted.length}`);
    
    if (bothCompleted.length > 0) {
      console.log('\nUsers with 100% completion:');
      bothCompleted.forEach((wallet, index) => {
        console.log(`${index + 1}. ${wallet?.slice(0, 10)}...`);
      });
    }
  }

  // 4. Check if weekly_objectives_completed table is being used
  console.log('\n📊 WEEKLY_OBJECTIVES_COMPLETED TABLE STATUS:');
  const { data: completionData, error: completionError } = await supabase
    .from('weekly_objectives_completed')
    .select('*')
    .limit(10);
  
  if (completionError) {
    console.log('❌ Error:', completionError.message);
  } else {
    console.log(`📋 Records in completion table: ${completionData?.length || 0}`);
    if (completionData?.length > 0) {
      console.log('Sample records:', completionData.map(d => ({
        wallet: d.wallet_address?.slice(0, 10) + '...',
        completed: d.objectives_completed,
        allComplete: d.all_completed,
        timestamp: new Date(d.completion_timestamp).toLocaleDateString()
      })));
    } else {
      console.log('ℹ️ Table exists but is empty - completion is calculated dynamically');
    }
  }

  console.log('\n' + '=' .repeat(70));
  console.log('📝 SUMMARY:');
  console.log('- Objectives are calculated in REAL-TIME from individual tables');
  console.log('- No centralized completion tracking is currently active');
  console.log('- Green checkmarks appear when both tables have user records');
  console.log('- "All Objectives Complete" message shows at 100% progress');
}

checkCompletionSystem().catch(console.error);
