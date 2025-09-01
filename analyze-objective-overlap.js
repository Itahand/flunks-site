// Analyze the overlap between Slacker and Overachiever completions
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function analyzeObjectiveOverlap() {
  console.log('🔍 ANALYZING OBJECTIVE COMPLETION OVERLAP');
  console.log('=' .repeat(70));
  
  // Get all Slacker completions (cafeteria clicks)
  const { data: slackerData, error: slackerError } = await supabase
    .from('cafeteria_button_clicks')
    .select('wallet_address, created_at')
    .order('created_at', { ascending: false });
  
  // Get all Overachiever completions (8004 code success)
  const { data: overachieverData, error: overachieverError } = await supabase
    .from('digital_lock_attempts')
    .select('wallet_address, created_at')
    .eq('code_entered', '8004')
    .eq('success', true)
    .order('created_at', { ascending: false });
    
  if (slackerError || overachieverError) {
    console.error('Database errors:', { slackerError, overachieverError });
    return;
  }

  // Get unique wallets for each objective
  const slackerWallets = new Set(slackerData.map(d => d.wallet_address));
  const overachieverWallets = new Set(overachieverData.map(d => d.wallet_address));
  
  console.log(`\n📊 COMPLETION STATISTICS:`);
  console.log(`👆 Slacker (Cafeteria): ${slackerWallets.size} unique users`);
  console.log(`🧠 Overachiever (8004): ${overachieverWallets.size} unique users`);
  
  // Find overlap
  const bothCompleted = [...overachieverWallets].filter(wallet => slackerWallets.has(wallet));
  const onlySlacker = [...slackerWallets].filter(wallet => !overachieverWallets.has(wallet));
  const onlyOverachiever = [...overachieverWallets].filter(wallet => !slackerWallets.has(wallet));
  
  console.log(`\n🎯 OVERLAP ANALYSIS:`);
  console.log(`✅ Both Complete: ${bothCompleted.length} users`);
  console.log(`👆 Only Slacker: ${onlySlacker.length} users`);
  console.log(`🧠 Only Overachiever: ${onlyOverachiever.length} users`);
  
  console.log(`\n👑 USERS WITH BOTH OBJECTIVES (should see completion message):`);
  bothCompleted.forEach((wallet, index) => {
    console.log(`${index + 1}. ${wallet.slice(0, 12)}...`);
  });
  
  if (onlyOverachiever.length > 0) {
    console.log(`\n🧠 OVERACHIEVERS WHO DIDN'T CLICK CAFETERIA (missing Slacker):`);
    onlyOverachiever.forEach((wallet, index) => {
      console.log(`${index + 1}. ${wallet.slice(0, 12)}... (cracked 8004 but never clicked cafeteria)`);
    });
    console.log(`\nℹ️ These ${onlyOverachiever.length} users need to find and click the cafeteria button!`);
  }
  
  if (onlySlacker.length > 0) {
    console.log(`\n👆 SLACKERS WHO DIDN'T CRACK CODE (missing Overachiever):`);
    console.log(`Count: ${onlySlacker.length} users (clicked cafeteria but haven't cracked 8004)`);
    console.log(`ℹ️ These users need to enter the access code 8004 in the digital lock!`);
  }
  
  console.log(`\n📈 COMPLETION BREAKDOWN:`);
  console.log(`- Total unique participants: ${new Set([...slackerWallets, ...overachieverWallets]).size}`);
  console.log(`- Completion rate: ${Math.round((bothCompleted.length / new Set([...slackerWallets, ...overachieverWallets]).size) * 100)}%`);
}

analyzeObjectiveOverlap().catch(console.error);
