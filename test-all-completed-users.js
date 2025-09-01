// Test all users who completed both objectives to see if there's a pattern
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Import exact functions from frontend
async function checkCafeteriaObjective(walletAddress) {
  try {
    console.log('🔍 Checking cafeteria objective for wallet:', walletAddress);
    
    const cacheBreaker = Date.now();
    console.log('🕒 Cache breaker timestamp:', cacheBreaker);
    
    const { data, error } = await supabase
      .from('cafeteria_button_clicks')
      .select('*')
      .eq('wallet_address', walletAddress)
      .limit(1)
      .order('created_at', { ascending: false });

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
    
    const cacheBreaker = Date.now();
    console.log('🕒 Cache breaker timestamp:', cacheBreaker);
    
    const { data, error } = await supabase
      .from('digital_lock_attempts')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('code_entered', '8004')
      .eq('success', true)
      .limit(1)
      .order('created_at', { ascending: false });

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

async function testAllCompletedUsers() {
  console.log('🧪 TESTING ALL USERS WHO SHOULD HAVE BOTH OBJECTIVES COMPLETE');
  console.log('=' .repeat(70));
  
  // Get all cafeteria clicks
  const { data: cafeteriaData } = await supabase
    .from('cafeteria_button_clicks')
    .select('wallet_address')
    .order('created_at', { ascending: false });
    
  // Get all 8004 successes  
  const { data: codeData } = await supabase
    .from('digital_lock_attempts')
    .select('wallet_address')
    .eq('code_entered', '8004')
    .eq('success', true)
    .order('created_at', { ascending: false });
    
  // Find intersection
  const cafeteriaWallets = new Set(cafeteriaData?.map(d => d.wallet_address) || []);
  const codeWallets = new Set(codeData?.map(d => d.wallet_address) || []);
  const bothCompleted = [...cafeteriaWallets].filter(wallet => codeWallets.has(wallet));
  
  console.log(`👑 Found ${bothCompleted.length} users who should have both complete:`, bothCompleted.map(w => w.slice(0, 10) + '...'));
  
  // Test each user individually
  for (let i = 0; i < bothCompleted.length; i++) {
    const wallet = bothCompleted[i];
    console.log(`\n${i + 1}. Testing wallet: ${wallet.slice(0, 10)}...`);
    console.log('-'.repeat(50));
    
    const [cafeteriaResult, codeResult] = await Promise.all([
      checkCafeteriaObjective(wallet),
      checkCrackCodeObjective(wallet)
    ]);
    
    const bothTrue = cafeteriaResult && codeResult;
    const progress = bothTrue ? 100 : (cafeteriaResult ? 50 : 0) + (codeResult ? 50 : 0);
    
    console.log(`📊 Results: Cafeteria=${cafeteriaResult}, Code=${codeResult}, Progress=${progress}%`);
    
    if (bothTrue) {
      console.log('✅ Should see: "All Objectives Complete!" message');
    } else {
      console.log('❌ PROBLEM: Should have both but getting:', {cafeteriaResult, codeResult});
    }
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }
}

testAllCompletedUsers().catch(console.error);
