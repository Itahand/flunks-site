// Debug script for specific wallet: 0x6e5d12b1735caa83
const fcl = require('@onflow/fcl');

// Configure FCL
fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org"
});

async function debugWallet() {
  const walletAddress = '0x6e5d12b1735caa83';
  
  console.log('🔍 Debugging wallet:', walletAddress);
  console.log('='.repeat(50));

  try {
    // Check Flunks NFTs using the HybridCustodyHelper
    const nftScript = `
      import HybridCustodyHelper from 0x807c3d470888cc48

      access(all) fun main(address: Address): {String: [UInt64]} {
        let flunksTokenIds = HybridCustodyHelper.getFlunksTokenIDsFromAllLinkedAccounts(ownerAddress: address)
        let backpackTokenIds = HybridCustodyHelper.getBackpackTokenIDsFromAllLinkedAccounts(ownerAddress: address)

        return {
          "flunks": flunksTokenIds,
          "backpack": backpackTokenIds
        }
      }
    `;

    console.log('📡 Querying Flow blockchain...');
    const result = await fcl.send([
      fcl.script(nftScript),
      fcl.args([fcl.arg(walletAddress, fcl.t.Address)])
    ]).then(fcl.decode);

    const flunksCount = result?.flunks?.length || 0;
    const backpacksCount = result?.backpack?.length || 0;

    console.log('🎒 NFT Results:');
    console.log('  • Flunks Count:', flunksCount);
    console.log('  • Backpacks Count:', backpacksCount);
    
    if (flunksCount > 0) {
      console.log('  • Flunks Token IDs:', result.flunks);
    }
    
    if (backpacksCount > 0) {
      console.log('  • Backpack Token IDs:', result.backpack);
    }

    // Test older direct collection queries too
    console.log('\n🔍 Testing direct Flunks collection query...');
    const directScript = `
      import NonFungibleToken from 0x1d7e57aa55817448
      import Flunks from 0x807c3d470888cc48

      access(all) fun main(address: Address): [UInt64] {
        let account = getAccount(address)
        let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(Flunks.CollectionPublicPath)
          .borrow() ?? panic("Could not borrow capability from public collection")
        
        return collectionRef.getIDs()
      }
    `;

    try {
      const directResult = await fcl.send([
        fcl.script(directScript),
        fcl.args([fcl.arg(walletAddress, fcl.t.Address)])
      ]).then(fcl.decode);

      console.log('  • Direct collection NFTs:', directResult?.length || 0);
      if (directResult && directResult.length > 0) {
        console.log('  • Direct Token IDs:', directResult);
      }
    } catch (directError) {
      console.log('  ⚠️ Direct collection query failed (may not have collection initialized)');
    }

    console.log('\n📱 Mobile Debugging Recommendations:');
    if (flunksCount === 0) {
      console.log('  ❌ No Flunks found for this wallet');
      console.log('  • Wallet may not own any Flunks NFTs');
      console.log('  • Check if this is the correct wallet address');
      console.log('  • Verify on FlowScan: https://flowscan.org/account/' + walletAddress);
    } else {
      console.log('  ✅ Wallet owns', flunksCount, 'Flunks!');
      console.log('  • Issue is likely in mobile app data loading');
      console.log('  • Try refreshing the page');
      console.log('  • Check mobile network connectivity');
      console.log('  • Clear browser cache/storage');
    }

  } catch (error) {
    console.error('❌ Error querying blockchain:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('  • Check internet connection');
    console.log('  • Verify Flow network is accessible');
    console.log('  • Try again in a few moments');
  }
}

debugWallet().catch(console.error);