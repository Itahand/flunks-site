/**
 * Check who has completed both Chapter 5 objectives
 * 
 * Slacker: Obtained Room 7 key from "See Round Back" sign at Paradise Motel (paradise_motel_room7_keys)
 * Overachiever: Hidden Riff guitar game (gum_transactions with source='hidden_riff')
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function query() {
  // Get all users who obtained the Room 7 key (Slacker complete)
  // Key is obtained by clicking "See Round Back" sign at Paradise Motel, appears in MyLocker
  const { data: slackerData, error: slackerError } = await supabase
    .from('paradise_motel_room7_keys')
    .select('wallet_address, obtained_at');
  
  if (slackerError) {
    console.error('Error fetching slacker data:', slackerError);
    return;
  }

  // Get all Hidden Riff completers (Overachiever complete)
  const { data: overachieverData, error: overachieverError } = await supabase
    .from('gum_transactions')
    .select('wallet_address, created_at')
    .eq('source', 'hidden_riff');
  
  if (overachieverError) {
    console.error('Error fetching overachiever data:', overachieverError);
    return;
  }

  // Create sets for easy lookup
  const slackerWallets = new Set(slackerData.map(r => r.wallet_address));
  const overachieverWallets = new Set(overachieverData.map(r => r.wallet_address));

  // Find wallets that completed BOTH
  const bothComplete = [...slackerWallets].filter(wallet => overachieverWallets.has(wallet));

  console.log('='.repeat(70));
  console.log('CHAPTER 5 COMPLETION STATUS');
  console.log('='.repeat(70));
  console.log('');
  console.log(`Slacker (Room 7 Key obtained): ${slackerData.length} users`);
  console.log(`Overachiever (Hidden Riff): ${overachieverData.length} users`);
  console.log('');
  console.log('='.repeat(70));
  console.log(`USERS WHO COMPLETED BOTH: ${bothComplete.length}`);
  console.log('='.repeat(70));
  console.log('');
  
  bothComplete.forEach((wallet, i) => {
    const slackerEntry = slackerData.find(r => r.wallet_address === wallet);
    const overachieverEntry = overachieverData.find(r => r.wallet_address === wallet);
    console.log(`${i+1}. ${wallet}`);
    if (slackerEntry) {
      console.log(`   Slacker (Key): ${new Date(slackerEntry.obtained_at).toLocaleString()}`);
    }
    if (overachieverEntry) {
      console.log(`   Overachiever: ${new Date(overachieverEntry.created_at).toLocaleString()}`);
    }
    console.log('');
  });
}

query();
