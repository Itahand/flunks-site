#!/usr/bin/env node
/**
 * Check Chapter 5 NFT Airdrop Eligibility
 * 
 * Shows which users have earned:
 * - Slacker NFT: Visited Paradise Motel Room 7 at night
 * - Overachiever NFT: Completed Hidden Riff guitar game
 * - Both NFTs: Completed both objectives
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suxpammgskmikasojebh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkChapter5Eligibility() {
  console.log('🏨 CHAPTER 5 NFT AIRDROP ELIGIBILITY CHECK\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Check Slacker completion (Room 7 night visits)
    console.log('\n📊 SLACKER OBJECTIVE (Paradise Motel Room 7 Night Visit)\n');
    
    const { data: slackerData, error: slackerError } = await supabase
      .from('paradise_motel_room7_visits')
      .select('wallet_address, visit_timestamp')
      .order('visit_timestamp', { ascending: false });
    
    if (slackerError) throw slackerError;
    
    const uniqueSlackers = [...new Set(slackerData?.map(s => s.wallet_address) || [])];
    
    console.log(`Total Slacker Completions: ${uniqueSlackers.length} users\n`);
    
    if (slackerData && slackerData.length > 0) {
      console.log('Eligible Users:');
      
      // Get usernames for slackers
      const { data: slackerProfiles } = await supabase
        .from('user_profiles')
        .select('wallet_address, username')
        .in('wallet_address', uniqueSlackers);
      
      const slackerUsernameMap = new Map(slackerProfiles?.map(p => [p.wallet_address, p.username]) || []);
      
      const seen = new Set();
      slackerData.forEach((record) => {
        if (!seen.has(record.wallet_address)) {
          seen.add(record.wallet_address);
          const username = slackerUsernameMap.get(record.wallet_address) || 'Unknown';
          const date = new Date(record.visit_timestamp).toLocaleString();
          console.log(`  ✅ ${record.wallet_address} (${username}) - ${date}`);
        }
      });
    } else {
      console.log('  No users have completed Slacker objective yet.');
    }
    
    // 2. Check Overachiever completion (Hidden Riff)
    console.log('\n' + '='.repeat(60));
    console.log('\n🎸 OVERACHIEVER OBJECTIVE (Hidden Riff Guitar Game)\n');
    
    const { data: overachieverData, error: overachieverError } = await supabase
      .from('gum_transactions')
      .select('wallet_address, created_at')
      .eq('source', 'hidden_riff')
      .order('created_at', { ascending: false });
    
    if (overachieverError) throw overachieverError;
    
    const uniqueOverachievers = [...new Set(overachieverData?.map(o => o.wallet_address) || [])];
    
    console.log(`Total Overachiever Completions: ${uniqueOverachievers.length} users\n`);
    
    if (overachieverData && overachieverData.length > 0) {
      console.log('Eligible Users:');
      
      // Get usernames for overachievers
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('wallet_address, username')
        .in('wallet_address', uniqueOverachievers);
      
      const usernameMap = new Map(profiles?.map(p => [p.wallet_address, p.username]) || []);
      
      const seen = new Set();
      overachieverData.forEach((record) => {
        if (!seen.has(record.wallet_address)) {
          seen.add(record.wallet_address);
          const username = usernameMap.get(record.wallet_address) || 'Unknown';
          const date = new Date(record.created_at).toLocaleString();
          console.log(`  ✅ ${record.wallet_address} (${username}) - ${date}`);
        }
      });
    } else {
      console.log('  No users have completed Overachiever objective yet.');
    }
    
    // 3. Check Full Completion (Both objectives)
    console.log('\n' + '='.repeat(60));
    console.log('\n🏆 FULL COMPLETION (Eligible for BOTH NFTs)\n');
    
    const fullCompletion = uniqueSlackers.filter(addr => uniqueOverachievers.includes(addr));
    
    console.log(`Total Full Completions: ${fullCompletion.length} users\n`);
    
    if (fullCompletion.length > 0) {
      console.log('Eligible for BOTH NFTs:');
      
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('wallet_address, username')
        .in('wallet_address', fullCompletion);
      
      const usernameMap = new Map(profiles?.map(p => [p.wallet_address, p.username]) || []);
      
      fullCompletion.forEach(addr => {
        const username = usernameMap.get(addr) || 'Unknown';
        console.log(`  🎉 ${addr} (${username})`);
      });
    } else {
      console.log('  No users have completed both objectives yet.');
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📈 SUMMARY\n');
    console.log(`Slacker Only:        ${uniqueSlackers.length - fullCompletion.length} users`);
    console.log(`Overachiever Only:   ${uniqueOverachievers.length - fullCompletion.length} users`);
    console.log(`Full Completion:     ${fullCompletion.length} users`);
    console.log(`Total Eligible:      ${uniqueSlackers.length + uniqueOverachievers.length - fullCompletion.length} users`);
    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error checking eligibility:', error);
    process.exit(1);
  }
}

checkChapter5Eligibility();
