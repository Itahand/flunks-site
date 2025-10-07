// Script to investigate missing user profiles for Flunky Uppy scoreboard users
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function investigateMissingUsers() {
  console.log('🔍 Investigating missing user profiles for Flunky Uppy scoreboard...\n');

  // Get all unique wallets from Flunky Uppy scores
  const { data: scores, error: scoresError } = await supabase
    .from('flunky_uppy_scores')
    .select('wallet, score, metadata, timestamp')
    .order('score', { ascending: false });

  if (scoresError) {
    console.error('❌ Error fetching scores:', scoresError);
    return;
  }

  console.log(`📊 Total scores in database: ${scores.length}\n`);

  // Get unique wallets with their highest scores and metadata
  const walletMap = new Map();
  scores.forEach(score => {
    const existing = walletMap.get(score.wallet);
    if (!existing || score.score > existing.score) {
      walletMap.set(score.wallet, {
        wallet: score.wallet,
        highScore: score.score,
        metadata: score.metadata,
        timestamp: score.timestamp,
        username: score.metadata?.username || 'Unknown'
      });
    }
  });

  console.log(`👥 Unique wallets: ${walletMap.size}\n`);

  // Check which wallets have profiles
  const wallets = Array.from(walletMap.keys());
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('wallet_address, username, profile_icon, locker_number')
    .in('wallet_address', wallets);

  if (profilesError) {
    console.error('❌ Error fetching profiles:', profilesError);
    return;
  }

  const profileMap = new Map();
  profiles?.forEach(profile => {
    profileMap.set(profile.wallet_address, profile);
  });

  console.log(`✅ Profiles found: ${profiles?.length || 0}\n`);

  // Find wallets without profiles
  console.log('=' .repeat(80));
  console.log('🔍 DETAILED ANALYSIS:\n');

  const missingProfiles = [];
  let foundCount = 0;

  walletMap.forEach((scoreData, wallet) => {
    const profile = profileMap.get(wallet);
    
    if (!profile) {
      missingProfiles.push(scoreData);
      console.log(`❌ NO PROFILE FOUND:`);
      console.log(`   Wallet: ${wallet}`);
      console.log(`   High Score: ${scoreData.highScore}`);
      console.log(`   Username (from metadata): ${scoreData.username}`);
      console.log(`   Timestamp: ${new Date(scoreData.timestamp).toLocaleString()}`);
      console.log(`   Full metadata: ${JSON.stringify(scoreData.metadata, null, 2)}`);
      console.log('');
    } else {
      foundCount++;
      console.log(`✅ PROFILE FOUND:`);
      console.log(`   Wallet: ${wallet}`);
      console.log(`   Profile Username: ${profile.username}`);
      console.log(`   Profile Icon: ${profile.profile_icon}`);
      console.log(`   Locker Number: ${profile.locker_number || 'None'}`);
      console.log(`   High Score: ${scoreData.highScore}`);
      console.log('');
    }
  });

  console.log('=' .repeat(80));
  console.log('\n📊 SUMMARY:\n');
  console.log(`Total unique players: ${walletMap.size}`);
  console.log(`Players with profiles: ${foundCount}`);
  console.log(`Players WITHOUT profiles: ${missingProfiles.length}\n`);

  if (missingProfiles.length > 0) {
    console.log('🎯 MISSING PROFILES:\n');
    missingProfiles.forEach((data, index) => {
      console.log(`${index + 1}. "${data.username}" (${data.wallet.slice(0, 10)}...)`);
      console.log(`   Score: ${data.highScore}`);
    });
    console.log('\n');
    
    console.log('💡 POSSIBLE SOLUTIONS:\n');
    console.log('1. These users may have played before creating profiles');
    console.log('2. They might have used different wallet addresses');
    console.log('3. The usernames might be from the metadata field (not actual profiles)');
    console.log('4. You can create profiles for them manually or ask them to create profiles\n');
  }

  // Specific check for machine05 and sweet stu
  console.log('=' .repeat(80));
  console.log('\n🔎 SPECIFIC CHECK: "machine05" and "sweet stu"\n');

  const specificUsers = ['machine05', 'sweet stu'];
  specificUsers.forEach(targetUsername => {
    const found = Array.from(walletMap.values()).find(
      data => data.username?.toLowerCase() === targetUsername.toLowerCase()
    );

    if (found) {
      console.log(`✅ Found "${targetUsername}":`);
      console.log(`   Wallet: ${found.wallet}`);
      console.log(`   High Score: ${found.highScore}`);
      console.log(`   Has Profile: ${profileMap.has(found.wallet) ? 'YES' : 'NO'}`);
      if (profileMap.has(found.wallet)) {
        const profile = profileMap.get(found.wallet);
        console.log(`   Profile Username: ${profile.username}`);
        console.log(`   Profile Icon: ${profile.profile_icon}`);
      }
    } else {
      console.log(`❌ "${targetUsername}" not found in scores metadata`);
    }
    console.log('');
  });
}

investigateMissingUsers().catch(console.error);
