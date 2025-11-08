/**
 * Award Room 7 night visits to users who obtained keys but weren't tracked
 * This fixes the ParadiseMotelMainSimple bug where visits weren't recorded
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findAffectedUsers() {
  console.log('🔍 Finding users with Room 7 keys but no visit records...\n');

  // Get all key holders
  const { data: keyHolders, error: keyError } = await supabase
    .from('paradise_motel_room7_keys')
    .select('*')
    .order('obtained_at', { ascending: false });

  if (keyError) {
    console.error('❌ Error fetching key holders:', keyError);
    return [];
  }

  console.log(`📋 Found ${keyHolders.length} total key holders\n`);

  // Check which ones have visit records
  const affected = [];
  const alreadyRecorded = [];

  for (const key of keyHolders) {
    const { data: visit, error: visitError } = await supabase
      .from('paradise_motel_room7_visits')
      .select('*')
      .eq('wallet_address', key.wallet_address)
      .single();

    if (visitError && visitError.code === 'PGRST116') {
      // No visit record found - this user is affected
      affected.push(key);
      console.log(`❌ ${key.wallet_address} - Key obtained ${key.obtained_at} (${key.method}) - NO VISIT RECORD`);
    } else if (visit) {
      alreadyRecorded.push({ key, visit });
      console.log(`✅ ${key.wallet_address} - Visit recorded ${visit.visit_timestamp}`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Affected users (need award): ${affected.length}`);
  console.log(`   Already properly credited: ${alreadyRecorded.length}`);
  console.log(`   Total key holders: ${keyHolders.length}`);

  return affected;
}

async function awardVisits(affectedUsers, dryRun = true) {
  if (affectedUsers.length === 0) {
    console.log('\n✅ No users need to be awarded visits!');
    return;
  }

  console.log(`\n${dryRun ? '🔍 DRY RUN - ' : '💾 '}Awarding Room 7 visits to ${affectedUsers.length} users...\n`);

  const results = {
    success: [],
    failed: [],
  };

  for (const key of affectedUsers) {
    if (dryRun) {
      console.log(`   Would award visit to: ${key.wallet_address}`);
      results.success.push(key.wallet_address);
      continue;
    }

    // Award the visit
    const { data, error } = await supabase
      .from('paradise_motel_room7_visits')
      .insert({
        wallet_address: key.wallet_address,
        visit_timestamp: key.obtained_at, // Use when they got the key as visit time
        awarded_via_script: true,
        script_reason: 'ParadiseMotelMainSimple bug fix - awarded retroactively',
      })
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Failed to award ${key.wallet_address}:`, error.message);
      results.failed.push({ wallet: key.wallet_address, error: error.message });
    } else {
      console.log(`   ✅ Awarded visit to ${key.wallet_address}`);
      results.success.push(key.wallet_address);
    }
  }

  console.log('\n📊 Award Results:');
  console.log(`   ✅ Successful: ${results.success.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Awards:');
    results.failed.forEach(f => console.log(`   ${f.wallet}: ${f.error}`));
  }

  return results;
}

async function main() {
  console.log('🔧 Room 7 Visit Award Script');
  console.log('=====================================\n');

  // First, find affected users
  const affectedUsers = await findAffectedUsers();

  if (affectedUsers.length === 0) {
    return;
  }

  // Check if we should run in dry-run mode
  const isDryRun = !process.argv.includes('--execute');

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN MODE - No changes will be made');
    console.log('   Run with --execute flag to actually award visits\n');
  } else {
    console.log('\n⚠️  EXECUTE MODE - Changes will be saved to database!\n');
  }

  // Award visits
  await awardVisits(affectedUsers, isDryRun);

  if (isDryRun) {
    console.log('\n💡 To execute these changes, run:');
    console.log('   node admin-scripts/award-room7-visits.js --execute');
  } else {
    console.log('\n✅ Script complete! All affected users have been awarded Room 7 visits.');
  }
}

main().catch(console.error);
