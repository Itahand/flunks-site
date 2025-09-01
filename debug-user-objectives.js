// Debug specific user who should have completed both objectives
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Copy the exact functions from weeklyObjectives.ts
async function checkCafeteriaObjective(walletAddress) {
  try {
    console.log('🔍 Checking cafeteria objective for wallet:', walletAddress);
    const { data, error } = await supabase
      .from('cafeteria_button_clicks')
      .select('*')
      .eq('wallet_address', walletAddress)
      .limit(1);

    if (error) {
      console.error('Error checking cafeteria objective:', error);
      return false;
    }

    console.log('📊 Cafeteria data found:', data);
    const hasClicked = data && data.length > 0;
    console.log('✅ Cafeteria objective completed:', hasClicked);
    return hasClicked;
  } catch (err) {
    console.error('Failed to check cafeteria objective:', err);
    return false;
  }
}

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

async function getWeeklyObjectivesStatus(walletAddress) {
  console.log('🎯 getWeeklyObjectivesStatus called for wallet:', walletAddress?.slice(0,10) + '...');
  
  const [cafeteriaClicked, crackedCode] = await Promise.all([
    checkCafeteriaObjective(walletAddress),
    checkCrackCodeObjective(walletAddress)
  ]);

  console.log('📊 Objectives status:', { cafeteriaClicked, crackedCode });

  const completedObjectives = [
    {
      id: 'slacker',
      title: 'The Slacker',
      description: 'Find and click the cafeteria button',
      type: 'cafeteria_click',
      completed: cafeteriaClicked,
      reward: 5
    },
    {
      id: 'overachiever',
      title: 'The Overachiever', 
      description: 'Crack the access code',
      type: 'crack_code',
      completed: crackedCode,
      reward: 10
    }
  ];

  return {
    cafeteriaClicked,
    crackedCode,
    completedObjectives
  };
}

function calculateObjectiveProgress(objectives) {
  if (objectives.length === 0) return 0;
  const completed = objectives.filter(obj => obj.completed).length;
  return Math.round((completed / objectives.length) * 100);
}

async function debugSpecificUser() {
  // Test with one of the users who SHOULD have both completed
  const testWallet = '0xe327216d843357f1'; // This wallet shows in both tables
  
  console.log('🐛 DEBUGGING USER WHO SHOULD HAVE BOTH OBJECTIVES COMPLETE');
  console.log('=' .repeat(70));
  console.log('Testing wallet:', testWallet);
  console.log('');
  
  // Step 1: Get the full status
  const status = await getWeeklyObjectivesStatus(testWallet);
  
  console.log('\n📋 FINAL OBJECTIVE STATUS:');
  status.completedObjectives.forEach((obj, index) => {
    const checkmark = obj.completed ? '✅' : '❌';
    console.log(`${index + 1}. ${checkmark} ${obj.title}: ${obj.description} (${obj.completed ? 'COMPLETE' : 'INCOMPLETE'})`);
  });
  
  // Step 2: Calculate progress
  const progress = calculateObjectiveProgress(status.completedObjectives);
  console.log(`\n🎯 Progress: ${progress}%`);
  
  // Step 3: Check if completion message should show
  console.log(`\n🎉 Should show "All Objectives Complete"? ${progress === 100 ? 'YES' : 'NO'}`);
  
  if (progress === 100) {
    console.log('✅ This user SHOULD see the green completion message!');
  } else {
    console.log('❌ This user will NOT see the completion message');
    console.log('   Missing objectives:', status.completedObjectives.filter(obj => !obj.completed).map(obj => obj.title));
  }

  // Step 4: Check raw database entries again
  console.log('\n🔍 RAW DATABASE VERIFICATION:');
  
  const { data: cafData } = await supabase
    .from('cafeteria_button_clicks')
    .select('*')
    .eq('wallet_address', testWallet);
    
  const { data: codeData } = await supabase
    .from('digital_lock_attempts')
    .select('*')
    .eq('wallet_address', testWallet)
    .eq('code_entered', '8004')
    .eq('success', true);
    
  console.log('Cafeteria records:', cafData?.length || 0);
  console.log('8004 success records:', codeData?.length || 0);
  
  if (cafData?.length > 0) {
    console.log('  Latest cafeteria click:', new Date(cafData[0].created_at).toLocaleString());
  }
  if (codeData?.length > 0) {
    console.log('  Latest 8004 success:', new Date(codeData[0].created_at).toLocaleString());
  }
}

debugSpecificUser().catch(console.error);
