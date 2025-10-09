// Script to check Zoltar winners and verify they received their 250 GUM

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkZoltarWinners() {
  console.log('🔮 Checking Zoltar winners and their GUM rewards...\n');

  try {
    // 1. Check if the gum source exists
    console.log('1️⃣ Checking if zoltar_fortune_machine_win source exists...');
    const { data: sources, error: sourcesError } = await supabase
      .from('gum_sources')
      .select('*')
      .ilike('source_name', '%zoltar%');

    if (sourcesError) {
      console.error('❌ Error checking sources:', sourcesError);
      return;
    }

    console.log('📊 Zoltar-related gum sources:');
    sources.forEach(source => {
      console.log(`  - ${source.source_name}: ${source.base_reward} GUM, Daily Limit: ${source.daily_limit}, Active: ${source.is_active}`);
    });
    console.log('');

    // 2. Check all Zoltar-related transactions
    console.log('2️⃣ Checking Zoltar transactions...');
    const { data: transactions, error: txError } = await supabase
      .from('user_gum_transactions')
      .select('*')
      .or('source.ilike.%zoltar%')
      .order('created_at', { ascending: false })
      .limit(50);

    if (txError) {
      console.error('❌ Error checking transactions:', txError);
      return;
    }

    console.log(`📝 Found ${transactions.length} Zoltar-related transactions\n`);

    // Separate into plays and wins
    const plays = transactions.filter(t => t.source === 'zoltar_fortune_machine');
    const wins = transactions.filter(t => t.source === 'zoltar_fortune_machine_win');

    console.log('🎮 Zoltar Plays (cost 10 GUM each):');
    console.log(`  Total plays: ${plays.length}`);
    console.log(`  Total spent: ${plays.reduce((sum, t) => sum + Math.abs(t.amount), 0)} GUM\n`);

    console.log('🏆 Zoltar Wins (250 GUM each):');
    console.log(`  Total wins: ${wins.length}`);
    console.log(`  Total won: ${wins.reduce((sum, t) => sum + t.amount, 0)} GUM\n`);

    if (wins.length > 0) {
      console.log('🎊 Recent Winners:');
      wins.forEach((win, index) => {
        console.log(`  ${index + 1}. ${win.wallet_address.substring(0, 10)}... won ${win.amount} GUM on ${new Date(win.created_at).toLocaleString()}`);
      });
      console.log('');
    } else {
      console.log('⚠️  No winners found yet!\n');
    }

    // 3. Check for any failed transactions or issues
    console.log('3️⃣ Checking for potential issues...');
    
    // Check for plays without corresponding transactions
    const uniquePlayers = [...new Set(plays.map(t => t.wallet_address))];
    console.log(`👥 Unique players: ${uniquePlayers.length}`);

    // Calculate win rate
    const winRate = plays.length > 0 ? ((wins.length / plays.length) * 100).toFixed(2) : '0.00';
    const expectedWinRate = (1/30 * 100).toFixed(2);
    console.log(`📊 Actual win rate: ${winRate}% (Expected: ${expectedWinRate}%)`);

    if (parseFloat(winRate) < parseFloat(expectedWinRate) * 0.5 && plays.length > 50) {
      console.log('⚠️  Warning: Win rate seems lower than expected!');
    }

    // 4. Check cooldowns for Zoltar winners
    console.log('\n4️⃣ Checking cooldown records...');
    const { data: cooldowns, error: cooldownError } = await supabase
      .from('user_gum_cooldowns')
      .select('*')
      .eq('source_name', 'zoltar_fortune_machine_win');

    if (!cooldownError && cooldowns) {
      console.log(`📅 Cooldown records for wins: ${cooldowns.length}`);
      cooldowns.forEach(cd => {
        console.log(`  - ${cd.wallet_address.substring(0, 10)}... earned ${cd.daily_earned_amount} GUM today`);
      });
    }

    // 5. Verify balances of winners
    if (wins.length > 0) {
      console.log('\n5️⃣ Verifying winner balances...');
      const winnerWallets = [...new Set(wins.map(w => w.wallet_address))];
      
      for (const wallet of winnerWallets.slice(0, 5)) { // Check first 5 winners
        const { data: balance, error: balanceError } = await supabase
          .from('user_gum_balances')
          .select('total_gum')
          .eq('wallet_address', wallet)
          .single();

        if (!balanceError && balance) {
          console.log(`  ✅ ${wallet.substring(0, 10)}... current balance: ${balance.total_gum} GUM`);
        } else {
          console.log(`  ❌ ${wallet.substring(0, 10)}... balance not found!`);
        }
      }
    }

    console.log('\n✨ Zoltar check complete!');

  } catch (error) {
    console.error('❌ Error running Zoltar check:', error);
  }
}

// Run the check
checkZoltarWinners()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
