// Script to clear Halloween GumDrop cooldown for a specific wallet
// Usage: node clear-halloween-cooldown.mjs <wallet-address>

import { createClient } from '@supabase/supabase-js';

const walletAddress = process.argv[2];

if (!walletAddress) {
  console.error('❌ Error: Please provide a wallet address');
  console.error('Usage: node clear-halloween-cooldown.mjs <wallet-address>');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log(`🗑️ Clearing Halloween GumDrop cooldown for wallet: ${walletAddress}`);

try {
  // Delete the gum transaction record for halloween_pumpkin_button
  const { error } = await supabase
    .from('gum_transactions')
    .delete()
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('source', 'halloween_pumpkin_button');

  if (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }

  console.log('✅ Successfully cleared Halloween GumDrop cooldown');
  console.log('💡 You can now claim the GumDrop again!');
  
} catch (error) {
  console.error('💥 Unexpected error:', error.message);
  process.exit(1);
}

process.exit(0);
