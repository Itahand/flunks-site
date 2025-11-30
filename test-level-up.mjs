import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org'
});

const walletAddress = '0xbfffec679fff3a94';
const nftId = 0;

async function testQuery() {
  console.log('Testing NFT query...');
  
  const result = await fcl.query({
    cadence: `
      import SemesterZeroV3 from 0xce9dd43888d99574
      
      access(all) fun main(address: Address, nftId: UInt64): {String: String}? {
        let account = getAccount(address)
        
        let collectionRef = account.capabilities
          .borrow<&SemesterZeroV3.Collection>(/public/SemesterZeroV3Collection)
        
        if collectionRef == nil {
          return nil
        }
        
        let nft = collectionRef!.borrowSemesterZeroNFT(id: nftId)
        if nft == nil {
          return nil
        }
        
        var result: {String: String} = {}
        for key in nft!.metadata.keys {
          result[key] = nft!.metadata[key]!
        }
        result["serialNumber"] = nft!.serialNumber.toString()
        result["evolutionTier"] = nft!.evolutionTier
        return result
      }
    `,
    args: (arg, t) => [
      arg(walletAddress, t.Address),
      arg(nftId.toString(), t.UInt64)
    ]
  });
  
  console.log('NFT Data:', JSON.stringify(result, null, 2));
  return result;
}

testQuery().catch(console.error);
