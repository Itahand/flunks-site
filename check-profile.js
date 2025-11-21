/**
 * Check if profile exists for wallet
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfile() {
  const testWallet = '0xce09dd43888d99574'; // From your screenshot
  
  console.log('🔍 Checking profile for wallet:', testWallet);
  console.log('');
  
  try {
    // Check with 0x prefix (get all, not single)
    const { data: profile1, error: error1 } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', testWallet);

    console.log('With 0x prefix:', profile1 && profile1.length > 0 ? `✅ Found ${profile1.length} profile(s)` : '❌ Not found');
    if (profile1 && profile1.length > 0) {
      console.log('Profiles:', profile1);
    }
    if (error1) {
      console.log('Error:', error1.message);
    }

    console.log('');

    // Check without 0x prefix
    const withoutPrefix = testWallet.replace('0x', '');
    const { data: profile2, error: error2 } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', withoutPrefix)
      .single();

    console.log('Without 0x prefix:', profile2 ? '✅ Found' : '❌ Not found');
    if (profile2) {
      console.log('Profile:', profile2);
    }
    if (error2) {
      console.log('Error:', error2.message);
    }

  } catch (err) {
    console.error('💥 Exception:', err);
  }
}

checkProfile();
