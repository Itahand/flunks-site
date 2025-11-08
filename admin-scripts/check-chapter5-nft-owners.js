import * as fcl from '@onflow/fcl';

// Configure FCL for mainnet
fcl.config()
  .put('accessNode.api', 'https://rest-mainnet.onflow.org')
  .put('flow.network', 'mainnet');

const checkScript = `
import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

access(all) fun main(): {Address: [UInt64]} {
    let owners: {Address: [UInt64]} = {}
    
    // Get all accounts that have the collection (we'll check known addresses)
    // Since we can't query all addresses, we'll check the admin account and test accounts
    
    let addresses: [Address] = [
        0x807c3d470888cc48, // Admin/main account
        0x92629c2a389dd8a8, // tinkerbell
        0x4ab2327b5e1f3ca1, // roto_flow
        0x6e5d12b1735caa83, // CityofDreams
        0xc4ab4a06ade1fd0f  // Flunkster
    ]
    
    for address in addresses {
        let account = getAccount(address)
        
        // Try to borrow the collection
        if let collectionRef = account.capabilities
            .get<&{NonFungibleToken.CollectionPublic}>(SemesterZero.Chapter5CollectionPublicPath)
            .borrow() {
            
            let ids = collectionRef.getIDs()
            if ids.length > 0 {
                owners[address] = ids
            }
        }
    }
    
    return owners
}
`;

async function checkChapter5NFTOwners() {
  console.log('🔍 Checking who owns the 2 minted Chapter5 NFTs...\n');
  
  try {
    const result = await fcl.query({
      cadence: checkScript
    });
    
    console.log('═══════════════════════════════════════════════════════\n');
    
    if (Object.keys(result).length === 0) {
      console.log('❌ No NFTs found in checked addresses');
    } else {
      for (const [address, nftIds] of Object.entries(result)) {
        console.log(`✅ ${address}`);
        console.log(`   NFT IDs: ${nftIds.join(', ')}`);
        console.log(`   Count: ${nftIds.length}\n`);
      }
    }
    
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('✅ Check complete');
    
  } catch (error) {
    console.error('❌ Error checking NFT owners:', error);
  }
  
  process.exit(0);
}

checkChapter5NFTOwners();
