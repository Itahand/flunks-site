/**
 * Check if eligible users have Chapter5 collections set up
 * 
 * Usage: node admin-scripts/check-chapter5-collections-ready.js
 */

require('dotenv').config({ path: '.env.local' });
const fcl = require('@onflow/fcl');

// Configure FCL for mainnet
fcl.config()
  .put('accessNode.api', 'https://rest-mainnet.onflow.org')
  .put('flow.network', 'mainnet');

const eligibleWallets = [
  // Excluding 0x92629c2a389dd8a8 (tinkerbell - test account)
  '0x4ab2327b5e1f3ca1', // roto_flow
  '0x6e5d12b1735caa83', // CityofDreams
  '0xc4ab4a06ade1fd0f'  // Flunkster
];

const CHECK_SCRIPT = `
import NonFungibleToken from 0x1d7e57aa55817448
import SemesterZero from 0xce9dd43888d99574

access(all) fun main(address: Address): Bool {
    let account = getAccount(address)
    
    // Try to borrow the Chapter5 collection capability
    let collectionCap = account
        .capabilities.get<&{NonFungibleToken.Receiver}>(SemesterZero.Chapter5CollectionPublicPath)
    
    // Check if capability is valid
    return collectionCap.check()
}
`;

async function checkCollections() {
  console.log('🔍 Checking if users have Chapter5 collections set up...\n');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const results = [];
  
  for (const wallet of eligibleWallets) {
    try {
      const hasCollection = await fcl.query({
        cadence: CHECK_SCRIPT,
        args: (arg, t) => [arg(wallet, t.Address)]
      });
      
      results.push({
        wallet,
        hasCollection,
        status: hasCollection ? '✅ Ready' : '❌ Needs Setup'
      });
      
      console.log(`${hasCollection ? '✅' : '❌'} ${wallet} - ${hasCollection ? 'Ready to receive NFT' : 'Needs collection setup'}`);
    } catch (error) {
      console.log(`⚠️  ${wallet} - Error checking: ${error.message}`);
      results.push({
        wallet,
        hasCollection: false,
        status: '⚠️  Error',
        error: error.message
      });
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════\n');
  
  const needsSetup = results.filter(r => !r.hasCollection);
  const ready = results.filter(r => r.hasCollection);
  
  console.log(`📊 Summary:`);
  console.log(`   ✅ Ready to receive: ${ready.length}`);
  console.log(`   ❌ Needs setup: ${needsSetup.length}\n`);
  
  if (needsSetup.length > 0) {
    console.log('⚠️  IMPORTANT: Users need to set up their Chapter5 collection first!');
    console.log('   They need to run: cadence/transactions/create-chapter5-collection.cdc\n');
    console.log('   Or you can set it up for them if you have admin access.\n');
  }
  
  if (ready.length > 0) {
    console.log('🚀 Ready to airdrop to:');
    ready.forEach(r => console.log(`   ${r.wallet}`));
    console.log('');
  }
  
  return results;
}

checkCollections()
  .then(() => {
    console.log('✅ Check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Check failed:', error);
    process.exit(1);
  });
