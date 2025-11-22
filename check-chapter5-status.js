require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCompletions() {
  console.log('🎸 HIDDEN RIFF COMPLETIONS (from gum_transactions)');
  console.log('='.repeat(60));
  
  // Check Hidden Riff completions
  const { data: hiddenRiffData, error: hiddenRiffError } = await supabase
    .from('gum_transactions')
    .select('wallet_address, amount, created_at, description')
    .eq('source', 'hidden_riff')
    .order('created_at', { ascending: false });
  
  if (hiddenRiffError) {
    console.error('Error:', hiddenRiffError);
  } else if (hiddenRiffData && hiddenRiffData.length > 0) {
    console.log(`\nTotal: ${hiddenRiffData.length} completion(s)\n`);
    hiddenRiffData.forEach((record, index) => {
      const date = new Date(record.created_at).toLocaleString();
      console.log(`${index + 1}. ${record.wallet_address}`);
      console.log(`   Amount: ${record.amount} GUM`);
      console.log(`   Date: ${date}`);
      console.log(`   Description: ${record.description || 'N/A'}`);
      console.log('');
    });
  } else {
    console.log('\n❌ No Hidden Riff completions found\n');
  }

  console.log('\n' + '='.repeat(60));
  console.log('🔑 ROOM 7 KEY HOLDERS (from paradise_motel_room7_keys)');
  console.log('='.repeat(60));
  
  // Check Room 7 key holders
  const { data: keyData, error: keyError } = await supabase
    .from('paradise_motel_room7_keys')
    .select('wallet_address, obtained_at')
    .order('obtained_at', { ascending: false });
  
  if (keyError) {
    console.error('Error:', keyError);
  } else if (keyData && keyData.length > 0) {
    console.log(`\nTotal: ${keyData.length} key holder(s)\n`);
    keyData.forEach((record, index) => {
      const date = new Date(record.obtained_at).toLocaleString();
      console.log(`${index + 1}. ${record.wallet_address}`);
      console.log(`   Date: ${date}`);
      console.log('');
    });
  } else {
    console.log('\n❌ No Room 7 key holders found\n');
  }
  
  console.log('='.repeat(60));
  console.log('\n📊 SUMMARY\n');
  console.log(`Hidden Riff completions: ${hiddenRiffData?.length || 0}`);
  console.log(`Room 7 key holders: ${keyData?.length || 0}`);
  
  // Check overlap
  if (hiddenRiffData && keyData && hiddenRiffData.length > 0 && keyData.length > 0) {
    const hiddenRiffWallets = new Set(hiddenRiffData.map(r => r.wallet_address));
    const keyWallets = new Set(keyData.map(r => r.wallet_address));
    
    const bothComplete = [...hiddenRiffWallets].filter(w => keyWallets.has(w));
    const onlyHiddenRiff = [...hiddenRiffWallets].filter(w => !keyWallets.has(w));
    const onlyKeys = [...keyWallets].filter(w => !hiddenRiffWallets.has(w));
    
    console.log(`\nBoth objectives complete: ${bothComplete.length}`);
    console.log(`Only Hidden Riff: ${onlyHiddenRiff.length}`);
    console.log(`Only Room 7 Key: ${onlyKeys.length}`);
    
    if (bothComplete.length > 0) {
      console.log('\n🏆 Users with BOTH completed:');
      bothComplete.forEach(wallet => console.log(`   ${wallet}`));
    }
  }
}

checkCompletions().catch(console.error);
