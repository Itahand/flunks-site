/**
 * Check NFT metadata on-chain for the test wallet
 */

const fcl = require('@onflow/fcl');

fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  'flow.network': 'mainnet'
});

async function checkNFTs() {
  const result = await fcl.query({
    cadence: `
      import SemesterZeroV3 from 0xce9dd43888d99574
      import MetadataViews from 0x1d7e57aa55817448
      
      access(all) fun main(address: Address): [{String: AnyStruct}] {
        let account = getAccount(address)
        
        let collectionRef = account.capabilities
          .borrow<&SemesterZeroV3.Collection>(/public/SemesterZeroV3Collection)
        
        if collectionRef == nil {
          return []
        }
        
        var results: [{String: AnyStruct}] = []
        
        for id in collectionRef!.getIDs() {
          let nft = collectionRef!.borrowSemesterZeroNFT(id: id)
          if nft != nil {
            results.append({
              "id": id,
              "evolutionTier": nft!.evolutionTier,
              "metadata": nft!.metadata
            })
          }
        }
        
        return results
      }
    `,
    args: (arg, t) => [arg('0xbfffec679fff3a94', t.Address)]
  });
  
  console.log('NFTs in wallet 0xbfffec679fff3a94:');
  console.log('='.repeat(60));
  
  result.forEach((nft, i) => {
    console.log(`\nNFT #${nft.id}:`);
    console.log(`  Tier: ${nft.evolutionTier}`);
    console.log(`  Metadata:`);
    for (const [key, value] of Object.entries(nft.metadata)) {
      console.log(`    ${key}: ${value}`);
    }
  });
}

checkNFTs();
