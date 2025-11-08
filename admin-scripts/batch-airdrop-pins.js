#!/usr/bin/env node

/**
 * Batch Airdrop Pins to Multiple Users
 * 
 * Usage:
 *   node admin-scripts/batch-airdrop-pins.js
 * 
 * Edit the `recipients` array below to specify who gets which pins
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Define your airdrop recipients
const recipients = [
  {
    address: '0x4ab2327b5e1f3ca1',
    location: 'Paradise Motel',
    name: 'Paradise Motel Pin',
    description: 'Collectible pin commemorating your visit to Paradise Motel during Semester Zero. Orange and blue retro vibes.',
    rarity: 'uncommon',
    image: 'https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png'
  },
  {
    address: '0x6e5d12b1735caa83',
    location: 'Paradise Motel',
    name: 'Paradise Motel Pin',
    description: 'Collectible pin commemorating your visit to Paradise Motel during Semester Zero. Orange and blue retro vibes.',
    rarity: 'uncommon',
    image: 'https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png'
  },
  {
    address: '0xc4ab4a06ade1fd0f',
    location: 'Paradise Motel',
    name: 'Paradise Motel Pin',
    description: 'Collectible pin commemorating your visit to Paradise Motel during Semester Zero. Orange and blue retro vibes.',
    rarity: 'uncommon',
    image: 'https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png'
  }
];

async function airdropPin(recipient) {
  console.log(`\n🎯 Airdropping Pin to ${recipient.address}...`);
  console.log(`   Location: ${recipient.location}`);
  console.log(`   Rarity: ${recipient.rarity}`);
  
  const command = `flow transactions send ./cadence/transactions/airdrop-pin.cdc \\
    "${recipient.address}" \\
    "${recipient.location}" \\
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
  console.log('🎨 Batch Airdrop - Pins');
  console.log('======================');
  console.log(`\nTotal recipients: ${recipients.length}`);
  console.log('\nStarting airdrops...\n');
  
  const results = [];
  
  // Process one at a time to avoid overwhelming the network
  for (const recipient of recipients) {
    const result = await airdropPin(recipient);
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
