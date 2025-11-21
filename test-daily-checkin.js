/**
 * Test daily checkin function
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDailyCheckin() {
  const testWallet = '0xTEST_DAILY' + Date.now();
  
  console.log('🧪 Testing daily_checkin source...\n');
  
  try {
    const { data, error } = await supabase.rpc('award_gum', {
      p_wallet_address: testWallet,
      p_source: 'daily_checkin',
      p_metadata: { test: true, source: 'locker_checkin_button' }
    });

    console.log('Result:', data);
    console.log('Error:', error);

    if (data && data.length > 0) {
      const result = data[0];
      if (result.success) {
        console.log('\n✅ Daily check-in working!');
        console.log(`Earned: ${result.earned} GUM`);
        return true;
      } else {
        console.log('\n⚠️ Function returned success=false');
        console.log(`Error: ${result.error}`);
        return false;
      }
    }

  } catch (err) {
    console.error('\n💥 Exception:', err);
    return false;
  }
}

testDailyCheckin();
