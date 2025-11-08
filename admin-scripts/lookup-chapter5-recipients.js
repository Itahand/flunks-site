/**
 * Lookup user profile information for eligible Chapter 5 NFT recipients
 * Shows usernames, profile data, and other identifying information
 * 
 * Usage: node admin-scripts/lookup-chapter5-recipients.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const eligibleWallets = [
  // Excluding 0x92629c2a389dd8a8 (tinkerbell - test account)
  '0x4ab2327b5e1f3ca1', // roto_flow
  '0x6e5d12b1735caa83', // CityofDreams
  '0xc4ab4a06ade1fd0f'  // Flunkster
];

async function lookupUserProfiles() {
  console.log('🔍 Looking up user profiles for eligible wallets...\n');
  console.log('═══════════════════════════════════════════════════════\n');
  
  for (const wallet of eligibleWallets) {
    console.log(`\n📍 Wallet: ${wallet}`);
    console.log('─────────────────────────────────────────────────────');
    
    // Check user_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', wallet)
      .single();
    
    if (profileData) {
      console.log('✅ User Profile Found:');
      console.log(`   Username: ${profileData.username || 'N/A'}`);
      console.log(`   Display Name: ${profileData.display_name || 'N/A'}`);
      console.log(`   Created: ${profileData.created_at || 'N/A'}`);
      if (profileData.timezone) console.log(`   Timezone: ${profileData.timezone}`);
      if (profileData.email) console.log(`   Email: ${profileData.email}`);
    } else {
      console.log('❌ No user_profiles entry found');
    }
    
    // Check paradise_motel_room7_visits for username
    const { data: room7Data, error: room7Error } = await supabase
      .from('paradise_motel_room7_visits')
      .select('*')
      .eq('wallet_address', wallet)
      .single();
    
    if (room7Data) {
      console.log('\n📍 Room 7 Visit Data:');
      console.log(`   Username: ${room7Data.username || 'Anonymous'}`);
      console.log(`   Visit Time: ${room7Data.visit_timestamp}`);
      console.log(`   GUM Awarded: ${room7Data.gum_amount}`);
    }
    
    // Check gum_transactions for any identifying info
    const { data: gumData, error: gumError } = await supabase
      .from('gum_transactions')
      .select('*')
      .eq('wallet_address', wallet)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (gumData && gumData.length > 0) {
      console.log('\n💰 Recent GUM Transactions:');
      gumData.forEach((tx, idx) => {
        console.log(`   ${idx + 1}. ${tx.source} - ${tx.amount} GUM (${new Date(tx.created_at).toLocaleDateString()})`);
      });
    }
    
    // Check wallet_connections for any auth info
    const { data: walletData, error: walletError } = await supabase
      .from('wallet_connections')
      .select('*')
      .eq('wallet_address', wallet)
      .single();
    
    if (walletData) {
      console.log('\n🔐 Wallet Connection:');
      console.log(`   Connected: ${walletData.created_at}`);
      console.log(`   Last Active: ${walletData.last_active || 'N/A'}`);
      if (walletData.email) console.log(`   Email: ${walletData.email}`);
    }
    
    console.log('\n─────────────────────────────────────────────────────');
  }
  
  console.log('\n═══════════════════════════════════════════════════════\n');
}

lookupUserProfiles()
  .then(() => {
    console.log('✅ Lookup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Lookup failed:', error);
    process.exit(1);
  });
