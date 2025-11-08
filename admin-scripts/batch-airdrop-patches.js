#!/usr/bin/env node

/**
 * Batch Airdrop Patches to Multiple Users
 * 
 * Usage:
 *   node admin-scripts/batch-airdrop-patches.js
 * 
 * Edit the `recipients` array below to specify who gets which patches
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Define your airdrop recipients
const recipients = [
  {
    address: '0x4ab2327b5e1f3ca1',
    location: 'Paradise Motel',
    achievement: 'Room 7 Explorer',
    name: 'Room 7 Explorer Patch',
    description: 'Awarded for discovering all secrets of Room 7 at Paradise Motel. You found the path through the chaos.',
    rarity: 'rare',
    image: 'https://storage.googleapis.com/flunks_public/images/room7-patch.png'
  },
  {
    address: '0x6e5d12b1735caa83',
    location: 'Paradise Motel',
    achievement: 'Room 7 Explorer',
    name: 'Room 7 Explorer Patch',
    description: 'Awarded for discovering all secrets of Room 7 at Paradise Motel. You found the path through the chaos.',
    rarity: 'rare',
    image: 'https://storage.googleapis.com/flunks_public/images/room7-patch.png'
  }
];

async function airdropPatch(recipient) {
  console.log(`\n🎯 Airdropping Patch to ${recipient.address}...`);
  console.log(`   Location: ${recipient.location}`);
  console.log(`   Achievement: ${recipient.achievement}`);
  console.log(`   Rarity: ${recipient.rarity}`);
  
  const command = `flow transactions send ./cadence/transactions/airdrop-patch.cdc \\
    "${recipient.address}" \\
    "${recipient.location}" \\
    "${recipient.achievement}" \\
    "${recipient.name}" \\
    "${recipient.description}" \\
    "${recipient.rarity}" \\
    "${recipient.image}" \\
    --network mainnet \\
    --signer flunks-admin`;
  
  try {
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr && !stderr.includes('Transaction ID')) {
      console.log(`   ❌ Error: ${stderr}`);
      return { success: false, address: recipient.address, error: stderr };
    }
    
    console.log(`   ✅ Success!`);
    return { success: true, address: recipient.address };
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return { success: false, address: recipient.address, error: error.message };
  }
}

async function main() {
  console.log('🏆 Batch Airdrop - Patches');
  console.log('=========================');
  console.log(`\nTotal recipients: ${recipients.length}`);
  console.log('\nStarting airdrops...\n');
  
  const results = [];
  
  // Process one at a time to avoid overwhelming the network
  for (const recipient of recipients) {
    const result = await airdropPatch(recipient);
    results.push(result);
    
    // Wait 2 seconds between airdrops
    if (recipients.indexOf(recipient) < recipients.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Summary
  console.log('\n\n📊 Airdrop Summary');
  console.log('==================');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed addresses:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.address}: ${r.error}`);
    });
  }
  
  console.log('\n🎉 Batch airdrop complete!');
  console.log('\nView on Flowty:');
  console.log('https://flowty.io/collection/0xce9dd43888d99574/SemesterZero');
}

main().catch(console.error);
