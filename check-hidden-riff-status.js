/**
 * Check if hidden_riff exists for a wallet
 * Run: node check-hidden-riff-status.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkHiddenRiff() {
  const testWallet = '0xe327216d843357f1'; // Your wallet from logs
  
  console.log('🎸 Checking Hidden Riff status for:', testWallet);
  console.log('');
  
  try {
    // Check gum_transactions for hidden_riff source
    const { data: transactions, error } = await supabase
      .from('gum_transactions')
      .select('*')
      .eq('wallet_address', testWallet)
      .eq('source', 'hidden_riff')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 Found ${transactions?.length || 0} hidden_riff transactions\n`);
    
    if (transactions && transactions.length > 0) {
      console.log('✅ HIDDEN RIFF ALREADY COMPLETED!');
      console.log('Transaction details:');
      transactions.forEach((t, i) => {
        console.log(`\n${i + 1}. Completed at: ${t.created_at}`);
        console.log(`   Amount: ${t.amount} GUM`);
        console.log(`   Metadata:`, t.metadata);
      });
    } else {
      console.log('❌ No hidden_riff completion found');
      console.log('This wallet has NOT completed the Hidden Riff');
    }

  } catch (err) {
    console.error('\n💥 Exception:', err);
  }
}

checkHiddenRiff();
