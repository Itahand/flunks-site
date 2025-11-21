/**
 * Test if award_gum database function is working
 * Run: node test-award-gum-simple.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAwardGum() {
  console.log('🧪 Testing award_gum function...\n');
  
  const testWallet = '0xTEST' + Date.now();
  
  try {
    // Test with daily_checkin source
    console.log('📝 Testing daily_checkin source...');
    const { data, error } = await supabase.rpc('award_gum', {
      p_wallet_address: testWallet,
      p_source: 'daily_checkin',
      p_metadata: { test: true }
    });

    console.log('Result:', data);
    console.log('Error:', error);

    if (error) {
      console.log('\n❌ Database function has an error!');
      console.log('Error details:', error);
      return false;
    }

    if (data && data.length > 0) {
      const result = data[0];
      if (result.success) {
        console.log('\n✅ award_gum function is working!');
        console.log(`Earned: ${result.earned} GUM`);
        return true;
      } else {
        console.log('\n⚠️ Function returned success=false');
        console.log(`Error: ${result.error}`);
        return false;
      }
    }

    console.log('\n❓ Unexpected response format');
    return false;

  } catch (err) {
    console.error('\n💥 Exception:', err);
    return false;
  }
}

testAwardGum().then(success => {
  process.exit(success ? 0 : 1);
});
