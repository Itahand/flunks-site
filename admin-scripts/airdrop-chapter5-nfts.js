/**
 * Airdrop Chapter 5 NFTs to eligible users
 * NFTs will appear on Flowty under FlunksSemesterZero collection
 * 
 * Usage: node admin-scripts/airdrop-chapter5-nfts.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findEligibleUsers() {
  console.log('🔍 Finding users eligible for Chapter 5 NFT airdrop...\n');
  
  // Query users who completed BOTH:
  // 1. Slacker: Visited Room 7 at night (paradise_motel_room7_visits)
  // 2. Overachiever: Completed Hidden Riff (gum_transactions with source='hidden_riff')
  
  console.log('Step 1: Getting Room 7 night visitors (Slacker)...');
  const { data: eligibleData, error: queryError } = await supabase
    .from('paradise_motel_room7_visits')
    .select(`
      wallet_address,
      visit_timestamp
    `);
  
  if (queryError) {
    console.error('❌ Error fetching Room 7 visits:', queryError);
    return [];
  }
  
  console.log(`   Found ${eligibleData.length} users who visited Room 7 at night\n`);
  
  // Now check which of these users also completed Hidden Riff
  const walletAddresses = eligibleData.map(u => u.wallet_address);
  
  if (walletAddresses.length === 0) {
    console.log('ℹ️  No Room 7 visitors found');
    return [];
  }
  
  console.log('Step 2: Checking Hidden Riff completions (Overachiever)...');
  const { data: overachieverData, error: overachieverError } = await supabase
    .from('gum_transactions')
    .select('wallet_address, created_at')
    .eq('source', 'hidden_riff')
    .in('wallet_address', walletAddresses);
  
  if (overachieverError) {
    console.error('❌ Error fetching Hidden Riff completions:', overachieverError);
    return [];
  }
  
  console.log(`   Found ${overachieverData.length} users who completed Hidden Riff\n`);
  
  // Find users who completed BOTH
  const overachieverWallets = new Set(overachieverData.map(u => u.wallet_address));
  const eligible = eligibleData
    .filter(u => overachieverWallets.has(u.wallet_address))
    .map(u => ({
      wallet_address: u.wallet_address,
      slacker_completion_date: u.visit_timestamp,
      overachiever_completion_date: overachieverData.find(o => o.wallet_address === u.wallet_address)?.created_at
    }));
  
  console.log(`✅ Found ${eligible.length} users eligible for Chapter 5 NFT!\n`);
  return eligible;
}

async function airdropToUsers() {
  const eligibleUsers = await findEligibleUsers();
  
  if (eligibleUsers.length === 0) {
    console.log('ℹ️  No eligible users found for airdrop');
    return;
  }
  
  console.log('📋 Eligible Users:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  eligibleUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.wallet_address}`);
    console.log(`   Slacker completed: ${user.slacker_completion_date}`);
    console.log(`   Overachiever completed: ${user.overachiever_completion_date}`);
    console.log('');
  });
  
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('🎯 NEXT STEPS:');
  console.log('');
  console.log('1. Review the list of eligible users above');
  console.log('');
  console.log('2. Run the following Flow CLI commands to airdrop:');
  console.log('');
  
  eligibleUsers.forEach((user) => {
    console.log(`flow transactions send ./cadence/transactions/airdrop-chapter5-nft.cdc ${user.wallet_address} --network mainnet --signer flunks-admin`);
  });
  
  console.log('');
  console.log('3. After successful airdrops, mark them in the database:');
  console.log('');
  console.log('   UPDATE chapter5_completions SET nft_airdropped = true WHERE wallet_address IN (');
  eligibleUsers.forEach((user, index) => {
    const comma = index < eligibleUsers.length - 1 ? ',' : '';
    console.log(`     '${user.wallet_address}'${comma}`);
  });
  console.log('   );');
  console.log('');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📍 The NFTs will appear on Flowty at:');
  console.log('https://www.flowty.io/collection/0xce9dd43888d99574/FlunksSemesterZero');
  console.log('');
}

airdropToUsers()
  .then(() => {
    console.log('✅ Script complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
