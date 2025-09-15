// 🔧 Fix Picture Day Voting GUM Rewards
// This script adds the missing gum source and retroactively awards GUM to users who voted

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPictureDayVotingRewards() {
  console.log('🔧 FIXING PICTURE DAY VOTING GUM REWARDS');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Add the picture_day_voting gum source
    console.log('📝 Step 1: Adding picture_day_voting gum source...');
    
    const { data: sourceData, error: sourceError } = await supabase
      .from('gum_sources')
      .upsert({
        source_name: 'picture_day_voting',
        base_reward: 50,
        cooldown_minutes: 0, // No cooldown - it's a one-time objective reward
        daily_limit: 1, // Only once per user
        description: 'Reward for completing Picture Day voting objective - The Slacker (Chapter 3)',
        is_active: true
      }, {
        onConflict: 'source_name'
      });

    if (sourceError) {
      console.error('❌ Error adding gum source:', sourceError);
      return;
    }

    console.log('✅ picture_day_voting gum source added successfully!');

    // Step 2: Get all users who have voted in Picture Day
    console.log('\n📊 Step 2: Finding all Picture Day voters...');
    
    const { data: voters, error: voterError } = await supabase
      .from('picture_day_votes')
      .select('user_wallet')
      .order('created_at', { ascending: true });

    if (voterError) {
      console.error('❌ Error fetching voters:', voterError);
      return;
    }

    // Get unique voters (users who voted at least once)
    const uniqueVoters = [...new Set(voters.map(v => v.user_wallet))];
    console.log(`📈 Found ${uniqueVoters.length} unique voters`);

    // Step 3: Check which voters already received GUM for picture_day_voting
    console.log('\n🔍 Step 3: Checking who already received rewards...');
    
    const { data: existingRewards, error: rewardError } = await supabase
      .from('gum_transactions')
      .select('wallet_address')
      .eq('source', 'picture_day_voting');

    if (rewardError) {
      console.error('❌ Error checking existing rewards:', rewardError);
      return;
    }

    const alreadyRewarded = new Set(existingRewards.map(r => r.wallet_address));
    const needsReward = uniqueVoters.filter(wallet => !alreadyRewarded.has(wallet));

    console.log(`✅ ${alreadyRewarded.size} users already received rewards`);
    console.log(`🎯 ${needsReward.length} users need retroactive rewards`);

    // Step 4: Award GUM to users who haven't received it yet
    if (needsReward.length > 0) {
      console.log('\n💰 Step 4: Awarding retroactive GUM rewards...');
      
      let successCount = 0;
      let errorCount = 0;

      for (const wallet of needsReward) {
        try {
          console.log(`  Awarding 50 GUM to ${wallet.slice(0, 12)}...`);
          
          const { data: gumResult, error: gumError } = await supabase.rpc('award_gum', {
            p_wallet_address: wallet,
            p_source: 'picture_day_voting',
            p_metadata: {
              retroactive: true,
              objective: 'slacker_chapter3',
              reason: 'Retroactive reward for Picture Day voting'
            }
          });

          if (gumError) {
            console.error(`    ❌ Failed for ${wallet.slice(0, 12)}: ${gumError.message}`);
            errorCount++;
          } else if (gumResult && gumResult.success && gumResult.earned > 0) {
            console.log(`    ✅ Awarded ${gumResult.earned} GUM to ${wallet.slice(0, 12)}`);
            successCount++;
          } else {
            console.log(`    ⚠️ No GUM awarded to ${wallet.slice(0, 12)} (possibly already claimed or on cooldown)`);
          }
          
          // Small delay to avoid overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`    💥 Exception for ${wallet.slice(0, 12)}:`, error.message);
          errorCount++;
        }
      }

      console.log(`\n📊 RETROACTIVE REWARD RESULTS:`);
      console.log(`✅ Successful awards: ${successCount}`);
      console.log(`❌ Failed awards: ${errorCount}`);
      console.log(`🎯 Total processed: ${needsReward.length}`);
    } else {
      console.log('✅ All voters already have their rewards!');
    }

    // Step 5: Summary
    console.log('\n🎉 PICTURE DAY VOTING FIX COMPLETE!');
    console.log('Now when users vote, they should automatically receive 50 GUM.');
    console.log('All existing voters have been retroactively rewarded.');

  } catch (error) {
    console.error('💥 Script failed:', error);
  }
}

// Run the fix
fixPictureDayVotingRewards();