// Test NFT detection - check if HybridCustodyHelper is working
const fcl = require("@onflow/fcl");

fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "flow.network": "mainnet"
});

const CODE = `import HybridCustodyHelper from 0x807c3d470888cc48

access(all) fun main(address: Address): {String: [UInt64]} {
    let flunksTokenIds = HybridCustodyHelper.getFlunksTokenIDsFromAllLinkedAccounts(ownerAddress: address)
    let backpackTokenIds = HybridCustodyHelper.getBackpackTokenIDsFromAllLinkedAccounts(ownerAddress: address)

    return {
        "flunks": flunksTokenIds,
        "backpack": backpackTokenIds
    }
}`;

async function testNFTDetection() {
  const testWallet = '0x6e5d12b1735caa83'; // Known wallet with NFTs
  
  console.log('🔍 Testing NFT detection for wallet:', testWallet);
  console.log('📡 Network:', fcl.config.get('flow.network'));
  console.log('🌐 Access Node:', fcl.config.get('accessNode.api'));
  console.log('');
  
  try {
    const result = await fcl.query({
      cadence: CODE,
      args: (arg, t) => [arg(testWallet, t.Address)]
    });
    
    console.log('✅ SUCCESS! NFT data retrieved:');
    console.log('   Flunks:', result.flunks?.length || 0, 'NFTs');
    console.log('   Backpack:', result.backpack?.length || 0, 'NFTs');
    console.log('');
    console.log('Raw result:', JSON.stringify(result, null, 2));
    
    if (result.flunks?.length > 0) {
      console.log('\n✅ Flunks NFTs ARE being detected!');
      console.log('   Problem is likely in the frontend React context or state management');
    } else {
      console.log('\n❌ NO Flunks NFTs detected');
      console.log('   Problem is either:');
      console.log('   1. Contract issue at 0x807c3d470888cc48');
      console.log('   2. Wallet has no NFTs');
      console.log('   3. Network configuration issue');
    }
    
  } catch (error) {
    console.error('❌ ERROR querying blockchain:');
    console.error(error);
    console.log('\nPossible issues:');
    console.log('1. HybridCustodyHelper contract not deployed or moved');
    console.log('2. Network connection issue');
    console.log('3. Invalid contract address');
  }
}

testNFTDetection();
