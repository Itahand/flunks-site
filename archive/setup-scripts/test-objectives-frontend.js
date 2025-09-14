const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Import the same functions used by the frontend
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

async function testObjectivesForUser() {
  // Test with one of the known successful wallets
  const testWallet = '0xe327216d843357f1'; // This wallet has successful 8004 entries
  
  console.log('🧪 Testing objectives system for wallet:', testWallet);
  console.log('=' .repeat(60));
  
  const status = await getWeeklyObjectivesStatus(testWallet);
  
  console.log('\n🎯 Final Results:');
  console.log('Cafeteria Clicked:', status.cafeteriaClicked);
  console.log('Code Cracked (8004):', status.crackedCode);
  console.log('\n📋 Objectives:');
  
  status.completedObjectives.forEach(obj => {
    const checkmark = obj.completed ? '✅' : '❌';
    console.log(`${checkmark} ${obj.title}: ${obj.description}`);
  });
  
  if (status.crackedCode) {
    console.log('\n🎉 This user SHOULD see the Overachiever objective with a green checkmark!');
  } else {
    console.log('\n⚠️  This user should NOT see the Overachiever objective completed');
  }
}

testObjectivesForUser().catch(console.error);
